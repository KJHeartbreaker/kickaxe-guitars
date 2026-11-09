import NextImage from 'next/image'

/**
 * The Kickaxe logo: the orange guitar body with the wordmark.
 * `onDark` uses the bone wordmark; otherwise the wordmark is black.
 * The SVGs live in /public and keep the logo's 708×274 proportions.
 */
export default function Logo({
  onDark = true,
  className = 'h-14 w-auto',
  preload = false,
}: {
  onDark?: boolean
  className?: string
  preload?: boolean
}) {
  return (
    <NextImage
      src={onDark ? '/kickaxe-logo-dark.svg' : '/kickaxe-logo-light.svg'}
      alt="Kickaxe Guitars"
      width={708}
      height={274}
      preload={preload}
      className={className}
    />
  )
}
