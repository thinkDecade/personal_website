// app/founder/page.jsx
// Showcase of things Muntala has founded — data driven from data/founder.json
import { IconCalendar } from '@/components/icons'
import { readSection }  from '@/lib/store'

export const metadata = {
  title: 'Founder',
  description: 'Things Muntala Piniyini has started — publications, platforms, and ideas in motion.',
}

export const dynamic = 'force-dynamic'

const STATUS_CLASSES = {
  ACTIVE:   'border-yellow-acid text-yellow-acid',
  BUILDING: 'border-mid text-dim',
  STEALTH:  'border-mid text-dim',
  ARCHIVED: 'border-mid text-whisper',
}

export default async function Founder() {
  const FOUNDED = await readSection('founder') ?? []

  return (
    <div className="w-full max-w-5xl mx-auto px-6 md:px-14 py-16">

      {/* Header */}
      <div className="mb-16 border-b border-subtle pb-10">
        <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-5">
          Founder
        </p>
        <h1 className="font-serif text-[clamp(28px,5vw,56px)] leading-[1.1] font-bold max-w-2xl">
          Things I started.<br />Problems I chose to own.
        </h1>
        <p className="font-mono text-2xs text-dim tracking-widest uppercase mt-5">
          Building from Accra, Ghana 🇬🇭
        </p>
      </div>

      {/* Projects */}
      <div className="space-y-0">
        {FOUNDED.map(({ id, name, year, status, url, desc, tags }, idx) => (
          <div
            key={id || idx}
            className="group grid grid-cols-1 md:grid-cols-[80px_1fr_200px] gap-0 border-b border-subtle py-10 md:py-12"
          >
            {/* Number */}
            <div className="mb-4 md:mb-0">
              <span className="font-mono text-2xs text-yellow-acid">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Main content */}
            <div className="md:pr-12">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {url ? (
                  <a
                    href={url}
                    target="_blank" rel="noopener noreferrer"
                    className="font-mono font-bold uppercase tracking-tight no-underline text-fg group-hover:text-yellow-acid"
                    style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
                  >
                    {name} ↗
                  </a>
                ) : (
                  <span
                    className="font-mono font-bold uppercase tracking-tight text-dim"
                    style={{ fontSize: 'clamp(22px, 3vw, 36px)' }}
                  >
                    {name}
                  </span>
                )}
                <span
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 ${STATUS_CLASSES[status] || 'border-mid text-dim'}`}
                >
                  {status}
                </span>
              </div>

              <p className="font-serif text-[16px] leading-[1.75] text-muted max-w-xl mb-5">
                {desc}
              </p>

              {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => (
                    <span key={t} className="font-mono text-[9px] tracking-widest uppercase text-whisper border border-subtle px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Year — right column, visible on md+ */}
            <div className="hidden md:flex flex-col items-end justify-start pt-1">
              <span className="flex items-center gap-1 font-mono text-2xs text-dim tracking-widest">
                <IconCalendar className="w-3 h-3 shrink-0" />
                {year}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
