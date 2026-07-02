import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type EventCategory = 'bootcamp' | 'hackathon' | 'workshop'

export interface EventItem {
  id: string
  slug: string
  title: string
  description: string
  category: EventCategory
  startDate: string
  endDate: string | null
  location: string
  registrationUrl: string | null
  isPublished: boolean
}

function mapRow(row: any): EventItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? '',
    category: row.category,
    startDate: row.start_date,
    endDate: row.end_date,
    location: row.location ?? '',
    registrationUrl: row.registration_url ?? null,
    isPublished: row.is_published,
  }
}

export async function getAllPublishedEvents(): Promise<EventItem[]> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return []
    }

    return (data || []).map(mapRow)
  } catch (err) {
    console.error('Error in getAllPublishedEvents:', err)
    return []
  }
}

/** An event is "upcoming" until its end date (or start date, if no end date) has passed. */
export function isUpcoming(event: EventItem, now: Date = new Date()): boolean {
  const reference = event.endDate ?? event.startDate
  return new Date(reference).getTime() >= now.getTime()
}

export function splitUpcomingAndPast(events: EventItem[], now: Date = new Date()) {
  const upcoming = events
    .filter((e) => isUpcoming(e, now))
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  const past = events
    .filter((e) => !isUpcoming(e, now))
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  return { upcoming, past }
}

export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate)
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
  const startYear = start.getFullYear()

  if (!endDate) {
    return `${startMonth} ${start.getDate()}, ${startYear}`
  }

  const end = new Date(endDate)
  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()

  if (sameMonth) {
    return `${startMonth} ${start.getDate()}-${end.getDate()}, ${startYear}`
  }

  const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
  return `${startMonth} ${start.getDate()}, ${startYear} - ${endMonth} ${end.getDate()}, ${end.getFullYear()}`
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  bootcamp: 'Bootcamp',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
}
