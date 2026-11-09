import {defineArrayMember, defineField, defineType} from 'sanity'
import {TransferIcon} from '@sanity/icons/Transfer'

/**
 * A horizontally scrolling ticker of brand names (a quick tag-style list)
 * and/or logos. The words were once objects in an `items` array, one modal
 * each; they moved to a plain string list so editors can type them in one go.
 */

export const marquee = defineType({
  name: 'marquee',
  title: 'Marquee',
  type: 'object',
  icon: TransferIcon,
  fieldsets: [{name: 'options', title: 'Options', options: {collapsible: true, collapsed: true}}],
  fields: [
    defineField({
      name: 'words',
      title: 'Brands or words',
      type: 'array',
      description:
        'Type a brand and press Enter, then the next. You can also paste a list separated by commas. Drag to reorder.',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      description: 'Optional images, shown after the words.',
      of: [defineArrayMember({type: 'figure', title: 'Logo'})],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'speed',
      title: 'Speed',
      type: 'number',
      fieldset: 'options',
      initialValue: 0.5,
      description: '0 (slow) to 1 (fast).',
      validation: (Rule) => Rule.min(0).max(1).precision(1),
    }),
    defineField({
      name: 'reverse',
      title: 'Reverse direction',
      type: 'boolean',
      fieldset: 'options',
      initialValue: false,
    }),
    defineField({
      name: 'pausable',
      title: 'Pause on hover',
      type: 'boolean',
      fieldset: 'options',
      initialValue: true,
    }),
  ],
  validation: (Rule) =>
    Rule.custom((value: {words?: string[]; logos?: unknown[]} | undefined) =>
      value?.words?.length || value?.logos?.length ? true : 'Add at least one brand or logo',
    ),
  preview: {
    select: {words: 'words', logos: 'logos'},
    prepare({words, logos}) {
      const list = (words as string[] | undefined) ?? []
      const logoCount = (logos as unknown[] | undefined)?.length ?? 0
      return {
        title: list.join(' / ') || 'Marquee',
        subtitle: `Marquee${logoCount ? ` · ${logoCount} logo${logoCount === 1 ? '' : 's'}` : ''}`,
      }
    },
  },
})
