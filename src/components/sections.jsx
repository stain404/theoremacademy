// Page sections shared by more than one page. Each page composes these in its own order.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { bundlePackage, faqs, formatINR, offer, programs, site, stories } from '../config/site'
import TradingPlan from './TradingPlan'
import { ImageBlock, MarketDot, MethodTrack, Section, STAGES, Testimonial, toneOf } from './ui'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name
  }, [title])
}

// Opening band for every inner page: title left, intro right, on mist.
export function PageHeader({ back, title, meta, intro, children }) {
  return (
    <header className="border-b border-line bg-card">
      <div className="wrap pt-10 pb-12 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        {back && (
          <Link to={back.to} className="link-line mb-6 inline-block text-sm text-ink-soft hover:text-ink sm:mb-8">
            {back.label}
          </Link>
        )}
        <div className="grid-12 gap-y-5">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <h1 className="hero-rise text-4xl sm:text-5xl lg:text-[3.75rem]">{title}</h1>
            {meta && <div className="hero-rise mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-soft" style={{ animationDelay: '60ms' }}>{meta}</div>}
          </div>
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

function Check({ className = '' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-4 shrink-0 text-brand ${className}`} aria-hidden="true">
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  )
}

// Reasons to trust the academy, stated plainly.
const TRUST = [
  ['Real classrooms', 'In Business Bay, Dubai, and in India. Visit before you enrol.'],
  ['Every class recorded', 'Watch any lesson again in your student portal.'],
  ['Your trades reviewed', 'Feedback on your own decisions, not signals to copy.'],
  [`${offer.refundDays}-day refund`, 'Full refund if the program is not right for you.'],
]

export function FactsStrip() {
  return (
    <div className="border-y border-line">
      <dl className="wrap grid divide-y divide-line sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 lg:grid-cols-4 lg:gap-x-0 lg:divide-x">
        {TRUST.map(([k, v]) => (
          <div key={k} className="py-5 sm:py-7 lg:px-7 lg:first:pl-0 lg:last:pr-0">
            <dt className="flex items-start gap-2 font-semibold"><Check className="mt-1" />{k}</dt>
            <dd className="mt-1 pl-6 text-sm text-ink-soft">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/*
  "Where do you start?" Three honest situations, each pointing at the right program.
  These are choices, so the whole card is the link.
*/
const PATHS = [
  { situation: 'I have never traded.', body: 'Start from zero: charts, brokers, and sizing a trade so that one loss never hurts.', programs: ['forex-basic'] },
  { situation: 'I trade, but without a plan.', body: 'Market structure, liquidity and a weekly review of your live trades.', programs: ['forex-advanced'] },
  { situation: 'I want crypto or stocks.', body: 'Exchanges and self-custody, or Indian and US equities with a swing trading method.', programs: ['crypto', 'equity'] },
]

export function Paths({ tone }) {
  return (
    <Section tight tone={tone} title="Where do you start?" intro="Pick the line that sounds most like you. If none fit, an advisor will help you choose in a 15-minute call.">
      <div className="grid gap-5 md:grid-cols-3">
        {PATHS.map((path) => {
          const list = path.programs.map((id) => programs.find((p) => p.id === id)).filter(Boolean)
          return (
            <article key={path.situation} className="card-rich relative flex flex-col overflow-hidden p-6 sm:p-7">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1">
                {list.map((p) => <span key={p.id} className={`flex-1 ${toneOf(p.market).dot}`} />)}
              </span>
              <h3 className="text-2xl">{path.situation}</h3>
              <p className="mt-3 text-ink-soft">{path.body}</p>
              <div className="mt-auto pt-6">
                <ul className="space-y-1 border-t border-line pt-4">
                  {list.map((p) => (
                    <li key={p.id} className="flex items-baseline justify-between gap-3">
                      <Link to={`/programs/${p.id}`} className="flex items-center gap-2"><MarketDot market={p.market} /><span className="link-line text-brand">{p.title}</span></Link>
                      <span className="text-sm tabular-nums text-ink-soft">{formatINR(p.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

/*
  Why the academy works: three commitments, as an editorial list beside the heading
  rather than three identical cards. They are not a sequence, so they are not numbered.
*/
const PILLARS = [
  {
    title: 'Classrooms you can walk into',
    body: 'Learn at a trading desk in Business Bay, Dubai, or in our India lab, or join the same class live on Zoom. Every session is recorded to your portal.',
    points: ['Multi-monitor student desks', 'Cohorts of 15 or fewer', 'Recordings within 24 hours'],
  },
  {
    title: 'A mentor who reviews your trades',
    body: 'Your mentor reads the trades you log each week: why you entered, where your stop was, and what you would change. You learn from your own decisions.',
    points: ['Weekly one-to-one trade review', 'Journal checked before you size up', 'The same mentor from first class to last'],
  },
  {
    title: 'Risk first, then a written plan',
    body: 'Position sizing and stop losses come before setups, so one loss never hurts. You graduate with a trading plan written in your own words.',
    points: ['1% maximum risk per trade', 'A personal written playbook', 'Certificate on completion'],
  },
]

export function HybridExperience() {
  return (
    <Section tight>
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl lg:sticky lg:top-28">Practical trading education, built around you.</h2>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-7 lg:col-start-6">
          {PILLARS.map((p) => (
            <div key={p.title} className="grid gap-x-8 gap-y-3 border-t border-line py-8 first:border-t-ink first:pt-6 sm:grid-cols-[1fr_14rem] last:pb-0">
              <div>
                <h3 className="text-2xl">{p.title}</h3>
                <p className="mt-3 max-w-[34rem] text-ink-soft">{p.body}</p>
              </div>
              <ul className="space-y-2 text-sm sm:pt-1.5">
                {p.points.map((pt) => <li key={pt} className="flex gap-2"><Check className="mt-0.5" />{pt}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

// The all-four-courses bundle: what it includes beside the price and the main action.
export function Offer({ tone = 'mist', className = '' }) {
  const [currency, setCurrency] = useState('INR')
  const isAed = currency === 'AED'
  const money = (inr, aed) => (isAed ? `AED ${aed.toLocaleString('en-AE')}` : formatINR(inr))

  return (
    <Section tight tone={tone} className={className}>
      <div className="grid-12 gap-y-10 lg:items-center">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <span className="badge-save">Save {bundlePackage.discountPercent}%</span>
          <h2 className="mt-4 text-3xl sm:text-4xl">All four programs, one fee.</h2>
          <p className="mt-4 max-w-[34rem] text-lg text-ink-soft">
            Forex Basic, Forex Advanced, Crypto Trading and the Equity Course, taken in order with the same mentors and one student portal.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              bundlePackage.totalWeeks,
              `${bundlePackage.certificationsCount} certificates`,
              'Weekly one-to-one trade reviews',
              'Dubai, India or online, recorded',
              'Module notes to download',
              'Help on WhatsApp throughout',
            ].map((item) => (
              <li key={item} className="flex gap-2.5"><Check className="mt-1" />{item}</li>
            ))}
          </ul>
        </div>

        <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-8">
          <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">All-access pass</p>
              <div className="inline-flex rounded-[var(--radius-ctl)] border border-line bg-card p-1 text-sm" role="radiogroup" aria-label="Currency">
                {[['INR', '₹'], ['AED', 'AED']].map(([val, label]) => (
                  <button key={val} type="button" role="radio" aria-checked={currency === val} onClick={() => setCurrency(val)}
                    className={`rounded-[7px] px-3 py-1 font-semibold transition-colors ${currency === val ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(14_27_23/0.12)]' : 'text-ink-soft hover:text-ink'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <dl className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between gap-4 text-ink-soft">
                <dt>Four programs bought separately</dt>
                <dd className="tabular-nums line-through">{money(bundlePackage.totalInr, bundlePackage.totalAed)}</dd>
              </div>
              <div className="flex justify-between gap-4 text-brand">
                <dt>Bundle saving</dt>
                <dd className="tabular-nums font-semibold">−{money(bundlePackage.savingsInr, bundlePackage.savingsAed)}</dd>
              </div>
            </dl>
            <p className="mt-5 border-t border-line pt-5 text-sm text-ink-soft">You pay</p>
            <p className="font-display text-5xl font-semibold tabular-nums">{money(bundlePackage.discountedInr, bundlePackage.discountedAed)}</p>
            <div className="mt-7 flex flex-col gap-3">
              <Link to={`/register?program=${bundlePackage.id}`} className="btn-brand btn-lg">Enrol in all four</Link>
              <Link to="/contact?package=all-4-courses" className="btn-ghost btn-lg">Talk to an advisor first</Link>
            </div>
            <p className="mt-5 text-sm text-ink-soft">{offer.refundTerms} Pay by card, UPI or Apple Pay.</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Faq({ tone, className = '' }) {
  return (
    <Section tight tone={tone} className={className}>
      <div className="grid-12 gap-y-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl">Questions before you enrol.</h2>
          <p className="mt-4 text-lg text-ink-soft">Anything else, ask our admissions team. Most WhatsApp replies come within the hour.</p>
          <a href={site.whatsappLink} className="btn-primary mt-7">Ask on WhatsApp</a>
        </div>
        <div className="col-span-4 border-t border-ink sm:col-span-8 lg:col-span-7 lg:col-start-6">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold transition-colors marker:hidden hover:text-brand">
                {q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-[transform,background-color,border-color,color] duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-paper" aria-hidden="true">
                  <svg viewBox="0 0 12 12" className="size-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 1.5v9M1.5 6h9" /></svg>
                </span>
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
      tight
      title="Four stages, in order."
      intro="Nobody learns to trade from videos alone. Every program moves through the same four stages, and your mentor decides when you are ready for the next."
      action={action}
      dark={dark}
      className={className}
    >
      <MethodTrack dark={dark} />
    </Section>
  )
}

// Shorter version: the first two stages only.
export function ApproachCondensed({ action }) {
  return (
    <Section tight dark title="A four-stage method." intro="Learn it, practise it, trade it small with review, then write your plan." action={action}>
      <ol className="grid gap-8 sm:grid-cols-2">
        {STAGES.slice(0, 2).map(([title, body], i) => (
          <li key={title} className="border-t border-white/20 pt-5">
            <span className="text-sm text-white/60">Stage {i + 1}</span>
            <h3 className="mt-2 text-xl">{title}</h3>
            <p className="mt-2 text-white/70">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Story() {
  return (
    <Section tight>
      <div className="grid-12 items-center gap-y-10">
        <TradingPlan className="col-span-4 sm:col-span-7 lg:col-span-6" />
        <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8">
          <h2 className="text-3xl sm:text-4xl">From your first chart to a plan of your own.</h2>
          <p className="mt-5 text-ink-soft">
            Most students arrive having watched plenty of videos and taken a few trades they cannot explain. Six weeks later they leave with a plan written in their own words, and a journal to prove they followed it.
          </p>
          <div className="mt-8 border-t border-ink pt-4">
            <h3 className="text-lg">A typical week in Forex Basic</h3>
            <ul className="mt-2">
              {['Two live classes, in person or on Zoom', 'One practice session on a demo account', 'A one-to-one review of the trades you logged'].map((d) => (
                <li key={d} className="border-b border-line py-2.5">{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}

export function Experience() {
  return (
    <Section
      tight
      tone="mist"
      title="Where the learning happens."
      intro="Classrooms in Dubai and India, and a live online room for everyone else. Every class is recorded to your student portal."
    >
      <div className="grid-12 gap-y-8">
        <ImageBlock
          ratio="3/2"
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1400&q=80"
          alt="Trading charts on screens"
          /* placeholder: stock photo, replace with the real classroom */
          className="col-span-4 sm:col-span-8 lg:col-span-8"
        />
        <ImageBlock
          ratio="3/4"
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80"
          alt="A candlestick chart on a screen"
          /* placeholder: stock photo */
          className="hidden sm:col-span-4 sm:col-start-5 sm:block lg:col-span-4 lg:col-start-9 lg:mt-24"
        />
      </div>
    </Section>
  )
}

const OUTCOMES = [
  ['A written trading plan', 'Your markets, your setups, how much you risk per trade, and the rules for when you stop. Written by you, checked by your mentor.'],
  ['A reviewed trade journal', 'Every trade you logged during the program, with your reasoning and your mentor’s notes beside it.'],
  ['Notes and recordings', 'Module notes and class recordings stay in your student portal, so you can go back to any lesson.'],
  ['A certificate', 'Issued when you complete every lesson, pass every module quiz and present your final plan.'],
]

/*
  Proof: what a student actually leaves with, shown as the document itself.
*/
export function Proof({ tone = 'mist' }) {
  return (
    <Section tight tone={tone}>
      <div className="grid-12 items-center gap-y-14">
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <h2 className="text-3xl sm:text-4xl">Leave with a plan you can show.</h2>
          <p className="mt-5 max-w-[32rem] text-lg text-ink-soft">
            Watching lessons is not the goal. Every program ends with a one-page plan you wrote, tested on a demo account and traded small, with your mentor's notes on it.
          </p>
          <dl className="mt-8 border-t border-ink">
            {OUTCOMES.map(([title, body]) => (
              <div key={title} className="border-b border-line py-4">
                <dt className="font-semibold">{title}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{body}</dd>
              </div>
            ))}
          </dl>
          <Link to="/programs/forex-basic" className="link-line mt-7 inline-block text-brand">See the Forex Basic syllabus</Link>
        </div>
        <TradingPlan className="col-span-4 sm:col-span-7 lg:col-span-6 lg:col-start-7" />
      </div>
    </Section>
  )
}

export function Outcomes() {
  return (
    <Section tight title="What you leave with." intro="Four things every student has at the end of a program.">
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {OUTCOMES.map(([title, body]) => (
          <div key={title} className="border-t border-ink pt-5">
            <dt className="font-display text-2xl font-semibold">{title}</dt>
            <dd className="mt-2 max-w-[30rem] text-ink-soft">{body}</dd>
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
    <Section tight tone="mist" title="In their words." intro={lead.sample ? 'Sample stories for layout. They are hidden on the live site until real ones are added.' : undefined}>
      <div className="grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-9">
          <Testimonial story={lead} />
        </div>
        {rest.map((s, i) => (
          <div key={i} className="col-span-4 lg:col-span-5">
            <Testimonial story={s} size="small" />
          </div>
        ))}
      </div>
    </Section>
  )
}

// Final conversion band: ink, so it reads as the close of the page and leads into the footer.
export function FinalCta({ title = 'Start with a conversation.', body = 'Tell us what you trade now, or that you have never traded. An advisor will recommend a program and a batch in Dubai, India or online.' }) {
  return (
    <section className="bg-board text-white">
      <div className="wrap grid-12 gap-y-8 border-b border-white/12 py-16 sm:py-20 lg:py-24">
        <h2 className="col-span-4 text-4xl sm:col-span-8 sm:text-5xl lg:col-span-7">{title}</h2>
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
