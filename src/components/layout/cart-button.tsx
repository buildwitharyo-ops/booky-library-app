import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CartButton({
  count = 0,
  className,
}: {
  count?: number
  className?: string
}) {
  return (
    <Link
      to="/cart"
      aria-label={`My cart${count > 0 ? `, ${count} items` : ''}`}
      className={cn(
        'relative inline-flex size-10 items-center justify-center rounded-full text-foreground transition hover:bg-muted',
        className,
      )}
    >
      <ShoppingBag className="size-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-semibold text-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
