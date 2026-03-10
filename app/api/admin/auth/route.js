// app/api/admin/auth/route.js
import { NextResponse }         from 'next/server'
import { computeExpectedToken } from '@/lib/auth'

// ── In-memory brute-force protection ──────────────────────────────────────────
// Tracks failed login attempts per IP. Resets on server restart.
// For multi-instance / serverless deployments, replace with a Redis store.
const loginAttempts = new Map()  // ip → { count, resetAt }
const MAX_ATTEMPTS  = 5
const WINDOW_MS     = 15 * 60 * 1000 // 15-minute lockout window

function checkRateLimit(ip) {
  const now   = Date.now()
  const entry = loginAttempts.get(ip)

  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

function clearRateLimit(ip) {
  loginAttempts.delete(ip)
}

// ── Constant-time string comparison ───────────────────────────────────────────
function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(request) {
  // Identify client IP for rate limiting
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many login attempts. Try again in 15 minutes.' },
      { status: 429 },
    )
  }

  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminPass) {
    // Server is misconfigured — ADMIN_PASSWORD missing from environment
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const { password } = await request.json()

  if (!safeEqual(password ?? '', adminPass)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  // Correct password — clear the rate-limit counter and issue the session cookie
  clearRateLimit(ip)

  const token    = await computeExpectedToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set('admin_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7, // 7 days
    secure:   process.env.NODE_ENV === 'production',
  })

  return response
}
