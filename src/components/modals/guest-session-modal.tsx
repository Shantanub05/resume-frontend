'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { User, Clock, Upload, FileText, X } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CountdownTimer } from '@/components/animations/countdown-timer'
import { useCreateGuestSession } from '@/lib/api/queries'

interface GuestSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSessionCreated: (sessionData: { 
    id: string
    name: string
    expiresAt: string
  }) => void
}

export function GuestSessionModal({ isOpen, onClose, onSessionCreated }: GuestSessionModalProps) {
  const [step, setStep] = useState<'form' | 'session'>('form')
  const [name, setName] = useState('')
  const [sessionData, setSessionData] = useState<{
    id: string
    name: string
    expiresAt: string
  } | null>(null)

  const createGuestSessionMutation = useCreateGuestSession()

  const handleCreateSession = async () => {
    if (!name.trim()) return

    createGuestSessionMutation.mutate(name.trim(), {
      onSuccess: (response) => {
        const session = {
          id: response.data.token.slice(-8), // Use last 8 chars of token as ID
          name: name.trim(),
          expiresAt: response.data.expiresAt,
        }
        
        setSessionData(session)
        setStep('session')
        onSessionCreated(session)
      },
      onError: (error) => {
        console.error('Failed to create session:', error)
      },
    })
  }

  const handleClose = () => {
    setStep('form')
    setName('')
    setSessionData(null)
    onClose()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !createGuestSessionMutation.isPending && name.trim()) {
      handleCreateSession()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <div className="absolute right-4 top-4">
          <button
            onClick={handleClose}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                Start Guest Session
              </DialogTitle>
              <p className="text-sm text-white/70">
                Analyze your resume quickly without creating an account. Sessions last 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-white/90">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="h-12"
                  disabled={createGuestSessionMutation.isPending}
                />
              </div>

              <motion.button
                onClick={handleCreateSession}
                disabled={!name.trim() || createGuestSessionMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {createGuestSessionMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    Create Guest Session
                  </>
                )}
              </motion.button>
            </div>

            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-white/90">24-hour session duration</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Upload className="w-4 h-4 text-green-400" />
                <span className="text-white/90">Upload up to 3 resumes</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <FileText className="w-4 h-4 text-purple-400" />
                <span className="text-white/90">Full AI analysis & feedback</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'session' && sessionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  ✓
                </motion.div>
              </motion.div>
              <DialogTitle className="text-xl font-semibold">
                Session Created!
              </DialogTitle>
              <p className="text-sm text-white/70">
                Welcome, {sessionData.name}! Your guest session is now active.
              </p>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-xl p-4">
                <CountdownTimer
                  expiresAt={sessionData.expiresAt}
                  className="justify-center"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Session ID</span>
                  <span className="font-mono text-white/90">{sessionData.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Upload Limit</span>
                  <span className="text-white/90">3 resumes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">AI Analysis</span>
                  <span className="text-green-400">Unlimited</span>
                </div>
              </div>

              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Start Analyzing Resumes
              </motion.button>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}