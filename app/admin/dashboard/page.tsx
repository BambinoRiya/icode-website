'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface FieldNote {
  id: string
  title: string
  slug: string
  category: string
  date: string
  is_published: boolean
}

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<FieldNote[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/admin/login')
        return
      }

      setUser(user)
      fetchArticles()
    }

    checkAuth()
  }, [router, supabase])

  async function fetchArticles() {
    try {
      const { data, error } = await supabase
        .from('field_notes')
        .select('id, title, slug, category, date, is_published')
        .order('date', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteArticle(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return

    try {
      const { error } = await supabase.from('field_notes').delete().eq('id', id)
      if (error) throw error
      setArticles(articles.filter((a) => a.id !== id))
    } catch (err) {
      console.error('Error deleting article:', err)
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const { error } = await supabase
        .from('field_notes')
        .update({ is_published: !isPublished })
        .eq('id', id)

      if (error) throw error
      setArticles(
        articles.map((a) => (a.id === id ? { ...a, is_published: !isPublished } : a))
      )
    } catch (err) {
      console.error('Error updating article:', err)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Field Notes CMS</h1>
            <p className="text-muted-foreground mt-2">Manage your articles</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Create Button */}
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0d9488] text-white font-medium hover:bg-[#0a7a6e] transition-colors mb-6"
        >
          <span>+</span>
          New Article
        </Link>

        {/* Articles Table */}
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          {articles.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No articles yet</p>
              <Link
                href="/admin/articles/new"
                className="text-[#0d9488] hover:underline font-medium"
              >
                Create your first article
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-border bg-muted">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Title</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Category</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Date</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Status</th>
                  <th className="text-left px-6 py-3 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/50">
                    <td className="px-6 py-4 text-foreground font-medium">{article.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">{article.category}</td>
                    <td className="px-6 py-4 text-muted-foreground">{article.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(article.id, article.is_published)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          article.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {article.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="text-[#0d9488] hover:underline font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="text-red-600 hover:underline font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
