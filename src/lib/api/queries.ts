import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  apiClient,
  type UploadResumeResponse,
  type GuestSessionResponse
} from './client'
import { toast } from 'sonner'

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
    retry: (failureCount, error: Error) => {
      // Don't retry if token is invalid
      if (error?.message?.includes('token')) return false
      return failureCount < 3
    },
  })
}

export function useCanUpload() {
  const guestToken = useGuestToken()
  
  return useQuery({
    queryKey: queryKeys.canUpload,
    queryFn: () => apiClient.canUpload(),
    enabled: !!guestToken, // Only run if we have a token
    staleTime: 30000, // 30 seconds
    retry: (failureCount, error: Error) => {
      // Don't retry if no token or token invalid
      if (error?.message?.includes('token') || !guestToken) return false
      return failureCount < 3
    },
  })
}

// Resume Queries
export function useMyResumes() {
  const guestToken = useGuestToken()
  
  return useQuery({
    queryKey: queryKeys.myResumes,
    queryFn: () => apiClient.getMyResumes(),
    enabled: !!guestToken, // Only run if we have a token
    staleTime: 0, // Always consider data stale for real-time updates
    gcTime: 0, // Don't cache for too long to ensure fresh data
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnWindowFocus: true,
    retry: (failureCount, error: Error) => {
      // Don't retry if no token or token invalid
      if (error?.message?.includes('token') || !guestToken) return false
      return failureCount < 3
    },
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
      // If analysis is still processing, poll every 3 seconds
      const analysis = data?.data
      const isProcessing = analysis?.status && ['PENDING', 'PROCESSING'].includes(analysis.status)
      
      console.log('Analysis polling check:', {
        analysisId,
        status: analysis?.status,
        isProcessing,
        shouldContinuePolling: isProcessing
      })
      
      return isProcessing ? 3000 : false // 3 seconds if processing, stop when complete
    },
    staleTime: 0, // Always refetch to get latest status
  })
}

// Session Mutations
export function useCreateGuestSession() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (sessionName?: string) => apiClient.createGuestSession(sessionName),
    onSuccess: (data: GuestSessionResponse) => {
      console.log('createGuestSession success:', data)
      console.log('Storing token:', data.data.data.token)
      // Store token in localStorage
      localStorage.setItem('guest-token', data.data.data.token)
      
      // Verify it was stored
      console.log('Token stored, verification:', localStorage.getItem('guest-token'))
      
      // Trigger custom event to update useGuestToken hook
      window.dispatchEvent(new Event('guest-token-updated'))
      console.log('guest-token-updated event dispatched')
      
      // Update session info cache with complete data structure
      queryClient.setQueryData(queryKeys.sessionInfo, {
        success: true,
        data: {
          uploadsUsed: 0,
          uploadsRemaining: data.data.data.uploadsRemaining || 3,
          uploadsLimit: data.data.data.uploadsLimit || 3,
          reuploadAttempts: 0,
          reuploadsRemaining: data.data.data.uploadsLimit || 3,
          totalOperations: 0,
          operationsRemaining: data.data.data.uploadsLimit || 3,
          expiresAt: data.data.data.expiresAt,
          timeRemaining: '24h',
        },
      })
      
      // Also invalidate session info to trigger fresh fetch
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionInfo })
    },
  })
}

// Resume Mutations
export function useUploadResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, title }: { file: File; title?: string }) =>
      apiClient.uploadResume(file, title),
    onSuccess: (data: UploadResumeResponse) => {
      console.log('Upload successful, new session info:', data.data.sessionInfo);
      // Invalidate resumes list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.myResumes })
      
      // Update session info with new upload count
      queryClient.setQueryData(queryKeys.sessionInfo, {
          success: true,
          data: data.data.sessionInfo,
          message: 'from upload mutation'
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.canUpload })
    },
    onError: (error: Error) => {
      console.error('Upload mutation error:', error)
      // Let the component handle the toast to avoid duplicate messages
    },
  })
}

export function useReuploadResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ resumeId, file, title }: { resumeId: string; file: File; title?: string }) =>
      apiClient.reuploadResume(resumeId, file, title),
    onSuccess: (data: UploadResumeResponse) => {
      console.log('Reupload successful, new session info:', data.data.sessionInfo);
      // Invalidate resumes list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.myResumes })
      
      // Update session info with new reupload count
      queryClient.setQueryData(queryKeys.sessionInfo, {
          success: true,
          data: data.data.sessionInfo,
          message: 'from reupload mutation'
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.canUpload })
    },
    onError: (error: Error) => {
      console.error('Reupload mutation error:', error)
      // Let the component handle the toast to avoid duplicate messages
    },
  })
}

export function useAnalyzeResume() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ resumeId, jobDescription }: { resumeId: string; jobDescription?: string }) =>
      apiClient.analyzeResume(resumeId, jobDescription),
    onSuccess: (_data, variables) => {
      // Invalidate resume data to show new analysis
      queryClient.invalidateQueries({ queryKey: queryKeys.resume(variables.resumeId) })
      
      // Force refetch the resumes list to immediately show the new analysis status
      queryClient.refetchQueries({ queryKey: queryKeys.myResumes })
      
      console.log('Analysis mutation completed, forcing resumes refetch')
    },
  })
}

// Utility Hooks
export function useGuestToken() {
  const [token, setToken] = useState<string | null>(null)
  
  useEffect(() => {
    // Set initial token
    const storedToken = localStorage.getItem('guest-token')
    console.log('useGuestToken: Initial token from localStorage:', storedToken)
    console.log('useGuestToken: All localStorage keys:', Object.keys(localStorage))
    setToken(storedToken)
    
    // Listen for localStorage changes (including from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'guest-token') {
        setToken(e.newValue)
      }
    }
    
    // Listen for custom events (when token is set programmatically)
    const handleTokenUpdate = () => {
      const newToken = localStorage.getItem('guest-token')
      console.log('useGuestToken: handleTokenUpdate triggered, new token:', newToken)
      setToken(newToken)
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('guest-token-updated', handleTokenUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('guest-token-updated', handleTokenUpdate)
    }
  }, [])
  
  return token
}

export function useIsSessionValid() {
  const guestToken = useGuestToken()
  const { data: sessionInfo, isError, error } = useSessionInfo(!!guestToken)
  
  console.log('useIsSessionValid:', { 
    guestToken: !!guestToken, 
    sessionInfo: sessionInfo?.data,
    isError,
    error,
    isValid: !!guestToken && !isError && !!sessionInfo?.data
  })
  
  return {
    isValid: !!guestToken && !isError && !!sessionInfo?.data,
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