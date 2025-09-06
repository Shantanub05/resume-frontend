'use client'

import { motion } from 'motion/react'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface AnalysisCardProps {
  title: string
  score: number
  maxScore?: number
  icon: LucideIcon
  insights: string[]
  suggestions: string[]
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

export function AnalysisCard({
  title,
  score,
  maxScore = 100,
  icon: Icon,
  insights,
  suggestions,
  trend = 'neutral',
  className = '',
}: AnalysisCardProps) {
  const percentage = (score / maxScore) * 100
  
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

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />
      default:
        return <Minus className="w-4 h-4 text-white/60" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`glass rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
                {score}
              </span>
              <span className="text-white/60">/ {maxScore}</span>
              {getTrendIcon()}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/70">Score</span>
          <span className="text-sm text-white/90">{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
            className={`h-3 rounded-full bg-gradient-to-r ${getProgressColor(percentage)}`}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.3))',
            }}
          />
        </div>
      </div>

      {/* Insights Section */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/90 mb-3">Key Insights</h4>
        <ul className="space-y-2">
          {insights.map((insight, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
              <span>{insight}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Suggestions Section */}
      <div>
        <h4 className="text-sm font-medium text-white/90 mb-3">Improvement Suggestions</h4>
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-start gap-2 text-sm text-white/70"
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
              <span>{suggestion}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
    </motion.div>
  )
}