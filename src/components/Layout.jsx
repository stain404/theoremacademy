import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { locations, programs, site } from '../config/site'
import { useAuth } from '../lib/auth'

// Wordmark with a single board tile as the mark.
export function Wordmark({ className = '', onClick }) {
  return (
    <Link to="/" onClick={onClick} className={`flex items-center gap-2.5 ${className}`}>
      <span className="flap flap-amber [--flap-w:1.15rem]" aria-hidden="true">P</span>
      <span className="font-display text-[1.7rem] leading-none font-extrabold">{site.name}</span>
    </Link>
  )
}

const NAV = [
  ['Programs', '/programs'],
  ['About', '/about'],
  ['Mentors', '/mentors'],
  ['Contact', '/contact'],
]

// Current page: an amber bar along the bottom edge of the header, like a selected tab.
const desktopLink = ({ isActive }) =>
  `relative flex h-full items-center transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:bg-signal after:transition-transform after:duration-200 ${
    isActive ? 'text-ink after:scale-x-100' : 'text-ink-soft hover:text-ink after:scale-x-0'
  }`

export function Nav() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="wrap flex h-16 items-center justify-between">
        <Wordmark onClick={close} />
        <nav aria-label="Main" className="hidden h-full items-stretch gap-9 text-sm font-semibold lg:flex">
          {NAV.map(([label, to]) => (
            <NavLink key={to} to={to} className={desktopLink}>{label}</NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-6 text-sm font-semibold lg:flex">
          <Link to={user ? '/portal' : '/login'} className="text-ink-soft hover:text-ink">{user ? 'My portal' : 'Log in'}</Link>
          <Link to="/register" className="btn-brand py-2.5">Apply now</Link>
        </div>
        <button className="text-sm font-semibold lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-paper px-5 pt-6 pb-8 sm:px-8 lg:hidden">
          <ul className="border-t-2 border-ink">
            {NAV.map(([label, to]) => (
              <li key={to} className="border-b border-line">
                <NavLink to={to} onClick={close} className="flex items-center gap-3 py-4 font-display text-[2.6rem] leading-none font-extrabold">
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && <span className="h-3 w-3 bg-signal" aria-label="(current page)" />}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <Link to="/register" onClick={close} className="btn-brand py-3.5">Apply now</Link>
            <Link to={user ? '/portal' : '/login'} onClick={close} className="btn-ghost py-3.5">{user ? 'My portal' : 'Log in'}</Link>
          </div>
        </nav>
      )}
    </header>
  )
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
    <footer className="bg-board text-white">
      <div className="wrap grid-12 gap-y-12 py-16 lg:py-20">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <Wordmark />
          <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-white/65">{site.description}</p>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Academy">
            {NAV.map(([label, to]) => <li key={to}><Link to={to} className="hover:text-signal">{label}</Link></li>)}
            <li><Link to="/login" className="hover:text-signal">Student log in</Link></li>
          </FooterColumn>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <FooterColumn title="Programs">
            {programs.map((p) => <li key={p.id}><Link to={`/programs/${p.id}`} className="hover:text-signal">{p.title}</Link></li>)}
          </FooterColumn>
        </div>
        <div className="col-span-4 lg:col-span-4">
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
        <div className="border-t border-white/15 py-8 text-xs text-white/55">
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
