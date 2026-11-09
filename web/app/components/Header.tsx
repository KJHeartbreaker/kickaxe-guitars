import Link from 'next/link'

import Logo from '@/app/components/Logo'
import NavMenu, {type NavMenuItem} from '@/app/components/NavMenu'
import type {Navigation} from '@/sanity/lib/types'
import {linkResolver} from '@/sanity/lib/utils'

export default function Header({
  navigation,
}: {
  navigation: Navigation | null
}) {
  const items: NavMenuItem[] = (navigation?.items ?? []).flatMap((item) => {
    const href = linkResolver(item.link ?? undefined)
    if (!item.label) return []
    return [
      {
        key: item._key,
        label: item.label,
        href,
        newTab: Boolean(item.link?.openInNewTab),
        children: (item.children ?? []).flatMap((child) => {
          const childHref = linkResolver(child.link ?? undefined)
          return child.label && childHref
            ? [{key: child._key, label: child.label, href: childHref, newTab: Boolean(child.link?.openInNewTab)}]
            : []
        }),
      },
    ]
  })

  const cta = navigation?.ctaButton
  const ctaHref = linkResolver(cta?.link ?? undefined)

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink">
      <div className="wrap flex items-center justify-between gap-6 py-4">
          <Link href="/" aria-label="Kickaxe Guitars home" className="shrink-0">
            <Logo className="h-12 w-auto sm:h-14" preload />
          </Link>
          <NavMenu
            items={items}
            cta={cta?.buttonText && ctaHref ? {label: cta.buttonText, href: ctaHref} : null}
          />
      </div>
    </header>
  )
}
