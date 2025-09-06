'use client'

import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Brain, 
  FileSearch, 
  TrendingUp, 
  Zap, 
  Target, 
  Shield,
  Clock,
  Award,
  BarChart3
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your resume content, structure, and formatting for comprehensive insights.',
    color: 'from-blue-500 to-cyan-500',
    delay: 0.1
  },
  {
    icon: FileSearch,
    title: 'Content Optimization',
    description: 'Get specific suggestions to improve your resume content, keywords, and formatting for maximum impact.',
    color: 'from-purple-500 to-pink-500',
    delay: 0.2
  },
  {
    icon: Target,
    title: 'Job Match Scoring',
    description: 'Compare your resume against specific job descriptions and get a compatibility score with improvement tips.',
    color: 'from-green-500 to-emerald-500',
    delay: 0.3
  },
  {
    icon: TrendingUp,
    title: 'Performance Tracking',
    description: 'Monitor your resume improvements over time with detailed analytics and success metrics.',
    color: 'from-orange-500 to-red-500',
    delay: 0.4
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get comprehensive analysis results in under 30 seconds with our optimized AI processing pipeline.',
    color: 'from-yellow-500 to-orange-500',
    delay: 0.5
  },
  {
    icon: Shield,
    title: 'Privacy Focused',
    description: 'Your resume data is processed securely and never stored permanently. Complete privacy guaranteed.',
    color: 'from-indigo-500 to-blue-500',
    delay: 0.6
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 10
    }
  }
}

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50" />
      
      {/* Background Elements */}
      <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/20 text-sm mb-6"
          >
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <span className="text-white/80">Powerful Features</span>
          </motion.div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Why Choose Our{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Platform
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Experience the future of resume optimization with cutting-edge AI technology 
            designed to maximize your career potential.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="h-full group cursor-pointer border border-white/10 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl hover:from-white/10 hover:to-white/5 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-2">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-white/70 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-8">
            <div className="flex items-center gap-2 text-white/60">
              <Clock className="w-5 h-5" />
              <span>30-second analysis</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2 text-white/60">
              <Award className="w-5 h-5" />
              <span>95% accuracy rate</span>
            </div>
            <div className="w-px h-6 bg-white/20" />
            <div className="flex items-center gap-2 text-white/60">
              <Shield className="w-5 h-5" />
              <span>100% secure & private</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}