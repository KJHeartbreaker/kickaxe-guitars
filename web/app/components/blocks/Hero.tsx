import {stegaClean} from 'next-sanity'
import Button from '@/app/components/Button'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import type {Block} from '@/sanity/lib/types'

/**
 * Hero block.
 *
 * Without media it is the page-title hero used on inner pages: an oversized
 * title with the intro beside it. With an image or video it falls back to a
 * split layout; new rows like that should use the Two Column block instead
 * (existing ones are migrated there).
 *
 * The first block on a page renders its heading as the page's <h1>.
 */
export default function Hero({block, index}: {block: Block<'heroSection'>; index: number}) {
  const Heading = index === 0 ? 'h1' : 'h2'
  const image = block.image?.asset?._ref ? block.image : null
  const video = stegaClean(block.backgroundType) === 'video' && block.videoUrl ? block.videoUrl : null
  const centered = stegaClean(block.alignment) === 'center'
  // A figure inside the body would repeat the hero image, so it is left out here.
  const body = (block.body ?? []).filter((b) => b._type !== 'figure')
  const ctas = block.ctas ?? []

  if (image || video) {
    return (
      <section className="wrap flex flex-wrap items-stretch gap-12 pt-12 pb-18 lg:pt-14">
        <div
          className={`flex min-w-0 flex-[1_1_520px] flex-col justify-center gap-7 ${centered ? 'items-center text-center' : ''}`}
        >
          {block.eyebrow && <p className="eyebrow">{stegaClean(block.eyebrow)}</p>}
          <Heading className="display-xl">{block.heading}</Heading>
          {body.length > 0 && <PortableText value={body} className="max-w-[34em] text-[19px]" />}
          {ctas.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <Button key={cta._key} button={i === 0 ? cta : {...cta, variant: cta.variant ?? 'secondary'}} />
              ))}
            </div>
          )}
        </div>
        <div className="relative min-h-[420px] min-w-0 flex-[1_1_460px] lg:min-h-[560px]">
          {video ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={video}
              autoPlay
              muted
              loop
              playsInline
              aria-hidden="true"
            />
          ) : (
            image && (
              <Image
                id={image.asset!._ref}
                alt={image.alt || ''}
                width={1100}
                height={1300}
                mode="cover"
                hotspot={image.hotspot}
                crop={image.crop}
                className="absolute inset-0 h-full w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            )
          )}
        </div>
      </section>
    )
  }

  return (
    <section className={`wrap pt-16 pb-14 lg:pt-20 ${centered ? 'text-center' : ''}`}>
      {block.eyebrow && <p className="eyebrow mb-5">{stegaClean(block.eyebrow)}</p>}
      <div
        className={`flex flex-wrap gap-x-16 gap-y-6 ${centered ? 'flex-col items-center' : 'items-end justify-between'}`}
      >
        <Heading className="display text-[clamp(72px,13vw,200px)] leading-[0.82]">{block.heading}</Heading>
        {(body.length > 0 || ctas.length > 0) && (
          <div className={`flex max-w-[30em] flex-col gap-6 pb-2 ${centered ? 'items-center' : ''}`}>
            <PortableText value={body} className="text-[19px] leading-[1.5]" />
            {ctas.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {ctas.map((cta) => (
                  <Button key={cta._key} button={cta} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
