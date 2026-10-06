/*
  First-visit intro: a Bitcoin spinning on its edge, with currency coins and three
  "Learn" coins drifting round it. Visitors enter with the button, Skip or Esc, or by
  clicking a Learn coin, which opens that market's program.

  Shown once per browser session, and only when the visit starts on the homepage, so
  people arriving on a program page from an ad or a shared link go straight to it.
*/
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { site } from '../config/site'

const SEEN_KEY = 'theorem_intro_seen'

/*
  Each coin has its own loose oval (a, b as fractions of the stage's oval), its own speed
  (turns per second), starting angle and a small vertical bob, so they drift past one
  another instead of moving in formation. Every oval stays clear of the big coin (see fit()).
*/
const COINS = [
  { id: 'forex', kind: 'learn', market: 'Forex', to: '/programs/forex-basic', a: 1.0, b: 0.96, turn: 1 / 46, phase: 0.35, bob: 7, bobT: 4.2 },
  { id: 'crypto', kind: 'learn', market: 'Crypto', to: '/programs/crypto', a: 0.9, b: 1.06, turn: 1 / 52, phase: 2.45, bob: 6, bobT: 5.1 },
  { id: 'equity', kind: 'learn', market: 'Equity', to: '/programs/equity', a: 1.05, b: 0.9, turn: 1 / 49, phase: 4.4, bob: 8, bobT: 3.7 },
  { id: 'inr', kind: 'mini', symbol: '₹', market: 'Forex', a: 0.76, b: 0.84, turn: 1 / 34, phase: 1.1, bob: 5, bobT: 3.3 },
  { id: 'aed', kind: 'mini', symbol: 'AED', market: 'Forex', a: 0.84, b: 0.78, turn: 1 / 38, phase: 3.3, bob: 4, bobT: 4.6 },
  { id: 'usd', kind: 'mini', symbol: '$', market: 'Forex', a: 0.72, b: 0.76, turn: 1 / 31, phase: 5.5, bob: 6, bobT: 3.9 },
  { id: 'eur', kind: 'mini', symbol: '€', market: 'Forex', a: 0.88, b: 0.72, turn: 1 / 40, phase: 2.0, bob: 5, bobT: 4.4 },
  { id: 'gbp', kind: 'mini', symbol: '£', market: 'Forex', a: 0.74, b: 0.9, turn: 1 / 36, phase: 4.0, bob: 4, bobT: 3.5 },
  { id: 'eth', kind: 'mini', symbol: 'Ξ', market: 'Crypto', a: 0.8, b: 0.8, turn: 1 / 33, phase: 0.2, bob: 6, bobT: 4.9 },
]
const MIN_FACTOR = Math.min(...COINS.flatMap((c) => [c.a, c.b]))

export function shouldShowIntro(pathname) {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).has('intro')) return true // for previewing
  if (pathname !== '/') return false
  try {
    return sessionStorage.getItem(SEEN_KEY) !== 'true'
  } catch {
    return false
  }
}

