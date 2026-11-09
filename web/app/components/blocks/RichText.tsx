import {stegaClean} from 'next-sanity'
import PortableText from '@/app/components/PortableText'
import type {Block} from '@/sanity/lib/types'

const widths = {
  narrow: 'max-w-[40rem]',
  normal: 'max-w-[52rem]',
  wide: 'max-w-[72rem]',
  full: 'max-w-none',
} as const

/** Rich Text: a heading and Portable Text in a readable column. */
export default function RichText({block}: {block: Block<'richTextSection'>}) {
  const width = widths[stegaClean(block.maxWidth) ?? 'normal'] ?? widths.normal
  const centered = stegaClean(block.align) === 'center'

  return (
    <section className="wrap py-16 lg:py-20">
      <div className={`${width} ${centered ? 'mx-auto text-center' : ''}`}>
        {block.heading && <h2 className="display-lg mb-8">{block.heading}</h2>}
        <PortableText value={block.content} className="text-[18px]" />
      </div>
    </section>
  )
}
