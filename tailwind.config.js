// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './content/**/*.{js,jsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono:  ['var(--font-mono)', 'monospace'],
      },
      colors: {
        'yellow-acid': 'rgb(var(--color-signal) / <alpha-value>)',  // now Signal #D95D35
        'accent-ink': 'rgb(var(--color-accent-ink) / <alpha-value>)',
        'bg':          'rgb(var(--color-bg) / <alpha-value>)',
        'fg':          'rgb(var(--color-fg) / <alpha-value>)',
      },
      fontSize: {
        '2xs': '10px',
        'xs':  '11px',
        'sm':  '13px',
      },
    },
  },
  plugins: [],
}
