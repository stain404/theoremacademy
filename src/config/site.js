// All academy content lives here — edit this file to change names, addresses, programs and prices.
// Anything marked "placeholder" must be replaced with real information before launch.

export const site = {
  name: 'Theorem Institute',
  description: 'Premier financial trading educational institute with campuses in Dubai (Business Bay) and India, plus live interactive global cohorts.',
  email: 'admissions@theoreminstitute.com',
  phone: '+971 4 240 8899',
  whatsapp: '+971 58 500 8921',
  whatsappLink: 'https://wa.me/971585008921',
  // placeholder: replace with the academy's real Google Business Profile review link
  // (from Google Business Profile → "Ask for reviews" → Share review form)
  googleReviewLink: 'https://g.page/r/REPLACE-WITH-GOOGLE-PLACE-ID/review',
  social: [
    { label: 'Instagram', href: '#' }, // placeholder links
    { label: 'YouTube', href: '#' },
    { label: 'LinkedIn', href: '#' },
  ],
}

export const locations = [
  {
    city: 'Dubai',
    country: 'UAE',
    address: 'Office 000, Business Bay, Dubai', // placeholder
    hours: 'Saturday to Thursday, 10:00 to 19:00',
  },
  {
    city: 'India',
    country: 'India',
    address: 'Address to be confirmed', // placeholder
    hours: 'Monday to Saturday, 10:00 to 19:00',
  },
  {
    city: 'Online',
    country: 'Anywhere',
    address: 'Live classes on Zoom, recorded to your student portal',
    hours: 'Weekday evening and weekend batches',
  },
]

// photo: path under /public, e.g. '/mentors/farhan.jpg'. Until then a captioned placeholder is shown.
export const teachers = [
  {
    name: 'Farhan',
    role: 'Lead mentor, forex',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    teaches: ['Forex Basic', 'Forex Intermediate', 'Forex Advanced'],
    focus: 'Price action, market structure and risk management',
    bio: 'Farhan leads the forex programs. His classes start from a blank chart and end with a written plan, and he reviews the trades every student logs during the course.',
    initials: 'F',
  },
  {
    name: 'Sohail',
    role: 'Mentor, crypto and equity',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    teaches: ['Crypto Basic', 'Crypto Intermediate', 'Crypto Advanced', 'Equity Basic', 'Equity Intermediate', 'Equity Advanced'],
    focus: 'Crypto market cycles, exchange safety and equity swing trading',
    bio: 'Sohail teaches the crypto and equity programs. He puts as much time into protecting capital (wallet security, position size, avoiding scams) as into finding trades.',
    initials: 'S',
  },
]

