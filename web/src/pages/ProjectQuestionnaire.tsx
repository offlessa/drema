import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useMe } from '../hooks/useAuth'
import { useStyles, useSubmitProjectBrief } from '../hooks/useDomain'
import { AppHeader } from '../components/AppHeader'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { brazilianStates } from '../lib/brazilianStates'
import { goalLabels } from '../lib/labels'
import type { ProjectGoal } from '../types/domain'

export function ProjectQuestionnaire() {
  const navigate = useNavigate()
  const location = useLocation()
  const goal = (location.state as { goal?: ProjectGoal } | null)?.goal

  const { data: me } = useMe()
  const { data: styles } = useStyles()
  const submitBrief = useSubmitProjectBrief()

  const [form, setForm] = useState({
    city: me?.city ?? '',
    state: me?.state ?? '',
    area_m2: '',
    rooms_count: '',
    style_id: '',
    budget_min: '',
    budget_max: '',
    timeline: '',
    description: '',
    reference_urls: '',
  })
  const [error, setError] = useState('')

  if (!goal) {
    navigate('/comecar', { replace: true })
    return null
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    submitBrief.mutate(
      {
        goal,
        city: form.city,
        state: form.state,
        area_m2: form.area_m2 ? Number(form.area_m2) : undefined,
        rooms_count: form.rooms_count ? Number(form.rooms_count) : undefined,
        style_id: form.style_id ? Number(form.style_id) : undefined,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: form.budget_max ? Number(form.budget_max) : undefined,
        timeline: form.timeline || undefined,
        description: form.description || undefined,
        reference_urls: form.reference_urls
          ? form.reference_urls.split('\n').map((url) => url.trim()).filter(Boolean)
          : undefined,
      },
      {
        onSuccess: (matches) => {
          const briefId = matches[0]?.project_brief_id
          navigate(`/resultados/${briefId}`, { state: { matches } })
        },
        onError: (err) => {
          if (axios.isAxiosError(err) && err.response?.status === 401) {
            navigate('/login')
            return
          }
          setError('Não foi possível processar seu projeto. Confira os campos e tente novamente.')
        },
      },
    )
  }

  return (
    <div className="min-h-svh flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="uppercase tracking-[0.2em] text-xs text-teal font-medium mb-4 text-center">Passo 2 de 2</p>
        <h1 className="font-display text-3xl text-ink mb-2 text-center">Conte mais sobre o seu projeto</h1>
        <p className="text-muted text-center mb-10">{goalLabels[goal]}</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-border rounded-2xl p-6 md:p-8">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Cidade"
              name="city"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <Select
              label="Estado"
              name="state"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              options={[{ value: '', label: 'Selecione' }, ...brazilianStates]}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Área aproximada (m²)"
              name="area_m2"
              type="number"
              min="1"
              value={form.area_m2}
              onChange={(e) => setForm({ ...form, area_m2: e.target.value })}
            />
            <Input
              label="Quantidade de ambientes"
              name="rooms_count"
              type="number"
              min="1"
              value={form.rooms_count}
              onChange={(e) => setForm({ ...form, rooms_count: e.target.value })}
            />
          </div>

          <Select
            label="Estilo desejado"
            name="style_id"
            value={form.style_id}
            onChange={(e) => setForm({ ...form, style_id: e.target.value })}
            options={[
              { value: '', label: 'Ainda não sei' },
              ...(styles ?? []).map((s) => ({ value: String(s.id), label: s.name })),
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Orçamento mínimo (R$)"
              name="budget_min"
              type="number"
              min="0"
              value={form.budget_min}
              onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
            />
            <Input
              label="Orçamento máximo (R$)"
              name="budget_max"
              type="number"
              min="0"
              value={form.budget_max}
              onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
            />
          </div>

          <Input
            label="Prazo desejado"
            name="timeline"
            placeholder="Ex: 6 meses"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          />

          <div className="text-left">
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
              Necessidades específicas
            </label>
            <textarea
              id="description"
              rows={4}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descreva o sonho da sua obra..."
            />
          </div>

          <div className="text-left">
            <label htmlFor="reference_urls" className="block text-sm font-medium text-neutral-700 mb-1">
              Referências visuais (opcional)
            </label>
            <textarea
              id="reference_urls"
              rows={2}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={form.reference_urls}
              onChange={(e) => setForm({ ...form, reference_urls: e.target.value })}
              placeholder="Cole links de imagens ou projetos que te inspiram, um por linha"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" loading={submitBrief.isPending}>
            Encontrar profissionais compatíveis
          </Button>
        </form>
      </div>
      </div>
    </div>
  )
}
