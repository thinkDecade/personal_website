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

const TYPE_OPTS = ['FOUNDER', 'FULL-TIME', 'CONTRACT', 'ADVISORY', 'BOARD']

function typeColor(t) {
  if (t === 'FOUNDER')   return 'text-[#F5A100] bg-[#F5A100]/10 border-[#F5A100]/20'
  if (t === 'FULL-TIME') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  if (t === 'CONTRACT')  return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  if (t === 'ADVISORY')  return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
}

function EmptyRole() {
  return {
    id: crypto.randomUUID(),
    role: '', org: '', period: '', location: '', type: 'FULL-TIME', points: ['']
  }
}

function WorkCard({ entry, index, total, onUpdate, onDelete, onMove }) {
  function updatePoint(pi, val) {
    const points = [...(entry.points || [])]
    points[pi] = val
    onUpdate(index, 'points', points)
  }
  function addPoint() {
    onUpdate(index, 'points', [...(entry.points || []), ''])
  }
  function removePoint(pi) {
    onUpdate(index, 'points', (entry.points || []).filter((_, i) => i !== pi))
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 text-xs tracking-wider font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span className={`text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border font-medium ${typeColor(entry.type)}`}>
            {entry.type || 'TYPE'}
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

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4">
        <FIELD label="Role / Title">
          <INPUT value={entry.role} onChange={e => onUpdate(index, 'role', e.target.value)} placeholder="Founder & Principal Writer" />
        </FIELD>
        <FIELD label="Organisation">
          <INPUT value={entry.org} onChange={e => onUpdate(index, 'org', e.target.value)} placeholder="thinkDecade + Sovereign Frontier" />
        </FIELD>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <FIELD label="Period">
          <INPUT value={entry.period} onChange={e => onUpdate(index, 'period', e.target.value)} placeholder="2023 — Present" />
        </FIELD>
        <FIELD label="Location">
          <INPUT value={entry.location} onChange={e => onUpdate(index, 'location', e.target.value)} placeholder="Accra, Ghana" />
        </FIELD>
        <FIELD label="Type">
          <select
            value={entry.type}
            onChange={e => onUpdate(index, 'type', e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5A100]/60 transition-colors appearance-none"
          >
            {TYPE_OPTS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FIELD>
      </div>

      {/* Bullet points */}
      <div>
        <label className="block text-[11px] tracking-[0.15em] text-neutral-500 uppercase mb-2">Bullet points</label>
        <div className="space-y-2">
          {(entry.points || []).map((pt, pi) => (
            <div key={pi} className="flex gap-2 items-start">
              <span className="text-neutral-600 text-sm mt-2.5 flex-shrink-0">—</span>
              <textarea
                value={pt}
                onChange={e => updatePoint(pi, e.target.value)}
                rows={2}
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A100]/60 transition-colors resize-none"
                placeholder="Describe a key achievement or responsibility…"
              />
              {(entry.points || []).length > 1 && (
                <button type="button" onClick={() => removePoint(pi)}
                  className="text-neutral-600 hover:text-red-400 text-sm mt-2 flex-shrink-0 px-1">✕</button>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPoint}
          className="mt-2 text-xs text-[#F5A100] hover:underline ml-4"
        >
          + Add bullet
        </button>
      </div>
    </div>
  )
}

export default function WorkPage() {
  const [roles, setRoles]   = useState([])
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)
  const [err,    setErr]    = useState('')

  useEffect(() => {
    fetch('/api/admin/data/work')
      .then(r => r.json())
      .then(d => setRoles(Array.isArray(d) ? d : []))
      .catch(() => setErr('Failed to load work data'))
  }, [])

  function handleUpdate(index, field, value) {
    setRoles(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }
  function handleDelete(index) {
    if (!confirm('Remove this role?')) return
    setRoles(prev => prev.filter((_, i) => i !== index))
  }
  function handleMove(index, dir) {
    setRoles(prev => {
      const arr  = [...prev]
      const swap = index + dir
      if (swap < 0 || swap >= arr.length) return arr
      ;[arr[index], arr[swap]] = [arr[swap], arr[index]]
      return arr
    })
  }
  function handleAdd() {
    setRoles(prev => [...prev, EmptyRole()])
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErr('')
    try {
      const res = await fetch('/api/admin/data/work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roles),
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
          <h1 className="text-2xl font-light text-white tracking-tight mb-1">Work experience</h1>
          <p className="text-sm text-neutral-500">Manage your roles and experience on the work page.</p>
        </div>
        <button type="button" onClick={handleAdd}
          className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20 transition-all">
          + Add role
        </button>
      </div>

      {roles.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-neutral-600 text-sm mb-3">No roles yet</p>
          <button type="button" onClick={handleAdd} className="text-sm text-[#F5A100] hover:underline">
            Add your first role →
          </button>
        </div>
      )}

      {roles.map((r, i) => (
        <WorkCard
          key={r.id || i}
          entry={r}
          index={i}
          total={roles.length}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      ))}

      {roles.length > 0 && (
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
