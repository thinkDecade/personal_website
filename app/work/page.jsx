// app/work/page.jsx
// Work experience showcase — data driven from data/work.json
import fs   from 'fs'
import path from 'path'

export const metadata = {
  title: 'Work',
  description: 'Where Muntala Piniyini has been and what he built.',
}

export const dynamic = 'force-dynamic'

function readWork() {
  try {
    return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'work.json'), 'utf8'))
  } catch {
    return []
  }
}

const TYPE_CLASSES = {
  FOUNDER:   'border-yellow-acid text-yellow-acid',
  'FULL-TIME': 'border-emerald-500/50 text-emerald-400',
  CONTRACT:  'border-blue-500/50 text-blue-400',
  ADVISORY:  'border-purple-500/50 text-purple-400',
  BOARD:     'border-mid text-dim',
  ROLE:      'border-mid text-dim',
}

export default function Work() {
  const EXPERIENCE = readWork()

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-14 py-16">

      {/* Header */}
      <div className="mb-16 border-b border-subtle pb-10">
        <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-5">
          Work
        </p>
        <h1 className="font-serif text-[clamp(28px,5vw,52px)] leading-[1.1] font-bold">
          Where I have been.<br />What I built.
        </h1>
      </div>

      {/* Timeline */}
      <div>
        {EXPERIENCE.map(({ id, role, org, period, location, type, points }, idx) => (
          <div
            key={id || idx}
            className="relative grid grid-cols-1 md:grid-cols-[80px_1fr] border-b border-subtle py-10 md:py-12 group"
          >
            {/* Left — number */}
            <div className="mb-4 md:mb-0">
              <span className="font-mono text-2xs text-yellow-acid">
                {String(idx + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Right — content */}
            <div>
              {/* Role header */}
              <div className="flex flex-wrap items-start gap-x-4 gap-y-2 mb-1">
                <h2
                  className="font-mono font-bold uppercase tracking-tight text-fg leading-tight"
                  style={{ fontSize: 'clamp(18px, 2.5vw, 28px)' }}
                >
                  {role}
                </h2>
                <span
                  className={`font-mono text-[9px] tracking-widest uppercase border px-2 py-0.5 mt-1 shrink-0 ${TYPE_CLASSES[type] || 'border-mid text-dim'}`}
                >
                  {type}
                </span>
              </div>

              {/* Org + meta */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6">
                <span className="font-mono text-2xs text-yellow-acid tracking-widest uppercase">
                  {org}
                </span>
                <span className="font-mono text-2xs text-whisper">{period}</span>
                <span className="font-mono text-2xs text-whisper">{location}</span>
              </div>

              {/* Points */}
              {points && points.length > 0 && (
                <ul className="space-y-3">
                  {points.map((p, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-2xs text-yellow-acid shrink-0 mt-[2px]">—</span>
                      <p className="font-serif text-[15px] leading-[1.7] text-muted">{p}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Download / contact prompt */}
      <div className="pt-12 flex flex-wrap gap-6 items-center">
        <a
          href="https://www.linkedin.com/in/muntala-piniyini/"
          target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs tracking-[0.22em] uppercase text-yellow-acid border border-yellow-acid px-5 py-3 no-underline hover:bg-yellow-acid hover:text-bg"
        >
          LinkedIn Profile →
        </a>
        <p className="font-mono text-2xs text-dim">
          Or reach out directly to discuss work and collaboration.
        </p>
      </div>

    </div>
  )
}
