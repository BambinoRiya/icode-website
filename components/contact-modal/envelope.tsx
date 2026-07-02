'use client'

import { motion } from 'framer-motion'

interface EnvelopeProps {
  isOpening: boolean
}

export function Envelope({ isOpening }: EnvelopeProps) {
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ perspective: 1400 }}
      className="relative w-[26rem] h-72"
    >
      {/* Envelope body */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-[#f5ede0] to-[#e6d9bc] shadow-2xl ring-1 ring-black/5 overflow-hidden">
        {/* Soft depth shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

        {/* Inner pocket seams - the underside of the flap showing through, like a real closed envelope */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#e2d3ab] to-[#d6c391]"
          style={{ clipPath: 'polygon(0% 100%, 50% 48%, 100% 100%)' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#ecdfc2] to-[#e2d3ab]"
          style={{ clipPath: 'polygon(0% 100%, 50% 48%, 0% 45%)' }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-bl from-[#ecdfc2] to-[#e2d3ab]"
          style={{ clipPath: 'polygon(100% 100%, 50% 48%, 100% 45%)' }}
        />
      </div>

      {/* Flap - a real triangular flap that folds back and away like a lid */}
      <motion.div
        initial={false}
        animate={{ rotateX: isOpening ? -160 : 0 }}
        transition={{ duration: 0.6, delay: isOpening ? 0.15 : 0, ease: 'easeInOut' }}
        style={{
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          clipPath: 'polygon(0% 0%, 100% 0%, 50% 78%)',
        }}
        className="absolute inset-x-0 top-0 h-[62%] z-20 bg-gradient-to-b from-[#faf3e6] to-[#e6d5ab] shadow-md"
      >
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent"
          style={{ clipPath: 'polygon(0% 0%, 100% 0%, 50% 78%)' }}
        />
      </motion.div>

      {/* Wax seal */}
      <motion.div
        animate={{
          scale: isOpening ? 0.5 : 1,
          opacity: isOpening ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0d9488] to-[#0a7a6e] shadow-lg ring-4 ring-[#f5ede0] flex items-center justify-center">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </motion.div>
    </motion.div>
  )
}
