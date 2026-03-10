// components/XFeed.jsx
// Renders the X (Twitter) timeline for @muntala_piniyin
// Uses Twitter's official embed widget — no API key required
// The widget is loaded client-side only (browser script)

'use client'

import { useEffect } from 'react'

export default function XFeed() {

  useEffect(() => {
    // Load the Twitter widgets script if it isn't already present
    // This is how Twitter's official embeds work — one global script
    if (window.twttr) {
      window.twttr.widgets.load()
    } else {
      const script = document.createElement('script')
      script.src = 'https://platform.twitter.com/widgets.js'
      script.async = true
      script.charset = 'utf-8'
      document.body.appendChild(script)
    }
  }, [])

  return (
    <div>
      {/* Column header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-mid">
        <span className="font-mono text-2xs tracking-widest uppercase text-yellow-acid">X</span>
        <span className="font-mono text-2xs text-dim">@muntala_piniyin</span>
      </div>

      {/*
        Twitter's official timeline embed
        data-theme="dark"        — matches our black background
        data-chrome="noheader nofooter noborders transparent"
                                 — strips Twitter's own chrome so it sits flush
        data-tweet-limit="5"     — show 5 tweets max
        data-width="100%"        — fill the column

        NOTE: Twitter may prompt for cookie consent in some regions.
        If the embed is blocked, replace this with a manual posts array
        (same pattern as LinkedIn below).
      */}
      <a
        className="twitter-timeline no-underline"
        data-theme="dark"
        data-chrome="noheader nofooter noborders transparent"
        data-tweet-limit="5"
        data-width="100%"
        data-dnt="true"
        href="https://twitter.com/muntala_piniyin"
        style={{ colorScheme: 'dark' }}
      >
        Loading posts…
      </a>
    </div>
  )
}
