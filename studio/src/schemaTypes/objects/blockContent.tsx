import {defineArrayMember, defineField, defineType} from 'sanity'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'
import {ThListIcon} from '@sanity/icons/ThList'
import {TagsIcon} from '@sanity/icons/Tags'
import {RemoveIcon} from '@sanity/icons/Remove'

const ORANGE = '#ED8917'

const AccentIcon = () => <span style={{fontWeight: 700, color: ORANGE}}>A</span>
const AccentDecorator = (props: {children?: React.ReactNode}) => (
  <span style={{color: ORANGE}}>{props.children}</span>
)

/**
 * The rich-text (Portable Text) editor used across the site. Reuse it with:
 *  {name: 'content', title: 'Content', type: 'blockContent'}
 *
 * Besides text it holds a few components that sit in the flow of the copy:
 * - Buttons: one or two CTAs in a row
 * - Info strip: rows with a small label, a name and one line (people, services)
 * - Highlights: a short list shown as small mono labels
 *
 * Use Shift+Enter for a line break inside a heading ("Pick it. / Play it.").
 * "Small print" is a small mono line for fine print (conditions, footnotes).
 * The Accent decorator sets the selected text in Kickaxe orange.
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Heading 1 (page title)', value: 'h1'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4 (small label)', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
        {title: 'Small print', value: 'small'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Number', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
          {title: 'Accent (orange)', value: 'accent', icon: AccentIcon, component: AccentDecorator},
        ],
        annotations: [{name: 'link', title: 'Link', type: 'link'}],
      },
    }),
    defineArrayMember({
      name: 'ptButtons',
      title: 'Buttons',
      type: 'object',
      icon: BulbOutlineIcon,
      fields: [
        defineField({
          name: 'buttons',
          title: 'Buttons',
          type: 'array',
          of: [defineArrayMember({type: 'button'})],
          validation: (Rule) => Rule.min(1).max(2),
        }),
        defineField({
          name: 'align',
          title: 'Alignment',
          type: 'string',
          initialValue: 'left',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Centre', value: 'center'},
              {title: 'Right', value: 'right'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
        }),
      ],
      preview: {
        select: {first: 'buttons.0.buttonText', second: 'buttons.1.buttonText'},
        prepare: ({first, second}) => ({
          title: [first, second].filter(Boolean).join(' · ') || 'Buttons',
          subtitle: 'Buttons',
        }),
      },
    }),
    defineArrayMember({
      name: 'infoStrip',
      title: 'Info strip',
      type: 'object',
      icon: ThListIcon,
      description: 'Rows with a small label, a name and one line, e.g. the people at the repair bench.',
      fields: [
        defineField({
          name: 'items',
          title: 'Rows',
          type: 'array',
          of: [
            defineArrayMember({
              name: 'infoStripItem',
              title: 'Row',
              type: 'object',
              fields: [
                defineField({name: 'label', title: 'Label', type: 'string', placeholder: 'Guitar'}),
                defineField({
                  name: 'title',
                  title: 'Name',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({name: 'text', title: 'Line', type: 'string'}),
              ],
              preview: {
                select: {title: 'title', label: 'label', text: 'text'},
                prepare: ({title, label, text}) => ({
                  title,
                  subtitle: [label, text].filter(Boolean).join(' · '),
                }),
              },
            }),
          ],
          validation: (Rule) => Rule.min(1),
        }),
      ],
      preview: {
        select: {first: 'items.0.title', second: 'items.1.title'},
        prepare: ({first, second}) => ({
          title: [first, second].filter(Boolean).join(' · ') || 'Info strip',
          subtitle: 'Info strip',
        }),
      },
    }),
    defineArrayMember({
      name: 'highlights',
      title: 'Highlights',
      type: 'object',
      icon: TagsIcon,
      description: 'A few short points shown in a row, e.g. "Tailored to you", "Sliding-scale rates".',
      fields: [
        defineField({
          name: 'items',
          title: 'Points',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          validation: (Rule) => Rule.min(1).max(6),
        }),
      ],
      preview: {
        select: {items: 'items'},
        prepare: ({items}) => ({
          title: (items as string[] | undefined)?.join(' · ') || 'Highlights',
          subtitle: 'Highlights',
        }),
      },
    }),
    defineArrayMember({type: 'figure'}),
    defineArrayMember({
      name: 'divider',
      title: 'Divider',
      type: 'object',
      icon: RemoveIcon,
      fields: [
        defineField({
          name: 'spacing',
          title: 'Spacing',
          type: 'string',
          initialValue: 'medium',
          options: {
            list: [
              {title: 'Small', value: 'small'},
              {title: 'Medium', value: 'medium'},
              {title: 'Large', value: 'large'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
        }),
      ],
      preview: {
        select: {spacing: 'spacing'},
        prepare: ({spacing}) => ({title: 'Divider', subtitle: spacing ? `${spacing} spacing` : undefined}),
      },
    }),
  ],
})
