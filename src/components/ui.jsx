import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatINR, programs as allPrograms } from '../config/site'

// Adds .is-visible once the element scrolls into view (used for smooth scroll reveals).
export function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

/*
  Luxury Top Scroll Progress Indicator
  Fills dynamically based on current page scroll position.
*/
export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100)
      }
    }
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-r from-signal via-[#ffd778] to-signal shadow-[0_0_10px_rgba(242,177,52,0.8)] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

/*
  Section: heading on the left, intro on the right aligned to the heading's baseline.
  The asymmetric split is the site's standard section opening.
  Includes smooth scroll reveal.
*/
export function Section({ id, title, intro, action, children, dark = false, tight = false, className = '' }) {
  const py = tight ? 'py-12 sm:py-16 lg:py-20' : 'py-16 sm:py-20 lg:py-24'
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className={`scroll-mt-20 reveal-up ${py} ${dark ? 'bg-[#09090b] text-white' : 'bg-[#121215] text-white'} ${className}`}>
      <div className="wrap">
        {title && (
          <header className="grid-12 mb-8 sm:mb-12 gap-y-3 sm:gap-y-4">
            <h2 className="col-span-4 font-display text-2xl font-extrabold sm:col-span-8 sm:text-3xl lg:col-span-6 lg:text-4xl tracking-tight leading-tight text-white">{title}</h2>
            {(intro || action) && (
              <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8 lg:self-end">
                {intro && <p className="text-xs sm:text-sm leading-relaxed text-white/65 max-w-lg">{intro}</p>}
                {action && <div className="mt-2.5 text-xs font-semibold">{action}</div>}
              </div>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

/*
  Image block. Pass `src` when real photography exists; until then it renders a
  placeholder at the correct ratio, captioned with what should be photographed.
*/
export function ImageBlock({ src, alt = '', ratio = '3/2', caption, shotNote, className = '' }) {
  const ref = useReveal()
  return (
    <figure ref={ref} className={className}>
      <div className="reveal panel relative overflow-hidden bg-stone" style={{ aspectRatio: ratio }}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5" role="img" aria-label={`Photo placeholder: ${shotNote || caption}`}>
            <p className="max-w-[28ch] text-xs leading-snug text-ink-soft">{shotNote}</p>
            <p className="mt-1 text-[0.65rem] text-ink-soft/70">Photo to come, {ratio.replace('/', ':')}</p>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-2 text-xs text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

// Dark panel for anything transactional: fees, order summaries. Same surface as the board.
export function Ticket({ children, className = '' }) {
  return (
    <div className={`gold-foil-border-glow rounded-2xl p-5 text-white shadow-2xl sm:p-6 ${className}`}>
      {children}
    </div>
  )
}

/*
  Modern Program Cards: High-converting educational course cards with currency toggle,
  hybrid delivery badges, outcome checklists, and compact clean height.
*/
export function ProgramCards({ programs = allPrograms }) {
  const [currency, setCurrency] = useState('INR')
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? programs : programs.filter((p) => p.market.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-4">
      {/* Controls Bar: Filter by Market + Currency Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap gap-1.5">
          {[
            ['all', 'All Programs'],
            ['forex', 'Forex'],
            ['crypto', 'Crypto'],
            ['equity', 'Equities'],
          ].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilter(val)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                filter === val
                  ? 'bg-signal text-black font-extrabold shadow-sm'
                  : 'border border-white/10 bg-[#1e1e26] text-white/70 hover:border-signal/40 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#1e1e26] p-1">
          <span className="px-2 text-[0.7rem] font-bold text-white/60">Fee:</span>
          <button
            type="button"
            onClick={() => setCurrency('INR')}
            className={`rounded-md px-2.5 py-0.5 text-xs font-bold transition-all ${
              currency === 'INR' ? 'bg-signal text-black shadow-sm font-extrabold' : 'text-white/60 hover:text-white'
            }`}
          >
            ₹ INR (India)
          </button>
          <button
            type="button"
            onClick={() => setCurrency('AED')}
            className={`rounded-md px-2.5 py-0.5 text-xs font-bold transition-all ${
              currency === 'AED' ? 'bg-signal text-black shadow-sm font-extrabold' : 'text-white/60 hover:text-white'
            }`}
          >
            AED (Dubai)
          </button>
        </div>
      </div>

      {/* Grid of Compact Course Cards */}
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {filtered.map((p) => {
          const priceDisplay = currency === 'AED' ? `AED ${p.priceAed?.toLocaleString('en-AE')}` : formatINR(p.price)

          return (
            <article
              key={p.id}
              className={`card-hover-glow group relative flex flex-col justify-between p-5 sm:p-6 ${
                p.featured ? 'border-brand/50 ring-1 ring-brand/35 bg-gradient-to-b from-[#1a1a22] to-[#121217]' : 'bg-[#15151b]'
              }`}
            >
              <div>
                {/* Card Header Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#262630] border border-white/10 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                      {p.market}
                    </span>
                    <span className="text-xs font-medium text-white/70">
                      {p.level} • {p.duration}
                    </span>
                  </div>
                  {p.featured && (
                    <span className="badge-signal text-xs py-0.5 px-2.5">
                      <span className="size-1.5 rounded-full bg-brand animate-pulse" />
                      Popular
                    </span>
                  )}
                </div>

                {/* Title & Short Summary */}
                <h3 className="mt-3 font-display text-xl sm:text-2xl font-extrabold text-white transition-colors group-hover:text-signal leading-snug">
                  <Link to={`/programs/${p.id}`}>{p.title}</Link>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75 line-clamp-2">
                  {p.summary}
                </p>

                {/* Inline Skills Tags */}
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {p.outcomes.slice(0, 3).map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5 rounded bg-[#22222a] border border-white/10 px-2.5 py-1 text-xs font-medium text-white/90">
                      <span className="text-signal font-bold">✓</span>
                      <span className="truncate max-w-[200px]">{item}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing & Actions Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <span className="text-xs font-semibold text-white/60 block leading-none">Total Fee ({currency})</span>
                  <span className="font-display text-xl sm:text-2xl font-extrabold gold-foil-text tabular-nums leading-tight mt-1 inline-block">
                    {priceDisplay}
                  </span>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link to={`/programs/${p.id}`} className="btn-ghost py-2 px-3 text-xs sm:text-sm font-semibold">
                    Syllabus →
                  </Link>
                  <Link to={`/register?program=${p.id}`} className="btn-brand py-2 px-4 text-xs sm:text-sm font-bold shadow-sm">
                    Apply
                  </Link>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

/*
  Programs as a board of rows, echoing the market board: comparable attributes line up
  in columns, and each row opens the program page.
*/
export function ProgramBoard({ programs = allPrograms, detailed = false }) {
  return (
    <div role="table" aria-label="Programs" className="border-t-2 border-ink">
      <div role="row" className="hidden grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] gap-4 border-b border-line py-2 text-xs text-ink-soft lg:grid">
        <span role="columnheader">Program</span>
        <span role="columnheader">Market</span>
        <span role="columnheader">Level</span>
        <span role="columnheader">Duration</span>
        <span role="columnheader" className="text-right">Fee in India</span>
      </div>
      {programs.map((p) => (
        <Link
          key={p.id}
          to={`/programs/${p.id}`}
          role="row"
          className="group relative grid gap-x-4 gap-y-1.5 border-b border-line py-4 transition-colors hover:bg-signal/[0.06] lg:grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] lg:items-baseline"
        >
          <span aria-hidden="true" className="absolute inset-y-0 -left-5 w-1 origin-top scale-y-0 bg-signal transition-transform duration-200 group-hover:scale-y-100 sm:-left-8 lg:-left-12" />
          <span role="cell" className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-xl leading-none font-bold transition-transform duration-200 ease-out group-hover:translate-x-1 sm:text-2xl">{p.title}</span>
              {p.featured && <span className="rounded bg-signal px-1.5 py-0.5 text-[0.65rem] font-bold text-ink">Start here</span>}
            </span>
            {detailed && <span className="mt-1.5 block max-w-[40rem] text-xs text-ink-soft">{p.summary}</span>}
          </span>
          <span role="cell" className="text-xs text-ink-soft lg:text-sm lg:text-ink">
            <span className="lg:hidden">{p.market}, {p.level.toLowerCase()}, {p.duration}</span>
            <span className="hidden lg:inline">{p.market}</span>
          </span>
          <span role="cell" className="hidden text-xs lg:block">{p.level}</span>
          <span role="cell" className="hidden text-xs lg:block">{p.duration}</span>
          <span role="cell" className="text-xs font-semibold tabular-nums lg:text-right lg:text-sm">{formatINR(p.price)}</span>
        </Link>
      ))}
    </div>
  )
}

// The four teaching stages. They happen in order, so they are numbered, on board tiles.
export const STAGES = [
  ['01. Theory & Live Charts', 'Interactive classes dissecting market structure, liquidity zones, and broker spreads.'],
  ['02. Simulated Demo Lab', 'Practice execution and position sizing on demo accounts until rules become routine.'],
  ['03. Small Live Trades + Review', 'Trade real micro-lots. Your mentor personally reviews the trades you log during the course.'],
  ['04. Custom Plan & Certificate', 'Graduate with a personalized written trading plan and official academy certificate.'],
]

export function MethodTrack({ dark = false }) {
  const ref = useReveal()
  return (
    <ol ref={ref} className="stagger grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map(([title, body], i) => (
        <li
          key={title}
          className="card-hover-glow panel relative flex flex-col justify-between p-5 sm:p-6"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="flap flap-amber [--flap-w:1.4rem]" aria-hidden="true">{i + 1}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-signal">
                Phase 0{i + 1}
              </span>
            </div>
            <h3 className="mt-3.5 text-base sm:text-lg font-bold text-white">{title}</h3>
            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-white/75">{body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function FacultyProfile({ person, reverse = false }) {
  const teaches = allPrograms.filter((p) => person.teaches.includes(p.title))
  return (
    <article id={person.name.toLowerCase()} className="grid-12 scroll-mt-24 items-center gap-y-6 lg:gap-x-10">
      <ImageBlock
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        ratio="4/5"
        shotNote={`Portrait of ${person.name}, natural light, in the classroom`}
        className={`col-span-3 sm:col-span-4 lg:col-span-5 ${reverse ? 'lg:col-start-8 lg:row-start-1' : ''}`}
      />
      <div className={`col-span-4 sm:col-span-7 lg:col-span-6 ${reverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7'}`}>
        <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">{person.role}</span>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">{person.name}</h2>
        <p className="mt-3 max-w-[34rem] text-xs sm:text-sm leading-relaxed text-white/75">{person.bio}</p>
        <dl className="mt-5 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold text-white/55 uppercase tracking-wider">Teaches</dt>
            <dd className="mt-1 flex flex-col items-start gap-1">
              {teaches.map((p) => <Link key={p.id} to={`/programs/${p.id}`} className="link-line text-xs sm:text-sm font-semibold text-white hover:text-signal">{p.title}</Link>)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-bold text-white/55 uppercase tracking-wider">Focus</dt>
            <dd className="mt-1 text-xs sm:text-sm font-medium text-white/90">{person.focus}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function Testimonial({ story, size = 'large' }) {
  const large = size === 'large'
  return (
    <figure className="card-rich p-5 sm:p-6 border-l-4 border-l-signal">
      <blockquote className={large ? 'font-display text-base sm:text-lg font-medium leading-relaxed text-white' : 'text-xs sm:text-sm leading-relaxed text-white/90'}>
        <p>“{story.quote}”</p>
      </blockquote>
      <figcaption className="mt-4 border-t border-white/10 pt-3 text-xs flex flex-wrap items-center justify-between gap-1">
        <div>
          <span className="font-bold text-white">{story.name}</span>
          <span className="text-white/60"> • {story.program}</span>
        </div>
        {story.outcome && <span className="badge-signal text-[0.65rem] py-0.5 px-2">{story.outcome}</span>}
      </figcaption>
    </figure>
  )
}

// Segmented choice: a row of square buttons, one selected.
export function Segmented({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-[var(--radius-ctl)] border border-white/15 bg-[#22222a] p-1 gap-1" role="radiogroup" aria-label={name}>
      {options.map(([val, label]) => (
        <label
          key={val}
          className={`flex-1 cursor-pointer rounded px-3 py-2 text-center text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            value === val
              ? 'bg-signal text-black shadow-md font-extrabold'
              : 'bg-transparent text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <input type="radio" name={name} className="sr-only" checked={value === val} onChange={() => onChange(val)} />
          {label}
        </label>
      ))}
    </div>
  )
}
