// Page sections shared by more than one page. Each page composes these in its own order.
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { site, stories } from '../config/site'
import { ImageBlock, MethodTrack, Section, Testimonial } from './ui'

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
          <h1 className="hero-rise col-span-4 text-[3.4rem] sm:col-span-8 sm:text-5xl lg:col-span-8 lg:text-6xl">{title}</h1>
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

const FACTS = [
  ['In person', 'Classrooms in Dubai and India'],
  ['Online', 'Live batches, every class recorded'],
  ['Reviewed', 'Small batches, every logged trade checked'],
  ['Three markets', 'Forex, crypto and equity'],
]

export function FactsStrip() {
  return (
    <div className="wrap">
      <dl className="grid grid-cols-2 gap-x-5 gap-y-8 py-10 sm:py-12 lg:grid-cols-4 lg:gap-x-8">
        {FACTS.map(([k, v]) => (
          <div key={k} className="border-t-2 border-ink pt-4">
            <dt className="font-cond text-xl font-bold">{k}</dt>
            <dd className="mt-1 text-sm text-ink-soft">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function Approach({ action, className = '' }) {
  return (
    <Section
      title="Nobody learns to trade from videos alone."
      intro="Every program moves through the same four stages. You go on to the next one when your mentor is satisfied with the last."
      action={action}
      className={className}
    >
      <MethodTrack />
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

export function FinalCta({ title = 'Start with a conversation.', body = 'Tell us what you trade now, or that you have never traded. We will recommend a program and a batch in Dubai, India or online.' }) {
  return (
    <section className="py-16 sm:py-24 lg:py-32">
      <div className="wrap">
      <div className="grid-12 gap-y-8 border-t-2 border-ink pt-10 sm:pt-14">
        <h2 className="col-span-4 text-[3.4rem] sm:col-span-8 sm:text-5xl lg:col-span-7 lg:text-6xl">{title}</h2>
        <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="text-lg leading-relaxed text-ink-soft">{body}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to="/register" className="btn-brand">Apply now</Link>
            <Link to="/contact" className="link-line text-sm">Talk to an advisor</Link>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
