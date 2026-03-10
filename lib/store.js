// lib/store.js — data persistence abstraction
//
// Development  → reads/writes local JSON files in /data/
// Netlify prod → reads/writes Netlify Blobs (key = section name)
//                Falls back to the committed JSON file on first read
//                so the initial deploy "just works" with no migration step.

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// Netlify sets this env var at runtime (functions + SSR)
const IS_NETLIFY = process.env.NETLIFY === 'true'

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
  if (IS_NETLIFY) {
    try {
      const store = await getBlobStore()
      const data  = await store.get(section, { type: 'json' })
      if (data !== null) return data
    } catch {
      // Blobs context unavailable — fall through to local file
    }
  }
  // Dev, or first deploy before any admin save: use the committed JSON file
  return readLocal(section)
}

/**
 * Write a data section.
 * In dev: updates the local JSON file.
 * On Netlify: stores in Netlify Blobs.
 */
export async function writeSection(section, data) {
  if (IS_NETLIFY) {
    const store = await getBlobStore()
    await store.setJSON(section, data)
    return
  }
  writeLocal(section, data)
}
