import { Navbar } from './navbar'
import { Footer } from './footer'
import { SuspenseOutlet } from './suspense-outlet'

export function PublicLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <main className="flex-1">
        <SuspenseOutlet />
      </main>
      <Footer />
    </div>
  )
}
