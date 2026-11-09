import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons/Text'

/**
 * A block of rich text with optional heading and layout controls.
 * Replaces the starter's `infoSection`.
 */

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich Text',
  type: 'object',
  icon: TextIcon,
  fieldsets: [{name: 'options', title: 'Options', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width',
      type: 'string',
      fieldset: 'options',
      initialValue: 'normal',
      options: {
        list: [
          {title: 'Narrow', value: 'narrow'},
          {title: 'Normal', value: 'normal'},
          {title: 'Wide', value: 'wide'},
          {title: 'Full', value: 'full'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      fieldset: 'options',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Rich Text', subtitle: 'Rich Text'}
    },
  },
})
