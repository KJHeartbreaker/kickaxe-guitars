import {defineField, defineType} from 'sanity'
import {PinIcon} from '@sanity/icons/Pin'

/**
 * Visit the Shop: address, hours, phone and email, with a map or the
 * storefront photo. Everything comes from Site Settings → Shop Info, so
 * editors only drop the block in; the details stay correct on every page.
 */
export const visitShop = defineType({
  name: 'visitShop',
  title: 'Visit the Shop',
  type: 'object',
  icon: PinIcon,
  description: 'Shows the address, hours, phone and email from Site Settings → Shop Info.',
  fieldsets: [{name: 'design', title: 'Design', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
      description: 'Leave empty to show the street address.',
    }),
    defineField({
      name: 'media',
      title: 'Beside the hours, show',
      type: 'string',
      initialValue: 'map',
      options: {
        list: [
          {title: 'Map', value: 'map'},
          {title: 'Storefront photo', value: 'photo'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'The storefront photo is set in Site Settings → Shop Info.',
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      fieldset: 'design',
      initialValue: 'bone',
      options: {
        list: [
          {title: 'Bone', value: 'bone'},
          {title: 'Black', value: 'ink'},
          {title: 'Cabinet (dark panel)', value: 'cab'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
  ],
  preview: {
    select: {title: 'title', media: 'media'},
    prepare: ({title, media}) => ({
      title: title || 'Visit the Shop',
      subtitle: `Visit the Shop · ${media === 'photo' ? 'Storefront photo' : 'Map'} · details from Shop Info`,
    }),
  },
})
