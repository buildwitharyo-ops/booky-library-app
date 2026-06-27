import { Link } from 'react-router-dom'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-5xl font-bold text-primary">404</p>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
      </div>
      <Button asChild className="h-11 px-8">
        <Link to="/">Back to Home</Link>
      </Button>
    </Container>
  )
}
