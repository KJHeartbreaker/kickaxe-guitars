import Link from 'next/link'

import {linkResolver} from '@/sanity/lib/utils'
import {DereferencedLink} from '@/sanity/lib/types'

interface ResolvedLinkProps {
  link: DereferencedLink
  children: React.ReactNode
  className?: string
}

export default function ResolvedLink({link, children, className}: ResolvedLinkProps) {
  // resolveLink() is used to determine the type of link and return the appropriate URL.
  const resolvedLink = linkResolver(link)

  if (typeof resolvedLink === 'string' && !resolvedLink.startsWith('/')) {
    // External, tel: and mailto: links are plain anchors, not client-side routes.
    const newTab = link?.openInNewTab && /^https?:/.test(resolvedLink)
    return (
      <a
        href={resolvedLink}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </a>
    )
  }

  if (typeof resolvedLink === 'string') {
    return (
      <Link
        href={resolvedLink}
        target={link?.openInNewTab ? '_blank' : undefined}
        rel={link?.openInNewTab ? 'noopener noreferrer' : undefined}
        className={className}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}
