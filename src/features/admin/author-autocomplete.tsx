import { useEffect, useId, useState, type KeyboardEvent } from 'react'
import type { Author } from '@/types/models'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { useAuthorSearch } from '@/features/authors/use-authors'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export type AuthorValue = { id: number | null; name: string }

export function AuthorAutocomplete({
  value,
  onChange,
}: {
  value: AuthorValue
  onChange: (value: AuthorValue) => void
}) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const q = useDebouncedValue(value.name.trim(), 300)
  const { data: authors } = useAuthorSearch(q, open && q.length > 0)
  const suggestions = (authors ?? []).slice(0, 8)
  const showList = open && suggestions.length > 0

  // Reset the keyboard highlight whenever the suggestion set changes.
  useEffect(() => {
    setHighlight(-1)
  }, [q])

  function select(author: Author) {
    onChange({ id: author.id, name: author.name })
    setOpen(false)
    setHighlight(-1)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!open) return setOpen(true)
      setHighlight((index) => Math.min(index + 1, suggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      if (showList && highlight >= 0) {
        event.preventDefault()
        select(suggestions[highlight])
      }
    } else if (event.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative">
      <Input
        value={value.name}
        placeholder="Type to search or add a new author"
        autoComplete="off"
        className="h-11 rounded-xl"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={
          highlight >= 0 ? `${listId}-option-${highlight}` : undefined
        }
        onChange={(event) => {
          // Editing the text means it's no longer the picked author.
          onChange({ id: null, name: event.target.value })
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => window.setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKeyDown}
      />
      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border bg-popover py-1 shadow-md"
        >
          {suggestions.map((author, index) => (
            <li
              key={author.id}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={index === highlight}
            >
              <button
                type="button"
                tabIndex={-1}
                className={cn(
                  'w-full px-3 py-2 text-left text-sm',
                  index === highlight ? 'bg-muted' : 'hover:bg-muted',
                )}
                onMouseEnter={() => setHighlight(index)}
                onMouseDown={(event) => {
                  event.preventDefault()
                  select(author)
                }}
              >
                {author.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
