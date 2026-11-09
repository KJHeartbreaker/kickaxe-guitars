import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'

/**
 * A multi-column section (2–4 columns) of rich text. A curated replacement for
 * the old grid engine's multi-column layouts.
 */

export const columnsSection = defineType({
  name: 'columnsSection',
  title: 'Columns',
  type: 'object',
  icon: ThLargeIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      validation: (Rule) => Rule.min(2).max(4).warning('Columns sections work best with 2–4 columns.'),
      of: [
        defineArrayMember({
          name: 'column',
          title: 'Column',
          type: 'object',
          fields: [defineField({name: 'content', title: 'Content', type: 'blockContent'})],
          preview: {
            select: {content: 'content'},
            prepare({content}) {
              const first = (content || []).find((b: {_type?: string}) => b._type === 'block') as
                | {children?: {text?: string}[]}
                | undefined
              const text = first?.children?.map((c) => c.text).join('')
              return {title: text || 'Column'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {heading: 'heading', columns: 'columns'},
    prepare({heading, columns}) {
      const n = Array.isArray(columns) ? columns.length : 0
      return {title: heading || 'Columns', subtitle: `Columns · ${n} column${n === 1 ? '' : 's'}`}
    },
  },
})
