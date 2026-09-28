import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../components/sections'
import { Segmented, Ticket } from '../components/ui'
import { formatINR, programs } from '../config/site'
import { updateProfile } from '../lib/api'
import { useAuth } from '../lib/auth'

function AuthShell({ title, intro, children, aside }) {
  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="wrap grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h1 className="text-[3.2rem] sm:text-5xl">{title}</h1>
          {intro && <p className="mt-4 max-w-[30rem] text-lg text-ink-soft">{intro}</p>}
          <div className="mt-10">{children}</div>
        </div>
        {aside && <div className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">{aside}</div>}
      </div>
    </section>
  )
}

function ErrorText({ children }) {
  if (!children) return null
  return <p role="alert" className="border-l-4 border-bear bg-bear/5 px-4 py-3 text-sm text-bear">{children}</p>
}

// ---------- Login ----------

export function Login() {
  usePageTitle('Log in')
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
    <AuthShell title="Log in" intro="Continue your course where you left off.">
      <form onSubmit={submit} className="max-w-[28rem] space-y-5">
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" className="field" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <ErrorText>{error}</ErrorText>
        <button className="btn-brand w-full py-3.5" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="text-sm text-ink-soft">New here? <Link to="/register" className="link-line text-ink">Create an account</Link></p>
      </form>
    </AuthShell>
  )
}

// ---------- Registration + onboarding ----------

const STEPS = ['Your account', 'Your program', 'Payment']

// The three steps really happen in order, so they are numbered on board tiles.
function Stepper({ current }) {
  return (
    <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-3">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2.5" aria-current={i === current ? 'step' : undefined}>
          <span className={`flap [--flap-w:1.2rem] ${i === current ? 'flap-amber' : i < current ? '' : 'flap-dim'}`} aria-hidden="true">{i < current ? '✓' : i + 1}</span>
          <span className={`text-sm ${i === current ? 'font-semibold' : 'text-ink-soft'}`}>{s}</span>
        </li>
      ))}
    </ol>
  )
}

export function Register() {
  usePageTitle('Apply')
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
      intro={step === 0 ? 'Takes a minute. You will pick a program next.' : 'You can change your batch later by contacting support.'}
      aside={step === 1 && program && (
        <Ticket className="lg:sticky lg:top-24 lg:mt-40">
          <p className="text-xs text-white/55">{program.market}, {program.level.toLowerCase()}</p>
          <h2 className="mt-1 text-[2.6rem] leading-none">{program.title}</h2>
          <ul className="mt-5 space-y-2 border-t border-white/15 pt-5 text-sm text-white/80">
            {program.outcomes.map((o) => <li key={o}>{o}</li>)}
          </ul>
          <div className="mt-6 flex items-baseline justify-between border-t border-white/15 pt-5">
            <span className="text-sm text-white/55">{program.duration}</span>
            <span className="font-display text-[2.4rem] leading-none font-extrabold text-signal tabular-nums">{formatINR(program.price)}</span>
          </div>
        </Ticket>
      )}
    >
      <Stepper current={step} />

      {step === 0 && (
        <form onSubmit={createAccount} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" required autoComplete="name" className="field" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
            <p className="mt-1.5 text-xs text-ink-soft">As you want it printed on your certificate.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
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
            <p className="mt-1.5 text-xs text-ink-soft">At least 8 characters.</p>
          </div>
          <ErrorText>{error}</ErrorText>
          <button className="btn-brand w-full py-3.5" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          <p className="text-sm text-ink-soft">Already have an account? <Link to="/login" className="link-line text-ink">Log in</Link></p>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={savePrefs} className="space-y-8">
          <fieldset>
            <legend className="label">Program</legend>
            <div className="border-t-2 border-ink">
              {programs.map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-baseline justify-between gap-4 border-b border-line py-4 pr-2 pl-4 transition-colors ${prefs.programId === p.id ? 'border-l-4 border-l-signal bg-card' : 'border-l-4 border-l-transparent hover:bg-card'}`}>
                  <input type="radio" name="program" className="sr-only" checked={prefs.programId === p.id} onChange={() => setPrefs({ ...prefs, programId: p.id })} />
                  <span>
                    <span className="block font-display text-[1.9rem] leading-none font-extrabold">{p.title}</span>
                    <span className="mt-1 block text-sm text-ink-soft">{p.level}, {p.duration}</span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{formatINR(p.price)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label">How will you attend?</legend>
            <Segmented
              name="Attendance"
              options={[['Online', 'Online'], ['Dubai', 'In Dubai'], ['India', 'In India']]}
              value={prefs.mode}
              onChange={(mode) => setPrefs({ ...prefs, mode })}
            />
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
          <button className="btn-brand w-full py-3.5" disabled={busy}>Continue to payment</button>
        </form>
      )}
    </AuthShell>
  )
}

