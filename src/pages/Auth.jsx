import { useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageTitle } from '../components/sections'
import { Segmented, Ticket } from '../components/ui'
import { bundlePackage, formatINR, programs } from '../config/site'
import { updateProfile } from '../lib/api'
import { useAuth } from '../lib/auth'

const ALL_OFFERINGS = [...programs, bundlePackage]

function AuthShell({ title, intro, children, aside }) {
  return (
    <section className="py-8 sm:py-12 lg:py-14">
      <div className="wrap grid-12 gap-y-8 lg:gap-x-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">{title}</h1>
          {intro && <p className="mt-2 max-w-[30rem] text-sm text-ink-soft leading-relaxed">{intro}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {aside && <div className="col-span-4 sm:col-span-8 lg:col-span-5 lg:col-start-8">{aside}</div>}
      </div>
    </section>
  )
}

function ErrorText({ children }) {
  if (!children) return null
  return <p role="alert" className="border-l-4 border-bear bg-bear/10 px-4 py-3 text-sm text-bear rounded-r-lg">{children}</p>
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
      <form onSubmit={submit} className="max-w-[28rem] space-y-4 card-rich text-ink p-5 sm:p-6">
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="email">Email</label>
          <input id="email" type="email" required autoComplete="email" className="field py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="password">Password</label>
          <input id="password" type="password" required autoComplete="current-password" className="field py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <ErrorText>{error}</ErrorText>
        <button className="btn-brand w-full py-2.5 text-sm font-bold" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        <p className="text-xs text-ink-soft text-center pt-2">New here? <Link to="/register" className="link-line text-brand font-bold">Create an account</Link></p>
      </form>
    </AuthShell>
  )
}

// ---------- Registration + onboarding ----------

const STEPS = ['Your account', 'Your program', 'Payment']

