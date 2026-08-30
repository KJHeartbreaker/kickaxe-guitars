import {defineArrayMember, defineField, defineType} from 'sanity'
import {TransferIcon} from '@sanity/icons/Transfer'

/**
 * A horizontally scrolling ticker of text and/or images.
 */

export const marquee = defineType({
  name: 'marquee',
  title: 'Marquee',
  type: 'object',
  icon: TransferIcon,
  fieldsets: [{name: 'options', title: 'Options', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          name: 'marqueeText',
          title: 'Text',
          type: 'object',
          fields: [defineField({name: 'text', title: 'Text', type: 'string'})],
          preview: {
            select: {title: 'text'},
            prepare({title}) {
              return {title: title || 'Text'}
            },
          },
        }),
        defineArrayMember({type: 'figure', title: 'Image'}),
      ],
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'number',
      fieldset: 'options',
      initialValue: 0.5,
      description: '0 (slow) to 1 (fast).',
      validation: (Rule) => Rule.min(0).max(1).precision(1),
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse direction',
      type: 'boolean',
      fieldset: 'options',
      initialValue: false,
    }),
    defineField({
      name: 'pausable',
      title: 'Pause on hover',
      type: 'boolean',
      fieldset: 'options',
      initialValue: true,
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {title: 'Marquee', subtitle: `${count} item${count === 1 ? '' : 's'}`}
    },
  },
})
