import { useCallback, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { usePageTitle } from '../../components/sections'
import { curriculum } from '../../config/curriculum'
import { programs, site } from '../../config/site'
import { PASS_MARK, getEnrollments, getProgress, setLessonComplete, submitQuiz } from '../../lib/api'
import { useAuth } from '../../lib/auth'
import { ProgressBar } from './Portal'

// Mock notes: builds a text file in the browser. In production, link to PDFs in file storage.
function downloadNotes(program, module) {
  const body = [
    `${site.name}, ${program.title}`,
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
    <form onSubmit={submit} className="mt-6 bg-card p-5 sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-xl">Module quiz</h3>
        <span className="text-sm text-ink-soft">
          Pass mark {Math.round(PASS_MARK * 100)}%{lastResult && !result && `. Best so far ${lastResult.correct} of ${lastResult.total}`}
        </span>
      </div>
      <ol className="mt-5 space-y-6">
        {module.quiz.map((q, i) => (
          <li key={i}>
            <fieldset disabled={!!result}>
              <legend className="mb-3 font-semibold">{i + 1}. {q.q}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, j) => {
                  const chosen = answers[i] === j
                  const reveal = result && (j === q.answer || chosen)
                  const tone = !reveal
                    ? chosen ? 'border-ink bg-white shadow-[inset_4px_0_0_var(--color-signal)]' : 'border-ink/15 bg-white hover:border-ink/40'
                    : j === q.answer ? 'border-bull bg-bull/10' : 'border-bear bg-bear/10'
                  return (
                    <label key={j} className={`flex cursor-pointer items-center gap-2.5 border px-3 py-2.5 text-sm ${tone}`}>
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
        <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 border-l-4 px-4 py-3 ${result.passed ? 'border-bull bg-bull/10' : 'border-bear bg-bear/10'}`} role="status">
          <p className="font-semibold">
            {result.correct} of {result.total} correct. {result.passed ? 'Passed.' : 'Not passed yet. Review the lessons and try again.'}
          </p>
          <button type="button" onClick={retry} className="btn-ghost bg-white py-2">Retake quiz</button>
        </div>
      ) : (
        <button className="btn-primary mt-6" disabled={!allAnswered || busy}>{busy ? 'Checking…' : 'Submit answers'}</button>
      )}
    </form>
  )
}

export default function Course() {
  const { programId } = useParams()
  const { user } = useAuth()
  const program = programs.find((p) => p.id === programId)
  usePageTitle(program?.title)
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
      <div>
        <h1 className="text-[3.2rem] sm:text-5xl">{program.title} is locked.</h1>
        <p className="mt-4 max-w-[34rem] text-lg text-ink-soft">Enrol to unlock the lessons, notes and quizzes.</p>
        <Link to={`/checkout/${programId}`} className="btn-brand mt-8">Enrol in {program.title}</Link>
      </div>
    )
  }

  async function toggle(lessonId, done) {
    await setLessonComplete(user.id, programId, lessonId, done)
    refresh()
  }

  return (
    <div>
      <Link to="/portal" className="link-line text-sm text-ink-soft">My courses</Link>
      <h1 className="mt-4 text-[3.2rem] sm:text-5xl">{program.title}</h1>
      <div className="mt-6 flex max-w-[40rem] items-center gap-4">
        <div className="flex-1"><ProgressBar percent={progress.percent} /></div>
        <span className="text-sm font-semibold tabular-nums">{progress.percent}% complete</span>
      </div>
      {progress.finished && (
        <p className="mt-6 border-l-4 border-signal bg-brand-soft px-4 py-3 text-sm">
          You finished every lesson and quiz. <Link to="/portal/certificates" className="link-line">Get your certificate</Link>
        </p>
      )}

      <ol className="mt-10">
        {modules.map((m, mi) => {
          const results = progress.quizzes.filter((q) => q.moduleId === m.id)
          const best = [...results].sort((a, b) => b.correct - a.correct)[0]
          const passed = results.some((r) => r.passed)
          const lessonsDone = m.lessons.filter((l) => progress.completedLessons.has(l.id)).length
          return (
            <li key={m.id} data-module className="border-t-2 border-ink py-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className={`flap [--flap-w:1.5rem] ${passed ? 'flap-amber' : ''}`} aria-hidden="true">{mi + 1}</span>
                  <div>
                    <h2 className="text-[2.2rem] leading-none sm:text-[2.6rem]"><span className="sr-only">Module {mi + 1}: </span>{m.title}</h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      {lessonsDone} of {m.lessons.length} lessons done{passed ? ', quiz passed' : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => downloadNotes(program, m)} className="btn-ghost py-2">Download notes</button>
              </div>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {m.lessons.map((l) => {
                  const done = progress.completedLessons.has(l.id)
                  return (
                    <li key={l.id} className="flex items-center gap-3 py-3">
                      <input id={l.id} type="checkbox" checked={done} onChange={(e) => toggle(l.id, e.target.checked)} className="size-4 accent-ink" />
                      <label htmlFor={l.id} className={`flex-1 cursor-pointer ${done ? 'text-ink-soft line-through decoration-ink/30' : ''}`}>{l.title}</label>
                      <span className="text-sm tabular-nums text-ink-soft">{l.minutes} min</span>
                    </li>
                  )
                })}
              </ul>
              <div className="mt-4">
                <button className="link-line text-sm" aria-expanded={openQuiz === m.id} onClick={() => setOpenQuiz(openQuiz === m.id ? null : m.id)}>
                  {openQuiz === m.id ? 'Close quiz' : passed ? 'Retake quiz' : 'Take the quiz'}
                </button>
              </div>
              {openQuiz === m.id && <Quiz key={m.id} programId={programId} module={m} lastResult={best} onDone={refresh} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
