// app/about/page.jsx
// About — the personal story behind the work: positioning, what drives it,
// the three dimensions, and where to go next.

import Link from 'next/link'

export const metadata = {
  title: 'About',
  description: 'Muntala Piniyini Shaibu — independent thinker, entrepreneur and institution builder working across technology, finance and emerging systems.',
}

const DIMENSIONS = [
  { name: 'The Thinker',  body: 'Ideas, perspectives, research, writing and intellectual exploration.', href: '/writings', cta: 'Thinking' },
  { name: 'The Builder',  body: 'Companies, products, technology, systems and institutions.',            href: '/founder',  cta: 'Building' },
  { name: 'The Operator', body: 'Execution, leadership, governance, collaboration and getting things done.', href: '/work', cta: 'Journey' },
]

export default function About() {
  return (
    <div className="w-full px-6 md:px-14 py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

        <aside className="md:col-span-3">
          <p className="font-mono text-2xs tracking-[0.22em] uppercase text-accent-ink flex items-center gap-3">
            <span>About</span>
            <span className="h-px w-10 bg-signal" aria-hidden="true" />
          </p>
        </aside>

        <article className="md:col-span-8">
          <h1 className="font-serif text-[clamp(40px,5.4vw,76px)] leading-[1.02] tracking-[-0.02em] mb-10">
            Muntala Piniyini Shaibu<span className="text-signal">.</span>
          </h1>

          <p className="font-serif italic text-[clamp(22px,2.4vw,30px)] leading-[1.35] mb-12 max-w-[780px]">
            An independent thinker, entrepreneur and institution builder working at the
            intersection of technology, finance and emerging systems.
          </p>

          <div className="flex flex-col gap-6 max-w-[680px] mb-16">
            <p className="font-serif text-[19px] leading-[1.7] text-muted m-0">
              The world doesn&rsquo;t need more observers. It needs people willing to question,
              imagine and build.
            </p>
            <p className="font-serif text-[19px] leading-[1.7] text-muted m-0">
              I am interested in the systems that shape how people live, work, exchange value
              and organise society. My work sits at the intersection of ideas and execution.
            </p>
            <p className="font-serif text-[19px] leading-[1.7] text-muted m-0">
              Based in Accra, Ghana. Working everywhere.
            </p>
          </div>

          <ol className="list-none m-0 p-0 border-t border-fg">
            {DIMENSIONS.map((d, i) => (
              <li key={d.name} className="grid grid-cols-[40px_1fr] md:grid-cols-[56px_1fr_160px] gap-4 py-7 border-b border-stone items-baseline">
                <span className="font-mono text-2xs text-dim">0{i + 1}</span>
                <div>
                  <h2 className="font-serif text-[28px] leading-tight m-0 mb-2">{d.name}</h2>
                  <p className="font-serif text-[17px] leading-[1.6] text-muted m-0">{d.body}</p>
                </div>
                <Link href={d.href} className="col-start-2 md:col-start-3 font-mono text-2xs tracking-[0.2em] uppercase no-underline text-accent-ink hover:underline md:text-right">
                  {d.cta} →
                </Link>
              </li>
            ))}
          </ol>
        </article>

      </div>
    </div>
  )
}
