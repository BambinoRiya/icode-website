"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { motion, AnimatePresence } from "framer-motion"

const SPLASH_COLORS = [
  "#e53888",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f97316",
  "#3b82f6",
  "#ec4899",
]

const teamMembers = [
  {
    id: 1,
    name: "Miyaka Kinlabel",
    role: "Software Engineer / Team Lead",
    bio: "Miyaka builds at the intersection of AI, education, and evidence, creating systems that think with context instead of assumptions.",
    location: "Bamenda / Accra-ish",
    loves: "systems thinking, CATS, pink UI",
    superpower: "turning \"what if?\" into working products",
    initials: "MK",
    defaultColor: "#e53888",
    photo: "/miyaka.jpg",
    file: "miyaka",
    position: { top: "8%", left: "8%" },
    size: 220,
  },
  {
    id: 2,
    name: "Wobyeb Graphlain",
    role: "Software Engineer/ Web Dev Nerd",
    bio: "Graph builds intelligent systems that transform evidence into action, refining machine learning models and creating technology for real-world impact.",
    location: "Bamenda, CM",
    loves: "open source, money, late-night debugging",
    superpower: "making models smarter",
    initials: "WG",
    defaultColor: "#f59e0b",
    photo: "/wobyeb.jpg",
    file: "wobyeb",
    position: { top: "55%", left: "42%" },
    size: 220,
  },
  {
    id: 3,
    name: "Tifuh Berenice",
    role: "Strategy & Impact Lead",
    bio: "Tifuh keeps the chaos organised, helping research, ideas, and people move in the same direction.",
    location: "Bamenda, CM",
    loves: "field research, data viz, storytelling",
    superpower: "asking the right questions",
    initials: "TB",
    defaultColor: "#8b5cf6",
    photo: "/tifuh.jpg",
    file: "tifuh",
    position: { top: "15%", left: "72%" },
    size: 190,
  },
]

