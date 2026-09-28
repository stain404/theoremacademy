// The split-flap market board: the site's signature element.
// Shows the four forex sessions live, in Dubai and India time, like a departures board.
import { useEffect, useRef, useState } from 'react'

const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:-'
const prefersReducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/*
  One row of flap tiles. Like a real board, each tile steps forward through the character
  set until it reaches its target, so only the characters that change actually move.
*/
export function FlapText({ text, length, tone = '', delay = 0 }) {
  const target = String(text).toUpperCase().padEnd(length).slice(0, length)
  const reduced = prefersReducedMotion()
  const [shown, setShown] = useState(() => (reduced ? target : ' '.repeat(length)))
  const shownRef = useRef(shown)

  useEffect(() => {
    // with reduced motion the tiles render the target directly (see below), no cycling
    if (reduced) return
    // stagger the start of each tile slightly so the row ripples left to right
    const startAt = [...target].map((_, i) => Math.floor(delay / 45) + i + Math.floor(Math.random() * 3))
    let tick = 0
    const id = setInterval(() => {
      tick++
      const prev = shownRef.current
      const next = [...target]
        .map((ch, i) => {
          if (prev[i] === ch || tick < startAt[i]) return prev[i]
          if (!CHARS.includes(ch)) return ch
          return CHARS[(CHARS.indexOf(prev[i]) + 1) % CHARS.length]
        })
        .join('')
      shownRef.current = next
      setShown(next)
      if (next === target) clearInterval(id)
    }, 45)
    return () => clearInterval(id)
  }, [target, delay, reduced])

  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {[...(reduced ? target : shown)].map((ch, i) => (
        <span key={i} className={`flap ${tone} ${ch !== target[i] ? 'is-flipping' : ''}`}>{ch === ' ' ? ' ' : ch}</span>
      ))}
    </span>
  )
}

// ---------- Session maths ----------

const SESSIONS = [
  { city: 'Sydney', tz: 'Australia/Sydney' },
  { city: 'Tokyo', tz: 'Asia/Tokyo' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'New York', tz: 'America/New_York' },
]
const OPEN = 8 * 60 // sessions are taken as 08:00 to 17:00 local time in each city
const CLOSE = 17 * 60
const DUBAI = 'Asia/Dubai'
const INDIA = 'Asia/Kolkata'
const WEEKDAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }

function partsIn(date, timeZone) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  })
  return Object.fromEntries(f.formatToParts(date).map((p) => [p.type, p.value]))
}

function offsetMinutes(date, timeZone) {
  const p = partsIn(date, timeZone)
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute)
  return Math.round((asUTC - Math.floor(date.getTime() / 60000) * 60000) / 60000)
}

const hhmm = (mins) => {
  const m = ((mins % 1440) + 1440) % 1440
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}
const duration = (mins) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`

// Open Monday to Friday, 08:00–17:00 in the city. Returns minutes until the next change.
function sessionStatus(date, timeZone) {
  const p = partsIn(date, timeZone)
  const day = WEEKDAY[p.weekday]
  const mins = +p.hour * 60 + +p.minute
  const weekday = day >= 1 && day <= 5
  if (weekday && mins >= OPEN && mins < CLOSE) return { open: true, change: CLOSE - mins }
  let change = weekday && mins < OPEN ? OPEN - mins : 1440 - mins + OPEN
  let d = weekday && mins < OPEN ? day : (day + 1) % 7
  while (d === 0 || d === 6) {
    change += 1440
    d = (d + 1) % 7
  }
  return { open: false, change }
}

export function useNow(intervalMs = 20_000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

function rows(now) {
  const dxb = offsetMinutes(now, DUBAI)
  const ind = offsetMinutes(now, INDIA)
  return SESSIONS.map(({ city, tz }) => {
    const off = offsetMinutes(now, tz)
    const status = sessionStatus(now, tz)
    return {
      city,
      dubai: `${hhmm(OPEN - off + dxb)}-${hhmm(CLOSE - off + dxb)}`,
      india: `${hhmm(OPEN - off + ind)}-${hhmm(CLOSE - off + ind)}`,
      open: status.open,
      change: duration(status.change),
    }
  })
}

export function localTime(now, timeZone) {
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone })
}

// Column visibility: phones show session, status and countdown; tablets add Dubai; desktop shows all.
const COLS = [
  { key: 'city', label: 'Session', len: 8, className: '' },
  { key: 'dubai', label: 'Hours in Dubai', len: 11, className: 'hidden sm:block' },
  { key: 'india', label: 'Hours in India', len: 11, className: 'hidden lg:block' },
  { key: 'status', label: 'Status', len: 6, className: '' },
  { key: 'change', label: 'Opens or closes in', len: 5, className: '' },
]

export default function SessionBoard() {
  const now = useNow()
  const data = rows(now)
  const openNow = data.filter((r) => r.open).map((r) => r.city)

  return (
    <div className="bg-board text-white">
      <div className="wrap py-8 sm:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className="font-cond text-lg font-bold">Forex sessions right now</h2>
          <p className="text-sm text-white/60 tabular-nums">
            Dubai {localTime(now, DUBAI)}, India {localTime(now, INDIA)}
          </p>
        </div>

        {/* the board: a grid so column labels line up with the tiles */}
        <div className="mt-6 overflow-hidden [--flap-w:0.8rem] sm:[--flap-w:1.08rem] lg:[--flap-w:1.45rem]">
          <div className="grid w-max grid-cols-[repeat(3,max-content)] sm:grid-cols-[repeat(4,max-content)] lg:grid-cols-[repeat(5,max-content)] gap-x-[calc(var(--flap-w)*0.9)] gap-y-[5px]" role="table" aria-label="Forex sessions">
            <div role="row" className="contents">
              {COLS.map((c) => (
                <span key={c.key} role="columnheader" className={`pb-2 text-xs text-white/55 ${c.className}`}>{c.label}</span>
              ))}
            </div>
            {data.map((r, ri) => (
              <div role="row" key={r.city} className="contents">
                <span role="cell" className={COLS[0].className}><span className="sr-only">{r.city}</span><FlapText text={r.city} length={8} delay={ri * 160} /></span>
                <span role="cell" className={COLS[1].className}><span className="sr-only">Dubai {r.dubai}</span><FlapText text={r.dubai} length={11} tone="flap-dim" delay={ri * 160 + 250} /></span>
                <span role="cell" className={COLS[2].className}><span className="sr-only">India {r.india}</span><FlapText text={r.india} length={11} tone="flap-dim" delay={ri * 160 + 400} /></span>
                <span role="cell"><span className="sr-only">{r.open ? 'Open' : 'Closed'}</span><FlapText text={r.open ? 'Open' : 'Closed'} length={6} tone={r.open ? 'flap-amber' : 'flap-dim'} delay={ri * 160 + 550} /></span>
                <span role="cell"><span className="sr-only">{r.open ? 'closes' : 'opens'} in {r.change}</span><FlapText text={r.change} length={5} tone={r.open ? 'flap-amber' : ''} delay={ri * 160 + 650} /></span>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 max-w-[46rem] text-sm leading-relaxed text-white/60">
          {openNow.length ? `${openNow.join(' and ')} ${openNow.length > 1 ? 'are' : 'is'} open. ` : 'All four sessions are closed. '}
          Sessions run 08:00 to 17:00 in each city, Monday to Friday. The board updates on its own.
        </p>
      </div>
    </div>
  )
}
