import {defineArrayMember, defineField, defineType, type FieldDefinition} from 'sanity'
import {TextIcon} from '@sanity/icons/Text'
import {ImageIcon} from '@sanity/icons/Image'
import {ImagesIcon} from '@sanity/icons/Images'
import {ChevronDownIcon} from '@sanity/icons/ChevronDown'

/**
 * The things an editor can put in a Two Column row's left or right column.
 * Each column is a short list of these; most hold just one.
 */

/** The optional hang tag pinned to a photo (e.g. a featured brand). */
const hangTagFields: FieldDefinition[] = [
  defineField({
    name: 'tagTitle',
    title: 'Tag title',
    type: 'string',
    description: 'Leave empty for no tag.',
    fieldset: 'tag',
    placeholder: 'Godin',
  }),
  defineField({
    name: 'tagLabel',
    title: 'Small label',
    type: 'string',
    fieldset: 'tag',
    placeholder: 'Product spotlight',
  }),
  defineField({
    name: 'tagText',
    title: 'Line',
    type: 'string',
    fieldset: 'tag',
    validation: (Rule) => Rule.max(80).warning('The tag is small. Keep this to one short line.'),
  }),
  defineField({name: 'tagLinkLabel', title: 'Link text', type: 'string', fieldset: 'tag', placeholder: 'In stock'}),
  defineField({name: 'tagLink', title: 'Link goes to', type: 'link', fieldset: 'tag'}),
]
const tagFieldset = {name: 'tag', title: 'Hang tag (optional)', options: {collapsible: true, collapsed: true}}

const fullBleedField = defineField({
  name: 'fullBleed',
  title: 'Run to the edge of the window',
  type: 'boolean',
  description: 'Only when this is the only thing in its column. Stops at about 1920px on very wide screens.',
  initialValue: false,
})

export const columnText = defineType({
  name: 'columnText',
  title: 'Text',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'content',
      title: 'Text',
      type: 'blockContent',
      description:
        'Use “Heading 4 (small label)” for the small orange label above a heading. Buttons, Info strip and Highlights are in the toolbar.',
    }),
  ],
  preview: {
    select: {blocks: 'content'},
    prepare({blocks}) {
      const text = (blocks as {_type?: string; children?: {text?: string}[]}[] | undefined)
        ?.filter((b) => b._type === 'block')
        .map((b) => b.children?.map((c) => c.text).join(''))
        .filter(Boolean)
        .slice(0, 2)
        .join(' · ')
      return {title: text || 'Text', subtitle: 'Text'}
    },
  },
})

export const columnImage = defineType({
  name: 'columnImage',
  title: 'Photo',
  type: 'object',
  icon: ImageIcon,
  fieldsets: [tagFieldset],
  fields: [
    defineField({name: 'image', title: 'Photo', type: 'figure', validation: (Rule) => Rule.required()}),
    fullBleedField,
    ...hangTagFields,
  ],
  preview: {
    select: {media: 'image', alt: 'image.alt', tag: 'tagTitle'},
    prepare: ({media, alt, tag}) => ({title: alt || 'Photo', subtitle: tag ? `Photo · tag: ${tag}` : 'Photo', media}),
  },
})

export const columnImagePair = defineType({
  name: 'columnImagePair',
  title: 'Photo pair',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({name: 'image', title: 'First photo', type: 'figure', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'secondImage',
      title: 'Second photo',
      type: 'figure',
      description: 'Shown beside the first, set a little lower.',
    }),
  ],
  preview: {
    select: {media: 'image', alt: 'image.alt', alt2: 'secondImage.alt'},
    prepare: ({media, alt, alt2}) => ({
      title: [alt, alt2].filter(Boolean).join(' + ') || 'Photo pair',
      subtitle: 'Photo pair',
      media,
    }),
  },
})

export const columnAccordion = defineType({
  name: 'columnAccordion',
  title: 'Accordion',
  type: 'object',
  icon: ChevronDownIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'accordion'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({name: 'firstOpen', title: 'Open the first item', type: 'boolean', initialValue: true}),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const list = (items as {title?: string}[] | undefined) ?? []
      return {
        title: list.map((item) => item.title).filter(Boolean).join(' · ') || 'Accordion',
        subtitle: `Accordion · ${list.length} item${list.length === 1 ? '' : 's'}`,
      }
    },
  },
})

/** What a column can hold, in the order the "Add item" menu shows them. */
export const columnItemMembers = [
  defineArrayMember({type: 'columnText'}),
  defineArrayMember({type: 'columnImage'}),
  defineArrayMember({type: 'columnImagePair'}),
  defineArrayMember({type: 'columnAccordion'}),
]
