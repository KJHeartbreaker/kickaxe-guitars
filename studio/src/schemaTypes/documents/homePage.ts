import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'
import {pageBuilderMembers} from './page'

/**
 * The home page. A singleton (only one exists) built from the same page-builder
 * blocks as regular pages.
 */

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'hasTransparentHeader',
      title: 'Transparent header',
      type: 'boolean',
      description: 'Let the hero show through the header at the top of the page.',
      group: 'content',
      initialValue: true,
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      group: 'content',
      of: pageBuilderMembers,
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({name: 'seo', title: 'SEO & Social', type: 'seo', group: 'seo'}),
  ],
  preview: {
    prepare() {
      return {title: 'Home Page'}
    },
  },
})
