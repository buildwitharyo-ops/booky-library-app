import { Link, useNavigate } from 'react-router-dom'
import { MoreVertical } from 'lucide-react'
import type { Book } from '@/types/models'
import { BookCover } from '@/components/book/book-cover'
import { RatingBadge } from '@/components/book/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function AdminBookCard({
  book,
  onDelete,
}: {
  book: Book
  onDelete: (book: Book) => void
}) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-4 rounded-2xl border p-4">
      <BookCover
        src={book.coverImage}
        alt={book.title}
        className="h-20 w-14 shrink-0"
      />
      <div className="min-w-0 flex-1">
        {book.category && (
          <Badge variant="secondary" className="mb-1">
            {book.category.name}
          </Badge>
        )}
        <p className="truncate font-semibold">{book.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {book.author?.name}
        </p>
        <RatingBadge value={book.rating} className="mt-1" />
      </div>

      <div className="hidden shrink-0 gap-2 sm:flex">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/books/${book.id}`}>Preview</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/admin/books/${book.id}/edit`}>Edit</Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-danger"
          onClick={() => onDelete(book)}
        >
          Delete
        </Button>
      </div>

      <div className="shrink-0 sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Actions">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate(`/books/${book.id}`)}>
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => navigate(`/admin/books/${book.id}/edit`)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => onDelete(book)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
