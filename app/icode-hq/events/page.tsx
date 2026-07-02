'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  CalendarDays,
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
import { CATEGORY_LABELS, formatDateRange, type EventCategory } from '@/lib/events-data'

interface EventRow {
  id: string
  title: string
  category: EventCategory
  start_date: string
  end_date: string | null
  is_published: boolean
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([])
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
      fetchEvents()
    }

    checkAuth()
  }, [router, supabase])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, category, start_date, end_date, is_published')
        .order('start_date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { error } = await supabase.from('events').delete().eq('id', id)
      if (error) throw error
      setEvents(events.filter((e) => e.id !== id))
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }

  async function togglePublish(id: string, isPublished: boolean) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ is_published: !isPublished })
        .eq('id', id)

      if (error) throw error
      setEvents(events.map((e) => (e.id === id ? { ...e, is_published: !isPublished } : e)))
    } catch (err) {
      console.error('Error updating event:', err)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/icode-hq/login')
  }

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return events
    return events.filter((e) => e.title.toLowerCase().includes(q))
  }, [events, query])

  const publishedCount = events.filter((e) => e.is_published).length
  const draftCount = events.length - publishedCount

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
            <h1 className="text-3xl font-bold text-foreground">Events CMS</h1>
            <p className="text-muted-foreground mt-1">Manage bootcamps, hackathons, and workshops</p>
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
          <Link
            href="/icode-hq/systems"
            className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Systems
          </Link>
          <span className="px-3 py-1.5 rounded-md text-sm font-medium bg-white text-foreground shadow-sm">
            Events
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4">
              <div className="size-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center shrink-0">
                <CalendarDays className="size-5 text-[#0d9488]" />
              </div>
              <div>
                {loading ? (
                  <Skeleton className="h-7 w-10" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{events.length}</p>
                )}
                <p className="text-sm text-muted-foreground">Total events</p>
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
              placeholder="Search events..."
              className="pl-9"
            />
          </div>
          <Button asChild className="bg-[#0d9488] hover:bg-[#0a7a6e] text-white shrink-0">
            <Link href="/icode-hq/events/new">
              <Plus className="size-4" />
              New Event
            </Link>
          </Button>
        </div>

        {/* Events Table */}
        <Card className="p-0 overflow-hidden gap-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center">
              <div className="size-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Inbox className="size-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium mb-1">No events yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Add the first event to show on the public Events page.
              </p>
              <Button asChild className="bg-[#0d9488] hover:bg-[#0a7a6e] text-white">
                <Link href="/icode-hq/events/new">
                  <Plus className="size-4" />
                  Create your first event
                </Link>
              </Button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No events match "{query}"</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Visibility</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium text-foreground whitespace-normal">
                      {event.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-muted-foreground">
                        {CATEGORY_LABELS[event.category]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateRange(event.start_date, event.end_date)}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => togglePublish(event.id, event.is_published)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          event.is_published
                            ? 'bg-[#0d9488]/10 text-[#0d9488] hover:bg-[#0d9488]/20'
                            : 'bg-muted text-muted-foreground hover:bg-muted/70'
                        }`}
                      >
                        {event.is_published ? 'Published' : 'Draft'}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        {event.is_published && (
                          <Button variant="ghost" size="icon-sm" asChild>
                            <a href="/events" target="_blank" rel="noopener noreferrer" title="View live">
                              <ExternalLink className="size-4" />
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="icon-sm" asChild>
                          <Link href={`/icode-hq/events/${event.id}`} title="Edit">
                            <PencilLine className="size-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => deleteEvent(event.id)}
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
