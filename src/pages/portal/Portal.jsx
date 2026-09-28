import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { PortalNavLink } from '../../components/Layout'
import { usePageTitle } from '../../components/sections'
import { ProgramBoard } from '../../components/ui'
import { programs } from '../../config/site'
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
    <div className="wrap grid gap-8 py-10 sm:py-14 lg:grid-cols-[13rem_1fr] lg:gap-14">
      <aside>
        <p className="text-sm text-ink-soft">Signed in as</p>
        <p className="mb-5 truncate font-cond text-xl font-bold">{user.name}</p>
        <nav className="-mx-5 flex overflow-x-auto border-b border-line px-5 lg:mx-0 lg:flex-col lg:border-b-0 lg:px-0" aria-label="Portal">
          <PortalNavLink to="/portal" end={!pathname.startsWith('/portal/course')}>My courses</PortalNavLink>
          <PortalNavLink to="/portal/certificates">Certificates</PortalNavLink>
          <PortalNavLink to="/portal/support">Help and support</PortalNavLink>
        </nav>
        <button onClick={signOut} className="link-line mt-6 hidden text-sm text-ink-soft lg:block">Log out</button>
      </aside>
      <div className="min-w-0"><Outlet /></div>
    </div>
  )
}

// Progress: an amber bar on an ink hairline, with the percentage in board digits beside it.
export function ProgressBar({ percent }) {
  return (
    <div className="h-2 bg-line" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Course progress">
      <div className="h-full bg-signal transition-[width] duration-500" style={{ width: `${percent}%` }} />
    </div>
  )
}

export function Dashboard() {
  usePageTitle('My courses')
  const { user } = useAuth()
  const courses = useMyCourses()
  if (!courses) return <p className="text-ink-soft">Loading your courses…</p>

  return (
    <div>
      <h1 className="text-[3.2rem] sm:text-5xl">Welcome back, {user.name.split(' ')[0]}.</h1>
      {courses.length === 0 ? (
        <div className="mt-10">
          <h2 className="text-[2.2rem] sm:text-3xl">You are not enrolled in a course yet.</h2>
          <p className="mt-3 max-w-[34rem] text-ink-soft">Pick a program to unlock its lessons, notes, quizzes and certificate.</p>
          <div className="mt-8"><ProgramBoard /></div>
        </div>
      ) : (
        <ul className="mt-10 border-t-2 border-ink">
          {courses.map((c) => (
            <li key={c.id} className="grid gap-5 border-b border-line py-7 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="text-sm font-semibold text-brand">{c.program.market}</p>
                <h2 className="mt-1 text-[2.6rem] sm:text-3xl">{c.program.title}</h2>
                <div className="mt-5 flex max-w-[34rem] items-center gap-4">
                  <div className="flex-1"><ProgressBar percent={c.progress.percent} /></div>
                  <span className="text-sm font-semibold tabular-nums">{c.progress.percent}%</span>
                </div>
                {c.progress.finished && (
                  <p className="mt-3 text-sm">Course complete. <Link to="/portal/certificates" className="link-line">View your certificate</Link></p>
                )}
              </div>
              <Link to={`/portal/course/${c.programId}`} className={c.progress.finished ? 'btn-ghost' : 'btn-brand'}>
                {c.progress.percent === 0 ? 'Start course' : c.progress.finished ? 'Review course' : 'Continue course'}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
