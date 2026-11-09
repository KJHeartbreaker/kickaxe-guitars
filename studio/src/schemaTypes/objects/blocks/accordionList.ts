import {defineArrayMember, defineField, defineType} from 'sanity'
import {ThListIcon} from '@sanity/icons/ThList'

/**
 * A list of collapsible items (FAQ-style).
 */

export const accordionList = defineType({
  name: 'accordionList',
  title: 'Accordion List',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [defineArrayMember({type: 'accordion'})],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'heading', items: 'items'},
    prepare({title, items}) {
      const count = Array.isArray(items) ? items.length : 0
      return {
        title: title || 'Accordion List',
        subtitle: `Accordion List · ${count} item${count === 1 ? '' : 's'}`,
      }
    },
  },
})
