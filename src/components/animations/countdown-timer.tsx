'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { Clock, AlertTriangle } from 'lucide-react'

interface CountdownTimerProps {
  expiresAt: string
  className?: string
  showAlert?: boolean
}

export function CountdownTimer({ expiresAt, className, showAlert = true }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('')
  const [percentage, setPercentage] = useState(100)
  const [isExpired, setIsExpired] = useState(false)
  const [isLowTime, setIsLowTime] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const diff = expiry - now

      if (diff <= 0) {
        setTimeRemaining('Expired')
        setPercentage(0)
        setIsExpired(true)
        return
      }

      // Calculate time units
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Format time display
      if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else if (minutes > 0) {
        setTimeRemaining(`${minutes}m ${seconds}s`)
      } else {
        setTimeRemaining(`${seconds}s`)
      }

      // Calculate percentage (assuming 24 hours total)
      const totalTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      const newPercentage = Math.max(0, Math.min(100, ((totalTime - diff) / totalTime) * 100))
      setPercentage(newPercentage)

      // Low time warning (less than 2 hours)
      setIsLowTime(diff < 2 * 60 * 60 * 1000)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  if (isExpired) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 ${className}`}
      >
        <AlertTriangle className="w-4 h-4 text-red-400" />
        <span className="text-sm font-medium text-red-400">Session Expired</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-center gap-3 ${className}`}
    >
      {/* Circular Progress */}
      <div className="relative w-12 h-12">
        {/* Background Circle */}
        <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-white/10"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-colors duration-300 ${
              isLowTime ? 'text-red-400' : 'text-blue-400'
            }`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-400' : 'text-blue-400'}`} />
        </div>
      </div>

      {/* Time Display */}
      <div className="flex flex-col">
        <span className="text-sm text-white/60">Time Remaining</span>
        <motion.span
          key={timeRemaining}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`font-mono font-semibold ${
            isLowTime ? 'text-red-400' : 'text-white'
          }`}
        >
          {timeRemaining}
        </motion.span>
      </div>

      {/* Low Time Warning */}
      {showAlert && isLowTime && !isExpired && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 border border-red-500/30"
        >
          <AlertTriangle className="w-3 h-3 text-red-400" />
          <span className="text-xs text-red-400">Low Time</span>
        </motion.div>
      )}
    </motion.div>
  )
}