// Course content per program: modules → lessons, plus one short quiz per module.
// In production this moves to the database so mentors can edit it without a deploy.

const lesson = (id, title, minutes) => ({ id, title, minutes })

export const curriculum = {
  'forex-basic': [
    {
      id: 'fb-1', title: 'How forex works',
      lessons: [lesson('fb-1-1', 'What moves a currency pair', 14), lesson('fb-1-2', 'Brokers, spreads and sessions', 18), lesson('fb-1-3', 'Pips, lots and leverage', 22)],
      quiz: [
        { q: 'On EUR/USD, which currency is the quote currency?', options: ['EUR', 'USD', 'Both', 'Neither'], answer: 1 },
        { q: 'A standard lot is how many units of the base currency?', options: ['1,000', '10,000', '100,000', '1,000,000'], answer: 2 },
        { q: 'Which session overlap usually has the most volume?', options: ['Sydney–Tokyo', 'Tokyo–London', 'London–New York', 'New York–Sydney'], answer: 2 },
      ],
    },
    {
      id: 'fb-2', title: 'Reading a chart',
      lessons: [lesson('fb-2-1', 'Candlesticks explained', 16), lesson('fb-2-2', 'Support and resistance', 20), lesson('fb-2-3', 'Trends and ranges', 19)],
      quiz: [
        { q: 'A candle that closes above its open is usually called…', options: ['Bearish', 'Bullish', 'Doji', 'Gap'], answer: 1 },
        { q: 'When price breaks above resistance, that level often becomes…', options: ['Irrelevant', 'Support', 'A gap', 'The spread'], answer: 1 },
        { q: 'Higher highs and higher lows describe…', options: ['A downtrend', 'A range', 'An uptrend', 'Low volatility'], answer: 2 },
      ],
    },
    {
      id: 'fb-3', title: 'Risk management',
      lessons: [lesson('fb-3-1', 'The 1% rule', 12), lesson('fb-3-2', 'Placing a stop loss', 17), lesson('fb-3-3', 'Position size calculator', 21)],
      quiz: [
        { q: 'With a $5,000 account and 1% risk, the most you should lose on one trade is…', options: ['$5', '$50', '$500', '$1,000'], answer: 1 },
        { q: 'A stop loss should be placed…', options: ['After the trade loses', 'Where your trade idea is proven wrong', 'At a round number always', 'Never'], answer: 1 },
        { q: 'Risk-to-reward of 1:2 means…', options: ['Risk 2 to make 1', 'Risk 1 to make 2', 'Win 2 of 3 trades', 'Use 2x leverage'], answer: 1 },
      ],
    },
  ],
  'forex-advanced': [
    {
      id: 'fa-1', title: 'Market structure',
      lessons: [lesson('fa-1-1', 'Swing points and breaks of structure', 24), lesson('fa-1-2', 'Change of character', 20), lesson('fa-1-3', 'Premium and discount zones', 22)],
      quiz: [
        { q: 'A break of structure in an uptrend happens when price…', options: ['Makes a new higher high', 'Touches a moving average', 'Closes flat', 'Gaps down'], answer: 0 },
        { q: 'In an uptrend, you generally look to buy in the…', options: ['Premium zone', 'Discount zone', 'Middle only', 'Any zone'], answer: 1 },
      ],
    },
    {
      id: 'fa-2', title: 'Liquidity and entries',
      lessons: [lesson('fa-2-1', 'Where stop losses cluster', 18), lesson('fa-2-2', 'Multi-timeframe entries', 26), lesson('fa-2-3', 'Order blocks and imbalances', 25)],
      quiz: [
        { q: 'Equal highs on a chart often attract price because…', options: ['Stops rest above them', 'Brokers set them', 'They are round numbers', 'Volume is zero there'], answer: 0 },
        { q: 'A common top-down order is…', options: ['1m → 1H → Daily', 'Daily → 1H → 5m', '5m only', 'Weekly only'], answer: 1 },
      ],
    },
    {
      id: 'fa-3', title: 'Trading like a professional',
      lessons: [lesson('fa-3-1', 'Journaling every trade', 15), lesson('fa-3-2', 'Prop-firm rules', 19), lesson('fa-3-3', 'Weekly performance review', 18)],
      quiz: [
        { q: 'The main purpose of a trade journal is to…', options: ['Show friends', 'Find patterns in your own mistakes', 'Avoid taxes', 'Predict news'], answer: 1 },
        { q: 'Most prop-firm challenges fail because of…', options: ['Daily drawdown limits', 'Slow internet', 'Spreads', 'Weekends'], answer: 0 },
      ],
    },
  ],
  'crypto-basic': [
    {
      id: 'cr-1', title: 'Crypto foundations',
      lessons: [lesson('cr-1-1', 'Bitcoin, Ethereum and altcoins', 18), lesson('cr-1-2', 'Exchanges and wallets', 20), lesson('cr-1-3', 'Keeping your funds safe', 16)],
      quiz: [
        { q: 'Who controls the funds in a self-custody wallet?', options: ['The exchange', 'You, via your seed phrase', 'The blockchain', 'Your bank'], answer: 1 },
        { q: 'Someone on Telegram asks for your seed phrase to "verify" your account. You should…', options: ['Share it', 'Share half', 'Never share it', 'Email it instead'], answer: 2 },
      ],
    },
    {
      id: 'cr-2', title: 'Trading crypto',
      lessons: [lesson('cr-2-1', 'Spot vs futures', 22), lesson('cr-2-2', 'Funding rates and liquidation', 21), lesson('cr-2-3', 'Market cycles and Bitcoin dominance', 24)],
      quiz: [
        { q: 'Liquidation on a futures position happens when…', options: ['You take profit', 'Your margin can no longer cover the loss', 'The exchange closes', 'Funding is positive'], answer: 1 },
        { q: 'Spot trading means you…', options: ['Own the actual coin', 'Borrow to trade', 'Trade a contract only', 'Cannot sell'], answer: 0 },
      ],
    },
  ],
  'equity-basic': [
    {
      id: 'eq-1', title: 'Stock market basics',
      lessons: [lesson('eq-1-1', 'NSE, BSE, NYSE and NASDAQ', 15), lesson('eq-1-2', 'Opening a demat account', 12), lesson('eq-1-3', 'Order types', 17)],
      quiz: [
        { q: 'In India, shares you buy are held in a…', options: ['Savings account', 'Demat account', 'Crypto wallet', 'Fixed deposit'], answer: 1 },
        { q: 'A limit order…', options: ['Fills at any price', 'Fills only at your price or better', 'Is only for selling', 'Expires instantly'], answer: 1 },
      ],
    },
    {
      id: 'eq-2', title: 'Picking and trading stocks',
      lessons: [lesson('eq-2-1', 'Reading a balance sheet', 23), lesson('eq-2-2', 'Swing trading setups', 25), lesson('eq-2-3', 'Building a watchlist', 14)],
      quiz: [
        { q: 'Revenue minus all expenses is…', options: ['Market cap', 'Net profit', 'Dividend', 'Volume'], answer: 1 },
        { q: 'A swing trade is usually held for…', options: ['Seconds', 'Days to weeks', 'Decades', 'Exactly one hour'], answer: 1 },
      ],
    },
  ],
}

export const allLessons = (programId) => (curriculum[programId] || []).flatMap((m) => m.lessons)
