'use client'

import { motion } from 'motion/react'
import { FileText, TrendingUp, Clock, Star, Upload, BarChart3, Users, Zap, Loader2 } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { ProgressRing } from '@/components/charts/progress-ring'
import { FileUploadZone } from '@/components/upload/file-upload-zone'
import { GuestSessionModal } from '@/components/modals/guest-session-modal'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMyResumes, useSessionInfo, useIsSessionValid, useUploadResume, useReuploadResume, useCreateGuestSession, useAnalyzeResume, useAnalysisResult } from '@/lib/api/queries'
import { AnalysisSection } from '@/components/dashboard/analysis-section'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [processingFiles, setProcessingFiles] = useState(false)
  const [analyzingResumes, setAnalyzingResumes] = useState<Set<string>>(new Set())
  
  const { isValid, sessionInfo } = useIsSessionValid()
  const { data: resumesData, isLoading: isLoadingResumes, isError: resumesError, refetch: refetchResumes } = useMyResumes()
  const uploadResumeMutation = useUploadResume()
  const reuploadResumeMutation = useReuploadResume()
  const analyzeResumeMutation = useAnalyzeResume()
  const createGuestMutation = useCreateGuestSession()
  
  // Check if user has a guest session
  const hasGuestSession = isValid && !!sessionInfo
  const resumes = resumesData?.data?.data || []

  useEffect(() => {
    const hasProcessingAnalysis = resumes.some((resume: any) => 
      resume.analysis && ['PENDING', 'PROCESSING'].includes(resume.analysis.status)
    );

    if (hasProcessingAnalysis) {
      const interval = setInterval(() => {
        console.log('Polling for resume updates...');
        refetchResumes();
      }, 2000); // Poll every 2 seconds

      return () => clearInterval(interval);
    }
  }, [resumes, refetchResumes]);
  const hasResumes = resumes.length > 0
  
  // Get the first completed analysis for display
  const completedResume = resumes.find(resume => resume.analysis?.status === 'COMPLETED')
  const { data: analysisData } = useAnalysisResult(completedResume?.analysis?.id || '', !!completedResume?.analysis?.id)

  // Debug logging - remove in production
  console.log('Dashboard state:', { 
    hasGuestSession, 
    isValid, 
    sessionInfo, 
    hasResumes, 
    resumesData,
    resumesError,
    isLoadingResumes 
  })

  // Clean up analyzing state when analysis completes
  useEffect(() => {
    if (resumes && resumes.length > 0) {
      setAnalyzingResumes(prev => {
        const newSet = new Set(prev)
        let changed = false
        
        resumes.forEach((resume: any) => {
          if (prev.has(resume.id) && resume.analysis?.status === 'COMPLETED') {
            newSet.delete(resume.id)
            changed = true
            console.log('Analysis completed for resume:', resume.id)
          }
        })
        
        return changed ? newSet : prev
      })
    }
  }, [resumes])

  const handleFilesSelected = (files: File[]) => {
    console.log('Files selected:', files)
    // Files are selected but not yet processed
  }

  const handleProcessFiles = async (files: File[]) => {
    if (files.length === 0) return
    
    // If no guest session, create one first
    if (!hasGuestSession) {
      try {
        await createGuestMutation.mutateAsync()
      } catch (error) {
        console.error('Failed to create guest session:', error)
        toast.error('Failed to create session. Please try again.')
        return
      }
    }

    // Check if user has reached their operation limit
    if (sessionInfo?.operationsRemaining !== undefined && sessionInfo.operationsRemaining <= 0) {
      toast.error('Operation limit reached. Maximum 3 uploads/reuploads allowed per session.')
      return
    }

    setProcessingFiles(true)
    
    try {
      // If user has existing resume, reupload it; otherwise upload new
      const existingResume = resumes[0] // Since we only allow one resume now
      
      for (const file of files) {
        let uploadResult
        
        try {
          if (existingResume) {
            // Reupload existing resume
            console.log('Reuploading existing resume:', existingResume.id)
            uploadResult = await reuploadResumeMutation.mutateAsync({
              resumeId: existingResume.id,
              file, 
              title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
            })
            toast.success('Resume replaced successfully!')
          } else {
            // Upload new resume
            console.log('Uploading new resume')
            uploadResult = await uploadResumeMutation.mutateAsync({ 
              file, 
              title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
            })
            toast.success('Resume uploaded successfully!')
          }
        } catch (uploadError) {
          console.error('Upload/reupload error:', uploadError)
          const errorMessage = uploadError instanceof Error ? uploadError.message : 'Upload failed'
          
          toast.error(errorMessage)
          throw uploadError // Re-throw to stop processing
        }
        
        // The response is nested: uploadResult.data.data.resumeId
        const resumeId = uploadResult?.data?.data?.resumeId || existingResume?.id
        
        // Trigger analysis after successful upload/reupload
        if (resumeId) {
          console.log('Starting analysis for resume:', resumeId)
          
          // Add to analyzing set to show spinner
          setAnalyzingResumes(prev => new Set([...prev, resumeId]))
          
          try {
            const analysisResult = await analyzeResumeMutation.mutateAsync({ 
              resumeId 
            })
            console.log('Analysis started:', analysisResult)
          } catch (error) {
            console.error('Failed to start analysis:', error)
            toast.error('Failed to start analysis. Please try again.')
            // Remove from analyzing set on error
            setAnalyzingResumes(prev => {
              const newSet = new Set(prev)
              newSet.delete(resumeId)
              return newSet
            })
          }
          
          // Note: Resume stays in analyzingResumes until polling detects completion
        } else {
          console.error('No resumeId in upload result:', uploadResult)
        }
      }
      
      console.log('Files uploaded/reuploaded and analysis started successfully!')
    } catch (error) {
      console.error('Failed to upload/reupload files or start analysis:', error)
      // Error toast is already shown in the individual upload/reupload try-catch blocks
    } finally {
      setProcessingFiles(false)
    }
  }

  const handleSessionCreated = (sessionData: { id: string; name: string; expiresAt: string }) => {
    setIsGuestModalOpen(false)
    // The session will be automatically detected by the useIsSessionValid hook
  }

  // Calculate actual stats from resumes data - only if we have data loaded
  const dashboardData = (hasResumes && !isLoadingResumes) ? {
    totalResumes: resumes.length,
    averageScore: Math.round(resumes.reduce((acc, resume) => {
      if (resume.analysis?.overallScore) {
        // Convert 4.2/5 to 84%
        const score = parseFloat(resume.analysis.overallScore.toString())
        return acc + Math.round((score / 5) * 100)
      }
      return acc
    }, 0) / resumes.filter(resume => resume.analysis?.overallScore).length) || 0,
    improvements: resumes.filter(resume => resume.analysis).length,
    timeSpent: '0h', // Could calculate from analysis creation dates
  } : null

  // Handle resume card click - scroll to analysis section if completed
  const handleResumeClick = (resume: any) => {
    if (resume.analysis?.status === 'COMPLETED' && resume.analysis?.id) {
      const analysisSection = document.querySelector('[data-analysis-section]') as HTMLElement
      if (analysisSection) {
        analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Only show loading if we have a guest token and are actively loading
  if (isLoadingResumes && hasGuestSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl">Loading your resumes...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Resume Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            Track your resume performance and get AI-powered insights
          </p>
        </motion.div>

        {/* Stats Grid - Only show if user has resumes */}
        {dashboardData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <DashboardCard
              title="Total Resumes"
              value={dashboardData.totalResumes}
              subtitle="Uploaded resumes"
              icon={FileText}
              gradient="from-blue-500 to-cyan-500"
            />
            
            <DashboardCard
              title="Average Score"
              value={dashboardData.averageScore > 0 ? `${dashboardData.averageScore}%` : 'Not analyzed'}
              subtitle="Across analyzed resumes"
              icon={TrendingUp}
              gradient="from-green-500 to-emerald-500"
            />
            
            <DashboardCard
              title="Analyzed"
              value={dashboardData.improvements}
              subtitle="Resumes with analysis"
              icon={Star}
              gradient="from-purple-500 to-pink-500"
            />
            
            <DashboardCard
              title="Session Info"
              value={hasGuestSession ? sessionInfo?.operationsRemaining || 0 : 'N/A'}
              subtitle="Operations remaining"
              icon={Clock}
              gradient="from-orange-500 to-red-500"
            />
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">
                {hasResumes ? 'Replace Your Resume' : 'Upload New Resume'}
              </h2>
              <div data-upload-zone>
                <FileUploadZone 
                  onFilesSelected={handleFilesSelected} 
                  onProcessFiles={handleProcessFiles}
                  isProcessing={processingFiles}
                  maxFiles={1}
                  isReupload={hasResumes}
                />
              </div>
              {sessionInfo && (
                <div className={`mt-4 p-4 rounded-xl ${
                  sessionInfo.operationsRemaining <= 0 
                    ? 'bg-red-500/10 border border-red-500/20'
                    : 'bg-yellow-500/10 border border-yellow-500/20'
                }`}>
                  <div className={`flex items-center gap-2 text-sm ${
                    sessionInfo.operationsRemaining <= 0 ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    <Zap className="w-4 h-4" />
                    <span>
                      Operations: {sessionInfo.totalOperations || 0}/3 used
                      {sessionInfo.operationsRemaining !== undefined && 
                        ` (${sessionInfo.operationsRemaining} remaining)`
                      }
                      {sessionInfo.operationsRemaining <= 0 && ' - Limit reached!'}
                    </span>
                  </div>
                </div>
              )}
            </motion.div>

            

            {/* Recent Resumes */}
            {hasResumes ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-4">Your Resumes</h3>
                <div className="space-y-4">
                  {resumes.slice(0, 3).map((resume, index) => (
                    <motion.div
                      key={resume.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      onClick={() => handleResumeClick(resume)}
                      className={`flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors ${
                        resume.analysis?.status === 'COMPLETED' ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{resume.title}</h4>
                          <p className="text-sm text-white/60">
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-white flex items-center justify-end gap-2">
                          {resume.analysis?.overallScore ? 
                            `${Math.round((parseFloat(resume.analysis.overallScore.toString()) / 5) * 100)}%` : 
                            'N/A'
                          }
                          {(analyzingResumes.has(resume.id) || 
                            ['PENDING', 'PROCESSING'].includes(resume.analysis?.status)) && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          )}
                        </div>
                        <div className={`text-xs font-medium ${
                          resume.analysis?.status === 'COMPLETED' ? 'text-green-400' :
                          resume.analysis?.status === 'PROCESSING' || analyzingResumes.has(resume.id) ? 'text-blue-400' :
                          resume.analysis?.status === 'PENDING' ? 'text-yellow-400' :
                          resume.analysis?.status === 'FAILED' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {resume.analysis?.status === 'COMPLETED' ? 'Click to see analysis below' :
                           resume.analysis?.status === 'PROCESSING' || analyzingResumes.has(resume.id) ? 'Processing...' :
                           resume.analysis?.status === 'PENDING' ? 'Analysis pending...' :
                           resume.analysis?.status === 'FAILED' ? 'Analysis failed' :
                           'Not analyzed'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <FileText className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Resumes Yet</h3>
                <p className="text-white/60">
                  {hasGuestSession 
                    ? "Upload your resume above to get started with AI-powered analysis!"
                    : "Start a guest session and upload your resume to begin!"
                  }
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview - Only show if user has analyzed resumes */}
            {dashboardData && dashboardData.averageScore > 0 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Performance</h3>
                
                <div className="space-y-6">
                  <ProgressRing
                    progress={dashboardData.averageScore}
                    size={120}
                    color="#3b82f6"
                    label="Overall Score"
                  />
                  
                  <div className="text-center">
                    <p className="text-white/60 text-sm">
                      Average across {dashboardData.improvements} analyzed resume{dashboardData.improvements !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <BarChart3 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Analysis Yet</h3>
                <p className="text-white/60 text-sm">
                  Upload and analyze your resumes to see performance metrics here.
                </p>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => {
                    // Focus on the file upload zone
                    const uploadZone = document.querySelector('[data-upload-zone]') as HTMLElement
                    if (uploadZone) {
                      uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      uploadZone.focus()
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-200"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
                
                {completedResume && analysisData?.success && (
                  <button 
                    onClick={() => {
                      // Scroll to analysis section
                      const analysisSection = document.querySelector('[data-analysis-section]') as HTMLElement
                      if (analysisSection) {
                        analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all duration-200"
                  >
                    <BarChart3 className="w-5 h-5" />
                    View Analysis
                  </button>
                )}
                
                {completedResume && analysisData?.success && (
                  <button 
                    onClick={() => {
                      // Scroll to suggestions section
                      const suggestionsSection = document.querySelector('[data-suggestions-section]') as HTMLElement
                      if (suggestionsSection) {
                        suggestionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all duration-200"
                  >
                    <Zap className="w-5 h-5" />
                    AI Suggestions
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Analysis and Suggestions - Show when completed analysis exists */}
        {completedResume && analysisData?.success && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              data-analysis-section
            >
              <h2 className="text-3xl font-bold text-white mb-2 text-center">Resume Analysis</h2>
              <p className="text-white/60 text-center mb-8">Detailed insights and performance metrics for your resume</p>
              <AnalysisSection analysis={analysisData.data} />
            </motion.div>

          </div>
        )}
      </div>

      {/* Guest Session Modal */}
      <GuestSessionModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  )
}