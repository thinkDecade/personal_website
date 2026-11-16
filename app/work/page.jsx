// app/work/page.jsx
// Work experience showcase — data driven from data/work.json
import { IconCalendar, IconMapPin } from '@/components/icons'
import { readSection }              from '@/lib/store'

export const metadata = {
  title: 'Work',
  description: 'Where Muntala Piniyini has been and what he built.',
}

export const dynamic = 'force-dynamic'

// Speaking + credentials — edit here (not managed by the admin CMS)
const SPEAKING = [
  { year: '2026', event: 'Digital Assets Summit Africa',  role: 'Panel Moderator', topic: 'Digital Finance in Action: From Experimentation to Commercial Deployment' },
  { year: '2026', event: 'Accra Stablecoin Conference',   role: 'Panel Speaker',   topic: "Building Africa's Stablecoin Payment Infrastructure" },
  { year: '2024', event: 'Max Impact Podcast',            role: 'Featured Guest',  topic: 'Public Goods Africa' },
  { year: '2023', event: 'Africa Web3 Summit',            role: 'Panel Speaker',   topic: 'Society on Chain' },
  { year: '2023', event: 'Bankless Africa × ITC',         role: 'Featured Speaker', topic: 'Understanding Web3 and Its Potential for Businesses' },
  { year: '2022', event: 'Ghana Crypto & DeFi Summit',    role: 'Conference Speaker', topic: '' },
]

const CREDENTIALS = [
  { year: '2026', name: 'Level 2 Award in Fundamentals of Financial Services', org: 'Chartered Institute for Securities & Investment (CISI)' },
  { year: '2026', name: 'AI & Agentic Systems — Claude Code, Model Context Protocol, Subagents', org: 'Anthropic Academy' },
  { year: '2025', name: 'Founder Academy', org: 'ALX' },
  { year: '2020', name: 'BSc Accounting', org: 'University of Professional Studies, Accra (UPSA)' },
  { year: '—',    name: 'Future of Payment Technologies · Financial Markets · Regulatory Compliance', org: 'University of Michigan · Yale · University of Pennsylvania' },
]

function ListSection({ label, title, rows }) {
  return (
    <section className="pt-14 border-b border-subtle pb-12">
      <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-3">{label}</p>
      <h2 className="font-serif text-[clamp(22px,3vw,32px)] leading-[1.15] font-bold mb-8">{title}</h2>
      <ul>
        {rows.map((r, i) => (
          <li key={i} className="grid grid-cols-[56px_1fr] gap-4 py-4 border-t border-subtle">
            <span className="font-mono text-2xs text-dim pt-[3px]">{r.year}</span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-fg">{r.primary}</p>
              {r.secondary && <p className="font-serif text-[15px] leading-[1.6] text-muted mt-1">{r.secondary}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

const TYPE_CLASSES = {
  FOUNDER:     'border-yellow-acid text-yellow-acid',
  'FULL-TIME': 'border-emerald-500/50 text-emerald-400',
  CONTRACT:    'border-blue-500/50 text-blue-400',
  ADVISORY:    'border-purple-500/50 text-purple-400',
  BOARD:       'border-mid text-dim',
  ROLE:        'border-mid text-dim',
}

export default async function Work() {
  const EXPERIENCE = await readSection('work') ?? []

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
                {period && (
                  <span className="flex items-center gap-1 font-mono text-2xs text-dim">
                    <IconCalendar className="w-3 h-3 shrink-0" />
                    {period}
                  </span>
                )}
                {location && (
                  <span className="flex items-center gap-1 font-mono text-2xs text-dim">
                    <IconMapPin className="w-3 h-3 shrink-0" />
                    {location}
                  </span>
                )}
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

      <ListSection
        label="Speaking"
        title="Rooms I've been in."
        rows={SPEAKING.map(s => ({
          year: s.year,
          primary: `${s.event} — ${s.role}`,
          secondary: s.topic,
        }))}
      />

      <ListSection
        label="Education & certifications"
        title="Where the foundations came from."
        rows={CREDENTIALS.map(c => ({ year: c.year, primary: c.name, secondary: c.org }))}
      />

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
