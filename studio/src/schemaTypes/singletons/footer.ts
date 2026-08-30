import {defineArrayMember, defineField, defineType} from 'sanity'
import {StackCompactIcon} from '@sanity/icons/StackCompact'

/**
 * Footer singleton: a short blurb, columns of links, social links and a
 * copyright line.
 */

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  icon: StackCompactIcon,
  fields: [
    defineField({
      name: 'blurb',
      title: 'Blurb',
      type: 'text',
      rows: 3,
      description: 'A short line of copy shown in the footer.',
    }),
    defineField({
      name: 'columns',
      title: 'Link columns',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'footerColumn',
          title: 'Column',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'footerLink',
                  title: 'Link',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({name: 'link', title: 'Link', type: 'link'}),
                  ],
                  preview: {
                    select: {title: 'label'},
                    prepare({title}) {
                      return {title: title || 'Untitled'}
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {title: 'title', links: 'links'},
            prepare({title, links}) {
              const count = Array.isArray(links) ? links.length : 0
              return {title: title || 'Column', subtitle: `${count} link${count === 1 ? '' : 's'}`}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({type: 'socialLink'})],
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright line',
      type: 'string',
      description: 'Shown at the bottom of the footer. The year can be added automatically on the site.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Footer'}
    },
  },
})
