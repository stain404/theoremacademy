import { Link } from 'react-router-dom'
import PriceLine from '../components/PriceLine'
import { FacultyProfile, ImageBlock, ProgramFeature, ProgramItem, Section, SectionLabel, Testimonial } from '../components/ui'
import { programs, site, stories, teachers } from '../config/site'

function Hero() {
  return (
    <section className="pt-12 pb-6 sm:pt-20 sm:pb-8 lg:pt-24">
      <div className="wrap">
        <div className="grid-editorial gap-y-6">
          <p className="hero-rise col-span-4 text-sm leading-snug text-ink-soft sm:col-span-8 lg:col-span-3 lg:pt-5">
            A trading academy in Dubai, India and online
          </p>
          <h1 className="hero-rise col-span-4 text-[2.9rem] leading-[1.02] tracking-[-0.025em] sm:col-span-8 sm:text-[4.25rem] lg:col-span-9 lg:text-5xl" style={{ animationDelay: '80ms' }}>
            Trading is a skill. We teach it like one.
          </h1>
        </div>

        <div className="grid-editorial mt-8 gap-y-8 sm:mt-12">
          <p className="hero-rise col-span-4 max-w-[36rem] leading-relaxed sm:text-lg sm:col-span-5 lg:col-span-5 lg:col-start-4" style={{ animationDelay: '160ms' }}>
            Forex, crypto and equity for beginners and working professionals, taught live in small batches. A mentor reviews the trades you place, so you learn from your own decisions, not from someone else's signals.
          </p>
          <div className="hero-rise col-span-4 flex flex-wrap items-center gap-x-7 gap-y-4 sm:col-span-3 sm:flex-col sm:items-start lg:col-span-3 lg:col-start-10 lg:self-end" style={{ animationDelay: '240ms' }}>
            <Link to="/register" className="btn-brand">Apply now</Link>
            <a href={site.whatsappLink} className="link-line text-sm">Book a consultation</a>
          </div>
        </div>

        <div className="mt-14 sm:mt-20">
          <PriceLine />
        </div>
      </div>
    </section>
  )
}

const CREDENTIALS = [
  'Classrooms in Dubai and India',
  'Live online batches, every class recorded',
  'Small batches with every logged trade reviewed',
  'Forex, crypto and equity under one roof',
]

