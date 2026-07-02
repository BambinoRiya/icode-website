'use client'

import { useEffect, useState } from 'react'

interface EventCountdownProps {
  targetDate: string
}

function getTimeParts(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isPast: true }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return { days, hours, minutes, isPast: false }
}

export function EventCountdown({ targetDate }: EventCountdownProps) {
  const [parts, setParts] = useState(() => getTimeParts(targetDate))

  useEffect(() => {
    const interval = setInterval(() => setParts(getTimeParts(targetDate)), 1000 * 30)
    return () => clearInterval(interval)
  }, [targetDate])

  if (parts.isPast) {
    return <span className="text-sm font-medium text-muted-foreground">Happening now</span>
  }

  return (
    <div className="flex items-center gap-4">
      {[
        { value: parts.days, label: 'days' },
        { value: parts.hours, label: 'hrs' },
        { value: parts.minutes, label: 'min' },
      ].map((part) => (
        <div key={part.label} className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-[#e53888] font-mono tabular-nums">
            {String(part.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-muted-foreground">{part.label}</div>
        </div>
      ))}
    </div>
  )
}
