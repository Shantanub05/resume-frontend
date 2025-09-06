'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'

interface SkillRadarProps {
  skills: {
    name: string
    score: number
    maxScore?: number
  }[]
  size?: number
  className?: string
}

export function SkillRadar({ 
  skills, 
  size = 300,
  className = '' 
}: SkillRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size
    
    const centerX = size / 2
    const centerY = size / 2
    const maxRadius = size * 0.4

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background grid
    const levels = 5
    for (let i = 1; i <= levels; i++) {
      const radius = (maxRadius * i) / levels
      
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw axis lines
    const numAxes = skills.length
    const angleStep = (2 * Math.PI) / numAxes

    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * maxRadius
      const y = centerY + Math.sin(angle) * maxRadius

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.stroke()
    }

    // Draw skill polygon
    if (skills.length > 0) {
      ctx.beginPath()
      
      for (let i = 0; i < numAxes; i++) {
        const skill = skills[i]
        const maxScore = skill.maxScore || 100
        const normalizedScore = skill.score / maxScore
        const angle = i * angleStep - Math.PI / 2
        const radius = maxRadius * normalizedScore
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      
      ctx.closePath()
      
      // Fill the polygon
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius)
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)')
      gradient.addColorStop(1, 'rgba(147, 51, 234, 0.1)')
      ctx.fillStyle = gradient
      ctx.fill()
      
      // Stroke the polygon
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw skill points
    for (let i = 0; i < numAxes; i++) {
      const skill = skills[i]
      const maxScore = skill.maxScore || 100
      const normalizedScore = skill.score / maxScore
      const angle = i * angleStep - Math.PI / 2
      const radius = maxRadius * normalizedScore
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fillStyle = '#60a5fa'
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw skill labels
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < numAxes; i++) {
      const skill = skills[i]
      const angle = i * angleStep - Math.PI / 2
      const labelRadius = maxRadius + 20
      const x = centerX + Math.cos(angle) * labelRadius
      const y = centerY + Math.sin(angle) * labelRadius

      // Adjust text alignment based on position
      if (x < centerX - 5) {
        ctx.textAlign = 'right'
      } else if (x > centerX + 5) {
        ctx.textAlign = 'left'
      } else {
        ctx.textAlign = 'center'
      }

      ctx.fillText(skill.name, x, y)
    }

  }, [skills, size])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ maxWidth: size, maxHeight: size }}
      />
      
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap justify-center gap-4 text-xs"
      >
        {skills.map((skill, index) => {
          const getScoreColor = (score: number) => {
            const percentage = (score / (skill.maxScore || 100)) * 100
            if (percentage >= 80) return 'text-green-400'
            if (percentage >= 60) return 'text-yellow-400'
            return 'text-red-400'
          }

          return (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2 glass px-3 py-1 rounded-full"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <span className="text-white/90">{skill.name}</span>
              <span className={`font-medium ${getScoreColor(skill.score)}`}>
                {skill.score}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}