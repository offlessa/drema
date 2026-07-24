import { useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/AppHeader'
import { goalOptions } from '../lib/labels'
import type { ProjectGoal as ProjectGoalType } from '../types/domain'

export function ProjectGoal() {
  const navigate = useNavigate()

  function selectGoal(goal: ProjectGoalType) {
    navigate('/questionario', { state: { goal } })
  }

  return (
    <div className="min-h-svh flex flex-col">
      <AppHeader />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl text-center">
          <p className="uppercase tracking-[0.2em] text-xs text-teal font-medium mb-4">Passo 1 de 2</p>
          <h1 className="font-display text-3xl md:text-4xl text-ink mb-10">Qual é o seu objetivo?</h1>

          <div className="grid sm:grid-cols-2 gap-4">
            {goalOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => selectGoal(option.value)}
                className="text-left rounded-2xl border border-border bg-white px-6 py-5 hover:border-primary hover:shadow-sm transition-all"
              >
                <p className="font-medium text-ink">{option.label}</p>
                <p className="text-sm text-muted mt-1">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
