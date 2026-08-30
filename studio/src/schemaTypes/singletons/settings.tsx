import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

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
