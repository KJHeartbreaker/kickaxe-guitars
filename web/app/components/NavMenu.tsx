'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'

export type NavMenuItem = {
  key: string
  label: string
  href: string | null
  newTab: boolean
  children: {key: string; label: string; href: string; newTab: boolean}[]
}

function isActive(pathname: string, href: string | null) {
  if (!href || href.startsWith('http')) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function newTabProps(newTab: boolean) {
  return newTab ? {target: '_blank', rel: 'noopener noreferrer'} : {}
}

/**
 * Main navigation. A row of links on large screens; a full-width panel behind
 * a Menu button on small screens. Items with children show them in a dropdown
 * (desktop) or an indented list (mobile).
 */
export default function NavMenu({
  items,
  cta,
}: {
  items: NavMenuItem[]
  cta: {label: string; href: string} | null
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  if (!items.length && !cta) return null

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
        <ul className="flex items-center gap-7 text-[15px] font-medium">
          {items.map((item) => {
            const active = isActive(pathname, item.href)
            const linkClass = `inline-flex min-h-11 items-center border-b-2 transition-colors ${
              active ? 'border-orange text-orange' : 'border-transparent hover:text-orange'
            }`
            return (
              <li key={item.key} className="group relative">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={linkClass}
                    aria-current={active ? 'page' : undefined}
                    {...newTabProps(item.newTab)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={linkClass}>{item.label}</span>
                )}
                {item.children.length > 0 && (
                  <ul className="invisible absolute left-0 top-full min-w-56 border border-line bg-cab py-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2.5 hover:bg-ink hover:text-orange"
                          {...newTabProps(child.newTab)}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
        {cta && (
          <Link href={cta.href} className="btn-primary min-h-11 px-5 text-[15px]">
            {cta.label}
          </Link>
        )}
      </nav>

      {/* Mobile */}
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-3 border border-line px-4 font-mono text-sm uppercase tracking-[0.1em] lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'Close' : 'Menu'}
        <svg aria-hidden="true" width="18" height="12" viewBox="0 0 18 12" fill="none">
          {open ? (
            <path d="M3 1l12 10M15 1L3 11" stroke="currentColor" strokeWidth="1.75" />
          ) : (
            <path d="M0 1h18M0 6h18M0 11h18" stroke="currentColor" strokeWidth="1.75" />
          )}
        </svg>
      </button>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="absolute inset-x-0 top-full z-50 h-[calc(100dvh-100%)] overflow-y-auto border-t border-line bg-ink lg:hidden"
        >
          <ul className="wrap flex flex-col py-6">
            {items.map((item) => (
              <li key={item.key} className="border-b border-line">
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`block py-4 font-display text-4xl font-extrabold uppercase ${
                      isActive(pathname, item.href) ? 'text-orange' : ''
                    }`}
                    {...newTabProps(item.newTab)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="block py-4 font-display text-4xl font-extrabold uppercase">
                    {item.label}
                  </span>
                )}
                {item.children.length > 0 && (
                  <ul className="pb-4 pl-4">
                    {item.children.map((child) => (
                      <li key={child.key}>
                        <Link href={child.href} className="block py-2 text-lg text-soft hover:text-orange">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          {cta && (
            <div className="wrap pb-10">
              <Link href={cta.href} className="btn-primary w-full">
                {cta.label}
              </Link>
            </div>
          )}
        </nav>
      )}
    </>
  )
}
