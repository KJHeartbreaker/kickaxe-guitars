import {stegaClean} from 'next-sanity'

import FeatureTag, {tagClearance} from '@/app/components/FeatureTag'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {rowBackground, rowPadding} from '@/app/components/blocks/rowTheme'
import type {Block} from '@/sanity/lib/types'

type SingleColumnBlock = Block<'singleColumn'>

const widths = {
  narrow: 'max-w-[40rem]',
  normal: 'max-w-[52rem]',
  wide: 'max-w-[72rem]',
  full: 'max-w-none',
} as const

const heights = {
  small: 'h-[240px] sm:h-[320px]',
  medium: 'h-[320px] sm:h-[460px]',
  large: 'h-[420px] sm:h-[620px]',
  full: 'h-[100svh]',
} as const

/**
 * Single Column: an eyebrow and rich text, left-aligned or centred, with
 * optional media above or below. Shares Two Column's backgrounds and spacing.
 * See studio/src/schemaTypes/objects/blocks/singleColumn.ts for the options.
 */
export default function SingleColumn({block, index}: {block: SingleColumnBlock; index: number}) {
  // Option values carry Visual Editing (stega) markers in draft mode; clean them before comparing.
  const mediaType = stegaClean(block.mediaType) ?? 'none'
  const centered = stegaClean(block.align) === 'center'
  const width = widths[(stegaClean(block.width) as keyof typeof widths) ?? 'wide'] ?? widths.wide
  const compact = stegaClean(block.spacing) === 'compact'
  const mediaBelow = stegaClean(block.mediaPosition) === 'below'
  const height = (stegaClean(block.mediaHeight) as keyof typeof heights | 'natural') ?? 'medium'
  const bg = rowBackground(stegaClean(block.background))

  const hasImage = mediaType === 'image' && Boolean(block.image?.asset?._ref)
  const hasMedia = hasImage
  const hasText = Boolean(block.eyebrow) || Boolean(block.content?.length)
  const fullBleed = hasMedia && Boolean(block.fullBleed)
  // A full-bleed image with no text runs edge to edge with no padding, like a divider.
  const edgeToEdge = fullBleed && !hasText
  const eager = index === 0

  const text = hasText ? (
    <div className={`wrap ${centered ? 'text-center' : ''}`}>
      <div className={`flex flex-col gap-6 ${width} ${centered ? 'mx-auto items-center' : ''}`}>
        {block.eyebrow && (
          <p className={`font-mono text-[13px] tracking-[0.12em] uppercase ${bg.eyebrow}`}>{stegaClean(block.eyebrow)}</p>
        )}
        <PortableText
          value={block.content}
          tone={bg.tone}
          surface={bg.surface}
          centered={centered}
          className={`w-full [&_li]:max-w-[38em] [&_p]:max-w-[38em] ${centered ? '[&_p]:mx-auto' : ''}`}
        />
      </div>
    </div>
  ) : null

  const media = hasMedia ? (
    <div className={fullBleed ? 'mx-auto w-full max-w-[1920px]' : 'wrap'}>
      <div className={`relative ${height === 'natural' ? '' : (heights[height] ?? heights.medium)} ${block.tagTitle ? tagClearance : ''}`}>
        {height === 'natural' ? (
          <Image
            id={block.image!.asset!._ref}
            alt={block.image!.alt || ''}
            width={fullBleed ? 2400 : 1600}
            hotspot={block.image!.hotspot}
            crop={block.image!.crop}
            className="block w-full"
            {...(eager ? {loading: 'eager' as const, fetchPriority: 'high' as const} : {})}
          />
        ) : (
          <Image
            id={block.image!.asset!._ref}
            alt={block.image!.alt || ''}
            width={fullBleed ? 2400 : 1600}
            height={height === 'full' ? 1500 : 900}
            mode="cover"
            hotspot={block.image!.hotspot}
            crop={block.image!.crop}
            className="absolute inset-0 h-full w-full object-cover"
            {...(eager ? {loading: 'eager' as const, fetchPriority: 'high' as const} : {})}
          />
        )}
        <FeatureTag block={block} />
      </div>
    </div>
  ) : null

  if (!text && !media) return null

  return (
    <section
      className={`${bg.section} ${block.divider ? `border-t ${bg.rule}` : ''} ${edgeToEdge ? '' : rowPadding(compact, {noTop: Boolean(block.noPaddingTop), noBottom: Boolean(block.noPaddingBottom)})}`}
    >
      <div className={`flex flex-col ${compact ? 'gap-8' : 'gap-12'}`}>
        {!mediaBelow && media}
        {text}
        {mediaBelow && media}
      </div>
    </section>
  )
}
