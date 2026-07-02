'use client'

import { useState } from 'react'

interface LetterProps {
  onClose: () => void
  onSubmit: (data: { name: string; email: string; message: string }) => Promise<void>
  isLoading?: boolean
}

export function Letter({ onClose, onSubmit, isLoading = false }: LetterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('miyaka@ebaseafrica.org')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    
    if (!email || !message) {
      setSubmitError('Email and message are required')
      return
    }

    try {
      await onSubmit({ name, email, message })
      setName('')
      setEmail('')
      setMessage('')
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="relative w-96 max-h-[90vh] overflow-y-auto">
      <div className="bg-gradient-to-b from-white to-[#fafaf7] rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 hover:bg-muted rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-foreground/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-[#0d9488]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
            </svg>
            <h2 className="text-2xl font-bold text-foreground">Let's stay in touch</h2>
          </div>
          <p className="text-sm text-muted-foreground">We'd love to hear from you.</p>
        </div>

        {/* Email copy section */}
        <div className="space-y-3 border-b border-border pb-6">
          <p className="text-sm text-muted-foreground">You can email us directly at</p>
          <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
            <span className="text-sm font-mono text-foreground flex-1">miyaka@ebaseafrica.org</span>
            <button
              onClick={handleCopyEmail}
              className="px-2 py-1 text-xs font-medium text-[#0d9488] hover:bg-white/50 rounded transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] text-sm"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-[#e53888]">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] text-sm"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message <span className="text-[#e53888]">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Your message..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488] text-sm resize-none"
            />
          </div>

          {submitError && (
            <div className="text-sm text-[#e53888]">{submitError}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#0d9488] to-[#0a7a6e] text-white rounded-lg font-medium hover:from-[#0a7a6e] hover:to-[#08625a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
