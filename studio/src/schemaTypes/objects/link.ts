import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons/Link'
import type {Link} from '../../../sanity.types'

/**
 * Link object. The editor first picks the link type, then provides an external
 * URL, an internal reference (a page or the home page), a phone number, an
 * email address, or a section further down the same page. Phone and email
 * become tel: and mailto: links on the site; a section becomes #name.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

/** Jump-link names: lower-case letters, numbers and single dashes, e.g. rick-turner. */
export function isJumpName(value: string) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)
}

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
          {title: 'Section on this page', value: 'section'},
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
      name: 'section',
      title: 'Section on this page',
      type: 'string',
      description:
        'The jump-link name of a block on this page, e.g. teye. Set it on that block under “Jump-link name”.',
      placeholder: 'teye',
      hidden: ({parent}) => parent?.linkType !== 'section',
      validation: (Rule) => [
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          if (parent?.linkType !== 'section' || !value) return true
          return isJumpName(String(value))
            ? true
            : 'Use lower-case letters, numbers and dashes only, e.g. rick-turner'
        }),
        Rule.custom((value, context) => {
          const parent = context.parent as {linkType?: string}
          if (parent?.linkType !== 'section') return true
          if (!value) return 'Add the section’s jump-link name, or this link won’t show on the site'
          // Only pages have a page builder; links in settings or the menu can't be checked.
          const blocks = (context.document as {pageBuilder?: {anchor?: string; disabled?: boolean}[]})
            ?.pageBuilder
          if (!Array.isArray(blocks)) return true
          return blocks.some((block) => block.anchor === value && !block.disabled)
            ? true
            : `No block on this page has the jump-link name “${value}”`
        }).warning(),
      ],
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({parent}) =>
        parent?.linkType === 'phone' || parent?.linkType === 'email' || parent?.linkType === 'section',
    }),
  ],
})
