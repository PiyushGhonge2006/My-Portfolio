import nodemailer from 'nodemailer'
import ContactMessage from '../models/ContactMessage.js'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_MESSAGES_PER_IP = 3
const ipHits = new Map()

function getHits(ip) {
  const now = Date.now()
  const hits = (ipHits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS)
  ipHits.set(ip, hits)
  return hits
}

function isRateLimited(ip) {
  return getHits(ip).length >= MAX_MESSAGES_PER_IP
}

function registerHit(ip) {
  const hits = getHits(ip)
  hits.push(Date.now())
  ipHits.set(ip, hits)
}

function clean(value) {
  return String(value ?? '').trim().replace(/<[^>]*>/g, '')
}

export function sendContactEmail({ name, email, subject, message }) {
  const from = process.env.EMAIL_FROM
  const pass = process.env.EMAIL_PASS
  const to = process.env.CONTACT_EMAIL || from

  if (!from || !pass || !to) {
    const err = new Error('Email service is not configured. Set EMAIL_FROM, EMAIL_PASS and CONTACT_EMAIL in server/.env')
    err.statusCode = 500
    throw err
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: from, pass },
  })

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
  ]
  if (subject) lines.push(`Subject: ${subject}`)
  lines.push('', message, '', '—', `Received via Piyush Ghonge's Portfolio`)

  return transporter.sendMail({
    from: `"Piyush Ghonge's Portfolio" <${from}>`,
    to,
    replyTo: email,
    subject: `Portfolio Contact — ${name}`,
    text: lines.join('\n'),
  })
}

export async function submitContact(req, res) {
  const ip = req.ip || req.socket?.remoteAddress || 'unknown'

  if (isRateLimited(ip)) {
    return res.status(429).json({
      message: 'Too many messages. Please wait a few minutes and try again.',
    })
  }

  const body = req.body || {}
  if (body.website) {
    return res.status(400).json({ message: 'Invalid submission.' })
  }

  const name = clean(body.name)
  const email = (body.email || '').trim().toLowerCase()
  const subject = clean(body.subject)
  const message = clean(body.message)

  const errors = {}
  if (!name || name.length < 2 || name.length > 100) {
    errors.name = 'Please enter your name (2-100 characters).'
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 200) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!message || message.length < 10 || message.length > 5000) {
    errors.message = 'Your message must be at least 10 characters (max 5000).'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Please fix the highlighted fields.', errors })
  }

  try {
    await ContactMessage.create({ name, email, subject: subject.slice(0, 200), message })
  } catch (saveErr) {
    console.error('Failed to save contact message to database:', saveErr)
  }

  registerHit(ip)

  try {
    await sendContactEmail({ name, email, subject, message })
    return res.status(201).json({ message: "Message sent successfully! I'll get back to you soon." })
  } catch (err) {
    console.error('Failed to send contact email:', err)
    return res.status(500).json({
      message: 'Unable to send your message. Please try again or contact me directly by email.',
    })
  }
}