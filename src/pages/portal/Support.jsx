import { useEffect, useState } from 'react'
import { usePageTitle } from '../../components/sections'
import { site } from '../../config/site'
import { createTicket, getTickets } from '../../lib/api'
import { useAuth } from '../../lib/auth'

const FAQ = [
  ['I missed a live class. Can I watch it later?', 'Yes. Recordings appear in your course within 24 hours of each class.'],
  ['Can I switch from online to in-person classes?', 'Yes, if there is a seat in the Dubai or India batch. Send a ticket below with your preferred batch.'],
  ['How do I get my certificate?', 'Complete every lesson and pass every module quiz. The certificate then appears under Certificates, ready to download.'],
  ['What is your refund policy?', 'Full refund if you cancel within 7 days of enrolling and before attending more than two classes.'],
]

export default function Support() {
  usePageTitle('Help and support')
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [form, setForm] = useState({ topic: 'Course content', message: '' })
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(null)

  useEffect(() => { getTickets(user.id).then(setTickets) }, [user.id])

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    const t = await createTicket(user.id, form)
    setTickets([t, ...tickets])
    setSent(t.id)
    setForm({ ...form, message: '' })
    setBusy(false)
  }

  return (
    <div className="space-y-14">
      <section>
        <h1 className="text-[3.2rem] sm:text-5xl">Help and support</h1>
        <p className="mt-4 max-w-[36rem] text-lg text-ink-soft">
          The quickest answer is on WhatsApp at {site.whatsapp}. For anything else, send a ticket and a mentor replies within one working day.
        </p>
        <div className="mt-10 border-t-2 border-ink">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group border-b border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold marker:hidden">
                {q}
                <span className="grid size-6 shrink-0 place-items-center bg-ink text-sm leading-none text-paper transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="max-w-[40rem] pb-5 text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid gap-12 xl:grid-cols-2">
        <form onSubmit={submit} className="space-y-5">
          <h2 className="text-[2.4rem] sm:text-3xl">Send a ticket</h2>
          <div>
            <label className="label" htmlFor="topic">Topic</label>
            <select id="topic" className="field" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
              <option>Course content</option>
              <option>Payment or refund</option>
              <option>Change batch or location</option>
              <option>Certificate</option>
              <option>Login or account</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="msg">Message</label>
            <textarea id="msg" required rows={5} className="field" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          {sent && <p role="status" className="border-l-4 border-bull bg-bull/10 px-4 py-3 text-sm">Ticket {sent} sent. We will reply to {user.email}.</p>}
          <button className="btn-primary" disabled={busy}>{busy ? 'Sending ticket…' : 'Send ticket'}</button>
        </form>

        <div>
          <h2 className="text-[2.4rem] sm:text-3xl">Your tickets</h2>
          {tickets.length === 0 ? (
            <p className="mt-5 text-ink-soft">No tickets yet. Anything you send appears here with its status.</p>
          ) : (
            <ul className="mt-5 border-t-2 border-ink">
              {tickets.map((t) => (
                <li key={t.id} className="border-b border-line py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold">{t.topic}</span>
                    <span className="bg-signal px-2 py-0.5 text-xs font-semibold text-ink">{t.status}</span>
                  </div>
                  <p className="mt-1 text-xs text-ink-soft">Ticket {t.id}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{t.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
