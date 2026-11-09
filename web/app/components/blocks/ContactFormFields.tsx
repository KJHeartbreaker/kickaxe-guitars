'use client'

import {useActionState} from 'react'

import {submitContactForm, type ContactFormState} from '@/app/actions'

const fieldClass =
  'min-h-12 w-full border border-line bg-ink px-4 py-3 text-bone placeholder:text-muted focus:border-orange focus:outline-none'
const labelClass = 'font-mono text-xs tracking-[0.12em] uppercase text-muted'

export default function ContactFormFields({
  submitLabel,
  successMessage,
}: {
  submitLabel: string
  successMessage: string
}) {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(submitContactForm, {
    status: 'idle',
  })

  if (state.status === 'success') {
    return (
      <p role="status" className="font-display text-3xl font-extrabold uppercase">
        {successMessage}
      </p>
    )
  }

  const error = (name: string) => state.status === 'error' && state.fieldErrors?.[name]

  return (
    <form action={action} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-name" className={labelClass}>
          Name
        </label>
        <input id="cf-name" name="name" autoComplete="name" required className={fieldClass} />
        {error('name') && <p className="text-sm text-orange">{error('name')}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-phone" className={labelClass}>
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input id="cf-phone" name="phone" type="tel" autoComplete="tel" className={fieldClass} />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="cf-email" className={labelClass}>
          Email
        </label>
        <input id="cf-email" name="email" type="email" autoComplete="email" required className={fieldClass} />
        {error('email') && <p className="text-sm text-orange">{error('email')}</p>}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea id="cf-message" name="message" rows={5} required className={fieldClass} />
        {error('message') && <p className="text-sm text-orange">{error('message')}</p>}
      </div>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending} className="btn-primary disabled:opacity-60">
          {pending ? 'Sending…' : submitLabel}
        </button>
        {state.status === 'error' && state.message && (
          <p role="alert" className="text-sm text-orange">
            {state.message}
          </p>
        )}
      </div>
    </form>
  )
}
