import { useQuery } from '@tanstack/react-query'
import { api } from './lib/api'

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get<{ status: string; app: string }>('/api/health').then((res) => res.data),
  })

  return (
    <div className="min-h-svh flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-neutral-900">Drema</h1>
        <p className="text-neutral-500 mt-2">Do sonho ao imóvel.</p>
        <p className="mt-4 text-sm">
          {isLoading && 'Conectando à API...'}
          {isError && 'Falha ao conectar à API.'}
          {data && `API: ${data.status} (${data.app})`}
        </p>
      </div>
    </div>
  )
}

export default App
