import { useState } from 'react'
import { Link } from 'react-router-dom'
import SessionBoard from './Board'

/*
  Interactive Pro Trading Terminal Component:
  Replaces static text clocks with a rich, animated candlestick chart,
  order block liquidity annotations, live trade execution markups, and Dubai trading floor status.
*/

const MARKETS = [
  {
    id: 'gold',
    symbol: 'XAU/USD',
    name: 'Gold Spot',
    price: '$2,654.80',
    change: '+1.42%',
    up: true,
    setup: 'Liquidity Sweep + 4.8R Long',
    candles: [
      { o: 45, h: 58, l: 40, c: 54, green: true },
      { o: 54, h: 62, l: 50, c: 51, green: false },
      { o: 51, h: 53, l: 32, c: 36, green: false, note: 'Liquidity Grab' },
      { o: 36, h: 60, l: 35, c: 58, green: true, ob: true },
      { o: 58, h: 72, l: 56, c: 69, green: true },
      { o: 69, h: 75, l: 64, c: 66, green: false },
      { o: 66, h: 88, l: 65, c: 85, green: true, tp: true },
      { o: 85, h: 94, l: 82, c: 92, green: true },
    ],
    entry: 'Entry: 2,638.50',
    sl: 'SL: 2,632.00 (-0.8%)',
    tp: 'TP: 2,674.00 (+4.8R)',
  },
  {
    id: 'eurusd',
    symbol: 'EUR/USD',
    name: 'Euro / US Dollar',
    price: '1.0892',
    change: '+0.68%',
    up: true,
    setup: 'London Open Breakout + 3.5R',
    candles: [
      { o: 60, h: 65, l: 52, c: 55, green: false },
      { o: 55, h: 58, l: 42, c: 45, green: false },
      { o: 45, h: 48, l: 30, c: 34, green: false, note: 'Asian Low Sweep' },
      { o: 34, h: 56, l: 33, c: 54, green: true, ob: true },
      { o: 54, h: 70, l: 52, c: 68, green: true },
      { o: 68, h: 82, l: 66, c: 80, green: true, tp: true },
      { o: 80, h: 85, l: 76, c: 83, green: true },
    ],
    entry: 'Entry: 1.0845',
    sl: 'SL: 1.0820 (-0.5%)',
    tp: 'TP: 1.0910 (+3.5R)',
  },
  {
    id: 'btc',
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    price: '$68,420',
    change: '+3.85%',
    up: true,
    setup: 'Bullish Order Block Bounce',
    candles: [
      { o: 70, h: 78, l: 62, c: 64, green: false },
      { o: 64, h: 68, l: 45, c: 48, green: false },
      { o: 48, h: 52, l: 38, c: 40, green: false, note: 'FVG Filled' },
      { o: 40, h: 65, l: 39, c: 62, green: true, ob: true },
      { o: 62, h: 78, l: 60, c: 75, green: true },
      { o: 75, h: 90, l: 73, c: 88, green: true, tp: true },
      { o: 88, h: 96, l: 85, c: 94, green: true },
    ],
    entry: 'Entry: $64,200',
    sl: 'SL: $62,800 (-1.0%)',
    tp: 'TP: $69,500 (+4.2R)',
  },
]

