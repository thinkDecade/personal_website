// app/page.jsx — Home · Bold orange hero, full-colour photo, editorial type
import fs   from 'fs'
import path from 'path'
import Link from 'next/link'
import { IconPen, IconRocket, IconBriefcase, IconSignal } from '@/components/icons'

export const dynamic = 'force-dynamic'

function readHero() {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'content.json'), 'utf8')
    return JSON.parse(raw).hero
  } catch {
    return null
  }
}

// Fallback defaults if content.json is missing
const HERO_DEFAULTS = {
  headline1:    'Thinking,',
  headline2:    'building.',
  statusBadge:  'Open to conversations',
  contextLine1: 'AI · Crypto · Fintech',
  contextLine2: 'Accra, Ghana 🇬🇭 · Global',
  name:         'MUNTALA',
  surname:      'PINIYINI',
  roles: [
    'FOUNDER · BUILDER',
    'CREATOR · WRITER',
    'OPERATOR · TINKERER',
    'MANY HATS.',
  ],
  photo: '/muntala.jpg',
}

const SECTIONS = [
  {
    href:  '/writings',
    label: 'Writings',
    desc:  'Long-form thinking. Unresolved questions welcome.',
    num:   '01',
    Icon:  IconPen,
  },
  {
    href:  '/founder',
    label: 'Founder',
    desc:  'Things I started. Problems I chose to own.',
    num:   '02',
    Icon:  IconRocket,
  },
  {
    href:  '/work',
    label: 'Work',
    desc:  'Where I have been. What I built.',
    num:   '03',
    Icon:  IconBriefcase,
  },
  {
    href:  '/social',
    label: 'Social',
    desc:  'Life in Accra. Find me where the thinking happens.',
    num:   '04',
    Icon:  IconSignal,
  },
]

export default function Home() {
  const heroData = readHero() || HERO_DEFAULTS
  const hero     = { ...HERO_DEFAULTS, ...heroData }

  const roles    = Array.isArray(hero.roles) ? hero.roles : HERO_DEFAULTS.roles
  // Last role line gets the accent colour
  const lastRole = roles[roles.length - 1]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          HERO — Bold orange full-bleed · 3D photo · giant italic type
      ══════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full h-[calc(100vh-64px)] min-h-[500px] overflow-hidden"
        style={{ background: 'var(--hero-bg)' }}
      >

        {/* ── Headline 1 — upper left, z-[1], BEHIND photo ─────────── */}
        <div
          className="absolute z-[1] pointer-events-none select-none"
          style={{ top: '7%', left: '3%' }}
        >
          <span
            className="font-serif italic leading-none text-fg"
            style={{ fontSize: 'clamp(60px, 11vw, 180px)' }}
          >
            {hero.headline1}
          </span>
        </div>

        {/* ── Headline 2 — upper right, z-[1], BEHIND photo ────────── */}
        <div
          className="absolute z-[1] pointer-events-none select-none text-right"
          style={{ top: '18%', right: '3%' }}
        >
          <span
            className="font-serif italic leading-none"
            style={{ fontSize: 'clamp(60px, 11vw, 180px)', color: 'var(--hero-accent)' }}
          >
            {hero.headline2}
          </span>
        </div>

        {/* ── Centre photo — z-[2], IN FRONT of headline ─────────────── */}
        <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none">
          <div
            className="relative h-[88%]"
            style={{
              aspectRatio: '3/4',
              maxHeight: '700px',
              maxWidth: 'min(525px, 90vw)',
              transform: 'perspective(1000px) rotateY(-6deg) rotateX(2deg)',
              transformStyle: 'preserve-3d',
              boxShadow: '28px 36px 72px rgba(0,0,0,0.30), 8px 12px 24px rgba(0,0,0,0.18)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero.photo || '/muntala.jpg'}
              alt={`${hero.name} ${hero.surname}`}
              className="w-full h-full object-cover object-top"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
        </div>

        {/* ── Status badge — pill, z-[3] ──────────────────────────────── */}
        <div
          className="absolute z-[3]"
          style={{ bottom: '27%', left: '5%' }}
        >
          <span className="inline-flex items-center gap-2.5 bg-[#1a1a1a] text-white rounded-full px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-yellow-acid animate-pulse shrink-0" />
            <span className="font-mono text-[9px] tracking-[0.22em] uppercase leading-none">
              {hero.statusBadge}
            </span>
          </span>
        </div>

        {/* ── Top-right: context ─────────────────────────────────────── */}
        <div
          className="absolute z-[3] text-right hidden md:block"
          style={{ top: '5%', right: '4%' }}
        >
          <p
            className="font-mono text-2xs tracking-[0.22em] uppercase leading-loose"
            style={{ color: 'rgba(0,0,0,0.5)' }}
          >
            {hero.contextLine1}
          </p>
          <p
            className="font-mono text-2xs tracking-[0.22em] uppercase"
            style={{ color: 'rgba(0,0,0,0.3)' }}
          >
            {hero.contextLine2}
          </p>
        </div>

        {/* ── Bottom-left: name ──────────────────────────────────────── */}
        <div className="absolute z-[3] bottom-8 md:bottom-10 left-5 md:left-[5%]">
          <h1
            className="font-mono font-bold uppercase leading-[0.88] tracking-tight text-fg"
            style={{ fontSize: 'clamp(26px, 4vw, 58px)' }}
          >
            {hero.name}<br />
            <span style={{ color: 'var(--hero-accent)' }}>{hero.surname}</span>
          </h1>
        </div>

        {/* ── Bottom-right: roles ────────────────────────────────────── */}
        <div className="absolute z-[3] bottom-8 md:bottom-10 right-5 md:right-[5%] text-right">
          <p
            className="font-mono font-bold uppercase tracking-widest text-fg leading-[1.6]"
            style={{ fontSize: 'clamp(9px, 1.1vw, 14px)' }}
          >
            {roles.map((line, i) => (
              <span key={i}>
                {i === roles.length - 1
                  ? <span style={{ color: 'var(--hero-accent)' }}>{line}</span>
                  : line
                }
                {i < roles.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          SECTIONS — Quick-nav grid below the fold
      ══════════════════════════════════════════════════════════ */}
      <section className="w-full grid grid-cols-2 md:grid-cols-4 border-t border-subtle">
        {SECTIONS.map(({ href, label, desc, num, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group relative p-6 md:p-8 border-r border-b border-subtle no-underline
                       last:border-r-0 md:border-b-0
                       [&:nth-child(2)]:border-r-0 md:[&:nth-child(2)]:border-r
                       [&:nth-child(3)]:border-r-0 [&:nth-child(3)]:border-b-0
                       [&:nth-child(4)]:border-b-0
                       md:[&:nth-child(3)]:border-r hover:bg-yellow-acid/5"
          >
            <span className="block mb-4 text-dim group-hover:text-yellow-acid transition-colors">
              <Icon className="w-5 h-5" />
            </span>
            <p className="font-mono text-xs tracking-widest uppercase text-yellow-acid mb-2 group-hover:underline">
              {label}
            </p>
            <p className="font-mono text-[10px] text-dim leading-relaxed">
              {desc}
            </p>
            <span
              className="absolute bottom-6 right-6 font-mono text-xs text-whisper group-hover:text-yellow-acid"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        ))}
      </section>

    </>
  )
}
