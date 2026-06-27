import { useAppSelector } from '@/app/hooks'
import { selectUser } from '@/features/auth/authSlice'
import { Logo } from '@/components/brand/logo'
import { Container } from './container'
import { AccountMenu } from './account-menu'

export function AdminNavbar() {
  const user = useAppSelector(selectUser)

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <Container>
        <div className="flex h-16 items-center">
          <Logo to="/admin" />
          <div className="ml-auto">
            {user && <AccountMenu user={user} minimal />}
          </div>
        </div>
      </Container>
    </header>
  )
}
