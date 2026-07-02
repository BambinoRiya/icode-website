import { getAllSystems } from "@/lib/systems-data"
import { SystemsSectionClient } from "./systems-section-client"

export async function SystemsSection() {
  const systems = await getAllSystems()
  const featuredSystems = systems.slice(0, 3)

  return <SystemsSectionClient systems={featuredSystems} />
}
