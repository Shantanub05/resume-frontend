'use client'

import { motion } from 'motion/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GradientText, TypingText } from '@/components/animations/gradient-text'
import { FloatingResume } from '@/components/animations/floating-resume'
import { ParticleField } from '@/components/animations/particle-field'
import { GuestSessionModal } from '@/components/modals/guest-session-modal'
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Resumes Analyzed', value: '10K+', icon: TrendingUp },
  { label: 'Success Rate', value: '95%', icon: Sparkles },
  { label: 'Average Score Boost', value: '+40%', icon: Zap },
]

export function HeroSection() {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const router = useRouter()

  const handleStartAnalysis = () => {
    setIsGuestModalOpen(true)
  }

  const handleSessionCreated = (_sessionData: { id: string; name: string; expiresAt: string }) => {
    setIsGuestModalOpen(false)
    // Navigate to dashboard with session data
    router.push('/dashboard')
  }

  const handleWatchDemo = () => {
    // Scroll to features or navigate to demo page
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <ParticleField />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-white/80">AI-Powered Resume Analysis</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <GradientText className="text-6xl lg:text-7xl font-bold leading-tight">
                Transform Your
              </GradientText>
              <TypingText 
                text="Resume with AI" 
                className="text-6xl lg:text-7xl font-bold text-white block"
              />
            </div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/70 leading-relaxed max-w-lg"
            >
              Get instant, professional feedback on your resume with our advanced AI analysis. 
              Boost your chances of landing interviews by up to 40%.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                onClick={handleStartAnalysis}
                size="lg"
                variant="gradient"
                className="group px-8 py-4 text-lg font-semibold shadow-2xl shadow-blue-500/25"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              
              <Button
                onClick={handleWatchDemo}
                size="lg"
                variant="glass"
                className="px-8 py-4 text-lg font-medium text-white"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Resume */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="flex justify-center"
          >
            <FloatingResume />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="w-1 h-3 bg-white/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>

      {/* Guest Session Modal */}
      <GuestSessionModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </section>
  )
}