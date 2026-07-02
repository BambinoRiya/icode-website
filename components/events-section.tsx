import { getAllPublishedEvents } from "@/lib/events-data"
import { EventsSectionClient } from "./events-section-client"

export async function EventsSection() {
  const events = await getAllPublishedEvents()
  return <EventsSectionClient events={events} />
}
