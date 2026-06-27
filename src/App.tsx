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
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { AdminBooksPage } from '@/features/admin/admin-books-page'
import { AdminUsersPage } from '@/features/admin/admin-users-page'
import { AdminLoansPage } from '@/features/admin/admin-loans-page'
import { BookFormPage } from '@/features/admin/book-form-page'

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
          <Route path="books" element={<AdminBooksPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="loans" element={<AdminLoansPage />} />
        </Route>
        {/* Book form uses admin chrome without the section tabs */}
        <Route element={<AdminFormLayout />}>
          <Route path="/admin/books/new" element={<BookFormPage />} />
          <Route path="/admin/books/:id/edit" element={<BookFormPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
