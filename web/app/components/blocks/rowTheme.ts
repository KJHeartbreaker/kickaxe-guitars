/**
 * Backgrounds and spacing shared by the Two Column and Single Column rows, so
 * the two block families always match.
 */
export const rowBackgrounds = {
  ink: {section: 'bg-ink text-bone', rule: 'border-line', tone: 'dark', surface: 'dark', eyebrow: 'text-orange'},
  cab: {section: 'bg-cab text-bone', rule: 'border-line', tone: 'dark', surface: 'dark', eyebrow: 'text-orange'},
  bone: {section: 'bg-bone text-ink', rule: 'border-rule', tone: 'light', surface: 'light', eyebrow: 'text-label'},
  orange: {section: 'bg-orange text-ink', rule: 'border-ink/20', tone: 'light', surface: 'brand', eyebrow: 'text-ink'},
} as const

export type RowBackground = (typeof rowBackgrounds)[keyof typeof rowBackgrounds]

export function rowBackground(value: string | null | undefined): RowBackground {
  return rowBackgrounds[(value ?? 'ink') as keyof typeof rowBackgrounds] ?? rowBackgrounds.ink
}

/**
 * Vertical padding for a row. `noTop` / `noBottom` remove one side so two rows
 * with the same background can join into one section.
 */
export function rowPadding(compact: boolean, {noTop = false, noBottom = false} = {}) {
  const top = noTop ? 'pt-0' : compact ? 'pt-10 lg:pt-12' : 'pt-18 lg:pt-24'
  const bottom = noBottom ? 'pb-0' : compact ? 'pb-10 lg:pb-12' : 'pb-18 lg:pb-24'
  return `${top} ${bottom}`
}
