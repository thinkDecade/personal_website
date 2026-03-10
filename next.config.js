/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Allow Next.js <Image> to load from any https source
  // (needed for admin photo previews, uploaded images, etc.)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http',  hostname: 'localhost' },
    ],
  },

  // HTTP security headers — applied to every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // ── Content Security Policy ────────────────────────────────────────
          // Restricts which origins can load scripts, styles, frames, etc.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Scripts: self + inline/eval (Next.js requirement) + Twitter widget
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://platform.twitter.com https://cdn.syndication.twimg.com",
              // Styles: self + inline (Tailwind) + Twitter + Google Fonts
              "style-src 'self' 'unsafe-inline' https://platform.twitter.com https://fonts.googleapis.com",
              // Fonts
              "font-src 'self' data: https://fonts.gstatic.com",
              // Iframes: Twitter timeline + Spotify
              "frame-src https://platform.twitter.com https://twitter.com https://syndication.twitter.com https://open.spotify.com",
              // Images: self + data URIs + blobs + any HTTPS + localhost (dev)
              "img-src 'self' data: blob: https: http://localhost:*",
              // Media
              "media-src 'self' blob: https:",
              // XHR / Fetch: self + Twitter + WebSocket for HMR in dev
              "connect-src 'self' https://api.twitter.com https://platform.twitter.com https://t.co ws: wss:",
            ].join('; '),
          },
          // ── Clickjacking protection ────────────────────────────────────────
          // Prevents this site from being embedded in a foreign iframe.
          { key: 'X-Frame-Options',         value: 'SAMEORIGIN' },
          // ── MIME sniffing protection ───────────────────────────────────────
          // Forces browsers to respect the declared Content-Type.
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          // ── XSS filter (legacy browsers) ──────────────────────────────────
          { key: 'X-XSS-Protection',        value: '1; mode=block' },
          // ── Referrer policy ───────────────────────────────────────────────
          // Sends full URL only to same origin; sends only origin to external sites.
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          // ── Permissions policy ────────────────────────────────────────────
          // Disables browser features this site doesn't need.
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
