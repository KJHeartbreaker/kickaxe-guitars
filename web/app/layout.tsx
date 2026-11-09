import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Big_Shoulders, Instrument_Sans, JetBrains_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import UtilityBar from '@/app/components/UtilityBar'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {footerQuery, navigationQuery, settingsQuery} from '@/sanity/lib/queries'
import type {FooterData, Navigation, Settings} from '@/sanity/lib/types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.metaTitle || settings?.title || 'Kickaxe Guitars'
  const description =
    settings?.metaDescription ||
    'Guitars, amps, repairs and lessons in Calgary. An independent guitar shop on 11th Street SW, open seven days a week.'

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.siteUrl ? new URL(settings.siteUrl) : undefined
  } catch {
    // ignore invalid URLs
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${settings?.title || 'Kickaxe Guitars'}`,
      default: title,
    },
    description,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

// Condensed signage type for headlines. The optical-size axis gives the
// display cut at large sizes automatically.
const bigShoulders = Big_Shoulders({
  variable: '--font-big-shoulders',
  subsets: ['latin'],
  axes: ['opsz'],
  display: 'swap',
  // next/font has no metrics for this family, so name the fallback ourselves.
  adjustFontFallback: false,
  fallback: ['Arial Narrow', 'sans-serif'],
})

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
})

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const [settingsResult, navigationResult, footerResult] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: navigationQuery}),
    sanityFetch({query: footerQuery}),
  ])
  // sanityFetch adds Visual Editing (stega) markers to strings; the components
  // take the plain generated types.
  const settings = settingsResult.data as Settings | null
  const navigation = navigationResult.data as Navigation | null
  const footer = footerResult.data as FooterData | null

  return (
    <html
      lang="en-CA"
      className={`${bigShoulders.variable} ${instrumentSans.variable} ${jetbrainsMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-orange px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        {/* The <Toaster> component is responsible for rendering toast notifications used in /app/client-utils.ts and /app/components/DraftModeToast.tsx */}
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/*  Enable Visual Editing, only to be rendered when Draft Mode is enabled */}
            <VisualEditing />
          </>
        )}
        {/* The <SanityLive> component is responsible for making all sanityFetch calls in your application live, so should always be rendered. */}
        <SanityLive onError={handleError} />
        <UtilityBar shopInfo={settings?.shopInfo ?? null} promoBar={settings?.promoBar ?? null} />
        <Header navigation={navigation} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer footer={footer} shopInfo={settings?.shopInfo ?? null} />
        <SpeedInsights />
      </body>
    </html>
  )
}
