import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FinalCta, PageHeader, usePageTitle } from '../components/sections'
import { Section } from '../components/ui'
import TradingTerminalVisual from '../components/TradingTerminalVisual'

// Free e-books, under Knowledge Toolkit. No file-delivery backend exists yet, so each one
// hands off to Contact rather than a fake download link — swap in real files when ready.
const EBOOKS = [
  { id: 'forex-starter', title: 'The Forex Starter Workbook', blurb: 'Pips, lots and leverage, and how to size your first risk-managed trade.', icon: '📘' }, // placeholder: replace with the real e-book
  { id: 'crypto-safety', title: 'Crypto Safety Checklist', blurb: 'Exchanges, wallets and the scams every new holder should know to avoid.', icon: '📗' }, // placeholder: replace with the real e-book
  { id: 'trade-journal', title: 'The Trade Journal Template', blurb: 'The exact format mentors ask every student to keep from day one.', icon: '📙' }, // placeholder: replace with the real e-book
]

const ALGO_TOOLS = [
  {
    id: 'risk-engine',
    title: 'Automated Risk Allocation & Lot Calculator',
    tag: 'Capital Protection',
    icon: '🛡️',
    desc: 'Proprietary sizing algorithm that calculates exact lot and contract sizes before every execution. Ensures no trade ever risks more than your pre-set 1% limit, removing emotional math under live market pressure.',
    capabilities: [
      'Automatic lot-sizing based on precise account balance',
      'Dynamic pip & point distance calibration',
      'Hard maximum daily loss kill-switch protection',
      'Automated leverage ceiling checks',
    ],
  },
  {
    id: 'execution-engine',
    title: 'Rule-Based Algorithmic Execution Engine',
    tag: 'Automated Precision',
    icon: '⚡',
    desc: 'Institutional trade management algorithm that locks profits and protects downside. Automatically moves stops to break-even at key liquidity targets, manages scale-outs, and trails runners without manual micromanagement.',
    capabilities: [
      'Multi-tier partial take-profit automation',
      'Smart break-even triggers at structural targets',
      'Dynamic volatility-based trailing stop algorithms',
      'Zero-latency market order bracket routing',
    ],
  },
  {
    id: 'backtest-engine',
    title: 'Quantitative Strategy Backtesting Engine',
    tag: 'Empirical Verification',
    icon: '📊',
    desc: 'Test your personal trading plan over 5+ years of institutional tick data before risking real funds. Validate win-rate, maximum drawdown, profit factor, and Sharpe ratio across Forex, Crypto, and Global Equities.',
    capabilities: [
      'Sub-minute and tick-level historical data playback',
      'Realistic slippage, spread, and commission modeling',
      'Automated Monte Carlo risk simulations',
      'Exportable audit reports for mentor review',
    ],
  },
  {
    id: 'scanner-suite',
    title: 'Multi-Asset Institutional Market Scanner',
    tag: 'Real-Time Alerts',
    icon: '🛰️',
    desc: 'Continuous algorithmic scanner monitoring 40+ major FX pairs, crypto perps, and global indices. Detects key institutional levels, volume anomalies, and liquidity sweeps across Asian, London, and New York sessions.',
    capabilities: [
      'Liquidity sweep & false-breakout detection',
      'Session high/low boundary alerts in real time',
      'Volume breakout filter to eliminate chop',
      'Instant notifications sent directly to student dashboards',
    ],
  },
]