// price is in INR; priceAed is shown for Dubai students.
// Each market (Forex, Crypto, Equity) now runs as three tiers: Basic, Intermediate, Advanced.
// comingSoon programs have no published syllabus or price yet — their detail page shows a
// "curriculum being finalised" notice instead of a module list, and no fee is shown anywhere.
export const programs = [
  {
    id: 'forex-basic',
    audience: 'People who have never traded, or who have traded from tips and signals and want to understand what they are doing. No prior knowledge needed.', // placeholder copy: confirm with the academy
    title: 'Forex Basic',
    market: 'Forex',
    level: 'Basic',
    duration: '6 weeks',
    format: 'In person or online',
    price: 24999,
    priceAed: 1099,
    featured: true,
    summary: 'Currency pairs, pips, lots and leverage. You learn to read a chart, place a trade, and size it so that one loss never hurts.',
    outcomes: ['How the forex market and brokers work', 'Candlesticks, support and resistance', 'Position sizing and stop losses', 'A written trading plan of your own'],
  },
  {
    id: 'forex-intermediate',
    comingSoon: true,
    audience: 'Students who have finished Forex Basic, or who already place and size their own trades and want a more structured, reviewed process.', // placeholder copy: confirm with the academy
    title: 'Forex Intermediate',
    market: 'Forex',
    level: 'Intermediate',
    duration: '6 weeks', // placeholder: confirm length
    format: 'In person or online',
    summary: 'The bridge between a beginner and an advanced trader: reading higher-timeframe structure, trading with a plan, and reviewing every trade.',
    outcomes: ['Multi-timeframe chart reading', 'Building and following a trading plan', 'Common mistakes at this stage', 'Preparing for Forex Advanced'],
  },
  {
    id: 'forex-advanced',
    audience: 'Traders who already know the basics (or have finished Forex Basic) and want a repeatable, reviewed process. You should be able to place and size a trade on your own.', // placeholder copy: confirm with the academy
    title: 'Forex Advanced',
    market: 'Forex',
    level: 'Advanced',
    duration: '8 weeks',
    format: 'In person or online',
    price: 44999,
    priceAed: 1999,
    summary: 'Market structure, liquidity and multi-timeframe entries, with a live-trading review every week.',
    outcomes: ['Market structure and liquidity', 'Multi-timeframe analysis', 'Trade journaling and review', 'Prop-firm challenge preparation'],
  },
  {
    id: 'crypto-basic',
    audience: 'Anyone who holds or wants to trade crypto and wants to do it safely, from first-time buyers to people already trading futures without a plan.', // placeholder copy: confirm with the academy
    title: 'Crypto Basic',
    market: 'Crypto',
    level: 'Basic',
    duration: '6 weeks',
    format: 'In person or online',
    price: 29999,
    priceAed: 1299,
    summary: 'Spot and futures on the major exchanges, market cycles, wallets, and how to stay safe from scams.',
    outcomes: ['Exchanges, wallets and security', 'Spot vs futures and funding rates', 'Reading crypto market cycles', 'Risk rules for a volatile market'],
  },
  {
    id: 'crypto-intermediate',
    comingSoon: true,
    audience: 'Students who have finished Crypto Basic and want to trade spot and futures with a tested process rather than a feeling.', // placeholder copy: confirm with the academy
    title: 'Crypto Intermediate',
    market: 'Crypto',
    level: 'Intermediate',
    duration: '6 weeks', // placeholder: confirm length
    format: 'In person or online',
    summary: 'Building a repeatable crypto strategy: position sizing across volatile markets, journaling trades, and reading on-chain and funding data.',
    outcomes: ['Position sizing for volatile markets', 'Reading funding and open interest', 'Journaling and reviewing crypto trades', 'Preparing for Crypto Advanced'],
  },
  {
    id: 'crypto-advanced',
    comingSoon: true,
    audience: 'Experienced crypto traders who want institutional-style market structure and risk tools applied to digital assets.', // placeholder copy: confirm with the academy
    title: 'Crypto Advanced',
    market: 'Crypto',
    level: 'Advanced',
    duration: '8 weeks', // placeholder: confirm length
    format: 'In person or online',
    summary: 'Market structure and liquidity concepts applied to Bitcoin, Ethereum and major altcoins, with a weekly live-trade review.',
    outcomes: ['Market structure across crypto pairs', 'Liquidity and multi-timeframe entries', 'Managing a live crypto portfolio', 'Weekly reviewed trade journal'],
  },
  {
    id: 'equity-basic',
    audience: 'Working professionals and beginners who want to trade or invest in Indian and US stocks with a clear method rather than tips.', // placeholder copy: confirm with the academy
    title: 'Equity Basic',
    market: 'Equity',
    level: 'Basic',
    duration: '6 weeks',
    format: 'In person or online',
    price: 19999,
    priceAed: 899,
    summary: 'Indian and US stock markets: reading fundamentals, swing trading setups, and building a watchlist.',
    outcomes: ['How stock exchanges work', 'Reading financial statements', 'Swing trading setups', 'Building and managing a watchlist'],
  },
  {
    id: 'equity-intermediate',
    comingSoon: true,
    audience: 'Students who have finished Equity Basic and want to move from watching a watchlist to trading it with a plan.', // placeholder copy: confirm with the academy
    title: 'Equity Intermediate',
    market: 'Equity',
    level: 'Intermediate',
    duration: '6 weeks', // placeholder: confirm length
    format: 'In person or online',
    summary: 'Sector and index context, position sizing for equities, and a reviewed trade journal across Indian and US markets.',
    outcomes: ['Sector and index context', 'Position sizing for equities', 'Journaling swing trades', 'Preparing for Equity Advanced'],
  },
  {
    id: 'equity-advanced',
    comingSoon: true,
    audience: 'Experienced equity traders ready for a full portfolio approach across Indian and US markets.', // placeholder copy: confirm with the academy
    title: 'Equity Advanced',
    market: 'Equity',
    level: 'Advanced',
    duration: '8 weeks', // placeholder: confirm length
    format: 'In person or online',
    summary: 'Building and managing a full equity portfolio, with sector rotation, risk budgeting and a weekly live-trade review.',
    outcomes: ['Portfolio construction and risk budgeting', 'Sector rotation', 'Advanced chart and fundamentals reading', 'Weekly reviewed trade journal'],
  },
]

