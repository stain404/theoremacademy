import { Link } from 'react-router-dom'
import { usePageTitle } from '../../components/sections'
import { site, teachers } from '../../config/site'
import { useAuth } from '../../lib/auth'
import { ProgressBar, useMyCourses } from './Portal'

// Sized in container units (cqw) so it scales with its own width and prints identically.
function Certificate({ name, program, date, id }) {
  const mentor = teachers.find((t) => t.teaches.includes(program.title)) || teachers[0]
  return (
    <div className="certificate grid aspect-[1.414] w-full grid-cols-[27%_1fr] border border-line bg-white text-black [container-type:inline-size] rounded-lg overflow-hidden">
      <div className="flex flex-col justify-between bg-board p-[4cqw] text-ink">
        <div className="flex items-center gap-[1.2cqw]">
          <span className="flap flap-amber [--flap-w:2.6cqw]" aria-hidden="true">T</span>
          <span className="font-display text-[2.6cqw] leading-none font-semibold">{site.name}</span>
        </div>
        <div>
          <p className="font-display text-[4.6cqw] leading-[0.95] font-semibold text-ink">Certificate of completion</p>
          <p className="mt-[2cqw] text-[1.3cqw] text-ink-soft">Certificate {id}</p>
        </div>
      </div>
      <div className="flex flex-col justify-between bg-white p-[5cqw] text-black">
        <div>
          <p className="text-[1.6cqw] text-neutral-600 font-medium">This certifies that</p>
          <p className="mt-[1.5cqw] font-display text-[8.5cqw] leading-[0.9] font-semibold text-black">{name}</p>
          <p className="mt-[3cqw] text-[1.6cqw] text-neutral-600 font-medium">has completed every lesson and assessment of</p>
          <p className="mt-[0.8cqw] font-display text-[4.4cqw] leading-none font-semibold text-black">{program.title}</p>
          <div className="mt-[1.6cqw] h-[0.5cqw] w-[10cqw] bg-brand" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-[4cqw] text-[1.4cqw]">
          <div className="border-t-[0.2cqw] border-black/30 pt-[1cqw]">
            <p className="font-bold text-black">{mentor.name}</p>
            <p className="text-neutral-600">{mentor.role}</p>
          </div>
          <div className="border-t-[0.2cqw] border-black/30 pt-[1cqw]">
            <p className="font-bold text-black">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-neutral-600">Date completed</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Certificates() {
  usePageTitle('Certificates')
  const { user } = useAuth()
  const courses = useMyCourses()
  if (!courses) return <p className="text-ink-soft">Loading your certificates…</p>
  const finished = courses.filter((c) => c.progress.finished)
  const inProgress = courses.filter((c) => !c.progress.finished)

  return (
    <div>
      <h1 className="text-[3.2rem] sm:text-5xl print:hidden">Certificates</h1>
      {finished.length === 0 && (
        <p className="mt-4 max-w-[34rem] text-lg text-ink-soft print:hidden">
          Your certificate unlocks when you complete every lesson and pass every quiz in a course.
        </p>
      )}
      {finished.map((c) => {
        const lastActivity = Math.max(c.enrolledAt, ...c.progress.quizzes.map((q) => q.at))
        return (
          <section key={c.id} className="mt-10">
            <Certificate name={user.name} program={c.program} date={lastActivity} id={c.id.toUpperCase()} />
            <button onClick={() => window.print()} className="btn-brand mt-5 print:hidden">Download as PDF</button>
          </section>
        )
      })}
      {inProgress.length > 0 && (
        <section className="mt-12 print:hidden">
          <h2 className="text-[2.2rem] sm:text-3xl">Still in progress</h2>
          <ul className="mt-5 border-t-2 border-ink">
            {inProgress.map((c) => (
              <li key={c.id} className="grid gap-3 border-b border-line py-5 sm:grid-cols-[1fr_12rem_auto] sm:items-center sm:gap-6">
                <span className="font-display text-[1.9rem] leading-none font-semibold">{c.program.title}</span>
                <span className="flex items-center gap-3">
                  <span className="flex-1"><ProgressBar percent={c.progress.percent} /></span>
                  <span className="text-sm tabular-nums">{c.progress.percent}%</span>
                </span>
                <Link to={`/portal/course/${c.programId}`} className="link-line text-sm">Continue course</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
