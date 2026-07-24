import { useLocation, useParams } from 'react-router-dom'
import { useBriefMatches } from '../hooks/useDomain'
import { AppHeader } from '../components/AppHeader'
import { MatchCard } from '../components/MatchCard'
import type { ProjectMatch } from '../types/domain'

export function MatchResults() {
  const { briefId } = useParams()
  const location = useLocation()
  const stateMatches = (location.state as { matches?: ProjectMatch[] } | null)?.matches

  const query = useBriefMatches(stateMatches ? null : Number(briefId))
  const matches = stateMatches ?? query.data ?? []

  return (
    <div className="min-h-svh">
      <AppHeader />
      <div className="px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="uppercase tracking-[0.2em] text-xs text-teal font-medium mb-4">Resultado</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink">
          {matches.length > 0
            ? 'Encontramos profissionais compatíveis com seu projeto'
            : 'Ainda não temos profissionais compatíveis na sua região'}
        </h1>
        {matches.length === 0 && (
          <p className="text-muted mt-3">
            Avisaremos assim que houver profissionais disponíveis para o seu tipo de projeto e localização.
          </p>
        )}
      </div>

      <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-4">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
      </div>
    </div>
  )
}
