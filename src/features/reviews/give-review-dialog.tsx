import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from '@/components/book/star-rating'
import { useCreateReview } from './use-reviews'

export function GiveReviewDialog({
  book,
  open,
  onOpenChange,
}: {
  book: { id: number; title: string }
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [star, setStar] = useState(0)
  const [comment, setComment] = useState('')
  const create = useCreateReview()

  function reset() {
    setStar(0)
    setComment('')
  }

  async function handleSend() {
    if (star === 0) {
      toast.error('Please pick a rating')
      return
    }
    try {
      await create.mutateAsync({
        bookId: book.id,
        star,
        comment: comment.trim() || undefined,
      })
      toast.success('Review submitted!')
      onOpenChange(false)
      reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not submit review')
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) reset()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Give Review</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2 text-center">
            <p className="text-sm font-medium">Give Rating</p>
            <div className="flex justify-center">
              <StarRating value={star} onChange={setStar} size={32} />
            </div>
          </div>
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Please share your thoughts about this book"
            rows={5}
          />
        </div>

        <DialogFooter>
          <Button
            className="h-11 w-full"
            onClick={handleSend}
            disabled={create.isPending}
          >
            {create.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Sending…
              </>
            ) : (
              'Send'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
