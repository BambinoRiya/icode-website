'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { formatDateRange, splitUpcomingAndPast, type EventItem } from '@/lib/events-data'
import { EventCountdown } from '@/components/event-countdown'

export function EventsSectionClient({ events }: { events: EventItem[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const { upcoming } = splitUpcomingAndPast(events)
  const featured = upcoming[0]

  return (
    <section id="events" className="py-24 bg-gradient-to-b from-transparent via-[#fff0f7]/30 to-transparent" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Events that <span className="text-[#e53888]">build, teach,</span> and connect
            </h2>
            <p className="text-muted-foreground text-lg">
              Bootcamps, hackathons, and workshops where the systems get built.
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm text-[#e53888] font-medium hover:underline flex items-center gap-1 shrink-0"
          >
            All events
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {featured ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Link href="/events">
              <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg hover:border-[#e53888]/30 transition-all duration-300 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div>
                    <p className="text-xs font-mono text-[#e53888] mb-2">status: "upcoming"</p>
                    <h3 className="text-xl font-bold text-foreground mb-1">{featured.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(featured.startDate, featured.endDate)}
                      {featured.location && ` · ${featured.location}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <EventCountdown targetDate={featured.startDate} />
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e53888] text-white rounded-full text-sm font-medium shrink-0">
                      Details
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="bg-white rounded-2xl border border-border p-8 text-center"
          >
            <p className="text-muted-foreground">No upcoming events right now — check back soon.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
