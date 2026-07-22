import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useLogin } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export function Login() {
  const navigate = useNavigate()
  const loginMutation = useLogin()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    loginMutation.mutate(form, {
      onSuccess: () => navigate('/dashboard'),
      onError: (err) => {
        if (axios.isAxiosError(err) && err.response?.status === 422) {
          setError('E-mail ou senha incorretos.')
        } else {
          setError('Não foi possível entrar. Tente novamente.')
        }
      },
    })
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-neutral-900 text-center mb-1">Entrar</h1>
        <p className="text-neutral-500 text-center mb-6">Do sonho ao imóvel.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="text-sm text-danger">{error}</p>}

          <Button type="submit" loading={loginMutation.isPending}>
            Entrar
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="text-primary font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
