// components/LinkedInFeed.jsx
// LinkedIn has no public personal feed API, so posts are manually maintained
// in content/linkedin-posts/posts.js
// Update that file whenever you want to surface a new post here

import linkedInPosts from '@/content/linkedin-posts/posts'

export default function LinkedInFeed() {
  return (
    <div>
      {/* Column header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-mid">
        <span className="font-mono text-2xs tracking-widest uppercase text-yellow-acid">LinkedIn</span>
        <span className="font-mono text-2xs text-dim">Muntala Piniyini</span>
      </div>

      {/* Posts */}
      <div>
        {linkedInPosts.map((post, i) => (
          <div
            key={i}
            className="py-5 border-b border-subtle"
          >
            <p className="font-mono text-2xs text-whisper tracking-wider mb-2">
              {post.date}
            </p>
            <p className="font-serif text-[15px] leading-[1.75] text-muted">
              {post.text}
            </p>
          </div>
        ))}
      </div>

      {/* Link out */}
      <a
        href="https://www.linkedin.com/in/muntala-piniyini/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-2xs tracking-widest uppercase text-dim hover:text-yellow-acid no-underline mt-5 inline-block"
      >
        More on LinkedIn →
      </a>

      {/*
        TO UPDATE: open content/linkedin-posts/posts.js
        and add new posts to the top of the array.
        No deploy needed if using Vercel — just push the file change.
      */}
    </div>
  )
}
