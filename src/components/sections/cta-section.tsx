'use client'

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Users, TrendingUp, CheckCircle } from 'lucide-react'

const benefits = [
  'Instant AI-powered analysis',
  'Personalized improvement suggestions',
  'ATS optimization score',
  'Job description matching',
  'Privacy-first approach'
]

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10" />
      
      {/* Background Elements */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-8 mb-8"
          >
            <div className="flex items-center gap-2 text-white/70">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-lg font-medium">10,000+ users</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-2 text-white/70">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-lg font-medium">40% average improvement</span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
              Ready to{' '}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              Your Resume?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of job seekers who've boosted their interview rates with our AI-powered resume analysis.
            </p>
          </div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 my-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-2 text-white/80"
              >
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-medium">{benefit}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            <Button
              size="lg"
              variant="gradient"
              className="group px-12 py-6 text-xl font-bold shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Your Free Analysis Now
              <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-2" />
            </Button>
            
            <p className="text-sm text-white/50">
              No signup required • Results in 30 seconds • 100% secure
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="pt-12 border-t border-white/10"
          >
            <p className="text-white/40 text-sm mb-6">Trusted by professionals at</p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta'].map((company) => (
                <div key={company} className="text-white/60 font-semibold text-lg">
                  {company}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-30"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </section>
  )
}