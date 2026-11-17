// app/page.jsx
// Home — an editorial portrait: who he is, what drives the work, what he has
// built, how he thinks, the person, and an invitation.
// Ventures come from data/founder.json (+ roles from data/work.json),
// journal entries from the thinkDecade Substack feed, speaking from lib/profile.js.

import Link from 'next/link'
import { readSection }      from '@/lib/store'
import { getSubstackPosts } from '@/lib/substack'
import { SPEAKING }         from '@/lib/profile'

export const dynamic = 'force-dynamic'

// Role shown next to each venture. Ventures without a matching Work entry
// fall back to "Founder" (everything on the Founder page was started by him).
const ROLE_FALLBACK = 'Founder'

const DIMENSIONS = [
  { name: 'The Thinker',  body: 'Ideas, perspectives, research, writing and intellectual exploration.' },
  { name: 'The Builder',  body: 'Companies, products, technology, systems and institutions.' },
  { name: 'The Operator', body: 'Execution, leadership, governance, collaboration and getting things done.' },
]

const COMMUNITIES = [
  { name: 'BanklessDAO (now BlackFlagDAO)', note: 'Governance, grants committee, guild coordination' },
  { name: 'Sovereign Frontier',             note: 'Listeners in 100+ countries' },
  { name: 'Public Good Africa',             note: '50+ impact projects funded' },
]

