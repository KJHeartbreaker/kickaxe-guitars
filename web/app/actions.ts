'use server'

import {draftMode} from 'next/headers'
import {Resend} from 'resend'

import {client} from '@/sanity/lib/client'

export async function disableDraftMode() {
  'use server'
  await Promise.allSettled([
    (await draftMode()).disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ])
}

export type ContactFormState =
  | {status: 'idle'}
  | {status: 'success'}
  | {
      status: 'error'
      message?: string
      fieldErrors?: Record<string, string>
      /** What the person typed, so the form can put it back (React clears forms after an action). */
      values?: Record<string, string>
    }

/** Field lengths, matched by `maxLength` on the form inputs. */
const limits = {name: 100, email: 200, phone: 40, message: 5000} as const

/**
 * Where messages go: CONTACT_FORM_TO if set, otherwise the shop email in
 * Site Settings → Shop Info (so the shop can change it in the Studio).
 */
async function contactRecipient() {
  if (process.env.CONTACT_FORM_TO) return process.env.CONTACT_FORM_TO
  const email = await client
    .withConfig({useCdn: false, stega: false})
    .fetch<string | null>(`*[_type == "settings"][0].shopInfo.email`)
  return email || null
}

/**
 * Contact form submission.
 *
 * Validates the fields, drops obvious bots (honeypot), then emails the message
 * to the shop through Resend. Reply goes straight to the sender.
 *
 * Env: RESEND_API_KEY (required to send), CONTACT_FORM_FROM (a sender on a
 * domain verified in Resend), CONTACT_FORM_TO (optional, see above).
 */
export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const value = (key: string) => String(formData.get(key) ?? '').trim()

  // Bots fill in the hidden field; pretend it worked.
  if (value('company')) return {status: 'success'}

  const name = value('name').replace(/\s+/g, ' ')
  const email = value('email')
  const phone = value('phone')
  const message = value('message')

  const fieldErrors: Record<string, string> = {}
  if (!name) fieldErrors.name = 'Please add your name.'
  else if (name.length > limits.name) fieldErrors.name = 'That name is too long.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > limits.email)
    fieldErrors.email = 'Please add a valid email.'
  if (phone.length > limits.phone) fieldErrors.phone = 'That phone number is too long.'
  if (!message) fieldErrors.message = 'Please add a message.'
  else if (message.length > limits.message) fieldErrors.message = 'Please shorten your message.'
  const values = {name: value('name'), email, phone, message}
  if (Object.keys(fieldErrors).length) return {status: 'error', fieldErrors, values}

  const fallback = 'Sorry, your message didn’t send. Please call or email the shop.'
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FORM_FROM
  const to = await contactRecipient().catch(() => null)
  if (!apiKey || !from || !to) {
    console.error('Contact form: RESEND_API_KEY, CONTACT_FORM_FROM or a recipient is missing.')
    return {status: 'error', message: fallback, values}
  }

  const {error} = await new Resend(apiKey).emails.send({
    from,
    to,
    replyTo: email,
    subject: `Website message from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      ...(phone ? [`Phone: ${phone}`] : []),
      '',
      message,
      '',
      '—',
      'Sent from the contact form on the Kickaxe Guitars website. Reply to answer.',
    ]
      .join('\n'),
  })

  if (error) {
    console.error('Contact form: Resend error', error)
    return {status: 'error', message: fallback, values}
  }
  return {status: 'success'}
}
