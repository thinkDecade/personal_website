// app/gallery/page.jsx — Gallery: a curated personal media archive.
// Records come from the "gallery" section (Netlify Blobs, seeded by data/gallery.json);
// manage them at /admin/gallery.

import { readSection }    from '@/lib/store'
import { publishedItems } from '@/lib/gallery'
import GalleryGrid        from '@/components/GalleryGrid'

export const metadata = {
  title: 'Gallery',
  description: 'A life in frames — people, places, ideas and moments along the way.',
}

export const dynamic = 'force-dynamic'

export default async function Gallery() {
  const items = publishedItems(await readSection('gallery'))

  return (
    <div className="w-full">
      <header className="surface-light px-6 md:px-14 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3">
            <p className="font-mono text-2xs tracking-[0.22em] uppercase flex items-center gap-3 m-0 md:pt-6">
              <span>Gallery</span>
              <span className="h-px w-10 bg-signal" aria-hidden="true" />
            </p>
          </div>
          <div className="md:col-span-9">
            <h1 className="font-serif italic text-[clamp(48px,7.5vw,112px)] leading-[0.98] tracking-[-0.02em] m-0 mb-6">
              A life in frames<span className="text-signal not-italic">.</span>
            </h1>
            <p className="font-serif text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-muted m-0 max-w-[560px]">
              People, places, ideas and moments along the way.
            </p>
          </div>
        </div>
      </header>

      <section className="surface-light px-6 md:px-14 pb-24 md:pb-32">
        <div className="max-w-[1280px] mx-auto border-t border-fg pt-10">
          <GalleryGrid items={items} />
        </div>
      </section>
    </div>
  )
}
