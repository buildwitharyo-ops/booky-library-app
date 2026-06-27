import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchBar({ className }: { className?: string }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [value, setValue] = useState(params.get('q') ?? '')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const q = value.trim()
    navigate(q ? `/books?q=${encodeURIComponent(q)}` : '/books')
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)} role="search">
      <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search book"
        aria-label="Search book"
        className="h-10 w-full rounded-full border border-border bg-background pr-4 pl-11 text-sm outline-none placeholder:text-subtle focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
      />
    </form>
  )
}
