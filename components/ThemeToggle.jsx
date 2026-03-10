// components/ThemeToggle.jsx
// Minimal dark/light toggle — reads/writes localStorage and data-theme on <html>.
// ○ = dark mode active   ● = light mode active
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
      className="font-mono text-xs text-dim hover:text-yellow-acid leading-none select-none"
    >
      {dark ? '○' : '●'}
    </button>
  )
}
