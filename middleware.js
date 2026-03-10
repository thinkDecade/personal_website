// middleware.js — protects /admin/* routes, redirects to /admin/login if not authenticated
import { NextResponse }                          from 'next/server'
import { verifyAdminToken, getAdminToken }       from '@/lib/auth'

const PUBLIC_ADMIN_PATHS = ['/admin/login']
const ADMIN_PATTERN      = /^\/admin(\/|$)/

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Only guard /admin routes
  if (!ADMIN_PATTERN.test(pathname)) return NextResponse.next()

  // Login page is always public
  if (PUBLIC_ADMIN_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next()

  // Auth endpoint is always public (handles login POST)
  if (pathname.startsWith('/api/admin/auth')) return NextResponse.next()

  const token = getAdminToken(request)
  const valid = await verifyAdminToken(token)

  if (!valid) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