function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, 'true') } catch { /* private mode: it may show again */ }
}

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function IntroGate({ onClose }) {
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const gateRef = useRef(null)
  const stageRef = useRef(null)
  const coinRef = useRef(null)
  const els = useRef({})
  const paused = useRef(new Set()) // coins being hovered or focused stop, so they are easy to click

  const close = (to) => {
    if (leaving) return
    markSeen()
    setLeaving(true)
    if (to) navigate(to)
    window.setTimeout(onClose, reducedMotion() ? 0 : 650)
  }

  // Drift: each coin follows its own oval round the big coin, always in front of it.
  useEffect(() => {
    const stage = stageRef.current
    const clock = {} // seconds each coin has drifted (it stops while hovered or focused)
    let A = 0, B = 0
    // size the ovals to the stage, never closer to the centre than the big coin's edge allows
    const fit = () => {
      const w = stage.clientWidth, h = stage.clientHeight
      const coinR = (coinRef.current?.offsetWidth || 160) / 2
      const largest = Math.max(...Object.values(els.current).map((el) => el?.offsetWidth || 0)) / 2
      const clear = (coinR + largest + 16) / MIN_FACTOR
      A = Math.max(Math.min(w * 0.42, 430), clear)
      B = Math.max(Math.min(h * 0.4, 250), clear)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(stage)

    const place = (t) => {
      for (const c of COINS) {
        const el = els.current[c.id]
        if (!el) continue
        if (!paused.current.has(c.id)) clock[c.id] = (clock[c.id] ?? 0) + t
        const ct = clock[c.id] ?? 0
        const angle = c.phase + ct * c.turn * Math.PI * 2
        const sin = Math.sin(angle)
        const x = Math.cos(angle) * A * c.a
        const y = sin * B * c.b + Math.sin((ct / c.bobT) * Math.PI * 2) * c.bob
        // lower on screen reads as nearer: slightly larger, and drawn over the others
        const scale = 0.86 + 0.14 * ((sin + 1) / 2)
        el.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`
        // Learn coins are buttons: they stay above the small coins so they are never covered
        el.style.zIndex = String(Math.round((c.kind === 'learn' ? 30 : 10) + sin * 5))
      }
    }

    if (reducedMotion()) {
      place(0)
      return () => ro.disconnect()
    }
    let raf, last = performance.now()
    const tick = (now) => {
      place(Math.min((now - last) / 1000, 0.1)) // cap the step so a background tab does not jump
      last = now
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  // Focus, Esc, and keeping keyboard focus inside the gate.
  useEffect(() => {
    gateRef.current?.querySelector('[data-enter]')?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab') {
        const order = [...gateRef.current.querySelectorAll('button')]
        const at = order.indexOf(document.activeElement)
        e.preventDefault()
        order[(at + (e.shiftKey ? order.length - 1 : 1)) % order.length]?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hold = (id, on) => (on ? paused.current.add(id) : paused.current.delete(id))

  return (
    <div ref={gateRef} role="dialog" aria-modal="true" aria-labelledby="intro-title" className={`intro-gate ${leaving ? 'is-leaving' : ''}`}>
      <div className="intro-top wrap flex h-20 items-center justify-between">
        <p className="flex items-center gap-2.5">
          <span className="flap flap-amber [--flap-w:1.25rem]" aria-hidden="true">T</span>
          <span id="intro-title" className="font-display text-[1.3rem] leading-none font-semibold tracking-tight">{site.name}</span>
        </p>
        <button type="button" onClick={() => close()} className="btn-ghost py-2 text-sm">
          Skip <kbd className="hidden rounded border border-line px-1.5 font-sans text-xs text-ink-soft sm:inline">Esc</kbd>
        </button>
      </div>

      <div ref={stageRef} className="intro-stage">
        <div className="intro-coin-wrap" aria-hidden="true">
          <div ref={coinRef} className="big-coin">
            {/* the rim: thin discs stacked behind the face give the coin real thickness */}
            {Array.from({ length: 9 }, (_, i) => <span key={i} className="big-coin-edge" style={{ '--z': i }} />)}
            <span className="big-coin-face big-coin-front"><span>₿</span></span>
            <span className="big-coin-face big-coin-back"><span>₿</span></span>
          </div>
          <div className="intro-shadow" />
        </div>

        {COINS.map((c) =>
          c.kind === 'learn' ? (
            <button
              key={c.id}
              ref={(el) => (els.current[c.id] = el)}
              type="button"
              onClick={() => close(c.to)}
              onPointerEnter={() => hold(c.id, true)}
              onPointerLeave={() => hold(c.id, false)}
              onFocus={() => hold(c.id, true)}
              onBlur={() => hold(c.id, false)}
              className={`drift-coin learn-coin learn-${c.id}`}
            >
              <span className="block text-[0.78em] font-medium opacity-80">Learn</span>
              <span className="block font-semibold">{c.market.toLowerCase()}</span>
            </button>
          ) : (
            <span key={c.id} ref={(el) => (els.current[c.id] = el)} aria-hidden="true" className={`drift-coin mini-coin ${c.market === 'Crypto' ? 'mini-crypto' : ''} ${c.symbol.length > 1 ? 'mini-wide' : ''}`}>
              {c.symbol}
            </span>
          ),
        )}
      </div>

      <div className="intro-bottom">
        <button data-enter type="button" onClick={() => close()} className="btn-brand btn-lg min-w-[13rem]">Enter Theorem</button>
        <p className="mt-4 text-sm text-ink-soft">Trading academy in Dubai, India and online</p>
      </div>
    </div>
  )
}
