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

// Page-builder blocks
import {heroSection} from './objects/blocks/heroSection'
import {richTextSection} from './objects/blocks/richTextSection'
import {mediaText} from './objects/blocks/mediaText'
import {gallery} from './objects/blocks/gallery'
import {dividerImage} from './objects/blocks/dividerImage'
import {marquee} from './objects/blocks/marquee'
import {accordionList} from './objects/blocks/accordionList'
import {contactFormSection} from './objects/blocks/contactFormSection'
import {columnsSection} from './objects/blocks/columnsSection'
import {callToAction} from './objects/callToAction'

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
  // Page-builder blocks
  heroSection,
  richTextSection,
  mediaText,
  gallery,
  dividerImage,
  marquee,
  accordionList,
  contactFormSection,
  columnsSection,
  callToAction,
]
