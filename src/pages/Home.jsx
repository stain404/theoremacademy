import { Link } from 'react-router-dom'
import SessionBoard from '../components/Board'
import { Approach, FactsStrip, Faq, FinalCta, Offer, Paths, Stories, usePageTitle } from '../components/sections'
import { ImageBlock, ProgramBoard, Section } from '../components/ui'
import { formatINR, lowestPrice, offer, teachers } from '../config/site'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/*
  Background film behind the headline: candlesticks drifting across a dark screen.
  An 8-second forward-then-reverse loop (public/hero/), so the loop has no visible seam.
  Phones get a 960px file. With reduced motion only the still poster is shown.
  Petrol overlays keep the headline legible and fade the film out before the board.
*/
function HeroFilm() {
  return (
    <div className="hero-film absolute inset-0 overflow-hidden" aria-hidden="true">
      {reducedMotion() ? (
        <img src="/hero/hero-poster.jpg" alt="" className="h-full w-full object-cover" />
      ) : (
        <video className="h-full w-full object-cover" autoPlay muted loop playsInline preload="auto" poster="/hero/hero-poster.jpg">
          <source src="/hero/hero-mobile.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/hero/hero.mp4" type="video/mp4" />
        </video>
      )}
      {/* legibility: solid behind the text column, opening up to the right */}
      <div className="absolute inset-0 bg-board/55 md:bg-transparent md:bg-[linear-gradient(90deg,rgb(12_46_49/0.85),rgb(12_46_49/0.55)_42%,rgb(12_46_49/0.12))]" />
      {/* the film fades into solid petrol before the board starts */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_45%,var(--color-board)_86%)]" />
    </div>
  )
}

/*
  Hero, and the site's one orchestrated load sequence (see index.css):
  the film fades up, headline lines rise from a mask, then copy and CTAs, then the board
  lights and flips. Everything is clickable from the first frame; the animation only
  affects appearance.
*/
function Hero() {
  const lines = ['Trading is a skill.', 'We teach it like one.']
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-board text-white">
      <HeroFilm />
      <div className="wrap relative pt-12 pb-10 sm:pt-16 sm:pb-14 lg:pt-28 lg:pb-16">
        <p className="hero-rise text-sm text-white/65" style={{ animationDelay: '50ms' }}>
          A trading academy in Dubai, India and online
        </p>
        <h1 className="mt-4 text-[3.5rem] leading-[0.9] sm:text-[5.25rem] lg:text-7xl">
          {lines.map((line, i) => (
            <span key={line} className="line-mask">
              <span className="line-in" style={{ animationDelay: `${120 + i * 110}ms` }}>{line}</span>
            </span>
          ))}
        </h1>

        <p className="hero-rise mt-7 max-w-[34rem] text-lg leading-relaxed text-white/80 sm:text-xl sm:leading-relaxed" style={{ animationDelay: '380ms' }}>
          Live forex, crypto and equity programs for beginners and working professionals. Small batches, and a mentor who reviews the trades you place.
        </p>
        <div className="hero-rise mt-9 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center" style={{ animationDelay: '480ms' }}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-brand btn-lg">Apply now</Link>
            <Link to="/contact" className="btn-outline-light btn-lg">Book a consultation</Link>
          </div>
          <p className="text-sm leading-snug text-white/65 sm:max-w-[13rem]">
            Programs from {formatINR(lowestPrice())}. Full refund within {offer.refundDays} days.
          </p>
        </div>

        <div className="hero-rise mt-12 sm:mt-16" style={{ animationDelay: '560ms' }}>
          <SessionBoard startDelay={700} />
        </div>
      </div>
    </section>
  )
}

// A short introduction to each mentor; the full profiles live on /mentors.
function MentorsPreview() {
  return (
    <Section
      title="The people teaching you."
      intro="Each program is led by one mentor, from your first class to your last trade review."
      action={<Link to="/mentors" className="link-line">Meet the mentors</Link>}
    >
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-x-16">
        {teachers.map((t) => (
          <article key={t.name} className="group border-t-2 border-ink pt-6">
            <Link to={`/mentors#${t.name.toLowerCase()}`} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-end gap-5 sm:gap-7">
              <ImageBlock src={t.photo} alt={`Portrait of ${t.name}`} ratio="4/5" shotNote={`Portrait of ${t.name}, natural light`} />
              <div className="pb-1">
                <p className="text-sm font-semibold text-brand">{t.role}</p>
                <h3 className="mt-1 font-display text-[2.75rem] leading-none font-bold transition-colors group-hover:text-brand sm:text-5xl">{t.name}</h3>
                <p className="mt-3 text-ink-soft">{t.focus}.</p>
                <p className="mt-2 text-sm text-ink-soft">Teaches {t.teaches.join(' and ')}</p>
                <span className="link-line mt-5 inline-block text-sm">Read {t.name}'s profile</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default function Home() {
  usePageTitle(null)
  return (
    <>
      <Hero />
      <FactsStrip />
      <Paths />
      <Section
        title="Four programs, side by side."
        intro="Each one is live, mentor-led and taught in Dubai, India and online. Open a program to see its full curriculum."
        action={<Link to="/programs" className="link-line">Compare all programs</Link>}
        className="bg-card"
      >
        <ProgramBoard />
        {/* decision point: the visitor has just compared every program */}
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[34rem] text-lg">
            Not sure which one fits? Tell an advisor what you trade now and they will recommend a program and a batch.
          </p>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn-primary">Book a consultation</Link>
            <Link to="/register" className="btn-ghost">Apply now</Link>
          </div>
        </div>
      </Section>
      <Approach dark action={<Link to="/programs/forex-basic" className="link-line">See the Forex Basic curriculum</Link>} />
      <MentorsPreview />
      <Stories limit={1} />
      <Offer className="border-t border-line" />
      <Faq className="bg-card" />
      <FinalCta />
    </>
  )
}
