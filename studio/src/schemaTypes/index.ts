// Singletons
import {settings} from './singletons/settings'
import {navigation} from './singletons/navigation'
import {footer} from './singletons/footer'

// Documents
import {homePage} from './documents/homePage'
import {page} from './documents/page'
import {redirect} from './documents/redirect'

// Shared objects / primitives
import {link} from './objects/link'
import button from './objects/button'
import {blockContent} from './objects/blockContent'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {seo} from './objects/seo'
import {socialLink} from './objects/socialLink'
import {figure} from './objects/figure'
import {accordion} from './objects/accordion'
import {navItem} from './objects/navItem'
import {columnText, columnImage, columnImagePair, columnAccordion} from './objects/columnItems'

// Page-builder blocks
import {heroSection} from './objects/blocks/heroSection'
import {twoColumn} from './objects/blocks/twoColumn'
import {singleColumn} from './objects/blocks/singleColumn'
import {cardGrid, cardGridItem} from './objects/blocks/cardGrid'
import {visitShop} from './objects/blocks/visitShop'
import {pageTitle} from './objects/blocks/pageTitle'
import {richTextSection} from './objects/blocks/richTextSection'
import {mediaText} from './objects/blocks/mediaText'
import {gallery} from './objects/blocks/gallery'
import {dividerImage} from './objects/blocks/dividerImage'
import {marquee} from './objects/blocks/marquee'
import {accordionList} from './objects/blocks/accordionList'
import {contactFormSection} from './objects/blocks/contactFormSection'
import {columnsSection} from './objects/blocks/columnsSection'
import {callToAction} from './objects/callToAction'

import {withDisabled} from './helpers/withDisabled'

// Export an array of all the schema types. This is used in the Sanity Studio configuration.
// https://www.sanity.io/docs/studio/schema-types
export const schemaTypes = [
  // Singletons
  settings,
  navigation,
  footer,
  // Documents
  homePage,
  page,
  redirect,
  // Shared objects
  link,
  button,
  blockContent,
  blockContentTextOnly,
  seo,
  socialLink,
  figure,
  accordion,
  navItem,
  cardGridItem,
  columnText,
  columnImage,
  columnImagePair,
  columnAccordion,
  // Page-builder blocks: each gets a "Disabled" switch (see helpers/withDisabled.ts)
  ...[
    pageTitle,
    heroSection,
    twoColumn,
    singleColumn,
    cardGrid,
    visitShop,
    richTextSection,
    mediaText,
    gallery,
    dividerImage,
    marquee,
    accordionList,
    contactFormSection,
    columnsSection,
    callToAction,
  ].map(withDisabled),
]
