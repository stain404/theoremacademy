import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { locations, programs, site } from '../config/site'
import { useAuth } from '../lib/auth'
import { MarketDot } from './ui'

// Wordmark: a single marigold-on-ink tile as the mark, then the name.
export function Wordmark({ className = '', onClick, inverse = false }) {
  return (
    <Link to="/" onClick={onClick} className={`flex items-center gap-2.5 ${className}`}>
      <span className="flap flap-amber mark-in [--flap-w:1.25rem]" aria-hidden="true">T</span>
      <span className={`font-display text-[1.3rem] leading-none font-semibold tracking-tight ${inverse ? 'text-white' : 'text-ink'}`}>{site.name}</span>
    </Link>
  )
}

const NAV_LINKS = [
  ['About', '/about'],
  ['Mentors', '/mentors'],
  ['Contact', '/contact'],
]

const TECH_LINKS = [
  ['Tools and software', '/technology/tools', 'Risk calculator, order flow and footprint charts'],
  ['Classroom technology', '/technology', 'Multi-monitor desks and live data feeds'],
]

// Current page: ink text with a green underline. Others are soft until hovered.
const linkTone = (isActive) =>
  `relative flex h-full items-center gap-1 transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand after:transition-transform after:duration-300 after:origin-left ${
    isActive ? 'text-ink after:scale-x-100' : 'text-ink-soft hover:text-ink after:scale-x-0'
  }`

