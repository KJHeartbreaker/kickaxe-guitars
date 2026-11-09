import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * A navigation entry for the header. A top-level item is a labelled link that
 * can optionally reveal a dropdown of child links.
 */

export const navItem = defineType({
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'link',
      description: 'Where this item points. Leave empty if it only opens a dropdown.',
    }),
    defineField({
      name: 'children',
      title: 'Dropdown items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'navChild',
          title: 'Dropdown item',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'link', title: 'Link', type: 'link'}),
          ],
          preview: {
            select: {title: 'label'},
            prepare({title}) {
              return {title: title || 'Untitled'}
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'label', children: 'children'},
    prepare({title, children}) {
      const count = Array.isArray(children) ? children.length : 0
      return {
        title: title || 'Untitled',
        subtitle: count ? `Dropdown · ${count} item${count === 1 ? '' : 's'}` : 'Link',
      }
    },
  },
})
