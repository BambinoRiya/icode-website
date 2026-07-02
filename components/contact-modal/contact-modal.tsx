'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Envelope } from './envelope'
import { Letter } from './letter'
import { Success } from './success'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isOpening, setIsOpening] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Trigger envelope opening animation after modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsOpening(true), 200)
      return () => clearTimeout(timer)
    } else {
      setIsOpening(false)
      setShowSuccess(false)
    }
  }, [isOpen])

  const handleSubmit = async (data: { name: string; email: string; message: string }) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      setShowSuccess(true)
      // Reset after success animation completes
      setTimeout(() => {
        setShowSuccess(false)
        setIsOpening(false)
        onClose()
      }, 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpening(false)
    setShowSuccess(false)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose()
            }}
          >
            <div className="relative w-full h-full">
              {/* Envelope - pinned dead-center on screen, regardless of the letter's height */}
              <div
                className="absolute top-1/2 left-1/2 z-10"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <Envelope isOpening={isOpening && !showSuccess} />
              </div>

              {/* Letter or Success - anchored to the same center point as the envelope.
                  Starts small, hidden, and low (inside the envelope's footprint), then
                  grows and rises up out of it, popping in front partway through. */}
              <motion.div
                className="absolute top-1/2 left-1/2"
                initial={false}
                animate={
                  isOpening
                    ? { x: '-50%', y: 'calc(-50% - 90px)', scale: 1, opacity: 1, zIndex: 20 }
                    : { x: '-50%', y: 'calc(-50% + 40px)', scale: 0.3, opacity: 0, zIndex: 0 }
                }
                transition={{
                  default: { duration: 0.6, delay: isOpening ? 0.35 : 0, ease: 'easeOut' },
                  zIndex: { delay: isOpening ? 0.55 : 0, duration: 0 },
                }}
              >
                {showSuccess ? (
                  <Success onClose={handleClose} />
                ) : (
                  <Letter onClose={handleClose} onSubmit={handleSubmit} isLoading={isSubmitting} />
                )}
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
