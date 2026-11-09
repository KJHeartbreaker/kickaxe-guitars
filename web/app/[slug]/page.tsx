import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import PageBuilder from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {getPageQuery, pagesSlugs} from '@/sanity/lib/queries'
import type {PageBuilderDocument} from '@/sanity/lib/types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: pagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: PageProps<'/[slug]'>): Promise<Metadata> {
  const params = await props.params
  const {data: page} = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const ogImage = resolveOpenGraphImage(page?.seo?.shareImage)

  return {
    // An editor's SEO title is used as written (it often already names the shop);
    // otherwise the page name goes through the "Name | Kickaxe Guitars" template.
    title: page?.seo?.metaTitle ? {absolute: page.seo.metaTitle} : page?.name,
    ...(page?.seo?.metaDescription && {description: page.seo.metaDescription}),
    ...(ogImage && {openGraph: {images: [ogImage]}}),
    ...(page?.seo?.noIndex && {robots: {index: false}}),
  } satisfies Metadata
}

export default async function Page(props: PageProps<'/[slug]'>) {
  const params = await props.params
  const {data: page} = await sanityFetch({query: getPageQuery, params})

  if (!page?._id) notFound()

  return <PageBuilder page={page as PageBuilderDocument} />
}
