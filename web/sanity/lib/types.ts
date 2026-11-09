import type {
  FooterQueryResult,
  GetPageQueryResult,
  HomePageQueryResult,
  NavigationQueryResult,
  SettingsQueryResult,
} from '@/sanity.types'

type PageSections = NonNullable<NonNullable<GetPageQueryResult>['pageBuilder']>[number]
type HomeSections = NonNullable<NonNullable<HomePageQueryResult>['pageBuilder']>[number]

/** Any block that can appear in a page builder (home page or regular page). */
export type PageBuilderSection = PageSections | HomeSections

/** A single page-builder block of one type, e.g. `Block<'heroSection'>`. */
export type Block<T extends PageBuilderSection['_type']> = Extract<PageBuilderSection, {_type: T}>

/** The page-like document a page builder belongs to. */
export type PageBuilderDocument = {
  _id: string
  _type: string
  pageBuilder?: PageBuilderSection[] | null
}

export type Settings = NonNullable<SettingsQueryResult>
export type ShopInfo = NonNullable<Settings['shopInfo']>
export type Navigation = NonNullable<NavigationQueryResult>
export type FooterData = NonNullable<FooterQueryResult>

// Represents a Link after GROQ dereferencing (page becomes a slug string, "" for home)
export type DereferencedLink = {
  _type: 'link'
  linkType?: 'href' | 'page' | 'phone' | 'email' | 'section'
  href?: string
  section?: string
  page?: string | null
  phone?: string
  email?: string
  openInNewTab?: boolean
}

// Represents a Button whose link has been dereferenced
export type DereferencedButton = {
  buttonText?: string
  variant?: 'primary' | 'secondary' | 'text'
  link?: DereferencedLink | null
}
