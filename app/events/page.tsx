import { getAllPublishedEvents } from '@/lib/events-data'
import { EventsPageClient } from '@/components/events-page-client'

export const metadata = {
  title: 'Events | iCODE Abakwa',
  description: 'Bootcamps, hackathons, and workshops where the systems get built.',
}

export default async function EventsPage() {
  const events = await getAllPublishedEvents()

  return <EventsPageClient events={events} />
}