function CredibilityStrip() {
  return (
    <div className="wrap">
      <ul className="grid grid-cols-1 border-t border-ink text-sm sm:grid-cols-2 lg:grid-cols-4">
        {CREDENTIALS.map((c) => (
          <li key={c} className="border-b border-line py-4 text-ink-soft sm:odd:pr-6 lg:border-b-0 lg:py-5 lg:pr-6 lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:pl-6">
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Programs() {
  const featured = programs.find((p) => p.featured)
  const others = programs.filter((p) => !p.featured)
  return (
    <Section id="programs" label="Programs" title="Four programs. Most students begin with Forex Basic.">
      <div className="grid-editorial gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <ProgramFeature program={featured} />
        </div>
        <div className="col-span-4 divide-y divide-line sm:col-span-8 lg:col-span-4 lg:col-start-9">
          {others.map((p) => <ProgramItem key={p.id} program={p} />)}
        </div>
      </div>
    </Section>
  )
}

// These four stages genuinely happen in order, so they are numbered.
const STAGES = [
  ['Learn it in class', 'Live sessions with a mentor, in person or online, where you can stop the lesson and ask.'],
  ['Practise on a demo account', 'Apply each lesson on a simulated account until the process feels routine.'],
  ['Trade small, with review', 'Move to a small live account. Your mentor reviews every trade you log.'],
  ['Keep the journal', 'Each trade goes in your journal. A weekly review finds the patterns in your mistakes.'],
]

function Approach() {
  return (
    <Section
      id="approach"
      label="Our approach"
      title="Nobody learns to trade from videos alone."
      intro="Every program moves through the same four stages. You go on to the next one when your mentor is satisfied with the last."
      className="border-t border-line"
    >
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {STAGES.map(([title, body], i) => (
          <li key={title} className="border-t border-ink pt-5">
            <span className="font-display text-3xl font-light text-brand" aria-hidden="true">{i + 1}</span>
            <h3 className="mt-6 text-xl">{title}</h3>
            <p className="mt-3 max-w-[22rem] text-sm leading-relaxed text-ink-soft">{body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Story() {
  return (
    <section className="pb-16 sm:pb-28 lg:pb-36">
      <div className="wrap grid-editorial gap-y-10">
        <ImageBlock
          ratio="4/3"
          shotNote="A mentor at the whiteboard mid-lesson, students' laptops open, Dubai classroom"
          caption="Evening class, Forex Basic"
          className="col-span-4 sm:col-span-8 lg:col-span-7"
        />
        <div className="col-span-4 sm:col-span-6 lg:col-span-4 lg:col-start-9 lg:self-end lg:pb-10">
          <SectionLabel>In class</SectionLabel>
          <h2 className="mt-2 text-[2.1rem] sm:text-3xl lg:mt-5">From your first chart to a plan of your own.</h2>
          <p className="mt-6 text-ink-soft">
            Most students arrive having watched plenty of videos and taken a few trades they cannot explain. Six weeks later they leave with a plan written in their own words, and a journal to prove they followed it.
          </p>
          <dl className="mt-8 border-t border-line text-sm">
            <dt className="pt-5 pb-2 text-ink-soft">A typical week in Forex Basic</dt>
            {['Two evening classes', 'One practice session on a demo account', 'A Sunday review of the trades you logged'].map((d) => (
              <dd key={d} className="border-b border-line py-2.5">{d}</dd>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

function Experience() {
  return (
    <Section
      label="Inside the academy"
      title="Where the learning happens."
      intro="Classrooms in Dubai and India, and a live online room for everyone else. Every class is recorded to your student portal."
      className="border-t border-line"
    >
      <div className="grid-editorial gap-y-10">
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
          className="hidden sm:col-span-4 sm:col-start-5 sm:block lg:col-span-4 lg:col-start-9 lg:mt-40"
        />
      </div>
    </Section>
  )
}

function Mentors() {
  return (
    <Section id="mentors" label="Mentors" title="The people teaching you." className="border-t border-line">
      <div className="space-y-20 lg:space-y-32">
        {teachers.map((t, i) => <FacultyProfile key={t.name} person={t} reverse={i % 2 === 1} />)}
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

function Outcomes() {
  return (
    <Section label="What you leave with" title="At the end of a program, you will have:" className="border-t border-line">
      <dl className="grid-editorial">
        {OUTCOMES.map(([title, body]) => (
          <div key={title} className="col-span-4 grid gap-2 border-t border-line py-6 sm:col-span-8 sm:grid-cols-8 sm:gap-8 lg:col-span-9 lg:col-start-4 lg:grid-cols-9">
            <dt className="font-display text-xl sm:col-span-3 lg:col-span-4 lg:text-2xl">{title}</dt>
            <dd className="text-ink-soft sm:col-span-5">{body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function Stories() {
  // Sample stories only render on the dev server, never in a production build.
  const visible = stories.filter((s) => !s.sample || import.meta.env.DEV)
  if (visible.length === 0) return null
  const [lead, ...rest] = visible
  return (
    <Section className="border-t border-line">
      <div className="grid-editorial gap-y-14">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <SectionLabel>Students</SectionLabel>
          {lead.sample && <p className="mt-1 max-w-[16rem] text-xs text-ink-soft lg:mt-3 lg:pl-9">Sample stories for layout. Hidden in production until real ones are added.</p>}
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-8">
          <Testimonial story={lead} />
        </div>
        {rest.map((s, i) => (
          <div key={i} className={`col-span-4 sm:col-span-4 lg:col-span-4 ${i === 0 ? 'lg:col-start-4' : 'lg:col-start-8'}`}>
            <Testimonial story={s} size="small" />
          </div>
        ))}
      </div>
    </Section>
  )
}

function FinalCta() {
  return (
    <section className="bg-ink text-paper">
      <div className="wrap grid-editorial gap-y-10 py-20 sm:py-32 lg:py-40">
        <h2 className="col-span-4 text-[2.6rem] leading-[1.05] sm:col-span-8 sm:text-4xl lg:col-span-8 lg:text-5xl">Start with a conversation.</h2>
        <p className="col-span-4 max-w-[34rem] text-lg leading-relaxed text-paper/75 sm:col-span-6 lg:col-span-5">
          Tell us what you trade now, or that you have never traded. We will recommend a program and a batch in Dubai, India or online.
        </p>
        <div className="col-span-4 flex flex-wrap items-center gap-x-8 gap-y-4 sm:col-span-8 lg:col-span-4 lg:col-start-9 lg:self-end lg:justify-end">
          <Link to="/register" className="btn-light">Apply now</Link>
          <a href={site.whatsappLink} className="link-line text-sm">Talk to an advisor</a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <CredibilityStrip />
      <Programs />
      <Approach />
      <Story />
      <Experience />
      <Mentors />
      <Outcomes />
      <Stories />
      <FinalCta />
    </>
  )
}
