// lib/store.js — data persistence abstraction
//
// Development  → reads/writes local JSON files in /data/
// Netlify prod → reads/writes Netlify Blobs (key = section name)
//                Falls back to the committed JSON file on first read
//                so the initial deploy "just works" with no migration step.

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// NETLIFY_BLOBS_CONTEXT is injected by @netlify/plugin-nextjs at runtime.
// It's the most reliable signal that Netlify Blobs is actually available.
// NETLIFY=true is set in the build env but NETLIFY_BLOBS_CONTEXT confirms
// that the runtime context (siteID + token) has been wired up correctly.
function blobsAvailable() {
  return !!(process.env.NETLIFY_BLOBS_CONTEXT || process.env.NETLIFY_LOCAL)
}

// ── Local filesystem helpers (dev + initial-seed fallback) ─────────────────

function localPath(section) {
  return join(process.cwd(), 'data', `${section}.json`)
}

function readLocal(section) {
  try {
    const file = localPath(section)
    if (!existsSync(file)) return null
    return JSON.parse(readFileSync(file, 'utf-8'))
  } catch {
    return null
  }
}

function writeLocal(section, data) {
  writeFileSync(localPath(section), JSON.stringify(data, null, 2), 'utf-8')
}

// ── Netlify Blobs helpers ──────────────────────────────────────────────────

async function getBlobStore() {
  const { getStore } = await import('@netlify/blobs')
  return getStore('site-data')
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Read a data section.
 * Returns the parsed JSON object, or null if not found.
 */
export async function readSection(section) {
  if (blobsAvailable()) {
    try {
      const store = await getBlobStore()
      const data  = await store.get(section, { type: 'json' })
      if (data !== null) return data
    } catch (err) {
      // Blobs context unavailable or key missing — fall through to local file
      console.warn(`[store] Blobs read failed for "${section}": ${err.message}`)
    }
  }
  // Dev, or first deploy before any admin save: use the committed JSON file
  return readLocal(section)
}

/**
 * Write a data section.
 * In dev: updates the local JSON file.
 * On Netlify: stores in Netlify Blobs (throws on failure so caller can respond with JSON error).
 */
export async function writeSection(section, data) {
  if (blobsAvailable()) {
    try {
      const store = await getBlobStore()
      await store.setJSON(section, data)
      return
    } catch (err) {
      console.error(`[store] Blobs write failed for "${section}": ${err.message}`)
      throw new Error(`Storage error: ${err.message}`)
    }
  }
  // Dev fallback — write to local JSON file
  writeLocal(section, data)
}
