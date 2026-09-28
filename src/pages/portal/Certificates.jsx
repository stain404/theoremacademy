import { Link } from 'react-router-dom'
import { site, teachers } from '../../config/site'
import { useAuth } from '../../lib/auth'
import { useMyCourses } from './Portal'

function Certificate({ name, program, date, id }) {
  const mentor = teachers.find((t) => t.role.toLowerCase().includes(program.market.toLowerCase())) || teachers[0]
  return (
    <div className="certificate relative aspect-[1.414] w-full overflow-hidden border-[10px] border-ink bg-card p-[5%] text-center">
      <div className="absolute inset-3 rounded border border-brand/60" aria-hidden="true" />
      <p className="font-display text-[clamp(.8rem,2vw,1.1rem)] font-medium">{site.name}</p>
      <p className="mt-[4%] text-[clamp(.7rem,1.6vw,.95rem)] text-ink-soft">This certifies that</p>
      <p className="mt-[2%] font-display text-[clamp(1.4rem,5vw,3rem)] font-normal leading-tight italic">{name}</p>
      <p className="mt-[2%] text-[clamp(.7rem,1.6vw,.95rem)] text-ink-soft">has completed every lesson and assessment of</p>
      <p className="mt-[1.5%] font-display text-[clamp(1rem,3vw,1.8rem)] text-brand">{program.title}</p>
      <div className="absolute inset-x-[8%] bottom-[9%] flex items-end justify-between text-left text-[clamp(.6rem,1.4vw,.85rem)]">
        <div>
          <p className="font-semibold">{mentor.name}</p>
          <p className="border-t border-ink/40 pt-1 text-ink-soft">Mentor</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p className="border-t border-ink/40 pt-1 text-ink-soft">Certificate {id}</p>
        </div>
      </div>
    </div>
  )
}

export default function Certificates() {
  const { user } = useAuth()
  const courses = useMyCourses()
  if (!courses) return <p className="text-ink-soft">Loading…</p>
  const finished = courses.filter((c) => c.progress.finished)
  const inProgress = courses.filter((c) => !c.progress.finished)

  return (
    <div>
      <h1 className="text-3xl font-bold print:hidden">Certificates</h1>
      {finished.length === 0 && (
        <p className="mt-4 max-w-prose text-ink-soft print:hidden">
          Your certificate unlocks when you complete every lesson and pass every quiz in a course.
        </p>
      )}
      {finished.map((c) => {
        const lastActivity = Math.max(c.enrolledAt, ...c.progress.quizzes.map((q) => q.at))
        return (
          <section key={c.id} className="mt-8">
            <Certificate name={user.name} program={c.program} date={lastActivity} id={c.id.toUpperCase()} />
            <button onClick={() => window.print()} className="btn-primary mt-4 print:hidden">Download as PDF</button>
          </section>
        )
      })}
      {inProgress.length > 0 && (
        <ul className="mt-8 space-y-2 print:hidden">
          {inProgress.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-card px-5 py-4">
              <span><strong>{c.program.title}</strong> <span className="text-ink-soft">· {c.progress.percent}% complete</span></span>
              <Link to={`/portal/course/${c.programId}`} className="text-sm font-semibold underline underline-offset-4">Continue course</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
