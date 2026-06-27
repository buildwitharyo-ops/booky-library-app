import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, format, parseISO } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { Container } from '@/components/layout/container'
import { BookCover } from '@/components/book/book-cover'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { clearSelectedItems, selectSelectedItemIds } from './cartSlice'
import { useBorrowFromCart, useCheckout } from './use-cart'

const DURATIONS = [3, 5, 10]

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const selectedIds = useAppSelector(selectSelectedItemIds)
  const { data, isPending, isError, refetch } = useCheckout()
  const borrow = useBorrowFromCart()

  const [days, setDays] = useState(3)
  const [borrowDate, setBorrowDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd'),
  )
  const [agreeReturn, setAgreeReturn] = useState(false)
  const [agreePolicy, setAgreePolicy] = useState(false)

  const items = useMemo(() => {
    const all = data?.items ?? []
    if (selectedIds.length === 0) return all
    const ids = new Set(selectedIds)
    const picked = all.filter((item) => ids.has(item.id))
    return picked.length > 0 ? picked : all
  }, [data, selectedIds])

  const returnDate = addDays(parseISO(borrowDate), days)
  const today = format(new Date(), 'yyyy-MM-dd')
  const canSubmit =
    items.length > 0 && agreeReturn && agreePolicy && !borrow.isPending

  async function handleConfirm() {
    const itemIds = items.map((item) => item.id)
    try {
      const result = await borrow.mutateAsync({ itemIds, days, borrowDate })
      if (result.loans.length === 0) {
        toast.error(result.message || 'No books could be borrowed.')
        return
      }
      if (result.failed.length > 0) {
        toast.warning(
          `${result.loans.length} borrowed, ${result.failed.length} could not be processed.`,
        )
      }
      dispatch(clearSelectedItems())
      navigate('/borrow/success', {
        state: {
          dueAt: result.loans[0]?.dueAt,
          count: result.loans.length,
        },
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed')
    }
  }

  if (isPending) return <CheckoutSkeleton />
  if (isError || !data) {
    return (
      <Container className="py-8">
        <ErrorState onRetry={() => refetch()} />
      </Container>
    )
  }

  if (items.length === 0) {
    return (
      <Container className="py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <EmptyState
          title="Nothing to check out"
          description="Pick some books in your cart first."
          action={<Button onClick={() => navigate('/cart')}>Go to cart</Button>}
        />
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          <section className="space-y-1">
            <h2 className="mb-2 text-lg font-bold">User Information</h2>
            <InfoRow label="Name" value={data.user.name} />
            <InfoRow label="Email" value={data.user.email} />
            <InfoRow label="Nomor Handphone" value={data.user.nomorHandphone} />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold">Book List</h2>
            <ul className="divide-y rounded-2xl border">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 p-4">
                  <BookCover
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="h-20 w-14 shrink-0"
                  />
                  <div className="min-w-0">
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
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside>
          <div className="sticky top-24 space-y-5 rounded-2xl border p-5">
            <p className="font-bold">Complete Your Borrow Request</p>

            <div className="space-y-2">
              <Label htmlFor="borrow-date">Borrow Date</Label>
              <input
                id="borrow-date"
                type="date"
                min={today}
                value={borrowDate}
                onChange={(event) => setBorrowDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
              />
            </div>

            <div className="space-y-2">
              <Label>Borrow Duration</Label>
              <RadioGroup
                value={String(days)}
                onValueChange={(value) => setDays(Number(value))}
                className="grid grid-cols-3 gap-2"
              >
                {DURATIONS.map((duration) => (
                  <Label
                    key={duration}
                    className={cn(
                      'flex cursor-pointer items-center justify-center rounded-xl border py-3 text-sm font-medium transition',
                      days === duration
                        ? 'border-primary bg-accent text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <RadioGroupItem value={String(duration)} className="sr-only" />
                    {duration} Days
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="rounded-xl bg-accent p-4 text-sm">
              <p className="font-semibold">Return Date</p>
              <p className="text-muted-foreground">
                Please return the book no later than{' '}
                <span className="font-medium text-danger">
                  {formatDate(returnDate)}
                </span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <Checkbox
                  checked={agreeReturn}
                  onCheckedChange={(value) => setAgreeReturn(value === true)}
                  className="mt-0.5"
                />
                I agree to return the book(s) before the due date.
              </label>
              <label className="flex cursor-pointer items-start gap-2 text-sm">
                <Checkbox
                  checked={agreePolicy}
                  onCheckedChange={(value) => setAgreePolicy(value === true)}
                  className="mt-0.5"
                />
                I accept the library borrowing policy.
              </label>
            </div>

            <Button
              className="h-11 w-full"
              disabled={!canSubmit}
              onClick={handleConfirm}
            >
              {borrow.isPending ? (
                <>
                  <Loader2 className="animate-spin" />
                  Processing…
                </>
              ) : (
                'Confirm & Borrow'
              )}
            </Button>
          </div>
        </aside>
      </div>
    </Container>
  )
}

function CheckoutSkeleton() {
  return (
    <Container className="py-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    </Container>
  )
}
