import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { formatINR } from '../config/site'

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
  Section: label in the left margin column, heading and intro in the main column.
  The margin label is the site's recurring device — a teacher's note beside the text.
*/
export function Section({ id, label, title, intro, children, className = '', headClassName = '' }) {
  return (
    <section id={id} className={`scroll-mt-16 py-16 sm:py-28 lg:py-36 ${className}`}>
      <div className="wrap">
        {(label || title) && (
          <header className={`grid-editorial mb-10 sm:mb-16 ${headClassName}`}>
            {label && <SectionLabel className="col-span-4 sm:col-span-8 lg:col-span-3">{label}</SectionLabel>}
            <div className="col-span-4 sm:col-span-7 lg:col-span-8">
              {title && <h2 className="text-[2.1rem] sm:text-3xl lg:text-4xl">{title}</h2>}
              {intro && <p className="mt-5 max-w-[34rem] text-ink-soft">{intro}</p>}
            </div>
          </header>
        )}
        {children}
      </div>
    </section>
  )
}

export function SectionLabel({ children, className = '' }) {
  return (
    <p className={`mb-4 flex items-center gap-3 self-start text-sm text-brand lg:mb-0 lg:pt-3 ${className}`}>
      <span className="h-px w-6 bg-current" aria-hidden="true" />
      {children}
    </p>
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
      <div className="reveal relative overflow-hidden bg-stone" style={{ aspectRatio: ratio }}>
        {src ? (
          <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-3 flex flex-col justify-end border border-ink/10 p-4 sm:p-5" role="img" aria-label={`Photo placeholder: ${shotNote || caption}`}>
            <p className="max-w-[26ch] font-display text-sm italic leading-snug text-ink-soft sm:text-base">{shotNote}</p>
            <p className="mt-1 text-xs text-ink-soft/70">Photograph to come, {ratio.replace('/', ':')}</p>
          </div>
        )}
      </div>
      {caption && <figcaption className="mt-3 text-sm text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

function Meta({ items, className = '' }) {
  return (
    <dl className={`flex flex-wrap gap-x-6 gap-y-1 text-sm ${className}`}>
      {items.map(([k, v]) => (
        <div key={k} className="flex gap-1.5">
          <dt className="text-ink-soft">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ProgramFeature({ program }) {
  return (
    <article className="flex flex-col bg-stone p-7 sm:p-10 lg:p-12">
      <p className="text-sm text-brand">Where most students begin</p>
      <h3 className="mt-3 text-3xl sm:text-4xl">{program.title}</h3>
      <p className="mt-5 max-w-[38rem] font-display text-lg leading-relaxed">{program.summary}</p>

      <dl className="mt-10 grid grid-cols-3 border-t border-ink/15 pt-5 text-sm">
        {[['Duration', program.duration], ['Level', program.level], ['Format', program.format]].map(([k, v]) => (
          <div key={k}>
            <dt className="text-ink-soft">{k}</dt>
            <dd className="mt-1 font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <h4 className="font-sans text-sm text-ink-soft">What you will learn</h4>
        <ul className="mt-3 grid gap-x-8 sm:grid-cols-2">
          {program.outcomes.map((o) => (
            <li key={o} className="border-b border-ink/10 py-2.5">{o}</li>
          ))}
        </ul>
      </div>

      <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
        <Link to={`/register?program=${program.id}`} className="btn-brand">Apply for {program.title}</Link>
        <p className="text-sm text-ink-soft">
          {formatINR(program.price)} or AED {program.priceAed.toLocaleString('en-AE')}
        </p>
      </div>
    </article>
  )
}

export function ProgramItem({ program }) {
  return (
    <article className="py-8 first:pt-0 lg:first:pt-2">
      <p className="text-sm text-ink-soft">{program.market}</p>
      <h3 className="mt-1 text-2xl">{program.title}</h3>
      <p className="mt-3 max-w-[32rem] text-ink-soft">{program.summary}</p>
      <Meta className="mt-4" items={[['Duration', program.duration], ['Level', program.level]]} />
      <div className="mt-5 flex items-baseline gap-6">
        <Link to={`/register?program=${program.id}`} className="link-line text-sm text-brand">Apply for {program.title}</Link>
        <span className="text-sm text-ink-soft">{formatINR(program.price)}</span>
      </div>
    </article>
  )
}

export function FacultyProfile({ person, reverse = false }) {
  return (
    <article className="grid-editorial items-end gap-y-8">
      <ImageBlock
        src={person.photo}
        alt={`Portrait of ${person.name}`}
        ratio="4/5"
        shotNote={`Portrait of ${person.name}, natural light, in the classroom`}
        className={`col-span-3 sm:col-span-4 lg:col-span-4 ${reverse ? 'lg:col-start-9 lg:row-start-1' : ''}`}
      />
      <div className={`col-span-4 sm:col-span-7 lg:col-span-6 lg:pb-4 ${reverse ? 'lg:col-start-2 lg:row-start-1' : 'lg:col-start-6'}`}>
        <p className="text-sm text-brand">{person.role}</p>
        <h3 className="mt-2 text-3xl sm:text-4xl">{person.name}</h3>
        <p className="mt-5 max-w-[34rem] font-display text-lg leading-relaxed">{person.bio}</p>
        <dl className="mt-8 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink-soft">Teaches</dt>
            <dd className="mt-1">{person.teaches.join(' and ')}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Focus</dt>
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
    <figure className={large ? 'relative' : 'border-t border-line pt-6'}>
      {large && (
        <span aria-hidden="true" className="absolute -top-6 -left-1 font-display text-[5rem] leading-none text-brand lg:-left-14 lg:top-[-0.4rem]">
          &ldquo;
        </span>
      )}
      <blockquote className={large ? 'pt-10 font-display text-[1.6rem] leading-[1.35] sm:text-[2rem] lg:pt-0 lg:text-[2.35rem]' : 'font-display text-lg leading-relaxed'}>
        <p>{story.quote}</p>
      </blockquote>
      <figcaption className={`${large ? 'mt-8' : 'mt-5'} text-sm`}>
        <span className="font-medium">{story.name}</span>
        <span className="text-ink-soft">, {story.program}</span>
        {story.outcome && <span className="mt-1 block text-ink-soft">{story.outcome}</span>}
      </figcaption>
    </figure>
  )
}
