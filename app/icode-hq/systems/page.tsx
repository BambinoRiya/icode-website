'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  Layers,
  CheckCircle2,
  PencilLine,
  Trash2,
  ExternalLink,
  Plus,
  Search,
  LogOut,
  Inbox,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface SystemRow {
  id: string
  title: string
  slug: string
  subtitle: string
  status: 'live' | 'building' | 'exploring'
  progress: number
  is_published: boolean
}

const STATUS_STYLES: Record<SystemRow['status'], string> = {
  live: 'bg-[#0d9488]/10 text-[#0d9488]',
  building: 'bg-blue-100 text-blue-700',
  exploring: 'bg-amber-100 text-amber-700',
}

const STATUS_LABELS: Record<SystemRow['status'], string> = {
  live: 'Live',
  building: 'Building',
  exploring: 'Exploring',
}

export default function AdminSystemsPage() {
  const [systems, setSystems] = useState<SystemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/icode-hq/login')
        return
      }

      setUser(user)
      fetchSystems()
    }

    checkAuth()
  }, [router, supabase])

  async function fetchSystems() {
    try {
      const { data, error } = await supabase
        .from('systems')
        .select('id, title, slug, subtitle, status, progress, is_published')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSystems(data || [])
    } catch (err) {
      console.error('Error fetching systems:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteSystem(id: string) {
    if (!confirm('Are you sure you want to delete this system?')) return

    try {
      const { error } = await supabase.from('systems').delete().eq('id', id)
      if (error) throw error
      setSystems(systems.filter((s) => s.id !== id))
    } catch (err) {
      console.error('Error deleting system:', err)
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const { error } = await supabase
        .from('systems')
        .update({ is_published: !isPublished })
        .eq('id', id)

      if (error) throw error
      setSystems(systems.map((s) => (s.id === id ? { ...s, is_published: !isPublished } : s)))
    } catch (err) {
      console.error('Error updating system:', err)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/icode-hq/login')
  }

  const filteredSystems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return systems
    return systems.filter(
      (s) => s.title.toLowerCase().includes(q) || s.subtitle?.toLowerCase().includes(q)
    )
  }, [systems, query])

  const publishedCount = systems.filter((s) => s.is_published).length
  const draftCount = systems.length - publishedCount

  const userInitial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#0d9488]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Systems CMS</h1>
            <p className="text-muted-foreground mt-1">Manage what's on the Systems page</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <Avatar className="size-8">
                <AvatarFallback className="bg-[#0d9488]/10 text-[#0d9488] text-sm font-medium">
                  {userInitial}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Section switcher */}
        <div className="flex items-center gap-1 mb-8 bg-muted/60 rounded-lg p-1 w-fit">
          <Link
            href="/icode-hq/dashboard"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Field Notes
          </Link>
          <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-foreground shadow-sm">
            Systems
          </span>
          <Link
            href="/icode-hq/events"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Events
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center shrink-0">
                <Layers className="size-5 text-[#0d9488]" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{systems.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Total systems</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="size-5 text-[#0d9488]" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{publishedCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-[#e53888]/10 flex items-center justify-center shrink-0">
                <PencilLine className="size-5 text-[#e53888]" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{draftCount}</p>
                )}
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search systems..."
              className="pl-9"
            />
          </div>
          <Button asChild className="bg-[#0d9488] hover:bg-[#0a7a6e] text-white shrink-0">
            <Link href="/icode-hq/systems/new">
              <Plus className="size-4" />
              New System
            </Link>
          </Button>
        </div>

        {/* Systems Table */}
        <Card className="p-0 overflow-hidden gap-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : systems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Inbox className="size-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">No systems yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add the first system to show on the public Systems page.
              </p>
              <Button asChild className="bg-[#0d9488] hover:bg-[#0a7a6e] text-white">
                <Link href="/icode-hq/systems/new">
                  <Plus className="size-4" />
                  Create your first system
                </Link>
              </Button>
            </div>
          ) : filteredSystems.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No systems match "{query}"</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSystems.map((system) => (
                  <TableRow key={system.id}>
                    <TableCell className="whitespace-normal">
                      <p className="font-medium text-foreground">{system.title}</p>
                      {system.subtitle && (
                        <p className="text-sm text-muted-foreground">{system.subtitle}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-normal border-transparent ${STATUS_STYLES[system.status]}`}>
                        {STATUS_LABELS[system.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{system.progress}%</TableCell>
                    <TableCell>
                      <button
                        onClick={() => togglePublish(system.id, system.is_published)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          system.is_published
                            ? 'bg-[#0d9488]/10 text-[#0d9488] hover:bg-[#0d9488]/20'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {system.is_published ? 'Published' : 'Draft'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {system.is_published && (
                          <Button variant="ghost" size="icon-sm" asChild>
                            <a
                              href={`/systems/${system.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="View live"
                            >
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/icode-hq/systems/${system.id}`} title="Edit">
                            <PencilLine className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteSystem(system.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </main>
  )
}
