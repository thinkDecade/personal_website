// app/api/admin/media/route.js — authenticated media upload to object storage.
// Validates declared type, real file signature and size before storing.
import { NextResponse }                    from 'next/server'
import { verifyAdminToken, getAdminToken } from '@/lib/auth'
import { IMAGE_TYPES, MAX_UPLOAD_BYTES, sniffImageType, saveMedia } from '@/lib/media'

export async function POST(request) {
  if (!await verifyAdminToken(getAdminToken(request)))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let formData
  try { formData = await request.formData() }
  catch { return NextResponse.json({ error: 'Invalid upload' }, { status: 400 }) }

  const file   = formData.get('file')
  const folder = formData.get('folder') || 'gallery'
  if (!file || typeof file === 'string')
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (!IMAGE_TYPES[file.type])
    return NextResponse.json({ error: 'Only JPEG, PNG, WebP or GIF images are allowed' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  if (bytes.byteLength > MAX_UPLOAD_BYTES)
    return NextResponse.json({ error: 'File too large (max 5 MB after resizing)' }, { status: 413 })
  if (sniffImageType(bytes) !== (file.type === 'image/jpg' ? 'image/jpeg' : file.type))
    return NextResponse.json({ error: 'File contents do not match an allowed image type' }, { status: 400 })

  try {
    const src = await saveMedia(folder, bytes, file.type)
    return NextResponse.json({ src })
  } catch (err) {
    console.error('[api/media] save failed:', err.message)
    return NextResponse.json({ error: 'Storage error' }, { status: 500 })
  }
}
