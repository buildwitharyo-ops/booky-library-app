import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAppDispatch } from '@/app/hooks'
import { Container } from '@/components/layout/container'
import { BookCover } from '@/components/book/book-cover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { setSelectedItems } from './cartSlice'
import { useCart, useRemoveCartItem } from './use-cart'

export function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: cart, isPending, isError, refetch } = useCart()
  const removeItem = useRemoveCartItem()

  const items = cart?.items ?? []
  const [selected, setSelected] = useState<Set<number>>(new Set())

  // Default to everything selected; re-sync when the cart's items change.
  useEffect(() => {
    setSelected(new Set((cart?.items ?? []).map((item) => item.id)))
  }, [cart?.items])

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected =
    items.length > 0 && items.every((item) => selected.has(item.id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((item) => item.id)))
  }

  function handleBorrow() {
    const ids = items.map((item) => item.id).filter((id) => selected.has(id))
    if (ids.length === 0) return
    dispatch(setSelectedItems(ids))
    navigate('/checkout')
  }

  if (isPending) return <CartSkeleton />
  if (isError) {
    return (
      <Container className="py-8">
        <ErrorState onRetry={() => refetch()} />
      </Container>
    )
  }

  if (items.length === 0) {
    return (
      <Container className="py-8">
        <h1 className="mb-6 text-2xl font-bold">My Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Add some books to borrow them together."
          action={<Button onClick={() => navigate('/books')}>Browse books</Button>}
        />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold">My Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
            <Checkbox checked={allSelected} onCheckedChange={toggleAll} />
            Select All
          </label>

          <ul className="divide-y rounded-2xl border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 p-4">
                <Checkbox
                  checked={selected.has(item.id)}
                  onCheckedChange={() => toggle(item.id)}
                  aria-label={`Select ${item.book.title}`}
                />
                <BookCover
                  src={item.book.coverImage}
                  alt={item.book.title}
                  className="h-20 w-14 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  {item.book.category && (
                    <Badge variant="secondary" className="mb-1">
                      {item.book.category.name}
                    </Badge>
                  )}
                  <p className="truncate font-semibold">{item.book.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {item.book.author?.name}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove from cart"
                  onClick={() =>
                    removeItem.mutate(item.id, {
                      onSuccess: () => toast.success('Removed from cart'),
                    })
                  }
                >
                  <Trash2 className="text-danger" />
                </Button>
              </li>
            ))}
          </ul>
        </div>

        <aside>
          <div className="sticky top-24 space-y-4 rounded-2xl border p-5">
            <p className="font-bold">Loan Summary</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Book</span>
              <span className="font-semibold">{selected.size} Items</span>
            </div>
            <Button
              className="h-11 w-full"
              disabled={selected.size === 0}
              onClick={handleBorrow}
            >
              Borrow Book
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  )
}

function CartSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-44 rounded-2xl" />
      </div>
    </Container>
  )
}
