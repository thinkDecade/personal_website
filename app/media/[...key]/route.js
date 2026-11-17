// app/media/[...key]/route.js — public delivery of uploaded media from object storage.
// Keys are random and immutable, so responses are cached for a year.
import { readMedia } from '@/lib/media'

export async function GET(_request, { params }) {
  const { key } = await params
  const asset = await readMedia((key || []).join('/'))
  if (!asset) return new Response('Not found', { status: 404 })
  return new Response(asset.data, {
    headers: {
      'Content-Type': asset.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
