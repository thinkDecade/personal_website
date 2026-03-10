import Link            from 'next/link'
import { readSection } from '@/lib/store'

function StatCard({ href, label, count, icon, status }) {
  return (
    <Link href={href} className="block bg-[#111] border border-white/10 rounded-2xl p-6 hover:border-[#F5A100]/40 hover:bg-[#F5A100]/5 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        {status && (
          <span className="text-[10px] tracking-[0.15em] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-full px-2 py-0.5 uppercase">
            {status}
          </span>
        )}
      </div>
      <div className="text-3xl font-light text-white mb-1">{count}</div>
      <div className="text-xs tracking-[0.1em] text-neutral-500 uppercase">{label}</div>
    </Link>
  )
}

function QuickLink({ href, label, desc }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-4 bg-[#111] border border-white/10 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all group"
    >
      <div>
        <div className="text-sm text-white font-medium">{label}</div>
        <div className="text-xs text-neutral-500 mt-0.5">{desc}</div>
      </div>
      <span className="text-neutral-600 group-hover:text-neutral-400 transition-colors text-lg">→</span>
    </Link>
  )
}

export default async function AdminDashboard() {
  const [events, founder, work, content, social] = await Promise.all([
    readSection('events'),
    readSection('founder'),
    readSection('work'),
    readSection('content'),
    readSection('social'),
  ])

  const eventCount    = Array.isArray(events)            ? events.length  : 0
  const projectCount  = Array.isArray(founder)           ? founder.length : 0
  const workCount     = Array.isArray(work)              ? work.length    : 0
  const platformCount = Array.isArray(social?.platforms) ? social.platforms.filter(p => p.visible !== false).length : 0

  const activeProjects = Array.isArray(founder)
    ? founder.filter(p => p.status === 'ACTIVE' || p.status === 'BUILDING').length
    : 0

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-light text-white tracking-tight mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-500">Manage your site content from here.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        <StatCard href="/admin/events"  label="Events"    count={eventCount}    icon="◈" />
        <StatCard href="/admin/founder" label="Projects"  count={projectCount}  icon="◉" status={activeProjects > 0 ? `${activeProjects} active` : undefined} />
        <StatCard href="/admin/work"    label="Roles"     count={workCount}     icon="◎" />
        <StatCard href="/admin/social"  label="Platforms" count={platformCount} icon="◐" status="live" />
        <StatCard href="/admin/content" label="Hero"      count="1"             icon="✦" status="live" />
      </div>

      {/* Quick actions */}
      <div className="mb-10">
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase mb-4">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickLink href="/admin/events"  label="Add event"    desc="Upload photos and add event details" />
          <QuickLink href="/admin/founder" label="Add project"  desc="Add a new project or venture" />
          <QuickLink href="/admin/work"    label="Add role"     desc="Add a work experience entry" />
          <QuickLink href="/admin/social"  label="Edit social"  desc="Manage platform links on the social page" />
          <QuickLink href="/admin/content" label="Edit hero"    desc="Update headline, badge, and photo" />
        </div>
      </div>

      {/* Current hero snapshot */}
      {content?.hero && (
        <div className="mb-10">
          <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase mb-4">Hero snapshot</h2>
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wider">Headline</div>
                <div className="text-white font-serif italic text-lg leading-tight">
                  {content.hero.headline1} {content.hero.headline2}
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wider">Status badge</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#F5A100] rounded-full animate-pulse" />
                  <span className="text-white text-sm">{content.hero.statusBadge}</span>
                </div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wider">Context</div>
                <div className="text-white">{content.hero.contextLine1}</div>
                <div className="text-neutral-400 text-xs">{content.hero.contextLine2}</div>
              </div>
              <div>
                <div className="text-neutral-500 text-xs mb-1 uppercase tracking-wider">Roles</div>
                <div className="text-white text-xs leading-relaxed">
                  {content.hero.roles?.join(' / ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Site links */}
      <div>
        <h2 className="text-xs tracking-[0.2em] text-neutral-600 uppercase mb-4">Site pages</h2>
        <div className="flex flex-wrap gap-3">
          {['/', '/work', '/founder', '/social', '/connect'].map(page => (
            <a
              key={page}
              href={page}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-500 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 hover:text-white hover:border-white/20 transition-all"
            >
              {page === '/' ? 'Home' : page.slice(1).charAt(0).toUpperCase() + page.slice(2)} ↗
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
