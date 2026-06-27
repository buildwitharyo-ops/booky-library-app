import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/public-layout'
import { ProfileLayout } from '@/components/layout/profile-layout'
import { AdminLayout } from '@/components/layout/admin-layout'
import { RequireAdmin, RequireAuth } from '@/features/auth/require-auth'
import { LoginPage } from '@/features/auth/login-page'
import { RegisterPage } from '@/features/auth/register-page'
import { HomePage } from '@/features/home/home-page'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 py-16 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Screen coming soon.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Auth — standalone, no app chrome */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Public site */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="books" element={<Placeholder title="Book List" />} />
        <Route path="books/:id" element={<Placeholder title="Book Detail" />} />
        <Route path="authors/:id" element={<Placeholder title="Books by Author" />} />

        {/* Borrowing flow needs a signed-in user */}
        <Route element={<RequireAuth />}>
          <Route path="cart" element={<Placeholder title="My Cart" />} />
          <Route path="checkout" element={<Placeholder title="Checkout" />} />
          <Route
            path="borrow/success"
            element={<Placeholder title="Borrowing Successful" />}
          />
        </Route>

        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Route>

      {/* Profile area */}
      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Placeholder title="Profile" />} />
          <Route path="loans" element={<Placeholder title="Borrowed List" />} />
          <Route path="reviews" element={<Placeholder title="Reviews" />} />
        </Route>
      </Route>

      {/* Admin area */}
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/books" replace />} />
          <Route path="books" element={<Placeholder title="Book List" />} />
          <Route path="books/new" element={<Placeholder title="Add Book" />} />
          <Route path="books/:id/edit" element={<Placeholder title="Edit Book" />} />
          <Route path="users" element={<Placeholder title="User List" />} />
          <Route path="loans" element={<Placeholder title="Borrowed List" />} />
        </Route>
      </Route>
    </Routes>
  )
}
