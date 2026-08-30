import {defineArrayMember, defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons/Images'

/**
 * A collection of images shown as a grid or carousel.
 */

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fieldsets: [{name: 'options', title: 'Options', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({type: 'figure'})],
      validation: (Rule) => Rule.required().min(1),
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      fieldset: 'options',
      initialValue: 'grid',
      options: {
        list: [
          {title: 'Grid', value: 'grid'},
          {title: 'Carousel', value: 'carousel'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      fieldset: 'options',
      initialValue: 3,
      options: {list: [2, 3, 4]},
      hidden: ({parent}) => parent?.layout === 'carousel',
    }),
  ],
  preview: {
    select: {title: 'heading', images: 'images', media: 'images.0'},
    prepare({title, images, media}) {
      const count = Array.isArray(images) ? images.length : 0
      return {
        title: title || 'Gallery',
        subtitle: `Gallery · ${count} image${count === 1 ? '' : 's'}`,
        media,
      }
    },
  },
})
