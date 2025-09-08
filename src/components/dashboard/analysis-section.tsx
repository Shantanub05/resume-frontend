'use client'

import { motion } from 'motion/react'
import { Award, TrendingUp, Target, BarChart3 } from 'lucide-react'
import { JobMatchSection } from '../analysis/job-match-section'

interface AnalysisData {
  id: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  overallScore?: number | null
  jobMatchScore?: number | null
  strengths?: string[]
  improvements?: string[]
  missingSkills?: string[]
  keywordMatch?: {
    matched: string[]
    missing: string[]
    matchPercentage: number
  }
  sectionsAnalysis?: Record<string, {
    score: number
    feedback: string
  }>
  jobMatchAnalysis?: {
    skillsMatch: {
      matched: string[]
      missing: string[]
      matchPercentage: number
    }
    experienceAlignment: {
      score: number
      feedback: string
    }
    recommendationsForRole: string[]
    strengthsForRole: string[]
  }
  jobDescription?: string | null
  errorMessage?: string | null
  createdAt: string
  updatedAt: string
  resume?: {
    id: string
    title: string
    originalFilename: string
    createdAt: string
  }
}

interface AnalysisSectionProps {
  analysis: AnalysisData
}

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'destructive' | 'outline' }) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-slate-600 text-white',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-white/20 text-white/80 bg-white/5'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export function AnalysisSection({ analysis }: AnalysisSectionProps) {
  // Debug logging to see actual data structure
  console.log('AnalysisSection received data:', {
    analysis,
    hasResume: !!analysis.resume,
    resumeTitle: analysis.resume?.title,
    keys: Object.keys(analysis)
  })

  const overallScore = parseFloat(analysis.overallScore) || 0
  const scorePercentage = Math.round((overallScore / 5) * 100)

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-6 border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{scorePercentage}%</div>
                <div className="text-xs text-white/60">Score</div>
              </div>
            </div>
            <div 
              className="absolute inset-0 rounded-full border-6 border-transparent border-t-blue-500 transform transition-all duration-1000"
              style={{
                transform: `rotate(${(scorePercentage / 100) * 360}deg)`,
                borderRightColor: scorePercentage > 25 ? '#3b82f6' : 'transparent',
                borderBottomColor: scorePercentage > 50 ? '#3b82f6' : 'transparent',
                borderLeftColor: scorePercentage > 75 ? '#3b82f6' : 'transparent',
              }}
            ></div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {analysis.resume?.title || 'Resume Analysis'}
        </h3>
        <p className="text-white/60 text-sm mb-3">
          Analyzed on {new Date(analysis.createdAt).toLocaleDateString()}
        </p>
        
        <div className="flex items-center justify-center gap-2">
          <Badge variant={scorePercentage >= 80 ? "default" : scorePercentage >= 60 ? "secondary" : "destructive"}>
            {scorePercentage >= 80 ? 'Excellent' : scorePercentage >= 60 ? 'Good' : 'Needs Improvement'}
          </Badge>
          <Badge variant="outline">{overallScore.toFixed(1)}/5.0</Badge>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border-green-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Strengths</h4>
          </div>
          {analysis.strengths && analysis.strengths.length > 0 ? (
            <ul className="space-y-2">
              {analysis.strengths.slice(0, 3).map((strength: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-white/80">{strength}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60 text-sm">No specific strengths identified.</p>
          )}
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 border-orange-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h4 className="text-lg font-semibold text-white">Improvements</h4>
          </div>
          {analysis.improvements && analysis.improvements.length > 0 ? (
            <ul className="space-y-2">
              {analysis.improvements.slice(0, 3).map((improvement: string, index: number) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-white/80">{improvement}</p>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-white/60 text-sm">No specific improvements suggested.</p>
          )}
        </motion.div>
      </div>

      {/* Missing Skills */}
      {analysis.missingSkills && analysis.missingSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass rounded-2xl p-6 border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-400" />
            <h4 className="text-lg font-semibold text-white">Skills to Add</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.missingSkills.slice(0, 8).map((skill: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Badge variant="destructive">{skill}</Badge>
              </motion.div>
            ))}
            {analysis.missingSkills.length > 8 && (
              <Badge variant="outline">+{analysis.missingSkills.length - 8} more</Badge>
            )}
          </div>
        </motion.div>
      )}

      {/* Keyword Analysis */}
      {analysis.keywordMatch && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Keywords</h4>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Match Rate</span>
              <span className="text-white font-medium">
                {analysis.keywordMatch.matchPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${analysis.keywordMatch.matchPercentage || 0}%` }}
              ></div>
            </div>
            
            {analysis.keywordMatch.matched && analysis.keywordMatch.matched.length > 0 && (
              <div>
                <p className="text-white/60 text-xs mb-2">Matched ({analysis.keywordMatch.matched.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywordMatch.matched.slice(0, 5).map((keyword: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.keywordMatch.matched.length > 5 && (
                    <Badge variant="outline">+{analysis.keywordMatch.matched.length - 5} more</Badge>
                  )}
                </div>
              </div>
            )}

            {analysis.keywordMatch.missing && analysis.keywordMatch.missing.length > 0 && (
              <div className="mt-3">
                <p className="text-white/60 text-xs mb-2">Missing ({analysis.keywordMatch.missing.length}):</p>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywordMatch.missing.slice(0, 5).map((keyword: string, index: number) => (
                    <Badge key={index} variant="destructive">
                      {keyword}
                    </Badge>
                  ))}
                  {analysis.keywordMatch.missing.length > 5 && (
                    <Badge variant="outline">+{analysis.keywordMatch.missing.length - 5} more</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Job Match Analysis */}
      <JobMatchSection 
        data={{
          jobMatchScore: analysis.jobMatchScore,
          jobMatchAnalysis: analysis.jobMatchAnalysis,
          jobDescription: analysis.jobDescription,
        }}
      />

      {/* Section Analysis */}
      {analysis.sectionsAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Section Scores</h4>
          </div>
          <div className="space-y-6">
            {Object.entries(analysis.sectionsAnalysis).map(([section, data]: [string, any]) => (
              <div key={section} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-white text-base capitalize">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </h5>
                  <span className="text-sm text-white/60">
                    {data.score ? `${Math.round((data.score / 5) * 100)}%` : 'N/A'}
                  </span>
                </div>
                {data.score && (
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${(data.score / 5) * 100}%` }}
                    ></div>
                  </div>
                )}
                {data.feedback && (
                  <p className="text-white/70 text-sm leading-relaxed bg-slate-800/30 rounded-lg p-3">
                    {data.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}