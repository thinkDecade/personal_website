// app/transmissions/page.jsx
// /transmissions is now /writings — permanent redirect.
import { redirect } from 'next/navigation'
export default function Transmissions() { redirect('/writings') }
