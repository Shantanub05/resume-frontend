'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { Briefcase, Sparkles, Target, AlertCircle } from 'lucide-react'

interface JobAnalysisFormProps {
  onSubmit: (jobDescription: string) => void
  onSkip: () => void
  isLoading?: boolean
  error?: string | null
}

export function JobAnalysisForm({ onSubmit, onSkip, isLoading = false, error }: JobAnalysisFormProps) {
  const [jobDescription, setJobDescription] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobDescription.trim()) {
      onSubmit(jobDescription.trim())
    }
  }

  const wordCount = jobDescription.split(/\s+/).filter(word => word.length > 0).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border-blue-500/20"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Job-Targeted Analysis</h3>
          <p className="text-sm text-white/60">Get tailored feedback for a specific role</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Target className="w-4 h-4 text-blue-400" />
            <span>Skill Gap Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Match Score</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Briefcase className="w-4 h-4 text-green-400" />
            <span>Role-Specific Tips</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Description Input */}
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-white/90 mb-2">
            Job Description
          </label>
          <div className="relative">
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="Paste the job description here... Include requirements, skills, responsibilities, and qualifications for best results."
              className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all duration-200 ${
                isExpanded ? 'h-40' : 'h-24'
              }`}
              maxLength={5000}
              disabled={isLoading}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className={`text-xs ${wordCount > 4500 ? 'text-red-400' : 'text-white/50'}`}>
                {wordCount} words
              </span>
            </div>
          </div>
          <div className="mt-1 text-xs text-white/50">
            Tip: Include required skills, experience level, and key responsibilities for accurate analysis
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkip}
            disabled={isLoading}
            className="text-white/60 hover:text-white/80 text-sm font-medium transition-colors duration-200 disabled:opacity-50"
          >
            Skip & Analyze Without Job
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={!jobDescription.trim() || isLoading || wordCount === 0}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze with Job
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Pro Tips */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 pt-4 border-t border-white/10"
        >
          <h4 className="text-sm font-medium text-white/90 mb-3">💡 Pro Tips for Better Analysis</h4>
          <div className="space-y-2 text-xs text-white/60">
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Include both required and preferred qualifications</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Add technical skills, tools, and technologies mentioned</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>Include years of experience and education requirements</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}