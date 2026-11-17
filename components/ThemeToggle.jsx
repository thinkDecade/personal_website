// components/ThemeToggle.jsx
// Minimal dark/light toggle — reads/writes localStorage and data-theme on <html>.
// Shows a moon in light mode (switch to dark) and a sun in dark mode (switch to light).
'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(true) /* default matches layout data-theme="dark" */

  /* On mount: sync state from whatever the anti-FOUC script already set */
  useEffect(() => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
    setDark(isDark)
  }, [])

  function toggle() {
    const next  = !dark
    const theme = next ? 'dark' : 'light'
    setDark(next)
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('theme', theme) } catch (_) {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark  ? 'Light mode' : 'Dark mode'}
      className="w-11 h-11 flex items-center justify-center text-muted hover:text-accent-ink select-none"
    >
      {dark ? (
        /* Sun */
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      ) : (
        /* Moon */
        <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  )
}
