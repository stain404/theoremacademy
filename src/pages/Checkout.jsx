import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { FlapText } from '../components/Board'
import Modal from '../components/Modal'
import { usePageTitle } from '../components/sections'
import { Segmented, Ticket } from '../components/ui'
import { bundlePackage, programs } from '../config/site'
import { createOrder, getEnrollments, payOrder } from '../lib/api'
import { useAuth } from '../lib/auth'

const ALL_OFFERINGS = [...programs, bundlePackage]

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
  const program = ALL_OFFERINGS.find((p) => p.id === programId)
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
    <section className="py-8 sm:py-12 lg:py-14">
      <div className="wrap grid-12 gap-8 lg:gap-10">
        <div className="col-span-4 sm:col-span-8 lg:col-span-7">
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink leading-tight">Payment</h1>
          <p className="mt-1.5 max-w-[30rem] text-sm text-ink-soft leading-relaxed">Your seat is confirmed as soon as the payment goes through.</p>

          {alreadyEnrolled && (
            <p className="mt-4 border-l-4 border-brand bg-brand-soft px-4 py-3 text-sm text-ink rounded-r-lg">
              You are already enrolled in {program.title}. <Link to="/portal" className="link-line font-bold text-brand">Go to your portal</Link>
            </p>
          )}

          <form onSubmit={pay} className="mt-6 space-y-5 card-rich text-ink p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <fieldset>
                <legend className="label text-xs font-bold text-ink mb-1.5">Currency</legend>
                <Segmented name="Currency" options={[['INR', '₹ INR (India)'], ['AED', 'AED (Dubai)']]} value={currency} onChange={setCurrency} />
              </fieldset>
              <fieldset>
                <legend className="label text-xs font-bold text-ink mb-1.5">Pay with</legend>
                <Segmented name="Payment method" options={[['card', 'Card'], ['wallet', walletLabel]]} value={method} onChange={setMethod} />
              </fieldset>
            </div>

            {method === 'card' ? (
              <>
                <div>
                  <label className="label text-xs font-bold text-ink" htmlFor="cc">Card number</label>
                  <input id="cc" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" className="field py-2 text-sm tabular-nums" value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value.replace(/[^\d]/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ') })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs font-bold text-ink" htmlFor="exp">Expiry</label>
                    <input id="exp" required placeholder="MM/YY" autoComplete="cc-exp" className="field py-2 text-sm" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value.slice(0, 5) })} />
                  </div>
                  <div>
                    <label className="label text-xs font-bold text-ink" htmlFor="cvc">CVC</label>
                    <input id="cvc" required inputMode="numeric" autoComplete="cc-csc" className="field py-2 text-sm" value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 4) })} />
                  </div>
                </div>
                <div>
                  <label className="label text-xs font-bold text-ink" htmlFor="ccname">Name on card</label>
                  <input id="ccname" required autoComplete="cc-name" className="field py-2 text-sm" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
                </div>
              </>
            ) : currency === 'INR' ? (
              <div>
                <label className="label text-xs font-bold text-ink" htmlFor="upi">UPI ID</label>
                <input id="upi" required placeholder="name@bank" className="field py-2 text-sm" value={upi} onChange={(e) => setUpi(e.target.value)} />
              </div>
            ) : (
              <p className="bg-surface border border-line px-4 py-3 text-sm text-ink-soft rounded-lg">You will confirm with Apple Pay on the next screen.</p>
            )}

            <button className="btn-brand w-full py-2.5 text-sm font-bold" disabled={busy || alreadyEnrolled}>
              {busy ? 'Processing payment…' : `Pay ${formatMoney(amount, currency)}`}
            </button>
            <div className="pt-2.5 border-t border-line grid grid-cols-3 gap-2 text-center text-[0.68rem] text-ink-soft">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-brand text-xs"></span>
                <span>Encrypted payment</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-brand text-xs"></span>
                <span>7-day refund</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-brand text-xs"></span>
                <span>Receipt by email</span>
              </div>
            </div>
          </form>
        </div>

        <aside className="col-span-4 sm:col-span-8 lg:col-span-5">
          <Ticket className="lg:sticky lg:top-24 p-5 sm:p-6">
            <div className="flex items-center justify-between">
              {program.discountPercent && (
                <span className="badge-save">
                  Save {program.discountPercent}%
                </span>
              )}
            </div>
            <h2 className="mt-2 font-display text-xl sm:text-2xl font-semibold text-ink leading-tight">{program.title}</h2>
            <p className="mt-1 text-xs text-ink-soft">{program.duration}, {(user.mode || 'Online') === 'Online' ? 'online' : `in person, ${user.mode}`}</p>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-soft">Program fee</dt>
                <dd className="tabular-nums font-semibold text-ink">
                  {program.originalPrice ? (
                    <span className="line-through text-ink-soft mr-2">
                      {formatMoney(currency === 'AED' ? program.originalPriceAed : program.originalPrice, currency)}
                    </span>
                  ) : null}
                  {formatMoney(amount, currency)}
                </dd>
              </div>
              {program.discountPercent && (
                <div className="flex justify-between text-brand font-semibold">
                  <dt>Bundle discount ({program.discountPercent}%)</dt>
                  <dd className="tabular-nums">
                    - {formatMoney(currency === 'AED' ? program.savingsAed : program.savingsInr, currency)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between"><dt className="text-ink-soft">Taxes and certificate</dt><dd className="font-semibold text-ink">Included</dd></div>
            </dl>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
              <span className="text-xs text-ink-soft">Total</span>
              <span className="font-display text-2xl sm:text-3xl leading-none font-semibold text-ink tabular-nums">{formatMoney(amount, currency)}</span>
            </div>
          </Ticket>
        </aside>
      </div>

      <Modal open={!!result} onClose={() => setResult(null)} labelledBy="pay-result">
        {result?.ok ? (
          <>
            <ResultStrip text="Paid" tone="flap-amber" />
            <div className="p-7 text-ink">
              <h2 id="pay-result" className="font-display text-2xl sm:text-3xl font-semibold text-ink">Payment successful</h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">You are enrolled in {program.title}. A receipt has been sent to {user.email}.</p>
              <p className="mt-2 text-xs text-ink-soft">Order {result.order.id}</p>
              <button className="btn-brand mt-7 w-full py-3 text-sm font-bold" onClick={() => navigate(program.bundle ? '/portal' : `/portal/course/${program.id}`)}>Start learning</button>
            </div>
          </>
        ) : (
          <>
            <ResultStrip text="Declined" />
            <div className="p-7 text-ink">
              <h2 id="pay-result" className="font-display text-2xl sm:text-3xl font-semibold text-ink">Payment failed</h2>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">{result?.message}</p>
              <div className="mt-7 flex flex-col gap-3">
                <button className="btn-brand w-full py-3 text-sm font-bold" onClick={() => setResult(null)}>Try again</button>
                <Link to="/portal/support" className="btn-ghost w-full py-3 text-sm font-semibold text-center">Contact support</Link>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  )
}
