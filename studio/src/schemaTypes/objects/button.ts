import {defineField, defineType} from 'sanity'

/**
 * A labelled, linked button used in heroes, CTAs and media/text sections.
 */

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Button Link',
      type: 'link',
      options: {collapsible: true, collapsed: false},
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Primary', value: 'primary'},
          {title: 'Secondary', value: 'secondary'},
          {title: 'Text / link', value: 'text'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {title: 'buttonText', subtitle: 'variant'},
    prepare({title, subtitle}) {
      return {title: title || 'Button', subtitle: subtitle ? `${subtitle} button` : 'Button'}
    },
  },
  options: {collapsible: true},
})
