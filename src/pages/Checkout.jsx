import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlapText } from '../components/Board'
import Modal from '../components/Modal'
import { usePageTitle } from '../components/sections'
import { Segmented, Ticket } from '../components/ui'
import { programs } from '../config/site'
import { createOrder, getEnrollments, payOrder } from '../lib/api'
import { useAuth } from '../lib/auth'

const formatMoney = (amount, currency) =>
  currency === 'AED' ? 'AED ' + amount.toLocaleString('en-AE') : '₹' + amount.toLocaleString('en-IN')

// Result dialog header: a strip of board tiles, as if the order ticket came back from the desk.
function ResultStrip({ text, tone }) {
  return (
    <div className="flex justify-center bg-board px-6 py-5 [--flap-w:1.35rem]" aria-hidden="true">
      <FlapText text={text} length={text.length} tone={tone} />
    </div>
  )
}

export default function Checkout() {
  usePageTitle('Payment')
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

  if (!program) return <Navigate to="/programs" replace />
  const amount = currency === 'AED' ? program.priceAed : program.price
  const walletLabel = currency === 'INR' ? 'UPI' : 'Apple Pay'

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
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="wrap grid-12 gap-y-12">
        <div className="col-span-4 sm:col-span-8 lg:col-span-6">
          <h1 className="text-[3.2rem] sm:text-5xl">Payment</h1>
          <p className="mt-4 max-w-[30rem] text-lg text-ink-soft">Your seat is confirmed as soon as the payment goes through.</p>

          {alreadyEnrolled && (
            <p className="mt-6 border-l-4 border-signal bg-brand-soft px-4 py-3 text-sm">
              You are already enrolled in {program.title}. <Link to="/portal" className="link-line">Go to your portal</Link>
            </p>
          )}

          <form onSubmit={pay} className="mt-10 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <fieldset>
                <legend className="label">Currency</legend>
                <Segmented name="Currency" options={[['INR', 'Rupees'], ['AED', 'Dirhams']]} value={currency} onChange={setCurrency} />
              </fieldset>
              <fieldset>
                <legend className="label">Pay with</legend>
                <Segmented name="Payment method" options={[['card', 'Card'], ['wallet', walletLabel]]} value={method} onChange={setMethod} />
              </fieldset>
            </div>

            {method === 'card' ? (
              <>
                <div>
                  <label className="label" htmlFor="cc">Card number</label>
                  <input id="cc" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className="field tabular-nums" value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} />
                </div>
                <div className="grid grid-cols-2 gap-5">
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
              <p className="bg-card px-4 py-3 text-sm text-ink-soft">You will confirm with Apple Pay on the next screen.</p>
            )}

            <button className="btn-brand w-full py-4 text-base" disabled={busy || alreadyEnrolled}>
              {busy ? 'Processing payment…' : `Pay ${formatMoney(amount, currency)}`}
            </button>
            <p className="text-xs text-ink-soft">
              Demo mode: no real money moves. Any card works; a card ending in 0002 shows the failed payment screen.
            </p>
          </form>
        </div>

        <aside className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">
          <Ticket className="lg:sticky lg:top-24 lg:mt-36">
            <h2 className="font-cond text-lg font-bold">Your order</h2>
            <p className="mt-5 font-display text-[2.6rem] leading-none font-extrabold">{program.title}</p>
            <p className="mt-2 text-sm text-white/60">{program.duration}, {(user.mode || 'Online') === 'Online' ? 'online' : `in ${user.mode}`}</p>
            <dl className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm">
              <div className="flex justify-between"><dt className="text-white/60">Course fee</dt><dd className="tabular-nums">{formatMoney(amount, currency)}</dd></div>
              <div className="flex justify-between"><dt className="text-white/60">Taxes</dt><dd>Included</dd></div>
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-white/15 pt-5">
              <span className="text-sm text-white/60">Total</span>
              <span className="font-display text-[2.6rem] leading-none font-extrabold text-signal tabular-nums">{formatMoney(amount, currency)}</span>
            </div>
          </Ticket>
        </aside>
      </div>

      <Modal open={!!result} onClose={() => setResult(null)} labelledBy="pay-result">
        {result?.ok ? (
          <>
            <ResultStrip text="Paid" tone="flap-amber" />
            <div className="p-7">
              <h2 id="pay-result" className="text-[2.6rem]">Payment successful</h2>
              <p className="mt-3 text-ink-soft">You are enrolled in {program.title}. A receipt has been sent to {user.email}.</p>
              <p className="mt-2 text-xs text-ink-soft">Order {result.order.id}</p>
              <button className="btn-brand mt-7 w-full py-3.5" onClick={() => navigate(`/portal/course/${program.id}`)}>Start learning</button>
            </div>
          </>
        ) : (
          <>
            <ResultStrip text="Declined" />
            <div className="p-7">
              <h2 id="pay-result" className="text-[2.6rem]">Payment failed</h2>
              <p className="mt-3 text-ink-soft">{result?.message}</p>
              <div className="mt-7 flex flex-col gap-3">
                <button className="btn-primary w-full py-3.5" onClick={() => setResult(null)}>Try again</button>
                <Link to="/portal/support" className="btn-ghost w-full py-3.5">Contact support</Link>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
