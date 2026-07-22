import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useMessages, useSendMessage } from '../hooks/useDomain'
import { Button } from '../components/ui/Button'

export function Conversation() {
  const { id } = useParams()
  const conversationId = Number(id)
  const { data: messages } = useMessages(conversationId)
  const sendMessage = useSendMessage(conversationId)
  const [body, setBody] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!body.trim()) return
    sendMessage.mutate(body, { onSuccess: () => setBody('') })
  }

  return (
    <div className="min-h-svh flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
      <Link to="/conversas" className="text-sm text-muted mb-4">
        ← Conversas
      </Link>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto py-4">
        {(messages ?? []).map((message) => (
          <div
            key={message.id}
            className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
              message.is_mine ? 'self-end bg-primary text-white' : 'self-start bg-white border border-border text-ink'
            }`}
          >
            {message.body}
          </div>
        ))}
        {messages?.length === 0 && (
          <p className="text-center text-muted text-sm mt-10">Envie a primeira mensagem para iniciar a conversa.</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="flex-1 rounded-full border border-neutral-300 px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary"
        />
        <Button type="submit" className="w-auto px-6" loading={sendMessage.isPending}>
          Enviar
        </Button>
      </form>
    </div>
  )
}
