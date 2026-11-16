// app/manifest.js — web app manifest (home-screen name + icons)
export default function manifest() {
  return {
    name: 'Muntala Piniyini Shaibu',
    short_name: 'MPS',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F0F0F',
    theme_color: '#0F0F0F',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
