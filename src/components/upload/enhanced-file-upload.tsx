'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, FileText, Trash2, AlertCircle, Zap, Loader2, Briefcase, Target, Sparkles } from 'lucide-react'

interface EnhancedFileUploadProps {
  onFilesSelected: (files: File[]) => void
  onProcessFiles?: (files: File[], jobDescription?: string) => void
  isProcessing?: boolean
  maxFiles?: number
  acceptedTypes?: string[]
  maxSizeBytes?: number
  className?: string
  isReupload?: boolean
}

export function EnhancedFileUpload({
  onFilesSelected,
  onProcessFiles,
  isProcessing = false,
  maxFiles = 1,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  className = '',
  isReupload = false,
}: EnhancedFileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [jobDescription, setJobDescription] = useState('')
  const [showJobDescription, setShowJobDescription] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" is too large. Maximum size is ${Math.round(maxSizeBytes / (1024 * 1024))}MB.`
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(fileExtension)) {
      return `File "${file.name}" is not a supported format. Please upload ${acceptedTypes.join(', ')} files.`
    }

    return null
  }, [maxSizeBytes, acceptedTypes])

  const handleFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files)
    const newFiles: File[] = []
    const newErrors: string[] = []

    // Clear existing errors
    setErrors([])

    // Validate each file
    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        newFiles.push(file)
      }
    }

    // Check max files limit
    if (newFiles.length > maxFiles) {
      newErrors.push(`Too many files selected. Maximum ${maxFiles} file${maxFiles !== 1 ? 's' : ''} allowed.`)
      return
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Success: Update state and notify parent
    setUploadedFiles(newFiles)
    setErrors([])
    onFilesSelected(newFiles)
  }, [validateFile, maxFiles, onFilesSelected])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesSelected(newFiles)
  }

  const handleProcess = () => {
    if (uploadedFiles.length > 0 && onProcessFiles) {
      onProcessFiles(uploadedFiles, jobDescription.trim() || undefined)
    }
  }

  const wordCount = jobDescription.split(/\s+/).filter(word => word.length > 0).length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Upload Zone */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-blue-400 bg-blue-500/10' 
            : 'border-white/20 hover:border-blue-400/50 bg-white/5 hover:bg-blue-500/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isReupload ? 'Replace Your Resume' : 'Upload Your Resume'}
            </h3>
            <p className="text-white/60 text-sm">
              Drag & drop your resume here, or click to browse
            </p>
            <p className="text-white/40 text-xs mt-2">
              Supports PDF, DOC, DOCX (max {Math.round(maxSizeBytes / (1024 * 1024))}MB)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="text-sm font-medium text-white/90">Uploaded Files:</h4>
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={`${file.name}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-white/60">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                  disabled={isProcessing}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Job Description Section */}
      {uploadedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Job-Targeted Analysis</h3>
                <p className="text-sm text-white/60">Optional: Get insights for a specific job</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowJobDescription(!showJobDescription)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                showJobDescription 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {showJobDescription ? 'Hide' : 'Add Job Description'}
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Skill Gap Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Match Score</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Briefcase className="w-4 h-4 text-green-400" />
              <span>Role-Specific Tips</span>
            </div>
          </div>

          <AnimatePresence>
            {showJobDescription && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-white/90 mb-2">
                    Job Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="jobDescription"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Paste the job description here... Include requirements, skills, responsibilities, and qualifications for best results."
                      className="w-full h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all duration-200"
                      maxLength={5000}
                      disabled={isProcessing}
                    />
                    <div className="absolute bottom-2 right-2 flex items-center gap-2">
                      <span className={`text-xs ${wordCount > 4500 ? 'text-red-400' : 'text-white/50'}`}>
                        {wordCount} words
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-white/50">
                    Tip: Include required skills, experience level, and key responsibilities for accurate analysis
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Errors */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Button */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-center"
          >
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className={`
                px-8 py-3 rounded-xl font-medium text-white transition-all duration-200 flex items-center gap-2
                ${isProcessing 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105'
                }
              `}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  {jobDescription.trim() ? 'Upload & Analyze with Job' : 'Upload & Analyze Resume'}
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}