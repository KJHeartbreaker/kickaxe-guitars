import {defineField, type ObjectDefinition, type PreviewValue} from 'sanity'
import {isJumpName} from '../objects/link'

/**
 * Adds a "Disabled" switch to a page-builder block. A disabled block stays in
 * the document (nothing is deleted) but is left out of the page: the website
 * queries skip anything with `disabled == true`.
 *
 * In the page builder list the block's subtitle is prefixed with "Disabled",
 * so it's easy to spot.
 *
 * Also adds an optional "Jump-link name" at the end, so a button or list item
 * set to "Section on this page" can scroll straight to this block.
 */
export function withDisabled<T extends ObjectDefinition>(type: T): T {
  const defaultGroup = type.groups?.find((group) => group.default)?.name ?? type.groups?.[0]?.name

  const disabledField = defineField({
    name: 'disabled',
    title: 'Disabled',
    type: 'boolean',
    description: 'Hide this block on the site without deleting it.',
    initialValue: false,
    ...(defaultGroup ? {group: defaultGroup} : {}),
  })

  const hasDesign = type.fieldsets?.some((set) => set.name === 'design')
  const designGroup = type.groups?.find((group) => group.name === 'design' || group.title === 'Design')?.name
  const anchorField = defineField({
    name: 'anchor',
    title: 'Jump-link name',
    type: 'string',
    description:
      'Optional. Lets a link set to “Section on this page” jump straight here. One short word, e.g. teye. Leave blank if nothing links here.',
    validation: (Rule) =>
      Rule.custom((value) =>
        !value || isJumpName(String(value))
          ? true
          : 'Use lower-case letters, numbers and dashes only, e.g. rick-turner',
      ),
    // Tucked into the block's Design section or tab where it has one.
    ...(hasDesign ? {fieldset: 'design'} : {}),
    ...(designGroup ? {group: designGroup} : defaultGroup ? {group: defaultGroup} : {}),
  })

  const preview = type.preview
  const select = {...(preview?.select ?? {}), disabled: 'disabled'}

  return {
    ...type,
    fields: [disabledField, ...type.fields, anchorField],
    preview: {
      select,
      prepare(selection: Record<string, unknown>) {
        const {disabled, ...rest} = selection
        const base: PreviewValue = preview?.prepare
          ? preview.prepare(rest as never)
          : {title: (rest.title as string) || type.title, subtitle: rest.subtitle as string}
        if (!disabled) return base
        return {
          ...base,
          subtitle: base.subtitle ? `Disabled · ${base.subtitle}` : 'Disabled',
        }
      },
    },
  } as T
}
