import { AdminNavbar } from './admin-navbar'
import { Footer } from './footer'
import { SuspenseOutlet } from './suspense-outlet'

/** Admin chrome without the section tabs — used for the Add/Edit Book forms. */
export function AdminFormLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AdminNavbar />
      <main className="flex-1">
        <SuspenseOutlet />
      </main>
      <Footer />
    </div>
  )
}
