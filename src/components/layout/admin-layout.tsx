import { AdminNavbar } from './admin-navbar'
import { Footer } from './footer'
import { Container } from './container'
import { SuspenseOutlet } from './suspense-outlet'
import { SegmentedTabs } from '@/components/common/segmented-tabs'

const tabs = [
  { label: 'Borrowed List', to: '/admin/loans' },
  { label: 'User', to: '/admin/users' },
  { label: 'Book List', to: '/admin/books' },
]

export function AdminLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AdminNavbar />
      <main className="flex-1">
        <Container className="py-8">
          <div className="mb-6">
            <SegmentedTabs items={tabs} />
          </div>
          <SuspenseOutlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
