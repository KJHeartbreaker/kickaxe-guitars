import {defineField, defineType} from 'sanity'

/**
 * A single social-media link, used in the footer.
 */

export const socialLink = defineType({
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          {title: 'Instagram', value: 'instagram'},
          {title: 'Facebook', value: 'facebook'},
          {title: 'YouTube', value: 'youtube'},
          {title: 'X (Twitter)', value: 'twitter'},
          {title: 'TikTok', value: 'tiktok'},
          {title: 'Spotify', value: 'spotify'},
          {title: 'SoundCloud', value: 'soundcloud'},
          {title: 'Reverb', value: 'reverb'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
  ],
  preview: {
    select: {title: 'platform', subtitle: 'url'},
    prepare({title, subtitle}) {
      return {
        title: title ? title.charAt(0).toUpperCase() + title.slice(1) : 'Social link',
        subtitle,
      }
    },
  },
})
