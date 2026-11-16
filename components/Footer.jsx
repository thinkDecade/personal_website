// components/Footer.jsx

export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-subtle flex items-center justify-between">

      <span className="font-mono text-2xs text-whisper tracking-widest uppercase">
        Muntala Piniyini — Ghana
      </span>

      <a
        href="https://x.com/thinkDecade"
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-2xs text-whisper tracking-widest no-underline hover:text-accent-ink"
      >
        @thinkDecade
      </a>

    </footer>
  )
}
