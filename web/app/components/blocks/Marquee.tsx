import {stegaClean} from 'next-sanity'
import type {CSSProperties} from 'react'

import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

/**
 * Marquee: a continuously scrolling band of brand names or logos, separated
 * by orange slashes. Speed runs from 0 (slow, 60s per loop) to 1 (fast, 15s).
 * The animation stops for people who prefer reduced motion; the band can
 * then be scrolled sideways.
 */
export default function Marquee({block}: {block: Block<'marquee'>}) {
  // Words (a tag-style list of strings) come first, then any logos.
  const items: Array<{key: string; text?: string; logo?: NonNullable<typeof block.logos>[number]}> = [
    ...(block.words ?? []).filter((word) => stegaClean(word).trim()).map((word, i) => ({key: `w${i}`, text: word})),
    ...(block.logos ?? []).filter((logo) => logo.asset?._ref).map((logo) => ({key: logo._key, logo})),
  ]
  if (!items.length) return null

  const speed = Math.min(1, Math.max(0, block.speed ?? 0.5))
  const style = {'--marquee-duration': `${60 - speed * 45}s`} as CSSProperties

  const row = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-5 pr-5 font-display text-[24px] font-extrabold uppercase tracking-[0.02em] sm:gap-9 sm:pr-9 sm:text-[34px]"
    >
      {items.map((item) => (
        <li key={item.key} className="flex items-center gap-5 sm:gap-9">
          {item.text !== undefined ? (
            <span className="whitespace-nowrap">{stegaClean(item.text)}</span>
          ) : item.logo?.asset?._ref ? (
            <Image
              id={item.logo.asset._ref}
              alt={hidden ? '' : item.logo.alt || ''}
              height={96}
              className="h-8 w-auto sm:h-12"
            />
          ) : null}
          <span aria-hidden="true" className="text-orange">
            /
          </span>
        </li>
      ))}
    </ul>
  )

  return (
    <section
      aria-label="Brands we carry"
      className="overflow-x-auto border-y border-line motion-safe:overflow-hidden"
    >
      <div
        style={style}
        className={`flex w-max py-3.5 motion-safe:animate-marquee sm:py-5 ${block.reverse ? '[animation-direction:reverse]' : ''} ${block.pausable ? 'hover:[animation-play-state:paused]' : ''}`}
      >
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}
