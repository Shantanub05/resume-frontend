'use client'

import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { Sparkles, Zap } from 'lucide-react'

export function Navigation() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <motion.a
              href="#features"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </motion.a>
            <motion.a
              href="#how-it-works"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How it Works
            </motion.a>
            <motion.a
              href="#pricing"
              whileHover={{ y: -2 }}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </motion.a>
          </div>

          {/* CTA and Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="gradient" 
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start Free Analysis
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}