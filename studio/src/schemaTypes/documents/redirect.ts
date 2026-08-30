import {defineField, defineType} from 'sanity'
import {ArrowRightIcon} from '@sanity/icons/ArrowRight'

/**
 * A URL redirect. Useful for preserving old links from the previous site.
 */

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
      description: 'The old path, e.g. /old-page',
      validation: (Rule) =>
        Rule.required().custom((value) =>
          value && !value.startsWith('/') ? 'Path must start with "/"' : true,
        ),
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
      description: 'The destination path or URL.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (301)',
      type: 'boolean',
      description: 'On = 301 permanent redirect, Off = 302 temporary.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'from', to: 'to', permanent: 'permanent'},
    prepare({title, to, permanent}) {
      return {title: `${title} → ${to}`, subtitle: permanent ? '301 Permanent' : '302 Temporary'}
    },
  },
})