function SectionLabel({ num, children }) {
  return (
    <p className="font-mono text-2xs tracking-[0.22em] uppercase text-accent-ink flex items-center gap-3 mb-8">
      <span>{num}</span>
      <span className="h-px w-10 bg-signal" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

export default async function Home() {
  const [ventures, work, posts] = await Promise.all([
    readSection('founder'),
    readSection('work'),
    getSubstackPosts('https://thinkdecade.substack.com/feed', 3).catch(() => []),
  ])

  const roleById = Object.fromEntries((work || []).map(w => [w.id, w.role]))
  const selected = (ventures || []).map((v, i) => ({
    ...v,
    num:  String(i + 1).padStart(2, '0'),
    role: roleById[v.id] || ROLE_FALLBACK,
  }))

  return (
    <div className="w-full">

      {/* ═══ 01 · OPENING ═══════════════════════════════════════════════ */}
      <section className="px-6 md:px-14 pt-12 md:pt-16 pb-20 md:pb-28 border-b border-stone">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-end">

          <div className="md:col-span-7 flex flex-col">
            <div className="flex items-baseline justify-between gap-4 mb-14 md:mb-20">
              <span className="font-serif italic text-[28px] leading-none">
                Muntala<span className="text-signal">.</span>
              </span>
              <span className="font-mono text-2xs tracking-[0.22em] uppercase text-dim">
                Accra · Ghana · Everywhere
              </span>
            </div>

            <h1 className="font-serif leading-[0.98] tracking-[-0.02em] text-[clamp(44px,7.2vw,104px)] mb-12">
              Thinking in systems.<br />
              <em className="text-signal">Building what comes next.</em>
            </h1>

            <div className="max-w-[520px] flex flex-col gap-3">
              <p className="font-serif font-bold text-[22px] leading-tight">Muntala Piniyini Shaibu</p>
              <p className="font-mono text-xs tracking-[0.14em] uppercase text-muted">
                Founder. Operator. Writer. Independent thinker.
              </p>
              <p className="font-serif text-[18px] leading-[1.6] text-muted">
                Working across technology, finance and emerging systems to turn ideas into
                products, businesses and institutions.
              </p>
              <a
                href="#work"
                className="mt-6 self-start font-mono text-xs tracking-[0.22em] uppercase no-underline border-b border-fg pb-1 hover:text-accent-ink hover:border-accent-ink"
              >
                Explore the work ↓
              </a>
            </div>
          </div>

          <figure className="md:col-span-5 md:col-start-8 m-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/muntala.jpg"
              alt="Portrait of Muntala Piniyini Shaibu"
              className="w-full aspect-[4/5] object-cover object-top grayscale contrast-[1.08]"
            />
            <figcaption className="mt-3 flex justify-between font-mono text-2xs tracking-[0.18em] uppercase text-dim">
              <span>Portrait</span><span>Accra</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ 02 · PHILOSOPHY ════════════════════════════════════════════ */}
      <section className="px-6 md:px-14 py-20 md:py-28 border-b border-stone">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3"><SectionLabel num="02">Philosophy</SectionLabel></div>
          <div className="md:col-span-9">
            <blockquote className="m-0 font-serif italic text-[clamp(28px,3.8vw,52px)] leading-[1.15] tracking-[-0.01em] mb-10">
              The world doesn&rsquo;t need more observers. It needs people willing to question,
              imagine and build.
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[860px] mb-16">
              <p className="font-serif text-[18px] leading-[1.65] text-muted m-0">
                I am interested in the systems that shape how people live, work, exchange value
                and organise society.
              </p>
              <p className="font-serif text-[18px] leading-[1.65] text-muted m-0">
                My work sits at the intersection of ideas and execution.
              </p>
            </div>
            <ol className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-3 border-t border-fg">
              {DIMENSIONS.map((d, i) => (
                <li key={d.name} className="pt-6 pb-2 md:pr-8 border-b md:border-b-0 border-stone">
                  <p className="font-mono text-2xs tracking-[0.2em] text-dim mb-3">0{i + 1}</p>
                  <p className="font-serif font-bold text-[24px] mb-2">{d.name}</p>
                  <p className="font-serif text-[16px] leading-[1.6] text-muted m-0">{d.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ═══ 03 · SELECTED WORK ═════════════════════════════════════════ */}
      <section id="work" className="px-6 md:px-14 py-20 md:py-28 border-b border-stone scroll-mt-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel num="03">Selected work</SectionLabel>
            <h2 className="font-serif text-[clamp(30px,3vw,40px)] leading-[1.1] mb-6">Things brought into existence.</h2>
            <Link href="/founder" className="font-mono text-2xs tracking-[0.2em] uppercase no-underline text-accent-ink hover:underline">
              All ventures →
            </Link>
          </div>
          <ol className="md:col-span-9 list-none m-0 p-0 border-t border-fg">
            {selected.map(v => (
              <li key={v.id} className="grid grid-cols-[40px_1fr] md:grid-cols-[56px_1fr_200px] gap-x-4 gap-y-2 py-8 border-b border-stone">
                <span className="font-mono text-2xs text-dim pt-3">{v.num}</span>
                <div>
                  <h3 className="font-serif text-[clamp(28px,3.2vw,44px)] leading-[1.05] m-0 mb-3">
                    {v.url
                      ? <a href={v.url} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-accent-ink">{v.name} <span aria-hidden="true" className="text-signal text-[0.6em] align-top">↗</span></a>
                      : v.name}
                  </h3>
                  <p className="font-serif text-[17px] leading-[1.6] text-muted max-w-[620px] m-0">{v.desc}</p>
                </div>
                <dl className="col-start-2 md:col-start-3 m-0 font-mono text-2xs tracking-[0.16em] uppercase grid grid-cols-[auto_1fr] md:grid-cols-1 gap-x-4 gap-y-1 md:pt-3">
                  <dt className="text-dim">Role</dt><dd className="m-0 md:mb-3">{v.role}</dd>
                  <dt className="text-dim">Since</dt><dd className="m-0 md:mb-3">{v.year}</dd>
                  <dt className="text-dim">Status</dt><dd className="m-0">{v.status}</dd>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ 04 · THE JOURNAL ═══════════════════════════════════════════ */}
      <section className="px-6 md:px-14 py-20 md:py-28 border-b border-stone">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel num="04">The Journal</SectionLabel>
            <h2 className="font-serif text-[clamp(30px,3vw,40px)] leading-[1.1] mb-6">A record of thinking.</h2>
            <Link href="/writings" className="font-mono text-2xs tracking-[0.2em] uppercase no-underline text-accent-ink hover:underline">
              Read the journal →
            </Link>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 border-t border-fg">
            {posts.length === 0 && (
              <p className="font-serif text-[17px] text-muted pt-6">New essays are on the way.</p>
            )}
            {posts.map(p => (
              <article key={p.link} className="pt-6 pb-8 border-b md:border-b-0 border-stone flex flex-col gap-3">
                <time className="font-mono text-2xs tracking-[0.16em] uppercase text-dim">{p.date}</time>
                <h3 className="font-serif text-[22px] leading-[1.25] m-0">
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="no-underline hover:text-accent-ink">{p.title}</a>
                </h3>
                {p.preview && <p className="font-serif text-[15px] leading-[1.6] text-muted m-0">{p.preview}</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 05 · THE PERSON ════════════════════════════════════════════ */}
      <section className="px-6 md:px-14 py-20 md:py-28 border-b border-stone">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <SectionLabel num="05">The person</SectionLabel>
            <h2 className="font-serif text-[clamp(30px,3vw,40px)] leading-[1.1] mb-6">Rooms, communities, conversations.</h2>
            <Link href="/work" className="font-mono text-2xs tracking-[0.2em] uppercase no-underline text-accent-ink hover:underline">
              The full journey →
            </Link>
          </div>
          <div className="md:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <p className="font-mono text-2xs tracking-[0.2em] uppercase text-dim mb-4">Selected speaking</p>
              <ul className="list-none m-0 p-0 border-t border-fg">
                {SPEAKING.slice(0, 4).map(s => (
                  <li key={s.event + s.year} className="py-4 border-b border-stone grid grid-cols-[48px_1fr] gap-3">
                    <span className="font-mono text-2xs text-dim pt-1">{s.year}</span>
                    <span>
                      <span className="block font-serif text-[18px] leading-snug">{s.event}</span>
                      <span className="block font-mono text-2xs tracking-[0.14em] uppercase text-muted mt-1">{s.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-2xs tracking-[0.2em] uppercase text-dim mb-4">Communities &amp; ecosystems</p>
              <ul className="list-none m-0 p-0 border-t border-fg">
                {COMMUNITIES.map(c => (
                  <li key={c.name} className="py-4 border-b border-stone">
                    <span className="block font-serif text-[18px] leading-snug">{c.name}</span>
                    <span className="block font-mono text-2xs tracking-[0.14em] uppercase text-muted mt-1">{c.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 06 · INVITATION ════════════════════════════════════════════ */}
      <section className="px-6 md:px-14 py-24 md:py-36">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3"><SectionLabel num="06">Invitation</SectionLabel></div>
          <div className="md:col-span-9">
            <h2 className="font-serif italic text-[clamp(40px,6vw,88px)] leading-[1.02] tracking-[-0.02em] m-0 mb-8">
              Good ideas deserve<br />good company<span className="text-signal">.</span>
            </h2>
            <p className="font-serif text-[18px] leading-[1.6] text-muted max-w-[520px] mb-10">
              Open to interesting conversations, collaborations and opportunities to build
              meaningful things.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/social" className="font-mono text-xs tracking-[0.22em] uppercase no-underline bg-fg text-bg px-7 py-4 hover:bg-accent-ink">
                Get in touch
              </Link>
              <a href="https://x.com/thinkDecade" target="_blank" rel="noopener noreferrer" className="font-mono text-xs tracking-[0.22em] uppercase no-underline border border-fg px-7 py-4 hover:text-accent-ink hover:border-accent-ink">
                @thinkDecade ↗
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
