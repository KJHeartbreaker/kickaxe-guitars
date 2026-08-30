import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * A full-width image band used to break up a page.
 */

export const dividerImage = defineType({
  name: 'dividerImage',
  title: 'Divider Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'size',
      title: 'Height',
      type: 'string',
      initialValue: 'medium',
      options: {
        list: [
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Full screen', value: 'full'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {media: 'image', title: 'image.alt'},
    prepare({media, title}) {
      return {title: title || 'Divider Image', subtitle: 'Divider Image', media}
    },
  },
})
