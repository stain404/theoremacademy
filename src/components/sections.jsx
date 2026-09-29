// Page sections shared by more than one page. Each page composes these in its own order.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { faqs, formatINR, offer, programs, site, stories } from '../config/site'
import { ImageBlock, MethodTrack, Section, Testimonial, Ticket, useReveal } from './ui'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name
  }, [title])
}

// Opening band for every inner page: big condensed title left, intro right.
export function PageHeader({ back, title, intro, children }) {
  return (
    <header className="bg-card">
      <div className="wrap pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-20 lg:pb-20">
        {back && (
          <Link to={back.to} className="link-line mb-6 inline-block text-sm text-ink-soft sm:mb-10">
            {back.label}
          </Link>
        )}
        <div className="grid-12 gap-y-6">
          <h1 className="hero-rise col-span-4 text-[3.1rem] sm:col-span-8 sm:text-[4rem] lg:col-span-8 lg:text-6xl">{title}</h1>
          {(intro || children) && (
            <div className="hero-rise col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end" style={{ animationDelay: '90ms' }}>
              {intro && <p className="text-lg leading-relaxed text-ink-soft">{intro}</p>}
              {children}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

// Reasons to trust the academy, stated plainly. No numbers until real ones exist.
const TRUST = [
  ['Real classrooms', 'In Dubai and India. Visit before you enrol.'],
  ['Every class recorded', 'Watch any lesson again in your portal.'],
  ['Your trades reviewed', 'Feedback on your own decisions, not signals.'],
  [`${offer.refundDays}-day refund`, 'If the program is not right for you.'],
]

export function FactsStrip() {
  return (
    <div className="border-b border-line">
      <dl className="wrap grid grid-cols-2 lg:grid-cols-4">
        {TRUST.map(([k, v], i) => (
          <div key={k} className={`border-line py-6 pr-4 sm:py-8 ${i % 2 ? 'border-l pl-5 sm:pl-8' : ''} ${i > 0 ? 'lg:pl-8' : ''} ${i === 2 ? 'lg:border-l' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''}`}>
            <dt className="font-cond text-lg font-bold sm:text-xl">{k}</dt>
            <dd className="mt-1 text-sm text-ink-soft">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/*
  "Where do you start?" Three honest situations, each pointing at the right program.
  These are choices, so they are the one place on the homepage that uses cards.
*/
const PATHS = [
  { situation: 'I have never traded.', body: 'Start from zero: charts, brokers, and sizing a trade so one loss never hurts.', programs: ['forex-basic'] },
  { situation: 'I trade, but without a plan.', body: 'Market structure, multi-timeframe entries, and a weekly review of your live trades.', programs: ['forex-advanced'] },
  { situation: 'I want crypto or stocks.', body: 'Exchanges and wallet safety, or Indian and US equities with a swing trading method.', programs: ['crypto', 'equity'] },
]

export function Paths() {
  const ref = useReveal()
  return (
    <Section title="Where do you start?" intro="Pick the line that sounds most like you. If none fit, an advisor will help you choose.">
      <div ref={ref} className="stagger grid gap-4 md:grid-cols-3 md:gap-6">
        {PATHS.map((path) => {
          const list = path.programs.map((id) => programs.find((p) => p.id === id))
          return (
            <article key={path.situation} className="panel group relative flex flex-col border border-line bg-white p-6 transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[var(--shadow-lift)] sm:p-7">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 rounded-t-[var(--radius-panel)] bg-signal transition-transform duration-300 group-hover:scale-x-100" />
              <h3 className="font-display text-[2.1rem] leading-none font-bold">{path.situation}</h3>
              <p className="mt-4 text-ink-soft">{path.body}</p>
              <div className="mt-auto pt-6">
                <p className="text-xs text-ink-soft">Recommended</p>
                <ul className="mt-1 space-y-1.5">
                  {list.map((p) => (
                    <li key={p.id} className="flex items-baseline justify-between gap-3">
                      <Link to={`/programs/${p.id}`} className="link-line">{p.title}</Link>
                      <span className="text-sm tabular-nums text-ink-soft">{formatINR(p.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
      <p className="mt-8 text-ink-soft">
        Still not sure? <Link to="/contact" className="link-line text-ink">Book a consultation</Link> and an advisor will recommend a program.
      </p>
    </Section>
  )
}

// The offer: what the fee buys, the lowest price, and the refund terms, beside the main CTA.
export function Offer({ className = 'bg-card' }) {
  const cheapest = programs.reduce((a, b) => (a.price <= b.price ? a : b))
  return (
    <Section className={className}>
      <div className="grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h2 className="text-[2.5rem] sm:text-[2.9rem] lg:text-4xl">Everything is in one fee.</h2>
          <p className="mt-5 max-w-[32rem] text-lg text-ink-soft">No upsells, no signal subscriptions. Every program includes:</p>
          <ul className="mt-8 space-y-3.5">
            {offer.includes.map((item) => (
              <li key={item} className="flex gap-3.5">
                <span aria-hidden="true" className="mt-1 grid size-5 shrink-0 place-items-center rounded-[4px] bg-board text-[0.7rem] font-bold text-signal">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-8 lg:self-center">
          <Ticket>
            <p className="text-sm text-white/65">Programs from</p>
            <p className="mt-2 font-display text-[4.25rem] leading-none font-bold text-signal tabular-nums">{formatINR(cheapest.price)}</p>
            <p className="mt-2 text-white/70">or AED {Math.min(...programs.map((p) => p.priceAed)).toLocaleString('en-AE')} in the UAE. Pay by card, UPI or Apple Pay.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-brand btn-lg flex-1">Apply now</Link>
              <Link to="/programs" className="btn-outline-light btn-lg flex-1">Compare programs</Link>
            </div>
            <p className="mt-6 border-t border-board-line pt-5 text-sm text-white/65">{offer.refundTerms}</p>
          </Ticket>
        </div>
      </div>
    </Section>
  )
}

export function Faq({ className = '' }) {
  return (
    <Section className={className}>
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <h2 className="text-[2.5rem] sm:text-[2.9rem] lg:text-4xl">Questions before you enrol.</h2>
          <p className="mt-5 text-lg text-ink-soft">Anything else, ask an advisor. Most replies come the same day on WhatsApp.</p>
          <a href={site.whatsappLink} className="btn-primary mt-7">Ask on WhatsApp</a>
        </div>
        <div className="col-span-4 border-t border-ink sm:col-span-8 lg:col-span-7 lg:col-start-6">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold transition-colors marker:hidden hover:text-brand">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-lg leading-none text-ink transition-[transform,background-color,border-color] duration-300 group-open:rotate-45 group-open:border-board group-open:bg-board group-open:text-white" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-[40rem] pb-6 text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function Approach({ action, dark = false, className = '' }) {
  return (
    <Section
      title="Nobody learns to trade from videos alone."
      intro="Every program moves through the same four stages. You go on to the next one when your mentor is satisfied with the last."
      action={action}
      dark={dark}
      className={className}
    >
      <MethodTrack dark={dark} />
    </Section>
  )
}

export function Story() {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="wrap grid-12 gap-y-10">
        <ImageBlock
          ratio="4/3"
          shotNote="A mentor at the whiteboard mid-lesson, students' laptops open, Dubai classroom"
          caption="Evening class, Forex Basic"
          className="col-span-4 sm:col-span-8 lg:col-span-7"
        />
        <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-center">
          <h2 className="text-[2.75rem] sm:text-[3.5rem] lg:text-4xl">From your first chart to a plan of your own.</h2>
          <p className="mt-6 text-ink-soft">
            Most students arrive having watched plenty of videos and taken a few trades they cannot explain. Six weeks later they leave with a plan written in their own words, and a journal to prove they followed it.
          </p>
          <div className="mt-8 border-t-2 border-ink pt-4">
            <h3 className="text-lg">A typical week in Forex Basic</h3>
            <ul className="mt-2">
              {['Two evening classes', 'One practice session on a demo account', 'A Sunday review of the trades you logged'].map((d) => (
                <li key={d} className="border-b border-line py-2.5">{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  return (
    <Section
      title="Where the learning happens."
      intro="Classrooms in Dubai and India, and a live online room for everyone else. Every class is recorded to your student portal."
      className="bg-card"
    >
      <div className="grid-12 gap-y-10">
        <ImageBlock
          ratio="3/2"
          shotNote="Wide shot of the classroom during a live trading review, screen visible"
          caption="Weekly trade review, Dubai"
          className="col-span-4 sm:col-span-8 lg:col-span-8"
        />
        <ImageBlock
          ratio="3/4"
          shotNote="Close-up: a mentor's pen marking a stop loss on a printed chart"
          caption="Marking up a student's chart"
          className="hidden sm:col-span-4 sm:col-start-5 sm:block lg:col-span-4 lg:col-start-9 lg:mt-32"
        />
      </div>
    </Section>
  )
}

const OUTCOMES = [
  ['A written trading plan', 'Your markets, your setups, how much you risk per trade, and the rules for when you stop. Written by you, checked by your mentor.'],
  ['A reviewed trade journal', 'Every trade you logged during the program, with your reasoning and your mentor’s notes beside it.'],
  ['Notes and recordings', 'Module notes and class recordings stay in your student portal, so you can go back to any lesson.'],
  ['A certificate', 'Issued when you complete every lesson and pass every module quiz.'],
]

export function Outcomes() {
  return (
    <Section title="What you leave with." intro="Four things every student has at the end of a program.">
      <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        {OUTCOMES.map(([title, body]) => (
          <div key={title} className="grid gap-3 border-t-2 border-ink pt-5 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
            <dt className="font-display text-[2.1rem] leading-none font-extrabold sm:text-[2.4rem]">{title}</dt>
            <dd className="text-ink-soft">{body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

export function Stories({ limit }) {
  // Sample stories only render on the dev server, never in a production build.
  const visible = stories.filter((s) => !s.sample || import.meta.env.DEV).slice(0, limit)
  if (visible.length === 0) return null
  const [lead, ...rest] = visible
  return (
    <Section title="In their words." intro={lead.sample ? 'Sample stories for layout. They are hidden in production until real ones are added.' : undefined} className="bg-card">
      <div className="grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-9">
          <Testimonial story={lead} />
        </div>
        {rest.map((s, i) => (
          <div key={i} className={`col-span-4 sm:col-span-4 lg:col-span-5 ${i === 0 ? '' : 'lg:col-start-7'}`}>
            <Testimonial story={s} size="small" />
          </div>
        ))}
      </div>
    </Section>
  )
}

// Final conversion band. Navy, so it reads as the close of the page and flows into the footer.
export function FinalCta({ title = 'Start with a conversation.', body = 'Tell us what you trade now, or that you have never traded. We will recommend a program and a batch in Dubai, India or online.' }) {
  return (
    <section className="bg-board text-white">
      <div className="wrap grid-12 gap-y-8 py-16 sm:py-24 lg:py-28">
        <h2 className="col-span-4 text-[3rem] sm:col-span-8 sm:text-5xl lg:col-span-7 lg:text-6xl">{title}</h2>
        <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lg leading-relaxed text-white/75">{body}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="btn-brand btn-lg">Apply now</Link>
            <a href={site.whatsappLink} className="btn-outline-light btn-lg">Chat on WhatsApp</a>
          </div>
          <p className="mt-5 text-sm text-white/60">
            Prefer email? <Link to="/contact" className="link-line text-white">Send an enquiry</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
