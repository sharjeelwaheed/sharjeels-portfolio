import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon, InstagramIcon } from '@/components/ui/SocialIcons'
import { SOCIAL_LINKS } from '@/utils/constants'

const socials = [
  { icon: GithubIcon, href: SOCIAL_LINKS.github, label: 'GitHub' },
  { icon: LinkedinIcon, href: `https://${SOCIAL_LINKS.linkedin}`, label: 'LinkedIn' },
  { icon: InstagramIcon, href: `https://${SOCIAL_LINKS.instagram}`, label: 'Instagram' },
  { icon: Mail, href: `mailto:${SOCIAL_LINKS.email}`, label: 'Email' },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-white/30 text-sm font-body">
          © {new Date().getFullYear()} Sharjeel Ahmed Pawar. Built with passion.
        </p>
        <div className="flex items-center gap-4">
          {socials.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 flex items-center justify-center rounded-full glass text-white/50 hover:text-accent-orange hover:shadow-neon-sm transition-all duration-300"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
