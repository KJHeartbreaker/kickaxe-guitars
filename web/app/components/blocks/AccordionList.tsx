import PortableText from '@/app/components/PortableText'
import type {Block} from '@/sanity/lib/types'

/**
 * Accordion List on the bone background: the heading on the left, the
 * questions on the right. Uses native <details> so it works without JS and
 * with the keyboard. The first item starts open, and only one item is open at a time.
 */
export default function AccordionList({block}: {block: Block<'accordionList'>}) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section className="bg-bone text-ink">
      <div className="wrap flex flex-wrap gap-x-20 gap-y-10 py-20 lg:py-24">
        {block.heading && (
          <div className="flex-[1_1_300px]">
            <h2 className="display-lg">{block.heading}</h2>
          </div>
        )}
        <div className="flex-[2_1_560px] border-t-2 border-ink">
          {items.map((item, i) => (
            <details
              key={item._key}
              // A shared name makes the items an exclusive group: opening one closes the others.
              name={`accordion-${block._key}`}
              open={i === 0}
              className="accordion group border-b border-rule"
            >
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[28px] leading-tight font-extrabold uppercase sm:text-[30px]">
                <span>{item.title}</span>
                <span aria-hidden="true" className="accordion-icon" />
              </summary>
              <div className="accordion-panel">
                <PortableText value={item.content} tone="light" className="max-w-[40em] pb-6" />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
