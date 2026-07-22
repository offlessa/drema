import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useRegister } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { brazilianStates } from '../lib/brazilianStates'
import type { UserRole } from '../types/user'

export function Register() {
  const navigate = useNavigate()
  const registerMutation = useRegister()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'client' as UserRole,
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErrors({})
    registerMutation.mutate(form, {
      onSuccess: () => navigate('/dashboard'),
      onError: (error) => {
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          const fieldErrors = error.response.data.errors as Record<string, string[]>
          setErrors(Object.fromEntries(Object.entries(fieldErrors).map(([key, [msg]]) => [key, msg])))
        }
      },
    })
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-neutral-900 text-center mb-1">Criar conta</h1>
        <p className="text-neutral-500 text-center mb-6">Do sonho ao imóvel.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'client' })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                form.role === 'client' ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-300 text-neutral-600'
              }`}
            >
              Sou cliente
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'professional' })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${
                form.role === 'professional' ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-300 text-neutral-600'
              }`}
            >
              Sou profissional
            </button>
          </div>

          <Input
            label="Nome"
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
          />
          <Input
            label="Confirmar senha"
            name="password_confirmation"
            type="password"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            required
          />
          <Input
            label="Cidade"
            name="city"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            error={errors.city}
            required
          />
          <Select
            label="Estado"
            name="state"
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            error={errors.state}
            options={[{ value: '', label: 'Selecione' }, ...brazilianStates]}
            required
          />

          <Button type="submit" loading={registerMutation.isPending}>
            Criar conta
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
