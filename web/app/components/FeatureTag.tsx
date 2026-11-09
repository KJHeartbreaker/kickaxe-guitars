import {stegaClean} from 'next-sanity'
import ResolvedLink from '@/app/components/ResolvedLink'
import type {DereferencedLink} from '@/sanity/lib/types'
import {linkResolver} from '@/sanity/lib/utils'

/** The feature-tag fields shared by the Two Column and Single Column blocks. */
export type FeatureTagFields = {
  tagLabel?: string | null
  tagTitle?: string | null
  tagText?: string | null
  tagLink?: unknown
  tagLinkLabel?: string | null
}

/**
 * The hang tag pinned to a photo: a featured brand or product.
 * On phones it hangs off the bottom-right corner (keeping the photo clear);
 * from 640px up it hangs off the left edge near the bottom.
 */
/** Space under a tagged photo on phones, so the hanging tag clears the next section. */
export const tagClearance = 'mb-14 sm:mb-0'

export default function FeatureTag({block}: {block: FeatureTagFields}) {
  if (!block.tagTitle) return null
  const link = block.tagLink as DereferencedLink | null | undefined
  const hasLink = Boolean(linkResolver(link ?? undefined))
  const footer = (
    <span className="flex justify-between border-t border-dashed border-[#b5aa98] pt-2 font-mono text-[11px] sm:pt-2.5 sm:text-xs">
      <span>{block.tagLinkLabel || 'Find out more'}</span>
      <span aria-hidden="true">→</span>
    </span>
  )

  return (
    <div className="absolute right-3 -bottom-14 w-[176px] rotate-3 bg-bone p-3.5 text-ink shadow-[0_12px_28px_rgba(0,0,0,0.45)] transition-transform hover:rotate-0 sm:right-auto sm:bottom-8 sm:-left-5 sm:w-[260px] sm:-rotate-3 sm:p-6 sm:shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
      <span aria-hidden="true" className="mx-auto mb-2.5 block size-2.5 rounded-full bg-ink sm:mb-3.5 sm:size-3.5" />
      {block.tagLabel && (
        <p className="font-mono text-[9px] tracking-[0.14em] text-label uppercase sm:text-[11px]">{stegaClean(block.tagLabel)}</p>
      )}
      <p className="mt-1 font-display text-[28px] leading-[0.95] font-black uppercase sm:mt-1.5 sm:text-[40px]">{block.tagTitle}</p>
      {block.tagText && <p className="mt-1.5 text-xs leading-snug sm:mt-2 sm:text-sm">{block.tagText}</p>}
      {hasLink ? (
        <ResolvedLink link={link!} className="mt-2.5 block hover:text-stone sm:mt-3.5">
          {footer}
        </ResolvedLink>
      ) : (
        block.tagLinkLabel && <span className="mt-2.5 block sm:mt-3.5">{footer}</span>
      )}
    </div>
  )
}
