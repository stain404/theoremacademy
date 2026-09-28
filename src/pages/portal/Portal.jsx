import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { PortalNavLink } from '../../components/Layout'
import { formatINR, programs } from '../../config/site'
import { getEnrollments, getProgress } from '../../lib/api'
import { useAuth } from '../../lib/auth'

// Loads the signed-in student's enrollments with progress for each.
export function useMyCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState(null)
  useEffect(() => {
    let live = true
    getEnrollments(user.id).then(async (list) => {
      const withProgress = await Promise.all(
        list.map(async (e) => ({ ...e, program: programs.find((p) => p.id === e.programId), progress: await getProgress(user.id, e.programId) })),
      )
      if (live) setCourses(withProgress)
    })
    return () => { live = false }
  }, [user.id])
  return courses
}

export function PortalLayout() {
  const { user, signOut } = useAuth()
  const { pathname } = useLocation()
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[13rem_1fr]">
      <aside>
        <p className="px-3 text-sm text-ink-soft">Signed in as</p>
        <p className="mb-4 truncate px-3 font-semibold">{user.name}</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col" aria-label="Portal">
          <PortalNavLink to="/portal" end={!pathname.startsWith('/portal/course')}>My courses</PortalNavLink>
          <PortalNavLink to="/portal/certificates">Certificates</PortalNavLink>
          <PortalNavLink to="/portal/support">Help and support</PortalNavLink>
        </nav>
        <button onClick={signOut} className="mt-4 hidden px-3 text-sm text-ink-soft underline underline-offset-4 hover:text-ink md:block">Log out</button>
      </aside>
      <div className="min-w-0"><Outlet /></div>
    </div>
  )
}

export function ProgressBar({ percent }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-bull transition-[width] duration-500" style={{ width: `${percent}%` }} />
    </div>
  )
}

export function Dashboard() {
  const { user } = useAuth()
  const courses = useMyCourses()
  if (!courses) return <p className="text-ink-soft">Loading your courses…</p>

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}</h1>
      {courses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-ink/25 p-8">
          <h2 className="text-xl font-bold">You are not enrolled in a course yet</h2>
          <p className="mt-2 text-ink-soft">Pick a program to unlock lessons, notes, quizzes and your certificate.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {programs.map((p) => (
              <Link key={p.id} to={`/checkout/${p.id}`} className="btn-ghost text-sm">{p.title} · {formatINR(p.price)}</Link>
            ))}
          </div>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {courses.map((c) => (
            <li key={c.id} className="rounded-xl border border-line bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-brand">{c.program.market}</p>
                  <h2 className="text-2xl font-bold">{c.program.title}</h2>
                </div>
                <Link to={`/portal/course/${c.programId}`} className="btn-primary">
                  {c.progress.percent === 0 ? 'Start course' : c.progress.finished ? 'Review course' : 'Continue'}
                </Link>
              </div>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex-1"><ProgressBar percent={c.progress.percent} /></div>
                <span className="text-sm font-semibold tabular-nums">{c.progress.percent}%</span>
              </div>
              {c.progress.finished && (
                <p className="mt-3 text-sm">Course complete. <Link to="/portal/certificates" className="font-semibold underline underline-offset-4">View your certificate</Link></p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
