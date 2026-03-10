// components/Nav.jsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  { href: '/',         label: 'Home'     },
  { href: '/writings', label: 'Writings' },
  { href: '/founder',  label: 'Founder'  },
  { href: '/work',     label: 'Work'     },
  { href: '/social',   label: 'Social'   },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <nav className="relative z-50 w-full px-6 md:px-14 h-16 flex items-center border-b border-subtle bg-bg">

        {/* ── Logo ─────────────────────────────────────────────────── */}
        <Link
          href="/"
          onClick={close}
          className="font-serif italic text-[22px] leading-none text-fg no-underline shrink-0"
        >
          Muntala.
        </Link>

        {/* ── Desktop nav links — centred ───────────────────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 lg:gap-10">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'font-mono text-[10px] tracking-[0.2em] uppercase no-underline transition-colors',
                  isActive ? 'text-fg' : 'text-dim hover:text-fg',
                ].join(' ')}
              >
                {label}
              </Link>
            )
          })}
        </div>

        {/* ── Right: theme toggle + contact pill + hamburger ─────────── */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* Desktop contact pill */}
          <Link
            href="/social"
            className="hidden md:inline-flex items-center font-mono text-[10px] tracking-[0.18em]
                       uppercase bg-fg text-bg px-5 py-2.5 rounded-full no-underline
                       hover:opacity-75 transition-opacity shrink-0"
          >
            Contact
          </Link>

          {/* Mobile hamburger — 44×44 touch target */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden w-11 h-11 flex items-center justify-center
                       font-mono text-xl text-fg leading-none"
          >
            {open ? '✕' : '≡'}
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen overlay ────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-x-0 bottom-0 z-40 flex flex-col bg-bg overflow-y-auto"
          style={{ top: '64px' }}
        >
          <nav className="flex flex-col px-6 py-4 flex-1">
            {NAV_ITEMS.map(({ href, label }) => {
              const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={[
                    'font-mono text-[13px] tracking-[0.2em] uppercase no-underline',
                    'py-5 border-b border-subtle transition-colors block',
                    isActive ? 'text-yellow-acid' : 'text-fg hover:text-yellow-acid',
                  ].join(' ')}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="px-6 pb-10 pt-4">
            <Link
              href="/social"
              onClick={close}
              className="flex items-center justify-center font-mono text-[11px] tracking-[0.18em]
                         uppercase bg-fg text-bg py-4 no-underline hover:opacity-75 transition-opacity"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
