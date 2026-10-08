import { useState } from 'react'
import { Link } from 'react-router-dom'

/*
  Dubai Campus & Executive Trading Hub Showcase:
  Displays iconic, famous Dubai skyline visuals, Business Bay campus highlights,
  and interactive campus previews.
*/

const CAMPUSES = [
  {
    id: 'india',
    title: 'India Trading & Technology Lab',
    tag: 'India Hub',
    location: 'Metro Financial Hub, India',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=85',
    hours: 'Mon – Sat, 10:00 – 19:00 IST',
    perks: [
      'Physical classroom trading floor',
      'Indian Equity & Global Forex masterclasses',
      'Dedicated mentor workstations',
      'Peer trading circles & group review sessions',
    ],
    status: 'Classroom Lab Enrolling',
  },
  {
    id: 'dubai',
    title: 'Dubai Business Bay Campus',
    tag: 'UAE Flagship Campus',
    location: 'Business Bay, Dubai, UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85',
    hours: 'Sat – Thu, 10:00 – 19:00 GST',
    perks: [
      'In-person multi-monitor trading terminals',
      'Live market session execution with lead mentors',
      'Small cohorts capped at 15 traders',
      'Student trading lounge & peer networking',
    ],
    status: 'Next Cohort Enrolling',
  },
  {
    id: 'online',
    title: 'Live Interactive Online Cohort',
    tag: 'Live Global Zoom',
    location: 'Available Globally (Dubai & India Timings)',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=85',
    hours: 'Evening & Weekend Batches (GST / IST)',
    perks: [
      'Live interactive screen-sharing & chart markups',
      'Ask questions directly to mentors in real time',
      '24/7 session recordings in your student portal',
      'Weekly 1-on-1 mentor trade reviews',
    ],
    status: 'Online Batch Enrolling',
  },
]

export default function DubaiCampusShowcase({ activeId = 'india', onSelect }) {
  const [localId, setLocalId] = useState('india')
  const currentId = activeId || localId
  const handleSelect = (id) => {
    setLocalId(id)
    if (onSelect) onSelect(id)
  }

  const activeCampus = CAMPUSES.find((c) => c.id === currentId) || CAMPUSES[0]

  return (
    <div className="relative">
      {/* Main Crisp Showcase Card */}
      <div className="relative rounded-2xl border border-signal/30 bg-[#101016]/95 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Campus Segmented Switcher */}
        <div className="border-b border-white/10 bg-black/60 p-2 sm:p-2.5">
          <div className="grid grid-cols-3 gap-1.5 w-full">
            {CAMPUSES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelect(c.id)}
                className={`rounded-lg py-2 px-1 sm:px-2 text-center text-xs font-bold transition-all ${
                  currentId === c.id
                    ? 'bg-signal text-black font-extrabold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {c.id === 'dubai' && '🇦🇪 Dubai Campus'}
                {c.id === 'online' && '🌐 Live Online'}
                {c.id === 'india' && '🇮🇳 India Lab'}
              </button>
            ))}
          </div>
        </div>

        {/* High-Definition Photographic Showcase Window */}
        <div className="relative h-52 sm:h-60 w-full overflow-hidden">
          <img
            src={activeCampus.image}
            alt={activeCampus.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
            loading="eager"
          />
          {/* Subtle Contrast Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#101016] via-[#101016]/30 to-black/40" />

          {/* Top Overlays: Location & Enrolling Badge */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-semibold text-white/95 backdrop-blur-md">
              📍 {activeCampus.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-bull/25 border border-bull/40 px-2.5 py-1 text-xs font-bold text-bull backdrop-blur-md">
              <span className="size-1.5 rounded-full bg-bull animate-pulse" />
              <span>{activeCampus.status}</span>
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <span className="badge-signal text-xs font-bold uppercase tracking-wider py-0.5 px-2">
              {activeCampus.tag}
            </span>
            <h3 className="mt-1.5 font-display text-xl sm:text-2xl font-extrabold text-white leading-tight drop-shadow-md min-h-[2.8rem] sm:min-h-[3.2rem] flex items-center">
              {activeCampus.title}
            </h3>
          </div>
        </div>

        {/* Structured Campus Features List */}
        <div className="p-4 sm:p-5 space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/90">
            {activeCampus.perks.map((perk) => (
              <div
                key={perk}
                className="flex items-start gap-2 rounded-lg bg-white/5 p-2.5 border border-white/5 min-h-[56px] sm:min-h-[60px]"
              >
                <span className="text-signal font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-snug line-clamp-2">{perk}</span>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3.5 text-xs">
            <span className="text-white/60 font-medium">🕒 {activeCampus.hours}</span>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 font-bold text-signal hover:underline"
            >
              <span>Schedule Campus Visit</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
