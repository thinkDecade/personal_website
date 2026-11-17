// lib/gallery.js — gallery data model helpers, shared by the site, homepage and admin.
//
// A gallery record (stored in the "gallery" section, Netlify Blobs or data/gallery.json):
// {
//   id, title, description, type: 'image' | 'video',
//   src        original/full image URL (images) — for videos, an optional poster
//   thumb      thumbnail URL (~900px wide)
//   videoUrl   YouTube or Vimeo link (videos only)
//   alt, date (YYYY-MM-DD), location, categories: string[],
//   featured, published, order, width, height, link,
//   createdAt, updatedAt
// }

export const CATEGORIES = ['Portraits', 'Speaking', 'Events', 'Travel', 'Behind the Scenes', 'Video']

/** Published items, sorted by order (then newest first). */
export function publishedItems(items) {
  return (items || [])
    .filter(i => i && i.published)
    .sort((a, b) =>
      (a.order ?? 9999) - (b.order ?? 9999) ||
      String(b.date || b.createdAt || '').localeCompare(String(a.date || a.createdAt || '')))
}

/** Is this item in a filter category? "Video" also matches any video item. */
export function inCategory(item, cat) {
  if (cat === 'All') return true
  if (cat === 'Video' && item.type === 'video') return true
  return (item.categories || []).includes(cat)
}

/** Parse a YouTube or Vimeo URL into a privacy-friendly embed (no autoplay). */
export function videoEmbed(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    let id = null
    if (host === 'youtu.be') id = u.pathname.slice(1)
    else if (host.endsWith('youtube.com')) {
      id = u.searchParams.get('v') || (u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/) || [])[2]
    }
    if (id && /^[\w-]{6,20}$/.test(id)) {
      return {
        provider: 'youtube',
        embed: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
        poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }
    }
    if (host.endsWith('vimeo.com')) {
      const vid = (u.pathname.match(/(\d{6,})/) || [])[1]
      if (vid) return { provider: 'vimeo', embed: `https://player.vimeo.com/video/${vid}?dnt=1`, poster: null }
    }
  } catch {}
  return null
}

/** Best thumbnail for an item (uploaded thumb, else video poster, else src). */
export function thumbFor(item) {
  if (item.thumb) return item.thumb
  if (item.type === 'video') return videoEmbed(item.videoUrl)?.poster || item.src || ''
  return item.src || ''
}

/** Width/height for layout reservation; videos default to 16:9. */
export function ratioFor(item) {
  if (item.width && item.height) return { w: item.width, h: item.height }
  return item.type === 'video' ? { w: 16, h: 9 } : { w: 4, h: 3 }
}
