// The hero's one bold element: a single price line marked up the way a mentor marks up
// a student's chart. Entry, stop and target are the first three things every student learns.
// Coordinates are fractions (0–1) of the box so the HTML notes and the SVG line stay aligned.

function buildLine(n = 120, seed = 11) {
  let s = seed
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const pts = []
  let y = 0.5
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    // rise, pull back, then trend to the target
    const drift = t < 0.3 ? -0.006 : t < 0.52 ? 0.009 : -0.0072
    y = Math.min(0.9, Math.max(0.06, y + drift + (rand() - 0.5) * 0.028))
    pts.push([t, y])
  }
  // stretch vertically to fill the box, leaving room for the notes
  const lo = Math.min(...pts.map((p) => p[1]))
  const hi = Math.max(...pts.map((p) => p[1]))
  return pts.map(([x, y]) => [x, 0.12 + ((y - lo) / (hi - lo)) * 0.7])
}

const PTS = buildLine()
// enter two bars after the pullback's lowest point, once price has turned
let low = 50
for (let i = 50; i < 76; i++) if (PTS[i][1] > PTS[low][1]) low = i
const ENTRY_I = low + 2
const entry = PTS[ENTRY_I]
const stopY = Math.max(...PTS.slice(ENTRY_I - 12, ENTRY_I + 1).map((p) => p[1])) + 0.07
const targetY = entry[1] - 2 * (stopY - entry[1])
const d = PTS.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * 1000).toFixed(1)},${(y * 100).toFixed(2)}`).join(' ')

const pct = (v) => `${(v * 100).toFixed(2)}%`

function Note({ x, y, children, align = 'left', below = false, delay }) {
  return (
    <span
      className={`note-fade absolute text-xs whitespace-nowrap text-brand sm:text-sm ${below ? '' : '-translate-y-full pb-1.5'}`}
      style={{ top: pct(y), [align]: align === 'left' ? pct(x) : pct(1 - x), animationDelay: delay }}
    >
      {children}
    </span>
  )
}

// Phones get the short label; the full sentence needs the width of a tablet or desktop.
function Short({ full, children }) {
  return (
    <>
      <span className="sm:hidden">{children}</span>
      <span className="hidden sm:inline">{full}</span>
    </>
  )
}

export default function PriceLine() {
  return (
    <div className="relative h-[170px] sm:h-[190px] lg:h-[220px]" role="img" aria-label="A price chart marked up with an entry after a pullback, a stop below the last low, and a target at twice the risk.">
      <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="line-draw absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <line x1={entry[0] * 1000} x2="1000" y1={stopY * 100} y2={stopY * 100} stroke="var(--color-brand)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
        <line x1={entry[0] * 1000} x2="1000" y1={targetY * 100} y2={targetY * 100} stroke="var(--color-brand)" strokeDasharray="3 5" vectorEffect="non-scaling-stroke" />
        <path d={d} fill="none" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="note-fade absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-paper" style={{ left: pct(entry[0]), top: pct(entry[1]), animationDelay: '1.9s' }} aria-hidden="true" />
      <Note x={entry[0] - 0.012} y={entry[1] + 0.03} align="right" below delay="2s"><Short full="Entry, after the pullback">Entry</Short></Note>
      <Note x={1} y={stopY} align="right" delay="2.2s"><Short full="Stop, below the last low">Stop</Short></Note>
      <Note x={1} y={targetY} align="right" delay="2.4s"><Short full="Target, twice the risk">Target, 2R</Short></Note>
    </div>
  )
}
