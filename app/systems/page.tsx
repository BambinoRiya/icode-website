import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getAllSystems } from '@/lib/systems-data'
import { SystemsPageClient } from '@/components/systems-page-client'

export default async function SystemsPage() {
  const systems = await getAllSystems()

  return (
    <main className="min-h-screen">
      <Navbar />
      <SystemsPageClient systems={systems} />
      <Footer />
    </main>
  )
}
