import {defineField, defineType} from 'sanity'

/**
 * A labelled, linked button (CTA). Used on its own in blocks and in groups of
 * one or two inside rich text (the Buttons component).
 *
 * Style: solid, outline or text link. Colour: "Auto" picks whatever reads on
 * the background it sits on (orange on black, black on bone or orange).
 */

export default defineType({
  name: 'button',
  title: 'Button',
  type: 'object',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Button Link',
      type: 'link',
      options: {collapsible: true, collapsed: false},
    }),
    defineField({
      name: 'variant',
      title: 'Style',
      type: 'string',
      initialValue: 'primary',
      options: {
        list: [
          {title: 'Solid', value: 'primary'},
          {title: 'Outline', value: 'secondary'},
          {title: 'Text link', value: 'text'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'tone',
      title: 'Colour',
      type: 'string',
      initialValue: 'auto',
      description: 'Auto picks a colour that reads on the background.',
      options: {
        list: [
          {title: 'Auto', value: 'auto'},
          {title: 'Orange', value: 'orange'},
          {title: 'Bone', value: 'bone'},
          {title: 'Black', value: 'ink'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'arrow',
      title: 'Show arrow',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'buttonText', variant: 'variant'},
    prepare({title, variant}) {
      const style = {primary: 'Solid', secondary: 'Outline', text: 'Text link'}[variant as string]
      return {title: title || 'Button', subtitle: style ? `${style} button` : 'Button'}
    },
  },
  options: {collapsible: true},
})
