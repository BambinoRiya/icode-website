'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  CATEGORY_LABELS,
  formatDateRange,
  splitUpcomingAndPast,
  type EventCategory,
  type EventItem,
} from '@/lib/events-data'
import { EventCountdown } from '@/components/event-countdown'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'

interface EventsPageClientProps {
  events: EventItem[]
}

const FILTERS: Array<{ value: EventCategory | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'bootcamp', label: 'Bootcamps' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'workshop', label: 'Workshops' },
]

export function EventsPageClient({ events }: EventsPageClientProps) {
  const [filter, setFilter] = useState<EventCategory | 'all'>('all')

  const { upcoming, past } = useMemo(() => splitUpcomingAndPast(events), [events])
  const featured = upcoming[0]

  const filteredUpcoming = useMemo(
    () => (filter === 'all' ? upcoming : upcoming.filter((e) => e.category === filter)),
    [upcoming, filter]
  )
  const filteredPast = useMemo(
    () => (filter === 'all' ? past : past.filter((e) => e.category === filter)),
    [past, filter]
  )

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-1 bg-white border border-border rounded-full px-4 py-2 text-sm font-mono mb-6 shadow-sm">
              <span className="text-foreground/70">const nextEvent = </span>
              <span className="text-[#e53888]">"events.init()"</span>
              <span className="text-foreground/70">;</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight mb-4">
              Events that <span className="text-[#e53888]">build, teach,</span> and connect.
            </h1>
            <p className="text-lg text-muted-foreground">
              Bootcamps, hackathons, and workshops where the systems get built.
            </p>
          </motion.div>

          {/* Featured / next event */}
          {featured && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-2xl border border-border shadow-sm p-6 mb-8"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <p className="text-xs font-mono text-[#e53888] mb-2">status: "upcoming"</p>
                  <h2 className="text-xl font-bold text-foreground mb-1">{featured.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDateRange(featured.startDate, featured.endDate)}
                    {featured.location && ` · ${featured.location}`}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <EventCountdown targetDate={featured.startDate} />
                  {featured.registrationUrl ? (
                    <a
                      href={featured.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e53888] text-white rounded-full text-sm font-medium hover:bg-[#d12d77] transition-colors shrink-0"
                    >
                      Register
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground shrink-0">Registration opening soon</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-foreground text-white'
                    : 'bg-white border border-border text-foreground hover:border-foreground'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Upcoming timeline */}
          {filteredUpcoming.length > 0 && (
            <div className="mb-12">
              <p className="text-sm font-mono text-muted-foreground mb-6">// upcoming</p>
              <div className="space-y-8 border-l-2 border-[#e53888]/30 pl-6 relative">
                {filteredUpcoming.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative -left-[calc(1.5rem+5px)] pl-[calc(1.5rem+5px)]"
                  >
                    <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-[#e53888]" />
                    <p className="text-sm font-mono text-[#e53888] mb-1">
                      {formatDateRange(event.startDate, event.endDate)}
                    </p>
                    <h3 className="text-lg font-bold text-foreground mb-1">{event.title}</h3>
                    {event.description && (
                      <p className="text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                    )}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-[#fff0f7] text-[#e53888]">
                      &lt;{CATEGORY_LABELS[event.category]} /&gt;
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Past events */}
          {filteredPast.length > 0 && (
            <div>
              <p className="text-sm font-mono text-muted-foreground mb-6">// past</p>
              <div className="bg-white rounded-2xl border border-border divide-y divide-border overflow-hidden">
                {filteredPast.map((event) => (
                  <div key={event.id} className="flex items-center justify-between px-6 py-4">
                    <span className="text-foreground font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatDateRange(event.startDate, event.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredUpcoming.length === 0 && filteredPast.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {events.length === 0 ? 'No events yet — check back soon.' : 'No events found with this filter.'}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
