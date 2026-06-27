import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { usePopularAuthors } from '@/features/authors/use-authors'
import type { PopularAuthor } from '@/features/authors/authors-api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/page-state'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function AuthorCard({ author }: { author: PopularAuthor }) {
  return (
    <Link
      to={`/authors/${author.id}`}
      className="flex items-center gap-3 rounded-xl border p-4 transition hover:bg-muted/50"
    >
      <Avatar className="size-12">
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate font-semibold">{author.name}</p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <BookOpen className="size-3.5" />
          {author.bookCount} books
        </p>
      </div>
    </Link>
  )
}

export function PopularAuthorsSection() {
  const { data: authors, isPending, isError, refetch } = usePopularAuthors(8)

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Popular Authors</h2>

      {isPending ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !authors || authors.length === 0 ? null : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      )}
    </section>
  )
}
