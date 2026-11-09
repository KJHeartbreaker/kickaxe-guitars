import {CogIcon} from '@sanity/icons/Cog'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Site-wide settings singleton: general info, default SEO/share, the promo bar
 * and the cookie-consent notice. Navigation and footer are separate singletons.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'shop', title: 'Shop Info'},
    {name: 'seo', title: 'SEO'},
    {name: 'promo', title: 'Promo Bar'},
    {name: 'cookie', title: 'Cookie Notice'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      description: 'The name of the site, used in the browser tab and metadata.',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'The production URL, used for canonical links and sitemaps.',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'general',
      options: {hotspot: false},
    }),
    defineField({
      name: 'shopInfo',
      title: 'Shop info',
      type: 'object',
      group: 'shop',
      description:
        'Shown in the strip above the header, the footer and the "Visit the Shop" block.',
      options: {collapsible: false},
      fields: [
        defineField({
          name: 'address',
          title: 'Street address',
          type: 'string',
          placeholder: '1409A 11 Street SW',
        }),
        defineField({
          name: 'cityLine',
          title: 'City, province and postal code',
          type: 'string',
          placeholder: 'Calgary, AB T2R 1G7',
        }),
        defineField({name: 'phone', title: 'Phone', type: 'string', placeholder: '403-410-9199'}),
        defineField({
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule) => Rule.email(),
        }),
        defineField({
          name: 'mapUrl',
          title: 'Directions link',
          type: 'url',
          description: 'A Google Maps (or similar) link for "Get directions".',
        }),
        defineField({
          name: 'hours',
          title: 'Opening hours',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'hoursRow',
              title: 'Hours',
              type: 'object',
              fields: [
                defineField({
                  name: 'days',
                  title: 'Days',
                  type: 'string',
                  placeholder: 'Mon–Fri',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'opens',
                  title: 'Opens',
                  type: 'string',
                  placeholder: '11:30',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'closes',
                  title: 'Closes',
                  type: 'string',
                  placeholder: '5:30',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'weekdays',
                  title: 'Which days does this row cover?',
                  description: 'Used to show "Open today" in the strip above the header.',
                  type: 'array',
                  of: [defineArrayMember({type: 'string'})],
                  options: {
                    layout: 'grid',
                    list: [
                      {title: 'Mon', value: '1'},
                      {title: 'Tue', value: '2'},
                      {title: 'Wed', value: '3'},
                      {title: 'Thu', value: '4'},
                      {title: 'Fri', value: '5'},
                      {title: 'Sat', value: '6'},
                      {title: 'Sun', value: '0'},
                    ],
                  },
                }),
              ],
              preview: {
                select: {days: 'days', opens: 'opens', closes: 'closes'},
                prepare: ({days, opens, closes}) => ({title: days, subtitle: `${opens ?? ''} – ${closes ?? ''}`}),
              },
            }),
          ],
        }),
        defineField({
          name: 'photo',
          title: 'Storefront photo',
          type: 'figure',
          description: 'Used by the "Visit the Shop" block when it is set to show the storefront photo.',
        }),
        defineField({
          name: 'note',
          title: 'Visit note',
          type: 'string',
          description: 'A short line under the address, e.g. parking.',
          placeholder: 'Free parking on 11th Street SW on weekends.',
        }),
      ],
    }),
    defineField({
      name: 'metaTitle',
      title: 'Default meta title',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60).warning('Longer titles may be truncated.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (Rule) => Rule.max(160).warning('Longer descriptions may be truncated.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social share image',
      type: 'image',
      description: 'Fallback image for social cards and search results (1200×630).',
      group: 'seo',
      options: {hotspot: true, aiAssist: {imageDescriptionField: 'alt'}},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Important for accessibility and SEO.',
          validation: (Rule) =>
            Rule.custom((alt, context) => {
              const parent = context.parent as {asset?: {_ref?: string}}
              return parent?.asset?._ref && !alt ? 'Required' : true
            }),
        }),
      ],
    }),
    defineField({
      name: 'promoBar',
      title: 'Promo Bar',
      type: 'object',
      group: 'promo',
      options: {collapsible: false},
      fields: [
        defineField({name: 'enabled', title: 'Show promo bar', type: 'boolean', initialValue: false}),
        defineField({name: 'text', title: 'Text', type: 'string'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({
      name: 'cookieConsent',
      title: 'Cookie Notice',
      type: 'object',
      group: 'cookie',
      options: {collapsible: false},
      fields: [
        defineField({name: 'message', title: 'Message', type: 'text', rows: 2}),
        defineField({name: 'link', title: 'Policy link', type: 'link'}),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})
