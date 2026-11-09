import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-6 py-28">
      <p className="eyebrow">404</p>
      <h1 className="display-xl">Wrong fret.</h1>
      <p className="max-w-[30em] text-lg text-soft">
        We couldn’t find that page. It may have moved when the site was rebuilt.
      </p>
      <Link href="/" className="btn-primary">
        Back to the home page <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}
