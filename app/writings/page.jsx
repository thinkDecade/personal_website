// app/writings/page.jsx
// thinkDecade writing archive — Muntala's pen name, long-form work.
// Sovereign Frontier is a separate project and lives on the Founder page.

import { getSubstackPosts } from '@/lib/substack'

export const metadata = {
  title: 'Writings',
  description: 'Long-form thinking from thinkDecade — AI, crypto rails, and the future of being human.',
}

export const revalidate = 3600

export default async function Writings() {

  const posts = await getSubstackPosts('https://thinkdecade.substack.com/feed', 12)

  return (
    <section className="px-6 py-16 max-w-2xl mx-auto w-full">

      {/* Header */}
      <div className="mb-14">
        <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-5">
          Writings
        </p>
        <h1 className="font-serif text-[clamp(26px,4vw,44px)] leading-[1.15] font-bold mb-6">
          Long-form thinking.<br />Unresolved questions welcome.
        </h1>

        {/* Publication link — thinkDecade only */}
        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="https://thinkdecade.substack.com"
            target="_blank" rel="noopener noreferrer"
            className="font-mono text-2xs tracking-widest uppercase text-yellow-acid no-underline hover:underline"
          >
            thinkDecade on Substack ↗
          </a>
          <span className="font-mono text-2xs text-whisper">·</span>
          <span className="font-mono text-2xs text-dim">
            Bi-weekly essays on AI, crypto &amp; economic agency
          </span>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="py-8">
          <p className="font-serif text-muted text-[16px] mb-4">
            Posts loading — check back shortly, or read directly on{' '}
            <a
              href="https://thinkdecade.substack.com"
              target="_blank" rel="noopener noreferrer"
              className="text-yellow-acid"
            >
              thinkDecade
            </a>.
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank" rel="noopener noreferrer"
              className="block py-7 border-b border-subtle no-underline group"
            >
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-2xs tracking-widest uppercase text-yellow-acid">
                  thinkDecade
                </span>
                <span className="font-mono text-2xs text-whisper">
                  {post.date}
                </span>
              </div>

              <h2 className="font-serif text-[20px] font-bold leading-snug mb-2.5 group-hover:text-yellow-acid transition-none">
                {post.title}
              </h2>

              {post.preview && (
                <p className="font-serif text-sm leading-relaxed text-dim">
                  {post.preview}
                </p>
              )}

              <p className="font-mono text-[10px] text-whisper mt-3 group-hover:text-yellow-acid">
                Read on Substack →
              </p>
            </a>
          ))}
        </div>
      )}

    </section>
  )
}
