import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMe } from '../hooks/useAuth'
import { useMyProfessionalProfile, useSaveProfessionalProfile, useStyles } from '../hooks/useDomain'
import { AppHeader } from '../components/AppHeader'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { brazilianStates } from '../lib/brazilianStates'
import { professionalTypeOptions } from '../lib/labels'
import type { ProfessionalType } from '../types/domain'

export function ProfessionalOnboarding() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { data: existingProfile } = useMyProfessionalProfile()
  const { data: styles } = useStyles()
  const saveProfile = useSaveProfessionalProfile()

  const [form, setForm] = useState({
    professional_type: 'architect' as ProfessionalType,
    company_name: '',
    bio: '',
    city: me?.city ?? '',
    state: me?.state ?? '',
    service_radius_km: '80',
    years_experience: '',
    budget_min: '',
    budget_max: '',
    portfolio_url: '',
  })
  const [styleIds, setStyleIds] = useState<number[]>([])

  useEffect(() => {
    if (!existingProfile) return
    setForm({
      professional_type: existingProfile.professional_type,
      company_name: existingProfile.company_name ?? '',
      bio: existingProfile.bio ?? '',
      city: existingProfile.city,
      state: existingProfile.state,
      service_radius_km: String(existingProfile.service_radius_km),
      years_experience: existingProfile.years_experience ? String(existingProfile.years_experience) : '',
      budget_min: existingProfile.budget_min ?? '',
      budget_max: existingProfile.budget_max ?? '',
      portfolio_url: existingProfile.portfolio_url ?? '',
    })
    setStyleIds(existingProfile.styles.map((s) => s.id))
  }, [existingProfile])

  function toggleStyle(id: number) {
    setStyleIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    saveProfile.mutate(
      {
        professional_type: form.professional_type,
        company_name: form.company_name || undefined,
        bio: form.bio || undefined,
        city: form.city,
        state: form.state,
        service_radius_km: form.service_radius_km ? Number(form.service_radius_km) : undefined,
        years_experience: form.years_experience ? Number(form.years_experience) : undefined,
        budget_min: form.budget_min ? Number(form.budget_min) : undefined,
        budget_max: form.budget_max ? Number(form.budget_max) : undefined,
        portfolio_url: form.portfolio_url || undefined,
        style_ids: styleIds,
      },
      { onSuccess: () => navigate('/dashboard') },
    )
  }

  return (
    <div className="min-h-svh">
      <AppHeader />
      <div className="px-6 py-12">
      <div className="max-w-xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-1">Seu perfil profissional</h1>
        <p className="text-muted mb-8">
          Essas informações definem em quais projetos você aparece como compatível.
          {existingProfile?.status === 'pending' && ' Seu perfil está em análise para aprovação.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-border rounded-2xl p-6 md:p-8">
          <Select
            label="Você é"
            name="professional_type"
            value={form.professional_type}
            onChange={(e) => setForm({ ...form, professional_type: e.target.value as ProfessionalType })}
            options={professionalTypeOptions}
            required
          />
          <Input
            label="Nome da empresa / escritório (opcional)"
            name="company_name"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />

          <div className="text-left">
            <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-1">
              Sobre você
            </label>
            <textarea
              id="bio"
              rows={3}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

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
              label="Raio de atuação (km)"
              name="service_radius_km"
              type="number"
              min="1"
              value={form.service_radius_km}
              onChange={(e) => setForm({ ...form, service_radius_km: e.target.value })}
            />
            <Input
              label="Anos de experiência"
              name="years_experience"
              type="number"
              min="0"
              value={form.years_experience}
              onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Investimento mínimo atendido (R$)"
              name="budget_min"
              type="number"
              min="0"
              value={form.budget_min}
              onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
            />
            <Input
              label="Investimento máximo atendido (R$)"
              name="budget_max"
              type="number"
              min="0"
              value={form.budget_max}
              onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
            />
          </div>

          <Input
            label="Link do portfólio (opcional)"
            name="portfolio_url"
            type="url"
            placeholder="https://..."
            value={form.portfolio_url}
            onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
          />

          <div className="text-left">
            <p className="block text-sm font-medium text-neutral-700 mb-2">Estilos que você trabalha</p>
            <div className="flex flex-wrap gap-2">
              {(styles ?? []).map((style) => (
                <button
                  type="button"
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    styleIds.includes(style.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-neutral-300 text-neutral-600'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" loading={saveProfile.isPending}>
            Salvar perfil
          </Button>
        </form>
      </div>
      </div>
    </div>
  )
}
