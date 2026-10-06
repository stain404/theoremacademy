import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatAED, formatINR, programs as allPrograms } from '../config/site'

/*
  Section: heading on the left, intro on the right, aligned to the heading's last line.
  `tone` picks the band: paper (default), mist, or ink for the one dark band on a page.
  `dark` is kept as a shorthand for tone="ink".
*/
export function Section({ id, title, intro, action, children, dark = false, tone, tight = false, className = '' }) {
  const band = tone || (dark ? 'ink' : 'paper')
  const bg = { paper: 'bg-paper text-ink', mist: 'bg-card text-ink', ink: 'bg-board text-white' }[band]
  const soft = band === 'ink' ? 'text-white/70' : 'text-ink-soft'
  const py = tight ? 'py-16 sm:py-20 lg:py-24' : 'py-20 sm:py-24 lg:py-32'
  return (
    <section id={id} className={`scroll-mt-20 ${py} ${bg} ${className}`}>
      <div className="wrap">
        {title && (
          <header className="grid-12 mb-10 gap-y-4 sm:mb-14">
            <h2 className="col-span-4 text-3xl sm:col-span-8 sm:text-4xl lg:col-span-6">{title}</h2>
            {(intro || action) && (
              <div className="col-span-4 sm:col-span-6 lg:col-span-5 lg:col-start-8 lg:self-end">
                {intro && <p className={`max-w-[34rem] text-base leading-relaxed sm:text-lg ${soft}`}>{intro}</p>}
                {action && <div className="mt-3 text-sm">{action}</div>}
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
  Image block. Pass `src` when real photography exists. Until then:
  - with `initials` (portraits) it shows a monogram tile in the brand's mark style, which
    reads as deliberate on the live site;
  - otherwise a quiet tile at the right ratio.
  On the dev server the tile also says what should be photographed (`shotNote`).
*/
export function ImageBlock({ src, alt = '', ratio = '3/2', caption, shotNote, initials, className = '' }) {
  return (
    <figure className={className}>
      <div className={`reveal panel relative overflow-hidden [container-type:inline-size] ${initials && !src ? 'bg-board' : 'bg-stone'}`} style={{ aspectRatio: ratio }}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0" role="img" aria-label={alt || shotNote || caption}>
            {initials && (
              <span className="absolute inset-0 grid place-items-center font-display text-[46cqw] leading-none font-semibold text-signal" aria-hidden="true">
                {initials}
              </span>
            )}
            {import.meta.env.DEV && shotNote && !initials && (
              <p className="absolute inset-x-0 bottom-0 p-3 text-xs leading-snug text-ink-soft">Photo to come: {shotNote}</p>
            )}
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-2.5 text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

/*
  Market colours: one per market, used wherever a program appears (cards, rows, menus,
  program pages) so a market is recognisable before its name is read. Literal class names,
  so Tailwind can see them.
*/
export const MARKET_TONE = {
  Forex: { text: 'text-forex', dot: 'bg-forex', soft: 'bg-forex-soft' },
  Crypto: { text: 'text-crypto', dot: 'bg-crypto', soft: 'bg-crypto-soft' },
  Equity: { text: 'text-equity', dot: 'bg-equity', soft: 'bg-equity-soft' },
}
export const toneOf = (market) => MARKET_TONE[market] || MARKET_TONE.Forex

export function MarketDot({ market, className = '' }) {
  return <span aria-hidden="true" className={`inline-block size-2 shrink-0 rounded-full ${toneOf(market).dot} ${className}`} />
}

// The market as a small tinted tag: dot and name in the market's colour.
export function MarketTag({ market, className = '' }) {
  const t = toneOf(market)
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.soft} ${t.text} ${className}`}>
      <MarketDot market={market} />
      {market}
    </span>
  )
}

// The surface for anything transactional (fees, order summaries): a quiet bordered card on mist.
export function Ticket({ children, className = '' }) {
  return <div className={`rounded-[var(--radius-panel)] border border-line bg-card p-6 text-ink sm:p-7 ${className}`}>{children}</div>
}

// Two-option switch for currency and similar choices.
function Toggle({ value, options, onChange, label }) {
  return (
    <div className="inline-flex rounded-[var(--radius-ctl)] border border-line bg-card p-1" role="radiogroup" aria-label={label}>
      {options.map(([val, text]) => (
        <button
          key={val}
          type="button"
          role="radio"
          aria-checked={value === val}
          onClick={() => onChange(val)}
          className={`rounded-[7px] px-3 py-1.5 text-sm font-semibold transition-colors ${value === val ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(14_27_23/0.12)]' : 'text-ink-soft hover:text-ink'}`}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

/*
  Program cards: the four programs as comparable cards, filterable by market,
  with fees in rupees or dirhams.
*/
export function ProgramCards({ programs = allPrograms }) {
  const [currency, setCurrency] = useState('INR')
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? programs : programs.filter((p) => p.market.toLowerCase() === filter)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Toggle label="Market" value={filter} onChange={setFilter} options={[['all', 'All'], ['forex', 'Forex'], ['crypto', 'Crypto'], ['equity', 'Equity']]} />
        <Toggle label="Currency" value={currency} onChange={setCurrency} options={[['INR', '₹ India'], ['AED', 'AED Dubai']]} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {filtered.map((p) => (
          <article key={p.id} className="card-rich relative flex flex-col overflow-hidden p-6 sm:p-7">
            <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${toneOf(p.market).dot}`} />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
              <MarketTag market={p.market} />
              <span>{p.level}, {p.duration}</span>
              {p.featured && <span className="badge-save ml-auto">Start here</span>}
            </div>
            <h3 className="mt-3 text-2xl sm:text-[1.9rem]">
              <Link to={`/programs/${p.id}`} className="hover:text-brand">{p.title}</Link>
            </h3>
            <p className="mt-2 text-ink-soft">{p.summary}</p>
            <ul className="mt-5 mb-7 space-y-1.5 text-sm">
              {p.outcomes.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span aria-hidden="true" className={`mt-[0.55em] size-1.5 shrink-0 rounded-full ${toneOf(p.market).dot}`} />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line pt-5">
              <div>
                <span className="block text-xs text-ink-soft">Fee</span>
                <span className="text-2xl font-semibold tabular-nums">{currency === 'AED' ? formatAED(p.priceAed) : formatINR(p.price)}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/programs/${p.id}`} className="btn-ghost">See syllabus</Link>
                <Link to={`/register?program=${p.id}`} className="btn-brand">Apply</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

/*
  Programs as rows: comparable attributes line up in columns, and each row opens the program.
*/
export function ProgramBoard({ programs = allPrograms, detailed = false }) {
  return (
    <div role="table" aria-label="Programs" className="border-t border-ink">
      <div role="row" className="hidden grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] gap-4 border-b border-line py-3 text-sm text-ink-soft lg:grid">
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
          className="group grid gap-x-4 gap-y-1 border-b border-line py-5 transition-colors hover:bg-card lg:grid-cols-[minmax(0,1fr)_7rem_7rem_6rem_7rem] lg:items-baseline lg:px-3 lg:-mx-3"
        >
          <span role="cell" className="min-w-0">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="flex items-center gap-2.5 font-display text-xl font-semibold group-hover:text-brand sm:text-2xl"><MarketDot market={p.market} className="size-2.5" />{p.title}</span>
              {p.featured && <span className="badge-save">Start here</span>}
            </span>
            {detailed && <span className="mt-1.5 block max-w-[40rem] text-sm text-ink-soft">{p.summary}</span>}
          </span>
          <span role="cell" className="text-sm text-ink-soft lg:text-ink">
            <span className="lg:hidden">{p.market}, {p.level.toLowerCase()}, {p.duration}</span>
            <span className={`hidden font-medium lg:inline ${toneOf(p.market).text}`}>{p.market}</span>
          </span>
          <span role="cell" className="hidden text-sm lg:block">{p.level}</span>
          <span role="cell" className="hidden text-sm lg:block">{p.duration}</span>
          <span role="cell" className="text-sm font-semibold tabular-nums lg:text-right">{formatINR(p.price)}</span>
        </Link>
      ))}
    </div>
  )
}

// The four teaching stages. They happen in order, so they are numbered.
export const STAGES = [
  ['Theory and live charts', 'Live classes on market structure, liquidity and how brokers actually fill your orders.'],
  ['Practice on a demo account', 'Apply each lesson on a simulated account until sizing and execution are routine.'],
  ['Small live trades, reviewed', 'Trade real micro lots. Your mentor reviews every trade you log.'],
  ['Your plan and certificate', 'Graduate with a written trading plan of your own and the academy certificate.'],
]

/*
  The method as a track: four steps joined by a line that fills as the section comes into view.
*/
export function MethodTrack({ dark = false }) {
  const soft = dark ? 'text-white/70' : 'text-ink-soft'
  return (
    <ol className="stagger grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {STAGES.map(([title, body], i) => (
        <li key={title} className="relative">
          <div className="flex items-center gap-4">
            <span className={`grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold tabular-nums ${dark ? 'border-white/25 text-white' : 'border-line-strong text-ink'}`}>
              {i + 1}
            </span>
            {i < STAGES.length - 1 && (
              <span aria-hidden="true" className={`hidden h-px flex-1 lg:block ${dark ? 'bg-white/20' : 'bg-line'}`} />
            )}
          </div>
          <h3 className="mt-5 text-xl">{title}</h3>
          <p className={`mt-2 max-w-[18rem] ${soft}`}>{body}</p>
        </li>
      ))}
    </ol>
  )
}

export function FacultyProfile({ person, reverse = false }) {
  const teaches = allPrograms.filter((p) => person.teaches.includes(p.title))
  return (
    <article id={person.name.toLowerCase()} className="grid-12 scroll-mt-24 items-center gap-y-8 lg:gap-x-10">
      <ImageBlock
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        ratio="4/5"
        shotNote={`Portrait of ${person.name}, natural light, in the classroom`}
        initials={person.initials}
        className={`col-span-3 sm:col-span-4 lg:col-span-5 ${reverse ? 'lg:col-start-8 lg:row-start-1' : ''}`}
      />
      <div className={`col-span-4 sm:col-span-7 lg:col-span-6 ${reverse ? 'lg:col-start-1 lg:row-start-1' : 'lg:col-start-7'}`}>
        <p className="text-sm font-semibold text-brand">{person.role}</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">{person.name}</h2>
        <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-ink-soft">{person.bio}</p>
        <dl className="mt-7 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
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
    <figure className={large ? '' : 'border-t border-line pt-6'}>
      <blockquote className={large ? 'font-display text-xl leading-snug font-medium tracking-tight sm:text-2xl lg:text-[2rem]' : 'text-lg leading-relaxed'}>
        <p>“{story.quote}”</p>
      </blockquote>
      <figcaption className={`${large ? 'mt-7' : 'mt-4'} text-sm`}>
        <span className="font-semibold">{story.name}</span>
        <span className="text-ink-soft">, {story.program}</span>
        {story.outcome && <span className="mt-1 block text-ink-soft">{story.outcome}</span>}
      </figcaption>
    </figure>
  )
}

// Segmented choice: a row of options, one selected.
export function Segmented({ name, options, value, onChange }) {
  return (
    <div className="flex gap-1 rounded-[var(--radius-ctl)] border border-line bg-card p-1" role="radiogroup" aria-label={name}>
      {options.map(([val, label]) => (
        <label
          key={val}
          className={`flex-1 cursor-pointer rounded-[7px] px-3 py-2 text-center text-sm font-semibold whitespace-nowrap transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand ${
            value === val ? 'bg-surface text-ink shadow-[0_1px_2px_rgb(14_27_23/0.12)]' : 'text-ink-soft hover:text-ink'
          }`}
        >
          <input type="radio" name={name} className="sr-only" checked={value === val} onChange={() => onChange(val)} />
          {label}
        </label>
      ))}
    </div>
  )
}
