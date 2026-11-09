import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThLargeIcon} from '@sanity/icons/ThLarge'

/**
 * Card Grid: a section with an optional heading and a row of items.
 *
 * - Cards: photo, badge, small label, title, text and link on dark panels
 *   ("In stock now").
 * - List: numbered items with an amp-knob dial, divided by hairlines
 *   (the services row).
 *
 * The whole section lives in this one block, so editors never stack rows
 * to build it. Design options are tucked into a collapsed section.
 */
export const cardGrid = defineType({
  name: 'cardGrid',
  title: 'Card Grid',
  type: 'object',
  icon: ThLargeIcon,
  fieldsets: [
    {name: 'heading', title: 'Section heading (optional)', options: {collapsible: true, collapsed: false}},
    {name: 'design', title: 'Design', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    // Heading
    defineField({
      name: 'eyebrow',
      title: 'Small label above the title',
      type: 'string',
      fieldset: 'heading',
      placeholder: 'On the wall this month',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      fieldset: 'heading',
      placeholder: 'In stock now',
    }),
    defineField({
      name: 'intro',
      title: 'Short intro',
      type: 'text',
      rows: 2,
      description: 'Shown beside the title on wide screens.',
      fieldset: 'heading',
    }),
    defineField({
      name: 'linkLabel',
      title: '“See all” link text',
      type: 'string',
      description: 'Shown at the top right, e.g. “All guitars”.',
      fieldset: 'heading',
    }),
    defineField({
      name: 'link',
      title: '“See all” link goes to',
      type: 'link',
      fieldset: 'heading',
    }),

    // Items
    defineField({
      name: 'style',
      title: 'Look',
      type: 'string',
      initialValue: 'cards',
      options: {
        list: [
          {title: 'Photo cards', value: 'cards'},
          {title: 'Numbered list with dials', value: 'list'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'cardGridItem'})],
      validation: (Rule) => Rule.required().min(1).max(8),
    }),

    // Design
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
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
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
      name: 'numbered',
      title: 'Show numbers (list look)',
      type: 'boolean',
      fieldset: 'design',
      initialValue: true,
    }),
    defineField({
      name: 'dials',
      title: 'Show dials (list look)',
      type: 'boolean',
      fieldset: 'design',
      initialValue: true,
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
    select: {title: 'title', eyebrow: 'eyebrow', items: 'items', style: 'style'},
    prepare({title, eyebrow, items, style}) {
      const list = (items as {title?: string; image?: unknown}[] | undefined) ?? []
      const look = style === 'list' ? 'Numbered list' : 'Photo cards'
      return {
        title: title || eyebrow || list.map((item) => item.title).filter(Boolean).join(' · ') || 'Card Grid',
        subtitle: `Card Grid · ${look} · ${list.length} item${list.length === 1 ? '' : 's'}`,
        media: list.find((item) => item.image)?.image as never,
      }
    },
  },
})

/** One card or list item in a Card Grid. */
export const cardGridItem = defineType({
  name: 'cardGridItem',
  title: 'Item',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'figure',
      description: 'Used by the photo cards look.',
    }),
    defineField({
      name: 'badge',
      title: 'Tag on the photo',
      type: 'string',
      description: 'Optional, e.g. “Special · 25% off” or “Just in”.',
    }),
    defineField({
      name: 'badgeHighlight',
      title: 'Make the tag orange',
      type: 'boolean',
      description: 'To make one card stand out.',
      initialValue: false,
    }),
    defineField({
      name: 'kicker',
      title: 'Small label above the title',
      type: 'string',
      placeholder: 'Current special',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'text', title: 'Text', type: 'text', rows: 3}),
    defineField({
      name: 'linkLabel',
      title: 'Link text',
      type: 'string',
      placeholder: 'Full specs',
    }),
    defineField({name: 'link', title: 'Link goes to', type: 'link'}),
  ],
  preview: {
    select: {title: 'title', kicker: 'kicker', text: 'text', media: 'image'},
    prepare: ({title, kicker, text, media}) => ({
      title: title || 'Item',
      subtitle: [kicker, text].filter(Boolean).join(' · '),
      media,
    }),
  },
})
