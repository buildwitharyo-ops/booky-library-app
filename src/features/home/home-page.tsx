import { Container } from '@/components/layout/container'
import { HeroCarousel } from './hero-carousel'
import { CategoriesSection } from './categories-section'
import { RecommendationSection } from './recommendation-section'
import { PopularAuthorsSection } from './popular-authors-section'

export function HomePage() {
  return (
    <Container className="space-y-10 py-8">
      <HeroCarousel />
      <CategoriesSection />
      <RecommendationSection />
      <PopularAuthorsSection />
    </Container>
  )
}
