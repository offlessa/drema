import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useProfessionalProfile, useExpressInterest } from '../hooks/useDomain'
import { Button } from '../components/ui/Button'
import { professionalTypeLabels } from '../lib/labels'

export function ProfessionalProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const matchId = (location.state as { matchId?: number } | null)?.matchId

  const { data: professional, isLoading } = useProfessionalProfile(Number(id))
  const expressInterest = useExpressInterest()
  const [matched, setMatched] = useState(false)

  function handleInterest() {
    if (!matchId) return
    expressInterest.mutate(matchId, {
      onSuccess: (match) => {
        setMatched(true)
        if (match.conversation_id) {
          setTimeout(() => navigate(`/conversas/${match.conversation_id}`), 1400)
        }
      },
    })
  }

  if (isLoading || !professional) {
    return <div className="min-h-svh flex items-center justify-center text-muted">Carregando perfil...</div>
  }

  if (matched) {
    return (
      <div className="min-h-svh flex items-center justify-center px-6 text-center">
        <div>
          <p className="text-gold uppercase tracking-[0.2em] text-xs font-medium mb-4">É uma combinação!</p>
          <h1 className="font-serif text-3xl text-ink mb-2">Você e {professional.name} têm um match</h1>
          <p className="text-muted">Abrindo a conversa...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh px-6 py-12">
      <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl p-8">
        <div className="flex items-start gap-5">
          <div className="h-20 w-20 rounded-full bg-cream-dark flex items-center justify-center font-serif text-3xl text-primary shrink-0">
            {professional.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-serif text-2xl text-ink">{professional.name}</h1>
            {professional.company_name && <p className="text-muted">{professional.company_name}</p>}
            <p className="text-gold text-sm mt-1">{professionalTypeLabels[professional.professional_type]}</p>
            <p className="text-sm text-muted mt-1">
              {professional.city}/{professional.state} · atende até {professional.service_radius_km}km
            </p>
          </div>
        </div>

        {professional.bio && <p className="text-ink mt-6 leading-relaxed">{professional.bio}</p>}

        <div className="grid sm:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl bg-cream px-4 py-3">
            <p className="text-xs text-muted uppercase tracking-wide">Experiência</p>
            <p className="text-ink font-medium mt-1">
              {professional.years_experience ? `${professional.years_experience} anos` : 'Não informado'}
            </p>
          </div>
          <div className="rounded-xl bg-cream px-4 py-3">
            <p className="text-xs text-muted uppercase tracking-wide">Faixa de investimento</p>
            <p className="text-ink font-medium mt-1">
              {professional.budget_min && professional.budget_max
                ? `R$ ${Number(professional.budget_min).toLocaleString('pt-BR')} – R$ ${Number(professional.budget_max).toLocaleString('pt-BR')}`
                : 'Sob consulta'}
            </p>
          </div>
        </div>

        {professional.styles.length > 0 && (
          <div className="mt-6">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Estilos trabalhados</p>
            <div className="flex flex-wrap gap-1.5">
              {professional.styles.map((style) => (
                <span key={style.id} className="text-xs bg-cream-dark text-muted rounded-full px-2.5 py-1">
                  {style.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {professional.portfolio_url && (
          <a
            href={professional.portfolio_url}
            target="_blank"
            rel="noreferrer"
            className="inline-block text-primary text-sm mt-6 underline"
          >
            Ver portfólio completo
          </a>
        )}

        <p className="text-sm text-muted mt-6 italic">Ainda sem avaliações públicas nesta plataforma.</p>

        {matchId && (
          <div className="mt-8">
            <Button onClick={handleInterest} loading={expressInterest.isPending}>
              Tenho interesse, quero conversar
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
