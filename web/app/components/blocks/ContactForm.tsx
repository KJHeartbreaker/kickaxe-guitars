import ContactFormFields from '@/app/components/blocks/ContactFormFields'
import PortableText from '@/app/components/PortableText'
import type {Block} from '@/sanity/lib/types'

/** Contact Form block: heading and intro on the left, the form on the right. */
export default function ContactForm({block}: {block: Block<'contactFormSection'>}) {
  return (
    <section className="border-t border-line">
      <div className="wrap flex flex-wrap gap-x-20 gap-y-10 py-20 lg:py-24">
        <div className="flex flex-[1_1_320px] flex-col gap-6">
          {block.heading && <h2 className="display-lg">{block.heading}</h2>}
          <PortableText value={block.intro} className="max-w-[30em]" />
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
