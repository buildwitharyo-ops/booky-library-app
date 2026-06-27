import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { Book } from '@/types/models'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useBorrowBook } from '@/features/loans/use-loans'

const DURATIONS = [3, 5, 7, 10, 14]

export function BorrowDialog({
  book,
  open,
  onOpenChange,
}: {
  book: Book
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const navigate = useNavigate()
  const [days, setDays] = useState(7)
  const borrow = useBorrowBook(book.id)
  const dueDate = addDays(new Date(), days)

  async function handleConfirm() {
    try {
      await borrow.mutateAsync(days)
      toast.success('Book borrowed!', {
        description: `Please return by ${formatDate(dueDate)}.`,
        action: {
          label: 'My Loans',
          onClick: () => navigate('/profile/loans'),
        },
      })
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not borrow this book')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Borrow this book</DialogTitle>
          <DialogDescription className="line-clamp-1">
            {book.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm font-medium">Borrow duration</p>
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
                {duration} days
              </Label>
            ))}
          </RadioGroup>
          <p className="text-sm text-muted-foreground">
            Return by{' '}
            <span className="font-medium text-foreground">
              {formatDate(dueDate)}
            </span>
            .
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={borrow.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={borrow.isPending}>
            {borrow.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Borrowing…
              </>
            ) : (
              'Confirm Borrow'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
