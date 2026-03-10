// lib/auth.js — shared admin authentication helpers
// Safe to import from both Edge (middleware) and Node.js (API routes) runtimes.
// All crypto uses the Web Crypto API, which is available in both environments.

/**
 * SHA-256 hash of any string, returned as a hex string.
 */
async function sha256(input) {
  const encoder = new TextEncoder()
  const hashBuf = await crypto.subtle.digest('SHA-256', encoder.encode(input))
  return Array.from(new Uint8Array(hashBuf))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Computes the expected session token.
 * Token = SHA-256( ADMIN_PASSWORD + ":" + SESSION_SECRET )
 * The SESSION_SECRET acts as a pepper — even if the password is leaked,
 * an attacker cannot forge a valid session cookie without the secret.
 * Returns null if either env var is missing (server is misconfigured).
 */
export async function computeExpectedToken() {
  const password = process.env.ADMIN_PASSWORD
  const secret   = process.env.SESSION_SECRET
  if (!password || !secret) return null
  return sha256(`${password}:${secret}`)
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * Returns true only when both strings are identical.
 */
function safeEqual(a, b) {
  if (!a || !b || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Verifies an admin session token.
 * Returns true if the token matches the expected value.
 */
export async function verifyAdminToken(token) {
  if (!token) return false
  const expected = await computeExpectedToken()
  if (!expected) return false
  return safeEqual(token, expected)
}

/**
 * Extracts the admin session cookie from a Request or NextRequest object.
 */
export function getAdminToken(request) {
  return request.cookies.get('admin_session')?.value ?? null
}
