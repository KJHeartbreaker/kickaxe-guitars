import {defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons/SplitHorizontal'

import {columnItemMembers} from '../columnItems'

/**
 * Two Column: an optional heading, then a left and a right column. Each column
 * holds whatever the editor adds: Text, Photo, Photo pair or Accordion.
 *
 * Covers the home page hero (text + photo with a hang tag), "The bench"
 * (photo pair + text), Lessons (full-bleed photo + text), bands (text + text),
 * "What we fix" (heading, photo + accordion) and the tech profiles.
 */
export const twoColumn = defineType({
  name: 'twoColumn',
  title: 'Two Column',
  type: 'object',
  icon: SplitHorizontalIcon,
  fieldsets: [
    {name: 'heading', title: 'Heading above both columns (optional)', options: {collapsible: true, collapsed: true}},
    {name: 'design', title: 'Design', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // Heading above both columns
    defineField({
      name: 'eyebrow',
      title: 'Small label above the title',
      type: 'string',
      fieldset: 'heading',
      placeholder: 'The work',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'heading',
      placeholder: 'What we fix',
    }),

    // The columns
    defineField({
      name: 'left',
      title: 'Left column',
      type: 'array',
      of: columnItemMembers,
      validation: (Rule) => Rule.min(1).error('Add something to the left column'),
    }),
    defineField({
      name: 'right',
      title: 'Right column',
      type: 'array',
      of: columnItemMembers,
      validation: (Rule) => Rule.min(1).error('Add something to the right column'),
    }),

    // Design
    defineField({
      name: 'split',
      title: 'Column widths (left / right)',
      type: 'string',
      fieldset: 'design',
      initialValue: '50-50',
      options: {
        list: [
          {title: '30 / 70', value: '30-70'},
          {title: '40 / 60', value: '40-60'},
          {title: '50 / 50', value: '50-50'},
          {title: '60 / 40', value: '60-40'},
          {title: '70 / 30', value: '70-30'},
          {title: 'Left fits its content', value: 'auto-left'},
          {title: 'Right fits its content', value: 'auto-right'},
        ],
      },
    }),
    defineField({
      name: 'mobileFirst',
      title: 'On phones, show first',
      type: 'string',
      description: 'The columns stack on phones. Which one goes on top?',
      fieldset: 'design',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left column', value: 'left'},
          {title: 'Right column', value: 'right'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      fieldset: 'design',
      initialValue: 'ink',
      options: {
        list: [
          {title: 'Black', value: 'ink'},
          {title: 'Cabinet (dark panel)', value: 'cab'},
          {title: 'Bone', value: 'bone'},
          {title: 'Orange (brand band)', value: 'orange'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'verticalAlign',
      title: 'Vertical alignment',
      type: 'string',
      fieldset: 'design',
      initialValue: 'center',
      options: {
        list: [
          {title: 'Centre', value: 'center'},
          {title: 'Top', value: 'top'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
      description: 'Compact suits short bands, like a call to action.',
      fieldset: 'design',
      initialValue: 'normal',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Compact', value: 'compact'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'noPaddingTop',
      title: 'Remove top padding',
      type: 'boolean',
      description: 'Join this row to the one above.',
      fieldset: 'design',
      initialValue: false,
    }),
    defineField({
      name: 'noPaddingBottom',
      title: 'Remove bottom padding',
      type: 'boolean',
      description: 'Join this row to the one below.',
      fieldset: 'design',
      initialValue: false,
    }),
    defineField({
      name: 'divider',
      title: 'Line above',
      type: 'boolean',
      fieldset: 'design',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'title', left: 'left', right: 'right'},
    prepare({title, left, right}) {
      type Item = {_type?: string; content?: {_type?: string; children?: {text?: string}[]}[]; image?: unknown}
      const items = [...((left as Item[]) ?? []), ...((right as Item[]) ?? [])]
      const firstText = items
        .find((item) => item._type === 'columnText')
        ?.content?.find((b) => b._type === 'block' && b.children?.some((c) => c.text?.trim()))
        ?.children?.map((c) => c.text)
        .join('')
      const names: Record<string, string> = {
        columnText: 'Text',
        columnImage: 'Photo',
        columnImagePair: 'Photo pair',
        columnAccordion: 'Accordion',
      }
      const describe = (col?: Item[]) => (col ?? []).map((item) => names[item._type ?? ''] ?? '?').join(' + ') || 'empty'
      return {
        title: title || firstText || 'Two Column',
        subtitle: `Two Column · ${describe(left as Item[])} | ${describe(right as Item[])}`,
        media: items.find((item) => item.image)?.image as never,
      }
    },
  },
})
