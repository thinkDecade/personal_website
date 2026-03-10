// lib/substack.js
// Fetches the latest posts from a Substack RSS feed
// Called server-side in the Transmissions page (no API key needed)

export async function getSubstackPosts(feedUrl, limit = 5) {
  try {
    const res = await fetch(feedUrl, {
      // Revalidate every hour — keeps content fresh without hammering the feed
      next: { revalidate: 3600 },
    })

    if (!res.ok) throw new Error(`Failed to fetch ${feedUrl}`)

    const xml = await res.text()

    // Parse the RSS XML — Next.js runs server-side so we use regex here
    // (no DOM available). For a more robust parser, install 'rss-parser'.
    const items = []
    const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g)

    for (const match of itemMatches) {
      const item = match[1]

      const title    = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)
                    || item.match(/<title>(.*?)<\/title>/)
      const link     = item.match(/<link>(.*?)<\/link>/)
      const pubDate  = item.match(/<pubDate>(.*?)<\/pubDate>/)
      const desc     = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)
                    || item.match(/<description>(.*?)<\/description>/)

      if (!title) continue

      // Strip HTML tags from description for the preview
      const rawDesc   = desc ? desc[1] : ''
      const cleanDesc = rawDesc.replace(/<[^>]+>/g, '').trim()

      // Take first ~180 chars as preview
      const preview = cleanDesc.length > 180
        ? cleanDesc.slice(0, 180).trimEnd() + '…'
        : cleanDesc

      // Format the date — e.g. "Jan 28, 2025"
      const rawDate = pubDate ? new Date(pubDate[1]) : null
      const dateStr = rawDate && !isNaN(rawDate)
        ? rawDate.toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })
        : ''

      items.push({
        title:   title[1].trim(),
        url:     link ? link[1].trim() : '#',
        date:    dateStr,
        rawDate: rawDate && !isNaN(rawDate) ? rawDate.toISOString() : '',
        preview,
      })

      if (items.length >= limit) break
    }

    return items
  } catch (err) {
    console.error('Substack fetch error:', err)
    // Return empty array on failure — page still renders, just no posts
    return []
  }
}
