import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  {
    title: 'Welcome to Booky',
    subtitle: 'Discover inspiring stories and timeless knowledge.',
  },
  {
    title: 'Borrow in seconds',
    subtitle: 'Thousands of books, ready whenever you are.',
  },
  {
    title: 'Track every loan',
    subtitle: 'Due dates and history, all in one place.',
  },
]

export function HeroCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = setInterval(
      () => setActive((index) => (index + 1) % slides.length),
      6000,
    )
    return () => clearInterval(id)
  }, [])

  const slide = slides[active]

  return (
    <section className="relative overflow-hidden rounded-2xl bg-linear-to-br from-sky-100 to-sky-50 px-6 py-16 text-center sm:py-20">
      <BookOpen className="pointer-events-none absolute -left-4 bottom-2 size-28 text-sky-200" />
      <BookOpen className="pointer-events-none absolute -right-4 top-2 size-28 text-sky-200" />

      <div className="relative space-y-2">
        <h1 className="text-3xl font-bold text-primary sm:text-5xl">
          {slide.title}
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
          {slide.subtitle}
        </p>
      </div>

      <div className="relative mt-8 flex justify-center gap-2">
        {slides.map((item, index) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === active}
            className={cn(
              'h-2 rounded-full transition-all',
              index === active ? 'w-6 bg-primary' : 'w-2 bg-sky-300',
            )}
          />
        ))}
      </div>
    </section>
  )
}
