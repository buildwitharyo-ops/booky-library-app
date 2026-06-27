export type Role = 'ADMIN' | 'USER'

export type User = {
  id: number
  name: string
  email: string
  phone?: string | null
  profilePhoto?: string | null
  role: Role
  createdAt?: string
}

export type Author = {
  id: number
  name: string
  bio?: string | null
}

export type Category = {
  id: number
  name: string
}

export type Book = {
  id: number
  title: string
  description?: string | null
  isbn: string
  publishedYear?: number | null
  coverImage?: string | null
  rating: number
  reviewCount: number
  totalCopies: number
  availableCopies: number
  borrowCount: number
  authorId: number
  categoryId: number
  createdAt: string
  updatedAt: string
  author?: Author
  category?: Category
}

export type BookDetail = Book & { reviews: Review[] }

export type LoanStatus = 'BORROWED' | 'LATE' | 'RETURNED'
export type LoanDisplayStatus = 'Active' | 'Overdue' | 'Returned'

export type Loan = {
  id: number
  status: LoanStatus
  displayStatus?: LoanDisplayStatus
  borrowedAt: string
  dueAt: string
  returnedAt: string | null
  durationDays?: number
  returnByMessage?: string
  book: Book
  borrower?: Pick<User, 'id' | 'name' | 'email' | 'phone'>
}

export type Review = {
  id: number
  star: number
  comment?: string | null
  userId?: number
  bookId?: number
  createdAt: string
  user?: Pick<User, 'id' | 'name'>
  book?: Book
}

export type CartItem = {
  id: number
  bookId: number
  addedAt?: string
  book: Book
}

export type Cart = {
  cartId: number
  items: CartItem[]
}

export type LoanStats = {
  borrowed: number
  late: number
  returned: number
  total: number
}

export type MeProfile = {
  profile: User
  loanStats: LoanStats
  reviewsCount: number
}
