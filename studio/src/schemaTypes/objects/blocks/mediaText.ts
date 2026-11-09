import {defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'

/**
 * Two-column image + text section, with the image on either side.
 */

export const mediaText = defineType({
  name: 'mediaText',
  title: 'Media & Text',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'content', title: 'Content', type: 'blockContentTextOnly'}),
    defineField({name: 'button', title: 'Button', type: 'button'}),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Media & Text', subtitle: 'Media & Text', media}
    },
  },
})
