import {defineArrayMember, defineField, defineType} from 'sanity'
import {StarIcon} from '@sanity/icons/Star'

/**
 * Full-width hero: heading + supporting copy over an image or looping video,
 * with up to two call-to-action buttons.
 */

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero',
  type: 'object',
  icon: StarIcon,
  fieldsets: [
    {name: 'background', title: 'Background', options: {collapsible: true, collapsed: false}},
    {name: 'options', title: 'Options', options: {collapsible: true, collapsed: true}},
  ],
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      description: 'Supporting copy shown beneath the heading.',
    }),
    defineField({
      name: 'ctas',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({type: 'button'})],
      validation: (Rule) => Rule.max(2).warning('Two buttons is usually the most a hero needs.'),
    }),
    defineField({
      name: 'backgroundType',
      title: 'Background type',
      type: 'string',
      fieldset: 'background',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Background image',
      type: 'figure',
      fieldset: 'background',
      hidden: ({parent}) => parent?.backgroundType === 'video',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Background video URL',
      type: 'url',
      description: 'A hosted .mp4/.webm to loop behind the hero.',
      fieldset: 'background',
      hidden: ({parent}) => parent?.backgroundType !== 'video',
    }),
    defineField({
      name: 'alignment',
      title: 'Content alignment',
      type: 'string',
      fieldset: 'options',
      initialValue: 'left',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {title: 'heading', media: 'image'},
    prepare({title, media}) {
      return {title: title || 'Hero', subtitle: 'Hero', media}
    },
  },
})
