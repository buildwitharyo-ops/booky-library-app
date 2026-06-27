import { cn } from '@/lib/utils'

export type ChipOption<T extends string> = {
  label: string
  value: T
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: ChipOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              active
                ? 'border-primary bg-accent text-primary'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
