import { Link } from 'react-router-dom'
import { useMe, useLogout } from '../hooks/useAuth'
import { Button } from './ui/Button'

export function AppHeader() {
  const { data: user } = useMe()
  const logoutMutation = useLogout()

  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 gap-4">
      <Link to="/dashboard" className="shrink-0">
        <img src="/logo-horizontal.png" alt="Drema" className="h-7 w-auto" />
      </Link>
      <div className="flex items-center gap-3 text-sm">
        <span className="text-muted truncate max-w-40">{user?.name}</span>
        <Button
          variant="ghost"
          fullWidth={false}
          className="px-3 py-1.5 whitespace-nowrap shrink-0"
          onClick={() => logoutMutation.mutate()}
        >
          Sair
        </Button>
      </div>
    </header>
  )
}
