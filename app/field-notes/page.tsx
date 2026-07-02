import { getPublishedArticles } from "@/lib/articles"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Field Notes | iCODE Abakwa",
  description: "Build logs, reflections, and lessons from the iCODE Abakwa team",
}

export default async function FieldNotesPage() {
  const articles = await getPublishedArticles()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#e53888 1px, transparent 1px), linear-gradient(90deg, #e53888 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8">
            <div className="inline-block mb-4">
              <span className="px-4 py-1.5 rounded-full bg-[#fff0f7] text-[#e53888] text-sm font-semibold">
                FIELD NOTES
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-4 text-balance">
              Build Logs & Reflections
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl text-balance">
              Real experiences building intentional technology for African contexts
            </p>
          </div>

          {/* Terminal style info */}
          <div className="mt-8 text-sm text-muted-foreground font-mono">
            <span className="text-[#e53888]">{`>`}</span> {articles.length} published articles · last updated {articles[0]?.date || 'today'}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No articles published yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <div key={article.id} className="group">
                  <Link href={`/field-notes/${article.slug}`}>
                    {/* Image */}
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                      <Image
                        src={article.featured_image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-[#e53888]/0 group-hover:bg-[#e53888]/20 transition-colors duration-300" />
                      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#e53888] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Category */}
                    <p className="text-[#e53888] text-xs font-semibold tracking-wider mb-2">
                      {article.category}
                    </p>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-[#e53888] transition-colors leading-tight">
                      {article.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
                      {article.description}
                    </p>
                    
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.read_time}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
