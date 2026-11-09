import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {MenuIcon} from '@sanity/icons/Menu'
import {StackCompactIcon} from '@sanity/icons/StackCompact'
import {DocumentIcon} from '@sanity/icons/Document'
import {ArrowRightIcon} from '@sanity/icons/ArrowRight'
import {ControlsIcon} from '@sanity/icons/Controls'
import type {StructureResolver} from 'sanity/structure'

/**
 * Intentional studio structure: content up top, site-wide configuration grouped
 * under "Site". Singletons are pinned to fixed document IDs so there is exactly
 * one of each. Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Kickaxe Guitars')
    .items([
      S.listItem()
        .title('Home Page')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.documentTypeListItem('page').title('Pages').icon(DocumentIcon),
      S.divider(),
      S.listItem()
        .title('Site')
        .icon(ControlsIcon)
        .child(
          S.list()
            .title('Site')
            .items([
              S.listItem()
                .title('Navigation')
                .icon(MenuIcon)
                .child(S.document().schemaType('navigation').documentId('navigation')),
              S.listItem()
                .title('Footer')
                .icon(StackCompactIcon)
                .child(S.document().schemaType('footer').documentId('footer')),
              S.listItem()
                .title('Site Settings')
                .icon(CogIcon)
                .child(S.document().schemaType('settings').documentId('siteSettings')),
              S.documentTypeListItem('redirect').title('Redirects').icon(ArrowRightIcon),
            ]),
        ),
    ])
