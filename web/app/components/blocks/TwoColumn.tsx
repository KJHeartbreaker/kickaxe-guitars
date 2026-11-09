import {stegaClean} from 'next-sanity'

import Accordion, {type AccordionItem} from '@/app/components/Accordion'
import FeatureTag, {tagClearance} from '@/app/components/FeatureTag'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {rowBackground, rowPadding, type RowBackground} from '@/app/components/blocks/rowTheme'
import type {Block} from '@/sanity/lib/types'

type TwoColumnBlock = Block<'twoColumn'>
type ColumnItem = NonNullable<TwoColumnBlock['left']>[number]
type Figure = {
  asset?: {_ref?: string}
  alt?: string
  caption?: string
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

// Left / right widths on large screens.
const columns: Record<string, string> = {
  '30-70': 'lg:grid-cols-[3fr_7fr]',
  '40-60': 'lg:grid-cols-[2fr_3fr]',
  '50-50': 'lg:grid-cols-2',
  '60-40': 'lg:grid-cols-[3fr_2fr]',
  '70-30': 'lg:grid-cols-[7fr_3fr]',
  'auto-left': 'lg:grid-cols-[auto_minmax(0,1fr)]',
  'auto-right': 'lg:grid-cols-[minmax(0,1fr)_auto]',
}

/** A column that is just one full-bleed photo runs to the window edge. */
function isBleed(items: ColumnItem[]) {
  const only = items.length === 1 ? items[0] : undefined
  return only?._type === 'columnImage' && Boolean(only.fullBleed)
}

/**
 * Two Column: an optional heading above, then a left and a right column, each
 * holding Text, Photo, Photo pair or Accordion items.
 * See studio/src/schemaTypes/objects/blocks/twoColumn.ts for the options.
 */
export default function TwoColumn({block, index}: {block: TwoColumnBlock; index: number}) {
  // Option values carry Visual Editing (stega) markers in draft mode; clean them before comparing.
  const split = stegaClean(block.split) ?? '50-50'
  const rightFirst = stegaClean(block.mobileFirst) === 'right'
  const alignTop = stegaClean(block.verticalAlign) === 'top'
  const compact = stegaClean(block.spacing) === 'compact'
  const bg = rowBackground(stegaClean(block.background))
  const padding = rowPadding(compact, {noTop: Boolean(block.noPaddingTop), noBottom: Boolean(block.noPaddingBottom)})

  const left = (block.left ?? []) as ColumnItem[]
  const right = (block.right ?? []) as ColumnItem[]
  if (!left.length && !right.length) return null

  const grid = columns[split] ?? columns['50-50']
  const leftBleed = isBleed(left)
  const rightBleed = isBleed(right)
  const fullBleed = leftBleed || rightBleed
  const selfAlign = alignTop ? 'self-start' : 'self-center'
  // The first block on a page loads its photos right away (they're above the fold).
  const eager = index === 0

  const heading =
    block.eyebrow || block.title ? (
      <div className="wrap mb-10 flex flex-col gap-3 lg:mb-12">
        {block.eyebrow && (
          <p className={`font-mono text-[13px] tracking-[0.12em] uppercase ${bg.eyebrow}`}>
            {stegaClean(block.eyebrow)}
          </p>
        )}
        {block.title && <h2 className="display-lg">{block.title}</h2>}
      </div>
    ) : null

  const renderColumn = (items: ColumnItem[], side: 'left' | 'right') => {
    const bleed = side === 'left' ? leftBleed : rightBleed
    // On phones the chosen column goes on top; on large screens left is left.
    const order = (side === 'right') === rightFirst ? 'order-first lg:order-none' : ''
    if (bleed) return <BleedPhoto key={side} item={items[0]} eager={eager} className={order} />
    // A single photo fills the column's height; anything else stacks naturally.
    const fill = items.length === 1 && items[0]._type === 'columnImage'
    const edge = fullBleed
      ? side === 'left'
        ? 'px-5 sm:px-6 lg:ps-edge lg:pe-12'
        : 'px-5 sm:px-6 lg:ps-12 lg:pe-edge'
      : ''
    return (
      <div
        key={side}
        className={`flex min-w-0 flex-col gap-8 ${fill ? '' : selfAlign} ${fullBleed ? `${padding} ${edge} flex justify-center` : ''} ${order}`}
      >
        {items.map((item) => (
          <Item key={item._key} item={item} bg={bg} fill={fill} eager={eager} />
        ))}
      </div>
    )
  }

  return (
    <section
      className={`${bg.section} ${block.divider ? `border-t ${bg.rule}` : ''} ${fullBleed ? '' : padding}`}
    >
      {fullBleed ? (
        <>
          {heading && <div className="pt-18 lg:pt-24">{heading}</div>}
          <div className={`mx-auto grid max-w-[1920px] items-stretch ${grid}`}>
            {renderColumn(left, 'left')}
            {renderColumn(right, 'right')}
          </div>
        </>
      ) : (
        <>
          {heading}
          <div className={`wrap grid items-stretch gap-x-16 ${compact ? 'gap-y-6' : 'gap-y-10'} ${grid}`}>
            {renderColumn(left, 'left')}
            {renderColumn(right, 'right')}
          </div>
        </>
      )}
    </section>
  )
}

function Item({item, bg, fill, eager}: {item: ColumnItem; bg: RowBackground; fill: boolean; eager: boolean}) {
  const loading = eager ? ({loading: 'eager', fetchPriority: 'high'} as const) : {}

  switch (item._type) {
    case 'columnText':
      return (
        <PortableText
          value={item.content}
          tone={bg.tone}
          surface={bg.surface}
          className="[&_li]:max-w-[38em] [&_p]:max-w-[38em]"
        />
      )

    case 'columnAccordion':
      return (
        <Accordion
          items={(item.items ?? []) as AccordionItem[]}
          groupKey={item._key}
          firstOpen={item.firstOpen ?? true}
          light={bg.tone === 'light'}
          surface={bg.surface}
        />
      )

    case 'columnImagePair': {
      const first = item.image as Figure | undefined
      const second = item.secondImage as Figure | undefined
      if (!first?.asset?._ref) return null
      return (
        <div className="grid grid-cols-2 gap-4">
          <PairImage image={first} {...loading} />
          {second?.asset?._ref && <PairImage image={second} className="mt-12" />}
        </div>
      )
    }

    case 'columnImage': {
      const image = item.image as Figure | undefined
      if (!image?.asset?._ref) return null
      if (fill) {
        // The only thing in its column: fill the row's height (cropped with the hotspot).
        return (
          <div className={`relative aspect-[4/3] min-w-0 lg:aspect-auto lg:min-h-[480px] lg:flex-1 ${item.tagTitle ? tagClearance : ''}`}>
            <Image
              id={image.asset._ref}
              alt={image.alt || ''}
              width={1200}
              height={1000}
              mode="cover"
              hotspot={image.hotspot}
              crop={image.crop}
              className="absolute inset-0 h-full w-full object-cover"
              {...loading}
            />
            <FeatureTag block={item} />
          </div>
        )
      }
      return (
        <figure className={`relative ${item.tagTitle ? tagClearance : ''}`}>
          <Image
            id={image.asset._ref}
            alt={image.alt || ''}
            width={1200}
            hotspot={image.hotspot}
            crop={image.crop}
            className="w-full"
            {...loading}
          />
          {image.caption && <figcaption className="mt-3 font-mono text-xs text-muted">{image.caption}</figcaption>}
          <FeatureTag block={item} />
        </figure>
      )
    }

    default:
      return null
  }
}

/** A full-bleed photo: fills its half of the row, edge to edge. */
function BleedPhoto({item, eager, className = ''}: {item: ColumnItem; eager: boolean; className?: string}) {
  if (item._type !== 'columnImage') return null
  const image = item.image as Figure | undefined
  if (!image?.asset?._ref) return null
  return (
    <div className={`relative min-h-[420px] min-w-0 lg:min-h-[600px] ${item.tagTitle ? tagClearance : ''} ${className}`}>
      <Image
        id={image.asset._ref}
        alt={image.alt || ''}
        width={1600}
        height={1200}
        mode="cover"
        hotspot={image.hotspot}
        crop={image.crop}
        className="absolute inset-0 h-full w-full object-cover"
        {...(eager ? {loading: 'eager' as const, fetchPriority: 'high' as const} : {})}
      />
      <FeatureTag block={item} />
    </div>
  )
}

function PairImage({
  image,
  className = '',
  ...rest
}: {
  image: Figure
  className?: string
  loading?: 'eager'
  fetchPriority?: 'high'
}) {
  return (
    <Image
      id={image.asset!._ref!}
      alt={image.alt || ''}
      width={640}
      height={853}
      mode="cover"
      hotspot={image.hotspot}
      crop={image.crop}
      className={`aspect-[3/4] w-full object-cover ${className}`}
      {...rest}
    />
  )
}
