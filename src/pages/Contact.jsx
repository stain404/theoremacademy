import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FlapText, localTime, useNow } from '../components/Board'
import { PageHeader, usePageTitle } from '../components/sections'
import { bundlePackage, locations, programs, site } from '../config/site'
import { createEnquiry } from '../lib/api'

const TIMEZONES = { Dubai: 'Asia/Dubai', India: 'Asia/Kolkata' }

// Links into this form can arrive with ?program=, ?package=all-programs-bundle, or
// ?ebook=<id> (see the program cards, the bundle banner, and the Knowledge Toolkit page).
// This turns whichever one is present into a sensible starting program choice and message.
function initialForm(params) {
  const ebook = params.get('ebook')
  if (ebook) {
    return { name: '', contact: '', program: 'not-sure', location: 'Online', message: `I'd like to receive the free e-book: ${ebook.replace(/-/g, ' ')}.` }
  }
  const program = params.get('package') === bundlePackage.id ? bundlePackage.id : params.get('program') || 'not-sure'
  return { name: '', contact: '', program, location: 'Online', message: '' }
}

function EnquiryForm() {
  const [params] = useSearchParams()
  const [form, setForm] = useState(() => initialForm(params))
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
      <div role="status" className="rounded-xl border border-white/10 bg-[#1a1a20] text-white p-6 sm:p-8">
        <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">Confirmation</span>
        <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-white">Enquiry sent successfully.</h2>
        <p className="mt-2 max-w-[34rem] text-xs sm:text-sm text-white/70 leading-relaxed">
          An admissions advisor will contact you at <strong className="text-white">{form.contact}</strong> within one working day. If urgent, message us directly on WhatsApp at {site.whatsapp}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card-rich text-white p-5 sm:p-6 space-y-4">
      <div>
        <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">Admissions Desk</span>
        <h2 className="mt-1.5 font-display text-2xl sm:text-3xl font-extrabold text-white">Send an enquiry</h2>
        <p className="mt-1 text-xs sm:text-sm text-white/70">Tell us about your background and an advisor will recommend the ideal batch and market.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label text-xs font-bold text-white/90" htmlFor="name">Your name</label>
          <input id="name" required autoComplete="name" className="field py-2 text-xs sm:text-sm" value={form.name} onChange={set('name')} />
        </div>
        <div>
          <label className="label text-xs font-bold text-white/90" htmlFor="contact">WhatsApp number or email</label>
          <input id="contact" required className="field py-2 text-xs sm:text-sm" value={form.contact} onChange={set('contact')} />
        </div>
        <div>
          <label className="label text-xs font-bold text-white/90" htmlFor="program">Program</label>
          <select id="program" className="field py-2 text-xs sm:text-sm" value={form.program} onChange={set('program')}>
            <option value="not-sure">Not sure yet</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
            <option value={bundlePackage.id}>{bundlePackage.title} (all 4)</option>
          </select>
        </div>
        <div>
          <label className="label text-xs font-bold text-white/90" htmlFor="location">Where would you study?</label>
          <select id="location" className="field py-2 text-xs sm:text-sm" value={form.location} onChange={set('location')}>
            <option>Online (Live Zoom)</option>
            <option>Dubai Campus (Business Bay)</option>
            <option>India Campus</option>
          </select>
        </div>
      </div>
      <div>
        <label className="label text-xs font-bold text-white/90" htmlFor="message">Trading experience & goals <span className="font-normal text-white/50">(optional)</span></label>
        <textarea id="message" rows={3} className="field py-2 text-xs sm:text-sm" value={form.message} onChange={set('message')} />
      </div>
      <button className="btn-brand py-2.5 px-5 text-xs sm:text-sm font-bold shadow-md" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending enquiry…' : 'Submit Enquiry'}
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

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="wrap grid gap-4 sm:grid-cols-3 sm:gap-5">
          {locations.map((l) => (
            <div key={l.city} className="card-hover-glow panel p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">Campus</span>
                  <h2 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-white">{l.city}</h2>
                </div>
                {TIMEZONES[l.city] && (
                  <span className="[--flap-w:0.95rem]">
                    <span className="sr-only">Local time {localTime(now, TIMEZONES[l.city])}</span>
                    <FlapText text={localTime(now, TIMEZONES[l.city])} length={5} />
                  </span>
                )}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-white/70">{l.address}</p>
              <p className="mt-2 text-[0.7rem] font-semibold text-white/50">{l.hours}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-10 sm:pb-14 lg:pb-16">
        <div className="wrap grid-12 gap-6 lg:gap-8 items-start">
          <div className="col-span-4 sm:col-span-8 lg:col-span-7">
            <EnquiryForm />
          </div>
          <aside className="col-span-4 sm:col-span-8 lg:col-span-5">
            <div className="panel rounded-xl border border-white/10 bg-[#1a1a20] text-white p-5 sm:p-6 shadow-sm">
              <span className="badge-signal text-[0.65rem] font-bold uppercase tracking-wider py-0.5 px-2">Direct Contact</span>
              <h2 className="mt-1.5 font-display text-lg sm:text-xl font-extrabold text-white">Reach admissions directly</h2>
              <dl className="mt-4 space-y-3.5 text-xs sm:text-sm">
                <div className="border-b border-white/10 pb-3">
                  <dt className="text-xs font-bold text-white/60 uppercase tracking-wider">WhatsApp (Instant Desk)</dt>
                  <dd className="mt-0.5"><a href={site.whatsappLink} className="link-line font-bold text-signal">{site.whatsapp}</a></dd>
                </div>
                <div className="border-b border-white/10 pb-3">
                  <dt className="text-xs font-bold text-white/60 uppercase tracking-wider">Phone Support</dt>
                  <dd className="mt-0.5 font-semibold text-white">{site.phone}</dd>
                </div>
                <div>
                  <dt className="text-xs font-bold text-white/60 uppercase tracking-wider">Admissions Email</dt>
                  <dd className="mt-0.5"><a href={`mailto:${site.email}`} className="link-line text-white hover:text-signal">{site.email}</a></dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
