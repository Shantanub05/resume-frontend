'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { Card } from '@/components/ui/card'
import { FileText, User, Mail, Phone, MapPin } from 'lucide-react'

export function FloatingResume() {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    x.set((e.clientX - centerX) / rect.width)
    y.set((e.clientY - centerY) / rect.height)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <div className="relative h-[600px] w-full flex items-center justify-center perspective-1000">
      <motion.div
        ref={ref}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer"
      >
        <Card className="w-80 h-96 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl shadow-primary/20 transform-gpu">
          <div className="h-full p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">John Doe</h3>
                <p className="text-sm text-gray-300">Software Engineer</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>john.doe@email.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {['React', 'TypeScript', 'Node.js', 'Python', 'AWS'].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs bg-white/10 rounded-md text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience Preview */}
            <div>
              <h4 className="text-sm font-medium text-white mb-2">Experience</h4>
              <div className="space-y-2">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-sm font-medium text-white">Senior Developer</p>
                  <p className="text-xs text-gray-400">Tech Corp • 2021-Present</p>
                </div>
              </div>
            </div>

            {/* AI Analysis Indicator */}
            <motion.div
              animate={isHovered ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0.7 }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center"
            >
              <FileText className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </Card>

        {/* Floating particles around the resume */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
            style={{
              left: `${Math.cos((i * Math.PI * 2) / 8) * 120 + 160}px`,
              top: `${Math.sin((i * Math.PI * 2) / 8) * 120 + 192}px`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 360],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}