import type {ComponentType} from 'react'
import {stegaClean} from 'next-sanity'

import AccordionList from '@/app/components/blocks/AccordionList'
import CardGrid from '@/app/components/blocks/CardGrid'
import Columns from '@/app/components/blocks/Columns'
import ContactForm from '@/app/components/blocks/ContactForm'
import Cta from '@/app/components/blocks/Cta'
import DividerImage from '@/app/components/blocks/DividerImage'
import Gallery from '@/app/components/blocks/Gallery'
import Hero from '@/app/components/blocks/Hero'
import Marquee from '@/app/components/blocks/Marquee'
import MediaText from '@/app/components/blocks/MediaText'
import PageTitle from '@/app/components/blocks/PageTitle'
import RichText from '@/app/components/blocks/RichText'
import SingleColumn from '@/app/components/blocks/SingleColumn'
import TwoColumn from '@/app/components/blocks/TwoColumn'
import VisitShop from '@/app/components/blocks/VisitShop'
import {dataAttr} from '@/sanity/lib/utils'
import type {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

// Each component takes its own block type; the renderer picks it by `_type`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Blocks: Record<PageBuilderSection['_type'], ComponentType<{block: any; index: number}>> = {
  pageTitle: PageTitle,
  heroSection: Hero,
  twoColumn: TwoColumn,
  singleColumn: SingleColumn,
  cardGrid: CardGrid,
  visitShop: VisitShop,
  richTextSection: RichText,
  mediaText: MediaText,
  gallery: Gallery,
  dividerImage: DividerImage,
  marquee: Marquee,
  accordionList: AccordionList,
  contactFormSection: ContactForm,
  columnsSection: Columns,
  callToAction: Cta,
}

/**
 * Used by the <PageBuilder>, this renders the component that matches the
 * block type, wrapped with the data attribute Visual Editing needs.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  const Component = Blocks[block._type]
  if (!Component) return null
  // A jump-link name lets "Section on this page" links scroll here.
  const anchor = stegaClean((block as {anchor?: string}).anchor)?.trim() || undefined

  return (
    <div
      id={anchor}
      className={anchor ? 'scroll-mt-24' : undefined}
      data-sanity={dataAttr({
        id: pageId,
        type: pageType,
        path: `pageBuilder[_key=="${block._key}"]`,
      }).toString()}
    >
      <Component block={block} index={index} />
    </div>
  )
}
