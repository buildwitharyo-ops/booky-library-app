import { cn } from '@/lib/utils'

const SPOKES = Array.from({ length: 16 }, (_, i) => (i * 360) / 16)

/** The Booky logo mark — a radial starburst. Inherits color via `currentColor`. */
export function BookyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('text-primary', className)}
      fill="none"
      aria-hidden="true"
    >
      {SPOKES.map((angle) => (
        <line
          key={angle}
          x1="12"
          y1="2.5"
          x2="12"
          y2="8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  )
}
