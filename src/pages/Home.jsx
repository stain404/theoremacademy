import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import HeroVisualBackground from '../components/HeroVisualBackground'
import DubaiCampusShowcase from '../components/DubaiCampusShowcase'
import {
  Approach,
  FactsStrip,
  Faq,
  FinalCta,
  HybridExperience,
  Stories,
  usePageTitle,
} from '../components/sections'
import { ImageBlock, Section } from '../components/ui'
import { site, teachers } from '../config/site'

const SCENE_ROTATION = ['dubai', 'online', 'india']

function Hero() {
  const [activeScene, setActiveScene] = useState('dubai')

  // Auto-rotate background scenes every 5 seconds (Dubai -> Live Online -> India -> Dubai)
  useEffect(() => {
    const rotationTimer = setInterval(() => {
      setActiveScene((current) => {
        const nextIndex = (SCENE_ROTATION.indexOf(current) + 1) % SCENE_ROTATION.length
        return SCENE_ROTATION[nextIndex]
      })
    }, 5000)
    return () => clearInterval(rotationTimer)
  }, [])

  return (
    <section id="hero" className="relative min-h-[76vh] lg:min-h-[80vh] flex flex-col justify-start overflow-hidden bg-[#07070a] text-white border-b border-board-line">
      {/* 1. Atmospheric Ambient Background */}
      <HeroVisualBackground activeScene={activeScene} />

      <div className="wrap relative z-10 pt-6 sm:pt-8 lg:pt-10 pb-12 sm:pb-14 lg:pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Authoritative Value Proposition & Direct CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 self-start">
            
            {/* Campus Presence Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/40 bg-[#121218]/90 px-3.5 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-md shadow-sm">
                <span className="size-2 rounded-full bg-signal animate-pulse" />
                <span>🇦🇪 Dubai Campus • 🇮🇳 India Hub • 🌐 Live Online</span>
              </div>
            </div>

            {/* Main Headline */}
            <div className="space-y-3 sm:space-y-3.5">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-tight leading-[1.02]">
                <span className="text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.4)]">Master </span>
                <span className="gold-bright-text">Institutional Trading.</span>
              </h1>

              {/* Concise Asset Focus */}
              <div className="space-y-0.5 pt-0.5">
                <span className="text-sm sm:text-base font-semibold text-white/80 block">Learn</span>
                <p className="font-display text-xl sm:text-2xl lg:text-[1.85rem] font-extrabold tracking-wide text-signal drop-shadow-[0_0_16px_rgba(255,215,0,0.4)]">
                  Forex <span className="text-white/40 font-normal mx-1.5">|</span> Crypto <span className="text-white/40 font-normal mx-1.5">|</span> Equity
                </p>
              </div>
            </div>

            {/* Direct Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                to="/programs"
                className="btn-brand shimmer-button px-7 py-3.5 text-xs sm:text-sm font-bold shadow-[0_0_24px_rgba(255,215,0,0.35)]"
              >
                Explore Programs →
              </Link>
              <Link
                to="/contact"
                className="btn-outline-light px-6 py-3.5 text-xs sm:text-sm font-semibold backdrop-blur-md bg-white/5 hover:bg-white/10"
              >
                Book Advisor Call
              </Link>
            </div>

            {/* Clean Trust & Metric Strip */}
            <div className="pt-4 border-t border-white/10">
              <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text tabular-nums leading-none">
                    4.9 <span className="text-sm font-sans text-signal">★</span>
                  </div>
                  <div className="mt-1.5 text-xs text-white/70 font-medium leading-tight">
                    Verified Rating
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text tabular-nums leading-none">
                    1,850+
                  </div>
                  <div className="mt-1.5 text-xs text-white/70 font-medium leading-tight">
                    Students Enrolled
                  </div>
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text tabular-nums leading-none">
                    &lt;15
                  </div>
                  <div className="mt-1.5 text-xs text-white/70 font-medium leading-tight">
                    Traders / Cohort
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Campus Showcase Card */}
          <div className="lg:col-span-5 relative self-start">
            <DubaiCampusShowcase activeId={activeScene} onSelect={setActiveScene} />
          </div>

        </div>
      </div>
    </section>
  )
}

// Compact mentor preview cards for the homepage
function MentorsPreview() {
  return (
    <Section
      tight
      title="The mentors who guide your trades."
      intro="Each cohort is led by one dedicated mentor from day one to graduation. No recorded bots or revolving instructors."
      action={<Link to="/mentors" className="link-line">Meet full faculty →</Link>}
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        {teachers.map((t) => (
          <article key={t.name} className="card-hover-glow panel group text-white p-5 sm:p-6">
            <Link to={`/mentors#${t.name.toLowerCase()}`} className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,3fr)] items-center gap-4 sm:gap-5">
              <ImageBlock src={t.photo} alt={`Portrait of ${t.name}`} ratio="4/5" shotNote={`Portrait of ${t.name}`} />
              <div>
                <span className="badge-signal text-xs py-0.5 px-2.5 uppercase tracking-wider">{t.role}</span>
                <h3 className="mt-2.5 font-display text-2xl font-extrabold text-white transition-colors group-hover:text-signal sm:text-3xl leading-none">
                  {t.name}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-2">{t.focus}.</p>
                <div className="mt-3 text-xs sm:text-sm font-medium text-white/80">
                  Teaches: <span className="font-bold text-white">{t.teaches.join(' & ')}</span>
                </div>
                <span className="link-line mt-3.5 inline-block text-xs sm:text-sm font-bold text-signal">View Profile →</span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </Section>
  )
}

export default function Home() {
  usePageTitle(null)
  return (
    <>
      {/* 1. Dubai Executive Hero with Famous Skyline Visuals & Campus Showcase */}
      <Hero />

      {/* 2. Core Trust Stats Bar */}
      <FactsStrip />

      {/* 3. Why Theorem Institute: 3 Clear Pillars (Clean Fundfloat-style simplicity) */}
      <HybridExperience />

      {/* 4. The 4-Stage Teaching Method */}
      <Approach
        dark
        action={<Link to="/about" className="link-line text-white">Our teaching philosophy →</Link>}
      />

      {/* 6. Lead Mentors Spotlight */}
      <MentorsPreview />

      {/* 7. Verified Student Stories */}
      <Stories limit={1} />

      {/* 8. Frequently Asked Questions */}
      <Faq className="bg-card" />

      {/* 9. Closing Conversion Banner */}
      <FinalCta
        title="Start trading with a proven, reviewed plan."
        body="Tell us what you trade now, or start from scratch. Join our next cohort in Dubai, India, or live online."
      />
    </>
  )
}
