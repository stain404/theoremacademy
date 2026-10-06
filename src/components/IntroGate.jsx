/*
  First-visit intro: the Theorem coin spinning on its edge, with currency and crypto coins
  orbiting it in 3D. Visitors enter with the button, Skip, or Esc.

  Shown once per browser session, and only when the visit starts on the homepage, so
  people arriving on a program page from an ad or a shared link go straight to it.
  The scene itself is pure CSS 3D (see "Intro gate" in index.css).
*/
import { useEffect, useRef, useState } from 'react'
import { site } from '../config/site'

const SEEN_KEY = 'theorem_intro_seen'

// Outer ring: currencies, rimmed in the forex colour. Inner ring: crypto, rimmed in amber.
const OUTER = ['₹', 'AED', '$', '€', '£']
const INNER = ['₿', 'Ξ']

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

function Ring({ coins, ring }) {
  return (
    <div className={`orbit orbit-${ring}`} style={{ '--n': coins.length }}>
      <div className="orbit-path" aria-hidden="true" />
      {coins.map((symbol, i) => (
        <div key={symbol} className="orbit-arm" style={{ '--i': i }}>
          <div className="orbit-holder">
            <span className={`mini-coin ${ring === 'inner' ? 'mini-crypto' : 'mini-fx'} ${symbol.length > 1 ? 'mini-wide' : ''}`}>{symbol}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function IntroGate({ onClose }) {
  const [leaving, setLeaving] = useState(false)
  const enterRef = useRef(null)
  const skipRef = useRef(null)

  const close = () => {
    if (leaving) return
    markSeen()
    setLeaving(true)
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.setTimeout(onClose, reduced ? 0 : 650)
  }

  useEffect(() => {
    enterRef.current?.focus({ preventScroll: true })
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      // keep focus inside the gate: only Skip and Enter are focusable
      if (e.key === 'Tab') {
        const order = [skipRef.current, enterRef.current]
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

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="intro-title" className={`intro-gate ${leaving ? 'is-leaving' : ''}`}>
      <div className="intro-top wrap flex h-20 items-center justify-between">
        <p className="flex items-center gap-2.5">
          <span className="flap flap-amber [--flap-w:1.25rem]" aria-hidden="true">T</span>
          <span id="intro-title" className="font-display text-[1.3rem] leading-none font-semibold tracking-tight">{site.name}</span>
        </p>
        <button ref={skipRef} type="button" onClick={close} className="btn-ghost py-2 text-sm">
          Skip <kbd className="hidden rounded border border-line px-1.5 font-sans text-xs text-ink-soft sm:inline">Esc</kbd>
        </button>
      </div>

      <div className="intro-stage" aria-hidden="true">
        <div className="intro-world">
          <Ring coins={OUTER} ring="outer" />
          <Ring coins={INNER} ring="inner" />
          <div className="big-coin">
            {/* the rim: thin discs stacked behind the face give the coin real thickness */}
            {Array.from({ length: 9 }, (_, i) => <span key={i} className="big-coin-edge" style={{ '--z': i }} />)}
            <span className="big-coin-face big-coin-front"><span>T</span></span>
            <span className="big-coin-face big-coin-back"><span>T</span></span>
          </div>
        </div>
        <div className="intro-shadow" />
      </div>

      <div className="intro-bottom">
        <button ref={enterRef} type="button" onClick={close} className="btn-brand btn-lg min-w-[13rem]">Enter Theorem</button>
        <p className="mt-4 text-sm text-ink-soft">Trading academy in Dubai, India and online</p>
      </div>
    </div>
  )
}
