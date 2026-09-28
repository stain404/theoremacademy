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
      <div role="status" className="border-t-2 border-ink pt-8">
        <h2 className="text-[2.75rem] sm:text-4xl">Enquiry sent.</h2>
        <p className="mt-5 max-w-[34rem] text-lg text-ink-soft">
          An advisor will contact you at {form.contact} within one working day. If it is urgent, message us on WhatsApp at {site.whatsapp}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-5 border-t-2 border-ink pt-8">
      <h2 className="text-[2.75rem] sm:text-4xl">Send an enquiry</h2>
      <p className="max-w-[34rem] text-ink-soft">Tell us a little about yourself and an advisor will recommend a program and a batch.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Your name</label>
          <input id="name" required autoComplete="name" className="field" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label" htmlFor="contact">WhatsApp number or email</label>
          <input id="contact" required className="field" value={form.contact} onChange={set('contact')} />
        </div>
        <div>
          <label className="label" htmlFor="program">Program</label>
          <select id="program" className="field" value={form.program} onChange={set('program')}>
            <option value="not-sure">Not sure yet</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="location">Where would you study?</label>
          <select id="location" className="field" value={form.location} onChange={set('location')}>
            <option>Online</option>
            <option>Dubai</option>
            <option>India</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Your trading experience and goals <span className="font-normal text-ink-soft">(optional)</span></label>
        <textarea id="message" rows={4} className="field" value={form.message} onChange={set('message')} />
      </div>
      <button className="btn-brand px-6 py-3.5" disabled={status === 'sending'}>{status === 'sending' ? 'Sending enquiry…' : 'Send enquiry'}</button>
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
        intro="Visit a classroom in Dubai or India, message us on WhatsApp, or send an enquiry. An advisor will help you choose a program and a batch."
      />

      <section className="py-14 sm:py-20">
        <div className="wrap grid gap-y-10 sm:grid-cols-3 sm:gap-x-8">
          {locations.map((l) => (
            <div key={l.city} className="border-t-2 border-ink pt-5">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[2.75rem]">{l.city}</h2>
                {TIMEZONES[l.city] && (
                  <span className="[--flap-w:1.05rem]">
                    <span className="sr-only">Local time {localTime(now, TIMEZONES[l.city])}</span>
                    <FlapText text={localTime(now, TIMEZONES[l.city])} length={5} />
                  </span>
                )}
              </div>
              <p className="mt-4 leading-relaxed">{l.address}</p>
              <p className="mt-2 text-sm text-ink-soft">{l.hours}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20 sm:pb-28 lg:pb-32">
        <div className="wrap grid-12 gap-y-14">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <EnquiryForm />
          </div>
          <aside className="col-span-4 sm:col-span-8 lg:col-span-4 lg:col-start-9">
            <div className="bg-card p-6 sm:p-8">
              <h2 className="font-cond text-xl font-bold">Contact us directly</h2>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-sm text-ink-soft">WhatsApp, quickest reply</dt>
                  <dd className="mt-0.5"><a href={site.whatsappLink} className="link-line">{site.whatsapp}</a></dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Phone</dt>
                  <dd className="mt-0.5 font-semibold">{site.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Email</dt>
                  <dd className="mt-0.5"><a href={`mailto:${site.email}`} className="link-line">{site.email}</a></dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
