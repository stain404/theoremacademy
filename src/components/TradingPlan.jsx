/*
  An example of the thing every student leaves with: a one-page written trading plan,
  with the mentor's review note on it. It is the site's proof object, shown as a real
  document rather than described, and it is labelled as an example.
*/
import { teachers } from '../config/site'

const PLAN = [
  ['Markets', 'EUR/USD and GBP/USD only'],
  ['When I trade', 'London open, 12:00 to 15:00 Dubai time'],
  ['My setup', 'Pullback to a broken level, confirmed on the 1-hour chart'],
  ['Risk per trade', '1% of my account', true],
  ['Stop loss', 'Beyond the last swing, set before I enter'],
  ['I stop for the day', 'After two losses, or 3% down in a week'],
]

export default function TradingPlan({ className = '' }) {
  const mentor = teachers[0]
  return (
    <figure className={className}>
      <div className="relative">
        {/* the page: squarer corners than the site's cards, because it is a document */}
        <div className="rounded-[6px] border border-line-strong bg-surface px-6 pt-6 pb-8 shadow-[var(--shadow-lift)] sm:px-9 sm:pt-8 sm:pb-24">
          <div className="flex flex-col gap-1 border-b border-ink pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
            <p className="font-display text-2xl font-semibold">My trading plan</p>
            <p className="text-sm text-ink-soft">Forex Basic, week 6</p>
          </div>
          <dl className="mt-1">
            {PLAN.map(([k, v, marked]) => (
              <div key={k} className="grid gap-x-6 gap-y-0.5 border-b border-line py-3 sm:grid-cols-[9.5rem_1fr]">
                <dt className="text-sm text-ink-soft">{k}</dt>
                <dd className="font-medium">
                  {marked ? <mark className="bg-transparent bg-[linear-gradient(transparent_58%,rgb(242_178_49/0.45)_58%)] text-ink">{v}</mark> : v}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm text-ink-soft sm:max-w-[46%]">Signed and dated before the first live trade.</p>
        </div>

        {/* the mentor's review note, pinned over the lower corner of the page */}
        <div className="reveal-up relative mx-4 -mt-4 rounded-[10px] border border-brand/25 bg-brand-soft p-4 sm:absolute sm:right-[-1.25rem] sm:bottom-[-1.5rem] sm:mx-0 sm:mt-0 sm:w-[17rem] sm:rotate-[-1.5deg]">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full bg-brand text-xs font-semibold text-on-brand" aria-hidden="true">{mentor.initials}</span>
            <p className="text-sm font-semibold text-brand-deep">Reviewed by {mentor.name}</p>
          </div>
          <p className="mt-2 text-sm leading-snug text-ink">
            Good stop rule. Now write down what “confirmed” means for you, so you can check it on every trade.
          </p>
        </div>
      </div>
      <figcaption className="mt-10 text-sm text-ink-soft sm:mt-12">An example plan. Every student writes their own, in their own words.</figcaption>
    </figure>
  )
}
