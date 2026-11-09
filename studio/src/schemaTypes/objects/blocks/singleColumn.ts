import {defineField, defineType} from 'sanity'
import {BlockContentIcon} from '@sanity/icons/BlockContent'

/**
 * Single Column: an eyebrow and rich text in one column, left-aligned or
 * centred, with optional media above or below. Shares Two Column's options
 * (backgrounds, spacing, full bleed, feature tag) so the two read as one family.
 *
 * Text-only is the default: section headings ("The bench / Meet the techs"),
 * intros and statements. With an image and no text it does what Divider Image does.
 */
export const singleColumn = defineType({
  name: 'singleColumn',
  title: 'Single Column',
  type: 'object',
  icon: BlockContentIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'media', title: 'Media'},
    {name: 'tag', title: 'Feature tag'},
    {name: 'layout', title: 'Design'},
  ],
  fields: [
    // Content
    defineField({
      name: 'eyebrow',
      title: 'Small label above the text',
      type: 'string',
      description: 'Optional, e.g. “The bench” or “Lessons”.',
      group: 'content',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      description:
        'Headings, text and components (Buttons, Info strip, Highlights, Accordion). Use Heading 1 only for the first block on a page.',
      group: 'content',
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      group: 'content',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Centre', value: 'center'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'width',
      title: 'Text width',
      type: 'string',
      description: 'How wide the text column can get. Paragraphs always keep a readable line length.',
      group: 'content',
      initialValue: 'wide',
      options: {
        list: [
          {title: 'Narrow', value: 'narrow'},
          {title: 'Normal', value: 'normal'},
          {title: 'Wide', value: 'wide'},
          {title: 'Full', value: 'full'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),

    // Media
    defineField({
      name: 'mediaType',
      title: 'Media',
      type: 'string',
      group: 'media',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Image', value: 'image'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'figure',
      group: 'media',
      hidden: ({parent}) => parent?.mediaType !== 'image',
    }),
    defineField({
      name: 'mediaPosition',
      title: 'Media position',
      type: 'string',
      group: 'media',
      initialValue: 'above',
      options: {
        list: [
          {title: 'Above the text', value: 'above'},
          {title: 'Below the text', value: 'below'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      hidden: ({parent}) => !parent?.mediaType || parent?.mediaType === 'none',
    }),
    defineField({
      name: 'mediaHeight',
      title: 'Media height',
      type: 'string',
      group: 'media',
      initialValue: 'medium',
      options: {
        list: [
          {title: 'Natural', value: 'natural'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
          {title: 'Full screen', value: 'full'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      description: 'Natural keeps the image’s own proportions; the others crop to fit using the hotspot.',
      hidden: ({parent}) => !parent?.mediaType || parent?.mediaType === 'none',
    }),
    defineField({
      name: 'fullBleed',
      title: 'Full bleed',
      type: 'boolean',
      description: 'Run the media to the edge of the window. On very wide screens it stops at about 1920px.',
      group: 'media',
      initialValue: false,
      hidden: ({parent}) => !parent?.mediaType || parent?.mediaType === 'none',
    }),

    // Feature tag
    defineField({
      name: 'tagLabel',
      title: 'Small label',
      type: 'string',
      group: 'tag',
      placeholder: 'Product spotlight',
    }),
    defineField({
      name: 'tagTitle',
      title: 'Title',
      type: 'string',
      description: 'The hang tag pinned to the image. Leave the title empty to hide it.',
      group: 'tag',
    }),
    defineField({
      name: 'tagText',
      title: 'Line',
      type: 'string',
      group: 'tag',
      validation: (Rule) => Rule.max(80).warning('The tag is small. Keep this to one short line.'),
    }),
    defineField({name: 'tagLink', title: 'Link', type: 'link', group: 'tag'}),
    defineField({
      name: 'tagLinkLabel',
      title: 'Link label',
      type: 'string',
      group: 'tag',
      placeholder: 'In stock',
    }),

    // Layout
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      group: 'layout',
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
      name: 'spacing',
      title: 'Spacing',
      type: 'string',
      description: 'Compact suits section headings and short bands.',
      group: 'layout',
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
      description: 'Join this row to the one above, e.g. a grid under a heading row with the same background.',
      group: 'layout',
      initialValue: false,
    }),
    defineField({
      name: 'noPaddingBottom',
      title: 'Remove bottom padding',
      type: 'boolean',
      description: 'Join this row to the one below.',
      group: 'layout',
      initialValue: false,
    }),
    defineField({
      name: 'divider',
      title: 'Line above',
      type: 'boolean',
      description: 'A thin rule above the row, to separate it from the one before.',
      group: 'layout',
      initialValue: false,
    }),
  ],
  preview: {
    select: {eyebrow: 'eyebrow', blocks: 'content', media: 'image', mediaType: 'mediaType'},
    prepare({eyebrow, blocks, media, mediaType}) {
      const firstText = (blocks as {_type?: string; children?: {text?: string}[]}[] | undefined)
        ?.find((b) => b._type === 'block')
        ?.children?.map((c) => c.text)
        .join('')
      const kind = {image: 'Image'}[(mediaType as string) ?? ''] ?? 'Text'
      return {
        title: firstText || eyebrow || 'Single Column',
        subtitle: `Single Column · ${kind}`,
        media: mediaType === 'image' ? media : undefined,
      }
    },
  },
})
