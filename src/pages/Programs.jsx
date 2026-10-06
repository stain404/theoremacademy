import { Link, Navigate, useParams } from 'react-router-dom'
import { FinalCta, Offer, PageHeader, usePageTitle } from '../components/sections'
import { MarketDot, MarketTag, ProgramBoard, ProgramCards, Section, Ticket } from '../components/ui'
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
    <Section tight title="Side by side." intro="The same key details for every program, in one structured comparison table." className="bg-surface border-t border-line">
      {/* scrolls inside its own box on narrow screens; the page itself never scrolls sideways */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-line">
              <th scope="col" className="w-[17%] py-3.5 pr-4"><span className="sr-only">Detail</span></th>
              {programs.map((p) => (
                <th key={p.id} scope="col" className="py-3.5 pr-4 align-bottom">
                  <Link to={`/programs/${p.id}`} className="flex items-center gap-2 font-display text-lg sm:text-xl font-semibold text-ink hover:text-brand transition-colors"><MarketDot market={p.market} />{p.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-b border-line">
                <th scope="row" className="py-3 pr-4 text-xs font-bold text-ink-soft">{label}</th>
                {programs.map((p) => <td key={p.id} className="py-3 pr-4 text-sm tabular-nums text-ink">{get(p)}</td>)}
              </tr>
            ))}
            <tr>
              <td />
              {programs.map((p) => (
                <td key={p.id} className="pt-4 pr-4">
                  <Link to={`/programs/${p.id}`} className="link-line text-xs font-bold text-brand">See syllabus</Link>
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
        title="Four structured programs. Choose your market."
        intro="Each program runs in our Dubai & India classrooms and interactive live online, with seasoned mentors, weekly trade reviews, and certificates on completion."
      />
      <Section tight className="pt-6 sm:pt-8 lg:pt-10">
        <ProgramCards />
      </Section>
      <CompareTable />
      <Offer className="border-t border-line" />
      <FinalCta title="Not sure which program fits your schedule?" body="Tell us what you trade now, or that you have never traded. An advisor will recommend a program and a batch in Dubai, India or online." />
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
      <PageHeader
        back={{ to: '/programs', label: 'All programs' }}
        title={program.title}
        meta={<><MarketTag market={program.market} /><span>{program.level}</span><span>{program.duration}</span><span>{program.format}</span></>}
        intro={program.summary}
      />

      <div className="wrap grid-12 gap-y-14 py-14 sm:py-16 lg:py-20">
        <div className="col-span-4 space-y-16 sm:col-span-8 lg:col-span-7">
          <section>
            <h2 className="text-3xl">Who it is for</h2>
            <p className="mt-4 max-w-[38rem] text-lg leading-relaxed text-ink-soft">{program.audience}</p>
          </section>

          <section>
            <h2 className="text-3xl">What you will learn</h2>
            <ul className="mt-6 grid gap-x-8 border-t border-ink sm:grid-cols-2">
              {program.outcomes.map((o) => <li key={o} className="border-b border-line py-3.5">{o}</li>)}
            </ul>
          </section>

          {modules.length > 0 && (
            <section>
              <h2 className="text-3xl">Curriculum</h2>
              <p className="mt-4 max-w-[38rem] text-ink-soft">Modules are taken in order. Each ends with a short quiz you need to pass before moving on.</p>
              <ol className="mt-8">
                {modules.map((m, i) => (
                  <li key={m.id} className="grid grid-cols-[auto_1fr] gap-x-5 border-t border-ink py-6">
                    <span className="grid size-9 place-items-center rounded-full border border-line-strong text-sm font-semibold tabular-nums" aria-hidden="true">{i + 1}</span>
                    <div>
                      <h3 className="text-xl"><span className="sr-only">Module {i + 1}: </span>{m.title}</h3>
                      <ul className="mt-3 divide-y divide-line text-sm">
                        {m.lessons.map((l) => (
                          <li key={l.id} className="flex justify-between gap-4 py-2.5">
                            <span>{l.title}</span>
                            <span className="whitespace-nowrap tabular-nums text-ink-soft">{l.minutes} min</span>
                          </li>
                        ))}
                        <li className="flex justify-between gap-4 py-2.5 font-semibold">
                          <span>Module quiz</span>
                          <span className="whitespace-nowrap text-ink-soft">{m.quiz.length} questions</span>
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
            <h2 className="text-xl">Fees</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 border-b border-line pb-5">
              <div>
                <dt className="text-sm text-ink-soft">In India</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{formatINR(program.price)}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink-soft">In the UAE</dt>
                <dd className="mt-1 font-display text-3xl font-semibold tabular-nums">{formatAED(program.priceAed)}</dd>
              </div>
            </dl>
            <dl className="divide-y divide-line text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-3">
                  <dt className="text-ink-soft">{k}</dt>
                  <dd className="text-right font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to={`/register?program=${program.id}`} className="btn-brand btn-lg mt-6 w-full">Apply for {program.title}</Link>
            <Link to={`/contact?program=${program.id}`} className="btn-ghost btn-lg mt-3 w-full">Ask a question first</Link>
            {mentor && (
              <p className="mt-6 text-sm text-ink-soft">
                Taught by <Link to={`/mentors#${mentor.name.toLowerCase()}`} className="link-line text-ink">{mentor.name}</Link>, {mentor.role.toLowerCase()}.
              </p>
            )}
          </Ticket>
        </aside>
      </div>

      {/* phones: the fee and the main action stay within reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
        <div>
          <span className="block text-xs text-ink-soft">Fee</span>
          <span className="font-semibold tabular-nums">{formatINR(program.price)} or {formatAED(program.priceAed)}</span>
        </div>
        <Link to={`/register?program=${program.id}`} className="btn-brand">Apply now</Link>
      </div>

      <Section tight tone="mist" title="Other programs.">
        <ProgramBoard programs={others} />
      </Section>
      <div className="h-20 bg-board lg:hidden" aria-hidden="true" />
    </>
  )
}