export default function TeamPage() {
  const [pageBgColor, setPageBgColor] = useState("#FAFAF7")
  const [splashOrigin, setSplashOrigin] = useState({ x: 50, y: 50 })
  const [splashKey, setSplashKey] = useState(0)
  const [splashColor, setSplashColor] = useState("#FAFAF7")
  // const [selectedMember, setselectedMember] = useState<typeof teamMembers[0] | null>(null)
  const [hoveredMember, setHoveredMember] = useState<typeof teamMembers[0] | null>(null)
  const [selectedMember, setSelectedMember] = useState<typeof teamMembers[0] | null>(null)
  const [terminalPosition, setTerminalPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function pickRandomColor(current: string) {
    const others = SPLASH_COLORS.filter((c) => c !== current)
    return others[Math.floor(Math.random() * others.length)]
  }

  function handleMemberHover(e: React.MouseEvent, member: typeof teamMembers[0]) {
    // Hover only previews the member and triggers the color splash
    setHoveredMember(member)

    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setSplashOrigin({ x, y })
    }

    const nextColor = pickRandomColor(pageBgColor)
    setSplashColor(nextColor)
    setSplashKey((k) => k + 1) // remount splash so animation always replays

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    // Commit the bg after the splash animation finishes (~650ms)
    timeoutRef.current = setTimeout(() => {
      setPageBgColor(nextColor)
    }, 650)
  }

  function handleMemberClick(e: React.MouseEvent, member: typeof teamMembers[0]) {
  e.stopPropagation()

    const rect = containerRef.current?.getBoundingClientRect()

    if (rect) {
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      setTerminalPosition({
        x: Math.min(x + 24, rect.width - 320),
        y: Math.max(y - 120, 24),
      })
    }

    setSelectedMember(member)
}

  function handleMemberLeave() {
    setHoveredMember(null)
  }

  // Contrast helpers based on committed bg
  const isDarkBg = pageBgColor !== "#FAFAF7"
  const textColor = isDarkBg ? "text-white" : "text-foreground"
  const textMuted = isDarkBg ? "text-white/60" : "text-foreground/60"
  const textSubtle = isDarkBg ? "text-white/40" : "text-foreground/40"
  const borderColor = isDarkBg ? "border-white/10" : "border-border"

  return (
    <>
      {/* Paint splash layer — fixed, pointer-events-none, behind everything via z-[-1] */}
      <motion.div
        key={splashKey}
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundColor: splashColor, zIndex: -1 }}
        initial={{ clipPath: `circle(0% at ${splashOrigin.x}% ${splashOrigin.y}%)` }}
        animate={{ clipPath: `circle(170% at ${splashOrigin.x}% ${splashOrigin.y}%)` }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Blob drip particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`blob-${splashKey}-${i}`}
          className="fixed rounded-full pointer-events-none"
          style={{
            backgroundColor: splashColor,
            zIndex: -1,
            width: 18 + i * 14,
            height: 28 + i * 16,
            left: `${splashOrigin.x}%`,
            top: `${splashOrigin.y}%`,
            filter: "blur(5px)",
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 0.85 }}
          animate={{
            scale: [0, 2, 1.3],
            x: Math.cos((i * 45 * Math.PI) / 180) * (90 + i * 35),
            y: Math.sin((i * 45 * Math.PI) / 180) * (90 + i * 35),
            opacity: [0.85, 0.6, 0],
          }}
          transition={{ duration: 0.85, delay: i * 0.03, ease: "easeOut" }}
        />
      ))}

      <main
        ref={containerRef}
        onClick={() => setSelectedMember(null)}
        className="min-h-screen relative transition-colors duration-300"
        style={{ backgroundColor: pageBgColor }}
      >
        <Navbar />

      {/* Hero */}
      <section className="pt-28 lg:pt-36 pb-16 relative z-10">
        {/* Dot grid top-right */}
        <div className={`absolute top-24 right-8 ${isDarkBg ? "text-white/10" : "text-[#e53888]/10"} font-mono text-sm hidden lg:flex flex-col items-end gap-1`}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-1.5">
              {[...Array(10)].map((_, j) => (<span key={j}>·</span>))}
            </div>
          ))}
        </div>

        {/* Corner brackets */}
        <div className={`absolute top-28 right-12 ${isDarkBg ? "text-white/20" : "text-[#e53888]/25"} hidden lg:block`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 2h15v15" />
          </svg>
        </div>
        <div className={`absolute bottom-10 left-8 ${isDarkBg ? "text-white/20" : "text-[#e53888]/25"} hidden lg:block`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M17 22H2V7" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Terminal command */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm mb-10"
          >
            <span className="text-[#e53888]">user@icode:~$</span>
            <span className={textMuted}> whoami --team</span>
          </motion.div>

          {/* Main content area with scattered photos */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">
            {/* Left side - Headline and info */}
            <div className="lg:w-1/3 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none ${textColor}`}>
                  Meet the
                  <br />
                  <span className="text-[#e53888]">team.</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="max-w-xs space-y-5"
              >
                <p className={`${textMuted} leading-relaxed text-sm`}>
                  Builders. Educators. Dreamers.
                  <br />
                  We&apos;re a distributed team building intentional technology for real impact.
                </p>

                <div className="font-mono text-xs space-y-1.5">
                  <div className="flex gap-3">
                    <span className="text-[#e53888]">team_nodes</span>
                    <span className={textMuted}>[{teamMembers.length}]</span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-[#e53888]">status</span>
                    <span className={`${textMuted} flex items-center gap-1.5`}>
                      online <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    </span>
                  </div>
                  <div className="flex gap-3 items-center">
                    <span className="text-[#e53888]">location</span>
                    <span className={textMuted}>global</span>
                  </div>
                </div>

                {/* Hover hint */}
                <div className="flex items-start gap-2 text-[#e53888] pt-2">
                  <span className="font-mono text-xs mt-0.5">&gt;</span>
                  <div className="font-mono text-xs leading-relaxed">
                    hover over a face to<br />learn more
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right side - Scattered circular photos */}
            <div className="lg:w-2/3 relative min-h-[500px] lg:min-h-[600px]">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="absolute cursor-pointer group"
                  style={{
                    top: member.position.top,
                    left: member.position.left,
                    width: member.size,
                    height: member.size,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={(e) => handleMemberHover(e, member)}
                  onMouseLeave={handleMemberLeave}
                  onClick={(e) => handleMemberClick(e, member)}
                >
                  {/* Circle photo container */}
                  <div
                    className="w-full h-full rounded-full overflow-hidden border-4 border-white/80 shadow-2xl transition-transform duration-300 group-hover:scale-110 relative"
                    style={{ backgroundColor: member.defaultColor }}
                  >
                    {"photo" in member && member.photo ? (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-center grayscale"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-bold text-3xl lg:text-4xl tracking-wide">
                          {member.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name label on hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: selectedMember?.id === member.id ? 1 : 0, y: selectedMember?.id === member.id ? 0 : 8 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  >
                    <span className={`font-mono text-xs ${textColor}`}>{member.name}</span>
                  </motion.div>
                </motion.div>
              ))}

              {/* Decorative code element */}
              <div className={`absolute bottom-0 right-0 ${isDarkBg ? "text-white/10" : "text-[#e53888]/10"} text-8xl font-mono font-bold hidden lg:block`}>
                {"</>"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal info card - shows when clicking */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, x: 20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 10, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-72 bg-[#0f0f0f]/95 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 shadow-2xl"
            style={{
              left: terminalPosition.x,
              top: terminalPosition.y,
            }}
            // onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal title bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 font-mono text-xs text-white/40">
                $ cat team/{selectedMember.file}.txt
              </span>
            </div>
            
            <div className="px-4 py-4 font-mono text-sm space-y-3">
              <div>
                <span className="text-[#e53888] font-bold uppercase tracking-wide">{selectedMember.name}</span>
                <div className="text-white/50 text-xs mt-0.5">{selectedMember.role}</div>
                <div className="w-10 h-0.5 bg-[#e53888]/60 mt-2" />
              </div>
              
              <p className="text-white/60 leading-relaxed text-xs">{selectedMember.bio}</p>
              
              <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs">
                <div>
                  <span className="text-[#e53888]">location</span>
                  <span className="text-white/50">: {selectedMember.location}</span>
                </div>
                <div>
                  <span className="text-[#e53888]">loves</span>
                  <span className="text-white/50">: {selectedMember.loves}</span>
                </div>
                <div>
                  <span className="text-[#e53888]">superpower</span>
                  <span className="text-white/50">: {selectedMember.superpower}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom tagline bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className={`border-t ${borderColor} py-6 relative z-10`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3">
          <div className={`hidden sm:flex gap-1 ${textSubtle} font-mono text-xs`}>
            {[...Array(10)].map((_, i) => <span key={i}>·</span>)}
          </div>
          <p className={`font-mono text-sm ${textSubtle}`}>
            // building. testing. learning.{" "}
            <span className="text-[#e53888]">together.</span>
          </p>
          <div className={`hidden sm:flex gap-1 ${textSubtle} font-mono text-xs`}>
            {[...Array(10)].map((_, i) => <span key={i}>·</span>)}
          </div>
        </div>
      </motion.div>

      <Footer />
      </main>
    </>
  )
}
