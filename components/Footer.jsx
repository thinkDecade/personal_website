// components/Footer.jsx — closing footer: name, and a dedicated "find me online" row.
import Link from 'next/link'
import SocialLinks from '@/components/SocialLinks'

export default function Footer() {
  return (
    <footer className="surface-dark px-6 md:px-14 pt-12 pb-10 border-t border-stone">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="flex flex-col gap-3">
          <Link href="/" className="font-serif italic font-bold text-[26px] leading-none tracking-[-0.02em] no-underline text-fg w-fit">
            MPS<span className="text-yellow-acid">.</span>
          </Link>
          <p className="font-mono text-2xs tracking-[0.2em] uppercase text-dim m-0">
            Muntala Piniyini Shaibu · Accra, Ghana
          </p>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <p className="font-mono text-2xs tracking-[0.22em] uppercase text-dim m-0">Find me online</p>
          <SocialLinks
            className="-ml-3 md:ml-0 md:-mr-3"
            linkClass="text-yellow-acid hover:text-white"
            size="w-5 h-5"
          />
        </div>
      </div>
    </footer>
  )
}
