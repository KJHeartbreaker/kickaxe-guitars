import {stegaClean} from 'next-sanity'
import Button from '@/app/components/Button'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

/**
 * Media & Text: a photo beside a heading, copy and an optional button.
 * The photo keeps its own proportions. On small screens the photo comes first.
 */
export default function MediaText({block}: {block: Block<'mediaText'>}) {
  const image = block.image?.asset?._ref ? block.image : null
  const imageRight = stegaClean(block.imagePosition) === 'right'

  return (
    <section className="border-t border-line">
      <div
        className={`wrap flex flex-col gap-10 py-18 md:items-center md:gap-16 lg:py-24 ${imageRight ? 'md:flex-row-reverse' : 'md:flex-row'}`}
      >
        {image && (
          <figure className="min-w-0 md:flex-1">
            <Image
              id={image.asset!._ref}
              alt={image.alt || ''}
              width={1000}
              hotspot={image.hotspot}
              crop={image.crop}
              className="w-full"
            />
            {image.caption && <figcaption className="mt-3 font-mono text-xs text-muted">{image.caption}</figcaption>}
          </figure>
        )}
        <div className={`flex min-w-0 flex-col gap-6 ${image ? 'md:flex-1' : 'max-w-3xl'}`}>
          {block.heading && <h2 className="display-md">{block.heading}</h2>}
          <PortableText value={block.content} className="max-w-[36em]" />
          {block.button && (
            <div>
              <Button button={block.button} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
