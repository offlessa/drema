import { Link } from 'react-router-dom'
import { useMe, useLogout } from '../hooks/useAuth'
import { useLeads, useMyProfessionalProfile } from '../hooks/useDomain'
import { Button } from '../components/ui/Button'
import { goalLabels } from '../lib/labels'

export function Dashboard() {
  const { data: user } = useMe()
  const logoutMutation = useLogout()

  if (user?.role === 'professional') {
    return <ProfessionalHome />
  }

  return (
    <div className="min-h-svh px-6 py-12">
      <TopBar name={user?.name} onLogout={() => logoutMutation.mutate()} />

      <div className="max-w-xl mx-auto mt-10 text-center">
        <h1 className="font-serif text-2xl text-ink mb-2">Olá, {user?.name}</h1>
        <p className="text-muted mb-8">Pronto para dar o próximo passo no seu projeto?</p>

        <div className="grid gap-3">
          <Link
            to="/comecar"
            className="rounded-2xl bg-primary text-white px-6 py-4 font-medium hover:bg-primary-hover transition-colors"
          >
            Iniciar um novo projeto
          </Link>
          <Link
            to="/conversas"
            className="rounded-2xl border border-border bg-white px-6 py-4 font-medium text-ink hover:border-primary/40 transition-colors"
          >
            Minhas conversas
          </Link>
        </div>
      </div>
    </div>
  )
}

function ProfessionalHome() {
  const { data: user } = useMe()
  const logoutMutation = useLogout()
  const { data: profile } = useMyProfessionalProfile()
  const { data: leads } = useLeads()

  if (profile === null) {
    return (
      <div className="min-h-svh flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-serif text-2xl text-ink mb-2">Complete seu perfil profissional</h1>
          <p className="text-muted mb-6">Precisamos de algumas informações para começar a te enviar leads compatíveis.</p>
          <Link to="/perfil-profissional" className="inline-block rounded-full bg-primary text-white px-6 py-3 font-medium">
            Completar perfil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-svh px-6 py-12">
      <TopBar name={user?.name} onLogout={() => logoutMutation.mutate()} />

      <div className="max-w-2xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl text-ink">Novos projetos compatíveis</h1>
          <Link to="/perfil-profissional" className="text-sm text-primary">
            Editar perfil
          </Link>
        </div>

        {profile?.status === 'pending' && (
          <p className="text-sm text-warning bg-warning/10 rounded-lg px-4 py-3 mb-6">
            Seu perfil está em análise. Assim que for aprovado, você começa a receber projetos.
          </p>
        )}

        <div className="space-y-3">
          {(leads ?? []).map((lead) => (
            <div key={lead.id} className="bg-white border border-border rounded-xl px-5 py-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">{lead.project_brief && goalLabels[lead.project_brief.goal]}</p>
                <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2.5 py-1">
                  {lead.compatibility_score}% compatível
                </span>
              </div>
              <p className="text-sm text-muted mt-1">
                {lead.project_brief?.area_m2 && `${lead.project_brief.area_m2}m² · `}
                {lead.project_brief?.city}/{lead.project_brief?.state}
                {lead.project_brief?.budget_min &&
                  ` · R$ ${Number(lead.project_brief.budget_min).toLocaleString('pt-BR')}+`}
              </p>
              {lead.conversation_id && (
                <Link to={`/conversas/${lead.conversation_id}`} className="text-sm text-primary mt-2 inline-block">
                  Ver conversa →
                </Link>
              )}
            </div>
          ))}
          {leads?.length === 0 && <p className="text-muted text-center">Nenhum projeto compatível ainda.</p>}
        </div>
      </div>
    </div>
  )
}

function TopBar({ name, onLogout }: { name?: string; onLogout: () => void }) {
  return (
    <div className="max-w-2xl mx-auto flex items-center justify-between">
      <span className="font-serif text-lg text-ink">Drema</span>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted">{name}</span>
        <Button variant="ghost" className="w-auto px-3 py-1.5" onClick={onLogout}>
          Sair
        </Button>
      </div>
    </div>
  )
}
