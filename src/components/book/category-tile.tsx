import { Link } from 'react-router-dom'
import {
  BookMarked,
  BookOpen,
  FlaskConical,
  GraduationCap,
  Heart,
  Library,
  Sprout,
  Wallet,
  type LucideIcon,
} from 'lucide-react'
import type { Category } from '@/types/models'

const ICONS: Record<string, LucideIcon> = {
  fiction: BookOpen,
  'non-fiction': Library,
  'self-improvement': Sprout,
  finance: Wallet,
  science: FlaskConical,
  'science-fiction': FlaskConical,
  education: GraduationCap,
  religious: BookMarked,
  lifestyle: Heart,
}

function iconFor(name: string): LucideIcon {
  return ICONS[name.trim().toLowerCase()] ?? BookOpen
}

export function CategoryTile({ category }: { category: Category }) {
  const Icon = iconFor(category.name)

  return (
    <Link
      to={`/books?categoryId=${category.id}`}
      className="flex flex-col items-center gap-2 rounded-xl bg-tile p-4 text-center transition hover:brightness-95"
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-background text-primary">
        <Icon className="size-5" />
      </span>
      <span className="line-clamp-1 text-xs font-medium text-foreground">
        {category.name}
      </span>
    </Link>
  )
}
