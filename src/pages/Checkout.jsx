import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Modal from '../components/Modal'
import { programs } from '../config/site'
import { createOrder, getEnrollments, payOrder } from '../lib/api'
import { useAuth } from '../lib/auth'

const formatMoney = (amount, currency) =>
  currency === 'AED' ? 'AED ' + amount.toLocaleString('en-AE') : '₹' + amount.toLocaleString('en-IN')

export default function Checkout() {
  const { programId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const program = programs.find((p) => p.id === programId)
  const [currency, setCurrency] = useState(user?.mode === 'Dubai' ? 'AED' : 'INR')
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState({ number: '', expiry: '', cvc: '', name: user?.name || '' })
  const [upi, setUpi] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null) // { ok: boolean, message?: string, order? }
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false)

  useEffect(() => {
    getEnrollments(user.id).then((list) => setAlreadyEnrolled(list.some((e) => e.programId === programId)))
  }, [user.id, programId])

  if (!program) return <Navigate to="/#programs" replace />
  const amount = currency === 'AED' ? program.priceAed : program.price

  async function pay(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const order = await createOrder(user.id, program.id, currency)
      // Mock: UPI always succeeds. The real gateway returns the result via its SDK callback.
      const paid = await payOrder(order.id, { cardNumber: method === 'card' ? card.number : 'upi' })
      setResult({ ok: true, order: paid })
    } catch (err) {
      setResult({ ok: false, message: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1fr_22rem]">
      <div className="max-w-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">Payment</h1>
        <p className="mt-2 text-ink-soft">Your seat is confirmed as soon as the payment goes through.</p>

        {alreadyEnrolled && (
          <p className="mt-6 rounded-md bg-brand-soft px-4 py-3 text-sm">
            You are already enrolled in {program.title}. <Link to="/portal" className="font-semibold underline">Go to your portal</Link>
          </p>
        )}

        <div className="mt-8 flex gap-2" role="radiogroup" aria-label="Currency">
          {['INR', 'AED'].map((c) => (
            <button key={c} type="button" role="radio" aria-checked={currency === c} onClick={() => setCurrency(c)} className={`rounded-full border px-4 py-1.5 text-sm font-medium ${currency === c ? 'border-ink bg-ink text-paper' : 'border-line bg-white'}`}>
              Pay in {c}
            </button>
          ))}
        </div>

        <form onSubmit={pay} className="mt-6 space-y-5">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-line">
            {[['card', 'Card'], ['upi', currency === 'INR' ? 'UPI' : 'Apple Pay']].map(([id, label]) => (
              <button key={id} type="button" onClick={() => setMethod(id)} aria-pressed={method === id} className={`py-2.5 text-sm font-semibold ${method === id ? 'bg-ink text-paper' : 'bg-white text-ink-soft'}`}>
                {label}
              </button>
            ))}
          </div>

          {method === 'card' ? (
            <>
              <div>
                <label className="label" htmlFor="cc">Card number</label>
                <input id="cc" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className="field tabular-nums" value={card.number}
                  onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="exp">Expiry</label>
                  <input id="exp" required placeholder="MM/YY" autoComplete="cc-exp" className="field" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.slice(0, 5) })} />
                </div>
                <div>
                  <label className="label" htmlFor="cvc">CVC</label>
                  <input id="cvc" required inputMode="numeric" autoComplete="cc-csc" className="field" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="ccname">Name on card</label>
                <input id="ccname" required autoComplete="cc-name" className="field" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
              </div>
            </>
          ) : currency === 'INR' ? (
            <div>
              <label className="label" htmlFor="upi">UPI ID</label>
              <input id="upi" required placeholder="name@bank" className="field" value={upi} onChange={(e) => setUpi(e.target.value)} />
            </div>
          ) : (
            <p className="rounded-md bg-paper px-4 py-3 text-sm text-ink-soft">You will confirm with Apple Pay on the next screen.</p>
          )}

          <button className="btn-brand w-full py-3 text-base" disabled={busy || alreadyEnrolled}>
            {busy ? 'Processing payment…' : `Pay ${formatMoney(amount, currency)}`}
          </button>
          <p className="text-xs text-ink-soft">
            Demo mode: no real money moves. Any card works; a card ending in 0002 shows the failed payment screen.
          </p>
        </form>
      </div>

      <aside className="h-fit rounded-xl border border-line bg-card p-6 md:mt-16">
        <h2 className="font-semibold text-ink-soft">Order summary</h2>
        <p className="mt-3 text-xl font-bold">{program.title}</p>
        <p className="text-sm text-ink-soft">{program.duration} · {user.mode || 'Online'}</p>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between"><dt>Course fee</dt><dd className="tabular-nums">{formatMoney(amount, currency)}</dd></div>
          <div className="flex justify-between text-ink-soft"><dt>Taxes</dt><dd>Included</dd></div>
          <div className="flex justify-between border-t border-line pt-3 text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatMoney(amount, currency)}</dd></div>
        </dl>
      </aside>

      <Modal open={!!result} onClose={() => setResult(null)} labelledBy="pay-result">
        {result?.ok ? (
          <div className="p-7 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-bull/15 text-2xl text-bull" aria-hidden="true">✓</div>
            <h2 id="pay-result" className="mt-4 text-2xl font-bold">Payment successful</h2>
            <p className="mt-2 text-ink-soft">You are enrolled in {program.title}. A receipt has been sent to {user.email}.</p>
            <p className="mt-1 text-xs text-ink-soft">Order {result.order.id}</p>
            <button className="btn-primary mt-6 w-full" onClick={() => navigate(`/portal/course/${program.id}`)}>Start learning</button>
          </div>
        ) : (
          <div className="p-7 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-bear/15 text-2xl text-bear" aria-hidden="true">✕</div>
            <h2 id="pay-result" className="mt-4 text-2xl font-bold">Payment failed</h2>
            <p className="mt-2 text-ink-soft">{result?.message}</p>
            <div className="mt-6 flex flex-col gap-2">
              <button className="btn-primary w-full" onClick={() => setResult(null)}>Try again</button>
              <Link to="/portal/support" className="btn-ghost w-full">Contact support</Link>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