function Chevron() {
  return (
    <svg className="size-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}

// A dropdown that opens on hover and when anything inside it has keyboard focus.
function NavGroup({ label, to, children, width = 'w-80' }) {
  return (
    <div className="nav-group group relative flex h-full items-center">
      <NavLink to={to} className={({ isActive }) => linkTone(isActive)}>
        {label}
        <Chevron />
      </NavLink>
      <div className={`nav-menu absolute top-[calc(100%-0.5rem)] left-1/2 -translate-x-1/2 ${width} pt-3`}>
        <div className="rounded-[var(--radius-panel)] border border-line bg-surface p-2 shadow-[var(--shadow-lift)]">{children}</div>
      </div>
    </div>
  )
}

function MenuItem({ to, title, note, meta, market }) {
  return (
    <Link to={to} className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-card">
      <span className="flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-ink">{market && <MarketDot market={market} />}{title}</span>
        {meta && <span className="text-xs text-ink-soft">{meta}</span>}
      </span>
      {note && <span className="mt-0.5 block text-xs leading-snug text-ink-soft line-clamp-1">{note}</span>}
    </Link>
  )
}

// Pages where the sticky mobile call to action makes sense (not forms, not the portal).
const MARKETING = /^\/($|programs|technology|tools|about|mentors|contact)/

/*
  Mobile action bar: once the visitor has scrolled past the first screen, Apply and
  WhatsApp stay within thumb reach. Hidden on desktop, where the header CTA is always visible.
  Program pages have their own fee bar, and the contact page is itself the form, so the
  bar stays away from both.
*/
function MobileCtaBar() {
  const { pathname } = useLocation()
  const [shown, setShown] = useState(false)
  const enabled = MARKETING.test(pathname) && !/^\/(programs\/.+|contact)/.test(pathname)

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
      <div className={`cta-bar fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden ${shown ? 'is-shown' : ''}`} aria-hidden={!shown}>
        <div className="mx-auto flex max-w-md gap-3">
          <Link to="/register" tabIndex={shown ? 0 : -1} className="btn-brand flex-1">Apply now</Link>
          <a href={site.whatsappLink} tabIndex={shown ? 0 : -1} className="btn-ghost flex-1">WhatsApp us</a>
        </div>
      </div>
      {/* keeps the footer's last lines clear of the bar */}
      <div className="h-20 bg-board lg:hidden" aria-hidden="true" />
    </>
  )
}

// Desktop: a quiet WhatsApp shortcut, since most enquiries in the UAE and India start there.
function WhatsAppPill() {
  const { pathname } = useLocation()
  if (!MARKETING.test(pathname)) return null
  return (
    <a
      href={site.whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 bottom-6 z-40 hidden items-center gap-2.5 rounded-full border border-line bg-surface py-2.5 pr-4 pl-3.5 text-sm font-semibold text-ink shadow-[var(--shadow-lift)] transition-colors hover:border-line-strong lg:flex"
    >
      <span className="relative flex size-2" aria-hidden="true">
        <span className="absolute inline-flex size-full rounded-full bg-bull opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex size-2 rounded-full bg-bull" />
      </span>
      Chat with admissions
    </a>
  )
}

/*
  Light / dark switch. The theme is first set in index.html before paint (saved choice, else
  the system setting); this button flips it, remembers the choice, and follows the system
  setting live for visitors who have never chosen.
*/
const readTheme = () => (typeof document !== 'undefined' && document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

function applyTheme(theme, save) {
  const root = document.documentElement
  root.classList.add('theme-fade')
  root.dataset.theme = theme
  window.setTimeout(() => root.classList.remove('theme-fade'), 300)
  window.dispatchEvent(new Event('themechange'))
  if (save) {
    try { localStorage.setItem('theme', theme) } catch { /* private mode: the choice lasts for this visit */ }
  }
}

function ThemeToggle({ className = '' }) {
  const [theme, setTheme] = useState(readTheme)
  const dark = theme === 'dark'

  // every toggle on the page (desktop and mobile) shows the same state
  useEffect(() => {
    const sync = () => setTheme(readTheme())
    window.addEventListener('themechange', sync)
    return () => window.removeEventListener('themechange', sync)
  }, [])

  useEffect(() => {
    let saved = null
    try { saved = localStorage.getItem('theme') } catch { /* no storage */ }
    if (saved) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const follow = (e) => {
      try { if (localStorage.getItem('theme')) return } catch { /* no storage */ } // a choice made since wins
      applyTheme(e.matches ? 'dark' : 'light', false)
    }
    mq.addEventListener('change', follow)
    return () => mq.removeEventListener('change', follow)
  }, [])

  const toggle = () => {
    applyTheme(dark ? 'light' : 'dark', true)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className={`relative grid size-10 place-items-center overflow-hidden rounded-[var(--radius-ctl)] text-ink-soft transition-colors hover:bg-card hover:text-ink ${className}`}
    >
      {/* the two icons swap with a quarter turn, so the click visibly answers */}
      <svg viewBox="0 0 24 24" className={`absolute size-[18px] transition-[transform,opacity] duration-300 ${dark ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
      <svg viewBox="0 0 24 24" className={`absolute size-[18px] transition-[transform,opacity] duration-300 ${dark ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
      </svg>
    </button>
  )
}

export function Nav() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header sticky top-0 z-50 ${scrolled || open ? 'is-scrolled' : ''}`}>
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <Wordmark onClick={close} />

        <nav aria-label="Main" className="hidden h-full items-stretch gap-8 text-sm font-medium lg:flex">
          <NavGroup label="Courses" to="/programs">
            {programs.map((p) => (
              <MenuItem key={p.id} to={`/programs/${p.id}`} title={p.title} meta={p.duration} note={p.summary} market={p.market} />
            ))}
            <div className="mt-1 border-t border-line px-3 pt-2.5 pb-1.5">
              <Link to="/programs" className="link-line text-sm text-brand">Compare all programs</Link>
            </div>
          </NavGroup>
          <NavGroup label="Technology" to="/technology" width="w-72">
            {TECH_LINKS.map(([title, to, note]) => <MenuItem key={to} to={to} title={title} note={note} />)}
          </NavGroup>
          {NAV_LINKS.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => linkTone(isActive)}>{label}</NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 text-sm font-medium lg:flex">
          <ThemeToggle />
          <Link to={user ? '/portal' : '/login'} className="text-ink-soft transition-colors hover:text-ink">{user ? 'My portal' : 'Log in'}</Link>
          <Link to="/register" className="btn-brand py-2.5">Apply now</Link>
        </div>

        <div className="-mr-2 flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            className="grid size-10 place-items-center rounded-[var(--radius-ctl)] text-ink hover:bg-card"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" onClick={(e) => e.target.closest('a') && close()} className="page-enter fixed inset-x-0 top-16 bottom-0 z-50 flex flex-col overflow-y-auto bg-surface px-5 pt-2 pb-8 sm:px-8 lg:hidden">
          <p className="pt-4 pb-2 text-sm text-ink-soft">Courses</p>
          <ul className="border-b border-line pb-3">
            {programs.map((p) => (
              <li key={p.id}>
                <Link to={`/programs/${p.id}`} className="flex items-baseline justify-between py-2.5 text-lg font-semibold">
                  <span className="flex items-center gap-2.5"><MarketDot market={p.market} />{p.title}</span>
                  <span className="text-sm font-normal text-ink-soft">{p.duration}</span>
                </Link>
              </li>
            ))}
            <li><Link to="/programs" className="link-line mt-1 inline-block text-sm text-brand">Compare all programs</Link></li>
          </ul>
          <ul className="pt-2">
            {[['Technology', '/technology'], ...NAV_LINKS].map(([label, to]) => (
              <li key={to} className="border-b border-line">
                <NavLink to={to} className={({ isActive }) => `flex items-center justify-between py-3.5 text-lg font-semibold ${isActive ? 'text-brand' : 'text-ink'}`}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Link to="/register" className="btn-brand btn-lg">Apply now</Link>
            <Link to={user ? '/portal' : '/login'} className="btn-ghost btn-lg">{user ? 'My portal' : 'Log in'}</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-medium tracking-normal text-white/55">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

const footLink = 'text-white/85 transition-colors hover:text-white'

export function Footer() {
  return (
    <footer className="bg-board text-white">
      <div className="wrap grid-12 gap-y-12 py-16 lg:py-20">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <Wordmark inverse />
          <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-white/65">{site.description}</p>
          <Link to="/contact" className="btn-outline-light mt-7">Book an advisor call</Link>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Academy">
            <li><Link to="/programs" className={footLink}>Courses</Link></li>
            <li><Link to="/technology" className={footLink}>Technology</Link></li>
            {NAV_LINKS.map(([label, to]) => <li key={to}><Link to={to} className={footLink}>{label}</Link></li>)}
            <li><Link to="/login" className={footLink}>Student log in</Link></li>
          </FooterColumn>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Programs">
            {programs.map((p) => <li key={p.id}><Link to={`/programs/${p.id}`} className={footLink}>{p.title}</Link></li>)}
          </FooterColumn>
        </div>
        <div className="col-span-4 lg:col-span-4">
          <FooterColumn title="Contact">
            <li><a href={`mailto:${site.email}`} className={footLink}>{site.email}</a></li>
            <li><a href={`tel:${site.phone.replace(/\s/g, '')}`} className={footLink}>{site.phone}</a></li>
            <li><a href={site.whatsappLink} className={footLink}>WhatsApp {site.whatsapp}</a></li>
            {locations.filter((l) => l.city !== 'Online').map((l) => (
              <li key={l.city} className="pt-2 text-white/65"><span className="text-white">{l.city}</span><br />{l.address}</li>
            ))}
          </FooterColumn>
        </div>
      </div>

      <div className="wrap">
        <div className="border-t border-white/12 py-8 text-xs text-white/55">
          <p className="max-w-[60rem] leading-relaxed">
            Trading forex, crypto and equities carries a high risk of losing money. Our programs are education, not financial or investment advice, and past performance does not guarantee future results.
          </p>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} {site.name}</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {site.social.map((s) => <li key={s.label}><a href={s.href} className="hover:text-white">{s.label}</a></li>)}
              {/* placeholder: legal pages still need to be written */}
              <li><a href="#" className="hover:text-white">Terms</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Refund policy</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function SiteLayout() {
  const { pathname } = useLocation()
  // portal sub-pages keep one key so the sidebar does not flash between them
  const pageKey = pathname.startsWith('/portal') ? '/portal' : pathname
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main key={pageKey} className="page-enter flex-1"><Outlet /></main>
      <Footer />
      <MobileCtaBar />
      <WhatsAppPill />
    </div>
  )
}

export function PortalNavLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block whitespace-nowrap rounded-[var(--radius-ctl)] px-3 py-2 text-sm font-semibold transition-colors ${isActive ? 'bg-brand-soft text-brand-deep' : 'text-ink-soft hover:bg-card hover:text-ink'}`
      }
    >
      {children}
    </NavLink>
  )
}
