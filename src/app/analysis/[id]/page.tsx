'use client'

import { motion } from 'motion/react'
import { ArrowLeft, Download, Share2, BookOpen, Target, Users, Briefcase, TrendingUp } from 'lucide-react'
import { AnalysisCard } from '@/components/analysis/analysis-card'
import { ProgressRing } from '@/components/charts/progress-ring'
import { SkillRadar } from '@/components/charts/skill-radar'
import Link from 'next/link'

interface AnalysisPageProps {
  params: {
    id: string
  }
}

export default function AnalysisPage({ params: _ }: AnalysisPageProps) {
  // Mock data for analysis results
  const analysisData = {
    resumeTitle: 'Senior Software Engineer Resume',
    overallScore: 85,
    uploadedAt: '2024-01-15T10:30:00Z',
    categories: [
      {
        title: 'Content Quality',
        score: 92,
        icon: BookOpen,
        insights: [
          'Strong technical background with relevant experience',
          'Clear progression in responsibilities and achievements',
          'Quantified accomplishments with specific metrics',
        ],
        suggestions: [
          'Add more industry-specific keywords',
          'Include soft skills in project descriptions',
          'Expand on leadership experience',
        ],
        trend: 'up' as const,
      },
      {
        title: 'Keyword Optimization',
        score: 78,
        icon: Target,
        insights: [
          'Good coverage of technical skills',
          'Missing some trending technologies',
          'Industry buzzwords are present but limited',
        ],
        suggestions: [
          'Add cloud computing technologies (AWS, Azure)',
          'Include AI/ML related keywords if applicable',
          'Mention agile/scrum methodologies',
        ],
        trend: 'neutral' as const,
      },
      {
        title: 'ATS Compatibility',
        score: 88,
        icon: Users,
        insights: [
          'Clean formatting that ATS systems can parse',
          'Standard section headers are used',
          'No complex graphics or unusual fonts',
        ],
        suggestions: [
          'Use more standard job titles',
          'Add skills section with bullet points',
          'Include contact information in header',
        ],
        trend: 'up' as const,
      },
      {
        title: 'Professional Impact',
        score: 82,
        icon: Briefcase,
        insights: [
          'Good use of action verbs',
          'Clear business impact statements',
          'Appropriate level of detail for experience',
        ],
        suggestions: [
          'Quantify more achievements with percentages',
          'Add ROI or cost savings where possible',
          'Include team size for management roles',
        ],
        trend: 'up' as const,
      },
    ],
    skills: [
      { name: 'JavaScript', score: 95 },
      { name: 'React', score: 90 },
      { name: 'Node.js', score: 85 },
      { name: 'Python', score: 78 },
      { name: 'AWS', score: 70 },
      { name: 'Docker', score: 82 },
      { name: 'MongoDB', score: 75 },
    ],
    improvements: [
      {
        category: 'Technical Skills',
        priority: 'High',
        description: 'Add cloud computing certifications and modern frameworks',
        impact: '+12 points',
      },
      {
        category: 'Keywords',
        priority: 'Medium',
        description: 'Include industry-specific terminology and buzzwords',
        impact: '+8 points',
      },
      {
        category: 'Quantification',
        priority: 'High',
        description: 'Add more metrics and measurable achievements',
        impact: '+15 points',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 glass rounded-xl flex items-center justify-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{analysisData.resumeTitle}</h1>
              <p className="text-white/60">
                Analyzed on {new Date(analysisData.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-white/80 hover:text-white transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Export Report
            </motion.button>
          </div>
        </motion.div>

        {/* Overall Score Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Overall Analysis Score</h2>
              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-white">{analysisData.overallScore}</span>
                  <span className="text-xl text-white/60">/100</span>
                </div>
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-medium">Strong performance</span>
                </div>
                <p className="text-white/70">
                  Your resume demonstrates strong technical expertise and professional presentation. 
                  Focus on keyword optimization to improve ATS compatibility.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <ProgressRing
                progress={analysisData.overallScore}
                size={200}
                color="#3b82f6"
                label="Overall Score"
              />
            </div>
          </div>
        </motion.div>

        {/* Category Analysis Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {analysisData.categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AnalysisCard {...category} />
            </motion.div>
          ))}
        </motion.div>

        {/* Skills and Improvements Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Skills Radar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Skills Assessment</h3>
            <div className="flex justify-center">
              <SkillRadar skills={analysisData.skills} size={350} />
            </div>
          </motion.div>

          {/* Improvement Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">Priority Improvements</h3>
            <div className="space-y-4">
              {analysisData.improvements.map((improvement, index) => (
                <motion.div
                  key={improvement.category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{improvement.category}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        improvement.priority === 'High' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {improvement.priority}
                      </span>
                      <span className="text-green-400 text-sm font-medium">
                        {improvement.impact}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{improvement.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-6 h-12 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Apply All Suggestions
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}