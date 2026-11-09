import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'
import type {Link} from '../../../sanity.types'

/**
 * Link object. The editor first picks the link type, then provides an external
 * URL, an internal reference (a page or the home page), a phone number or an
 * email address. Phone and email become tel: and mailto: links on the site.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      // No default: an optional link (like a feature tag's) stays empty until
      // an editor picks a type, instead of starting as "a URL with no URL".
      options: {
        list: [
          {title: 'URL', value: 'href'},
          {title: 'Internal page', value: 'page'},
          {title: 'Phone', value: 'phone'},
          {title: 'Email', value: 'email'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'External link, e.g. https://reverb.com/… (tel: and mailto: work too).',
      hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
      validation: (Rule) => [
        Rule.uri({scheme: ['http', 'https', 'tel', 'mailto']}).error(
          'Use a full web address (https://…), or tel: / mailto:',
        ),
        // Missing URL is a warning, not an error: an unfinished optional link
        // just doesn't show on the site, and shouldn't block publishing.
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'href' && !value) {
            return 'Add a URL, or this link won’t show on the site'
          }
          return true
        }).warning(),
      ],
    }),
    defineField({
      name: 'page',
      title: 'Internal page',
      type: 'reference',
      to: [{type: 'page'}, {type: 'homePage'}],
      hidden: ({parent}) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as Link
          if (parent?.linkType === 'page' && !value) {
            return 'Choose a page, or this link won’t show on the site'
          }
          return true
        }).warning(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone number',
      type: 'string',
      description: 'Type it as you would write it. Tapping the link calls this number on a phone.',
      placeholder: '403-410-9199',
      hidden: ({parent}) => parent?.linkType !== 'phone',
      validation: (Rule) => [
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          if (parent?.linkType !== 'phone' || !value) return true
          const digits = String(value).replace(/\D/g, '')
          return digits.length >= 7 ? true : 'That doesn’t look like a full phone number'
        }),
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          return parent?.linkType === 'phone' && !value
            ? 'Add a phone number, or this link won’t show on the site'
            : true
        }).warning(),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email address',
      type: 'string',
      description: 'Opens a new email to this address.',
      hidden: ({parent}) => parent?.linkType !== 'email',
      validation: (Rule) => [
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          if (parent?.linkType !== 'email' || !value) return true
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim())
            ? true
            : 'That doesn’t look like an email address'
        }),
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          return parent?.linkType === 'email' && !value
            ? 'Add an email address, or this link won’t show on the site'
            : true
        }).warning(),
      ],
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) => parent?.linkType === 'phone' || parent?.linkType === 'email',
    }),
  ],
})
