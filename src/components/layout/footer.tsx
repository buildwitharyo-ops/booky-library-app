import { BookyMark } from '@/components/brand/booky-mark'
import { Container } from './container'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
} from './social-icons'

const socials = [
  { label: 'Facebook', Icon: FacebookIcon, href: 'https://facebook.com' },
  { label: 'Instagram', Icon: InstagramIcon, href: 'https://instagram.com' },
  { label: 'LinkedIn', Icon: LinkedinIcon, href: 'https://linkedin.com' },
  { label: 'TikTok', Icon: TiktokIcon, href: 'https://tiktok.com' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted/40">
      <Container className="flex flex-col items-center gap-5 py-12 text-center">
        <div className="flex items-center gap-2">
          <BookyMark className="size-7" />
          <span className="text-xl font-bold">Booky</span>
        </div>
        <p className="max-w-md text-sm text-muted-foreground">
          Discover inspiring stories &amp; timeless knowledge, ready to borrow
          anytime. Explore online or visit our nearest library branch.
        </p>
        <p className="text-sm font-semibold">Follow on Social Media</p>
        <ul className="flex items-center gap-3">
          {socials.map(({ label, Icon, href }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full border text-foreground transition hover:bg-background hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  )
}
