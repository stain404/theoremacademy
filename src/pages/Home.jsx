import { Link } from 'react-router-dom'
import HeroStage from '../components/HeroStage'
import { Approach, FactsStrip, Faq, FinalCta, HybridExperience, Offer, Paths, Proof, Stories, usePageTitle } from '../components/sections'
import { ImageBlock, Section } from '../components/ui'
import { formatINR, heroStats, lowestPrice, offer, teachers } from '../config/site'

/*
  Hero, and the site's one orchestrated load sequence (see index.css, ~1.2 s):
  the headline rises line by line while the video stage opens from a slit to its frame,
  then the copy, actions and figures settle. Everything is clickable from the first frame.
*/
function Hero() {
  const lines = ['Learn to trade', 'with a plan', 'you can prove.']
  return (
    <section id="hero" className="pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
      <div className="wrap grid gap-x-12 gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
        <div className="lg:col-span-5 lg:self-end">
          <p className="hero-rise text-sm text-ink-soft" style={{ animationDelay: '40ms' }}>
            Trading academy in Dubai, India and online
          </p>
          <h1 className="mt-4 text-[2.9rem] leading-[1.02] sm:text-6xl lg:text-[3.9rem] xl:text-6xl">
            {lines.map((line, i) => (
              <span key={line} className="line-mask">
                <span className="line-in" style={{ animationDelay: `${100 + i * 90}ms` }}>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-rise mt-6 max-w-[30rem] text-lg leading-relaxed text-ink-soft" style={{ animationDelay: '380ms' }}>
            Live forex, crypto and equity programs for beginners and working professionals. Small cohorts, real classrooms, and a mentor who reviews every trade you log.
          </p>
          <div className="hero-rise mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '470ms' }}>
            <Link to="/register" className="btn-brand btn-lg">Apply now</Link>
            <Link to="/contact" className="btn-ghost btn-lg">Book an advisor call</Link>
          </div>
          <p className="hero-rise mt-4 text-sm text-ink-soft" style={{ animationDelay: '520ms' }}>
            Programs from {formatINR(lowestPrice())}. Full refund within {offer.refundDays} days.
          </p>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1 lg:self-center">
          <HeroStage />
        </div>

        <dl className="hero-rise grid max-w-[30rem] grid-cols-3 self-start border-t border-line pt-5 lg:col-span-5 lg:row-start-2" style={{ animationDelay: '600ms' }}>
          {heroStats.map(([value, label], i) => (
            <div key={label} className={i ? 'border-l border-line pl-4' : 'pr-4'}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-xl font-semibold tabular-nums sm:text-2xl">{value}</dd>
              <dd className="mt-0.5 text-xs leading-snug text-ink-soft">{label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// A short introduction to each mentor; the full profiles live on /mentors.
function MentorsPreview() {
  return (
    <Section
      tight
      title="The people teaching you."
      intro="Each program is led by one mentor, from your first class to your last trade review."
      action={<Link to="/mentors" className="link-line text-brand">Meet the mentors</Link>}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {teachers.map((t) => (
          <Link key={t.name} to={`/mentors#${t.name.toLowerCase()}`} className="card-hover-glow group grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-5 p-4 sm:gap-7 sm:p-5">
            <ImageBlock src={t.photo} alt={`Portrait of ${t.name}`} ratio="4/5" shotNote={`Portrait of ${t.name}, natural light`} initials={t.initials} />
            <div className="pr-2">
              <p className="text-sm font-semibold text-brand">{t.role}</p>
              <h3 className="mt-1 text-3xl sm:text-4xl">{t.name}</h3>
              <p className="mt-3 text-ink-soft">{t.focus}.</p>
              <p className="mt-2 text-sm text-ink-soft">Teaches {t.teaches.join(' and ')}</p>
              <span className="link-line mt-5 inline-block text-sm group-hover:text-brand">Read {t.name}'s profile</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  )
}

/*
  Order follows the visitor's questions: what is it and is it real (hero, facts), why this
  academy (pillars), which program (paths), how it works (method), what do I get (proof),
  who teaches (mentors), what does it cost (offer), what if (FAQ), then the close.
  Paper and mist alternate; ink marks the method and the close.
*/
export default function Home() {
  usePageTitle(null)
  return (
    <>
      <Hero />
      <FactsStrip />
      <HybridExperience />
      <Paths tone="mist" />
      <Approach dark />
      <Proof tone="mist" />
      <MentorsPreview />
      <Stories limit={1} />
      <Offer tone="paper" />
      <Faq tone="mist" />
      <FinalCta />
    </>
  )
}
