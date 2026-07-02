'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface SuccessProps {
  onClose: () => void
  autoCloseDelay?: number
}

export function Success({ onClose, autoCloseDelay = 4000 }: SuccessProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, autoCloseDelay)
    return () => clearTimeout(timer)
  }, [onClose, autoCloseDelay])

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-96"
    >
      <div className="bg-gradient-to-b from-white to-[#fafaf7] rounded-2xl shadow-2xl p-8 text-center space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Checkmark animation */}
        <div className="flex justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 100 }}
            className="w-20 h-20 bg-gradient-to-br from-[#0d9488] to-[#0a7a6e] rounded-full flex items-center justify-center"
          >
            <motion.svg
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <motion.path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </motion.svg>
          </motion.div>
        </div>

        {/* Confetti-like particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [1, 0],
              x: Math.cos((i * 45 * Math.PI) / 180) * 80,
              y: Math.sin((i * 45 * Math.PI) / 180) * 80,
              opacity: [1, 0],
            }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-[#0d9488] rounded-full pointer-events-none"
          />
        ))}

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Message sent!</h2>
          <p className="text-sm text-muted-foreground">
            Thank you for reaching out. We'll get back to you soon.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
