"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function LiveModeSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="live-mode" className="py-24 bg-gradient-to-b from-transparent via-[#fff0f7]/40 to-transparent" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Live Mode</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Announcements, hackathons, demos, and community build sessions will appear here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-white via-[#fff0f7] to-white rounded-3xl border border-[#e53888]/20 p-8 sm:p-12 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#e53888]/10 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#e53888]/5 to-transparent rounded-full blur-xl" />

            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#e53888]/10 mb-6"
              >
                <svg className="w-8 h-8 text-[#e53888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </motion.div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e53888]/10 text-[#e53888] text-sm font-medium mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e53888] animate-pulse" />
                Coming Soon
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3">iCODE Hackathon</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Collaborative build events for coders working on African evidence and education problems.
              </p>

              <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#e53888] text-white rounded-full text-sm font-medium hover:bg-[#d12d77] transition-all duration-200 shadow-lg shadow-[#e53888]/25 hover:shadow-xl hover:shadow-[#e53888]/30">
                Get Updates
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
