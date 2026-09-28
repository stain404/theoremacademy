import { Link } from 'react-router-dom'
import { FlapText } from '../components/Board'
import { usePageTitle } from '../components/sections'

export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="wrap">
        <div className="inline-block bg-board p-4 [--flap-w:1.3rem] sm:p-5 sm:[--flap-w:2rem]" aria-hidden="true">
          <FlapText text="No such page" length={12} tone="flap-amber" />
        </div>
        <h1 className="mt-10 max-w-[14ch] text-[3.4rem] sm:text-5xl lg:text-6xl">This page does not exist.</h1>
        <p className="mt-6 max-w-[34rem] text-lg text-ink-soft">The link may be out of date. Start from the programs, or go back to the homepage.</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link to="/programs" className="btn-brand">See programs</Link>
          <Link to="/" className="link-line">Go to the homepage</Link>
        </div>
      </div>
    </section>
  )
}
