import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/public-layout'
import { ProfileLayout } from '@/components/layout/profile-layout'
import { AdminLayout } from '@/components/layout/admin-layout'
import { RequireAdmin, RequireAuth } from '@/features/auth/require-auth'
import { LoginPage } from '@/features/auth/login-page'
import { RegisterPage } from '@/features/auth/register-page'
import { HomePage } from '@/features/home/home-page'
import { BookListPage } from '@/features/books/book-list-page'
import { BookDetailPage } from '@/features/books/book-detail-page'
import { AuthorBooksPage } from '@/features/authors/author-books-page'
import { CartPage } from '@/features/cart/cart-page'
import { CheckoutPage } from '@/features/cart/checkout-page'
import { BorrowSuccessPage } from '@/features/cart/borrow-success-page'
import { BorrowedListPage } from '@/features/loans/borrowed-list-page'
import { ProfilePage } from '@/features/profile/profile-page'
import { MyReviewsPage } from '@/features/reviews/my-reviews-page'

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
        <Route path="books" element={<BookListPage />} />
        <Route path="books/:id" element={<BookDetailPage />} />
        <Route path="authors/:id" element={<AuthorBooksPage />} />

        {/* Borrowing flow needs a signed-in user */}
        <Route element={<RequireAuth />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="borrow/success" element={<BorrowSuccessPage />} />
        </Route>

        <Route path="*" element={<Placeholder title="404 — Not Found" />} />
      </Route>

      {/* Profile area */}
      <Route element={<RequireAuth />}>
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<ProfilePage />} />
          <Route path="loans" element={<BorrowedListPage />} />
          <Route path="reviews" element={<MyReviewsPage />} />
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