const ANALYSIS_TOOLS = [
  {
    id: 'orderflow',
    title: 'Order Flow & DOM (Depth of Market) Heatmaps',
    tag: 'Institutional Liquidity',
    icon: '🔥',
    desc: 'See exactly where commercial banks and market makers have placed passive limit buy and sell orders. Trade with institutional order flow rather than guessing from retail candlestick patterns alone.',
    capabilities: [
      'Live visual liquidity depth heatmaps',
      'Iceberg order and resting limit detection',
      'Book replenishment and spoofing identification',
      'Direct integration with CME & top liquidity providers',
    ],
  },
  {
    id: 'footprint',
    title: 'Footprint & Volume Delta Charting Software',
    tag: 'Aggression Analysis',
    icon: '📈',
    desc: 'Inspect trades executing inside each individual candle. Footprint charts reveal whether market buyers or sellers were aggressive, identifying exhausted rallies and high-probability reversal points.',
    capabilities: [
      'Cumulative Volume Delta (CVD) divergence alerts',
      'Bid/Ask diagonal volume imbalance highlighting',
      'Unfinished business & auction market theory tracking',
      'Point of Control (POC) migration indicators',
    ],
  },
  {
    id: 'market-profile',
    title: 'Market Profile & Session Volume Distribution',
    tag: 'Structural Value',
    icon: '🏛️',
    desc: 'Understand market value versus market price. Session Volume Profiles plot where highest volume traded, highlighting Value Area High (VAH), Value Area Low (VAL), and institutional acceptance zones.',
    capabilities: [
      'Dynamic session and multi-day Volume Profiles',
      'High-volume nodes (support) & low-volume voids (targets)',
      'Multi-timeframe Session VWAP with standard deviation bands',
      'Daily open auction type classification (drive, test, reject)',
    ],
  },
  {
    id: 'macro-matrix',
    title: 'Macro Correlation & Currency Strength Matrix',
    tag: 'Global Context',
    icon: '🌐',
    desc: 'Cross-asset analytical dashboard mapping relationships between US Dollar Index (DXY), US 10Y Treasury yields, Brent crude, and benchmark equity futures to establish high-conviction daily market directional bias.',
    capabilities: [
      'Real-time central bank interest rate differential tracker',
      'Yield curve inversion & spread momentum metrics',
      'Risk-on vs. Risk-off multi-asset sentiment radar',
      'Economic calendar impact weighting & release flags',
    ],
  },
]

