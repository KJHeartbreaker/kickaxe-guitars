import type {Metadata} from 'next'

import PageBuilder from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import type {PageBuilderDocument} from '@/sanity/lib/types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const {data: home} = await sanityFetch({query: homePageQuery, stega: false})
  const ogImage = resolveOpenGraphImage(home?.seo?.shareImage)
  return {
    ...(home?.seo?.metaTitle && {title: {absolute: home.seo.metaTitle}}),
    ...(home?.seo?.metaDescription && {description: home.seo.metaDescription}),
    ...(ogImage && {openGraph: {images: [ogImage]}}),
    ...(home?.seo?.noIndex && {robots: {index: false}}),
  } satisfies Metadata
}

export default async function Page() {
  const {data: home} = await sanityFetch({query: homePageQuery})

  if (!home?._id) {
    return (
      <div className="wrap py-24">
        <h1 className="display-lg">Kickaxe Guitars</h1>
        <p className="mt-4 text-soft">Create the Home Page in Sanity Studio to fill this page.</p>
      </div>
    )
  }

  return <PageBuilder page={home as PageBuilderDocument} />
}
