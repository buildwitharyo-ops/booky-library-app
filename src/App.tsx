import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/public-layout'
import { ProfileLayout } from '@/components/layout/profile-layout'
import { AdminLayout } from '@/components/layout/admin-layout'
import { AdminFormLayout } from '@/components/layout/admin-form-layout'
import { RequireAdmin, RequireAuth } from '@/features/auth/require-auth'
import { Spinner } from '@/components/common/page-state'
import { NotFoundPage } from '@/components/common/not-found-page'

// Pages are code-split so each route loads its own chunk.
const LoginPage = lazy(() =>
  import('@/features/auth/login-page').then((m) => ({ default: m.LoginPage })),
)
const RegisterPage = lazy(() =>
  import('@/features/auth/register-page').then((m) => ({
    default: m.RegisterPage,
  })),
)
const HomePage = lazy(() =>
  import('@/features/home/home-page').then((m) => ({ default: m.HomePage })),
)
const BookListPage = lazy(() =>
  import('@/features/books/book-list-page').then((m) => ({
    default: m.BookListPage,
  })),
)
const BookDetailPage = lazy(() =>
  import('@/features/books/book-detail-page').then((m) => ({
    default: m.BookDetailPage,
  })),
)
const AuthorBooksPage = lazy(() =>
  import('@/features/authors/author-books-page').then((m) => ({
    default: m.AuthorBooksPage,
  })),
)
const CartPage = lazy(() =>
  import('@/features/cart/cart-page').then((m) => ({ default: m.CartPage })),
)
const CheckoutPage = lazy(() =>
  import('@/features/cart/checkout-page').then((m) => ({
    default: m.CheckoutPage,
  })),
)
const BorrowSuccessPage = lazy(() =>
  import('@/features/cart/borrow-success-page').then((m) => ({
    default: m.BorrowSuccessPage,
  })),
)
const ProfilePage = lazy(() =>
  import('@/features/profile/profile-page').then((m) => ({
    default: m.ProfilePage,
  })),
)
const BorrowedListPage = lazy(() =>
  import('@/features/loans/borrowed-list-page').then((m) => ({
    default: m.BorrowedListPage,
  })),
)
const MyReviewsPage = lazy(() =>
  import('@/features/reviews/my-reviews-page').then((m) => ({
    default: m.MyReviewsPage,
  })),
)
const AdminBooksPage = lazy(() =>
  import('@/features/admin/admin-books-page').then((m) => ({
    default: m.AdminBooksPage,
  })),
)
const AdminUsersPage = lazy(() =>
  import('@/features/admin/admin-users-page').then((m) => ({
    default: m.AdminUsersPage,
  })),
)
const AdminLoansPage = lazy(() =>
  import('@/features/admin/admin-loans-page').then((m) => ({
    default: m.AdminLoansPage,
  })),
)
const BookFormPage = lazy(() =>
  import('@/features/admin/book-form-page').then((m) => ({
    default: m.BookFormPage,
  })),
)

function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
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

          <Route path="*" element={<NotFoundPage />} />
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
    </Suspense>
  )
}
