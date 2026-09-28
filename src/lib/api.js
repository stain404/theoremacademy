// Data layer. Every screen talks to the backend only through these functions.
//
// This is a MOCK that stores everything in localStorage so the whole flow works
// before a backend is chosen. To go live, re-implement each function against the
// real backend (Supabase, Firebase, a custom API…) keeping the same signatures.
// Never ship this file to production: passwords are stored in plain text here.

import { programs } from '../config/site'
import { allLessons, curriculum } from '../config/curriculum'

const KEY = 'academy-mock-db'
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || empty()
  } catch {
    return empty()
  }
}
function empty() {
  return { users: [], session: null, orders: [], enrollments: [], progress: [], quizResults: [], tickets: [] }
}
function save(db) {
  localStorage.setItem(KEY, JSON.stringify(db))
}
const publicUser = ({ password, ...u }) => u

// ---------- Auth ----------

export async function signUp({ name, email, phone, password }) {
  await delay()
  const db = load()
  email = email.trim().toLowerCase()
  if (db.users.some((u) => u.email === email)) throw new Error('An account with this email already exists. Log in instead.')
  const user = { id: uid(), name, email, phone, password, createdAt: Date.now(), onboarded: false }
  db.users.push(user)
  db.session = user.id
  save(db)
  return publicUser(user)
}

export async function signIn({ email, password }) {
  await delay()
  const db = load()
  const user = db.users.find((u) => u.email === email.trim().toLowerCase())
  if (!user || user.password !== password) throw new Error('Email or password is incorrect.')
  db.session = user.id
  save(db)
  return publicUser(user)
}

export async function signOut() {
  const db = load()
  db.session = null
  save(db)
}

export function getSessionUser() {
  const db = load()
  const user = db.users.find((u) => u.id === db.session)
  return user ? publicUser(user) : null
}

export async function updateProfile(userId, patch) {
  await delay(200)
  const db = load()
  const user = db.users.find((u) => u.id === userId)
  Object.assign(user, patch)
  save(db)
  return publicUser(user)
}

// ---------- Payments ----------
// Replace with Razorpay (India) / Stripe or Telr (UAE). The real flow is:
// createOrder on the server → open the gateway checkout → verify the signature
// on the server → create the enrollment. Never trust the browser to mark an order paid.

export async function createOrder(userId, programId, currency) {
  await delay(200)
  const db = load()
  const program = programs.find((p) => p.id === programId)
  const order = {
    id: 'ord_' + uid(),
    userId,
    programId,
    currency,
    amount: currency === 'AED' ? program.priceAed : program.price,
    status: 'created',
    createdAt: Date.now(),
  }
  db.orders.push(order)
  save(db)
  return order
}

// Mock rule: a card number ending in 0002 is declined, anything else succeeds.
export async function payOrder(orderId, { cardNumber }) {
  await delay(1400)
  const db = load()
  const order = db.orders.find((o) => o.id === orderId)
  const declined = cardNumber.replace(/\s/g, '').endsWith('0002')
  order.status = declined ? 'failed' : 'paid'
  order.paidAt = declined ? null : Date.now()
  if (!declined && !db.enrollments.some((e) => e.userId === order.userId && e.programId === order.programId)) {
    db.enrollments.push({ id: uid(), userId: order.userId, programId: order.programId, orderId, enrolledAt: Date.now() })
  }
  save(db)
  if (declined) throw new Error('Your bank declined the payment. No money was taken. Try another card or UPI.')
  return order
}

// ---------- Courses, progress, quizzes ----------

export async function getEnrollments(userId) {
  await delay(150)
  return load().enrollments.filter((e) => e.userId === userId)
}

export async function getProgress(userId, programId) {
  const db = load()
  const done = new Set(db.progress.filter((p) => p.userId === userId && p.programId === programId).map((p) => p.lessonId))
  const quizzes = db.quizResults.filter((r) => r.userId === userId && r.programId === programId)
  const lessons = allLessons(programId)
  const modules = curriculum[programId] || []
  const passedModules = modules.filter((m) => quizzes.some((q) => q.moduleId === m.id && q.passed)).length
  const total = lessons.length + modules.length
  const complete = done.size + passedModules
  return {
    completedLessons: done,
    quizzes,
    percent: total ? Math.round((complete / total) * 100) : 0,
    finished: total > 0 && complete === total,
  }
}

export async function setLessonComplete(userId, programId, lessonId, complete) {
  const db = load()
  db.progress = db.progress.filter((p) => !(p.userId === userId && p.lessonId === lessonId))
  if (complete) db.progress.push({ userId, programId, lessonId, at: Date.now() })
  save(db)
}

export const PASS_MARK = 0.7

export async function submitQuiz(userId, programId, moduleId, answers) {
  await delay(300)
  const module = curriculum[programId].find((m) => m.id === moduleId)
  const correct = module.quiz.filter((q, i) => answers[i] === q.answer).length
  const score = correct / module.quiz.length
  const result = { id: uid(), userId, programId, moduleId, correct, total: module.quiz.length, passed: score >= PASS_MARK, at: Date.now() }
  const db = load()
  db.quizResults.push(result)
  save(db)
  return result
}

// ---------- Support ----------

export async function createTicket(userId, { topic, message }) {
  await delay()
  const db = load()
  const ticket = { id: 'T-' + (1000 + db.tickets.length + 1), userId, topic, message, status: 'Open', createdAt: Date.now() }
  db.tickets.push(ticket)
  save(db)
  return ticket
}

export async function getTickets(userId) {
  await delay(150)
  return load().tickets.filter((t) => t.userId === userId).reverse()
}
