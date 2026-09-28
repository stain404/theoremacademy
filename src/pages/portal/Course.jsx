import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { curriculum } from '../../config/curriculum'
import { programs, site } from '../../config/site'
import { PASS_MARK, getEnrollments, getProgress, setLessonComplete, submitQuiz } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { ProgressBar } from './Portal'

// Mock notes: builds a text file in the browser. In production, link to PDFs in file storage.
function downloadNotes(program, module) {
  const body = [
    `${site.name} · ${program.title}`,
    `Module: ${module.title}`,
    '',
    ...module.lessons.map((l, i) => `${i + 1}. ${l.title}\n   Key points from class go here.\n`),
  ].join('\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/plain' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `${module.id}-${module.title.replace(/\W+/g, '-').toLowerCase()}-notes.txt` })
  a.click()
  URL.revokeObjectURL(url)
}

function Quiz({ programId, module, lastResult, onDone }) {
  const { user } = useAuth()
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const allAnswered = module.quiz.every((_, i) => answers[i] !== undefined)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    const r = await submitQuiz(user.id, programId, module.id, answers)
    setResult(r)
    setBusy(false)
    onDone()
  }

  function retry() {
    setAnswers({})
    setResult(null)
  }

  return (
    <form onSubmit={submit} className="mt-4 rounded-lg bg-paper p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="font-semibold">Module quiz</h4>
        <span className="text-sm text-ink-soft">
          Pass mark {Math.round(PASS_MARK * 100)}%
          {lastResult && !result && ` · Best so far: ${lastResult.correct}/${lastResult.total}`}
        </span>
      </div>
      <ol className="mt-4 space-y-5">
        {module.quiz.map((q, i) => (
          <li key={i}>
            <fieldset disabled={!!result}>
              <legend className="mb-2 font-medium">{i + 1}. {q.q}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, j) => {
                  const chosen = answers[i] === j
                  const reveal = result && (j === q.answer || chosen)
                  const tone = !reveal ? (chosen ? 'border-ink bg-white ring-1 ring-ink' : 'border-line bg-white') : j === q.answer ? 'border-bull bg-bull/10' : 'border-bear bg-bear/10'
                  return (
                    <label key={j} className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm ${tone}`}>
                      <input type="radio" name={`${module.id}-q${i}`} checked={chosen} onChange={() => setAnswers({ ...answers, [i]: j })} className="accent-ink" />
                      {opt}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
      {result ? (
        <div className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md px-4 py-3 ${result.passed ? 'bg-bull/10' : 'bg-bear/10'}`} role="status">
          <p className="font-semibold">
            {result.correct}/{result.total} correct. {result.passed ? 'Passed.' : 'Not passed yet. Review the lessons and try again.'}
          </p>
          <button type="button" onClick={retry} className="btn-ghost py-1.5 text-sm">Retake quiz</button>
        </div>
      ) : (
        <button className="btn-primary mt-5" disabled={!allAnswered || busy}>{busy ? 'Checking…' : 'Submit answers'}</button>
      )}
    </form>
  )
}

export default function Course() {
  const { programId } = useParams()
  const { user } = useAuth()
  const program = programs.find((p) => p.id === programId)
  const modules = curriculum[programId] || []
  const [enrolled, setEnrolled] = useState(null)
  const [progress, setProgress] = useState(null)
  const [openQuiz, setOpenQuiz] = useState(null)

  const refresh = useCallback(() => getProgress(user.id, programId).then(setProgress), [user.id, programId])

  useEffect(() => {
    getEnrollments(user.id).then((list) => setEnrolled(list.some((e) => e.programId === programId)))
    refresh()
  }, [user.id, programId, refresh])

  if (!program) return <Navigate to="/portal" replace />
  if (enrolled === null || !progress) return <p className="text-ink-soft">Loading course…</p>
  if (!enrolled) {
    return (
      <div className="rounded-xl border border-dashed border-ink/25 p-8">
        <h1 className="text-2xl font-bold">{program.title} is locked</h1>
        <p className="mt-2 text-ink-soft">Enroll to unlock the lessons, notes and quizzes.</p>
        <Link to={`/checkout/${programId}`} className="btn-brand mt-5">Enroll now</Link>
      </div>
    )
  }

  async function toggle(lessonId, done) {
    await setLessonComplete(user.id, programId, lessonId, done)
    refresh()
  }

  return (
    <div>
      <Link to="/portal" className="text-sm text-ink-soft hover:text-ink">My courses</Link>
      <h1 className="mt-1 text-3xl font-bold">{program.title}</h1>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex-1"><ProgressBar percent={progress.percent} /></div>
        <span className="text-sm font-semibold tabular-nums">{progress.percent}% complete</span>
      </div>
      {progress.finished && (
        <p className="mt-4 rounded-md bg-brand-soft px-4 py-3 text-sm">
          You finished every lesson and quiz. <Link to="/portal/certificates" className="font-semibold underline">Get your certificate</Link>
        </p>
      )}

      <ol className="mt-8 space-y-6">
        {modules.map((m, mi) => {
          const results = progress.quizzes.filter((q) => q.moduleId === m.id)
          const best = results.sort((a, b) => b.correct - a.correct)[0]
          const passed = results.some((r) => r.passed)
          return (
            <li key={m.id} className="rounded-xl border border-line bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-ink-soft">Module {mi + 1}</p>
                  <h2 className="text-xl font-bold">{m.title}</h2>
                </div>
                <button onClick={() => downloadNotes(program, m)} className="btn-ghost py-1.5 text-sm">Download notes</button>
              </div>
              <ul className="mt-4 divide-y divide-line">
                {m.lessons.map((l) => {
                  const done = progress.completedLessons.has(l.id)
                  return (
                    <li key={l.id} className="flex items-center gap-3 py-3">
                      <input id={l.id} type="checkbox" checked={done} onChange={(e) => toggle(l.id, e.target.checked)} className="size-4 accent-bull" />
                      <label htmlFor={l.id} className={`flex-1 cursor-pointer ${done ? 'text-ink-soft line-through decoration-ink/30' : ''}`}>{l.title}</label>
                      <span className="text-sm tabular-nums text-ink-soft">{l.minutes} min</span>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button className="text-sm font-semibold underline underline-offset-4" aria-expanded={openQuiz === m.id} onClick={() => setOpenQuiz(openQuiz === m.id ? null : m.id)}>
                  {openQuiz === m.id ? 'Close quiz' : passed ? 'Retake quiz' : 'Take the quiz'}
                </button>
                {passed && <span className="rounded-full bg-bull/15 px-2.5 py-0.5 text-xs font-semibold text-bull">Quiz passed</span>}
              </div>
              {openQuiz === m.id && <Quiz key={m.id} programId={programId} module={m} lastResult={best} onDone={refresh} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
