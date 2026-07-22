import { Link } from 'react-router-dom'
import { professionalTypeLabels } from '../lib/labels'
import type { ProjectMatch } from '../types/domain'

export function MatchCard({ match }: { match: ProjectMatch }) {
  const professional = match.professional
  if (!professional) return null

  return (
    <Link
      to={`/profissionais/${professional.id}`}
      state={{ matchId: match.id }}
      className="block bg-white border border-border rounded-2xl p-5 hover:shadow-md hover:border-primary/40 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="h-14 w-14 rounded-full bg-cream-dark flex items-center justify-center font-serif text-xl text-primary">
          {professional.name.charAt(0)}
        </div>
        <span className="rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
          {match.compatibility_score}% compatível
        </span>
      </div>

      <p className="font-medium text-ink">{professional.name}</p>
      {professional.company_name && <p className="text-sm text-muted">{professional.company_name}</p>}
      <p className="text-sm text-gold mt-1">{professionalTypeLabels[professional.professional_type]}</p>

      <div className="flex items-center gap-3 text-xs text-muted mt-3">
        <span>
          {professional.city}/{professional.state}
        </span>
        {professional.years_experience !== null && <span>· {professional.years_experience} anos de experiência</span>}
      </div>

      {professional.styles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {professional.styles.map((style) => (
            <span key={style.id} className="text-xs bg-cream-dark text-muted rounded-full px-2.5 py-1">
              {style.name}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
