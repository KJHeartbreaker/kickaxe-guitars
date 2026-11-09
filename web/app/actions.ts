'use server'

import {draftMode} from 'next/headers'

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
  | {status: 'error'; message?: string; fieldErrors?: Record<string, string>}

/**
 * Contact form submission.
 *
 * Validates the fields and drops obvious bots (honeypot). Email delivery is
 * not wired up yet: the old site sent mail through Gmail SMTP with reCAPTCHA,
 * and the new provider is still to be chosen. Until then submissions fail
 * with a message that points people to the phone and email instead.
 */
export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const value = (key: string) => String(formData.get(key) ?? '').trim()

  // Bots fill in the hidden field; pretend it worked.
  if (value('company')) return {status: 'success'}

  const fieldErrors: Record<string, string> = {}
  if (!value('name')) fieldErrors.name = 'Please add your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email'))) fieldErrors.email = 'Please add a valid email.'
  if (!value('message')) fieldErrors.message = 'Please add a message.'
  if (Object.keys(fieldErrors).length) return {status: 'error', fieldErrors}

  // TODO(contact): send the message once an email provider is chosen.
  return {
    status: 'error',
    message: 'Online messages aren’t switched on yet. Please call or email the shop.',
  }
}
