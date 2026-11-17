// components/SocialLinks.jsx — verified social profiles, one source of truth.
// Only profiles confirmed for this site are listed. Add Instagram, YouTube or
// Farcaster here once there is a verified URL for them.
import { IconX, IconLinkedIn, IconSubstack, IconGitHub } from '@/components/icons'

export const SOCIALS = [
  { id: 'linkedin', label: 'LinkedIn',  url: 'https://www.linkedin.com/in/muntala-piniyini/', Icon: IconLinkedIn },
  { id: 'x',        label: 'X',         url: 'https://x.com/thinkDecade',                     Icon: IconX },
  { id: 'substack', label: 'Substack',  url: 'https://thinkdecade.substack.com',              Icon: IconSubstack },
  { id: 'github',   label: 'GitHub',    url: 'https://github.com/thinkDecade',                Icon: IconGitHub },
]

// Header shows the priority profiles only.
export const HEADER_SOCIALS = ['linkedin', 'x']

/**
 * Row of icon links.
 * - ids: which profiles to show (default: all)
 * - linkClass: classes for each link (colour, hover)
 * - size: icon size classes
 */
export default function SocialLinks({ ids, className = '', linkClass = '', size = 'w-[18px] h-[18px]' }) {
  const items = ids ? SOCIALS.filter(s => ids.includes(s.id)) : SOCIALS
  return (
    <ul className={`list-none m-0 p-0 flex items-center ${className}`}>
      {items.map(({ id, label, url, Icon }) => (
        <li key={id}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${label} (opens in a new tab)`}
            title={label}
            className={`flex items-center justify-center w-11 h-11 no-underline ${linkClass}`}
          >
            <Icon className={size} />
          </a>
        </li>
      ))}
    </ul>
  )
}
