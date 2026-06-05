"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const projects = [
  {
    title: "STEM Bootcamps",
    location: "Cameroon",
    status: "Active",
    statusColor: "bg-green-500",
    description: "Hands-on coding bootcamps for students across Cameroon.",
  },
  {
    title: "ChatGuru Experimental Model",
    status: "Building",
    statusColor: "bg-[#e53888]",
    description: "AI conversation model for educational contexts.",
  },
  {
    title: "Smart Health Alerts",
    location: "Ghana",
    status: "Exploring",
    statusColor: "bg-amber-500",
    description: "Early warning health notification systems.",
  },
]

export function LabSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="lab" className="py-24 bg-gradient-to-b from-transparent via-[#fff0f7]/30 to-transparent" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">The Lab</h2>
              <span className="text-sm text-muted-foreground font-mono">
                {projects.length} Projects
              </span>
            </div>
            <p className="text-muted-foreground text-lg">
              Experiments, prototypes, and systems in motion.
            </p>
          </div>
          <a
            href="#"
            className="text-sm text-[#e53888] font-medium hover:underline flex items-center gap-1"
          >
            All projects
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="group h-full bg-gradient-to-br from-white to-[#fff0f7]/50 rounded-2xl border border-border p-6 transition-all duration-300 hover:shadow-xl hover:shadow-[#e53888]/10 hover:border-[#e53888]/30">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${project.statusColor}`}>
                    {project.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-foreground mb-1">{project.title}</h3>
                {project.location && (
                  <p className="text-sm text-[#e53888] mb-3">{project.location}</p>
                )}
                
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-[#e53888] hover:underline">
                    Learn
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  <span className="text-xs text-muted-foreground font-mono">
                    In progress
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
