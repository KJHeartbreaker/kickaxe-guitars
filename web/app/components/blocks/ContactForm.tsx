import {stegaClean} from 'next-sanity'

import ContactFormFields from '@/app/components/blocks/ContactFormFields'
import PortableText from '@/app/components/PortableText'
import {telHref} from '@/app/components/shop'
import type {Block} from '@/sanity/lib/types'

/**
 * Contact Form block: heading, intro and (optionally) the shop phone and email
 * on the left, the form on the right.
 */
export default function ContactForm({block}: {block: Block<'contactFormSection'>}) {
  const {phone, email} = block.shopInfo ?? {}
  const showDetails = block.showContactDetails !== false && (phone || email)

  return (
    <section className="border-t border-line">
      <div className="wrap flex flex-wrap gap-x-20 gap-y-10 py-20 lg:py-24">
        <div className="flex flex-[1_1_320px] flex-col gap-6">
          {block.heading && <h2 className="display-lg">{block.heading}</h2>}
          <PortableText value={block.intro} className="max-w-[30em]" />
          {showDetails && (
            <dl className="mt-2 max-w-[420px] border-t-2 border-bone font-mono text-[15px]">
              {phone && (
                <div className="flex justify-between gap-4 border-b border-line py-3.5">
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    <a href={telHref(stegaClean(phone))} className="hover:text-orange">
                      {phone}
                    </a>
                  </dd>
                </div>
              )}
              {email && (
                <div className="flex justify-between gap-4 border-b border-line py-3.5">
                  <dt className="text-muted">Email</dt>
                  <dd className="min-w-0 break-all text-right">
                    <a href={`mailto:${stegaClean(email)}`} className="hover:text-orange">
                      {email}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          )}
        </div>
        <div className="flex-[1.4_1_480px] bg-cab p-6 sm:p-8">
          <ContactFormFields
            submitLabel={block.submitLabel || 'Send message'}
            successMessage={block.successMessage || 'Thanks. We’ll get back to you soon.'}
          />
        </div>
      </div>
    </section>
  )
}
