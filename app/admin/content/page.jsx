'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const FIELD = ({ label, children }) => (
  <div>
    <label className="block text-[11px] tracking-[0.15em] text-neutral-500 uppercase mb-1.5">{label}</label>
    {children}
  </div>
)

const INPUT = ({ className = '', ...props }) => (
  <input
    className={`w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A100]/60 transition-colors ${className}`}
    {...props}
  />
)

export default function ContentPage() {
  const [hero, setHero]         = useState(null)
  const [rolesText, setRolesText] = useState('')  // comma-separated editing
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [err, setErr]           = useState('')
  const [uploading, setUploading] = useState(false)

  // Load current content
  useEffect(() => {
    fetch('/api/admin/data/content')
      .then(r => r.json())
      .then(d => {
        setHero(d.hero)
        setRolesText((d.hero?.roles || []).join('\n'))
      })
      .catch(() => setErr('Failed to load content'))
  }, [])

  function updateHero(field, value) {
    setHero(prev => ({ ...prev, [field]: value }))
  }

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'uploads')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const { src, error } = await res.json()
      if (error) throw new Error(error)
      updateHero('photo', src)
    } catch (e) {
      setErr(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErr('')
    try {
      const roles = rolesText.split('\n').map(s => s.trim()).filter(Boolean)
      const body  = { hero: { ...hero, roles } }
      const res   = await fetch('/api/admin/data/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Save failed')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!hero) return (
    <div className="text-neutral-500 text-sm animate-pulse">Loading…</div>
  )

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-light text-white tracking-tight mb-1">Hero content</h1>
        <p className="text-sm text-neutral-500">Edit the homepage hero section.</p>
      </div>

      {/* Headline */}
      <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase">Headline</h2>
        <div className="grid grid-cols-2 gap-4">
          <FIELD label="Line 1">
            <INPUT value={hero.headline1 || ''} onChange={e => updateHero('headline1', e.target.value)} placeholder="Thinking," />
          </FIELD>
          <FIELD label="Line 2">
            <INPUT value={hero.headline2 || ''} onChange={e => updateHero('headline2', e.target.value)} placeholder="building." />
          </FIELD>
        </div>
      </section>

      {/* Badge & context */}
      <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase">Badge & context</h2>
        <FIELD label="Status badge text">
          <INPUT value={hero.statusBadge || ''} onChange={e => updateHero('statusBadge', e.target.value)} placeholder="Open to conversations" />
        </FIELD>
        <FIELD label="Context line 1 (top right)">
          <INPUT value={hero.contextLine1 || ''} onChange={e => updateHero('contextLine1', e.target.value)} placeholder="AI · Crypto · Fintech" />
        </FIELD>
        <FIELD label="Context line 2 (location)">
          <INPUT value={hero.contextLine2 || ''} onChange={e => updateHero('contextLine2', e.target.value)} placeholder="Accra, Ghana 🇬🇭 · Global" />
        </FIELD>
      </section>

      {/* Name */}
      <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase">Name display</h2>
        <div className="grid grid-cols-2 gap-4">
          <FIELD label="First name">
            <INPUT value={hero.name || ''} onChange={e => updateHero('name', e.target.value)} placeholder="MUNTALA" />
          </FIELD>
          <FIELD label="Surname">
            <INPUT value={hero.surname || ''} onChange={e => updateHero('surname', e.target.value)} placeholder="PINIYINI" />
          </FIELD>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase">Roles (bottom right)</h2>
        <FIELD label="One line per role pair">
          <textarea
            value={rolesText}
            onChange={e => setRolesText(e.target.value)}
            rows={5}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A100]/60 transition-colors resize-none font-mono"
            placeholder={"FOUNDER · BUILDER\nCREATOR · WRITER\nOPERATOR · TINKERER\nMANY HATS."}
          />
        </FIELD>
        <p className="text-[11px] text-neutral-600">Each line = one row in the roles display.</p>
      </section>

      {/* Photo */}
      <section className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase">Hero photo</h2>
        <div className="flex items-start gap-6">
          {/* Current photo preview */}
          {hero.photo && (
            <div className="relative w-24 h-28 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-[#1a1a1a]">
              <Image
                src={hero.photo}
                alt="Hero photo"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}
          <div className="flex-1 space-y-3">
            <FIELD label="Photo path">
              <INPUT value={hero.photo || ''} onChange={e => updateHero('photo', e.target.value)} placeholder="/muntala.jpg" />
            </FIELD>
            <div>
              <label className="block text-[11px] tracking-[0.15em] text-neutral-500 uppercase mb-1.5">Upload new photo</label>
              <label className="inline-flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all">
                {uploading ? 'Uploading…' : '↑ Choose file'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Save bar */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#F5A100] text-black font-medium text-sm rounded-xl px-6 py-2.5 hover:bg-[#e09500] transition-colors disabled:opacity-40"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-emerald-400 text-sm">✓ Saved</span>}
        {err   && <span className="text-red-400 text-sm">{err}</span>}
      </div>
    </form>
  )
}
