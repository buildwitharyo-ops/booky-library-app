import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { BookyMark } from './booky-mark'

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2', className)}>
      <BookyMark className="size-7" />
      <span className="text-xl font-bold tracking-tight text-foreground">Booky</span>
    </Link>
  )
}
