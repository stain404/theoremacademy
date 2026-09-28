import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { locations, programs, site } from '../config/site'
import { useAuth } from '../lib/auth'

export function Wordmark({ className = '' }) {
  return (
    <Link to="/" className={`font-display text-[1.35rem] leading-none tracking-[-0.01em] ${className}`}>
      {site.name}
    </Link>
  )
}

const NAV = [
  ['Programs', '/#programs'],
  ['About', '/#approach'],
  ['Mentors', '/#mentors'],
  ['Contact', '/#contact'],
]

export function Nav() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`sticky top-0 z-40 bg-paper/95 backdrop-blur-sm transition-[border-color] ${scrolled || open ? 'border-b border-line' : 'border-b border-transparent'}`}>
      <div className="wrap flex h-16 items-center justify-between">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-9 text-sm lg:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={href} className="text-ink-soft transition-colors hover:text-ink">{label}</a>
          ))}
        </nav>
        <div className="hidden items-center gap-6 text-sm lg:flex">
          {user ? (
            <Link to="/portal" className="text-ink-soft hover:text-ink">My portal</Link>
          ) : (
            <Link to="/login" className="text-ink-soft hover:text-ink">Log in</Link>
          )}
          <Link to="/register" className="btn-brand px-4 py-2.5">Apply now</Link>
        </div>
        <button className="text-sm font-medium lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="fixed inset-x-0 top-16 bottom-0 flex flex-col bg-paper px-5 pt-8 pb-10 sm:px-8 lg:hidden">
          <ul className="divide-y divide-line border-y border-line">
            {NAV.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block py-4 font-display text-[1.9rem] leading-tight">{label}</a>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-col gap-3">
            <Link to="/register" className="btn-brand py-3.5">Apply now</Link>
            <Link to={user ? '/portal' : '/login'} className="btn-ghost py-3.5">{user ? 'My portal' : 'Log in'}</Link>
          </div>
        </nav>
      )}
    </header>
  )
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h2 className="font-sans text-sm text-paper/50">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-16 bg-ink text-paper">
      <div className="wrap"><div className="grid-editorial gap-y-12 border-t border-paper/15 py-16 lg:py-20">
        <div className="col-span-4 sm:col-span-8 lg:col-span-4">
          <Wordmark className="text-paper" />
          <p className="mt-5 max-w-[22rem] text-sm leading-relaxed text-paper/70">{site.description}</p>
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <FooterColumn title="Academy">
            {NAV.slice(0, 3).map(([label, href]) => <li key={href}><a href={href} className="hover:text-paper/70">{label}</a></li>)}
            <li><Link to="/login" className="hover:text-paper/70">Student log in</Link></li>
          </FooterColumn>
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-2">
          <FooterColumn title="Programs">
            {programs.map((p) => <li key={p.id}><Link to={`/register?program=${p.id}`} className="hover:text-paper/70">{p.title}</Link></li>)}
          </FooterColumn>
        </div>
        <div className="col-span-4 sm:col-span-4 lg:col-span-4">
          <FooterColumn title="Contact">
            <li><a href={`mailto:${site.email}`} className="hover:text-paper/70">{site.email}</a></li>
            <li>{site.phone}</li>
            <li><a href={site.whatsappLink} className="hover:text-paper/70">WhatsApp {site.whatsapp}</a></li>
            {locations.filter((l) => l.city !== 'Online').map((l) => (
              <li key={l.city} className="pt-2 text-paper/70"><span className="text-paper">{l.city}</span><br />{l.address}</li>
            ))}
          </FooterColumn>
        </div>
      </div></div>

      <div className="wrap"><div className="border-t border-paper/15 py-8 text-xs text-paper/55">
        <p className="max-w-[60rem] leading-relaxed">
          Trading forex, crypto and equities carries a high risk of losing money. Our programs are education, not financial or investment advice, and past performance does not guarantee future results.
        </p>
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {site.social.map((s) => <li key={s.label}><a href={s.href} className="hover:text-paper">{s.label}</a></li>)}
            {/* placeholder: legal pages still need to be written */}
            <li><a href="#" className="hover:text-paper">Terms</a></li>
            <li><a href="#" className="hover:text-paper">Privacy</a></li>
            <li><a href="#" className="hover:text-paper">Refund policy</a></li>
          </ul>
        </div>
      </div></div>
    </footer>
  )
}

export default function SiteLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="flex-1"><Outlet /></main>
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
        `block whitespace-nowrap border-l-2 px-3 py-2 text-sm ${isActive ? 'border-brand text-ink font-medium' : 'border-transparent text-ink-soft hover:text-ink'}`
      }
    >
      {children}
    </NavLink>
  )
}