export default function TradingTerminalVisual() {
  const [view, setView] = useState('chart') // 'chart' | 'sessions'
  const [activeMarket, setActiveMarket] = useState('gold')

  const market = MARKETS.find((m) => m.id === activeMarket) || MARKETS[0]

  return (
    <div className="relative">
      {/* Main Glassmorphic Terminal Window */}
      <div className="relative rounded-2xl border border-signal/30 bg-[#0d0d0d]/95 shadow-2xl backdrop-blur-xl overflow-hidden">
        
        {/* Terminal Top Window Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#050505] px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-500/80" />
              <span className="size-2.5 rounded-full bg-yellow-500/80" />
              <span className="size-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs font-bold text-white/90 pl-1.5 flex items-center gap-1.5">
              <span>🇦🇪 Theorem Pro Terminal</span>
              <span className="rounded bg-signal/20 px-1.5 py-0.2 text-[0.65rem] text-signal font-mono font-semibold">DUBAI DESK</span>
            </span>
          </div>

          {/* View Switcher: Interactive Chart vs Market Sessions */}
          <div className="flex items-center rounded-lg border border-white/15 bg-white/5 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setView('chart')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                view === 'chart' ? 'bg-signal text-ink shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              📊 Live Chart Analysis
            </button>
            <button
              type="button"
              onClick={() => setView('sessions')}
              className={`rounded-md px-2.5 py-1 font-semibold transition-all ${
                view === 'sessions' ? 'bg-signal text-ink shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              🕒 Forex Hours
            </button>
          </div>
        </div>

        {/* View 1: Pro Candlestick Chart Terminal */}
        {view === 'chart' && (
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* Market Asset Ticker Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                {MARKETS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setActiveMarket(m.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                      activeMarket === m.id
                        ? 'border border-signal/50 bg-signal/15 text-signal shadow-sm'
                        : 'border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {m.symbol}
                  </button>
                ))}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-mono text-sm sm:text-base font-extrabold text-white tabular-nums">{market.price}</span>
                <span className="text-xs font-bold text-bull">{market.change}</span>
              </div>
            </div>

            {/* Interactive Visual Chart Area */}
            <div className="relative h-44 sm:h-52 w-full rounded-xl border border-white/10 bg-[#050505] p-3 overflow-hidden">
              
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-15">
                <div className="border-b border-dashed border-white w-full" />
                <div className="border-b border-dashed border-white w-full" />
                <div className="border-b border-dashed border-white w-full" />
                <div className="border-b border-dashed border-white w-full" />
              </div>

              {/* Order Block (OB) Highlight Region */}
              <div
                className="absolute left-[26%] top-[45%] h-[32%] w-[42%] rounded border border-signal/40 bg-signal/10 backdrop-blur-[2px] transition-all flex items-start p-1.5"
                aria-label="Institutional Order Block Zone"
              >
                <span className="rounded bg-signal/25 px-1.5 py-0.5 text-[0.6rem] font-bold text-signal tracking-wider uppercase font-mono">
                  ⚡ Institutional Order Block (OB)
                </span>
              </div>

              {/* Take Profit Target Line */}
              <div className="absolute inset-x-3 top-[18%] flex items-center justify-between border-t border-dashed border-bull/70 pt-0.5">
                <span className="text-[0.6rem] font-bold text-bull font-mono bg-[#000000]/80 px-1 rounded">🎯 Take Profit: +4.8R Hit</span>
                <span className="text-[0.6rem] font-mono text-bull/80">Target 2,674.00</span>
              </div>

              {/* Stop Loss Line */}
              <div className="absolute inset-x-3 bottom-[16%] flex items-center justify-between border-t border-dashed border-bear/70 pt-0.5">
                <span className="text-[0.6rem] font-bold text-bear font-mono bg-[#000000]/80 px-1 rounded">🛡️ Protected Stop Loss: 1% Risk Max</span>
                <span className="text-[0.6rem] font-mono text-bear/80">2,632.00</span>
              </div>

              {/* Animated SVG Candlestick Chart */}
              <svg className="relative h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c7cdd6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#c7cdd6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Moving Average Line */}
                <path
                  d="M 20 120 Q 80 110, 140 100 T 260 50 T 380 25"
                  fill="none"
                  stroke="#c7cdd6"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="opacity-70"
                />

                {/* Candlesticks Render */}
                {market.candles.map((c, i) => {
                  const x = 35 + i * 46
                  const candleY = 160 - (c.c + c.o) / 2
                  const candleH = Math.max(Math.abs(c.c - c.o) * 1.3, 8)
                  const wickTop = 160 - c.h * 1.3
                  const wickBottom = 160 - c.l * 1.3

                  const color = c.green ? '#10b981' : '#ef4444'
                  const fillColor = c.green ? '#10b981' : '#ef4444'

                  return (
                    <g key={i} className="transition-all duration-300">
                      {/* Upper & Lower Wick */}
                      <line x1={x + 7} y1={wickTop} x2={x + 7} y2={wickBottom} stroke={color} strokeWidth="1.5" />
                      {/* Candle Body */}
                      <rect
                        x={x}
                        y={candleY - candleH / 2}
                        width="14"
                        height={candleH}
                        rx="1.5"
                        fill={fillColor}
                        stroke={color}
                        strokeWidth="1"
                        className="transition-transform hover:scale-105"
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Live Pulsing Price Tag Indicator */}
              <div className="absolute right-3 top-[22%] flex items-center gap-1.5 rounded-full bg-bull px-2 py-0.5 text-[0.65rem] font-bold text-white shadow-lg animate-pulse">
                <span className="size-1.5 rounded-full bg-white animate-ping" />
                <span>LIVE {market.price}</span>
              </div>
            </div>

            {/* Mentor Trade Review Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-signal text-ink grid place-items-center font-bold text-xs">
                  F
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">Reviewed by Farhan (Lead Mentor)</span>
                  <span className="text-xs text-signal font-medium">Dubai Trading Floor • 1:4.8 Risk-Reward Confirmed</span>
                </div>
              </div>
              <span className="rounded bg-bull/20 px-2.5 py-0.5 text-xs font-bold text-bull">
                ✓ Reviewed by Mentor
              </span>
            </div>

          </div>
        )}

        {/* View 2: Live Market Session Clocks (Split-Flap Board) */}
        {view === 'sessions' && (
          <div className="p-4 sm:p-5">
            <SessionBoard startDelay={50} />
          </div>
        )}

        {/* Terminal Bottom Bar */}
        <div className="flex items-center justify-between border-t border-white/10 bg-[#050505] px-4 py-2.5 text-xs text-white/70">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-signal animate-pulse" />
            <span className="text-[0.75rem]">Next Dubai In-Person Cohort: <strong className="text-white">Enrolling</strong></span>
          </div>
          <Link to="/contact" className="text-signal hover:underline font-bold text-xs flex items-center gap-1">
            <span>Contact us</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Floating Badge 1: Top Right Risk Shield */}
      <div className="animate-float absolute -top-3.5 -right-3.5 rounded-xl border border-signal/40 bg-board-deep/95 px-3 py-1.5 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2">
        <span className="text-base">🛡️</span>
        <span className="text-[0.7rem] font-bold text-white">1% Max Risk Framework</span>
      </div>

      {/* Floating Badge 2: Bottom Left Dubai Badge */}
      <div className="animate-float absolute -bottom-3.5 -left-3.5 rounded-xl border border-signal/30 bg-board-deep/95 px-3 py-1.5 shadow-xl backdrop-blur-md hidden sm:flex items-center gap-2">
        <span className="text-base">🏛️</span>
        <div>
          <p className="text-[0.7rem] font-bold text-white">Dubai Business Bay Lab</p>
          <p className="text-[0.6rem] text-signal">Multi-Screen Terminal Floor</p>
        </div>
      </div>
    </div>
  )
}