export default function Technology() {
  const { pathname } = useLocation()
  const isToolsRoute = pathname.includes('/tools')
  usePageTitle(isToolsRoute ? 'Trading Tools & Software' : 'Technology & Tools')

  const [activeTab, setActiveTab] = useState(isToolsRoute ? 'algo' : 'all')

  return (
    <>
      <PageHeader
        back={{ to: '/', label: 'Home' }}
        title="Institutional Trading Technology & Tools"
        intro="Explore the proprietary algorithmic software, order flow heatmaps, and institutional execution terminals used daily in our Dubai and India trading labs."
      />

      {/* Overview Highlights Strip */}
      <section className="border-b border-white/10 bg-[#0d0d12] py-8 text-white">
        <div className="wrap grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text">Multi-Monitor</div>
            <div className="mt-1 text-xs text-white/70">Classroom Trading Stations</div>
          </div>
          <div className="p-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text">Tick-Level</div>
            <div className="mt-1 text-xs text-white/70">Order Flow & DOM Data</div>
          </div>
          <div className="p-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text">1% Hard Stop</div>
            <div className="mt-1 text-xs text-white/70">Algorithmic Risk Allocation</div>
          </div>
          <div className="p-3">
            <div className="font-display text-2xl sm:text-3xl font-extrabold gold-foil-text">CME & FX</div>
            <div className="mt-1 text-xs text-white/70">Institutional Direct Feeds</div>
          </div>
        </div>
      </section>

      {/* Interactive Pro Terminal Showcase */}
      <Section
        tight
        dark
        title="Interactive Trading Terminal"
        intro="Experience our live order block tracking, multi-asset execution brackets, and session telemetry."
      >
        <div className="max-w-4xl mx-auto">
          <TradingTerminalVisual />
        </div>
      </Section>

      {/* Section 1: Algorithmic Software ("Algo Software") */}
      <Section
        id="algo-software"
        tight
        title="Algorithmic Trading Software"
        intro="Rule-based automation built to eliminate emotional errors, strictly enforce risk limits, and backtest setups across millions of historical ticks."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {ALGO_TOOLS.map((tool) => (
            <article
              key={tool.id}
              className="card-hover-glow p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#14141b] text-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="badge-signal text-xs font-bold uppercase py-0.5 px-2.5">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-white">
                  {tool.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                  {tool.desc}
                </p>

                <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Key Capabilities</h4>
                  <ul className="space-y-1.5 text-xs text-white/90">
                    {tool.capabilities.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="text-signal font-bold">✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Section 2: Market Analysis Software */}
      <Section
        id="analysis-software"
        tight
        dark
        title="Market Analysis & Order Flow Software"
        intro="Look beneath standard retail candlestick charts. Our analysis software exposes real-time institutional liquidity, volume delta aggression, and value areas."
      >
        <div className="grid gap-6 md:grid-cols-2">
          {ANALYSIS_TOOLS.map((tool) => (
            <article
              key={tool.id}
              className="card-hover-glow p-6 sm:p-7 rounded-2xl border border-white/10 bg-[#16161e] text-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <span className="text-2xl">{tool.icon}</span>
                  <span className="rounded bg-white/10 px-2.5 py-1 text-xs font-bold text-signal uppercase tracking-wider">
                    {tool.tag}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl sm:text-2xl font-bold text-white">
                  {tool.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">
                  {tool.desc}
                </p>

                <div className="mt-5 space-y-2 border-t border-white/5 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white/50">Analytical Features</h4>
                  <ul className="space-y-1.5 text-xs text-white/90">
                    {tool.capabilities.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <span className="text-signal font-bold">✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Free E-books */}
      <Section
        id="ebooks"
        tight
        dark
        title="Free e-books"
        intro="Short, practical guides. Leave your details and we'll send the PDF straight to you."
      >
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {EBOOKS.map((book) => (
            <article key={book.id} className="card-hover-glow p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#14141b] text-white flex flex-col justify-between">
              <div>
                <span className="text-2xl">{book.icon}</span>
                <h3 className="mt-3 font-display text-lg sm:text-xl font-bold text-white">{book.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-white/75 leading-relaxed">{book.blurb}</p>
              </div>
              <Link to={`/contact?ebook=${book.id}`} className="btn-ghost mt-5 py-2 px-3 text-xs sm:text-sm font-semibold self-start">
                Get the e-book
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {/* Classroom Hardware Infrastructure */}
      <Section
        tight
        title="Classroom Hardware & Multi-Screen Labs"
        intro="How technology is deployed inside our Dubai Business Bay and India campus classrooms."
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] text-white">
            <span className="text-3xl block mb-3">🖥️</span>
            <h3 className="font-display text-xl font-bold text-white">Multi-Monitor Desks</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
              Every student workstation features dedicated dual-panel high-refresh monitors configured for simultaneous macro oversight, DOM orderflow, and execution charts.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] text-white">
            <span className="text-3xl block mb-3">⚡</span>
            <h3 className="font-display text-xl font-bold text-white">Low-Latency Feeds</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
              Direct market data lines connected to major liquidity centers, ensuring orderbook depths update with zero lag during volatile London and New York session opens.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-white/10 bg-[#121217] text-white">
            <span className="text-3xl block mb-3">🎙️</span>
            <h3 className="font-display text-xl font-bold text-white">Live Mentor Screen Broadcast</h3>
            <p className="mt-2 text-xs sm:text-sm text-white/70 leading-relaxed">
              Lead mentors broadcast high-resolution live markups and executions to student monitors and interactive remote Zoom feeds simultaneously with crystal-clear audio.
            </p>
          </div>
        </div>
      </Section>

      {/* Closing Call to Action */}
      <FinalCta
        title="See our algo & analysis tools in action."
        body="Visit our Dubai campus in Business Bay, drop into our India lab, or book a live 1-on-1 Zoom walkthrough with an advisor."
      />
    </>
  )
}
