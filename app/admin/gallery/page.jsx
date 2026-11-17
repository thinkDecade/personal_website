'use client'
// app/admin/gallery/page.jsx — manage gallery photos and videos.
// Photos are resized in the browser (max 2400px + a 900px thumbnail) before upload,
// then stored in object storage via /api/admin/media. Records save to the "gallery" section.
import { useEffect, useState } from 'react'
import { CATEGORIES, videoEmbed, thumbFor } from '@/lib/gallery'

const FIELD = ({ label, children, hint }) => (
  <div>
    <label className="block text-[11px] tracking-[0.15em] text-neutral-500 uppercase mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-neutral-600 mt-1">{hint}</p>}
  </div>
)
const INPUT = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A000]/60 transition-colors ${className}`}
    {...props}
  />
)

const now = () => new Date().toISOString()

function emptyItem(type) {
  const t = now()
  return {
    id: crypto.randomUUID(), title: '', description: '', type,
    src: '', thumb: '', videoUrl: '', alt: '', date: '', location: '',
    categories: type === 'video' ? ['Video'] : [], featured: false, published: false,
    order: 0, width: 0, height: 0, link: '', createdAt: t, updatedAt: t,
  }
}

// Resize an image file in the browser; returns { blob, width, height }.
async function resize(file, maxEdge, quality) {
  const bmp   = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxEdge / Math.max(bmp.width, bmp.height))
  const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d').drawImage(bmp, 0, 0, w, h)
  const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', quality))
  return { blob, width: w, height: h }
}

async function upload(blob, name) {
  const fd = new FormData()
  fd.append('file', new File([blob], name, { type: blob.type || 'image/jpeg' }))
  fd.append('folder', 'gallery')
  const res  = await fetch('/api/admin/media', { method: 'POST', body: fd })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data.src
}

function ItemRow({ item, index, total, onChange, onDelete, onMove }) {
  const [busy, setBusy] = useState('')
  const set = (k, v) => onChange(index, { ...item, [k]: v, updatedAt: now() })
  const embed = item.type === 'video' ? videoEmbed(item.videoUrl) : null

  async function handlePhoto(e, posterOnly = false) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return alert('Please choose an image file.')
    try {
      setBusy('Optimising…')
      const full  = await resize(file, 2400, 0.86)
      const small = await resize(file, 900, 0.82)
      setBusy('Uploading…')
      const [src, thumb] = await Promise.all([upload(full.blob, 'full.jpg'), upload(small.blob, 'thumb.jpg')])
      const next = posterOnly
        ? { ...item, thumb, width: full.width, height: full.height }
        : { ...item, src, thumb, width: full.width, height: full.height }
      onChange(index, { ...next, updatedAt: now() })
    } catch (err) {
      alert(err.message)
    } finally {
      setBusy('')
    }
  }

  function toggleCat(cat) {
    const has = item.categories.includes(cat)
    set('categories', has ? item.categories.filter(c => c !== cat) : [...item.categories, cat])
  }

  const preview = thumbFor(item)

  return (
    <div className={`bg-[#111] border rounded-2xl p-5 space-y-4 ${item.published ? 'border-white/10' : 'border-dashed border-white/15 opacity-90'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 text-xs font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border border-white/15 text-neutral-300">{item.type}</span>
          <span className={`text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border ${item.published ? 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10' : 'text-neutral-400 border-neutral-500/30'}`}>
            {item.published ? 'Published' : 'Draft'}
          </span>
          {item.featured && <span className="text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border text-[#F5A000] border-[#F5A000]/30 bg-[#F5A000]/10">Featured</span>}
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label="Move up"
            className="text-neutral-500 hover:text-neutral-200 disabled:opacity-20 text-sm px-2 py-1 rounded-lg hover:bg-white/5">↑</button>
          <button type="button" onClick={() => onMove(index, 1)} disabled={index === total - 1} aria-label="Move down"
            className="text-neutral-500 hover:text-neutral-200 disabled:opacity-20 text-sm px-2 py-1 rounded-lg hover:bg-white/5">↓</button>
          <button type="button" onClick={() => onDelete(index)} aria-label="Delete item"
            className="text-neutral-500 hover:text-red-400 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 ml-1">✕</button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-shrink-0 w-full sm:w-40 aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a] flex items-center justify-center">
          {preview
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={preview} alt="" className="w-full h-full object-cover" />
            : <span className="text-neutral-600 text-xs">No {item.type === 'video' ? 'poster' : 'photo'}</span>}
        </div>

        <div className="flex-1 space-y-3">
          {item.type === 'image' ? (
            <FIELD label="Photo" hint="JPEG, PNG, WebP or GIF. Resized to 2400px with a 900px thumbnail before upload.">
              <label className="inline-flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:border-white/25">
                {busy || (item.src ? '↑ Replace photo' : '↑ Upload photo')}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhoto} className="hidden" disabled={!!busy} />
              </label>
            </FIELD>
          ) : (
            <>
              <FIELD label="Video link" hint={item.videoUrl && !embed ? 'Not a recognised YouTube or Vimeo link.' : 'YouTube or Vimeo. Plays in the viewer, never autoplays.'}>
                <INPUT value={item.videoUrl} onChange={e => set('videoUrl', e.target.value.trim())} placeholder="https://www.youtube.com/watch?v=…" />
              </FIELD>
              <FIELD label="Poster image (optional)" hint="YouTube videos use their own thumbnail if you skip this.">
                <label className="inline-flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-300 hover:text-white hover:border-white/25">
                  {busy || '↑ Upload poster'}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => handlePhoto(e, true)} className="hidden" disabled={!!busy} />
                </label>
              </FIELD>
            </>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FIELD label="Title"><INPUT value={item.title} onChange={e => set('title', e.target.value)} placeholder="Digital Assets Summit Africa" /></FIELD>
            <FIELD label="Location"><INPUT value={item.location} onChange={e => set('location', e.target.value)} placeholder="Accra, Ghana" /></FIELD>
          </div>
          <FIELD label="Description"><INPUT value={item.description} onChange={e => set('description', e.target.value)} placeholder="One line of context" /></FIELD>
          <FIELD label="Alt text" hint="Describe what's in the image for screen readers.">
            <INPUT value={item.alt} onChange={e => set('alt', e.target.value)} placeholder="Muntala moderating a panel on stage" />
          </FIELD>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FIELD label="Capture date"><INPUT type="date" value={item.date} onChange={e => set('date', e.target.value)} /></FIELD>
            <FIELD label="Source link (optional)"><INPUT value={item.link} onChange={e => set('link', e.target.value.trim())} placeholder="https://…" /></FIELD>
          </div>
          <FIELD label="Categories">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button type="button" key={c} onClick={() => toggleCat(c)} aria-pressed={item.categories.includes(c)}
                  className={`text-xs rounded-full px-3 py-1.5 border ${item.categories.includes(c) ? 'bg-[#F5A000] text-black border-[#F5A000]' : 'border-white/15 text-neutral-400 hover:text-white'}`}>
                  {c}
                </button>
              ))}
            </div>
          </FIELD>
          <div className="flex flex-wrap gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input type="checkbox" checked={item.published} onChange={e => set('published', e.target.checked)} className="accent-[#F5A000]" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-300 cursor-pointer">
              <input type="checkbox" checked={item.featured} onChange={e => set('featured', e.target.checked)} className="accent-[#F5A000]" />
              Featured on homepage
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GalleryAdmin() {
  const [items,  setItems]  = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    fetch('/api/admin/data/gallery')
      .then(r => (r.ok ? r.json() : []))
      .then(d => setItems(Array.isArray(d) ? [...d].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : []))
      .catch(() => { setItems([]); setErr('Failed to load gallery') })
  }, [])

  const change = (i, next) => setItems(prev => prev.map((x, j) => (j === i ? next : x)))
  const remove = i => {
    if (!confirm('Delete this gallery item? The uploaded file is kept in storage; only the record is removed.')) return
    setItems(prev => prev.filter((_, j) => j !== i))
  }
  const move = (i, d) => setItems(prev => {
    const a = [...prev], k = i + d
    if (k < 0 || k >= a.length) return a
    ;[a[i], a[k]] = [a[k], a[i]]
    return a
  })
  const add = type => setItems(prev => [emptyItem(type), ...prev])

  async function save(e) {
    e.preventDefault()
    const missing = items.find(x => x.published && (x.type === 'image' ? !x.src : !videoEmbed(x.videoUrl)))
    if (missing) return setErr(`"${missing.title || 'Untitled'}" is published but has no ${missing.type === 'image' ? 'photo' : 'valid video link'}.`)
    const noAlt = items.find(x => x.published && x.type === 'image' && !x.alt.trim())
    if (noAlt) return setErr(`Add alt text to "${noAlt.title || 'Untitled'}" before publishing.`)
    setSaving(true); setSaved(false); setErr('')
    try {
      const body = items.map((x, i) => ({ ...x, order: i + 1 }))
      const res = await fetch('/api/admin/data/gallery', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Save failed')
      setItems(body)
      setSaved(true); setTimeout(() => setSaved(false), 3000)
    } catch (e2) {
      setErr(e2.message)
    } finally {
      setSaving(false)
    }
  }

  if (items === null) return <p className="text-neutral-500 text-sm">Loading…</p>

  const published = items.filter(x => x.published).length

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight mb-1">Gallery</h1>
          <p className="text-sm text-neutral-500">{items.length} items · {published} published. Order here is the order on the site.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => add('image')} className="text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20">+ Photo</button>
          <button type="button" onClick={() => add('video')} className="text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20">+ Video</button>
        </div>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl text-neutral-500 text-sm">No gallery items yet.</div>
      )}

      {items.map((item, i) => (
        <ItemRow key={item.id} item={item} index={i} total={items.length} onChange={change} onDelete={remove} onMove={move} />
      ))}

      <div className="sticky bottom-0 py-4 bg-[#0a0a0a]/95 flex items-center gap-4">
        <button type="submit" disabled={saving}
          className="bg-[#F5A000] text-black text-sm font-medium rounded-xl px-6 py-2.5 hover:bg-white disabled:opacity-50">
          {saving ? 'Saving…' : 'Save gallery'}
        </button>
        {saved && <span className="text-sm text-emerald-400">Saved — live on the site.</span>}
        {err && <span className="text-sm text-red-400">{err}</span>}
      </div>
    </form>
  )
}
