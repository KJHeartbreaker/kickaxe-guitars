import {MetadataRoute} from 'next'
import {sanityFetch} from '@/sanity/lib/live'
import {sitemapData} from '@/sanity/lib/queries'
import {headers} from 'next/headers'

/**
 * Creates a sitemap (sitemap.xml) for the application. Learn more:
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPages = await sanityFetch({query: sitemapData})
  const headersList = await headers()
  const domain = headersList.get('host') as string

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: domain,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: 'monthly',
    },
  ]

  if (allPages?.data?.length) {
    for (const page of allPages.data) {
      sitemap.push({
        url: `${domain}/${page.slug}`,
        lastModified: page._updatedAt || new Date(),
        priority: 0.8,
        changeFrequency: 'monthly',
      })
    }
  }

  return sitemap
}
