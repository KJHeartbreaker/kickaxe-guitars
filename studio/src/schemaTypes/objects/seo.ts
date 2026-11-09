import {defineField, defineType} from 'sanity'
import {SearchIcon} from '@sanity/icons/Search'

/**
 * Reusable SEO / social-sharing object. Embedded on every content document so
 * editors can override the site-wide defaults per page.
 */

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides the browser/tab and search-result title. Aim for 50–60 characters.',
      validation: (Rule) =>
        Rule.max(60).warning('Titles longer than 60 characters may be truncated by search engines.'),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'The snippet shown in search results. Aim for ~150–160 characters.',
      validation: (Rule) =>
        Rule.max(160).warning('Descriptions longer than 160 characters may be truncated.'),
    }),
    defineField({
      name: 'shareImage',
      title: 'Social share image',
      type: 'image',
      description: 'Used when the page is shared on social media. Recommended size 1200×630.',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      description: 'Prevent this page from being indexed (adds a noindex directive).',
      initialValue: false,
    }),
  ],
})
