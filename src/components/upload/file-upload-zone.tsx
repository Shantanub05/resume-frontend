'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Upload, FileText, X, Check, AlertCircle } from 'lucide-react'

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void
  maxFiles?: number
  acceptedTypes?: string[]
  maxSizeBytes?: number
  className?: string
}

export function FileUploadZone({
  onFilesSelected,
  maxFiles = 3,
  acceptedTypes = ['.pdf', '.doc', '.docx'],
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  className = '',
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [errors, setErrors] = useState<string[]>([])
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

    // Check total file count
    if (uploadedFiles.length + fileArray.length > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} files.`)
      setErrors(newErrors)
      return
    }

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) {
        newErrors.push(error)
      } else {
        // Check for duplicates
        const isDuplicate = uploadedFiles.some(existing => 
          existing.name === file.name && existing.size === file.size
        )
        if (!isDuplicate) {
          newFiles.push(file)
        }
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    // Add valid files
    const updatedFiles = [...uploadedFiles, ...newFiles]
    setUploadedFiles(updatedFiles)
    onFilesSelected(updatedFiles)
    setErrors([])
  }, [uploadedFiles, maxFiles, validateFile, onFilesSelected])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const removeFile = useCallback((fileToRemove: File) => {
    const updatedFiles = uploadedFiles.filter(file => file !== fileToRemove)
    setUploadedFiles(updatedFiles)
    onFilesSelected(updatedFiles)
  }, [uploadedFiles, onFilesSelected])

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
          transition-all duration-300 overflow-hidden
          ${isDragging 
            ? 'border-blue-400 bg-blue-500/10 scale-[1.02]' 
            : 'border-white/20 hover:border-white/30 hover:bg-white/5'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {/* Particle animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-10">
          <motion.div
            animate={{ 
              scale: isDragging ? 1.1 : 1,
              rotate: isDragging ? 5 : 0 
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-white/60'}`} />
          </motion.div>

          <h3 className="text-lg font-semibold text-white mb-2">
            {isDragging ? 'Drop your files here' : 'Upload your resume'}
          </h3>
          
          <p className="text-white/60 mb-4">
            Drag and drop your files here, or click to browse
          </p>

          <div className="text-sm text-white/50 space-y-1">
            <p>Supported formats: {acceptedTypes.join(', ')}</p>
            <p>Maximum file size: {Math.round(maxSizeBytes / (1024 * 1024))}MB</p>
            <p>Upload up to {maxFiles} files</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </motion.div>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            {errors.map((error, index) => (
              <div key={index} className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-400">{error}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-medium text-white/90">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </h4>
            
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${file.size}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg glass border border-white/10"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-400" />
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile(file)
                      }}
                      className="w-6 h-6 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors"
                    >
                      <X className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}