import { Link, Navigate, useParams } from 'react-router-dom'
import { FinalCta, Offer, PageHeader, usePageTitle } from '../components/sections'
import { ProgramBoard, ProgramCards, Section, Ticket } from '../components/ui'
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
    <Section tight title="Side by side." intro="The same key details for every program, in one structured comparison table." className="bg-[#09090b] border-t border-white/10">
      {/* scrolls inside its own box on narrow screens; the page itself never scrolls sideways */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b-2 border-white/20">
              <th scope="col" className="w-[17%] py-3.5 pr-4"><span className="sr-only">Detail</span></th>
              {programs.map((p) => (
                <th key={p.id} scope="col" className="py-3.5 pr-4 align-bottom">
                  <Link to={`/programs/${p.id}`} className="font-display text-lg sm:text-xl font-extrabold text-white hover:text-signal transition-colors block">{p.title}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, get]) => (
              <tr key={label} className="border-b border-white/10">
                <th scope="row" className="py-3 pr-4 text-xs font-bold text-white/60">{label}</th>
                {programs.map((p) => <td key={p.id} className="py-3 pr-4 text-xs sm:text-sm tabular-nums text-white/90">{get(p)}</td>)}
              </tr>
            ))}
            <tr>
              <td />
              {programs.map((p) => (
                <td key={p.id} className="pt-4 pr-4">
                  <Link to={`/programs/${p.id}`} className="link-line text-xs font-bold text-signal">View Syllabus →</Link>
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
      <Offer className="border-t border-white/10" />
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
      <PageHeader back={{ to: '/programs', label: 'All programs' }} title={program.title} intro={program.summary} />

      <div className="wrap grid-12 gap-8 lg:gap-10 py-8 sm:py-12 lg:py-14">
        <div className="col-span-4 space-y-10 sm:col-span-8 lg:col-span-7">
          <section className="rounded-xl border border-white/10 bg-[#1a1a20] text-white p-5 sm:p-6 shadow-sm">
            <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2.5">Target Audience</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">Who it is for</h2>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">{program.audience}</p>
          </section>

          <section className="rounded-xl border border-white/10 bg-[#1a1a20] text-white p-5 sm:p-6 shadow-sm">
            <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2.5">Core Skills</span>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">What you will learn</h2>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 text-xs sm:text-sm">
              {program.outcomes.map((o) => (
                <li key={o} className="flex items-center gap-2 rounded-lg bg-[#22222a] border border-white/5 p-2.5 font-medium text-white">
                  <span className="text-signal font-bold">✓</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </section>

          {modules.length > 0 && (
            <section className="rounded-xl border border-white/10 bg-[#1a1a20] text-white p-5 sm:p-6 shadow-sm">
              <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2.5">Structured Syllabus</span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">Curriculum</h2>
              <p className="mt-1 text-xs sm:text-sm text-white/70">Modules are taken in sequence. Each ends with a knowledge check to ensure understanding before moving to the next.</p>
              <ol className="mt-5 space-y-4">
                {modules.map((m, i) => (
                  <li key={m.id} className="rounded-lg border border-white/10 bg-[#22222a] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flap flap-amber [--flap-w:1.35rem]" aria-hidden="true">{i + 1}</span>
                      <h3 className="font-display text-base sm:text-lg font-bold text-white">{m.title}</h3>
                    </div>
                    <ul className="mt-3 divide-y divide-white/10 text-xs">
                      {m.lessons.map((l) => (
                        <li key={l.id} className="flex justify-between gap-4 py-2 text-white/90">
                          <span>{l.title}</span>
                          <span className="whitespace-nowrap tabular-nums text-white/50">{l.minutes} min</span>
                        </li>
                      ))}
                      <li className="flex justify-between gap-4 py-2 font-bold text-signal">
                        <span>Module Knowledge Quiz & Journal Check</span>
                        <span className="whitespace-nowrap">{m.quiz.length} questions</span>
                      </li>
                    </ul>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="col-span-4 sm:col-span-8 lg:col-span-5">
          <Ticket className="lg:sticky lg:top-24 p-5 sm:p-6">
            <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2.5">Cohort Enrollment</span>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-extrabold text-white">Program Fees & Options</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 border-b border-white/15 pb-4">
              <div>
                <dt className="text-xs text-white/55 font-semibold">In India (₹)</dt>
                <dd className="mt-1 font-display text-2xl sm:text-3xl leading-none font-extrabold gold-foil-text tabular-nums">{formatINR(program.price)}</dd>
              </div>
              <div>
                <dt className="text-xs text-white/55 font-semibold">In Dubai (AED)</dt>
                <dd className="mt-1 font-display text-2xl sm:text-3xl leading-none font-extrabold gold-foil-text tabular-nums">{formatAED(program.priceAed)}</dd>
              </div>
            </dl>
            <dl className="divide-y divide-white/10 text-xs sm:text-sm py-2">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-white/60">{k}</dt>
                  <dd className="text-right font-bold text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <Link to={`/register?program=${program.id}`} className="btn-brand mt-4 w-full py-2.5 text-xs sm:text-sm font-bold text-center block shadow-md">Apply for {program.title}</Link>
            <Link to={`/contact?program=${program.id}`} className="btn-outline-light mt-2.5 w-full py-2 text-xs sm:text-sm font-semibold text-center block">Book Free Advisor Call</Link>
            {mentor && (
              <p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/65">
                Cohort led by <Link to={`/mentors#${mentor.name.toLowerCase()}`} className="link-line text-white font-bold">{mentor.name}</Link>, {mentor.role}.
              </p>
            )}
          </Ticket>
        </aside>
      </div>

      {/* Sticky Mobile Enrollment Bar for Program Details */}
      <div className="fixed inset-x-0 bottom-0 z-30 lg:hidden border-t border-board-line bg-[#0d0d12]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-xs text-white/65 block">Enrollment Fee</span>
          <span className="font-display text-lg font-extrabold gold-foil-text">{formatINR(program.price)} / {formatAED(program.priceAed)}</span>
        </div>
        <Link to={`/register?program=${program.id}`} className="btn-brand py-2 px-5 text-xs font-bold shadow-md">
          Apply Now →
        </Link>
      </div>

      <Section tight title="Other programs." intro="Explore other asset classes and skill levels." className="bg-[#09090b] border-t border-white/10">
        <ProgramBoard programs={others} />
      </Section>
    </>
  )
}
