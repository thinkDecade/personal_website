// app/api/admin/data/[section]/route.js — authenticated read + write of JSON data
import { NextResponse }                    from 'next/server'
import { revalidatePath }                  from 'next/cache'
import { verifyAdminToken, getAdminToken } from '@/lib/auth'
import { readSection, writeSection }       from '@/lib/store'

const ALLOWED  = ['content', 'events', 'founder', 'work', 'social']
const PATH_MAP = {
  content: ['/', '/admin/content'],
  events:  ['/social', '/admin/events'],
  founder: ['/founder', '/admin/founder'],
  work:    ['/work', '/admin/work'],
  social:  ['/social', '/admin/social'],
}

async function requireAuth(request) {
  return verifyAdminToken(getAdminToken(request))
}

// ── GET — read a data section ─────────────────────────────────────────────────
export async function GET(request, { params }) {
  if (!await requireAuth(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!ALLOWED.includes(section))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const data = await readSection(section)
  if (data === null)
    return NextResponse.json({ error: 'No data found' }, { status: 404 })

  return NextResponse.json(data)
}

// ── POST — overwrite a data section ──────────────────────────────────────────
export async function POST(request, { params }) {
  if (!await requireAuth(request))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { section } = await params
  if (!ALLOWED.includes(section))
    return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await request.json()
  await writeSection(section, body)

  // Revalidate all related pages so changes appear immediately
  ;(PATH_MAP[section] || []).forEach(p => revalidatePath(p))

  return NextResponse.json({ ok: true })
}
