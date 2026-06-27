import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import { useAppSelector } from '@/app/hooks'
import { selectIsAuthenticated } from '@/features/auth/authSlice'
import { Container } from '@/components/layout/container'
import { BookCover } from '@/components/book/book-cover'
import { StarRating } from '@/components/book/star-rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/page-state'
import { ReviewsSection } from '@/features/reviews/reviews-section'
import { useAddToCart, useCart } from '@/features/cart/use-cart'
import { useBook } from './use-books'
import { BorrowDialog } from './borrow-dialog'
import { RelatedBooks } from './related-books'

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 px-4 py-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function BookDetailPage() {
  const { id } = useParams()
  const bookId = Number(id)
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const { data: book, isPending, isError, refetch } = useBook(bookId)
  const { data: cart } = useCart()
  const addToCart = useAddToCart()
  const [borrowOpen, setBorrowOpen] = useState(false)

  if (isPending) return <DetailSkeleton />
  if (isError || !book) {
    return (
      <Container className="py-8">
        <ErrorState error={!book ? new Error('Book not found') : undefined} onRetry={() => refetch()} />
      </Container>
    )
  }

  const outOfStock = book.availableCopies <= 0
  const inCart = cart?.items.some((item) => item.bookId === book.id) ?? false

  function ensureAuthed() {
    if (isAuthenticated) return true
    navigate('/login', { state: { from: `/books/${bookId}` } })
    return false
  }

  function handleAddToCart() {
    if (!ensureAuthed() || !book) return
    if (inCart) {
      toast.info('Already in your cart')
      return
    }
    addToCart.mutate(book, {
      onSuccess: () => toast.success('Added to cart'),
      onError: (error) =>
        toast.error(error instanceof Error ? error.message : 'Could not add to cart'),
    })
  }

  function handleBorrow() {
    if (!ensureAuthed()) return
    setBorrowOpen(true)
  }

  return (
    <Container className="space-y-12 py-8">
      <nav className="text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="px-2">/</span>
        {book.category && (
          <>
            <Link
              to={`/books?categoryId=${book.category.id}`}
              className="hover:text-foreground"
            >
              {book.category.name}
            </Link>
            <span className="px-2">/</span>
          </>
        )}
        <span className="text-foreground">{book.title}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <BookCover
          src={book.coverImage}
          alt={book.title}
          className="aspect-[3/4] w-full md:w-[280px]"
        />

        <div className="space-y-5">
          {book.category && <Badge variant="secondary">{book.category.name}</Badge>}

          <div className="space-y-1">
            <h1 className="text-2xl font-bold sm:text-3xl">{book.title}</h1>
            {book.author && (
              <Link
                to={`/authors/${book.author.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {book.author.name}
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StarRating value={book.rating} size={18} />
            <span className="text-sm font-medium">{book.rating.toFixed(1)}</span>
          </div>

          <div className="flex divide-x rounded-xl border">
            <Stat label="Rating" value={book.rating.toFixed(1)} />
            <Stat label="Reviews" value={String(book.reviewCount)} />
            <Stat
              label="Available"
              value={`${book.availableCopies}/${book.totalCopies}`}
            />
          </div>

          {book.description && (
            <div className="space-y-2">
              <h2 className="font-semibold">Description</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
                {book.description}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button
              variant="outline"
              className="h-11"
              onClick={handleAddToCart}
              disabled={outOfStock || addToCart.isPending}
            >
              <ShoppingBag />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </Button>
            <Button
              className="h-11 px-8"
              onClick={handleBorrow}
              disabled={outOfStock}
            >
              {outOfStock ? 'Out of Stock' : 'Borrow Now'}
            </Button>
          </div>
        </div>
      </div>

      <ReviewsSection
        bookId={book.id}
        rating={book.rating}
        reviewCount={book.reviewCount}
      />

      {book.category && (
        <RelatedBooks categoryId={book.category.id} excludeId={book.id} />
      )}

      <BorrowDialog book={book} open={borrowOpen} onOpenChange={setBorrowOpen} />
    </Container>
  )
}

function DetailSkeleton() {
  return (
    <Container className="space-y-12 py-8">
      <Skeleton className="h-4 w-64" />
      <div className="grid gap-8 md:grid-cols-[280px_1fr]">
        <Skeleton className="aspect-[3/4] w-full rounded-lg md:w-[280px]" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-24 w-full" />
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </Container>
  )
}
