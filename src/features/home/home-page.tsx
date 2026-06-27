import { useState } from 'react'
import type { Book, Category } from '@/types/models'
import { Container } from '@/components/layout/container'
import { BookCard } from '@/components/book/book-card'
import { BookGrid } from '@/components/book/book-grid'
import { CategoryTile } from '@/components/book/category-tile'
import { StarRating } from '@/components/book/star-rating'
import { FilterChips, type ChipOption } from '@/components/common/filter-chips'

// Temporary preview content for Step 1. Replaced with live data in Step 3.

const sampleCategories: Category[] = [
  { id: 4, name: 'Fiction' },
  { id: 10, name: 'Non-Fiction' },
  { id: 7, name: 'Self-Improvement' },
  { id: 9, name: 'Finance' },
  { id: 11, name: 'Science' },
  { id: 8, name: 'Education' },
]

function makeBook(
  id: number,
  title: string,
  author: string,
  rating: number,
  coverImage: string,
): Book {
  return {
    id,
    title,
    isbn: '',
    description: '',
    publishedYear: 2020,
    coverImage,
    rating,
    reviewCount: 12,
    totalCopies: 5,
    availableCopies: 3,
    borrowCount: 10,
    authorId: 1,
    categoryId: 1,
    createdAt: '',
    updatedAt: '',
    author: { id: 1, name: author },
    category: { id: 1, name: 'Education' },
  }
}

const sampleBooks: Book[] = [
  makeBook(
    55,
    "Don't Make Me Think, Revisited",
    'Steve Krug',
    5,
    'https://covers.openlibrary.org/b/isbn/9780321965516-L.jpg',
  ),
  makeBook(
    48,
    'Clean Code',
    'Robert C. Martin',
    4.8,
    'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg',
  ),
  makeBook(
    52,
    'The Pragmatic Programmer',
    'Andrew Hunt',
    4.9,
    'https://m.media-amazon.com/images/I/51wnGstInoS._AC_UF1000,1000_QL80_.jpg',
  ),
  makeBook(
    58,
    'Hooked: How to Build Habit-Forming Products',
    'Nir Eyal',
    4.8,
    'https://m.media-amazon.com/images/I/719fyFgdNJL._AC_UF1000,1000_QL80_.jpg',
  ),
]

const sortOptions: ChipOption<'all' | 'rating' | 'popular'>[] = [
  { label: 'All', value: 'all' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Popular', value: 'popular' },
]

export function HomePage() {
  const [sort, setSort] = useState<'all' | 'rating' | 'popular'>('all')

  return (
    <Container className="space-y-10 py-8">
      <section className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-linear-to-b from-tile to-background px-6 py-16 text-center">
        <h1 className="text-4xl font-bold text-primary">Welcome to Booky</h1>
        <p className="max-w-md text-muted-foreground">
          Browse the catalog, borrow your next read, and keep track of it all.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Categories</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sampleCategories.map((category) => (
            <CategoryTile key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Recommendation</h2>
          <FilterChips options={sortOptions} value={sort} onChange={setSort} />
        </div>
        <BookGrid>
          {sampleBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </BookGrid>
      </section>

      <section className="flex items-center gap-3 text-sm text-muted-foreground">
        <span>Rating sample:</span>
        <StarRating value={4} />
        <span>4.0</span>
      </section>
    </Container>
  )
}
