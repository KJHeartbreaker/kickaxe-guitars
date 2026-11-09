import {stegaClean} from 'next-sanity'
import Link from 'next/link'

import Logo from '@/app/components/Logo'
import ResolvedLink from '@/app/components/ResolvedLink'
import type {DereferencedLink, FooterData, ShopInfo} from '@/sanity/lib/types'

const platformLabels: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  youtube: 'YouTube',
  twitter: 'X',
  tiktok: 'TikTok',
  spotify: 'Spotify',
  soundcloud: 'SoundCloud',
  reverb: 'Reverb',
}

export default function Footer({
  footer,
  shopInfo,
}: {
  footer: FooterData | null
  shopInfo: ShopInfo | null
}) {
  const hours = shopInfo?.hours ?? []

  return (
    <footer>
      <div className="border-t border-line bg-ink">
        <div className="wrap flex flex-col gap-12 pt-16 pb-8">
          <div className="flex flex-wrap justify-between gap-x-16 gap-y-10">
            <div className="flex flex-[1_1_280px] flex-col gap-4">
              <Link href="/" aria-label="Kickaxe Guitars home" className="self-start">
                <Logo className="h-16 w-auto sm:h-18" />
              </Link>
              {footer?.blurb && <p className="max-w-[22em] text-[15px] text-muted">{footer.blurb}</p>}
            </div>
            <div className="flex flex-wrap gap-x-16 gap-y-8 text-[15px]">
              {footer?.columns?.map((column) => (
                <div key={column._key} className="flex flex-col gap-2.5">
                  {column.title && (
                    <h2 className="font-mono text-xs tracking-[0.12em] text-muted uppercase">{stegaClean(column.title)}</h2>
                  )}
                  {column.links?.map(
                    (item) =>
                      item.label && (
                        <ResolvedLink
                          key={item._key}
                          link={item.link as DereferencedLink}
                          className="hover:text-orange"
                        >
                          {item.label}
                        </ResolvedLink>
                      ),
                  )}
                </div>
              ))}
              {hours.length > 0 && (
                <div className="flex flex-col gap-2.5">
                  <h2 className="font-mono text-xs tracking-[0.12em] text-muted uppercase">Hours</h2>
                  {hours.map((row) => (
                    <span key={row._key}>
                      {row.days} {row.opens}–{row.closes}
                    </span>
                  ))}
                </div>
              )}
              {footer?.social?.length ? (
                <div className="flex flex-col gap-2.5">
                  <h2 className="font-mono text-xs tracking-[0.12em] text-muted uppercase">Follow</h2>
                  {footer.social.map(
                    (social) =>
                      social.url && (
                        <a
                          key={social._key}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange"
                        >
                          {platformLabels[stegaClean(social.platform) ?? ''] ?? social.platform}
                        </a>
                      ),
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap justify-between gap-x-6 gap-y-2 border-t border-line pt-5 font-mono text-xs text-muted">
            <span>{footer?.copyright || '© Kickaxe Guitars'}</span>
            {shopInfo?.address && (
              <span>{[shopInfo.address, shopInfo.cityLine].filter(Boolean).join(', ')}</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
