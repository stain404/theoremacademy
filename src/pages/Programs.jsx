import { Link, Navigate, useParams } from 'react-router-dom'
import { FinalCta, PageHeader, usePageTitle } from '../components/sections'
import { ProgramBoard, Section, Ticket } from '../components/ui'
import { curriculum } from '../config/curriculum'
import { formatINR, programs, teachers } from '../config/site'

const mentorFor = (program) => teachers.find((t) => t.teaches.includes(program.title))
const formatAED = (n) => 'AED ' + n.toLocaleString('en-AE')

function CompareTable() {
  const rows = [
    ['Market', (p) => p.market],
    ['Level', (p) => p.level],
    ['Duration', (p) => p.duration],
    ['Format', (p) => p.format],
    ['Mentor', (p) => mentorFor(p)?.name ?? 'To be announced'],
    ['Fee in India', (p) => formatINR(p.price)],
    ['Fee in the UAE', (p) => formatAED(p.priceAed)],
  ]
  return (
    <Section title="Side by side." intro="The same details for every program, in one table." className="bg-card">
      {/* scrolls inside its own box on narrow screens; the page itself never scrolls sideways */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-ink">
              <th scope="col" className="w-[17%] py-4 pr-4"><span className="sr-only">Detail</span></th>
              {programs.map((p) => (
                <th key={p.id} scope="col" className="py-4 pr-4 align-bottom">
                  <Link to={`/programs/${p.id}`} className="font-display text-[2rem] leading-none font-extrabold hover:text-brand">{p.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-b border-line">
                <th scope="row" className="py-3.5 pr-4 text-sm font-normal text-ink-soft">{label}</th>
                {programs.map((p) => <td key={p.id} className="py-3.5 pr-4 tabular-nums">{get(p)}</td>)}
              </tr>
            ))}
            <tr>
              <td />
              {programs.map((p) => (
                <td key={p.id} className="pt-5 pr-4">
                  <Link to={`/programs/${p.id}`} className="link-line text-sm">View program</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Section>
  )
}

export function Programs() {
  usePageTitle('Programs')
  return (
    <>
      <PageHeader
        title="Four programs, one way of teaching."
        intro="Each program runs in Dubai, in India and online, with the same mentors, the same four-stage method and the same student portal."
      />
      <Section className="pt-10 sm:pt-14 lg:pt-16">
        <ProgramBoard detailed />
      </Section>
      <CompareTable />
      <FinalCta title="Not sure which program fits?" body="Tell us what you trade now, or that you have never traded. An advisor will recommend a program and a batch in Dubai, India or online." />
    </>
  )
}

export function ProgramDetail() {
  const { programId } = useParams()
  const program = programs.find((p) => p.id === programId)
  usePageTitle(program?.title)
  if (!program) return <Navigate to="/programs" replace />

  const modules = curriculum[program.id] || []
  const mentor = mentorFor(program)
  const others = programs.filter((p) => p.id !== program.id)
  const facts = [
    ['Market', program.market],
    ['Level', program.level],
    ['Duration', program.duration],
    ['Format', program.format],
    ['On completion', 'Certificate'],
  ]

  return (
    <>
      <PageHeader back={{ to: '/programs', label: 'All programs' }} title={program.title} intro={program.summary} />

      <div className="wrap grid-12 gap-y-14 py-14 sm:py-20 lg:py-24">
        <div className="col-span-4 space-y-16 sm:col-span-8 lg:col-span-7">
          <section>
            <h2 className="text-[2.6rem] sm:text-3xl">Who it is for</h2>
            <p className="mt-5 max-w-[38rem] text-lg leading-relaxed">{program.audience}</p>
          </section>

          <section>
            <h2 className="text-[2.6rem] sm:text-3xl">What you will learn</h2>
            <ul className="mt-6 grid gap-x-8 border-t-2 border-ink sm:grid-cols-2">
              {program.outcomes.map((o) => <li key={o} className="border-b border-line py-3.5">{o}</li>)}
            </ul>
          </section>

          {modules.length > 0 && (
            <section>
              <h2 className="text-[2.6rem] sm:text-3xl">Curriculum</h2>
              <p className="mt-4 text-ink-soft">Modules are taken in order. Each one ends with a short quiz you need to pass before moving on.</p>
              <ol className="mt-8">
                {modules.map((m, i) => (
                  <li key={m.id} className="grid grid-cols-[auto_1fr] gap-x-5 border-t-2 border-ink py-6">
                    <span className="flap flap-amber [--flap-w:1.5rem]" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="text-xl"><span className="sr-only">Module {i + 1}: </span>{m.title}</h3>
                      <ul className="mt-3 divide-y divide-line text-sm">
                        {m.lessons.map((l) => (
                          <li key={l.id} className="flex justify-between gap-4 py-2">
                            <span>{l.title}</span>
                            <span className="whitespace-nowrap tabular-nums text-ink-soft">{l.minutes} min</span>
                          </li>
                        ))}
                        <li className="flex justify-between gap-4 py-2 font-semibold">
                          <span>Module quiz</span>
                          <span className="whitespace-nowrap">{m.quiz.length} questions</span>
                        </li>
                      </ul>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <Ticket className="lg:sticky lg:top-24">
            <h2 className="font-cond text-lg font-bold">Fees</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 border-b border-white/15 pb-6">
              <div>
                <dt className="text-xs text-white/55">In India</dt>
                <dd className="mt-1 font-display text-[2.4rem] leading-none font-extrabold text-signal tabular-nums">{formatINR(program.price)}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/55">In the UAE</dt>
                <dd className="mt-1 font-display text-[2.4rem] leading-none font-extrabold text-signal tabular-nums">{formatAED(program.priceAed)}</dd>
              </div>
            </dl>
            <dl className="divide-y divide-white/10 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-white/55">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to={`/register?program=${program.id}`} className="btn-brand mt-6 w-full py-3.5">Apply for {program.title}</Link>
            <Link to={`/contact?program=${program.id}`} className="btn-outline-light mt-3 w-full py-3.5">Ask a question first</Link>
            {mentor && (
              <p className="mt-6 text-sm text-white/65">
                Taught by <Link to={`/mentors#${mentor.name.toLowerCase()}`} className="link-line text-white">{mentor.name}</Link>, {mentor.role.toLowerCase()}.
              </p>
            )}
          </Ticket>
        </aside>
      </div>

      <Section title="Other programs." className="bg-card">
        <ProgramBoard programs={others} />
      </Section>
    </>
  )
}