// SAMPLE stories to show the layout. They are NOT real students and are hidden in production
// builds (see Testimonials). Replace with real, consented student stories before launch.
export const stories = [
  {
    sample: true,
    name: 'Student name',
    program: 'Forex Basic, Dubai batch',
    quote: 'I had been trading off Telegram signals for a year and could not explain a single trade I took. The first thing Farhan did was make me write down why I was entering, where I was wrong, and what I would lose. Six weeks later I take fewer trades, and I can explain every one.',
    outcome: 'Now trades a small live account with a written plan',
  },
  {
    sample: true,
    name: 'Student name',
    program: 'Crypto Basic, online batch',
    quote: 'The session on wallet security alone was worth it. I moved everything off an exchange I should never have trusted.',
  },
  {
    sample: true,
    name: 'Student name',
    program: 'Equity Basic, India batch',
    quote: 'I work full time, so the recordings mattered. I watched on Sundays and brought my questions to the weekday class.',
  },
]

// The offer: what every program fee includes, and the refund terms.
// placeholder: confirm every line with the academy before launch; these are promises to students.
export const offer = {
  includes: [
    'Live classes with your mentor, in Dubai, India or online',
    'Recordings of every class in your student portal',
    'Module notes to download',
    'A mentor review of the trades you log during the program',
    'Module quizzes and a certificate on completion',
    'Help and support on WhatsApp for the length of the program',
  ],
  refundDays: 7,
  refundTerms: 'Full refund if you cancel within 7 days of enrolling and before attending more than two classes.',
}

// Questions people ask before enrolling. Shown on the homepage.
// placeholder: confirm the answers with the academy.
export const faqs = [
  ['Do I need any trading experience?', 'No. Forex Basic starts from zero: what a currency pair is, how a broker works, and how to place and size a trade. If you already trade, an advisor can check whether Forex Advanced fits better.'],
  ['What if I miss a live class?', 'Every class is recorded and added to your student portal, usually within 24 hours. You can bring questions about it to the next class.'],
  ['Will this make me money?', 'No course can promise that, and you should be wary of any that does. We teach a method, risk management and the habit of reviewing your own trades. Trading carries real risk of loss.'],
  ['Can I study online from anywhere?', 'Yes. Online batches are live, at weekday evening and weekend times, with the same mentors, notes and certificate as the classroom batches.'],
  ['What if the program is not right for me?', 'You get a full refund if you cancel within 7 days of enrolling and before attending more than two classes.'],
  ['How do I pay?', 'Online by card or UPI in rupees, or by card or Apple Pay in dirhams. Your seat is confirmed as soon as the payment goes through.'],
]

export const formatINR = (n) => '₹' + n.toLocaleString('en-IN')
export const formatAED = (n) => 'AED ' + n.toLocaleString('en-AE')
export const lowestPrice = () => Math.min(...programs.map((p) => p.price).filter(Boolean))

// The bundle of the 4 published programs (the 5 comingSoon tiers aren't priced yet, so
// they aren't part of it). Pricing isn't shown on the site right now (see Offer in
// sections.jsx) — these figures are kept correct for when it is, and for the mock checkout.
export const bundlePackage = {
  id: 'all-programs-bundle',
  title: 'All 4 Programs Bundle',
  subtitle: 'Forex, Crypto and Equity, together',
  discountPercent: 40,
  totalInr: 119996, // 24,999 + 44,999 + 29,999 + 19,999
  discountedInr: 71998, // 40% discount
  savingsInr: 47998,
  totalAed: 5296, // 1,099 + 1,999 + 1,299 + 899
  discountedAed: 3178, // 40% discount
  savingsAed: 2118,
  totalWeeks: '26 weeks of live guided mentorship',
  certificationsCount: 4,
  programsIncluded: ['Forex Basic', 'Forex Advanced', 'Crypto Basic', 'Equity Basic'],
  // so the (unlinked but still reachable) Register page can list it like a program
  outcomes: ['All 4 flagship programs, back to back', 'A written plan for each market', '4 reviewed trade journals', '4 verified certificates'],
}
