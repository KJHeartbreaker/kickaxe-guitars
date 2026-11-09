import {defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Page Title: the big title at the top of an inner page, with a "Home / Page"
 * trail above it and an optional short line beside it. The title defaults to
 * the page's name, so most of the time editors only write the intro.
 */
export const pageTitle = defineType({
  name: 'pageTitle',
  title: 'Page Title',
  type: 'object',
  icon: DocumentTextIcon,
  description: 'The big title at the top of the page. Use it once, as the first block.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title (optional)',
      type: 'string',
      description: 'Leave empty to use the page name. Keep it short: it is shown very large.',
      validation: (Rule) => Rule.max(24).warning('Long titles get very big. Try a word or two.'),
    }),
    defineField({
      name: 'intro',
      title: 'Short intro (optional)',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown beside the title.',
      validation: (Rule) => Rule.max(200).warning('Keep this to one or two sentences.'),
    }),
    defineField({
      name: 'showTrail',
      title: 'Show “Home / page name” above the title',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', intro: 'intro'},
    prepare: ({title, intro}) => ({
      title: title || 'Page Title (uses the page name)',
      subtitle: intro ? `Page Title · ${intro}` : 'Page Title',
    }),
  },
})
