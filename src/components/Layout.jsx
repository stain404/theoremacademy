import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { bundlePackage, locations, programs, site } from '../config/site'
import { useAuth } from '../lib/auth'
import TheoremIntroGate from './TheoremIntroGate'
import { ScrollProgressBar } from './ui'

// Wordmark: the full Theorem logo lockup (mark + name + tagline) as one image.
export function Wordmark({ className = '', onClick }) {
  return (
    <Link to="/" onClick={onClick} className={`flex items-center ${className}`}>
      <img src="/theorem-logo.png" alt={site.name} className="mark-in h-9 w-auto object-contain" />
    </Link>
  )
}

const NAV_LINKS = [
  ['About', '/about'],
  ['Our Team', '/mentors'],
  ['Contact', '/contact'],
]

// Programs grouped by market for the Courses mega-menu — each market shows its
// Basic / Intermediate / Advanced tiers together.
const MARKETS = ['Forex', 'Crypto', 'Equity']
const programsByMarket = (list) => MARKETS.map((market) => [market, list.filter((p) => p.market === market)])

// Current page: an amber bar along the bottom edge of the header, like a selected tab.
const desktopLink = ({ isActive }) =>
  `relative flex h-full items-center transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:transition-transform after:duration-300 after:ease-out ${
    isActive
      ? 'text-white font-bold after:scale-x-100 after:bg-signal'
      : 'text-white/75 hover:text-signal after:scale-x-0 after:bg-signal/50 hover:after:scale-x-100'
  }`

// Pages where the sticky mobile call-to-action makes sense (not forms, not the portal).
const MARKETING = /^\/($|programs|technology|tools|about|mentors|contact)/

