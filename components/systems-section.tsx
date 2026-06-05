"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const systems = [
  {
    title: "MamaMath",
    subtitle: "Learning System",
    description: "AI-assisted lesson planning, learner-work analysis, and remediation support for early-grade mathematics.",
    link: "https://mamamath.org/",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: "Transfer Model",
    subtitle: "Decision Intelligence System",
    description: "AI-supported transferability scoring to help understand whether interventions fit new contexts.",
    link: "#",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    title: "DESTINY Tools",
    subtitle: "Evidence Innovation System",
    description: "Digital evidence synthesis tools supporting living evidence, climate-health research, and smarter decision-making.",
    link: "#",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
]

export function SystemsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="systems" className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Systems</h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg">
            Practical tools built where evidence, education, and AI meet.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <motion.div
              key={system.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="group relative h-full bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#0d9488]/10 hover:border-[#0d9488]/30">
                {/* Alternating top border - pink and teal */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  index % 2 === 0 
                    ? 'from-[#e53888] to-[#e53888]/60' 
                    : 'from-[#0d9488] to-[#0d9488]/60'
                }`} />
                
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl transition-colors duration-300 ${
                      index % 2 === 0
                        ? 'bg-[#fff0f7] text-[#e53888] group-hover:bg-[#e53888] group-hover:text-white'
                        : 'bg-[#f0fdf9] text-[#0d9488] group-hover:bg-[#0d9488] group-hover:text-white'
                    }`}>
                      {system.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{system.title}</h3>
                      <p className={`text-sm font-medium ${index % 2 === 0 ? 'text-[#e53888]' : 'text-[#0d9488]'}`}>{system.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {system.description}
                  </p>

                  <a href={system.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    index % 2 === 0
                      ? 'text-[#e53888] bg-[#fff0f7] hover:bg-[#e53888] hover:text-white'
                      : 'text-[#0d9488] bg-[#f0fdf9] hover:bg-[#0d9488] hover:text-white'
                  }`}>
                    Launch
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
