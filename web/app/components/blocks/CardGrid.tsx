import {stegaClean} from 'next-sanity'

import FeatureGrid, {type FeatureGridItem} from '@/app/components/FeatureGrid'
import ResolvedLink from '@/app/components/ResolvedLink'
import {rowBackground, rowPadding} from '@/app/components/blocks/rowTheme'
import type {Block, DereferencedLink} from '@/sanity/lib/types'
import {linkArrow, linkResolver} from '@/sanity/lib/utils'

/**
 * Card Grid: an optional section heading (small label, title, intro and a
 * "see all" link) above a row of photo cards or a numbered list with dials.
 * See studio/src/schemaTypes/objects/blocks/cardGrid.ts.
 */
export default function CardGrid({block}: {block: Block<'cardGrid'>}) {
  const items = (block.items ?? []) as FeatureGridItem[]
  if (!items.length) return null

  const bg = rowBackground(stegaClean(block.background))
  const light = bg.tone === 'light'
  const compact = stegaClean(block.spacing) === 'compact'
  const variant = stegaClean(block.style) === 'list' ? 'list' : 'cards'
  const link = block.link as DereferencedLink | null | undefined
  const hasLink = Boolean(block.linkLabel && linkResolver(link ?? undefined))
  const hasHeading = Boolean(block.eyebrow || block.title || block.intro || hasLink)

  return (
    <section className={`${bg.section} ${block.divider ? `border-t ${bg.rule}` : ''} ${rowPadding(compact)}`}>
      <div className="wrap">
        {hasHeading && (
          // The title gets priority: it stays on one line while there's room, and the
          // intro / link take what's left (down to about 18em) before wrapping below.
          <div className="mb-10 flex flex-wrap items-end justify-between gap-x-16 gap-y-5">
            <div className="flex flex-[0_1_auto] flex-col gap-3">
              {block.eyebrow && (
                <p className={`font-mono text-[13px] tracking-[0.12em] uppercase ${bg.eyebrow}`}>
                  {stegaClean(block.eyebrow)}
                </p>
              )}
              {block.title && <h2 className="display-lg">{block.title}</h2>}
            </div>
            {(block.intro || hasLink) && (
              <div
                className={`flex flex-[1_1_18em] flex-col gap-4 pb-1 ${block.intro ? 'max-w-[30em]' : 'items-end'}`}
              >
                {block.intro && (
                  <p className={`text-[17px] leading-relaxed ${light ? 'text-stone' : 'text-soft'}`}>{block.intro}</p>
                )}
                {hasLink && (
                  <ResolvedLink
                    // With an intro the link sits under it; on its own it hugs the right edge.
                    link={link!}
                    className={`inline-flex min-h-11 items-center gap-2 font-mono text-sm underline decoration-1 underline-offset-4 ${light ? 'text-ink hover:text-stone' : 'text-bone hover:text-orange'}`}
                  >
                    {block.linkLabel} <span aria-hidden="true">{linkArrow(link)}</span>
                  </ResolvedLink>
                )}
              </div>
            )}
          </div>
        )}
        <FeatureGrid
          items={items}
          variant={variant}
          numbered={block.numbered ?? true}
          dials={block.dials ?? true}
          light={light}
        />
      </div>
    </section>
  )
}
