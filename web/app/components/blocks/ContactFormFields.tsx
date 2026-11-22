'use client'

import Script from 'next/script'
import {startTransition, useActionState, useState} from 'react'

import {submitContactForm, type ContactFormState} from '@/app/actions'

/** reCAPTCHA v3 (invisible). Off when the site key isn't set, e.g. in local development. */
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void
      execute(siteKey: string, options: {action: string}): Promise<string>
    }
  }
}

function getRecaptchaToken(siteKey: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const grecaptcha = window.grecaptcha
    if (!grecaptcha) return reject(new Error('reCAPTCHA has not loaded'))
    grecaptcha.ready(() => grecaptcha.execute(siteKey, {action: 'contact'}).then(resolve, reject))
  })
}

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

  const [checking, setChecking] = useState(false)
  const [clientError, setClientError] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (!recaptchaSiteKey) return // no reCAPTCHA configured: let the form submit normally
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setClientError('')
    setChecking(true)
    try {
      data.set('recaptchaToken', await getRecaptchaToken(recaptchaSiteKey))
    } catch {
      setClientError('Sorry, we couldn’t check that you’re not a robot. Please reload the page or call the shop.')
      setChecking(false)
      return
    }
    setChecking(false)
    startTransition(() => action(data))
  }

  if (state.status === 'success') {
    return (
      <p role="status" className="font-display text-3xl font-extrabold uppercase">
        {successMessage}
      </p>
    )
  }

  const error = (name: string) => state.status === 'error' && state.fieldErrors?.[name]
  const typed = state.status === 'error' ? (state.values ?? {}) : {}

  return (
    <>
    {recaptchaSiteKey && (
      <Script src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} />
    )}
    <form action={action} onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-name" className={labelClass}>
          Name
        </label>
        <input id="cf-name" name="name" defaultValue={typed.name} autoComplete="name" required maxLength={100} className={fieldClass} />
        {error('name') && <p className="text-sm text-orange">{error('name')}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="cf-phone" className={labelClass}>
          Phone <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input id="cf-phone" name="phone" defaultValue={typed.phone} type="tel" autoComplete="tel" maxLength={40} className={fieldClass} />
        {error('phone') && <p className="text-sm text-orange">{error('phone')}</p>}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="cf-email" className={labelClass}>
          Email
        </label>
        <input id="cf-email" name="email" defaultValue={typed.email} type="email" autoComplete="email" required maxLength={200} className={fieldClass} />
        {error('email') && <p className="text-sm text-orange">{error('email')}</p>}
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea id="cf-message" name="message" defaultValue={typed.message} rows={5} required maxLength={5000} className={fieldClass} />
        {error('message') && <p className="text-sm text-orange">{error('message')}</p>}
      </div>
      {/* Honeypot: hidden from people, often filled in by bots. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="cf-company">Company</label>
        <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={pending || checking} className="btn-primary disabled:opacity-60">
          {pending || checking ? 'Sending…' : submitLabel} {!(pending || checking) && <span aria-hidden="true">→</span>}
        </button>
        {(clientError || (state.status === 'error' && state.message)) && (
          <p role="alert" className="text-sm text-orange">
            {clientError || (state.status === 'error' ? state.message : '')}
          </p>
        )}
        {recaptchaSiteKey && (
          <p className="w-full text-xs text-muted">
            Protected by reCAPTCHA. Google’s{' '}
            <a href="https://policies.google.com/privacy" className="underline">Privacy Policy</a> and{' '}
            <a href="https://policies.google.com/terms" className="underline">Terms of Service</a> apply.
          </p>
        )}
      </div>
    </form>
    </>
  )
}
