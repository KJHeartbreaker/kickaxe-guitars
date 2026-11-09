import {stegaClean} from 'next-sanity'
import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

const heights = {
  small: 'h-[220px] sm:h-[280px]',
  medium: 'h-[300px] sm:h-[420px]',
  large: 'h-[380px] sm:h-[560px]',
  full: 'h-[100svh]',
} as const

/** Divider Image: a wide photo that breaks up a page. Full screen runs edge to edge. */
export default function DividerImage({block}: {block: Block<'dividerImage'>}) {
  const image = block.image
  if (!image?.asset?._ref) return null
  const size = stegaClean(block.size) ?? 'medium'
  const full = size === 'full'

  return (
    <div className={full ? '' : 'wrap py-6'}>
      <Image
        id={image.asset._ref}
        alt={image.alt || ''}
        width={full ? 2400 : 1600}
        height={full ? 1500 : 700}
        mode="cover"
        hotspot={image.hotspot}
        crop={image.crop}
        className={`w-full object-cover ${heights[size]}`}
      />
    </div>
  )
}
