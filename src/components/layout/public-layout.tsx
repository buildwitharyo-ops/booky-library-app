import { Outlet } from 'react-router-dom'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
