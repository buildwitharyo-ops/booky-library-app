import { Link, useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/format'

type SuccessState = { dueAt?: string; count?: number }

export function BorrowSuccessPage() {
  const location = useLocation()
  const state = (location.state as SuccessState | null) ?? {}
  const many = (state.count ?? 1) > 1

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <div className="relative flex size-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-border" />
        <span className="absolute inset-4 rounded-full border border-border" />
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-8" />
        </span>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Borrowing Successful!</h1>
        <p className="text-muted-foreground">
          {state.dueAt ? (
            <>
              Your {many ? 'books have' : 'book has'} been borrowed. Please
              return by{' '}
              <span className="font-medium text-danger">
                {formatDate(state.dueAt)}
              </span>
              .
            </>
          ) : (
            'Your books have been borrowed successfully.'
          )}
        </p>
      </div>

      <Button asChild className="h-11 px-8">
        <Link to="/profile/loans">See Borrowed List</Link>
      </Button>
    </Container>
  )
}
