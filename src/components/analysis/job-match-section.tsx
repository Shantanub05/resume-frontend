'use client'

import { motion } from 'motion/react'
import { Target, TrendingUp, CheckCircle, XCircle, Lightbulb } from 'lucide-react'

interface JobMatchData {
  jobMatchScore?: number
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
}

interface JobMatchSectionProps {
  data: JobMatchData
}

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'secondary' | 'success' | 'destructive' | 'outline' }) => {
  const variants = {
    default: 'bg-blue-600 text-white',
    secondary: 'bg-slate-600 text-white',
    success: 'bg-green-600 text-white',
    destructive: 'bg-red-600 text-white',
    outline: 'border border-white/20 text-white/80 bg-white/5'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

export function JobMatchSection({ data }: JobMatchSectionProps) {
  const { jobMatchScore, jobMatchAnalysis, jobDescription } = data

  // Don't render if no job description was provided
  if (!jobDescription || !jobMatchAnalysis) {
    return null
  }

  const matchScore = jobMatchScore || 0
  const matchPercentage = Math.round(matchScore)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-400'
    if (score >= 60) return 'from-yellow-500 to-orange-400'
    return 'from-red-500 to-pink-400'
  }

  const getMatchLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match'
    if (score >= 60) return 'Good Match'
    if (score >= 40) return 'Fair Match'
    return 'Needs Improvement'
  }

  return (
    <div className="space-y-6">
      {/* Job Match Score Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Job Match Analysis</h3>
              <p className="text-sm text-white/60">How well your resume fits this role</p>
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(matchPercentage)}`}>
                  {matchPercentage}%
                </div>
                <div className="text-sm text-white/60">Match</div>
              </div>
            </div>
            <div 
              className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000"
              style={{
                borderTopColor: matchPercentage > 0 ? (matchPercentage >= 80 ? '#10b981' : matchPercentage >= 60 ? '#f59e0b' : '#ef4444') : 'transparent',
                borderRightColor: matchPercentage > 25 ? (matchPercentage >= 80 ? '#10b981' : matchPercentage >= 60 ? '#f59e0b' : '#ef4444') : 'transparent',
                borderBottomColor: matchPercentage > 50 ? (matchPercentage >= 80 ? '#10b981' : matchPercentage >= 60 ? '#f59e0b' : '#ef4444') : 'transparent',
                borderLeftColor: matchPercentage > 75 ? (matchPercentage >= 80 ? '#10b981' : matchPercentage >= 60 ? '#f59e0b' : '#ef4444') : 'transparent',
                transform: `rotate(${(matchPercentage / 100) * 360}deg)`,
              }}
            />
          </div>
          <div className="mt-4">
            <Badge variant={matchPercentage >= 80 ? "success" : matchPercentage >= 60 ? "default" : "destructive"}>
              {getMatchLabel(matchPercentage)}
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skills Match */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Skills Analysis</h4>
          </div>

          <div className="space-y-4">
            {/* Skills Match Percentage */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Skills Match Rate</span>
                <span className="text-sm font-medium text-white">
                  {jobMatchAnalysis.skillsMatch.matchPercentage}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(jobMatchAnalysis.skillsMatch.matchPercentage)} transition-all duration-1000`}
                  style={{ width: `${jobMatchAnalysis.skillsMatch.matchPercentage}%` }}
                />
              </div>
            </div>

            {/* Matched Skills */}
            {jobMatchAnalysis.skillsMatch.matched.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">
                    Matched Skills ({jobMatchAnalysis.skillsMatch.matched.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobMatchAnalysis.skillsMatch.matched.slice(0, 6).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <Badge variant="success">{skill}</Badge>
                    </motion.div>
                  ))}
                  {jobMatchAnalysis.skillsMatch.matched.length > 6 && (
                    <Badge variant="outline">+{jobMatchAnalysis.skillsMatch.matched.length - 6} more</Badge>
                  )}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {jobMatchAnalysis.skillsMatch.missing.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white">
                    Missing Skills ({jobMatchAnalysis.skillsMatch.missing.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobMatchAnalysis.skillsMatch.missing.slice(0, 6).map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <Badge variant="destructive">{skill}</Badge>
                    </motion.div>
                  ))}
                  {jobMatchAnalysis.skillsMatch.missing.length > 6 && (
                    <Badge variant="outline">+{jobMatchAnalysis.skillsMatch.missing.length - 6} more</Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Experience Alignment */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <h4 className="text-lg font-semibold text-white">Experience Alignment</h4>
          </div>

          <div className="space-y-4">
            {/* Experience Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Experience Match</span>
                <span className="text-sm font-medium text-white">
                  {Math.round((jobMatchAnalysis.experienceAlignment.score / 5) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor((jobMatchAnalysis.experienceAlignment.score / 5) * 100)} transition-all duration-1000`}
                  style={{ width: `${(jobMatchAnalysis.experienceAlignment.score / 5) * 100}%` }}
                />
              </div>
            </div>

            {/* Experience Feedback */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <p className="text-sm text-white/80 leading-relaxed">
                {jobMatchAnalysis.experienceAlignment.feedback}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Role-Specific Strengths */}
      {jobMatchAnalysis.strengthsForRole.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 border-green-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <h4 className="text-lg font-semibold text-white">Your Strengths for This Role</h4>
          </div>
          <ul className="space-y-3">
            {jobMatchAnalysis.strengthsForRole.map((strength, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white/80 leading-relaxed">{strength}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Role-Specific Recommendations */}
      {jobMatchAnalysis.recommendationsForRole.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 border-blue-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            <h4 className="text-lg font-semibold text-white">Recommendations to Improve Match</h4>
          </div>
          <ul className="space-y-3">
            {jobMatchAnalysis.recommendationsForRole.map((recommendation, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-white/80 leading-relaxed">{recommendation}</p>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}