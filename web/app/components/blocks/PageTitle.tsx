import Link from 'next/link'
import {stegaClean} from 'next-sanity'

import type {Block} from '@/sanity/lib/types'

/**
 * Page Title: "Home / Page" trail, the page's name set very large, and an
 * optional short intro beside it. The title falls back to the page name.
 */
export default function PageTitle({block, index}: {block: Block<'pageTitle'>; index: number}) {
  // Typegen can't follow `^.name` in the query, so it types this as null.
  const pageName = (block.pageName as string | null | undefined) ?? ''
  const title = block.title || pageName
  if (!title) return null
  // Only the first block on the page is the page's <h1>.
  const Heading = index === 0 ? 'h1' : 'h2'

  return (
    <section className="wrap pt-14 pb-12 lg:pt-18 lg:pb-14">
      {block.showTrail !== false && pageName && (
        <nav aria-label="Breadcrumb" className="font-mono text-[13px] tracking-[0.12em] text-muted uppercase">
          <Link href="/" className="hover:text-orange">
            Home
          </Link>
          <span aria-hidden="true"> / </span>
          {/* Letter-spaced, so clean the Visual Editing markers out of it. */}
          <span aria-current="page">{stegaClean(pageName)}</span>
        </nav>
      )}
      <div className="mt-5 flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <Heading className="display text-[clamp(64px,13vw,200px)] leading-[0.82]">{title}</Heading>
        {block.intro && (
          <p className="max-w-[26em] text-lg leading-[1.45] text-soft sm:mb-3 sm:text-xl">{block.intro}</p>
        )}
      </div>
    </section>
  )
}
