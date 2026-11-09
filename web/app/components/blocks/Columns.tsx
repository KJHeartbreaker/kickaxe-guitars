import PortableText from '@/app/components/PortableText'
import type {Block} from '@/sanity/lib/types'

/**
 * Columns: a row of cards. Each column's first image becomes the card photo
 * and its headings become card titles, so editors build cards with ordinary
 * rich text (image, heading, a line or two).
 */
export default function Columns({block}: {block: Block<'columnsSection'>}) {
  const columns = block.columns ?? []
  if (!columns.length) return null

  return (
    <section className="wrap py-20 lg:py-24">
      {block.heading && <h2 className="display-lg mb-10">{block.heading}</h2>}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6">
        {columns.map((column) => (
          <article key={column._key} className="group overflow-hidden bg-cab p-5 sm:p-6">
            <PortableText value={column.content} tone="card" />
          </article>
        ))}
      </div>
    </section>
  )
}
