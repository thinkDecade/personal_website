// app/layout.jsx
import { Playfair_Display, JetBrains_Mono } from 'next/font/google'
import ConditionalNav from '@/components/ConditionalNav'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'thinkDecade',
    template: '%s — thinkDecade',
  },
  description: 'Muntala Piniyini — AI agents, crypto rails, and the future of being human.',
  openGraph: {
    title: 'thinkDecade',
    description: 'Muntala Piniyini — AI agents, crypto rails, and the future of being human.',
    url: 'https://thinkdecade.xyz',
    siteName: 'thinkDecade',
  },
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${playfair.variable} ${mono.variable}`}
    >
      <body className="bg-bg text-fg font-serif antialiased min-h-screen flex flex-col">
        {/* Anti-FOUC: reads localStorage before React hydrates to prevent theme flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
        <ConditionalNav />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
