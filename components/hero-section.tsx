"use client"

import { motion } from "framer-motion"
import dynamic from "next/dynamic"

const Logo3D = dynamic(() => import("./logo-3d").then((mod) => mod.Logo3D), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-[#e53888]/20 border-t-[#e53888] rounded-full animate-spin" />
    </div>
  ),
})

const codeSnippets = [
  { code: 'const mission = "build for context";', x: 5, y: 15 },
  { code: '<MamaMath status="testing" />', x: 70, y: 65 },
  { code: 'robot.transferability.score()', x: 0, y: 80 },
  { code: 'deploy("african-context")', x: 75, y: 20 },
  { code: 'await think() && teach()', x: 85, y: 45 },
]

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen pt-24 lg:pt-32 pb-16 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e4ea_1px,transparent_1px),linear-gradient(to_bottom,#e8e4ea_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

      {/* Pink Glow Blobs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#e53888]/20 rounded-full blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-[#e53888]/15 rounded-full blur-[100px]"
      />

      {/* Floating Code Snippets - Now in background across entire section */}
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, ...floatingAnimation }}
          transition={{
            duration: 0.6,
            delay: 0.8 + index * 0.2,
            y: {
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3
            }
          }}
          className="absolute hidden lg:block z-10 pointer-events-none"
          style={{ left: `${snippet.x}%`, top: `${snippet.y}%` }}
        >
          <div className="px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-border shadow-lg">
            <code className="text-xs font-mono text-[#e53888]">{snippet.code}</code>
          </div>
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff0f7] border border-[#e53888]/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#e53888] animate-pulse" />
              <span className="text-sm font-medium text-[#e53888]">Building for African Contexts</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-balance">
              We build systems that{" "}
              <span className="text-[#e53888]">think, teach, and move.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              At iCODE Abakwa, intentional coding means building technology that responds to real contexts, real constraints, and real people, from AI-powered education tools to evidence systems for better decisions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <a
                href="#lab"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#e53888] text-white rounded-full text-sm font-medium hover:bg-[#d12d77] transition-all duration-200 shadow-lg shadow-[#e53888]/25 hover:shadow-xl hover:shadow-[#e53888]/30"
              >
                Explore the Lab
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="#systems"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-foreground border border-border rounded-full text-sm font-medium hover:bg-[#fff0f7] hover:border-[#e53888]/30 transition-all duration-200"
              >
                View Projects
              </a>
            </motion.div>
          </motion.div>

          {/* Right Content - 3D Logo */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <Logo3D />

            {/* Decorative glow behind 3D logo */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-[#e53888]/15 rounded-full blur-[80px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
