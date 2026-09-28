import { useEffect, useState } from 'react'
import { site } from '../../config/site'
import { createTicket, getTickets } from '../../lib/api'
import { useAuth } from '../../lib/auth'

const FAQ = [
  ['I missed a live class. Can I watch it later?', 'Yes. Recordings appear in your course within 24 hours of each class.'],
  ['Can I switch from online to in-person classes?', 'Yes, if there is a seat in the Dubai or India batch. Raise a ticket below with your preferred batch.'],
  ['How do I get my certificate?', 'Complete every lesson and pass every module quiz. The certificate then appears under Certificates, ready to download.'],
  ['What is your refund policy?', 'Full refund if you cancel within 7 days of enrolling and before attending more than two classes.'],
]

export default function Support() {
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
    <div className="space-y-12">
      <section>
        <h1 className="text-3xl font-bold">Help and support</h1>
        <p className="mt-2 text-ink-soft">
          Quickest answer: WhatsApp {site.whatsapp}. For anything else, send a ticket and a mentor replies within one working day.
        </p>
        <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                <span className="mr-2 inline-block text-brand transition-transform group-open:rotate-90" aria-hidden="true">›</span>{q}
              </summary>
              <p className="mt-2 pl-5 text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-4">
          <h2 className="text-xl font-bold">Send a ticket</h2>
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
          {sent && <p role="status" className="rounded-md bg-bull/10 px-3 py-2 text-sm">Ticket {sent} sent. We will reply to {user.email}.</p>}
          <button className="btn-primary" disabled={busy}>{busy ? 'Sending…' : 'Send ticket'}</button>
        </form>

        <div>
          <h2 className="text-xl font-bold">Your tickets</h2>
          {tickets.length === 0 ? (
            <p className="mt-4 text-ink-soft">No tickets yet. Anything you send appears here with its status.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {tickets.map((t) => (
                <li key={t.id} className="rounded-lg border border-line bg-card px-4 py-3">
                  <div className="flex justify-between gap-2 text-sm">
                    <span className="font-semibold">{t.id} · {t.topic}</span>
                    <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-semibold">{t.status}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">{t.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}
