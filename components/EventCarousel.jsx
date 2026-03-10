// components/EventCarousel.jsx
// ── Events are managed via the admin backend (data/events.json) ──
// ── Pass events as a prop from a server component             ──
'use client'

import { useState, useEffect, useRef } from 'react'

const PLACEHOLDER_COLORS = ['#F5A100', '#1a1a1a', '#e8e0d4', '#2c2c2c', '#c8b89a']
const INTERVAL_MS = 4000

export default function EventCarousel({ events = [] }) {
  const EVENTS = events

  const [current, setCurrent]   = useState(0)
  const [paused, setPaused]     = useState(false)
  const [dragging, setDragging] = useState(false)
  const dragStartX               = useRef(0)
  const timerRef                 = useRef(null)

  const prev = () => setCurrent(i => (i - 1 + EVENTS.length) % EVENTS.length)
  const next = () => setCurrent(i => (i + 1) % EVENTS.length)

  // Auto-scroll — advances every INTERVAL_MS unless paused
  useEffect(() => {
    if (paused || EVENTS.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(i => (i + 1) % EVENTS.length)
    }, INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [paused, EVENTS.length])

  // Manual nav resets the timer so we don't skip too fast
  const manualNav = (fn) => {
    clearInterval(timerRef.current)
    fn()
    if (!paused && EVENTS.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent(i => (i + 1) % EVENTS.length)
      }, INTERVAL_MS)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  manualNav(prev)
      if (e.key === 'ArrowRight') manualNav(next)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [paused, EVENTS.length])

  // Touch / drag swipe
  const onPointerDown = (e) => { dragStartX.current = e.clientX; setDragging(true) }
  const onPointerUp   = (e) => {
    if (!dragging) return
    const delta = e.clientX - dragStartX.current
    if (delta < -40) manualNav(next)
    if (delta >  40) manualNav(prev)
    setDragging(false)
  }

  // Empty state
  if (EVENTS.length === 0) {
    return (
      <div className="mb-20 py-12 border border-dashed border-subtle flex items-center justify-center">
        <p className="font-mono text-[9px] tracking-widest uppercase text-whisper">
          No events yet — add some in the admin
        </p>
      </div>
    )
  }

  return (
    <div
      className="mb-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* Header row */}
      <div className="flex items-center justify-between mb-6 border-b border-subtle pb-4">
        <div>
          <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-1">
            Events &amp; Meetups
          </p>
          <p className="font-mono text-[9px] text-whisper tracking-widest uppercase">
            {EVENTS.length} moment{EVENTS.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => manualNav(prev)}
            aria-label="Previous"
            className="w-11 h-11 border border-subtle flex items-center justify-center
                       font-mono text-dim hover:text-fg hover:border-fg transition-colors"
          >
            ←
          </button>
          <span className="font-mono text-[9px] text-whisper w-10 text-center">
            {current + 1} / {EVENTS.length}
          </span>
          <button
            onClick={() => manualNav(next)}
            aria-label="Next"
            className="w-11 h-11 border border-subtle flex items-center justify-center
                       font-mono text-dim hover:text-fg hover:border-fg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Slide window */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className="flex"
          style={{
            transform:  `translateX(-${current * 100}%)`,
            transition: dragging ? 'none' : 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {EVENTS.map((ev, i) => (
            <div key={ev.id || i} className="w-full flex-shrink-0">
              {/* Image */}
              <div className="w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {ev.src ? (
                  <img
                    src={ev.src}
                    alt={ev.caption}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-3"
                    style={{ background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] }}
                  >
                    <svg viewBox="0 0 48 48" className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="4" y="10" width="40" height="28" rx="2"/>
                      <circle cx="16" cy="20" r="4"/>
                      <path d="M4 32l10-8 8 6 8-10 14 10"/>
                    </svg>
                    <p className="font-mono text-[9px] tracking-widest uppercase opacity-40">
                      /events/photo-{i + 1}.jpg
                    </p>
                  </div>
                )}
              </div>

              {/* Caption row */}
              <div className="pt-4 flex items-start justify-between gap-4">
                <div>
                  {ev.event && (
                    <p className="font-mono text-[9px] text-yellow-acid tracking-widest uppercase mb-1">
                      {ev.event}
                    </p>
                  )}
                  <p className="font-serif text-[15px] text-muted leading-snug">{ev.caption}</p>
                  {ev.url && (
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[9px] text-whisper hover:text-yellow-acid
                                 tracking-widest uppercase mt-2 inline-block transition-colors"
                    >
                      Official post ↗
                    </a>
                  )}
                </div>
                {ev.tag && (
                  <span className="font-mono text-[9px] tracking-widest uppercase border border-subtle
                                   px-2 py-0.5 text-whisper shrink-0 mt-1">
                    {ev.tag}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots — active one animates across like a timer */}
      {/* Each button has py-[19px] so total height = 6px dot + 38px padding = 44px touch target */}
      <div className="flex items-center gap-2 mt-5">
        {EVENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => manualNav(() => setCurrent(i))}
            aria-label={`Go to slide ${i + 1}`}
            className="relative flex items-center py-[19px] transition-all duration-300"
            style={{ flexShrink: 0 }}
          >
            <span
              className="relative overflow-hidden block transition-all duration-300"
              style={{
                width:        i === current ? '40px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                background:   'rgb(var(--color-fg)/0.15)',
              }}
            >
              {i === current && (
                <span
                  className="absolute inset-y-0 left-0 rounded-[3px]"
                  style={{
                    background:  '#F5A100',
                    width:       paused ? '100%' : '0%',
                    animation:   paused ? 'none' : `fillBar ${INTERVAL_MS}ms linear forwards`,
                  }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Keyframe for the fill-bar animation */}
      <style>{`
        @keyframes fillBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>

    </div>
  )
}
