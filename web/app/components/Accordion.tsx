import PortableText from '@/app/components/PortableText'
import type {Surface} from '@/app/components/Button'

export type AccordionItem = {_key: string; title?: string; content?: unknown[] | null}

/**
 * Accordion: items that open to show more text. Native <details>, so it works
 * without JavaScript and with the keyboard. The items share a `name`, which
 * makes them an exclusive group: opening one closes the others. The open and
 * close animation lives in globals.css (details.accordion).
 */
export default function Accordion({
  items,
  groupKey,
  firstOpen = true,
  light,
  surface,
}: {
  items: AccordionItem[]
  groupKey: string
  firstOpen?: boolean
  light: boolean
  surface?: Surface
}) {
  if (!items.length) return null
  return (
    <div className={`border-t-2 ${light ? 'border-ink' : 'border-bone'}`}>
      {items.map((item, i) => (
        <details
          key={item._key}
          name={`accordion-${groupKey}`}
          open={firstOpen && i === 0}
          className={`accordion group border-b ${light ? 'border-rule' : 'border-line'}`}
        >
          <summary
            className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[26px] leading-tight font-extrabold uppercase sm:text-[30px] ${light ? 'text-ink' : 'text-bone'}`}
          >
            <span>{item.title}</span>
            <span aria-hidden="true" className="accordion-icon" />
          </summary>
          <div className="accordion-panel">
            <PortableText
              value={item.content}
              tone={light ? 'light' : 'dark'}
              surface={surface}
              className="max-w-[40em] pb-6 text-base"
            />
          </div>
        </details>
      ))}
    </div>
  )
}
