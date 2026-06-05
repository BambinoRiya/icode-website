"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

type Article = {
  id: string
  slug: string
  title: string
  category: string | null
  date: string | null
  read_time: string | null
  description: string | null
  featured_image_url: string | null
}

export function FieldNotesSectionClient({ articles }: { articles: Article[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="field-notes" className="py-24" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Field Notes
            </h2>
            <p className="text-muted-foreground text-lg">
              Build logs, reflections, and lessons from the team.
            </p>
          </div>

          <Link
            href="/field-notes"
            className="text-sm text-[#e53888] font-medium hover:underline flex items-center gap-1"
          >
            View all articles
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group"
            >
              <Link href={`/field-notes/${article.slug}`}>
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-muted">
                  <Image
                    src={article.featured_image_url || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#e53888]/0 group-hover:bg-[#e53888]/20 transition-colors duration-300" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#e53888] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <p className="text-[#e53888] text-xs font-semibold tracking-wider mb-2">
                  {article.category || "FIELD NOTE"}
                </p>

                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-[#e53888] transition-colors leading-tight">
                  {article.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                  {article.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.read_time}</span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}