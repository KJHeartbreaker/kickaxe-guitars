import {stegaClean} from 'next-sanity'

import Image from '@/app/components/SanityImage'
import {telHref} from '@/app/components/shop'
import type {Block, ShopInfo} from '@/sanity/lib/types'

/**
 * Google Maps embed URL for an address. The plain `output=embed` form needs no
 * API key. Built from Shop Info, so the map follows the address if it changes.
 */
function mapEmbedUrl(address: string, cityLine?: string | null) {
  const query = [address, cityLine].filter(Boolean).join(', ')
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
}

/** The same place, opened in Google Maps itself. */
function mapOpenUrl(address: string, cityLine?: string | null) {
  const query = [address, cityLine].filter(Boolean).join(', ')
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

const themes = {
  bone: {
    section: 'bg-bone text-ink',
    label: 'text-label',
    body: 'text-stone',
    rule: 'border-rule',
    strong: 'border-ink',
    primary: 'btn-ink',
    secondary: 'btn border-[1.5px] border-ink hover:bg-ink hover:text-bone',
    // Warm monochrome, so Google's tiles read as part of the bone paper.
    map: '[filter:grayscale(1)_sepia(0.22)_contrast(0.92)_brightness(1.02)]',
  },
  ink: {
    section: 'bg-ink text-bone',
    label: 'text-orange',
    body: 'text-soft',
    rule: 'border-line',
    strong: 'border-bone',
    primary: 'btn-primary',
    secondary: 'btn-outline',
    // Inverted to a dark map that sits on black.
    map: '[filter:grayscale(1)_invert(0.9)_contrast(0.9)]',
  },
  cab: {
    section: 'bg-cab text-bone',
    label: 'text-orange',
    body: 'text-soft',
    rule: 'border-line',
    strong: 'border-bone',
    primary: 'btn-primary',
    secondary: 'btn-outline',
    map: '[filter:grayscale(1)_invert(0.88)_contrast(0.9)]',
  },
} as const

/** The Kickaxe pin, drawn over the map: Google's own pin goes grey in the tinted map. */
function Pin() {
  return (
    <svg
      aria-hidden="true"
      width="34"
      height="46"
      viewBox="0 0 34 46"
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]"
    >
      <path d="M17 1C8.2 1 1 8 1 16.7 1 28.5 17 45 17 45s16-16.5 16-28.3C33 8 25.8 1 17 1z" fill="#ED8917" stroke="#0F0D0B" strokeWidth="2" />
      <circle cx="17" cy="16.5" r="5.5" fill="#0F0D0B" />
    </svg>
  )
}

/**
 * Visit the Shop block: address, hours, phone and email from Site Settings →
 * Shop Info, with a map (tinted to the background) or the storefront photo.
 */
export default function VisitShop({block}: {block: Block<'visitShop'>}) {
  const shopInfo = block.shopInfo as ShopInfo | null
  if (!shopInfo) return null
  const {address, cityLine, note, hours, phone, email, mapUrl, photo} = shopInfo
  if (!address && !hours?.length) return null

  const theme = themes[(stegaClean(block.background) as keyof typeof themes) ?? 'bone'] ?? themes.bone
  const showPhoto = stegaClean(block.media) === 'photo'
  const cleanAddress = stegaClean(address)
  const cleanCity = stegaClean(cityLine)
  const title = block.title || address

  return (
    <section aria-labelledby="visit-heading" className={theme.section}>
      <div className="wrap flex flex-wrap gap-14 py-20 lg:py-26">
        <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-7">
          <p className={`font-mono text-[13px] tracking-[0.12em] uppercase ${theme.label}`}>Visit the shop</p>
          {title && (
            <h2 id="visit-heading" className="display text-[clamp(40px,4.4vw,72px)]">
              {title}
            </h2>
          )}
          {(cityLine || note || (block.title && address)) && (
            <p className={`text-lg ${theme.body}`}>
              {[block.title ? address : null, cityLine, note].filter(Boolean).join('. ')}
            </p>
          )}
          <dl className={`grid max-w-[460px] grid-cols-[auto_1fr] border-t-2 font-mono text-[15px] ${theme.strong}`}>
            {hours?.map((row) => (
              <div key={row._key} className="contents">
                <dt className={`border-b py-3.5 pr-6 ${theme.rule}`}>{row.days}</dt>
                <dd className={`border-b py-3.5 text-right ${theme.rule}`}>
                  {row.opens} – {row.closes}
                </dd>
              </div>
            ))}
            {phone && (
              <div className="contents">
                <dt className={`border-b py-3.5 pr-6 ${theme.rule}`}>Phone</dt>
                <dd className={`border-b py-3.5 text-right ${theme.rule}`}>
                  <a href={telHref(stegaClean(phone))} className="underline underline-offset-4">
                    {phone}
                  </a>
                </dd>
              </div>
            )}
            {email && (
              <div className="contents">
                <dt className={`border-b py-3.5 pr-6 ${theme.rule}`}>Email</dt>
                <dd className={`border-b py-3.5 text-right break-all ${theme.rule}`}>
                  <a href={`mailto:${stegaClean(email)}`} className="underline underline-offset-4">
                    {email}
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-3">
            {mapUrl && (
              <a href={stegaClean(mapUrl)} target="_blank" rel="noopener noreferrer" className={theme.primary}>
                Get directions <span aria-hidden="true">↗</span>
              </a>
            )}
            {phone && (
              <a href={telHref(stegaClean(phone))} className={theme.secondary}>
                Call the shop
              </a>
            )}
          </div>
        </div>
        {!showPhoto && cleanAddress && (
          // The map is a picture, not a tool: it can't be dragged (so the shop
          // always sits under the Kickaxe pin), and clicking it opens the place
          // in Google Maps in a new tab.
          <a
            href={stegaClean(mapUrl) || mapOpenUrl(cleanAddress, cleanCity)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${[cleanAddress, cleanCity].filter(Boolean).join(', ')} in Google Maps (new tab)`}
            className={`group relative block min-h-[360px] min-w-0 flex-[1_1_520px] overflow-hidden border lg:min-h-[480px] ${theme.rule}`}
          >
            <iframe
              title={`Map of ${[cleanAddress, cleanCity].filter(Boolean).join(', ')}`}
              src={mapEmbedUrl(cleanAddress, cleanCity)}
              className={`pointer-events-none absolute inset-0 h-full w-full ${theme.map}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              aria-hidden="true"
            />
            <Pin />
            <span className="absolute right-3 bottom-3 bg-ink px-3 py-2 font-mono text-xs text-bone opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              Open in Google Maps ↗
            </span>
          </a>
        )}
        {showPhoto && photo?.asset?._ref && (
          <div className="relative min-h-[360px] min-w-0 flex-[1_1_520px] lg:min-h-[480px]">
            <Image
              id={photo.asset._ref}
              alt={photo.alt || ''}
              width={1000}
              height={800}
              mode="cover"
              hotspot={photo.hotspot}
              crop={photo.crop}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
