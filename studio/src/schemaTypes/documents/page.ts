import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons/Document'

/**
 * Generic page built from the shared page-builder blocks.
 * Learn more: https://www.sanity.io/docs/studio/schema-types
 */

/** The blocks available to the page builder, shared by `page` and `homePage`. */
export const pageBuilderMembers = [
  defineArrayMember({type: 'heroSection'}),
  defineArrayMember({type: 'richTextSection'}),
  defineArrayMember({type: 'mediaText'}),
  defineArrayMember({type: 'gallery'}),
  defineArrayMember({type: 'dividerImage'}),
  defineArrayMember({type: 'marquee'}),
  defineArrayMember({type: 'accordionList'}),
  defineArrayMember({type: 'contactFormSection'}),
  defineArrayMember({type: 'callToAction'}),
]

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Internal name / page title.',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hasTransparentHeader',
      title: 'Transparent header',
      type: 'boolean',
      description: 'Let the hero show through the header at the top of the page.',
      group: 'content',
      initialValue: false,
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
    select: {title: 'name', slug: 'slug.current'},
    prepare({title, slug}) {
      return {title: title || 'Untitled page', subtitle: slug ? `/${slug}` : 'No slug set'}
    },
  },
})
