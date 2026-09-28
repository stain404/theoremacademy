import { Link } from 'react-router-dom'
import SessionBoard from '../components/Board'
import { Approach, FactsStrip, FinalCta, Stories, usePageTitle } from '../components/sections'
import { ImageBlock, ProgramBoard, Section } from '../components/ui'
import { teachers } from '../config/site'

function Hero() {
  return (
    <section className="pt-12 pb-12 sm:pt-16 sm:pb-16 lg:pt-20">
      <div className="wrap grid-12 gap-y-8">
        <h1 className="hero-rise col-span-4 text-[3.9rem] leading-[0.88] sm:col-span-8 sm:text-[6rem] lg:col-span-10 lg:text-6xl">
          <span className="block">Trading is a skill.</span>
          <span className="block">We teach it like one.</span>
        </h1>
        <p className="hero-rise col-span-4 max-w-[34rem] text-lg leading-relaxed sm:col-span-6 lg:col-span-5" style={{ animationDelay: '90ms' }}>
          A trading academy in Dubai, India and online. Forex, crypto and equity for beginners and working professionals, taught live in small batches, with a mentor reviewing the trades you place.
        </p>
        <div className="hero-rise col-span-4 flex flex-wrap items-center gap-x-7 gap-y-4 sm:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-end lg:justify-end" style={{ animationDelay: '180ms' }}>
          <Link to="/register" className="btn-brand px-6 py-3.5 text-base">Apply now</Link>
          <Link to="/contact" className="link-line">Book a consultation</Link>
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
      <div className="grid-12 gap-y-14">
        {teachers.map((t, i) => (
          <article key={t.name} className={`col-span-4 sm:col-span-4 lg:col-span-4 ${i === 1 ? 'lg:col-start-8 lg:mt-28' : 'lg:col-start-2'}`}>
            <ImageBlock src={t.photo} alt={`Portrait of ${t.name}`} ratio="4/5" shotNote={`Portrait of ${t.name}, natural light`} />
            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-5xl leading-none font-extrabold">{t.name}</h3>
              <p className="text-sm font-semibold text-brand">{t.role}</p>
            </div>
            <p className="mt-3 text-ink-soft">{t.focus}.</p>
            <Link to={`/mentors#${t.name.toLowerCase()}`} className="link-line mt-4 inline-block text-sm">Read {t.name}'s profile</Link>
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
      <SessionBoard />
      <FactsStrip />
      <Section
        title="Four programs. Most students begin with Forex Basic."
        action={<Link to="/programs" className="link-line">Compare all programs</Link>}
        className="pt-8 sm:pt-12 lg:pt-16"
      >
        <ProgramBoard />
      </Section>
      <Approach className="bg-card" action={<Link to="/about" className="link-line">More about how we teach</Link>} />
      <MentorsPreview />
      <Stories limit={1} />
      <FinalCta />
    </>
  )
}
