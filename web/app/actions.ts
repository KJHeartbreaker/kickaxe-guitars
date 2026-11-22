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

/** Minimum reCAPTCHA v3 score (0 = bot, 1 = human) to let a message through. */
const recaptchaMinScore = 0.5

/**
 * Checks the token the form got from reCAPTCHA v3. Only runs when
 * NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set; then RECAPTCHA_SECRET_KEY is required.
 */
async function passesRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    console.error('Contact form: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is set but RECAPTCHA_SECRET_KEY is not.')
    return false
  }
  if (!token) return false
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: new URLSearchParams({secret, response: token}),
      cache: 'no-store',
    })
    const result: {success?: boolean; score?: number; action?: string; 'error-codes'?: string[]} =
      await res.json()
    if (!result.success || result.action !== 'contact' || (result.score ?? 0) < recaptchaMinScore) {
      console.warn('Contact form: reCAPTCHA rejected a submission', {
        success: result.success,
        score: result.score,
        action: result.action,
        errors: result['error-codes'],
      })
      return false
    }
    return true
  } catch (error) {
    console.error('Contact form: reCAPTCHA check failed', error)
    return false
  }
}

/**
 * Contact form submission.
 *
 * Validates the fields, drops obvious bots (honeypot), then emails the message
 * to the shop through Resend. Reply goes straight to the sender.
 *
 * Env: RESEND_API_KEY (required to send), CONTACT_FORM_FROM (a sender on a
 * domain verified in Resend), CONTACT_FORM_TO (optional, see above), and
 * NEXT_PUBLIC_RECAPTCHA_SITE_KEY + RECAPTCHA_SECRET_KEY (optional spam check).
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

  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !(await passesRecaptcha(value('recaptchaToken')))) {
    return {
      status: 'error',
      message: 'Sorry, we couldn’t confirm you’re not a robot. Please call or email the shop.',
      values,
    }
  }

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
