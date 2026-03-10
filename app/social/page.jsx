// app/social/page.jsx
// Social presence — platforms (managed via admin), events carousel.
import fs   from 'fs'
import path from 'path'
import EventCarousel                                     from '@/components/EventCarousel'
import { IconX, IconLinkedIn, IconSubstack, IconGlobe } from '@/components/icons'

export const metadata = {
  title: 'Social',
  description: 'Find Muntala Piniyini across the internet — where he writes, talks, and thinks out loud.',
}

export const dynamic = 'force-dynamic'

function readData(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', file), 'utf8'))
  } catch {
    return null
  }
}

const PLATFORM_ICON = {
  twitter:    IconX,
  x:          IconX,
  linkedin:   IconLinkedIn,
  substack:   IconSubstack,
  thinkdecade: IconSubstack,
}

export default function Social() {
  const events    = readData('events.json') ?? []
  const social    = readData('social.json')
  const platforms = (social?.platforms ?? []).filter(p => p.visible !== false)

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-14 py-16">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-16 border-b border-subtle pb-10">
        <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-5">
          Social
        </p>
        <h1 className="font-serif text-[clamp(28px,5vw,52px)] leading-[1.1] font-bold mb-6">
          Find me where<br />the thinking happens.
        </h1>
        <p className="font-serif text-[16px] text-muted leading-[1.8] max-w-xl">
          Distributed across the internet — essays, threads, conversations, and audio.
          Pick the format that suits the way you think.
        </p>
      </div>

      {/* ── Platform links (from data/social.json) ──────────────────────── */}
      {platforms.length > 0 && (
        <div className="mb-20">
          {platforms.map(({ id, name, handle, url, desc, cadence }, idx) => {
            const PlatformIcon = PLATFORM_ICON[id?.toLowerCase()] ?? IconGlobe
            return (
              <a
                key={id || idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row md:items-start gap-4 md:gap-8
                           py-8 border-b border-subtle no-underline"
              >
                {/* Platform icon */}
                <span className="text-dim group-hover:text-yellow-acid transition-colors shrink-0 mt-1">
                  <PlatformIcon className="w-5 h-5" />
                </span>

                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                    <h2
                      className="font-mono font-bold uppercase tracking-tight leading-none
                                 text-fg group-hover:text-yellow-acid transition-colors"
                      style={{ fontSize: 'clamp(16px, 2.2vw, 26px)' }}
                    >
                      {name}
                    </h2>
                    <span className="font-mono text-2xs text-whisper">{handle}</span>
                  </div>
                  <p className="font-serif text-[15px] leading-[1.7] text-muted max-w-xl">
                    {desc}
                  </p>
                </div>

                <div className="flex md:flex-col items-start md:items-end gap-3 md:gap-2 shrink-0">
                  {cadence && (
                    <span className="font-mono text-[9px] tracking-widest uppercase text-whisper
                                     border border-subtle px-2 py-0.5">
                      {cadence}
                    </span>
                  )}
                  <span className="font-mono text-xs text-whisper group-hover:text-yellow-acid
                                   md:mt-auto transition-colors">
                    ↗
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      )}

      {/* ── Events & Meetups carousel ───────────────────────────────────── */}
      <EventCarousel events={events} />

    </div>
  )
}
