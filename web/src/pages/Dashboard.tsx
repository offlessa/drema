import { useMe, useLogout } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'

const roleLabels = { client: 'Cliente', professional: 'Profissional', admin: 'Admin' }

export function Dashboard() {
  const { data: user } = useMe()
  const logoutMutation = useLogout()

  return (
    <div className="min-h-svh flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-2xl font-semibold text-neutral-900">Olá, {user?.name}</h1>
        <p className="text-neutral-500 mt-1">
          {user && roleLabels[user.role]} · {user?.city}/{user?.state}
        </p>
        <div className="mt-6">
          <Button variant="secondary" onClick={() => logoutMutation.mutate()} loading={logoutMutation.isPending}>
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
