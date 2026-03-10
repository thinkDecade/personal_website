// components/Nav.jsx — Madison-style: serif logo · centered links · contact pill
'use client'

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

  return (
    <nav className="relative z-20 w-full px-6 md:px-14 h-16 flex items-center border-b border-subtle">

      {/* ── Logo — serif italic left ───────────────────────────────────── */}
      <Link
        href="/"
        className="font-serif italic text-[22px] leading-none text-fg no-underline shrink-0"
      >
        Muntala.
      </Link>

      {/* ── Nav links — centered (absolute so logo + right stay at edges) ── */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-7 lg:gap-10">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={[
                'font-mono text-[10px] tracking-[0.2em] uppercase no-underline transition-colors',
                isActive
                  ? 'text-fg'
                  : 'text-dim hover:text-fg',
              ].join(' ')}
            >
              {label}
            </Link>
          )
        })}
      </div>

      {/* ── Right — theme toggle + contact pill ───────────────────────── */}
      <div className="ml-auto flex items-center gap-4">
        <ThemeToggle />
        <Link
          href="/social"
          className="hidden md:inline-flex items-center font-mono text-[10px] tracking-[0.18em]
                     uppercase bg-fg text-bg px-5 py-2.5 rounded-full no-underline
                     hover:opacity-75 transition-opacity shrink-0"
        >
          Contact
        </Link>
      </div>

    </nav>
  )
}
