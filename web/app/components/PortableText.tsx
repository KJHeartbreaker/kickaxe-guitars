import {
  PortableText,
  stegaClean,
  toPlainText,
  type PortableTextBlock,
  type PortableTextComponents,
} from 'next-sanity'

import Button, {type Surface} from '@/app/components/Button'
import ResolvedLink from '@/app/components/ResolvedLink'
import Image from '@/app/components/SanityImage'
import type {DereferencedButton, DereferencedLink} from '@/sanity/lib/types'

/**
 * Portable Text in the Kickaxe style.
 *
 * - `dark` (default): copy on black or the dark cabinet panel.
 * - `light`: copy on bone (or the orange band).
 * - `card`: compact text inside a card; a figure becomes the card image and
 *   headings become card titles.
 *
 * Besides text, it renders the components editors can drop into rich text:
 * Buttons, Info strip, Highlights, images and dividers. Soft line breaks
 * (Shift+Enter) become <br>, which is how stacked headlines are written.
 */
type Tone = 'dark' | 'light' | 'card'

const toneClasses: Record<Tone, string> = {
  dark: 'text-soft [&_strong]:text-bone',
  light: 'text-stone [&_strong]:text-ink',
  card: 'text-soft text-[15px] [&_strong]:text-bone',
}

function headingClass(tone: Tone, level: 'h1' | 'h2' | 'h3' | 'h4', surface?: Surface) {
  if (tone === 'card') return 'card-title text-bone mt-2'
  const color = tone === 'light' ? 'text-ink' : 'text-bone'
  switch (level) {
    case 'h1':
      return `display-xl ${color} mt-12 first:mt-0`
    case 'h2':
      return `display-lg ${color} mt-12 first:mt-0`
    case 'h3':
      return `display-md ${color} mt-10 first:mt-0`
    default:
      // The small label (Heading 4) uses the eyebrow colour.
      return `font-mono text-[13px] tracking-[0.12em] uppercase ${surface === 'brand' ? 'text-ink' : tone === 'light' ? 'text-label' : 'text-orange'} mt-8 first:mt-0`
  }
}

const dividerSpacing = {small: 'my-6', medium: 'my-10', large: 'my-16'} as const
const buttonAlign = {left: 'justify-start', center: 'justify-center', right: 'justify-end'} as const

type InfoStripItem = {_key: string; label?: string; title?: string; text?: string}

type MaybeBlock = {_type?: string; listItem?: string; children?: {text?: string}[]}

/**
 * The Studio editor keeps an empty line after components (and editors leave
 * stray blank lines), which would render as empty paragraphs with margins.
 * Drop text blocks that have no text.
 */
function withoutEmptyBlocks(value: readonly unknown[]) {
  return value.filter((item) => {
    const block = item as MaybeBlock
    if (block?._type !== 'block' || block.listItem) return true
    return (block.children ?? []).some((child) => stegaClean(child.text ?? '').trim() !== '')
  })
}

