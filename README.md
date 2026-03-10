# thinkDecade — Site Setup

## First time setup

```bash
npx create-next-app@latest thinkdecade
cd thinkdecade
```

When prompted:
- TypeScript → **No**
- ESLint → **Yes**
- Tailwind CSS → **Yes**
- `src/` directory → **No**
- App Router → **Yes**
- Turbopack → **Yes**
- Customize import alias → **No**

Then copy all files from this folder into the project root, replacing any that exist.

```bash
npm run dev
```

Visit http://localhost:3000

---

## File map

```
app/
  layout.jsx          ← fonts, metadata, Nav + Footer wired in
  globals.css         ← resets, selection color, utility classes
  page.jsx            ← Home — opening argument
  thesis/page.jsx     ← Manifesto
  artifacts/page.jsx  ← Projects (accordion)
  transmissions/page.jsx ← Substack RSS feed (auto-updates)
  static/page.jsx     ← X + LinkedIn feeds
  present/page.jsx    ← /now page
  record/page.jsx     ← Resume

components/
  Nav.jsx             ← Text-only nav with all six section names
  Footer.jsx          ← Location + X handle
  XFeed.jsx           ← Twitter embed widget
  LinkedInFeed.jsx    ← Reads from content/linkedin-posts/posts.js

content/
  linkedin-posts/
    posts.js          ← MANUALLY UPDATE THIS when you post on LinkedIn

lib/
  substack.js         ← RSS fetch helper for /transmissions
```

---

## How to update content

### New LinkedIn post
Open `content/linkedin-posts/posts.js` and add to the top of the array:
```js
{ date: 'Mar 10, 2026', text: 'Your post text here.' },
```

### /now page
Open `app/present/page.jsx` and update the `reading` array and the building/attention paragraphs. Change the "Updated" date in the header.

### New project
Open `app/artifacts/page.jsx` and add to the `projects` array.

### Substack
Automatic — both feeds revalidate every hour. Nothing to do.

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Follow the prompts. Domain can be connected later via the Vercel dashboard.