// The three steps really happen in order, so they are numbered on board tiles.
function Stepper({ current }) {
  return (
    <ol className="mb-6 flex flex-wrap gap-x-5 gap-y-2">
      {STEPS.map((s, i) => (
        <li key={s} className="flex items-center gap-2" aria-current={i === current ? 'step' : undefined}>
          <span className={`flap [--flap-w:1.15rem] ${i === current ? 'flap-amber' : i < current ? '' : 'flap-dim'}`} aria-hidden="true">{i < current ? '✓' : i + 1}</span>
          <span className={`text-xs ${i === current ? 'font-bold text-ink' : 'text-ink-soft'}`}>{s}</span>
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

  const program = ALL_OFFERINGS.find((p) => p.id === prefs.programId) || programs[0]

  return (
    <AuthShell
      title={step === 0 ? 'Create your account' : 'Choose your program'}
      intro={step === 0 ? 'Takes 60 seconds. You will select your program and cohort next.' : 'Select your batch format. You can change your batch later via support.'}
      aside={step === 1 && program && (
        <Ticket className="lg:sticky lg:top-24 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="badge-signal text-[0.65rem] font-bold py-0.5 px-2">{program.market}</span>
            {program.discountPercent && (
              <span className="badge-save">
                Save {program.discountPercent}%
              </span>
            )}
          </div>
          <h2 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-ink">{program.title}</h2>
          <ul className="mt-4 space-y-2 border-t border-line pt-4 text-sm text-ink">
            {program.outcomes.map((o) => (
              <li key={o} className="flex items-center gap-1.5">
                <span className="text-brand font-bold">✓</span>
                <span>{o}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-xs text-ink-soft">{program.duration}</span>
            <div className="text-right">
              {program.originalPrice && (
                <span className="text-xs line-through text-ink-soft block">{formatINR(program.originalPrice)}</span>
              )}
              <span className="font-display text-2xl sm:text-3xl leading-none font-semibold text-ink tabular-nums">{formatINR(program.price)}</span>
            </div>
          </div>
        </Ticket>
      )}
    >
      <Stepper current={step} />

      {step === 0 && (
        <form onSubmit={createAccount} className="space-y-4 card-rich text-ink p-5 sm:p-6">
          <div>
            <label className="label text-xs font-bold text-ink" htmlFor="name">Full name</label>
            <input id="name" required autoComplete="name" className="field py-2 text-sm" value={account.name} onChange={(e) => setAccount({ ...account, name: e.target.value })} />
            <p className="mt-1 text-[0.7rem] text-ink-soft">As you want it printed on your certificate.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label text-xs font-bold text-ink" htmlFor="email">Email</label>
              <input id="email" type="email" required autoComplete="email" className="field py-2 text-sm" value={account.email} onChange={(e) => setAccount({ ...account, email: e.target.value })} />
            </div>
            <div>
              <label className="label text-xs font-bold text-ink" htmlFor="phone">WhatsApp number</label>
              <input id="phone" type="tel" required autoComplete="tel" placeholder="+91 or +971" className="field py-2 text-sm" value={account.phone} onChange={(e) => setAccount({ ...account, phone: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label text-xs font-bold text-ink" htmlFor="password">Password</label>
            <input id="password" type="password" required minLength={8} autoComplete="new-password" className="field py-2 text-sm" value={account.password} onChange={(e) => setAccount({ ...account, password: e.target.value })} />
            <p className="mt-1 text-[0.7rem] text-ink-soft">At least 8 characters.</p>
          </div>
          <ErrorText>{error}</ErrorText>
          <button className="btn-brand w-full py-2.5 text-sm font-bold" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
          <p className="text-xs text-ink-soft text-center pt-1">Already have an account? <Link to="/login" className="link-line text-brand font-bold">Log in</Link></p>
        </form>
      )}

      {step === 1 && (
        <form onSubmit={savePrefs} className="space-y-6 card-rich text-ink p-5 sm:p-6">
          <fieldset>
            <legend className="label text-xs font-bold text-ink mb-2">Program</legend>
            <div className="divide-y divide-line rounded-lg border border-line bg-surface overflow-hidden">
              {ALL_OFFERINGS.map((p) => (
                <label
                  key={p.id}
                  className={`flex cursor-pointer items-center justify-between gap-3 p-3.5 transition-colors ${
                    prefs.programId === p.id ? 'bg-brand-soft border-l-4 border-l-brand' : 'hover:bg-card'
                  }`}
                >
                  <input
                    type="radio"
                    name="program"
                    className="sr-only"
                    checked={prefs.programId === p.id}
                    onChange={() => setPrefs({ ...prefs, programId: p.id })}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="block font-display text-base sm:text-lg leading-tight font-semibold text-ink">
                        {p.title}
                      </span>
                      {p.discountPercent && (
                        <span className="badge-save">
                          Save 10%
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-ink-soft">{p.level}, {p.duration}</span>
                  </div>
                  <div className="text-right">
                    {p.originalPrice && (
                      <span className="text-[0.7rem] line-through text-ink-soft block leading-none">{formatINR(p.originalPrice)}</span>
                    )}
                    <span className="text-sm font-bold tabular-nums text-brand">{formatINR(p.price)}</span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label text-xs font-bold text-ink mb-2">Where you will study</legend>
            <Segmented
              name="Attendance"
              options={[['Online', 'Online (Zoom)'], ['Dubai', 'Dubai Campus'], ['India', 'India Campus']]}
              value={prefs.mode}
              onChange={(mode) => setPrefs({ ...prefs, mode })}
            />
          </fieldset>
          <div>
            <label className="label text-xs font-bold text-ink" htmlFor="exp">Trading experience</label>
            <select id="exp" className="field py-2 text-sm" value={prefs.experience} onChange={(e) => setPrefs({ ...prefs, experience: e.target.value })}>
              <option>Never traded</option>
              <option>Less than 1 year</option>
              <option>1–3 years</option>
              <option>More than 3 years</option>
            </select>
          </div>
          <button className="btn-brand w-full py-2.5 text-sm font-bold" disabled={busy}>Continue to payment</button>
        </form>
      )}
    </AuthShell>
  )
}

