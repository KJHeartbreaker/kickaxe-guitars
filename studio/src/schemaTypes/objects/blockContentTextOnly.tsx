import {defineArrayMember, defineType} from 'sanity'

/**
 * A constrained Portable Text field: text with links, but no images or other
 * inline objects. Reuses the shared `link` annotation.
 */
export const blockContentTextOnly = defineType({
  title: 'Block Content (Simple - Text Only)',
  name: 'blockContentTextOnly',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        annotations: [{name: 'link', title: 'Link', type: 'link'}],
      },
    }),
  ],
})
