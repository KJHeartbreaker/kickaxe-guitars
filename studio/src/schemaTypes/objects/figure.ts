import {defineField, defineType} from 'sanity'
import {ImageIcon} from '@sanity/icons/Image'

/**
 * Reusable image object with required alt text and an optional caption.
 * Use this instead of a bare `image` type so accessibility is enforced everywhere.
 */

export const figure = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describes the image for screen readers and search engines.',
      validation: (Rule) =>
        Rule.custom((alt, context) => {
          const parent = context.parent as {asset?: {_ref?: string}}
          if (parent?.asset?._ref && !alt) {
            return 'Alternative text is required once an image is added.'
          }
          return true
        }),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption shown beneath the image.',
    }),
  ],
  preview: {
    select: {media: 'asset', title: 'alt', subtitle: 'caption'},
    prepare({media, title, subtitle}) {
      return {title: title || 'Image', subtitle, media}
    },
  },
})
