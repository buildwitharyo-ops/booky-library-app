import { useState } from 'react'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { SearchInput } from '@/components/common/search-input'
import { Pagination } from '@/components/common/pagination'
import { EmptyState, ErrorState } from '@/components/common/page-state'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime } from '@/lib/format'
import { useAdminUsers } from './use-admin'

export function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 400)
  const [page, setPage] = useState(1)

  // Reset to the first page in the same render that changes the search,
  // so we never request an out-of-range page for the new query.
  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  const { data, isPending, isError, refetch } = useAdminUsers({
    q: q || undefined,
    page,
  })

  const users = data?.users ?? []
  const pagination = data?.pagination

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">User</h1>

      <SearchInput
        value={search}
        onChange={handleSearch}
        placeholder="Search user"
      />

      {isPending ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="space-y-4">
          <div className="hidden overflow-hidden rounded-2xl border md:block">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">No</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Nomor Handphone</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Created at</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-4 py-3 font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {user.createdAt ? formatDateTime(user.createdAt) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {users.map((user) => (
              <div key={user.id} className="rounded-xl border p-4">
                <p className="font-semibold">{user.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user.phone || '—'}
                </p>
                {user.createdAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(user.createdAt)}
                  </p>
                )}
              </div>
            ))}
          </div>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={setPage} />
          )}
        </div>
      )}
    </div>
  )
}
