import { useState } from 'react'
import { useMe } from './use-profile'
import { UpdateProfileDialog } from './update-profile-dialog'
import { getInitials } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorState } from '@/components/common/page-state'

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b py-3 text-sm last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function ProfilePage() {
  const { data, isPending, isError, refetch } = useMe()
  const [editOpen, setEditOpen] = useState(false)

  if (isPending) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 rounded-2xl" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} />
  }

  const { profile, loanStats } = data

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="space-y-6 rounded-2xl border p-6">
        <div className="flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={profile.profilePhoto ?? undefined} alt={profile.name} />
            <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{profile.name}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </div>

        <div>
          <DetailRow label="Name" value={profile.name} />
          <DetailRow label="Email" value={profile.email} />
          <DetailRow label="Nomor Handphone" value={profile.phone || '—'} />
        </div>

        <Button className="h-11 w-full" onClick={() => setEditOpen(true)}>
          Update Profile
        </Button>
      </div>

      <div className="space-y-3">
        <h2 className="font-bold">Loan Statistics</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Borrowed" value={loanStats.borrowed} />
          <StatCard label="Late" value={loanStats.late} />
          <StatCard label="Returned" value={loanStats.returned} />
          <StatCard label="Total" value={loanStats.total} />
        </div>
      </div>

      <UpdateProfileDialog
        profile={profile}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  )
}
