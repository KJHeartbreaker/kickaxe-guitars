import {defineField, defineType} from 'sanity'
import {EnvelopeIcon} from '@sanity/icons/Envelope'

/**
 * Renders the site contact form, with editable surrounding copy.
 * The form fields and submission are handled by the front-end component.
 */

export const contactFormSection = defineType({
  name: 'contactFormSection',
  title: 'Contact Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'intro', title: 'Intro', type: 'blockContentTextOnly'}),
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Send',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      description: 'Shown after the form is submitted successfully.',
      initialValue: 'Thanks — we’ll be in touch soon.',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Contact Form', subtitle: 'Contact Form'}
    },
  },
})
