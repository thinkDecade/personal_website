// components/GalleryGrid.jsx — filterable masonry gallery with an accessible media viewer.
// Filtering and paging happen client-side (no page reloads). Images keep their
// own aspect ratio; layout space is reserved up front to avoid layout shift.
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, inCategory, videoEmbed, thumbFor, ratioFor } from '@/lib/gallery'

const PAGE_SIZE = 18
const FILTERS   = ['All', ...CATEGORIES]

function srcSetFor(item) {
  if (item.type !== 'image' || !item.thumb || !item.src || item.thumb === item.src) return undefined
  return `${item.thumb} 900w, ${item.src} ${item.width || 2000}w`
}

function Meta({ item, className = '' }) {
  const bits = [item.location, item.date && new Date(item.date + 'T00:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })].filter(Boolean)
  if (!bits.length) return null
  return <p className={`font-mono text-2xs tracking-[0.16em] uppercase ${className}`}>{bits.join(' · ')}</p>
}

function PlayBadge({ large = false }) {
  return (
    <span aria-hidden="true" className={`absolute inset-0 flex items-center justify-center pointer-events-none`}>
      <span className={`${large ? 'w-20 h-20' : 'w-14 h-14'} bg-black/80 flex items-center justify-center`}>
        <svg viewBox="0 0 24 24" className={`${large ? 'w-8 h-8' : 'w-6 h-6'} text-yellow-acid`} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
    </span>
  )
}

function Viewer({ items, index, onClose, onStep }) {
  const item     = items[index]
  const closeRef = useRef(null)
  const touch    = useRef(null)
  const embed    = item.type === 'video' ? videoEmbed(item.videoUrl) : null

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape')     { e.preventDefault(); onClose() }
      if (e.key === 'ArrowRight') { e.preventDefault(); onStep(1) }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); onStep(-1) }
      if (e.key === 'Tab') {       // keep focus inside the viewer
        const f = [...document.querySelectorAll('[data-viewer] button, [data-viewer] a, [data-viewer] iframe')]
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  return (
    <div
      data-viewer
      role="dialog"
      aria-modal="true"
      aria-label={item.title || 'Media viewer'}
      className="surface-dark fixed inset-0 z-[100] flex flex-col"
      onTouchStart={e => { touch.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touch.current == null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className="flex items-center justify-between px-5 md:px-10 h-16 shrink-0">
        <p className="font-mono text-2xs tracking-[0.2em] uppercase text-dim">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button ref={closeRef} onClick={onClose} aria-label="Close viewer" className="w-11 h-11 flex items-center justify-center text-fg hover:text-accent-ink">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
        </button>
      </div>

      <div className="relative flex-1 min-h-0 flex items-center justify-center px-14 md:px-24">
        {item.type === 'video' && embed ? (
          <div className="w-full max-w-[1100px] aspect-video bg-black">
            <iframe
              key={item.id}
              src={embed.embed}
              title={item.title || 'Video'}
              className="w-full h-full border-0"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : item.type === 'video' ? (
          <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-[0.2em] uppercase text-accent-ink">Watch video ↗</a>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.id}
            src={item.src || item.thumb}
            alt={item.alt || item.title || ''}
            width={item.width || undefined}
            height={item.height || undefined}
            className="max-w-full max-h-full w-auto h-auto object-contain"
          />
        )}

        {items.length > 1 && (
          <>
            <button onClick={() => onStep(-1)} aria-label="Previous" className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-fg hover:text-accent-ink">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button onClick={() => onStep(1)} aria-label="Next" className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-fg hover:text-accent-ink">
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>

      <div className="shrink-0 px-5 md:px-10 py-5 md:py-6 border-t border-stone grid md:grid-cols-[1fr_auto] gap-2 md:gap-8 items-end">
        <div>
          {item.title && <p className="font-serif text-[20px] md:text-[24px] leading-tight m-0">{item.title}</p>}
          {item.description && <p className="font-serif text-[15px] leading-[1.55] text-muted m-0 mt-1 max-w-[760px]">{item.description}</p>}
        </div>
        <div className="flex flex-col md:items-end gap-1">
          <Meta item={item} className="text-dim m-0" />
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="font-mono text-2xs tracking-[0.16em] uppercase no-underline text-accent-ink">Source ↗</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function GalleryGrid({ items }) {
  const [filter, setFilter] = useState('All')
  const [shown,  setShown]  = useState(PAGE_SIZE)
  const [open,   setOpen]   = useState(null)   // index into `filtered`
  const lastTrigger = useRef(null)

  const filtered = useMemo(() => items.filter(i => inCategory(i, filter)), [items, filter])
  const visible  = filtered.slice(0, shown)
  const counts   = useMemo(() => Object.fromEntries(FILTERS.map(f => [f, items.filter(i => inCategory(i, f)).length])), [items])

  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => lastTrigger.current?.focus())
  }, [])
  const step = useCallback(d => setOpen(i => (i + d + filtered.length) % filtered.length), [filtered.length])

  return (
    <div>
      {/* Filters */}
      <div role="group" aria-label="Filter gallery" className="flex flex-wrap gap-2 mb-12">
        {FILTERS.map(f => {
          const active = f === filter
          return (
            <button
              key={f}
              onClick={() => { setFilter(f); setShown(PAGE_SIZE) }}
              aria-pressed={active}
              className={[
                'font-mono text-2xs tracking-[0.18em] uppercase px-4 py-2.5 border',
                active ? 'bg-yellow-acid text-black border-yellow-acid' : 'border-fg/25 text-fg hover:border-fg',
              ].join(' ')}
            >
              {f}<span className={active ? 'ml-2' : 'ml-2 text-dim'}>{counts[f]}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="font-serif text-[18px] text-muted py-16">Nothing in {filter} yet. New frames are on the way.</p>
      ) : (
        <ul className="list-none m-0 p-0 columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
          {visible.map((item, idx) => {
            const { w, h } = ratioFor(item)
            const thumb = thumbFor(item)
            return (
              <li key={item.id} className="break-inside-avoid mb-8">
                <figure className="m-0">
                  <button
                    onClick={e => { lastTrigger.current = e.currentTarget; setOpen(idx) }}
                    className="group relative block w-full overflow-hidden bg-fg/5 text-left"
                    style={{ aspectRatio: `${w} / ${h}` }}
                    aria-label={`Open ${item.type === 'video' ? 'video' : 'photo'}: ${item.title || item.alt || 'untitled'}`}
                  >
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        srcSet={srcSetFor(item)}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        alt={item.alt || item.title || ''}
                        width={w}
                        height={h}
                        loading={idx < 6 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    )}
                    {item.type === 'video' && <PlayBadge />}
                    <span aria-hidden="true" className="absolute left-0 bottom-0 h-1 w-0 bg-yellow-acid transition-all duration-300 group-hover:w-full" />
                  </button>
                  {(item.title || item.location) && (
                    <figcaption className="pt-3 flex items-baseline justify-between gap-4">
                      <span className="font-serif text-[17px] leading-snug">{item.title}</span>
                      <Meta item={item} className="text-dim m-0 shrink-0" />
                    </figcaption>
                  )}
                </figure>
              </li>
            )
          })}
        </ul>
      )}

      {shown < filtered.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShown(s => s + PAGE_SIZE)}
            className="font-mono text-xs tracking-[0.22em] uppercase bg-fg text-bg px-7 py-4 hover:bg-yellow-acid hover:text-black"
          >
            Load more · {filtered.length - shown} left
          </button>
        </div>
      )}

      {open !== null && filtered[open] && (
        <Viewer items={filtered} index={open} onClose={close} onStep={step} />
      )}
    </div>
  )
}
