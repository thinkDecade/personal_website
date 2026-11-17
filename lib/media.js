// lib/media.js — binary media storage (gallery images, event photos).
//
// Netlify  → Netlify Blobs store "media" (persistent object storage).
// Local dev → files under /public/uploads. Both are served through /media/<key>.
//
// Uploads are stored under random keys; nothing is ever overwritten, and
// deleting a gallery record never deletes its asset.

import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png':  'png',
  'image/webp': 'webp',
  'image/gif':  'gif',
}
// Netlify functions accept request bodies up to ~6 MB, so images are resized
// in the browser before upload (see app/admin/gallery). 5 MB is the hard cap.
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024

function blobsAvailable() {
  return !!(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_LOCAL)
}

async function mediaStore() {
  const { getStore } = await import('@netlify/blobs')
  return getStore('media')
}

// Check the file's first bytes really match the declared image type.
export function sniffImageType(buf) {
  const b = new Uint8Array(buf.slice(0, 12))
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png'
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif'
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp'
  return null
}

/** Save bytes; returns the public URL path (e.g. /media/gallery/abc.jpg). */
export async function saveMedia(folder, bytes, contentType) {
  const ext = IMAGE_TYPES[contentType]
  const safeFolder = String(folder || 'gallery').replace(/[^a-z0-9-_]/gi, '') || 'gallery'
  const key = `${safeFolder}/${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`

  if (blobsAvailable()) {
    const store = await mediaStore()
    await store.set(key, bytes, { metadata: { contentType } })
    return `/media/${key}`
  }
  const dir = join(process.cwd(), 'public', 'uploads', safeFolder)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(process.cwd(), 'public', 'uploads', key), Buffer.from(bytes))
  return `/media/${key}`
}

/** Read a stored asset by key; returns { data, contentType } or null. */
export async function readMedia(key) {
  if (!/^[a-z0-9-_]+\/[a-z0-9-]+\.(jpg|png|webp|gif)$/i.test(key)) return null
  if (blobsAvailable()) {
    const store = await mediaStore()
    const res = await store.getWithMetadata(key, { type: 'arrayBuffer' })
    if (!res) return null
    return { data: res.data, contentType: res.metadata?.contentType || 'application/octet-stream' }
  }
  const file = join(process.cwd(), 'public', 'uploads', key)
  if (!existsSync(file)) return null
  const ext = key.split('.').pop().toLowerCase()
  const type = Object.entries(IMAGE_TYPES).find(([, e]) => e === ext)?.[0] || 'application/octet-stream'
  return { data: readFileSync(file), contentType: type }
}
