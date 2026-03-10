// app/api/admin/data/[section]/route.js — authenticated read + write of JSON data files
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join }                                     from 'path'
import { NextResponse }                             from 'next/server'
import { revalidatePath }                           from 'next/cache'
import { verifyAdminToken, getAdminToken }          from '@/lib/auth'

const ALLOWED  = ['content', 'events', 'founder', 'work', 'social']
const PATH_MAP = {
  content: ['/', '/admin/content'],
  events:  ['/social', '/admin/events'],
  founder: ['/founder', '/admin/founder'],
  work:    ['/work', '/admin/work'],
  social:  ['/social', '/admin/social'],
}

function dataPath(section) {
  return join(process.cwd(), 'data', `${section}.json`)
}

async function requireAuth(request) {
  return verifyAdminToken(getAdminToken(request))
}

// ── GET — read a data file ───────────────────────────────────────────────────
export async function GET(request, { params }) {
  if (!await requireAuth(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!ALLOWED.includes(section))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const file = dataPath(section)
  if (!existsSync(file))
    return NextResponse.json({ error: 'File missing' }, { status: 404 })

  return NextResponse.json(JSON.parse(readFileSync(file, 'utf-8')))
}

// ── POST — overwrite a data file ─────────────────────────────────────────────
export async function POST(request, { params }) {
  if (!await requireAuth(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!ALLOWED.includes(section))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  writeFileSync(dataPath(section), JSON.stringify(body, null, 2), 'utf-8')

  // Revalidate all related pages so changes appear immediately
  ;(PATH_MAP[section] || []).forEach(p => revalidatePath(p))

  return NextResponse.json({ ok: true })
}
