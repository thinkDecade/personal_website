'use client'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: '⊞' },
  { href: '/admin/content',  label: 'Hero',        icon: '✦' },
  { href: '/admin/events',   label: 'Events',      icon: '◈' },
  { href: '/admin/founder',  label: 'Projects',    icon: '◉' },
  { href: '/admin/work',     label: 'Work',        icon: '◎' },
  { href: '/admin/social',   label: 'Social',      icon: '◐' },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  // Don't render the shell on the login page
  if (pathname === '/admin/login') return <>{children}</>

  async function handleLogout() {
    setSigningOut(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="font-serif italic text-xl text-white tracking-tight hover:text-[#F5A100] transition-colors">
            Muntala.
          </Link>
          <span className="ml-2 text-[10px] tracking-[0.2em] text-neutral-600 uppercase self-end mb-0.5">admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-3">
          {NAV.map(({ href, label, icon }) => {
            const active = href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                  active
                    ? 'bg-[#F5A100]/15 text-[#F5A100] font-medium'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base leading-none">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            disabled={signingOut}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
          >
            <span className="text-base leading-none">↩</span>
            {signingOut ? 'Signing out…' : 'Sign out'}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-sm z-10">
          <div className="text-sm text-neutral-500">
            {NAV.find(n => (n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href)))?.label || 'Admin'}
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors flex items-center gap-1"
          >
            View site ↗
          </a>
        </div>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
