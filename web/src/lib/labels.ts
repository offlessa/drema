import type { ProfessionalType, ProjectGoal } from '../types/domain'

export const goalLabels: Record<ProjectGoal, string> = {
  build_house: 'Construir uma casa',
  renovate: 'Reformar',
  interior_design: 'Design de interiores',
  commercial_project: 'Projeto comercial',
  landscaping: 'Área externa / paisagismo',
}

export const goalOptions: { value: ProjectGoal; label: string; description: string }[] = [
  { value: 'build_house', label: 'Construir uma casa', description: 'Do terreno ao projeto pronto' },
  { value: 'renovate', label: 'Reformar', description: 'Transformar um espaço existente' },
  { value: 'interior_design', label: 'Design de interiores', description: 'Ambientes, móveis e decoração' },
  { value: 'commercial_project', label: 'Projeto comercial', description: 'Escritórios, lojas e espaços de negócio' },
  { value: 'landscaping', label: 'Área externa / paisagismo', description: 'Jardins, quintais e áreas de lazer' },
]

export const professionalTypeLabels: Record<ProfessionalType, string> = {
  architect: 'Arquiteto(a)',
  engineer: 'Engenheiro(a)',
  interior_designer: 'Designer de interiores',
  construction_company: 'Construtora',
}

export const professionalTypeOptions = Object.entries(professionalTypeLabels).map(([value, label]) => ({
  value: value as ProfessionalType,
  label,
}))
