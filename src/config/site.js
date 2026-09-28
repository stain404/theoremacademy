// All academy content lives here — edit this file to change names, addresses, programs and prices.
// Anything marked "placeholder" must be replaced with real information before launch.

export const site = {
  name: 'Pipwise Academy', // placeholder: replace with the academy's real name
  description: 'A trading academy in Dubai and India, teaching forex, crypto and equity in small, mentor-led batches, in person and online.',
  email: 'hello@pipwise.example', // placeholder
  phone: '+971 00 000 0000', // placeholder
  whatsapp: '+91 00000 00000', // placeholder
  whatsappLink: 'https://wa.me/910000000000', // placeholder
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
    photo: null,
    teaches: ['Forex Basic', 'Forex Advanced'],
    focus: 'Price action, market structure and risk management',
    bio: 'Farhan leads the forex programs. His classes start from a blank chart and end with a written plan, and he reviews the trades every student logs during the course.', // placeholder: replace with real bio
    initials: 'F',
  },
  {
    name: 'Sohail',
    role: 'Mentor, crypto and equity',
    photo: null,
    teaches: ['Crypto Trading', 'Equity Course'],
    focus: 'Crypto market cycles, exchange safety and equity swing trading',
    bio: 'Sohail teaches the crypto and equity programs. He puts as much time into protecting capital (wallet security, position size, avoiding scams) as into finding trades.', // placeholder: replace with real bio
    initials: 'S',
  },
]

// price is in INR; priceAed is shown for Dubai students
export const programs = [
  {
    id: 'forex-basic',
    title: 'Forex Basic',
    market: 'Forex',
    level: 'Beginner',
    duration: '6 weeks',
    format: 'In person or online',
    price: 24999,
    priceAed: 1099,
    featured: true,
    summary: 'Currency pairs, pips, lots and leverage. You learn to read a chart, place a trade, and size it so that one loss never hurts.',
    outcomes: ['How the forex market and brokers work', 'Candlesticks, support and resistance', 'Position sizing and stop losses', 'A written trading plan of your own'],
  },
  {
    id: 'forex-advanced',
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
    id: 'crypto',
    title: 'Crypto Trading',
    market: 'Crypto',
    level: 'All levels',
    duration: '6 weeks',
    format: 'In person or online',
    price: 29999,
    priceAed: 1299,
    summary: 'Spot and futures on the major exchanges, market cycles, wallets, and how to stay safe from scams.',
    outcomes: ['Exchanges, wallets and security', 'Spot vs futures and funding rates', 'Reading crypto market cycles', 'Risk rules for a volatile market'],
  },
  {
    id: 'equity',
    title: 'Equity Course',
    market: 'Equity',
    level: 'Beginner',
    duration: '6 weeks',
    format: 'In person or online',
    price: 19999,
    priceAed: 899,
    summary: 'Indian and US stock markets: reading fundamentals, swing trading setups, and building a watchlist.',
    outcomes: ['How stock exchanges work', 'Reading financial statements', 'Swing trading setups', 'Building and managing a watchlist'],
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
    program: 'Crypto Trading, online batch',
    quote: 'The session on wallet security alone was worth it. I moved everything off an exchange I should never have trusted.',
  },
  {
    sample: true,
    name: 'Student name',
    program: 'Equity Course, India batch',
    quote: 'I work full time, so the recordings mattered. I watched on Sundays and brought my questions to the weekday class.',
  },
]

export const formatINR = (n) => '₹' + n.toLocaleString('en-IN')
