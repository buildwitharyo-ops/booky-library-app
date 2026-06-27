import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ImageUp, Loader2, UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'
import { useCategories } from '@/features/categories/use-categories'
import { useBook } from '@/features/books/use-books'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/page-state'
import { AuthorAutocomplete, type AuthorValue } from './author-autocomplete'
import { useCreateBook, useUpdateBook } from './use-admin'
import type { BookInput } from './admin-api'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function toNumber(value: string): number | undefined {
  const trimmed = value.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

export function BookFormPage() {
  const { id } = useParams()
  const isEdit = id !== undefined
  const bookId = Number(id)
  const navigate = useNavigate()

  const { data: categories } = useCategories()
  const bookQuery = useBook(isEdit ? bookId : Number.NaN)
  const createBook = useCreateBook()
  const updateBook = useUpdateBook()
  const isSaving = createBook.isPending || updateBook.isPending

  const [title, setTitle] = useState('')
  const [isbn, setIsbn] = useState('')
  const [author, setAuthor] = useState<AuthorValue>({ id: null, name: '' })
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [publishedYear, setPublishedYear] = useState('')
  const [totalCopies, setTotalCopies] = useState('')
  const [availableCopies, setAvailableCopies] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [existingCover, setExistingCover] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const prefilled = useRef(false)

  // Prefill once from the fetched book when editing.
  useEffect(() => {
    const book = bookQuery.data
    if (!isEdit || !book || prefilled.current) return
    prefilled.current = true
    setTitle(book.title)
    setIsbn(book.isbn)
    setAuthor({ id: book.author?.id ?? null, name: book.author?.name ?? '' })
    setCategoryId(book.categoryId)
    setPublishedYear(book.publishedYear ? String(book.publishedYear) : '')
    setTotalCopies(String(book.totalCopies))
    setAvailableCopies(String(book.availableCopies))
    setDescription(book.description ?? '')
    setExistingCover(book.coverImage ?? null)
  }, [isEdit, bookQuery.data])

  // Release any local object URL we created for the preview.
  useEffect(() => {
    if (!coverPreview) return
    return () => URL.revokeObjectURL(coverPreview)
  }, [coverPreview])

  function handlePickFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset so picking the same file again still fires onChange.
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Cover must be under 5MB')
      return
    }
    setCover(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function clearNewCover() {
    setCover(null)
    setCoverPreview(null)
  }

  const previewSrc = coverPreview ?? existingCover

  async function handleSubmit() {
    if (!title.trim()) return toast.error('Title is required')
    if (!isbn.trim()) return toast.error('ISBN is required')
    if (!categoryId) return toast.error('Please choose a category')
    if (!author.id && !author.name.trim()) return toast.error('Author is required')

    const input: BookInput = {
      title: title.trim(),
      isbn: isbn.trim(),
      categoryId,
      description: description.trim() || undefined,
      publishedYear: toNumber(publishedYear),
      totalCopies: toNumber(totalCopies),
      availableCopies: toNumber(availableCopies),
      cover,
    }
    if (author.id) input.authorId = author.id
    else input.authorName = author.name.trim()
    // Keep the existing cover on edit when no new file was chosen.
    if (!cover && existingCover) input.coverImage = existingCover

    try {
      if (isEdit) await updateBook.mutateAsync({ id: bookId, input })
      else await createBook.mutateAsync(input)
      toast.success(isEdit ? 'Book updated' : 'Book added')
      navigate('/admin/books')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save book')
    }
  }

  if (isEdit && bookQuery.isPending) {
    return (
      <Container className="max-w-xl space-y-4 py-8">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-11 rounded-xl" />
        ))}
      </Container>
    )
  }

  if (isEdit && bookQuery.isError) {
    return (
      <Container className="max-w-xl py-8">
        <ErrorState onRetry={() => bookQuery.refetch()} />
      </Container>
    )
  }

  return (
    <Container className="max-w-xl space-y-6 py-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild aria-label="Back">
          <Link to="/admin/books">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Book' : 'Add Book'}</h1>
      </div>

      <div className="space-y-5">
        <Field label="Title" htmlFor="title">
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-11 rounded-xl"
          />
        </Field>

        <Field label="Author">
          <AuthorAutocomplete value={author} onChange={setAuthor} />
        </Field>

        <Field label="Category">
          <Select
            value={categoryId ? String(categoryId) : undefined}
            onValueChange={(value) => setCategoryId(Number(value))}
          >
            <SelectTrigger className="h-11 w-full rounded-xl">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {(categories ?? []).map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="ISBN" htmlFor="isbn">
          <Input
            id="isbn"
            value={isbn}
            onChange={(event) => setIsbn(event.target.value)}
            className="h-11 rounded-xl"
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Published Year" htmlFor="year">
            <Input
              id="year"
              inputMode="numeric"
              value={publishedYear}
              onChange={(event) => setPublishedYear(event.target.value)}
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Total Copies" htmlFor="total">
            <Input
              id="total"
              inputMode="numeric"
              value={totalCopies}
              onChange={(event) => setTotalCopies(event.target.value)}
              className="h-11 rounded-xl"
            />
          </Field>
          <Field label="Available" htmlFor="available">
            <Input
              id="available"
              inputMode="numeric"
              value={availableCopies}
              onChange={(event) => setAvailableCopies(event.target.value)}
              className="h-11 rounded-xl"
            />
          </Field>
        </div>

        <Field label="Description" htmlFor="description">
          <Textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={5}
          />
        </Field>

        <Field label="Cover Image">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePickFile}
          />
          {previewSrc ? (
            <div className="flex items-center gap-4 rounded-xl border border-dashed p-4">
              <img
                src={previewSrc}
                alt="Cover preview"
                className="h-28 w-20 rounded-lg object-cover"
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageUp />
                  Change Image
                </Button>
                {cover && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearNewCover}
                  >
                    <X />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground transition hover:bg-muted"
            >
              <UploadCloud className="size-6" />
              <span>
                <span className="font-medium text-primary">Click to upload</span> a
                cover
              </span>
              <span className="text-xs">PNG or JPG (max. 5mb)</span>
            </button>
          )}
        </Field>

        <Button className="h-12 w-full" onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          ) : (
            'Save'
          )}
        </Button>
      </div>
    </Container>
  )
}
