'use client'
import { useState, useEffect } from 'react'

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

function EmptyPlatform() {
  return {
    id:      crypto.randomUUID(),
    name:    '',
    handle:  '',
    url:     '',
    desc:    '',
    cadence: '',
    visible: true,
  }
}

function PlatformCard({ platform, index, total, onUpdate, onDelete, onMove }) {
  return (
    <div className={`bg-[#111] border rounded-2xl p-5 space-y-4 transition-colors ${
      platform.visible === false ? 'border-white/5 opacity-50' : 'border-white/10'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 text-xs tracking-wider font-mono">{String(index + 1).padStart(2, '0')}</span>
          <button
            type="button"
            onClick={() => onUpdate(index, 'visible', !platform.visible)}
            className={`text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border font-medium transition-colors ${
              platform.visible !== false
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                : 'text-neutral-500 bg-neutral-500/10 border-neutral-500/20'
            }`}
          >
            {platform.visible !== false ? 'VISIBLE' : 'HIDDEN'}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0}
            className="text-neutral-600 hover:text-neutral-300 disabled:opacity-20 text-sm px-2 py-1 rounded-lg hover:bg-white/5 transition-all">↑</button>
          <button type="button" onClick={() => onMove(index,  1)} disabled={index === total - 1}
            className="text-neutral-600 hover:text-neutral-300 disabled:opacity-20 text-sm px-2 py-1 rounded-lg hover:bg-white/5 transition-all">↓</button>
          <button type="button" onClick={() => onDelete(index)}
            className="text-neutral-600 hover:text-red-400 text-sm px-2 py-1 rounded-lg hover:bg-red-500/10 transition-all ml-1">✕</button>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FIELD label="Platform name">
          <INPUT value={platform.name} onChange={e => onUpdate(index, 'name', e.target.value)} placeholder="X / Twitter" />
        </FIELD>
        <FIELD label="Handle / username">
          <INPUT value={platform.handle} onChange={e => onUpdate(index, 'handle', e.target.value)} placeholder="@username" />
        </FIELD>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FIELD label="URL">
          <INPUT value={platform.url} onChange={e => onUpdate(index, 'url', e.target.value)} placeholder="https://…" />
        </FIELD>
        <FIELD label="Cadence (optional)">
          <INPUT value={platform.cadence} onChange={e => onUpdate(index, 'cadence', e.target.value)} placeholder="Daily, Weekly…" />
        </FIELD>
      </div>

      <FIELD label="Description">
        <textarea
          value={platform.desc}
          onChange={e => onUpdate(index, 'desc', e.target.value)}
          rows={2}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A100]/60 transition-colors resize-none"
          placeholder="Brief description of what you share here…"
        />
      </FIELD>
    </div>
  )
}

export default function AdminSocialPage() {
  const [platforms, setPlatforms] = useState([])
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [err,       setErr]       = useState('')

  useEffect(() => {
    fetch('/api/admin/data/social')
      .then(r => r.json())
      .then(d => setPlatforms(d?.platforms ?? []))
      .catch(() => setErr('Failed to load social data'))
  }, [])

  function handleUpdate(index, field, value) {
    setPlatforms(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }
  function handleDelete(index) {
    if (!confirm('Remove this platform?')) return
    setPlatforms(prev => prev.filter((_, i) => i !== index))
  }
  function handleMove(index, dir) {
    setPlatforms(prev => {
      const arr  = [...prev]
      const swap = index + dir
      if (swap < 0 || swap >= arr.length) return arr
      ;[arr[index], arr[swap]] = [arr[swap], arr[index]]
      return arr
    })
  }
  function handleAdd() {
    setPlatforms(prev => [...prev, EmptyPlatform()])
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErr('')
    try {
      const res = await fetch('/api/admin/data/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platforms }),
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

  return (
    <form onSubmit={handleSave} className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-light text-white tracking-tight mb-1">Social platforms</h1>
          <p className="text-sm text-neutral-500">
            Manage the platform links shown on the social page.
            Toggle visibility without deleting. Reorder with ↑ ↓.
          </p>
        </div>
        <button type="button" onClick={handleAdd}
          className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20 transition-all flex-shrink-0">
          + Add platform
        </button>
      </div>

      {/* Info box */}
      <div className="bg-[#F5A100]/8 border border-[#F5A100]/20 rounded-xl p-4 text-xs text-neutral-400 leading-relaxed">
        <span className="text-[#F5A100] font-medium">Note:</span> Sovereign Frontier and the Spotify podcast are intentionally not listed here — they live on the{' '}
        <a href="/founder" target="_blank" className="text-[#F5A100] hover:underline">Projects page ↗</a> as separate ventures.
      </div>

      {platforms.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-neutral-600 text-sm mb-3">No platforms yet</p>
          <button type="button" onClick={handleAdd} className="text-sm text-[#F5A100] hover:underline">
            Add your first platform →
          </button>
        </div>
      )}

      {platforms.map((p, i) => (
        <PlatformCard
          key={p.id || i}
          platform={p}
          index={i}
          total={platforms.length}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      ))}

      {platforms.length > 0 && (
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#F5A100] text-black font-medium text-sm rounded-xl px-6 py-2.5 hover:bg-[#e09500] transition-colors disabled:opacity-40">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">✓ Saved</span>}
          {err   && <span className="text-red-400 text-sm">{err}</span>}
        </div>
      )}

      {/* Preview link */}
      <div className="pt-4 border-t border-white/10">
        <a
          href="/social"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          View social page ↗
        </a>
      </div>
    </form>
  )
}
