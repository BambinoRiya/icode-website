'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { System, SystemStatus } from '@/lib/systems-data'

interface SystemsPageClientProps {
  systems: System[]
}

export function SystemsPageClient({ systems }: SystemsPageClientProps) {
  const [selectedFilter, setSelectedFilter] = useState<SystemStatus | 'all'>('all')

  const filters: Array<{ value: SystemStatus | 'all'; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'live', label: 'Live' },
    { value: 'building', label: 'In progress' },
    { value: 'exploring', label: 'Exploring' },
  ]

  const filteredSystems =
    selectedFilter === 'all' ? systems : systems.filter((s) => s.status === selectedFilter)

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case 'live':
        return 'bg-green-100 text-green-700'
      case 'building':
        return 'bg-blue-100 text-blue-700'
      case 'exploring':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: SystemStatus) => {
    switch (status) {
      case 'live':
        return 'Live'
      case 'building':
        return 'Building'
      case 'exploring':
        return 'Exploring'
      default:
        return status
    }
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-4">Systems</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Every tool we're building, and where it stands right now.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter.value
                    ? 'bg-foreground text-white'
                    : 'bg-white border border-border text-foreground hover:border-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* System Count */}
        <div className="mb-8 text-sm text-muted-foreground">
          {filteredSystems.length} system{filteredSystems.length !== 1 ? 's' : ''}
        </div>

        {/* Systems Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredSystems.map((system, index) => (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/systems/${system.slug}`}>
                <div className="group h-full bg-white rounded-2xl border border-border p-6 hover:shadow-lg hover:border-foreground/20 transition-all duration-300 cursor-pointer">
                  {/* Icon and Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="text-4xl">{system.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(system.status)}`}>
                      {getStatusLabel(system.status)}
                    </span>
                  </div>

                  {/* Title and Subtitle */}
                  <h3 className="text-2xl font-bold text-foreground mb-1">{system.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{system.subtitle}</p>

                  {/* Description */}
                  <p className="text-foreground/70 leading-relaxed mb-6">{system.description}</p>

                  {/* Progress Bar */}
                  <div className="w-full bg-border rounded-full h-1.5 mb-6">
                    <div
                      className="bg-gradient-to-r from-[#e53888] to-[#0d9488] h-full rounded-full transition-all duration-300"
                      style={{ width: `${system.progress}%` }}
                    />
                  </div>

                  {/* Footer Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Updated recently</span>
                    {system.link && (
                      <a
                        href={system.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#0d9488] hover:text-[#0a7a6e] font-medium"
                      >
                        Launch ↗
                      </a>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredSystems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No systems found with this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
