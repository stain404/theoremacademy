import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { formatINR, programs } from '../config/site'
import { updateProfile } from '../lib/api'
import { useAuth } from '../lib/auth'

function AuthShell({ title, subtitle, children, aside }) {
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_20rem]">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-ink-soft">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
      {aside}
    </div>
  )
}

function ErrorText({ children }) {
  if (!children) return null
  return <p role="alert" className="rounded-md bg-bear/10 px-3 py-2 text-sm text-bear">{children}</p>
}

// ---------- Login ----------

export function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(form)
      navigate(location.state?.from || '/portal', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell title="Log in" subtitle="Continue your course where you left off.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <ErrorText>{error}</ErrorText>
        <button className="btn-primary w-full" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="text-sm text-ink-soft">New here? <Link to="/register" className="font-semibold text-ink underline underline-offset-4">Create an account</Link></p>
      </form>
    </AuthShell>
  )
}

// ---------- Registration + onboarding ----------

const STEPS = ['Your account', 'Your program', 'Payment']

function Stepper({ current }) {
  return (
    <ol className="mb-8 flex gap-2 text-sm">
      {STEPS.map((s, i) => (
        <li key={s} className="flex-1">
          <div className={`h-1 rounded-full ${i <= current ? 'bg-ink' : 'bg-line'}`} />
          <p className={`mt-2 ${i === current ? 'font-semibold' : 'text-ink-soft'}`}>{i + 1}. {s}</p>
        </li>
      ))}
    </ol>
  )
}

export function Register() {
  const { user, signUp, setUser } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [step, setStep] = useState(user ? 1 : 0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [account, setAccount] = useState({ name: '', email: '', phone: '', password: '' })
  const [prefs, setPrefs] = useState({
    programId: params.get('program') || user?.programId || 'forex-basic',
    mode: user?.mode || 'Online',
    experience: user?.experience || 'Never traded',
  })

  async function createAccount(e) {
    e.preventDefault()
    if (account.password.length < 8) return setError('Use at least 8 characters for your password.')
    setBusy(true)
    setError('')
    try {
      await signUp(account)
      setStep(1)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function savePrefs(e) {
    e.preventDefault()
    setBusy(true)
    const updated = await updateProfile(user.id, { ...prefs, onboarded: true })
    setUser(updated)
    navigate(`/checkout/${prefs.programId}`)
  }

  const program = programs.find((p) => p.id === prefs.programId)

  return (
    <AuthShell
      title={step === 0 ? 'Create your account' : 'Choose your program'}
      subtitle={step === 0 ? 'Takes a minute. You will pick a program next.' : 'You can change your batch later by contacting support.'}
      aside={step === 1 && program && (
        <aside className="h-fit rounded-xl border border-line bg-card p-6 md:mt-24">
          <p className="text-sm text-brand font-medium">{program.market}</p>
          <h2 className="text-xl font-bold">{program.title}</h2>
          <p className="mt-1 text-sm text-ink-soft">{program.duration} · {program.level}</p>
          <ul className="mt-4 space-y-1.5 text-sm">
            {program.outcomes.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <p className="mt-5 border-t border-line pt-4 text-2xl font-bold tabular-nums">{formatINR(program.price)}</p>
        </aside>
      )}
    >
      <Stepper current={step} />

      {step === 0 && (
        <form onSubmit={createAccount} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" required autoComplete="name" className="field" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
            <p className="mt-1 text-xs text-ink-soft">As you want it printed on your certificate.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" required autoComplete="email" className="field" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="phone">WhatsApp number</label>
              <input id="phone" type="tel" required autoComplete="tel" placeholder="+91 or +971" className="field" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} autoComplete="new-password" className="field" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} />
          </div>
          <ErrorText>{error}</ErrorText>
          <button className="btn-primary w-full" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          <p className="text-sm text-ink-soft">Already have an account? <Link to="/login" className="font-semibold text-ink underline underline-offset-4">Log in</Link></p>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={savePrefs} className="space-y-6">
          <fieldset>
            <legend className="label">Program</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {programs.map((p) => (
                <label key={p.id} className={`cursor-pointer rounded-lg border p-4 ${prefs.programId === p.id ? 'border-ink bg-card ring-1 ring-ink' : 'border-line bg-white hover:border-ink/40'}`}>
                  <input type="radio" name="program" className="sr-only" checked={prefs.programId === p.id} onChange={() => setPrefs({ ...prefs, programId: p.id })} />
                  <span className="block font-semibold">{p.title}</span>
                  <span className="text-sm text-ink-soft">{formatINR(p.price)} · {p.duration}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">How will you attend?</legend>
            <div className="flex flex-wrap gap-2">
              {['Dubai', 'India', 'Online'].map((m) => (
                <label key={m} className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium ${prefs.mode === m ? 'border-ink bg-ink text-paper' : 'border-line bg-white'}`}>
                  <input type="radio" name="mode" className="sr-only" checked={prefs.mode === m} onChange={() => setPrefs({ ...prefs, mode: m })} />
                  {m === 'Online' ? 'Online' : `In person, ${m}`}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label className="label" htmlFor="exp">Trading experience</label>
            <select id="exp" className="field" value={prefs.experience} onChange={(e) => setPrefs({ ...prefs, experience: e.target.value })}>
              <option>Never traded</option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>More than 3 years</option>
            </select>
          </div>
          <button className="btn-brand w-full" disabled={busy}>Continue to payment</button>
        </form>
      )}
    </AuthShell>
  )
}
