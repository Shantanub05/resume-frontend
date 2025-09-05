import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from './client'
import type { 
  GuestSessionResponse, 
  SessionInfoResponse,
  UploadResumeResponse,
  MyResumesResponse,
  AnalysisResponse,
  AnalysisResultResponse 
} from './client'

// Query Keys
export const queryKeys = {
  sessionInfo: ['session-info'] as const,
  canUpload: ['can-upload'] as const,
  myResumes: ['my-resumes'] as const,
  resume: (id: string) => ['resume', id] as const,
  analysis: (id: string) => ['analysis', id] as const,
} as const

// Session Queries
export function useSessionInfo(enabled = true) {
  return useQuery({
    queryKey: queryKeys.sessionInfo,
    queryFn: () => apiClient.getSessionInfo(),
    enabled,
    refetchInterval: 60000, // Refresh every minute for timer
    retry: (failureCount, error: any) => {
      // Don't retry if token is invalid
      if (error?.message?.includes('token')) return false
      return failureCount < 3
    },
  })
}

export function useCanUpload() {
  return useQuery({
    queryKey: queryKeys.canUpload,
    queryFn: () => apiClient.canUpload(),
    staleTime: 30000, // 30 seconds
  })
}

// Resume Queries
export function useMyResumes() {
  return useQuery({
    queryKey: queryKeys.myResumes,
    queryFn: () => apiClient.getMyResumes(),
    staleTime: 60000, // 1 minute
  })
}

export function useResume(resumeId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.resume(resumeId),
    queryFn: () => apiClient.getResume(resumeId),
    enabled: enabled && !!resumeId,
  })
}

export function useAnalysisResult(analysisId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analysis(analysisId),
    queryFn: () => apiClient.getAnalysisResult(analysisId),
    enabled: enabled && !!analysisId,
    refetchInterval: (data) => {
      // Poll every 3 seconds if analysis is still processing
      if (data?.data.status === 'PROCESSING' || data?.data.status === 'PENDING') {
        return 3000
      }
      return false
    },
  })
}

// Session Mutations
export function useCreateGuestSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionName?: string) => apiClient.createGuestSession(sessionName),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('guest-token', data.data.token)
      
      // Update session info cache
      queryClient.setQueryData(queryKeys.sessionInfo, {
        success: true,
        data: {
          uploadsUsed: 0,
          uploadsRemaining: data.data.uploadsRemaining,
          uploadsLimit: data.data.uploadsLimit,
          expiresAt: data.data.expiresAt,
          timeRemaining: '24 hours',
        },
      })
    },
  })
}

// Resume Mutations
export function useUploadResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) =>
      apiClient.uploadResume(file, title),
    onSuccess: (data) => {
      // Invalidate resumes list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.myResumes })
      
      // Update session info with new upload count
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionInfo })
      queryClient.invalidateQueries({ queryKey: queryKeys.canUpload })
    },
  })
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ resumeId, jobDescription }: { resumeId: string; jobDescription?: string }) =>
      apiClient.analyzeResume(resumeId, jobDescription),
    onSuccess: (data, variables) => {
      // Invalidate resume data to show new analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.resume(variables.resumeId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.myResumes })
    },
  })
}

// Utility Hooks
export function useGuestToken() {
  return localStorage.getItem('guest-token')
}

export function useIsSessionValid() {
  const { data: sessionInfo, isError } = useSessionInfo()
  
  return {
    isValid: !isError && !!sessionInfo?.data,
    sessionInfo: sessionInfo?.data,
  }
}

// Auto-refresh analysis hook
export function useAnalysisWithPolling(analysisId: string) {
  const { data, isLoading, error } = useAnalysisResult(analysisId, !!analysisId)
  
  const isProcessing = data?.data.status === 'PROCESSING' || data?.data.status === 'PENDING'
  const isCompleted = data?.data.status === 'COMPLETED'
  const isFailed = data?.data.status === 'FAILED'
  
  return {
    analysis: data?.data,
    isLoading: isLoading || isProcessing,
    isCompleted,
    isFailed,
    error,
  }
}