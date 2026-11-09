import {defineQuery} from 'next-sanity'

/**
 * Links reference a `page` or the `homePage` singleton. We dereference them to
 * a slug string here: a page's slug, or "" for the home page (resolved to "/").
 */
const linkFields = /* groq */ `{
  ...,
  "page": coalesce(page->slug.current, select(page->_type == "homePage" => ""))
}`

const buttonFields = /* groq */ `{
  ...,
  link ${linkFields}
}`

const portableTextFields = /* groq */ `[]{
  ...,
  markDefs[]{
    ...,
    _type == "link" => ${linkFields}
  },
  _type == "ptButtons" => {
    buttons[]${buttonFields}
  }
}`

/** Items in a Two Column row's left or right column. */
const columnItemFields = /* groq */ `{
  ...,
  _type == "columnText" => {content${portableTextFields}},
  _type == "columnImage" => {tagLink ${linkFields}},
  _type == "columnAccordion" => {
    items[]{..., content[]{..., markDefs[]{..., _type == "link" => ${linkFields}}}}
  }
}`

/**
 * One projection shared by the home page and regular pages, so both produce
 * the same block types for the page builder.
 */
const pageBuilderFields = /* groq */ `
  // Disabled blocks stay in the document but never reach the page.
  "pageBuilder": pageBuilder[disabled != true]{
    ...,
    _type == "heroSection" => {
      body${portableTextFields},
      ctas[]${buttonFields}
    },
    // The trail and the default title come from the page itself.
    _type == "pageTitle" => {"pageName": ^.name},
    _type == "visitShop" => {
      "shopInfo": *[_type == "settings"][0].shopInfo
    },
    _type == "cardGrid" => {
      link ${linkFields},
      items[]{..., link ${linkFields}}
    },
    _type == "singleColumn" => {
      content${portableTextFields},
      tagLink ${linkFields}
    },
    _type == "twoColumn" => {
      "left": left[]${columnItemFields},
      "right": right[]${columnItemFields}
    },
    _type == "richTextSection" => {
      content${portableTextFields}
    },
    _type == "mediaText" => {
      content${portableTextFields},
      button${buttonFields}
    },
    _type == "accordionList" => {
      items[]{..., content${portableTextFields}}
    },
    _type == "columnsSection" => {
      columns[]{..., content${portableTextFields}}
    },
    _type == "contactFormSection" => {
      intro${portableTextFields}
    },
    _type == "callToAction" => {
      body${portableTextFields},
      button${buttonFields}
    },
  }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  promoBar{..., link ${linkFields}},
  cookieConsent{..., link ${linkFields}}
}`)

export const navigationQuery = defineQuery(`*[_type == "navigation"][0]{
  items[]{
    _key,
    label,
    link ${linkFields},
    children[]{_key, label, link ${linkFields}}
  },
  ctaButton ${buttonFields}
}`)

export const footerQuery = defineQuery(`*[_type == "footer"][0]{
  blurb,
  columns[]{
    _key,
    title,
    links[]{_key, label, link ${linkFields}}
  },
  social,
  copyright
}`)

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0]{
    _id,
    _type,
    seo,
    ${pageBuilderFields}
  }
`)

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    seo,
    ${pageBuilderFields}
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_updatedAt desc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
