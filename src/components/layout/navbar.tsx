import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSlice'
import { useCartCount } from '@/features/cart/use-cart'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/brand/logo'
import { Container } from './container'
import { SearchBar } from './search-bar'
import { CartButton } from './cart-button'
import { AccountMenu } from './account-menu'

export function Navbar() {
  const user = useAppSelector(selectUser)
  const cartCount = useCartCount()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center gap-3">
          <Logo />

          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar className="w-full max-w-md" />
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <CartButton count={cartCount} />
            {user ? (
              <AccountMenu user={user} />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </Container>
    </header>
  )
}
