import {stegaClean} from 'next-sanity'
import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

const gridCols = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-2 lg:grid-cols-4',
} as const

/** Gallery: a grid of photos, or a sideways-scrolling row (carousel). */
export default function Gallery({block}: {block: Block<'gallery'>}) {
  const images = (block.images ?? []).filter((img) => img.asset?._ref)
  if (!images.length) return null

  const carousel = stegaClean(block.layout) === 'carousel'
  const cols = gridCols[(stegaClean(block.columns) as 2 | 3 | 4) ?? 3] ?? gridCols[3]

  return (
    <section className="py-16 lg:py-20">
      {block.heading && <h2 className="wrap display-lg mb-10">{block.heading}</h2>}
      {carousel ? (
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:px-[max(1.5rem,calc((100vw-1360px)/2+1.5rem))]"
          aria-label={block.heading || 'Gallery'}
        >
          {images.map((img) => (
            <li key={img._key} className="w-[78vw] max-w-[520px] shrink-0 snap-start">
              <Figure image={img} width={1040} height={780} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className={`wrap grid gap-4 ${cols}`}>
          {images.map((img) => (
            <li key={img._key}>
              <Figure image={img} width={900} height={900} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function Figure({
  image,
  width,
  height,
}: {
  image: NonNullable<Block<'gallery'>['images']>[number]
  width: number
  height: number
}) {
  return (
    <figure>
      <Image
        id={image.asset!._ref}
        alt={image.alt || ''}
        width={width}
        height={height}
        mode="cover"
        hotspot={image.hotspot}
        crop={image.crop}
        className="aspect-[4/3] w-full object-cover"
      />
      {image.caption && <figcaption className="mt-2 font-mono text-xs text-muted">{image.caption}</figcaption>}
    </figure>
  )
}