export default function CustomPortableText({
  className = '',
  value,
  tone = 'dark',
  surface,
  centered = false,
}: {
  className?: string
  // Accepts any Portable Text array from a query (typed blocks, figures, stega strings).
  value?: readonly unknown[] | null
  tone?: Tone
  /** The background, for button colours. Defaults from the tone. */
  surface?: Surface
  /** Centred text: buttons and highlights centre too (unless buttons are set to Right). */
  centered?: boolean
}) {
  const blocks = value?.length ? withoutEmptyBlocks(value) : []
  if (!blocks.length) return null
  const light = tone === 'light'
  const buttonSurface: Surface = surface ?? (light ? 'light' : 'dark')

  const components: PortableTextComponents = {
    types: {
      figure: ({value}) => {
        if (!value?.asset?._ref) return null
        if (tone === 'card') {
          return (
            <figure className="-mx-5 -mt-5 mb-5 aspect-[4/3] overflow-hidden sm:-mx-6 sm:-mt-6">
              <Image
                id={value.asset._ref}
                alt={value.alt || ''}
                width={720}
                height={540}
                mode="cover"
                hotspot={value.hotspot}
                crop={value.crop}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </figure>
          )
        }
        return (
          <figure className="my-10">
            <Image
              id={value.asset._ref}
              alt={value.alt || ''}
              width={1200}
              hotspot={value.hotspot}
              crop={value.crop}
              className="w-full"
            />
            {value.caption && (
              <figcaption className={`mt-3 font-mono text-xs ${light ? 'text-label' : 'text-muted'}`}>
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
      ptButtons: ({value}) => {
        const buttons = (value?.buttons ?? []) as (DereferencedButton & {_key: string})[]
        if (!buttons.length) return null
        const chosen = stegaClean(value?.align) as keyof typeof buttonAlign | undefined
        const justify =
          centered && chosen !== 'right' ? buttonAlign.center : (buttonAlign[chosen ?? 'left'] ?? buttonAlign.left)
        // A pair stays side by side on phones: each takes half the row, with
        // tighter padding and smaller text (which wraps inside the button if it must).
        const pair = buttons.length > 1
        return (
          <div
            className={`mt-8 flex items-stretch gap-3 first:mt-0 ${pair ? 'max-sm:gap-2 sm:flex-wrap sm:items-center' : 'flex-wrap items-center'} ${justify}`}
          >
            {buttons.map((button) => (
              <Button
                key={button._key}
                button={button}
                surface={buttonSurface}
                className={pair ? 'max-sm:min-w-0 max-sm:flex-1 max-sm:px-3 max-sm:text-center max-sm:text-sm max-sm:leading-tight' : ''}
              />
            ))}
          </div>
        )
      },
      infoStrip: ({value}) => {
        const items = (value?.items ?? []) as InfoStripItem[]
        if (!items.length) return null
        return (
          <ul className="my-8 flex flex-col gap-3 first:mt-0">
            {items.map((item) => (
              <li
                key={item._key}
                className={`flex items-baseline gap-5 border px-5 py-4 ${light ? 'border-rule bg-white/40' : 'border-line bg-cab'}`}
              >
                {item.label && (
                  <span
                    className={`min-w-[76px] shrink-0 font-mono text-xs uppercase ${light ? 'text-label' : 'text-orange'}`}
                  >
                    {item.label}
                  </span>
                )}
                <span className="min-w-0">
                  <span className={`block text-[17px] font-semibold ${light ? 'text-ink' : 'text-bone'}`}>
                    {item.title}
                  </span>
                  {item.text && (
                    <span className={`block text-sm ${light ? 'text-stone' : 'text-muted'}`}>{item.text}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        )
      },
      highlights: ({value}) => {
        const items = (value?.items ?? []) as string[]
        if (!items.length) return null
        return (
          <ul
            className={`my-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px] first:mt-0 ${centered ? 'justify-center' : ''} ${light ? 'text-label' : 'text-muted'}`}
          >
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      },
      divider: ({value}) => (
        <hr
          className={`border-0 border-t ${light ? 'border-rule' : 'border-line'} ${dividerSpacing[(stegaClean(value?.spacing) as keyof typeof dividerSpacing) ?? 'medium'] ?? dividerSpacing.medium}`}
        />
      ),
    },
    block: {
      normal: ({children}) => <p className="my-4 text-pretty first:mt-0 last:mb-0">{children}</p>,
      h1: ({children}) => <h1 className={headingClass(tone, 'h1')}>{children}</h1>,
      h2: ({children}) => <h2 className={headingClass(tone, 'h2')}>{children}</h2>,
      h3: ({children}) => <h3 className={headingClass(tone, 'h3')}>{children}</h3>,
      // Small letter-spaced labels: letter-spacing also spaces out the invisible
      // Visual Editing (stega) characters, which would wrap the label onto extra
      // lines in draft mode. So they render as clean plain text.
      h4: ({value}) => <h4 className={headingClass(tone, 'h4', surface)}>{stegaClean(toPlainText(value))}</h4>,
      h5: ({value}) => <h5 className={headingClass(tone, 'h4', surface)}>{stegaClean(toPlainText(value))}</h5>,
      h6: ({value}) => <h6 className={headingClass(tone, 'h4', surface)}>{stegaClean(toPlainText(value))}</h6>,
      small: ({children}) => (
        <p className={`my-3 font-mono text-xs leading-relaxed ${light ? 'text-current opacity-80' : 'text-muted'}`}>
          {children}
        </p>
      ),
      blockquote: ({children}) => (
        <blockquote className="my-8 border-l-4 border-orange pl-6 font-display text-3xl leading-tight font-bold uppercase">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({children}) => <ul className="my-4 list-disc space-y-1 pl-5 marker:text-orange">{children}</ul>,
      number: ({children}) => (
        <ol className="my-4 list-decimal space-y-1 pl-5 marker:font-mono marker:text-orange">{children}</ol>
      ),
    },
    marks: {
      // Orange text. On bone, plain orange fails contrast, so it darkens to rust.
      accent: ({children}) => <span className={light ? 'text-[#9a4f05]' : 'text-orange'}>{children}</span>,
      underline: ({children}) => <span className="underline underline-offset-4">{children}</span>,
      link: ({children, value}) => (
        <ResolvedLink
          link={value as DereferencedLink}
          className="underline decoration-orange decoration-2 underline-offset-4 hover:text-orange"
        >
          {children}
        </ResolvedLink>
      ),
    },
  }

  return (
    <div
      className={`text-[17px] leading-[1.6] ${surface === 'brand' ? 'text-ink [&_strong]:text-ink' : toneClasses[tone]} ${className}`}
    >
      <PortableText components={components} value={blocks as PortableTextBlock[]} />
    </div>
  )
}
