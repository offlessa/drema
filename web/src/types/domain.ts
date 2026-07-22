export type ProjectGoal = 'build_house' | 'renovate' | 'interior_design' | 'commercial_project' | 'landscaping'

export type ProfessionalType = 'architect' | 'engineer' | 'interior_designer' | 'construction_company'

export interface Style {
  id: number
  name: string
  slug: string
}

export interface ProfessionalProfile {
  id: number
  name: string
  professional_type: ProfessionalType
  company_name: string | null
  bio: string | null
  city: string
  state: string
  service_radius_km: number
  years_experience: number | null
  budget_min: string | null
  budget_max: string | null
  portfolio_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  styles: Style[]
}

export interface ProjectBrief {
  id: number
  goal: ProjectGoal
  city: string
  state: string
  area_m2: number | null
  rooms_count: number | null
  style: Style | null
  budget_min: string | null
  budget_max: string | null
  timeline: string | null
  description: string | null
  reference_urls: string[] | null
  created_at: string
}

export interface ProjectMatch {
  id: number
  project_brief_id: number
  compatibility_score: number
  status: 'pending' | 'chatting' | 'closed'
  professional?: ProfessionalProfile
  project_brief?: ProjectBrief
  conversation_id: number | null
}

export interface Conversation {
  id: number
  match_id: number
  other_party_name: string
  created_at: string
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  is_mine: boolean
  body: string
  created_at: string
}
