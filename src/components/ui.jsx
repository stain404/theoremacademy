import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatINR, programs as allPrograms } from '../config/site'

// Adds .is-visible once the element scrolls into view (used for image reveals only).
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) return el.classList.add('is-visible')
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

/*
  Section: heading on the left, intro on the right aligned to the heading's baseline.
  The asymmetric split is the site's standard section opening.
  `dark` sets the section on petrol, for the one mid-page band that breaks the light rhythm.
*/
export function Section({ id, title, intro, action, children, dark = false, className = '' }) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 sm:py-24 lg:py-32 ${dark ? 'bg-board text-white' : ''} ${className}`}>
      <div className="wrap">
        {title && (
          <header className="grid-12 mb-10 gap-y-5 sm:mb-14">
            <h2 className="col-span-4 text-[2.5rem] sm:col-span-8 sm:text-[2.9rem] lg:col-span-7 lg:text-4xl">{title}</h2>
            {(intro || action) && (
              <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
                {intro && <p className={`text-lg ${dark ? 'text-white/70' : 'text-ink-soft'}`}>{intro}</p>}
                {action && <div className="mt-4 text-sm">{action}</div>}
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
            <p className="max-w-[28ch] text-sm leading-snug text-ink-soft">{shotNote}</p>
            <p className="mt-1 text-xs text-ink-soft/70">Photo to come, {ratio.replace('/', ':')}</p>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

// Dark panel for anything transactional: fees, order summaries. Same surface as the board.
export function Ticket({ children, className = '' }) {
  return <div className={`panel bg-board p-6 text-white shadow-[var(--shadow-lift)] sm:p-8 ${className}`}>{children}</div>
}

/*
  Programs as a board of rows, echoing the market board: comparable attributes line up
  in columns, and each row opens the program page.
*/
export function ProgramBoard({ programs = allPrograms, detailed = false }) {
  return (
    <div role="table" aria-label="Programs" className="border-t-2 border-ink">
      <div role="row" className="hidden grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] gap-6 border-b border-line py-3 text-xs text-ink-soft lg:grid">
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
          className="group relative grid gap-x-6 gap-y-2 border-b border-line py-6 transition-colors hover:bg-signal/[0.06] lg:grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] lg:items-baseline lg:py-7"
        >
          <span aria-hidden="true" className="absolute inset-y-0 -left-5 w-1 origin-top scale-y-0 bg-signal transition-transform duration-200 group-hover:scale-y-100 sm:-left-8 lg:-left-12" />
          <span role="cell" className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-[2.3rem] leading-none font-bold transition-transform duration-300 ease-out group-hover:translate-x-1.5 sm:text-[2.75rem]">{p.title}</span>
              {p.featured && <span className="rounded-[4px] bg-signal px-2 py-0.5 text-xs font-semibold text-ink">Start here</span>}
            </span>
            {detailed && <span className="mt-3 block max-w-[40rem] text-ink-soft">{p.summary}</span>}
          </span>
          <span role="cell" className="text-sm text-ink-soft lg:text-base lg:text-ink">
            <span className="lg:hidden">{p.market}, {p.level.toLowerCase()}, {p.duration}</span>
            <span className="hidden lg:inline">{p.market}</span>
          </span>
          <span role="cell" className="hidden lg:block">{p.level}</span>
          <span role="cell" className="hidden lg:block">{p.duration}</span>
          <span role="cell" className="text-sm font-semibold tabular-nums lg:text-right lg:text-base">{formatINR(p.price)}</span>
        </Link>
      ))}
    </div>
  )
}

// The four teaching stages. They happen in order, so they are numbered, on board tiles.
export const STAGES = [
  ['Learn it in class', 'Live sessions with a mentor, in person or online, where you can stop the lesson and ask.'],
  ['Practise on a demo account', 'Apply each lesson on a simulated account until the process feels routine.'],
  ['Trade small, with review', 'Move to a small live account. Your mentor reviews every trade you log.'],
  ['Keep the journal', 'Each trade goes in your journal. A weekly review finds the patterns in your mistakes.'],
]

export function MethodTrack({ dark = false }) {
  const ref = useReveal()
  return (
    <ol ref={ref} className="stagger grid gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
      {STAGES.map(([title, body], i) => (
        <li key={title} className="relative lg:pr-10">
          <div className="flex items-center gap-3">
            <span className="flap flap-amber [--flap-w:1.6rem]" aria-hidden="true">{i + 1}</span>
            {/* the track joining one stage to the next */}
            {i < STAGES.length - 1 && <span aria-hidden="true" className={`hidden h-px flex-1 lg:block ${dark ? 'bg-white/25' : 'bg-ink'}`} />}
          </div>
          <h3 className="mt-5 text-xl">{title}</h3>
          <p className={`mt-2 max-w-[20rem] ${dark ? 'text-white/65' : 'text-ink-soft'}`}>{body}</p>
        </li>
      ))}
    </ol>
  )
}

export function FacultyProfile({ person, reverse = false }) {
  const teaches = allPrograms.filter((p) => person.teaches.includes(p.title))
  return (
    <article id={person.name.toLowerCase()} className="grid-12 scroll-mt-24 items-end gap-y-8">
      <ImageBlock
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        ratio="4/5"
        shotNote={`Portrait of ${person.name}, natural light, in the classroom`}
        className={`col-span-3 sm:col-span-4 lg:col-span-5 ${reverse ? 'lg:col-start-8 lg:row-start-1' : ''}`}
      />
      <div className={`col-span-4 sm:col-span-7 lg:col-span-6 ${reverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7'}`}>
        <p className="text-sm font-semibold text-brand">{person.role}</p>
        <h2 className="mt-2 text-5xl lg:text-6xl">{person.name}</h2>
        <p className="mt-6 max-w-[36rem] text-lg leading-relaxed">{person.bio}</p>
        <dl className="mt-8 grid gap-5 border-t-2 border-ink pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-ink-soft">Teaches</dt>
            <dd className="mt-1 flex flex-col items-start gap-1">
              {teaches.map((p) => <Link key={p.id} to={`/programs/${p.id}`} className="link-line">{p.title}</Link>)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-ink-soft">Focus</dt>
            <dd className="mt-1">{person.focus}</dd>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function Testimonial({ story, size = 'large' }) {
  const large = size === 'large'
  return (
    <figure className={`border-l-4 border-signal ${large ? 'pl-6 sm:pl-10' : 'pl-5'}`}>
      <blockquote className={large ? 'text-[1.6rem] leading-[1.3] font-light sm:text-[2.1rem]' : 'text-lg leading-relaxed'}>
        <p>{story.quote}</p>
      </blockquote>
      <figcaption className={`${large ? 'mt-8' : 'mt-4'} text-sm`}>
        <span className="font-semibold">{story.name}</span>
        <span className="text-ink-soft">, {story.program}</span>
        {story.outcome && <span className="mt-1 block text-ink-soft">{story.outcome}</span>}
      </figcaption>
    </figure>
  )
}

// Segmented choice: a row of square buttons, one selected.
export function Segmented({ name, options, value, onChange }) {
  return (
    <div className="flex flex-wrap overflow-hidden rounded-[var(--radius-ctl)] border border-line bg-white" role="radiogroup" aria-label={name}>
      {options.map(([val, label]) => (
        <label key={val} className={`flex-1 cursor-pointer px-4 py-2.5 text-center text-sm font-semibold whitespace-nowrap transition-colors ${value === val ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-card'}`}>
          <input type="radio" name={name} className="sr-only" checked={value === val} onChange={() => onChange(val)} />
          {label}
        </label>
      ))}
    </div>
  )
}
