import {defineField, defineType} from 'sanity'

/**
 * A single collapsible item (title + rich-text body), used by the
 * Accordion List page-builder block.
 */

export const accordion = defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContentTextOnly',
    }),
  ],
  preview: {
    select: {title: 'title'},
    prepare({title}) {
      return {title: title || 'Untitled', subtitle: 'Accordion item'}
    },
  },
})
