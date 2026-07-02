"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import type { System } from "@/lib/systems-data"

export function SystemsSectionClient({ systems }: { systems: System[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="systems" className="py-24 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16"
        >
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Systems</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
              Practical tools built where evidence, education, and AI meet.
            </p>
          </div>

          <Link
            href="/systems"
            className="text-sm text-[#0d9488] font-medium hover:underline flex items-center gap-1 justify-center sm:justify-start shrink-0"
          >
            View all systems
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((system, index) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link href={`/systems/${system.slug}`} className="block h-full">
                <div className="group relative h-full bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#0d9488]/10 hover:border-[#0d9488]/30">
                  {/* Alternating top border - pink and teal */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                    index % 2 === 0
                      ? 'from-[#e53888] to-[#e53888]/60'
                      : 'from-[#0d9488] to-[#0d9488]/60'
                  }`} />

                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl transition-colors duration-300 ${
                        index % 2 === 0
                          ? 'bg-[#fff0f7] group-hover:bg-[#e53888]/10'
                          : 'bg-[#f0fdf9] group-hover:bg-[#0d9488]/10'
                      }`}>
                        {system.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground">{system.title}</h3>
                        <p className={`text-sm font-medium ${index % 2 === 0 ? 'text-[#e53888]' : 'text-[#0d9488]'}`}>
                          {system.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {system.description}
                    </p>

                    {system.link ? (
                      <a
                        href={system.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          index % 2 === 0
                            ? 'text-[#e53888] bg-[#fff0f7] hover:bg-[#e53888] hover:text-white'
                            : 'text-[#0d9488] bg-[#f0fdf9] hover:bg-[#0d9488] hover:text-white'
                        }`}
                      >
                        Launch
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </a>
                    ) : (
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                        index % 2 === 0
                          ? 'text-[#e53888] bg-[#fff0f7]'
                          : 'text-[#0d9488] bg-[#f0fdf9]'
                      }`}>
                        Learn more
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
