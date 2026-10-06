import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FlapText, localTime, useNow } from '../components/Board'
import { PageHeader, usePageTitle } from '../components/sections'
import { locations, programs, site } from '../config/site'
import { createEnquiry } from '../lib/api'

const TIMEZONES = { Dubai: 'Asia/Dubai', India: 'Asia/Kolkata' }

function EnquiryForm() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({ name: '', contact: '', program: params.get('program') || 'not-sure', location: 'Online', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    await createEnquiry(form)
    setStatus('sent')
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-xl border border-line bg-surface text-ink p-6 sm:p-8">
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-ink">Enquiry sent.</h2>
        <p className="mt-2 max-w-[34rem] text-sm text-ink-soft leading-relaxed">
          An admissions advisor will contact you at <strong className="text-ink">{form.contact}</strong> within one working day. If urgent, message us directly on WhatsApp at {site.whatsapp}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card-rich text-ink p-5 sm:p-6 space-y-4">
      <div>
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-semibold text-ink">Send an enquiry</h2>
        <p className="mt-1 text-sm text-ink-soft">Tell us about your background and an advisor will recommend the program and a batch.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="name">Your name</label>
          <input id="name" required autoComplete="name" className="field py-2 text-sm" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="contact">WhatsApp number or email</label>
          <input id="contact" required className="field py-2 text-sm" value={form.contact} onChange={set('contact')} />
        </div>
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="program">Program</label>
          <select id="program" className="field py-2 text-sm" value={form.program} onChange={set('program')}>
            <option value="not-sure">Not sure yet</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label text-xs font-bold text-ink" htmlFor="location">Where would you study?</label>
          <select id="location" className="field py-2 text-sm" value={form.location} onChange={set('location')}>
            <option>Online (Live Zoom)</option>
            <option>Dubai Campus (Business Bay)</option>
            <option>India Campus</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label text-xs font-bold text-ink" htmlFor="message">Trading experience & goals <span className="font-normal text-ink-soft">(optional)</span></label>
        <textarea id="message" rows={3} className="field py-2 text-sm" value={form.message} onChange={set('message')} />
      </div>
      <button className="btn-brand py-2.5 px-5 text-sm font-bold" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending enquiry…' : 'Send enquiry'}
      </button>
    </form>
  )
}

export default function Contact() {
  usePageTitle('Contact')
  const now = useNow()
  return (
    <>
      <PageHeader
        title="Talk to an advisor before you enrol."
        intro="Visit our trading floor in Business Bay Dubai or India, message on WhatsApp, or send an enquiry. An advisor will guide your batch selection."
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="wrap grid-12 gap-6 lg:gap-8 items-start">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <EnquiryForm />
          </div>
          <aside className="col-span-4 sm:col-span-8 lg:col-span-5">
            <div className="panel rounded-xl border border-line bg-surface text-ink p-5 sm:p-6">
              <h2 className="mt-1.5 font-display text-lg sm:text-xl font-semibold text-ink">Reach admissions directly</h2>
              <dl className="mt-4 space-y-3.5 text-sm">
                <div className="border-b border-line pb-3">
                  <dt className="text-xs font-bold text-ink-soft">WhatsApp, quickest reply</dt>
                  <dd className="mt-0.5"><a href={site.whatsappLink} className="link-line font-bold text-brand">{site.whatsapp}</a></dd>
                </div>
                <div className="border-b border-line pb-3">
                  <dt className="text-xs font-bold text-ink-soft">Phone</dt>
                  <dd className="mt-0.5"><a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link-line">{site.phone}</a></dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-ink-soft">Email</dt>
                  <dd className="mt-0.5"><a href={`mailto:${site.email}`} className="link-line text-ink hover:text-brand">{site.email}</a></dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-card py-12 sm:py-16">
        <h2 className="wrap mb-6 text-2xl sm:text-3xl">Visit us, or join online</h2>
        <div className="wrap grid gap-4 sm:grid-cols-3 sm:gap-5">
          {locations.map((l) => (
            <div key={l.city} className="card-rich p-5 sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-2xl">{l.city}</h3>
                {TIMEZONES[l.city] && (
                  <span className="[--flap-w:0.95rem]">
                    <span className="sr-only">Local time {localTime(now, TIMEZONES[l.city])}</span>
                    <FlapText text={localTime(now, TIMEZONES[l.city])} length={5} />
                  </span>
                )}
              </div>
              <p className="mt-3 leading-relaxed">{l.address}</p>
              <p className="mt-1 text-sm text-ink-soft">{l.hours}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
