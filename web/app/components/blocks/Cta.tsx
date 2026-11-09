import {stegaClean} from 'next-sanity'
import Button from '@/app/components/Button'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

const themes = {
  brand: {section: 'bg-orange text-ink', eyebrow: 'text-ink', tone: 'light', surface: 'brand'},
  light: {section: 'bg-bone text-ink', eyebrow: 'text-label', tone: 'light', surface: 'light'},
  dark: {section: 'bg-cab text-bone', eyebrow: 'text-orange', tone: 'dark', surface: 'dark'},
} as const

/**
 * Call to Action band. Orange (brand) is the default; light uses bone, dark a
 * dark panel. An optional image sits beside the text.
 */
export default function Cta({block}: {block: Block<'callToAction'>}) {
  const theme = themes[(stegaClean(block.theme) as keyof typeof themes) ?? 'brand'] ?? themes.brand
  const image = block.image?.asset?._ref ? block.image : null
  const imageFirst = stegaClean(block.contentAlignment) === 'imageFirst'

  return (
    <section className={theme.section}>
      <div
        className={`wrap flex flex-col gap-10 py-16 lg:items-center lg:gap-16 ${image ? (imageFirst ? 'lg:flex-row-reverse' : 'lg:flex-row') : 'lg:flex-row lg:justify-between'}`}
      >
        <div className="flex min-w-0 flex-col gap-5 lg:flex-1">
          {block.eyebrow && (
            <p className={`font-mono text-[13px] tracking-[0.12em] uppercase ${theme.eyebrow}`}>{stegaClean(block.eyebrow)}</p>
          )}
          <h2 className="display text-[clamp(40px,4.6vw,64px)]">{block.heading}</h2>
          <PortableText
            value={block.body}
            tone={theme.tone}
            surface={theme.surface}
            className={`max-w-[34em] ${theme.surface === 'brand' ? '!text-ink' : ''}`}
          />
          {image && block.button && (
            <div>
              <Button button={block.button} surface={theme.surface} />
            </div>
          )}
        </div>
        {image ? (
          <div className="min-w-0 lg:flex-1">
            <Image
              id={image.asset!._ref}
              alt=""
              width={1000}
              height={700}
              mode="cover"
              hotspot={image.hotspot}
              crop={image.crop}
              className="aspect-[10/7] w-full object-cover"
            />
          </div>
        ) : (
          block.button && (
            <div className="shrink-0">
              <Button button={block.button} surface={theme.surface} />
            </div>
          )
        )}
      </div>
    </section>
  )
}
