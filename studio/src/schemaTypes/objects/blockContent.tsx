import {defineArrayMember, defineType} from 'sanity'

/**
 * Rich-text (Portable Text) field used across the studio. Reuse it with:
 *  {name: 'body', title: 'Body', type: 'blockContent'}
 *
 * The `link` annotation reuses the shared `link` object type so there is a
 * single definition of what a link is across the whole studio.
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
      marks: {
        annotations: [{name: 'link', title: 'Link', type: 'link'}],
      },
    }),
    defineArrayMember({
      type: 'figure',
    }),
  ],
})
