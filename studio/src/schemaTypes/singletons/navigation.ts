import {defineArrayMember, defineField, defineType} from 'sanity'
import {MenuIcon} from '@sanity/icons/Menu'

/**
 * Header navigation singleton. A flat list of nav items, each of which can be a
 * link or a dropdown, plus an optional header call-to-action button.
 */

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Menu items',
      type: 'array',
      of: [defineArrayMember({type: 'navItem'})],
    }),
    defineField({
      name: 'ctaButton',
      title: 'Header button',
      type: 'button',
      description: 'Optional call-to-action shown at the end of the header.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Navigation'}
    },
  },
})
