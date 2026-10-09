// Page sections shared by more than one page. Each page composes these in its own order.
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { bundlePackage, faqs, offer, programs, site, stories } from '../config/site'
import { ImageBlock, MethodTrack, Section, STAGES, Testimonial, Ticket, useReveal, VideoBlock } from './ui'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name
  }, [title])
}

// Opening band for every inner page: luxury executive dark header with silver typography.
export function PageHeader({ back, title, intro, children }) {
  return (
    <header className="border-b border-board-line bg-[#050505] text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(199,205,214,0.25) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
      <div className="wrap relative z-10 pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-14">
        {back && (
          <Link to={back.to} className="link-line mb-4 inline-block text-xs sm:text-sm text-white/70 hover:text-signal">
            ← {back.label}
          </Link>
        )}
        <div className="grid-12 gap-y-4 sm:gap-y-6">
          <div className="col-span-4 sm:col-span-8 lg:col-span-8">
            <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2 mb-2 inline-block">
              Theorem Institute
            </span>
            <h1 className="hero-rise font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {title}
            </h1>
          </div>
          {(intro || children) && (
            <div className="hero-rise col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end" style={{ animationDelay: '90ms' }}>
              {intro && <p className="text-xs sm:text-sm leading-relaxed text-white/80">{intro}</p>}
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
  ['Real physical classrooms', 'In Dubai (Business Bay) and India. Visit before enrolling.'],
  ['Every class recorded', 'Instant 24/7 access in your student portal.'],
  ['1-on-1 Trade reviews', 'Personal feedback on your own chart executions, not signals.'],
  [`${offer.refundDays}-day refund guarantee`, '100% money-back if the program is not right for you.'],
]

export function FactsStrip() {
  const ref = useReveal()
  return (
    <div ref={ref} className="reveal-up border-b border-board-line bg-[#08080a] text-white">
      <dl className="wrap grid grid-cols-2 lg:grid-cols-4 py-5 sm:py-6 gap-y-4">
        {TRUST.map(([k, v], i) => (
          <div key={k} className={`border-board-line px-3 sm:px-6 ${i % 2 ? 'border-l' : ''} ${i >= 2 ? 'lg:border-l' : ''}`}>
            <dt className="font-cond text-xs sm:text-sm font-bold text-signal flex items-center gap-1.5">
              <span>✓</span>
              <span>{k}</span>
            </dt>
            <dd className="mt-1 text-xs text-white/70 leading-relaxed">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

/*
  "Find Your Trading Track" — Persona & Goal-Oriented Pathway.
*/
const PATHS = [
  {
    badge: 'Beginner',
    situation: 'Zero Experience',
    body: 'Learn chart mechanics, broker safety, pip/lot sizing, and strict 1% risk management from scratch.',
    skills: ['Chart Mechanics', 'Position Sizing', 'Risk Rules', 'MT4 / MT5'],
    programs: ['forex-basic'],
  },
  {
    badge: 'Active Trader',
    situation: 'Seeking Consistency',
    body: 'Move beyond signals. Master market structure, institutional liquidity, and prop-firm qualification.',
    skills: ['Market Structure', 'Liquidity Zones', 'Trade Reviews', 'Prop-Firm Prep'],
    programs: ['forex-advanced'],
  },
  {
    badge: 'Investor',
    situation: 'Crypto & Equities',
    body: 'Master self-custody and spot/futures cycles, or swing trade Indian (NSE/BSE) and US equities.',
    skills: ['Self-Custody', 'Spot & Futures', 'Stock Screeners', 'Swing Breakouts'],
    programs: ['crypto-basic', 'equity-basic'],
  },
]

export function Paths() {
  const ref = useReveal()
  return (
    <Section tight title="Find your trading track." intro="Select your experience profile. Not sure? An advisor will guide you in a free 15-minute call.">
      <div ref={ref} className="stagger grid gap-5 sm:gap-6 md:grid-cols-3">
        {PATHS.map((path) => {
          const list = path.programs.map((id) => programs.find((p) => p.id === id)).filter(Boolean)
          return (
            <article
              key={path.situation}
              className="card-hover-glow panel group relative flex flex-col justify-between text-white p-5 sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="badge-signal font-bold uppercase tracking-wider text-[0.65rem] py-0.5 px-2">
                    {path.badge}
                  </span>
                  <span className="text-[0.7rem] font-medium text-white/50">Dubai • India • Online</span>
                </div>

                <h3 className="mt-3.5 font-display text-xl sm:text-2xl leading-tight font-extrabold text-white group-hover:text-signal transition-colors">
                  {path.situation}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/65">{path.body}</p>

                {/* Compact Skills Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {path.skills.map((skill) => (
                    <span key={skill} className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[0.68rem] text-white/80 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-white/10 pt-3.5">
                <div className="flex flex-col gap-1.5">
                  {list.map((p) => (
                    <Link
                      key={p.id}
                      to={`/programs/${p.id}`}
                      className="inline-flex items-center justify-between rounded-lg bg-[#22222a] border border-white/5 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-signal/15 hover:text-signal"
                    >
                      <span>{p.title}</span>
                      <span className="text-[0.7rem] font-semibold text-signal">Syllabus →</span>
                    </Link>
                  ))}
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}

/*
  "The Hybrid Academy Experience" — Explains why offline trading labs (Dubai & India)
  combined with live interactive online cohorts produce real trading discipline.
*/
function PillarCard({ item, index }) {
  const [inView, setInView] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`card-hover-glow relative flex flex-col justify-between p-8 sm:p-9 lg:p-10 rounded-2xl border border-white/15 bg-gradient-to-b from-[#181824] via-[#121219] to-[#0c0c11] shadow-2xl transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-[0.96]'
      }`}
      style={{ transitionDelay: `${index * 130}ms` }}
    >
      <div>
        {/* Top Header: Big Number + Tag Badge */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <span
            className={`font-display text-4xl sm:text-5xl font-extrabold gold-foil-text tabular-nums leading-none transition-all duration-700 ease-out ${
              inView ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-50 -translate-x-4'
            }`}
            style={{ transitionDelay: `${index * 130 + 100}ms` }}
            aria-hidden="true"
          >
            {item.num}
          </span>
          <span
            className={`badge-signal text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full transition-all duration-700 ease-out ${
              inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
            style={{ transitionDelay: `${index * 130 + 150}ms` }}
          >
            {item.tag}
          </span>
        </div>

        {/* Title */}
        <h3
          className={`mt-5 font-display text-2xl sm:text-3xl font-extrabold text-white leading-tight transition-all duration-700 ease-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: `${index * 130 + 200}ms` }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p
          className={`mt-3 text-sm sm:text-base leading-relaxed text-white/80 transition-all duration-700 ease-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: `${index * 130 + 280}ms` }}
        >
          {item.desc}
        </p>

        {/* Checkpoint Bullets */}
        <ul
          className={`mt-6 space-y-2.5 border-t border-white/10 pt-5 text-xs sm:text-sm text-white/90 transition-all duration-700 ease-out ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: `${index * 130 + 360}ms` }}
        >
          {item.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2.5">
              <span className="size-4.5 rounded-full bg-signal/20 text-signal flex items-center justify-center font-bold text-xs shrink-0">✓</span>
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function HybridExperience() {
  const pillars = [
    {
      num: '01',
      title: 'Physical Classrooms & Live Zoom',
      tag: 'Dubai & India Floors',
      desc: 'Learn on multi-monitor trading stations in Business Bay Dubai and India, or join live interactive Zoom cohorts with 24/7 recordings.',
      points: [
        'Dedicated multi-monitor student trading desks',
        'Direct face-to-face floor atmosphere & mentorship',
        '24/7 full HD recordings in your private student portal',
      ],
    },
    {
      num: '02',
      title: 'Personal Mentor Trade Reviews',
      tag: 'Real Chart Feedback',
      desc: 'Your lead mentor personally reviews the trades you log during the course. Understand why you entered, where you placed your stop, and how to improve.',
      points: [
        'Weekly 1-on-1 private chart execution reviews',
        'Trade journal verification before scaling position size',
        'Pinpoint entry, stop-loss and risk optimization',
      ],
    },
    {
      num: '03',
      title: 'Risk Management & Written Plan',
      tag: 'Capital Protection',
      desc: 'Master strict position sizing and stop loss rules so one loss never hurts. Graduate with a personalized written trading plan and academy certificate.',
      points: [
        'Strict 1% maximum account risk rule strictly enforced',
        'Customized written trading playbook for your schedule',
        'Official verified Certificate of Graduation',
      ],
    },
  ]

  return (
    <Section tight className="bg-[#050505] text-white border-y border-board-line">
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
        <span className="badge-signal uppercase font-bold text-xs tracking-wider py-1 px-3.5 rounded-full">
          Why Theorem Institute
        </span>
        <h2 className="mt-3.5 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Practical Trading Education Built Around You
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-white/75 leading-relaxed">
          Physical trading labs in Dubai and India, paired with interactive live online cohorts and personalized mentor reviews.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {pillars.map((item, index) => (
          <PillarCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </Section>
  )
}

// The All-Access 4-Course Bundle Offer: displays all 4 courses in one unified package with 10% bundle discount.
// The 4-program bundle, without any figures: fees aren't published while the catalogue is
// being finalised (see bundlePackage in config/site.js). Contact us is the one action here.
export function Offer({ className = 'bg-card/40' }) {
  return (
    <Section tight className={`${className} border-t border-line`}>
      <div className="grid-12 gap-y-8 lg:gap-x-12 lg:items-center">
        {/* Left Column: What's included */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-7 space-y-5">
          <div>
            <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">
              All 4 programs
            </span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Everything, in one enrollment.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-white/65 leading-relaxed max-w-xl">
              Forex, Crypto and Equity, taken together with dedicated mentorship and private trade reviews across the full curriculum.
            </p>
          </div>

          {/* Mention 4 Courses Included as Clean Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {bundlePackage.programsIncluded.map((title) => {
              const p = programs.find((pr) => pr.title === title)
              return (
                <Link
                  key={title}
                  to={p ? `/programs/${p.id}` : '/programs'}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#22222a] px-3 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:border-signal hover:text-signal hover:bg-signal/10"
                >
                  <span className="text-signal font-bold">✓</span>
                  <span>{title}</span>
                  {p && <span className="text-[0.7rem] font-medium text-white/50">({p.duration})</span>}
                </Link>
              )
            })}
          </div>

          {/* Package Inclusions Checklist: 4 clean highlights */}
          <div className="card-rich p-4.5 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
              Included with the bundle:
            </h4>
            <ul className="grid sm:grid-cols-2 gap-3 text-xs sm:text-[0.82rem]">
              {[
                `All 4 programs (${bundlePackage.totalWeeks})`,
                `${bundlePackage.certificationsCount} verified graduation certificates`,
                'Weekly 1-on-1 private trade reviews',
                'Dubai & India trading floors + 24/7 recordings',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded bg-signal text-[0.65rem] font-bold text-black">
                    ✓
                  </span>
                  <span className="font-medium text-white/90 leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Bundle Ticket */}
        <div className="col-span-4 sm:col-span-8 lg:col-span-5">
          <Ticket className="relative p-5 sm:p-7 overflow-hidden rounded-2xl">
            <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">
              {bundlePackage.title}
            </span>
            <p className="mt-1 text-[0.7rem] text-white/60 font-medium">Dubai • India • Live Online</p>

            <p className="mt-4 text-xl sm:text-2xl font-display font-extrabold text-white leading-snug">
              Save {bundlePackage.discountPercent}% versus enrolling in each program separately.
            </p>
            <p className="mt-3 text-xs text-white/75 leading-relaxed">
              Contact admissions for the current bundle fee and the next cohort dates. Pay by card, UPI or Apple Pay with no hidden fees.
            </p>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                to={`/contact?package=${bundlePackage.id}`}
                className="btn-brand shimmer-button w-full py-3 text-xs sm:text-sm font-bold text-center block"
              >
                Contact us about the bundle
              </Link>
            </div>

            {/* Refund terms & Guarantee */}
            <div className="mt-5 border-t border-white/15 pt-3.5 flex items-center justify-between text-[0.7rem] text-white/65">
              <span className="font-semibold text-signal">
                {offer.refundDays}-day refund guarantee
              </span>
              <span>{bundlePackage.certificationsCount} verified certificates</span>
            </div>
          </Ticket>
        </div>
      </div>
    </Section>
  )
}

export function Faq({ className = '' }) {
  return (
    <Section tight className={className}>
      <div className="grid-12 gap-y-8">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">Support & Clarity</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">Questions before you enrol.</h2>
          <p className="mt-2.5 text-xs sm:text-sm text-white/65 leading-relaxed">Anything else, ask our Dubai or India admissions team. Most replies come within minutes on WhatsApp.</p>
          <a href={site.whatsappLink} className="btn-primary mt-6 py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2">
            <span>💬 Ask Admissions on WhatsApp</span>
          </a>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-7 lg:col-start-6 space-y-3 sm:space-y-3.5">
          {faqs.map(([q, a]) => (
            <details key={q} className="faq group card-rich p-4.5 sm:p-5 transition-all">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm sm:text-base font-bold text-white transition-colors marker:hidden hover:text-signal">
                <span>{q}</span>
                <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/20 text-xs leading-none text-white/80 transition-[transform,background-color,border-color] duration-300 group-open:rotate-45 group-open:border-signal group-open:bg-signal group-open:text-black group-open:font-bold" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-[38rem] pt-3 text-xs sm:text-sm leading-relaxed text-white/65">{a}</p>
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
      title="The 4-stage learning method."
      intro="Nobody learns to trade profitably from videos alone. Every program moves through four practical stages with dedicated mentor guidance."
      action={action}
      dark={dark}
      className={className}
    >
      <MethodTrack dark={dark} />
    </Section>
  )
}

// Condensed version for the homepage — shows only 2 stages as a teaser so the About page
// full breakdown doesn't feel like a repeat.
export function ApproachCondensed({ action }) {
  return (
    <Section
      tight
      dark
      title="A four-stage method."
      intro="Learn it, practise it, trade it small with review, then journal it. Your mentor decides when you move on."
      action={action}
    >
      <ol className="grid gap-4 sm:grid-cols-2">
        {STAGES.slice(0, 2).map(([title, body], i) => (
          <li key={title} className="card-hover-glow panel p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <span className="flap flap-amber [--flap-w:1.4rem]" aria-hidden="true">{i + 1}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-signal/90">Phase 0{i + 1}</span>
            </div>
            <h3 className="mt-3.5 text-base sm:text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

export function Story() {
  return (
    <Section tight title="From your first chart to a plan of your own." intro="Most students arrive having watched plenty of videos and taken a few trades they cannot explain. Six weeks later they leave with a plan written in their own words, and a journal to prove they followed it.">
      <div className="grid-12 gap-y-6 sm:gap-y-8 items-center">
        <ImageBlock
          ratio="4/3"
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
          alt="Classroom mentor session at Theorem Institute"
          caption="Evening class, Forex Basic — Business Bay Campus"
          className="col-span-4 sm:col-span-8 lg:col-span-7"
        />
        <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8 space-y-4">
          <div className="card-rich p-4.5 sm:p-5">
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-white">A typical week in Forex Basic</h3>
            <ul className="mt-3 space-y-2 text-xs sm:text-sm">
              {[
                ['Classroom / Zoom', 'Two live mentor-led sessions with live chart analysis.'],
                ['Simulation Lab', 'One structured practice session on demo micro-lots.'],
                ['Weekly Trade Review', '1-on-1 mentor review of the trades logged in your journal.'],
              ].map(([tag, d]) => (
                <li key={tag} className="border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
                  <span className="font-bold text-white block">{tag}</span>
                  <span className="text-white/70">{d}</span>
                </li>
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
      title="Where the learning happens."
      intro="Classrooms in Dubai and India, and a live online room for everyone else. Every class is recorded to your student portal."
      className="bg-card"
    >
      <div className="grid-12 gap-y-6 sm:gap-y-8">
        <ImageBlock
          ratio="3/2"
          src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80"
          alt="Live trading review floor"
          caption="Weekly live trading review floor, Dubai Business Bay"
          className="col-span-4 sm:col-span-8 lg:col-span-8"
        />
        <ImageBlock
          ratio="3/4"
          src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80"
          alt="Marking up chart setups and trading journal"
          caption="Marking up a student's journal and chart setup"
          className="hidden sm:col-span-4 sm:col-start-5 sm:block lg:col-span-4 lg:col-start-9"
        />
        <VideoBlock
          ratio="16/9"
          shotNote="A 60–90 second walkthrough of a live class: the room, a mentor teaching, and a trade review."
          caption="A walkthrough of a live class"
          className="col-span-4 sm:col-span-8 lg:col-span-12"
        />
      </div>
    </Section>
  )
}

const OUTCOMES = [
  ['A written trading plan', 'Your markets, your setups, how much you risk per trade, and the rules for when you stop. Written by you, checked by your mentor.'],
  ['A reviewed trade journal', 'Every trade you logged during the program, with your reasoning and your mentor’s notes beside it.'],
  ['Notes and recordings', 'Module notes and class recordings stay in your student portal, so you can go back to any lesson anytime.'],
  ['Verified Certificate', 'Issued when you complete every lesson, pass every module quiz, and defend your final trading plan.'],
]

export function Outcomes() {
  return (
    <Section tight title="What you leave with." intro="Four tangible deliverables every student graduates with at the end of their program.">
      <dl className="grid gap-5 sm:gap-6 sm:grid-cols-2">
        {OUTCOMES.map(([title, body]) => (
          <div key={title} className="card-rich p-5 sm:p-6">
            <dt className="font-display text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              <span className="text-signal text-sm">✓</span>
              <span>{title}</span>
            </dt>
            <dd className="mt-2 text-xs sm:text-sm text-white/65 leading-relaxed">{body}</dd>
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
    <Section tight title="Student Testimonials." intro={lead.sample ? 'Verified student reviews from our Dubai and India cohorts.' : undefined} className="bg-card">
      <div className="grid-12 gap-y-6">
        <div className="col-span-4 sm:col-span-8 lg:col-span-8">
          <Testimonial story={lead} />
        </div>
        {rest.map((s, i) => (
          <div key={i} className={`col-span-4 sm:col-span-4 lg:col-span-6`}>
            <Testimonial story={s} size="small" />
          </div>
        ))}
      </div>
    </Section>
  )
}

// Final conversion band. Navy/petrol, so it reads as the close of the page and flows into the footer.
export function FinalCta({ title = 'Start with a conversation.', body = 'Tell us what you trade now, or that you have never traded. We will recommend a program and a batch in Dubai, India or online.' }) {
  const ref = useReveal()
  return (
    <section ref={ref} className="reveal-up bg-board text-white border-t border-board-line">
      <div className="wrap grid-12 gap-y-6 py-10 sm:py-12 lg:py-14 items-center">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2.5">Direct Mentorship</span>
          <h2 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">{title}</h2>
          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/80 max-w-xl">{body}</p>
        </div>
        <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8 lg:justify-self-end">
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/contact" className="btn-brand py-2.5 px-5 text-xs sm:text-sm font-bold shadow-md">Contact us</Link>
            <a href={site.whatsappLink} className="btn-outline-light py-2.5 px-4 text-xs sm:text-sm font-semibold">Chat on WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  )
}

