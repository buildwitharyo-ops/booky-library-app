import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

export type SegmentedTabItem = {
  label: string
  to: string
  end?: boolean
}

export function SegmentedTabs({
  items,
  className,
}: {
  items: SegmentedTabItem[]
  className?: string
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-muted p-1',
        className,
      )}
    >
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}
