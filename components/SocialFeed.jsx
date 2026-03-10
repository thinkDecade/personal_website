// components/SocialFeed.jsx
// X (Twitter): official timeline embed using the exact code from Twitter's embed generator.
// LinkedIn:    no public post-feed API — renders a styled profile card + direct link.
'use client'

import Script from 'next/script'
import { useEffect, useState, useRef } from 'react'

function TwitterFeed() {
  const [theme, setTheme] = useState('light')
  const containerRef      = useRef(null)

  useEffect(() => {
    // Detect and follow the site theme
    const getTheme = () =>
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'

    setTheme(getTheme())

    const observer = new MutationObserver(() => {
      const t = getTheme()
      setTheme(t)
      // Re-render widget when theme flips
      if (window.twttr?.widgets && containerRef.current) {
        containerRef.current.innerHTML = ''
        window.twttr.widgets.createTimeline(
          { sourceType: 'profile', screenName: 'muntala_piniyin' },
          containerRef.current,
          { theme: t, height: 560, chrome: 'noheader nofooter noborders transparent', tweetLimit: 6 }
        )
      }
    })
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col h-full">
      <p className="font-mono text-2xs text-dim tracking-widest uppercase mb-4">X / Twitter</p>

      {/* ── Official Twitter embed ── exact href from Twitter's embed generator ── */}
      <div
        ref={containerRef}
        key={theme}   /* re-mount when theme changes so widget re-renders cleanly */
        className="flex-1 border border-subtle overflow-hidden"
        style={{ minHeight: 'clamp(380px, 55vh, 560px)' }}
      >
        <a
          className="twitter-timeline"
          data-theme={theme}
          data-height="500"
          data-chrome="noheader nofooter noborders transparent"
          href="https://twitter.com/muntala_piniyin?ref_src=twsrc%5Etfw"
        >
          Tweets by muntala_piniyin
        </a>
      </div>

      {/* Twitter widget script — loaded once, lazily */}
      <Script
        id="twitter-widgets"
        src="https://platform.twitter.com/widgets.js"
        charset="utf-8"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.twttr?.widgets) window.twttr.widgets.load()
        }}
      />
    </div>
  )
}

function LinkedInCard() {
  return (
    <div className="flex flex-col h-full">
      <p className="font-mono text-2xs text-dim tracking-widest uppercase mb-4">LinkedIn</p>

      {/* Profile card */}
      <a
        href="https://www.linkedin.com/in/muntala-piniyini/"
        target="_blank"
        rel="noopener noreferrer"
        className="group block border border-subtle p-6 hover:border-yellow-acid
                   transition-colors no-underline mb-4"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-yellow-acid/10 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-yellow-acid" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </div>
          <div>
            <p className="font-mono text-xs font-bold text-fg tracking-wide">Muntala Piniyini</p>
            <p className="font-mono text-[9px] text-dim tracking-widest uppercase">
              linkedin.com/in/muntala-piniyini
            </p>
          </div>
        </div>
        <p className="font-serif text-[14px] text-muted leading-[1.7] mb-4">
          Professional updates, project announcements, and long-form takes
          on AI, crypto rails, and economic sovereignty.
        </p>
        <span className="font-mono text-[9px] tracking-widest uppercase text-whisper
                          group-hover:text-yellow-acid transition-colors">
          Open Profile ↗
        </span>
      </a>

      {/* LinkedIn note */}
      <div className="border border-subtle border-dashed p-4 flex-1 flex items-center gap-3">
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-dim shrink-0 fill-current" aria-hidden="true">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
        </svg>
        <p className="font-mono text-[9px] text-dim leading-relaxed tracking-wide">
          LinkedIn does not offer a public post-embed API.
          A live feed would require LinkedIn OAuth approval.
          Reach out directly via the profile above.
        </p>
      </div>
    </div>
  )
}

export default function SocialFeed() {
  return (
    <div className="mb-20">
      <div className="mb-8 border-b border-subtle pb-4">
        <p className="font-mono text-2xs text-yellow-acid tracking-widest uppercase mb-1">
          Live Feed
        </p>
        <p className="font-mono text-[9px] text-whisper tracking-widest uppercase">
          Latest from the internet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <TwitterFeed />
        <LinkedInCard />
      </div>
    </div>
  )
}
