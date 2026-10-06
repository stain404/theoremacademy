// All academy content lives here — edit this file to change names, addresses, programs and prices.
// Anything marked "placeholder" must be replaced with real information before launch.

export const site = {
  name: 'Theorem Institute',
  description: 'A trading academy in Business Bay, Dubai, and in India, teaching forex, crypto and equity in small cohorts, in person and live online.',
  email: 'admissions@theoreminstitute.com',
  phone: '+971 4 240 8899',
  whatsapp: '+971 58 500 8921',
  whatsappLink: 'https://wa.me/971585008921',
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

/*
  Hero video stage: one slot per way to study. To add a video, put the file in /public/hero/
  and set `video` (and optionally `videoMobile`, a smaller file for phones). Until a slot has
  a video, its `poster` still image is shown. Keep clips short (6–15 s), muted and under ~3 MB.
  `tz` drives the live local time shown on the slot's tab.
*/
export const heroSlots = [
  {
    id: 'dubai',
    label: 'Dubai campus',
    short: 'Dubai',
    caption: 'Business Bay, Dubai', // describe what the clip shows; update when a campus video is added
    tz: 'Asia/Dubai',
    video: null, // placeholder: add '/hero/dubai.mp4'
    videoMobile: null,
    poster: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80', // placeholder: replace with a still of the real campus
  },
  {
    id: 'online',
    label: 'Live online',
    short: 'Online',
    caption: 'Reading price on a live chart',
    tz: null,
    video: '/hero/online.mp4',
    videoMobile: '/hero/online-mobile.mp4',
    poster: '/hero/online-poster.jpg',
  },
  {
    id: 'india',
    label: 'India campus',
    short: 'India',
    caption: 'India',
    tz: 'Asia/Kolkata',
    video: null, // placeholder: add '/hero/india.mp4'
    videoMobile: null,
    poster: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1600&q=80', // placeholder: replace with a still of the real campus
  },
]

// Numbers shown under the hero. placeholder: confirm every figure with the academy before launch.
export const heroStats = [
  ['4.9 out of 5', 'average student rating'],
  ['1,850+', 'students taught'],
  ['15 or fewer', 'traders in each cohort'],
]

// photo: path under /public, e.g. '/mentors/farhan.jpg'. Until then a captioned placeholder is shown.
export const teachers = [
  {
    name: 'Farhan',
    role: 'Lead mentor, forex',
    photo: null, // placeholder: add '/mentors/farhan.jpg' (a real photo; stock portraits removed)
    teaches: ['Forex Basic', 'Forex Advanced'],
    focus: 'Price action, market structure and risk management',
    bio: 'Farhan leads the forex programs. His classes start from a blank chart and end with a written plan, and he reviews the trades every student logs during the course.',
    initials: 'F',
  },
  {
    name: 'Sohail',
    role: 'Mentor, crypto and equity',
    photo: null, // placeholder: add '/mentors/sohail.jpg' (a real photo; stock portraits removed)
    teaches: ['Crypto Trading', 'Equity Course'],
    focus: 'Crypto market cycles, exchange safety and equity swing trading',
    bio: 'Sohail teaches the crypto and equity programs. He puts as much time into protecting capital (wallet security, position size, avoiding scams) as into finding trades.',
    initials: 'S',
  },
]

// price is in INR; priceAed is shown for Dubai students
export const programs = [
  {
    id: 'forex-basic',
    audience: 'People who have never traded, or who have traded from tips and signals and want to understand what they are doing. No prior knowledge needed.', // placeholder copy: confirm with the academy
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
    id: 'crypto',
    audience: 'Anyone who holds or wants to trade crypto and wants to do it safely, from first-time buyers to people already trading futures without a plan.', // placeholder copy: confirm with the academy
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
    audience: 'Working professionals and beginners who want to trade or invest in Indian and US stocks with a clear method rather than tips.', // placeholder copy: confirm with the academy
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
export const lowestPrice = () => Math.min(...programs.map((p) => p.price))

// The all-four-programs bundle. Its prices and length are derived from the programs above,
// so changing a program's fee updates the bundle too. It has the same fields as a program
// (price, level, duration, outcomes) so sign-up and checkout can list it like one; paying for
// it enrols the student in each of the four programs (see payOrder in lib/api.js).
const BUNDLE_DISCOUNT = 10 // percent
const sum = (key) => programs.reduce((n, p) => n + p[key], 0)
const discounted = (n) => Math.round(n * (1 - BUNDLE_DISCOUNT / 100))
const totalWeeks = programs.reduce((n, p) => n + parseInt(p.duration, 10), 0)

export const bundlePackage = {
  id: 'all-programs-bundle',
  bundle: true,
  title: 'All four programs',
  market: 'Forex, crypto and equity',
  level: 'All levels',
  duration: `${totalWeeks} weeks`,
  discountPercent: BUNDLE_DISCOUNT,
  totalInr: sum('price'),
  discountedInr: discounted(sum('price')),
  savingsInr: sum('price') - discounted(sum('price')),
  totalAed: sum('priceAed'),
  discountedAed: discounted(sum('priceAed')),
  savingsAed: sum('priceAed') - discounted(sum('priceAed')),
  totalWeeks: `${totalWeeks} weeks of live classes`,
  certificationsCount: programs.length,
  programsIncluded: programs.map((p) => p.title),
  programIds: programs.map((p) => p.id),
  outcomes: programs.map((p) => p.title),
  // the fields every program has, so lists and checkout treat the bundle like one
  get price() { return this.discountedInr },
  get priceAed() { return this.discountedAed },
  get originalPrice() { return this.totalInr },
  get originalPriceAed() { return this.totalAed },
}

// A program or the bundle, by id.
export const findOffering = (id) => (id === bundlePackage.id ? bundlePackage : programs.find((p) => p.id === id))
