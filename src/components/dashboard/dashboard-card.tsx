'use client'

import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface DashboardCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  gradient?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  onClick?: () => void
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient = 'from-blue-500 to-purple-600',
  trend,
  className = '',
  onClick,
}: DashboardCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        glass rounded-2xl p-6 cursor-pointer group relative overflow-hidden
        hover:shadow-xl hover:shadow-primary/10 transition-all duration-300
        ${className}
      `}
      onClick={onClick}
    >
      {/* Background Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.isPositive ? '↗' : '↘'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-white/70 group-hover:text-white/90 transition-colors">
            {title}
          </h3>
          
          <div className="text-2xl font-bold text-white group-hover:text-white/95 transition-colors">
            {value}
          </div>
          
          {subtitle && (
            <p className="text-xs text-white/50 group-hover:text-white/70 transition-colors">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`} />
    </motion.div>
  )
}