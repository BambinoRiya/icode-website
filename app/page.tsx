import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { SystemsSection } from "@/components/systems-section"
import { LabSection } from "@/components/lab-section"
import { FieldNotesSection } from "@/components/field-notes-section"
import { LiveModeSection } from "@/components/live-mode-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAF7]">
      <Navbar />
      <HeroSection />
      <SystemsSection />
      <LabSection />
      <FieldNotesSection />
      <LiveModeSection />
      <Footer />
    </main>
  )
}
