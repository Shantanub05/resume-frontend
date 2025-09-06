const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

class ApiClient {
  private baseURL: string
  
  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add guest token if available
    const guestToken = localStorage.getItem('guest-token')
    if (guestToken) {
      config.headers = {
        ...config.headers,
        'x-guest-token': guestToken,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // If can't parse JSON, use default message
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Network error occurred')
    }
  }

  // Guest Session API
  async createGuestSession(sessionName?: string): Promise<GuestSessionResponse> {
    return this.request('/guest/session', {
      method: 'POST',
      body: JSON.stringify({ name: sessionName }),
    })
  }

  async getSessionInfo(): Promise<SessionInfoResponse> {
    return this.request('/guest/session/info')
  }

  async canUpload(): Promise<CanUploadResponse> {
    return this.request('/guest/session/can-upload')
  }

  // Resume API
  async uploadResume(file: File, title?: string): Promise<UploadResumeResponse> {
    const formData = new FormData()
    formData.append('resume', file)
    if (title) {
      formData.append('title', title)
    }

    return this.request('/resumes/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for multipart
    })
  }

  async getMyResumes(): Promise<MyResumesResponse> {
    return this.request('/resumes/my-resumes')
  }

  async getResume(resumeId: string): Promise<ResumeDetailResponse> {
    return this.request(`/resumes/${resumeId}`)
  }

  async analyzeResume(resumeId: string, jobDescription?: string): Promise<AnalysisResponse> {
    return this.request(`/resumes/${resumeId}/analyze`, {
      method: 'POST',
      body: JSON.stringify({ jobDescription }),
    })
  }

  async getAnalysisResult(analysisId: string): Promise<AnalysisResultResponse> {
    return this.request(`/resumes/analysis/${analysisId}`)
  }

  async getQuickAnalysis(resumeId: string): Promise<QuickAnalysisResponse> {
    return this.request(`/resumes/${resumeId}/quick-analysis`)
  }
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message: string
}

export interface GuestSessionResponse extends ApiResponse {
  data: {
    token: string
    expiresAt: string
    uploadsLimit: number
    uploadsRemaining: number
  }
}

export interface SessionInfoResponse extends ApiResponse {
  data: {
    uploadsUsed: number
    uploadsRemaining: number
    uploadsLimit: number
    expiresAt: string
    timeRemaining: string
  }
}

export interface CanUploadResponse extends ApiResponse {
  data: {
    canUpload: boolean
  }
}

export interface UploadResumeResponse extends ApiResponse {
  data: {
    resumeId: string
    filename: string
    size: number
    extractedLength: number
    sessionInfo: {
      uploadsRemaining: number
      uploadsUsed: number
    }
  }
}

export interface MyResumesResponse extends ApiResponse {
  data: Array<{
    id: string
    title: string
    originalFilename: string
    fileSize: number
    createdAt: string
    analysis: {
      id: string
      status: string
      overallScore: number
      createdAt: string
    } | null
  }>
}

export interface ResumeDetailResponse extends ApiResponse {
  data: {
    id: string
    title: string
    originalFilename: string
    fileSize: number
    extractedText: string
    createdAt: string
    analysis: Record<string, unknown> | null
  }
}

export interface AnalysisResponse extends ApiResponse {
  data: {
    analysisId: string
    resumeId: string
    status: string
  }
}

export interface AnalysisResultResponse extends ApiResponse {
  data: {
    id: string
    status: string
    overallScore: number
    strengths: string[]
    improvements: string[]
    missingSkills: string[]
    keywordMatch: Record<string, unknown>
    sectionsAnalysis: Record<string, unknown>
    resume: {
      id: string
      title: string
    }
  }
}

export interface QuickAnalysisResponse extends ApiResponse {
  data: Record<string, unknown>
}

export const apiClient = new ApiClient(API_BASE_URL)