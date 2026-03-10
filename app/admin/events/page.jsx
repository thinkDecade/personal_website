'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

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

function EmptyEvent() {
  return { id: crypto.randomUUID(), src: '', event: '', caption: '', tag: '', url: '' }
}

function EventRow({ ev, index, total, onUpdate, onDelete, onMove }) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'events')
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const { src, error } = await res.json()
      if (error) throw new Error(error)
      onUpdate(index, 'src', src)
    } catch (e) {
      alert(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
      {/* Top row: drag handle + controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 text-xs tracking-wider font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span
            className={`text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border font-medium ${
              ev.tag === 'NETWORKING' ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' :
              ev.tag === 'SYMPOSIUM'  ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' :
              ev.tag === 'COHORT'     ? 'text-green-400 bg-green-400/10 border-green-400/20' :
              ev.tag === 'DINNER'     ? 'text-orange-400 bg-orange-400/10 border-orange-400/20' :
              'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
            }`}
          >
            {ev.tag || 'TAG'}
          </span>
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

      {/* Photo + fields */}
      <div className="flex gap-4">
        {/* Photo preview */}
        <div className="flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border border-white/10 bg-[#1a1a1a] flex items-center justify-center relative">
          {ev.src ? (
            <img src={ev.src} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-neutral-700 text-2xl">◈</span>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FIELD label="Photo path">
              <INPUT value={ev.src} onChange={e => onUpdate(index, 'src', e.target.value)} placeholder="/events/photo.jpg" />
            </FIELD>
            <FIELD label="Upload photo">
              <label className="flex items-center gap-2 cursor-pointer bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:border-white/20 transition-all">
                {uploading ? 'Uploading…' : '↑ Choose'}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            </FIELD>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FIELD label="Event name">
              <INPUT value={ev.event} onChange={e => onUpdate(index, 'event', e.target.value)} placeholder="Event name" />
            </FIELD>
            <FIELD label="Tag">
              <INPUT value={ev.tag} onChange={e => onUpdate(index, 'tag', e.target.value.toUpperCase())} placeholder="NETWORKING" />
            </FIELD>
          </div>
          <FIELD label="Caption">
            <INPUT value={ev.caption} onChange={e => onUpdate(index, 'caption', e.target.value)} placeholder="Brief description · Location" />
          </FIELD>
          <FIELD label="Post URL (optional)">
            <INPUT value={ev.url} onChange={e => onUpdate(index, 'url', e.target.value)} placeholder="https://linkedin.com/posts/…" />
          </FIELD>
        </div>
      </div>
    </div>
  )
}

function EventsContent() {
  const [events, setEvents] = useState([])
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    fetch('/api/admin/data/events')
      .then(r => r.json())
      .then(d => setEvents(Array.isArray(d) ? d : []))
      .catch(() => setErr('Failed to load events'))
  }, [])

  function handleUpdate(index, field, value) {
    setEvents(prev => prev.map((ev, i) => i === index ? { ...ev, [field]: value } : ev))
  }
  function handleDelete(index) {
    if (!confirm('Remove this event?')) return
    setEvents(prev => prev.filter((_, i) => i !== index))
  }
  function handleMove(index, dir) {
    setEvents(prev => {
      const arr  = [...prev]
      const swap = index + dir
      if (swap < 0 || swap >= arr.length) return arr
      ;[arr[index], arr[swap]] = [arr[swap], arr[index]]
      return arr
    })
  }
  function handleAdd() {
    setEvents(prev => [...prev, EmptyEvent()])
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErr('')
    try {
      const res = await fetch('/api/admin/data/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events),
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
          <h1 className="text-2xl font-light text-white tracking-tight mb-1">Events</h1>
          <p className="text-sm text-neutral-500">Manage the events carousel on the social page.</p>
        </div>
        <button type="button" onClick={handleAdd}
          className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20 transition-all">
          + Add event
        </button>
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-neutral-600 text-sm mb-3">No events yet</p>
          <button type="button" onClick={handleAdd}
            className="text-sm text-[#F5A100] hover:underline">
            Add your first event →
          </button>
        </div>
      )}

      {events.map((ev, i) => (
        <EventRow
          key={ev.id || i}
          ev={ev}
          index={i}
          total={events.length}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      ))}

      {events.length > 0 && (
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={saving}
            className="bg-[#F5A100] text-black font-medium text-sm rounded-xl px-6 py-2.5 hover:bg-[#e09500] transition-colors disabled:opacity-40">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">✓ Saved</span>}
          {err   && <span className="text-red-400 text-sm">{err}</span>}
        </div>
      )}
    </form>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="text-neutral-500 text-sm animate-pulse">Loading…</div>}>
      <EventsContent />
    </Suspense>
  )
}
