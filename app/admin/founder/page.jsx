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

const STATUS_OPTS = ['ACTIVE', 'BUILDING', 'ARCHIVED', 'STEALTH']

function statusColor(s) {
  if (s === 'ACTIVE')    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  if (s === 'BUILDING')  return 'text-[#F5A100] bg-[#F5A100]/10 border-[#F5A100]/20'
  if (s === 'ARCHIVED')  return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
  if (s === 'STEALTH')   return 'text-purple-400 bg-purple-400/10 border-purple-400/20'
  return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20'
}

function EmptyProject() {
  return {
    id: crypto.randomUUID(),
    name: '', year: new Date().getFullYear().toString(),
    status: 'ACTIVE', url: '', desc: '', tags: []
  }
}

function ProjectCard({ project, index, total, onUpdate, onDelete, onMove }) {
  const [tagsText, setTagsText] = useState((project.tags || []).join(', '))

  function updateTags(val) {
    setTagsText(val)
    onUpdate(index, 'tags', val.split(',').map(t => t.trim()).filter(Boolean))
  }

  return (
    <div className="bg-[#111] border border-white/10 rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-neutral-600 text-xs tracking-wider font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span className={`text-[10px] tracking-[0.15em] uppercase rounded-full px-2 py-0.5 border font-medium ${statusColor(project.status)}`}>
            {project.status || 'STATUS'}
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
        <FIELD label="Project name">
          <INPUT value={project.name} onChange={e => onUpdate(index, 'name', e.target.value)} placeholder="thinkDecade" />
        </FIELD>
        <FIELD label="Year">
          <INPUT value={project.year} onChange={e => onUpdate(index, 'year', e.target.value)} placeholder="2023" />
        </FIELD>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FIELD label="Status">
          <select
            value={project.status}
            onChange={e => onUpdate(index, 'status', e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#F5A100]/60 transition-colors appearance-none"
          >
            {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </FIELD>
        <FIELD label="URL (optional)">
          <INPUT value={project.url} onChange={e => onUpdate(index, 'url', e.target.value)} placeholder="https://…" />
        </FIELD>
      </div>

      <FIELD label="Description">
        <textarea
          value={project.desc}
          onChange={e => onUpdate(index, 'desc', e.target.value)}
          rows={3}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#F5A100]/60 transition-colors resize-none"
          placeholder="Brief description of the project…"
        />
      </FIELD>

      <FIELD label="Tags (comma-separated)">
        <INPUT value={tagsText} onChange={e => updateTags(e.target.value)} placeholder="Writing, Research, AI" />
      </FIELD>
    </div>
  )
}

export default function FounderPage() {
  const [projects, setProjects] = useState([])
  const [saving, setSaving]     = useState(false)
  const [saved,  setSaved]      = useState(false)
  const [err,    setErr]        = useState('')

  useEffect(() => {
    fetch('/api/admin/data/founder')
      .then(r => r.json())
      .then(d => setProjects(Array.isArray(d) ? d : []))
      .catch(() => setErr('Failed to load projects'))
  }, [])

  function handleUpdate(index, field, value) {
    setProjects(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }
  function handleDelete(index) {
    if (!confirm('Remove this project?')) return
    setProjects(prev => prev.filter((_, i) => i !== index))
  }
  function handleMove(index, dir) {
    setProjects(prev => {
      const arr  = [...prev]
      const swap = index + dir
      if (swap < 0 || swap >= arr.length) return arr
      ;[arr[index], arr[swap]] = [arr[swap], arr[index]]
      return arr
    })
  }
  function handleAdd() {
    setProjects(prev => [...prev, EmptyProject()])
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setErr('')
    try {
      const res = await fetch('/api/admin/data/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projects),
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
          <h1 className="text-2xl font-light text-white tracking-tight mb-1">Projects</h1>
          <p className="text-sm text-neutral-500">Manage your ventures and projects on the founder page.</p>
        </div>
        <button type="button" onClick={handleAdd}
          className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-neutral-300 hover:text-white hover:border-white/20 transition-all">
          + Add project
        </button>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-neutral-600 text-sm mb-3">No projects yet</p>
          <button type="button" onClick={handleAdd} className="text-sm text-[#F5A100] hover:underline">
            Add your first project →
          </button>
        </div>
      )}

      {projects.map((p, i) => (
        <ProjectCard
          key={p.id || i}
          project={p}
          index={i}
          total={projects.length}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onMove={handleMove}
        />
      ))}

      {projects.length > 0 && (
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
