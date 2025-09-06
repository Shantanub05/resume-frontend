'use client'

import { motion } from 'motion/react'
import { FileText, TrendingUp, Clock, Star, Upload, BarChart3, Users, Zap } from 'lucide-react'
import { DashboardCard } from '@/components/dashboard/dashboard-card'
import { ProgressRing } from '@/components/charts/progress-ring'
import { FileUploadZone } from '@/components/upload/file-upload-zone'
import { GuestSessionModal } from '@/components/modals/guest-session-modal'
import { useState } from 'react'

export default function DashboardPage() {
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [guestSession, setGuestSession] = useState<{
    id: string
    name: string
    expiresAt: string
  } | null>(null)

  const handleFilesSelected = (files: File[]) => {
    console.warn('Files selected:', files)
    // Handle file upload logic here
  }

  const handleSessionCreated = (sessionData: { id: string; name: string; expiresAt: string }) => {
    setGuestSession(sessionData)
    setIsGuestModalOpen(false)
  }

  // Mock data for the dashboard
  const dashboardData = {
    totalResumes: 12,
    averageScore: 85,
    improvements: 23,
    timeSpent: '2.5h',
  }

  const recentResumes = [
    { id: '1', title: 'Software Engineer Resume', score: 92, status: 'Completed', date: '2 hours ago' },
    { id: '2', title: 'Product Manager CV', score: 78, status: 'Analyzing', date: '1 day ago' },
    { id: '3', title: 'Data Scientist Resume', score: 88, status: 'Completed', date: '3 days ago' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Resume Dashboard
          </h1>
          <p className="text-white/60 text-lg">
            Track your resume performance and get AI-powered insights
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <DashboardCard
            title="Total Resumes"
            value={dashboardData.totalResumes}
            subtitle="Analyzed this month"
            icon={FileText}
            gradient="from-blue-500 to-cyan-500"
            trend={{ value: 15, isPositive: true }}
          />
          
          <DashboardCard
            title="Average Score"
            value={`${dashboardData.averageScore}%`}
            subtitle="Across all resumes"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-500"
            trend={{ value: 8, isPositive: true }}
          />
          
          <DashboardCard
            title="Improvements"
            value={dashboardData.improvements}
            subtitle="Suggestions applied"
            icon={Star}
            gradient="from-purple-500 to-pink-500"
            trend={{ value: 12, isPositive: true }}
          />
          
          <DashboardCard
            title="Time Spent"
            value={dashboardData.timeSpent}
            subtitle="Optimizing resumes"
            icon={Clock}
            gradient="from-orange-500 to-red-500"
          />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-semibold text-white mb-4">Upload New Resume</h2>
              <FileUploadZone onFilesSelected={handleFilesSelected} />
            </motion.div>

            {/* Guest Session Button */}
            {!guestSession && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <button
                  onClick={() => setIsGuestModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                >
                  <Users className="w-5 h-5" />
                  Start Guest Session
                </button>
                <p className="text-white/60 text-sm mt-2">
                  Try our AI resume analyzer without creating an account
                </p>
              </motion.div>
            )}

            {/* Recent Resumes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Recent Resumes</h3>
              <div className="space-y-4">
                {recentResumes.map((resume, index) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{resume.title}</h4>
                        <p className="text-sm text-white/60">{resume.date}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">{resume.score}%</div>
                      <div className={`text-xs font-medium ${
                        resume.status === 'Completed' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {resume.status}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6">Performance</h3>
              
              <div className="space-y-6">
                <ProgressRing
                  progress={dashboardData.averageScore}
                  size={120}
                  color="#3b82f6"
                  label="Overall Score"
                />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Content Quality</span>
                    <span className="text-white font-medium">92%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '92%' }}
                      transition={{ delay: 0.8, duration: 1 }}
                      className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Keywords</span>
                    <span className="text-white font-medium">78%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ delay: 1, duration: 1 }}
                      className="bg-gradient-to-r from-yellow-500 to-orange-400 h-2 rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Formatting</span>
                    <span className="text-white font-medium">95%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ delay: 1.2, duration: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-purple-400 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg transition-all duration-200">
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all duration-200">
                  <BarChart3 className="w-5 h-5" />
                  View Analytics
                </button>
                
                <button className="w-full flex items-center gap-3 p-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all duration-200">
                  <Zap className="w-5 h-5" />
                  AI Suggestions
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Guest Session Modal */}
      <GuestSessionModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  )
}