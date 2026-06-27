import { Outlet } from 'react-router-dom'
import { AdminNavbar } from './admin-navbar'
import { Footer } from './footer'

/** Admin chrome without the section tabs — used for the Add/Edit Book forms. */
export function AdminFormLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AdminNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
