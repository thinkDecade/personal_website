// app/api/admin/upload/route.js — authenticated image upload to /public/*
import { writeFileSync, mkdirSync }              from 'fs'
import { join, extname }                          from 'path'
import { NextResponse }                           from 'next/server'
import { verifyAdminToken, getAdminToken }        from '@/lib/auth'

const ALLOWED_TYPES  = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export async function POST(request) {
  // ── Auth check ──────────────────────────────────────────────────────────────
  if (!await verifyAdminToken(getAdminToken(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Parse form data ─────────────────────────────────────────────────────────
  const formData = await request.formData()
  const file     = formData.get('file')
  const folder   = (formData.get('folder') || 'events').replace(/[^a-z0-9-_]/gi, '')

  if (!file || typeof file === 'string')
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  if (!ALLOWED_TYPES.includes(file.type))
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })

  // ── Size check ──────────────────────────────────────────────────────────────
  const bytes = await file.arrayBuffer()
  if (bytes.byteLength > MAX_SIZE_BYTES)
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 })

  // ── Save to disk ─────────────────────────────────────────────────────────────
  const ext      = extname(file.name) || '.jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const dir      = join(process.cwd(), 'public', folder)

  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, filename), Buffer.from(bytes))

  return NextResponse.json({ src: `/${folder}/${filename}` })
}
