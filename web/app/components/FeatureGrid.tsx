import {stegaClean} from 'next-sanity'
import ResolvedLink from '@/app/components/ResolvedLink'
import Image from '@/app/components/SanityImage'
import type {DereferencedLink} from '@/sanity/lib/types'
import {linkResolver} from '@/sanity/lib/utils'

type Figure = {
  asset?: {_ref?: string}
  alt?: string
  hotspot?: {x: number; y: number; height: number; width: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export type FeatureGridItem = {
  _key: string
  image?: Figure | null
  badge?: string
  badgeHighlight?: boolean
  kicker?: string
  title?: string
  text?: string
  linkLabel?: string
  link?: DereferencedLink | null
}

// Columns on large screens by item count (4 at most, then rows wrap).
const lgColumns = ['lg:grid-cols-1', 'lg:grid-cols-1', 'lg:grid-cols-2', 'lg:grid-cols-3', 'lg:grid-cols-4']

/**
 * The amp-knob dial. Pointers sweep from about 8 o'clock on the first card to
 * about 4 o'clock on the last, like turning a volume knob up across the row.
 */
function Dial({index, count, light}: {index: number; count: number; light: boolean}) {
  const angle = count > 1 ? -120 + (240 * index) / (count - 1) : 0
  const rad = (angle * Math.PI) / 180
  const x = 22 + 12 * Math.sin(rad)
  const y = 22 - 12 * Math.cos(rad)
  const knob = light ? '#0F0D0B' : '#F4EEE4'
  return (
    <svg aria-hidden="true" width="44" height="44" viewBox="0 0 44 44" className="shrink-0">
      <circle cx="22" cy="22" r="16" fill={knob} />
      <line x1="22" y1="22" x2={x.toFixed(2)} y2={y.toFixed(2)} stroke="#ED8917" strokeWidth="3" strokeLinecap="round" />
      <circle cx="22" cy="22" r="20.5" fill="none" stroke={knob} strokeWidth="1" strokeDasharray="1.5 4" />
    </svg>
  )
}

/**
 * Cards style: dark panels with a photo (optional badge), a kicker, a title,
 * a short text and a link. Used for the "In stock now" specials.
 */
function Cards({items, light}: {items: FeatureGridItem[]; light: boolean}) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-6">
      {items.map((item) => {
        const href = linkResolver(item.link ?? undefined)
        const image = item.image?.asset?._ref ? item.image : null
        return (
          <li
            key={item._key}
            className={`group flex flex-col ${light ? 'border border-rule bg-white/50' : 'bg-cab'}`}
          >
            {image && (
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  id={image.asset!._ref!}
                  alt={image.alt || ''}
                  width={720}
                  height={540}
                  mode="cover"
                  hotspot={image.hotspot}
                  crop={image.crop}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {item.badge && (
                  <span
                    className={`absolute top-3.5 left-3.5 px-2.5 py-1 font-mono text-xs font-medium tracking-[0.06em] uppercase text-ink ${item.badgeHighlight ? 'bg-orange' : 'bg-bone'}`}
                  >
                    {stegaClean(item.badge)}
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-1 flex-col gap-2 p-5 sm:p-6">
              {item.kicker && (
                <p className={`font-mono text-xs tracking-[0.12em] uppercase ${light ? 'text-label' : 'text-muted'}`}>
                  {stegaClean(item.kicker)}
                </p>
              )}
              {item.title && (
                <h3 className={`card-title ${light ? 'text-ink' : 'text-bone'}`}>{item.title}</h3>
              )}
              {item.text && (
                <p className={`text-[15px] leading-relaxed ${light ? 'text-stone' : 'text-soft'}`}>{item.text}</p>
              )}
              {item.linkLabel && href && (
                <ResolvedLink
                  link={item.link!}
                  className={`mt-auto self-start pt-2 font-mono text-[13px] underline decoration-1 underline-offset-4 ${light ? 'text-ink hover:text-stone' : 'text-bone hover:text-orange'}`}
                >
                  {item.linkLabel} <span aria-hidden="true">→</span>
                </ResolvedLink>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * The items of a Card Grid block. "List" style: numbered items with a
 * dial, a title, a short text and a link, divided by hairlines (services).
 * "Cards" style: photo cards (in-stock specials).
 */
export default function FeatureGrid({
  items,
  variant = 'list',
  numbered = true,
  dials = true,
  light,
}: {
  items: FeatureGridItem[]
  variant?: 'list' | 'cards'
  numbered?: boolean
  dials?: boolean
  light: boolean
}) {
  if (!items.length) return null
  if (variant === 'cards') return <Cards items={items} light={light} />
  const cols = Math.min(items.length, 4)
  const rule = light ? 'border-rule' : 'border-line'

  return (
    <ul
      className={`grid grid-cols-1 border-t-2 sm:grid-cols-2 ${lgColumns[cols]} ${light ? 'border-ink' : 'border-bone'}`}
    >
      {items.map((item, i) => {
        const smLeft = i % 2 === 1
        const lgLeft = i % cols !== 0
        const href = linkResolver(item.link ?? undefined)
        return (
          <li
            key={item._key}
            className={`flex flex-col gap-3.5 border-b py-7 pr-6 ${rule} ${smLeft ? 'sm:border-l sm:pl-6' : 'sm:border-l-0 sm:pl-0'} ${lgLeft ? 'lg:border-l lg:pl-6' : 'lg:border-l-0 lg:pl-0'}`}
          >
            {(numbered || dials) && (
              <div className="flex min-h-11 items-center justify-between">
                {numbered ? (
                  <span className={`font-mono text-[13px] ${light ? 'text-ink' : 'text-bone'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                ) : (
                  <span />
                )}
                {dials && <Dial index={i} count={items.length} light={light} />}
              </div>
            )}
            {item.title && (
              <h3
                className={`font-display text-[30px] leading-none font-extrabold uppercase sm:text-[34px] ${light ? 'text-ink' : 'text-bone'}`}
              >
                {item.title}
              </h3>
            )}
            {item.text && (
              <p className={`text-[15px] leading-relaxed ${light ? 'text-stone' : 'text-soft'}`}>{item.text}</p>
            )}
            {item.linkLabel && href && (
              <ResolvedLink
                link={item.link!}
                className={`mt-auto self-start font-mono text-[13px] underline decoration-1 underline-offset-4 ${light ? 'text-ink hover:text-stone' : 'text-bone hover:text-orange'}`}
              >
                {item.linkLabel} <span aria-hidden="true">→</span>
              </ResolvedLink>
            )}
          </li>
        )
      })}
    </ul>
  )
}
