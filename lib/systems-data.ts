import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type SystemStatus = 'live' | 'building' | 'exploring'

export interface Milestone {
  id: string
  title: string
  status: 'completed' | 'in-progress' | 'not-started'
  date?: string
}

export interface Update {
  id: string
  date: string
  content: string
}

export interface System {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  fullDescription: string
  status: SystemStatus
  icon: string
  progress: number
  teamSize: number
  targetLaunch: string
  milestones: Milestone[]
  updates: Update[]
  link?: string
  isPublished: boolean
}

function mapRow(row: any): System {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? '',
    description: row.description ?? '',
    fullDescription: row.full_description ?? '',
    status: row.status,
    icon: row.icon ?? '🛠️',
    progress: row.progress ?? 0,
    teamSize: row.team_size ?? 1,
    targetLaunch: row.target_launch ?? '',
    milestones: row.milestones ?? [],
    updates: row.updates ?? [],
    link: row.link ?? undefined,
    isPublished: row.is_published,
  }
}

export async function getAllSystems(): Promise<System[]> {
  try {
    const { data, error } = await supabase
      .from('systems')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching systems:', error)
      return []
    }

    return (data || []).map(mapRow)
  } catch (err) {
    console.error('Error in getAllSystems:', err)
    return []
  }
}

export async function getSystemBySlug(slug: string): Promise<System | null> {
  try {
    const { data, error } = await supabase
      .from('systems')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching system:', error)
      return null
    }

    return data ? mapRow(data) : null
  } catch (err) {
    console.error('Error in getSystemBySlug:', err)
    return null
  }
}