/*
  Mobile action bar: once the visitor has scrolled past the first screen, Apply and
  WhatsApp stay within thumb reach. Hidden on desktop, where the header CTA is always visible.
*/
function MobileCtaBar() {
  const { pathname } = useLocation()
  const [shown, setShown] = useState(false)
  const enabled = MARKETING.test(pathname)

  useEffect(() => {
    if (!enabled) return
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div
        className={`cta-bar mobile-cta-dock fixed inset-x-0 bottom-0 z-30 w-full border-t border-board-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden ${
          shown ? 'is-shown' : ''
        }`}
        aria-hidden={!shown}
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-3">
          <Link
            to="/contact"
            tabIndex={shown ? 0 : -1}
            className="btn btn-brand flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider text-ink shadow-md"
          >
            Contact us
          </Link>
          <a
            href={site.whatsappLink}
            tabIndex={shown ? 0 : -1}
            className="btn btn-outline-light flex-1 py-3 text-center text-xs font-semibold text-white"
          >
            WhatsApp us
          </a>
        </div>
      </div>
      {/* keeps the footer's last lines clear of the bar */}
      <div className="h-20 w-full bg-board lg:hidden" aria-hidden="true" />
    </>
  )
}

/*
  Desktop Concierge Pill: A discreet floating badge for instant Dubai & India admissions chat.
*/
function DesktopConciergePill() {
  const { pathname } = useLocation()
  const enabled = MARKETING.test(pathname)
  if (!enabled) return null

  return (
    <aside aria-label="Admissions Concierge" className="fixed bottom-6 right-6 z-40 hidden lg:block">
      <a
        href={site.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2.5 rounded-full border border-signal/40 bg-[#0d0d12]/90 px-4 py-2 text-xs font-bold text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-signal"
      >
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-signal" />
        </span>
        <span>Admissions Desk • Dubai & India</span>
        <span className="rounded bg-signal/20 px-1.5 py-0.5 text-[0.65rem] font-bold text-signal">Online</span>
      </a>
    </aside>
  )
}

export function Nav({ isHidden = false, animateIn = false }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(true)
  const [mobileTechOpen, setMobileTechOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  if (isHidden) return null

  return (
    <header className={`site-header sticky top-0 z-50 border-b border-white/10 text-white shadow-md bg-[#09090b]/95 backdrop-blur-md ${animateIn ? 'nav-entrance' : ''}`}>
      <div className="wrap flex h-16 items-center justify-between">
        <div className={animateIn ? 'nav-item-animated' : ''} style={animateIn ? { animationDelay: '120ms' } : undefined}>
          <Wordmark onClick={close} />
        </div>
        
        {/* Desktop Navigation */}
        <nav aria-label="Main" className="hidden h-full items-stretch gap-7 text-xs sm:text-sm font-semibold lg:flex">
          
          {/* 1. Courses Dropdown */}
          <div
            className={`relative group flex items-center h-full ${animateIn ? 'nav-item-animated' : ''}`}
            style={animateIn ? { animationDelay: '200ms' } : undefined}
          >
            <NavLink
              to="/programs"
              className={({ isActive }) =>
                `relative flex h-full items-center gap-1.5 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:transition-transform after:duration-300 after:ease-out ${
                  isActive
                    ? 'text-white font-bold after:scale-x-100 after:bg-signal'
                    : 'text-white/75 hover:text-signal after:scale-x-0 after:bg-signal/50 hover:after:scale-x-100'
                }`
              }
            >
              <span>Courses</span>
              <svg className="size-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </NavLink>

            {/* Courses Dropdown Menu: one column per market, Basic / Intermediate / Advanced */}
            <div className="absolute top-full left-0 w-[46rem] rounded-2xl bg-[#121218] border border-white/15 p-4 shadow-2xl backdrop-blur-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="grid grid-cols-3 gap-4">
                {programsByMarket(programs).map(([market, list]) => (
                  <div key={market}>
                    <div className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50 px-2.5 py-1.5 border-b border-white/10 mb-1.5">
                      {market}
                    </div>
                    <div className="space-y-1">
                      {list.map((p) => (
                        <Link
                          key={p.id}
                          to={`/programs/${p.id}`}
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-white/5 hover:border-signal/30 border border-transparent transition-all group/item"
                        >
                          <span className="font-bold text-xs text-white group-hover/item:text-signal transition-colors">{p.level}</span>
                          {p.comingSoon && <span className="text-[0.62rem] text-white/45">Coming soon</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 px-2.5">
                <Link
                  to="/programs"
                  className="flex items-center justify-between text-xs font-bold text-signal hover:underline py-1"
                >
                  <span>Learn all programs — save {bundlePackage.discountPercent}%</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. Technology Dropdown */}
          <div
            className={`relative group flex items-center h-full ${animateIn ? 'nav-item-animated' : ''}`}
            style={animateIn ? { animationDelay: '270ms' } : undefined}
          >
            <NavLink
              to="/technology"
              className={({ isActive }) =>
                `relative flex h-full items-center gap-1.5 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:origin-left after:transition-transform after:duration-300 after:ease-out ${
                  isActive
                    ? 'text-white font-bold after:scale-x-100 after:bg-signal'
                    : 'text-white/75 hover:text-signal after:scale-x-0 after:bg-signal/50 hover:after:scale-x-100'
                }`
              }
            >
              <span>Knowledge Toolkit</span>
              <svg className="size-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-70" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </NavLink>

            {/* Technology Dropdown Menu */}
            <div className="absolute top-full left-0 w-72 rounded-2xl bg-[#121218] border border-white/15 p-3 shadow-2xl backdrop-blur-2xl opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
              <div className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50 px-3 py-1.5 border-b border-white/10 mb-1.5">
                Lab Infrastructure & Software
              </div>
              <div className="space-y-1">
                <Link
                  to="/technology/tools"
                  className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 hover:border-signal/30 border border-transparent transition-all group/item"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚡</span>
                    <span className="font-bold text-xs text-white group-hover/item:text-signal transition-colors">Tools & Software</span>
                  </div>
                  <span className="text-[0.72rem] text-white/60 mt-0.5">Algo risk calculation, order flow DOM & footprint charts</span>
                </Link>

                <Link
                  to="/technology"
                  className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 hover:border-signal/30 border border-transparent transition-all group/item"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🖥️</span>
                    <span className="font-bold text-xs text-white group-hover/item:text-signal transition-colors">Technology Overview</span>
                  </div>
                  <span className="text-[0.72rem] text-white/60 mt-0.5">Multi-monitor trading desks & low-latency feeds</span>
                </Link>

                <Link
                  to="/technology#ebooks"
                  className="flex flex-col p-2.5 rounded-xl hover:bg-white/5 hover:border-signal/30 border border-transparent transition-all group/item"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">📘</span>
                    <span className="font-bold text-xs text-white group-hover/item:text-signal transition-colors">Free E-books</span>
                  </div>
                  <span className="text-[0.72rem] text-white/60 mt-0.5">Short guides on risk, safety and journaling</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Standard Navigation Links */}
          {NAV_LINKS.map(([label, to], idx) => (
            <div
              key={to}
              className={`h-full flex items-center ${animateIn ? 'nav-item-animated' : ''}`}
              style={animateIn ? { animationDelay: `${340 + idx * 70}ms` } : undefined}
            >
              <NavLink to={to} className={desktopLink}>{label}</NavLink>
            </div>
          ))}
        </nav>

        {/* Right CTA Area */}
        <div
          className={`hidden items-center gap-4 text-xs sm:text-sm lg:flex ${animateIn ? 'nav-item-animated' : ''}`}
          style={animateIn ? { animationDelay: '550ms' } : undefined}
        >
          <Link to={user ? '/portal' : '/login'} className="text-xs sm:text-sm font-semibold text-white/80 transition-colors hover:text-signal">
            {user ? 'My portal' : 'Log in'}
          </Link>
          <Link to="/contact" className="btn-brand shimmer-button rounded-lg px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink">
            Contact us
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-signal lg:hidden ${animateIn ? 'nav-item-animated' : ''}`}
          style={animateIn ? { animationDelay: '200ms' } : undefined}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="mobile-nav-drawer fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col text-white px-6 pt-4 pb-8 sm:px-8 overflow-y-auto bg-[#0a0a0f] lg:hidden">
          <div className="space-y-4">
            
            {/* Mobile Courses Accordion */}
            <div className="border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
                className="flex w-full items-center justify-between py-2 font-display text-2xl font-extrabold text-white"
              >
                <span>Courses</span>
                <span className="text-sm text-signal">{mobileCoursesOpen ? '▲' : '▼'}</span>
              </button>
              {mobileCoursesOpen && (
                <div className="mt-2 space-y-4 pl-3 border-l border-white/10">
                  {programsByMarket(programs).map(([market, list]) => (
                    <div key={market}>
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-white/50 mb-1">{market}</p>
                      {list.map((p) => (
                        <Link
                          key={p.id}
                          to={`/programs/${p.id}`}
                          onClick={close}
                          className="flex items-center justify-between gap-2 py-1.5 text-sm font-semibold text-white/80 hover:text-signal"
                        >
                          <span>{p.level}</span>
                          {p.comingSoon && <span className="text-[0.65rem] font-normal text-white/40">Coming soon</span>}
                        </Link>
                      ))}
                    </div>
                  ))}
                  <Link
                    to="/programs"
                    onClick={close}
                    className="block pt-1 text-xs font-bold text-signal"
                  >
                    Learn all programs — save {bundlePackage.discountPercent}% →
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Knowledge Toolkit Accordion */}
            <div className="border-b border-white/10 pb-3">
              <button
                type="button"
                onClick={() => setMobileTechOpen(!mobileTechOpen)}
                className="flex w-full items-center justify-between py-2 font-display text-2xl font-extrabold text-white"
              >
                <span>Knowledge Toolkit</span>
                <span className="text-sm text-signal">{mobileTechOpen ? '▲' : '▼'}</span>
              </button>
              {mobileTechOpen && (
                <div className="mt-2 space-y-2 pl-3 border-l border-white/10">
                  <Link
                    to="/technology/tools"
                    onClick={close}
                    className="block py-1.5 text-sm font-semibold text-white/80 hover:text-signal"
                  >
                    Tools & Algo Software
                  </Link>
                  <Link
                    to="/technology"
                    onClick={close}
                    className="block py-1.5 text-sm font-semibold text-white/80 hover:text-signal"
                  >
                    Trading Floor Overview
                  </Link>
                  <Link
                    to="/technology#ebooks"
                    onClick={close}
                    className="block py-1.5 text-sm font-semibold text-white/80 hover:text-signal"
                  >
                    Free E-books
                  </Link>
                </div>
              )}
            </div>

            {/* Other Links */}
            {NAV_LINKS.map(([label, to]) => (
              <div key={to} className="border-b border-white/10 pb-3">
                <NavLink
                  to={to}
                  onClick={close}
                  className="flex items-center justify-between py-2 font-display text-2xl font-extrabold text-white hover:text-signal transition-colors"
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-signal' : 'text-white'}>{label}</span>
                      {isActive && <span className="size-2 rounded-full bg-signal" aria-label="(current page)" />}
                    </>
                  )}
                </NavLink>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-6 flex flex-col gap-3">
            <Link to="/contact" onClick={close} className="btn btn-brand shimmer-button py-3 text-center text-xs font-bold uppercase tracking-wider text-ink shadow-lg">Contact us</Link>
            <Link to={user ? '/portal' : '/login'} onClick={close} className="btn btn-outline-light py-3 text-center text-xs font-semibold text-white">{user ? 'My portal' : 'Log in'}</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

// Simple monochrome icons, inline so no icon package is needed. href is set per social
// entry in config/site.js — update the placeholder "#" links before launch.
const SOCIAL_ICON = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10.5 9.3v5.4l5-2.7-5-2.7Z" fill="currentColor" stroke="none" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.7 10.2v6.3M7.7 7.6v.01M11.3 16.5v-3.7c0-1.4.9-2.4 2.2-2.4 1.3 0 2 .9 2 2.4v3.7" />
    </svg>
  ),
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold text-white/50">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-board-line bg-board text-white">
      <div className="wrap grid-12 gap-y-12 py-16 lg:py-20">
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <Wordmark />
          <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-white/65">{site.description}</p>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Academy">
            <li><Link to="/programs" className="hover:text-signal">Courses</Link></li>
            <li><Link to="/technology" className="hover:text-signal">Knowledge Toolkit</Link></li>
            {NAV_LINKS.map(([label, to]) => <li key={to}><Link to={to} className="hover:text-signal">{label}</Link></li>)}
            <li><Link to="/login" className="hover:text-signal">Student log in</Link></li>
          </FooterColumn>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Programs">
            {programsByMarket(programs).map(([market, list]) => (
              <li key={market}><Link to={`/programs/${list[0].id}`} className="hover:text-signal">{market}</Link></li>
            ))}
            <li><Link to="/programs" className="hover:text-signal">Compare all</Link></li>
          </FooterColumn>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Follow us">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="flex items-center gap-2 hover:text-signal">
                  <span className="size-4 shrink-0">{SOCIAL_ICON[s.label]}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        </div>
        <div className="col-span-4 sm:col-span-8 lg:col-span-3">
          <FooterColumn title="Contact">
            <li><a href={`mailto:${site.email}`} className="hover:text-signal">{site.email}</a></li>
            <li>{site.phone}</li>
            <li><a href={site.whatsappLink} className="hover:text-signal">WhatsApp {site.whatsapp}</a></li>
            {locations.filter((l) => l.city !== 'Online').map((l) => (
              <li key={l.city} className="pt-2 text-white/65"><span className="text-white">{l.city}</span><br />{l.address}</li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="wrap">
        <div className="border-t border-white/15 py-8 text-xs text-white/65">
          <p className="max-w-[60rem] leading-relaxed">
            Trading forex, crypto and equities carries a high risk of losing money. Our programs are education, not financial or investment advice, and past performance does not guarantee future results.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {site.name}</p>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {/* placeholder: legal pages still need to be written */}
              <li><a href="#" className="text-white/80 hover:text-white">Terms</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Privacy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white">Refund policy</a></li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('theorem_intro_seen_v4')
                    window.dispatchEvent(new CustomEvent('theorem_replay_intro'))
                  }}
                  className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2 py-0.5 text-[0.7rem] font-medium text-signal hover:bg-white/20 transition-colors"
                >
                  <span>✨ Replay Intro</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  const [forceIntro, setForceIntro] = useState(false)

  // Determine if intro needs to show
  const isIntroSeen = () => {
    try {
      return sessionStorage.getItem('theorem_intro_seen_v4') === 'true'
    } catch {
      return false
    }
  }

  const [introActive, setIntroActive] = useState(() => !isIntroSeen())
  const [navAnimatedIn, setNavAnimatedIn] = useState(false)

  useEffect(() => {
    const handleReplay = () => {
      setForceIntro(true)
      setIntroActive(true)
      setNavAnimatedIn(false)
    }
    window.addEventListener('theorem_replay_intro', handleReplay)
    return () => window.removeEventListener('theorem_replay_intro', handleReplay)
  }, [])

  // Triggered the instant user clicks "ENTER THEOREM" or Skip in intro gate
  const handleIntroEnter = () => {
    setIntroActive(false)
    setNavAnimatedIn(true)
    setTimeout(() => {
      setNavAnimatedIn(false)
    }, 1200)
  }

  const handleIntroClose = () => {
    setForceIntro(false)
    setIntroActive(false)
  }

  // portal sub-pages keep one key so the sidebar does not flash between them
  const pageKey = pathname.startsWith('/portal') ? '/portal' : pathname
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Luxury Scroll Progress Indicator */}
      {!introActive && <ScrollProgressBar />}

      {/* First-time Loading Cinematic Intro */}
      <TheoremIntroGate
        forceOpen={forceIntro}
        onEnter={handleIntroEnter}
        onClose={handleIntroClose}
      />

      {/* Navigation Bar: hidden while intro is active; slides in with option animation on enter */}
      <Nav isHidden={introActive} animateIn={navAnimatedIn} />

      <main key={pageKey} className="page-enter flex-1"><Outlet /></main>
      <Footer />
      {!introActive && <MobileCtaBar />}
      {!introActive && <DesktopConciergePill />}
    </div>
  )
}

export function PortalNavLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block whitespace-nowrap border-l-[3px] px-3 py-2 text-sm font-semibold ${isActive ? 'border-signal text-ink' : 'border-transparent text-ink-soft hover:text-ink'}`
      }
    >
      {children}
    </NavLink>
  )
}
