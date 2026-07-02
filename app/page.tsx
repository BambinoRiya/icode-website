import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SystemsSection } from "@/components/systems-section"
import { EventsSection } from "@/components/events-section"
import { FieldNotesSection } from "@/components/field-notes-section"
import { LiveModeSection } from "@/components/live-mode-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <HeroSection />
      <SystemsSection />
      <EventsSection />
      <FieldNotesSection />
      <LiveModeSection />
      <Footer />
    </main>
  )
}
