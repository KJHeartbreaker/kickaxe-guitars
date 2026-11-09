import {stegaClean} from 'next-sanity'
import ResolvedLink from '@/app/components/ResolvedLink'
import type {DereferencedButton} from '@/sanity/lib/types'
import {linkResolver} from '@/sanity/lib/utils'

/** The background a button sits on. */
export type Surface = 'dark' | 'light' | 'brand'
type Tone = 'orange' | 'bone' | 'ink'

/** "Auto" colour: whatever reads on the surface. */
function autoTone(variant: string, surface: Surface): Tone {
  if (surface === 'dark') return variant === 'primary' ? 'orange' : 'bone'
  return 'ink'
}

const solid: Record<Tone, string> = {
  orange: 'bg-orange text-ink hover:bg-bone',
  bone: 'bg-bone text-ink hover:bg-orange',
  ink: 'bg-ink text-bone hover:bg-cab',
}

const outline: Record<Tone, string> = {
  orange: 'border-orange text-orange hover:bg-orange hover:text-ink',
  bone: 'border-bone text-bone hover:bg-bone hover:text-ink',
  ink: 'border-ink text-ink hover:bg-ink hover:text-bone',
}

const textLink: Record<Tone, string> = {
  orange: 'text-orange decoration-orange hover:text-bone',
  bone: 'text-bone hover:text-orange',
  ink: 'text-ink hover:text-stone',
}

/**
 * Renders a Sanity `button` (CTA).
 *
 * Style: solid, outline or text link. Colour: auto, orange, bone or black;
 * auto follows the surface (orange on black, black on bone or orange).
 * Arrow: on or off. Buttons saved before the arrow option existed keep their
 * old look: an arrow on solid and text buttons, none on outline.
 */
export default function Button({
  button,
  surface = 'dark',
  className = '',
}: {
  button?: (DereferencedButton & {tone?: string | null; arrow?: boolean | null}) | null
  surface?: Surface
  className?: string
}) {
  if (!button?.buttonText || !linkResolver(button.link ?? undefined)) return null

  // Option values arrive with Visual Editing (stega) markers in draft mode; clean them before comparing.
  const variant = stegaClean(button.variant) ?? 'primary'
  const chosenTone = stegaClean(button.tone)
  const tone: Tone =
    chosenTone && chosenTone !== 'auto' && chosenTone in solid ? (chosenTone as Tone) : autoTone(variant, surface)
  const arrow = button.arrow ?? variant !== 'secondary'

  let classes: string
  if (variant === 'text') {
    classes = `font-mono text-sm underline underline-offset-4 decoration-1 inline-flex min-h-11 items-center gap-2 ${textLink[tone]}`
  } else if (variant === 'secondary') {
    classes = `btn border-[1.5px] ${outline[tone]}`
  } else {
    classes = `btn ${solid[tone]}`
  }

  return (
    <ResolvedLink link={button.link!} className={`${classes} ${className}`}>
      {button.buttonText}
      {arrow && <span aria-hidden="true">→</span>}
    </ResolvedLink>
  )
}
