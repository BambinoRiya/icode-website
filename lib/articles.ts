import { createClient } from '@/lib/supabase/server'

export interface FieldNote {
  id: string
  slug: string
  title: string
  description: string
  category: string
  date: string
  read_time: string
  featured_image_url: string
  body_content: any[]
  is_published: boolean
  created_at: string
  updated_at: string
}

// Fallback data for development
const FALLBACK_ARTICLES: FieldNote[] = [
  {
    id: '1',
    slug: 'testing-mamamath-in-real-classrooms',
    title: 'Testing MamaMath in Real Classrooms in Bamenda',
    category: 'AI & EDUCATION',
    date: '2024-04-28',
    read_time: '6 min read',
    description: 'We took our AI-powered tutor into two schools in Bamenda to see how it holds up in the wild. Here&apos;s what surprised us.',
    featured_image_url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=60',
    body_content: [],
    is_published: true,
    created_at: '2024-04-28T00:00:00Z',
    updated_at: '2024-04-28T00:00:00Z',
  },
  {
    id: '2',
    slug: 'why-context-matters-in-ai',
    title: 'Why Context Matters in AI',
    category: 'AI & EDUCATION',
    date: '2024-04-24',
    read_time: '5 min read',
    description: 'Building tools that understand the learner, not just the language. How we&apos;re rethinking AI education for African classrooms.',
    featured_image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60',
    body_content: [],
    is_published: true,
    created_at: '2024-04-24T00:00:00Z',
    updated_at: '2024-04-24T00:00:00Z',
  },
  {
    id: '3',
    slug: 'transferability-robot-logs',
    title: 'Transferability Robot v0.3.0 - What&apos;s New',
    category: 'BUILD LOGS',
    date: '2024-04-20',
    read_time: '4 min read',
    description: 'Notes from our early experiments in autonomous systems and what we learned building the transfer model.',
    featured_image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60',
    body_content: [],
    is_published: true,
    created_at: '2024-04-20T00:00:00Z',
    updated_at: '2024-04-20T00:00:00Z',
  },
]

export async function getPublishedArticles(): Promise<FieldNote[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('field_notes')
      .select('*')
      .eq('is_published', true)
      .order('date', { ascending: false })

    if (error) {
      console.error('Error fetching articles:', error)
      return FALLBACK_ARTICLES
    }

    return data || FALLBACK_ARTICLES
  } catch (err) {
    console.error('Error in getPublishedArticles:', err)
    return FALLBACK_ARTICLES
  }
}

export async function getArticleBySlug(slug: string): Promise<FieldNote | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('field_notes')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error) {
      console.error('Error fetching article:', error)
      // Try to find in fallback data
      return FALLBACK_ARTICLES.find((a) => a.slug === slug) || null
    }

    return data
  } catch (err) {
    console.error('Error in getArticleBySlug:', err)
    return FALLBACK_ARTICLES.find((a) => a.slug === slug) || null
  }
}
