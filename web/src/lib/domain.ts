import { api } from './api'
import type {
  Conversation,
  Message,
  ProfessionalProfile,
  ProjectBrief,
  ProjectMatch,
  Style,
} from '../types/domain'

export async function fetchStyles(): Promise<Style[]> {
  const { data } = await api.get<{ data: Style[] }>('/api/styles')
  return data.data
}

export interface ProfessionalProfilePayload {
  professional_type: string
  company_name?: string
  bio?: string
  city: string
  state: string
  service_radius_km?: number
  years_experience?: number
  budget_min?: number
  budget_max?: number
  portfolio_url?: string
  style_ids: number[]
}

export async function fetchMyProfessionalProfile(): Promise<ProfessionalProfile | null> {
  try {
    const { data } = await api.get<{ data: ProfessionalProfile }>('/api/professional-profile')
    return data.data
  } catch {
    return null
  }
}

export async function saveProfessionalProfile(payload: ProfessionalProfilePayload): Promise<ProfessionalProfile> {
  const { data } = await api.post<{ data: ProfessionalProfile }>('/api/professional-profile', payload)
  return data.data
}

export async function fetchProfessionalProfile(id: number): Promise<ProfessionalProfile> {
  const { data } = await api.get<{ data: ProfessionalProfile }>(`/api/professionals/${id}`)
  return data.data
}

export interface ProjectBriefPayload {
  goal: string
  city: string
  state: string
  area_m2?: number
  rooms_count?: number
  style_id?: number
  budget_min?: number
  budget_max?: number
  timeline?: string
  description?: string
  reference_urls?: string[]
}

export async function submitProjectBrief(payload: ProjectBriefPayload): Promise<ProjectMatch[]> {
  const { data } = await api.post<{ data: ProjectMatch[] }>('/api/project-briefs', payload)
  return data.data
}

export async function fetchBriefMatches(briefId: number): Promise<ProjectMatch[]> {
  const { data } = await api.get<{ data: ProjectMatch[] }>(`/api/project-briefs/${briefId}/matches`)
  return data.data
}

export async function fetchLeads(): Promise<ProjectMatch[]> {
  const { data } = await api.get<{ data: ProjectMatch[] }>('/api/leads')
  return data.data
}

export async function expressInterest(matchId: number): Promise<ProjectMatch> {
  const { data } = await api.post<{ data: ProjectMatch }>(`/api/matches/${matchId}/interest`)
  return data.data
}

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } = await api.get<{ data: Conversation[] }>('/api/conversations')
  return data.data
}

export async function fetchMessages(conversationId: number): Promise<Message[]> {
  const { data } = await api.get<{ data: Message[] }>(`/api/conversations/${conversationId}/messages`)
  return data.data
}

export async function sendMessage(conversationId: number, body: string): Promise<Message> {
  const { data } = await api.post<{ data: Message }>(`/api/conversations/${conversationId}/messages`, { body })
  return data.data
}
