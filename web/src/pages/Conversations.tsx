import { Link } from 'react-router-dom'
import { useConversations } from '../hooks/useDomain'
import { AppHeader } from '../components/AppHeader'

export function Conversations() {
  const { data: conversations, isLoading } = useConversations()

  return (
    <div className="min-h-svh">
      <AppHeader />
      <div className="px-6 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-6">Conversas</h1>

        {isLoading && <p className="text-muted">Carregando...</p>}
        {!isLoading && conversations?.length === 0 && (
          <p className="text-muted">Você ainda não tem conversas. Elas aparecem aqui após um match.</p>
        )}

        <div className="space-y-2">
          {(conversations ?? []).map((conversation) => (
            <Link
              key={conversation.id}
              to={`/conversas/${conversation.id}`}
              className="block bg-white border border-border rounded-xl px-4 py-3 hover:border-primary/40 transition-colors"
            >
              <p className="font-medium text-ink">{conversation.other_party_name}</p>
            </Link>
          ))}
        </div>
      </div>
      </div>
    </div>
  )
}
