import {defineField, type ObjectDefinition, type PreviewValue} from 'sanity'

/**
 * Adds a "Disabled" switch to a page-builder block. A disabled block stays in
 * the document (nothing is deleted) but is left out of the page: the website
 * queries skip anything with `disabled == true`.
 *
 * In the page builder list the block's subtitle is prefixed with "Disabled",
 * so it's easy to spot.
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

  const preview = type.preview
  const select = {...(preview?.select ?? {}), disabled: 'disabled'}

  return {
    ...type,
    fields: [disabledField, ...type.fields],
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
