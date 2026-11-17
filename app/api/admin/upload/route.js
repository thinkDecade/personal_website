// app/api/admin/upload/route.js — legacy upload endpoint used by the Events admin.
// Previously wrote into /public at runtime, which does not persist on Netlify
// (uploads vanished on the next deploy). Now stores in object storage via lib/media.
export { POST } from '@/app/api/admin/media/route'
