import type {NextConfig} from 'next'
import {createClient} from 'next-sanity'

/**
 * Redirects are managed in Sanity (the "Redirect" document type) so editors
 * can keep old URLs working. They are read once at build time.
 */
async function sanityRedirects() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) return []

  const client = createClient({
    projectId,
    dataset,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-09-25',
    useCdn: false,
    perspective: 'published',
    token: process.env.SANITY_API_READ_TOKEN,
  })

  try {
    const redirects = await client.fetch<{from: string; to: string; permanent?: boolean}[]>(
      `*[_type == "redirect" && defined(from) && defined(to)]{from, to, permanent}`,
    )
    return redirects
      .filter((r) => r.from.startsWith('/'))
      .map((r) => ({source: r.from, destination: r.to, permanent: Boolean(r.permanent)}))
  } catch (error) {
    console.warn('Could not load redirects from Sanity:', error)
    return []
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
  redirects: sanityRedirects,
}

export default nextConfig
