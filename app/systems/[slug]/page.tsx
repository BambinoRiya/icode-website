import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getSystemBySlug } from '@/lib/systems-data'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const system = await getSystemBySlug(params.slug)

  if (!system) {
    return {
      title: 'System not found',
    }
  }

  return {
    title: system.title,
    description: system.description,
  }
}

export default async function SystemDetailPage(props: PageProps) {
  const params = await props.params
  const system = await getSystemBySlug(params.slug)

  if (!system) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-[#0d9488]/10 text-[#0d9488]'
      case 'building':
        return 'bg-[#e53888]/10 text-[#e53888]'
      case 'exploring':
        return 'bg-[#0d9488]/5 text-[#6b6b75]'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusLabel = (status: string) => {
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

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓'
      case 'in-progress':
        return '◑'
      case 'not-started':
        return '○'
      default:
        return '◯'
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/systems" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Systems
          </Link>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{system.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(system.status)}`}>
                    {getStatusLabel(system.status)}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  {system.subtitle} · started {system.status === 'live' ? 'now' : 'Q4 2025'}
                </p>
              </div>

              {/* More Options */}
              <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zM12 12a2 2 0 11-4 0 2 2 0 014 0zM16 14a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">{system.fullDescription}</p>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 py-8 border-y border-border">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Progress</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{system.progress}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Team</p>
                <span className="text-3xl font-bold text-foreground">{system.teamSize}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Target launch</p>
                <span className="text-3xl font-bold text-foreground">{system.targetLaunch}</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Milestones</h2>
            <div className="space-y-4">
              {system.milestones.map((milestone) => (
                <div key={milestone.id} className="flex gap-4 items-start">
                  <div
                    className={`text-xl flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mt-0.5 ${
                      milestone.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : milestone.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {getMilestoneIcon(milestone.status)}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.status === 'completed' ? 'text-foreground' : 'text-foreground/70'}`}>
                      {milestone.title}
                    </p>
                    {milestone.date && (
                      <p className="text-sm text-muted-foreground">
                        {milestone.status === 'completed' ? 'Completed' : milestone.status === 'in-progress' ? 'In progress' : 'Not started'}{' '}
                        {milestone.date}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest Updates */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Latest updates</h2>
            <div className="space-y-6 border-l-2 border-border pl-6 relative">
              {system.updates.map((update) => (
                <div key={update.id} className="relative -left-8">
                  <div className="w-4 h-4 bg-white border-2 border-[#e53888] rounded-full absolute left-0 top-1 mt-px" />
                  <p className="text-sm text-muted-foreground mb-2">{update.date}</p>
                  <p className="text-foreground">{update.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {system.link && (
              <a
                href={system.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white border border-border rounded-full text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-colors"
              >
                Launch {system.status === 'live' ? '↗' : '(not yet public)'}
              </a>
            )}
            <button className="px-6 py-3 bg-white border border-border rounded-full text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-colors">
              Follow updates
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
