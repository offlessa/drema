import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  expressInterest,
  fetchBriefMatches,
  fetchConversations,
  fetchLeads,
  fetchMessages,
  fetchMyProfessionalProfile,
  fetchProfessionalProfile,
  fetchStyles,
  saveProfessionalProfile,
  sendMessage,
  submitProjectBrief,
  type ProfessionalProfilePayload,
  type ProjectBriefPayload,
} from '../lib/domain'

export function useStyles() {
  return useQuery({ queryKey: ['styles'], queryFn: fetchStyles, staleTime: Infinity })
}

export function useMyProfessionalProfile() {
  return useQuery({ queryKey: ['professional-profile', 'me'], queryFn: fetchMyProfessionalProfile })
}

export function useProfessionalProfile(id: number) {
  return useQuery({ queryKey: ['professional-profile', id], queryFn: () => fetchProfessionalProfile(id) })
}

export function useSaveProfessionalProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfessionalProfilePayload) => saveProfessionalProfile(payload),
    onSuccess: (profile) => queryClient.setQueryData(['professional-profile', 'me'], profile),
  })
}

export function useSubmitProjectBrief() {
  return useMutation({ mutationFn: (payload: ProjectBriefPayload) => submitProjectBrief(payload) })
}

export function useBriefMatches(briefId: number | null) {
  return useQuery({
    queryKey: ['project-briefs', briefId, 'matches'],
    queryFn: () => fetchBriefMatches(briefId as number),
    enabled: briefId !== null,
  })
}

export function useLeads() {
  return useQuery({ queryKey: ['leads'], queryFn: fetchLeads })
}

export function useExpressInterest() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (matchId: number) => expressInterest(matchId),
    onSuccess: (match) => {
      queryClient.setQueryData(['project-briefs', match.project_brief_id, 'matches'], (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.map((m) => (m.id === match.id ? match : m))
      })
    },
  })
}

export function useConversations() {
  return useQuery({ queryKey: ['conversations'], queryFn: fetchConversations })
}

export function useMessages(conversationId: number) {
  return useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: () => fetchMessages(conversationId),
    refetchInterval: 4000,
  })
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: string) => sendMessage(conversationId, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations', conversationId, 'messages'] }),
  })
}
