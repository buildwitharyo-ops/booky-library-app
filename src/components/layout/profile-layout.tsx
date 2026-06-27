import { Navbar } from './navbar'
import { Footer } from './footer'
import { Container } from './container'
import { SuspenseOutlet } from './suspense-outlet'
import { SegmentedTabs } from '@/components/common/segmented-tabs'

const tabs = [
  { label: 'Profile', to: '/profile', end: true },
  { label: 'Borrowed List', to: '/profile/loans' },
  { label: 'Reviews', to: '/profile/reviews' },
]

export function ProfileLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Container className="max-w-3xl py-8">
          <div className="mb-6 flex justify-center">
            <SegmentedTabs items={tabs} />
          </div>
          <SuspenseOutlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
