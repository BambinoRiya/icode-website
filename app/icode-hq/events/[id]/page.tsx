'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { EventCategory } from '@/lib/events-data'

interface EventForm {
  title: string
  description: string
  category: EventCategory
  startDate: string
  endDate: string
  location: string
  registrationUrl: string
  isPublished: boolean
}

const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: 'bootcamp', label: 'Bootcamp' },
  { value: 'hackathon', label: 'Hackathon' },
  { value: 'workshop', label: 'Workshop' },
]

/** Convert an ISO timestamp to the `YYYY-MM-DDTHH:mm` format <input type="datetime-local"> expects, in local time. */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}

/** Convert a <input type="datetime-local"> value (local time, no timezone) back to an ISO string. */
function fromDatetimeLocal(local: string): string {
  return new Date(local).toISOString()
}

export default function EventEditorPage() {
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [event, setEvent] = useState<EventForm>({
    title: '',
    description: '',
    category: 'workshop',
    startDate: '',
    endDate: '',
    location: '',
    registrationUrl: '',
    isPublished: false,
  })

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!isNew) {
      fetchEvent()
    }
  }, [id, isNew])

  async function fetchEvent() {
    try {
      const { data, error } = await supabase.from('events').select('*').eq('id', id).single()
      if (error) throw error

      setEvent({
        title: data.title,
        description: data.description ?? '',
        category: data.category,
        startDate: toDatetimeLocal(data.start_date),
        endDate: data.end_date ? toDatetimeLocal(data.end_date) : '',
        location: data.location ?? '',
        registrationUrl: data.registration_url ?? '',
        isPublished: data.is_published,
      })
    } catch (err) {
      console.error('Error fetching event:', err)
      router.push('/icode-hq/events')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(publish: boolean) {
    if (!event.title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!event.startDate) {
      alert('Please set a start date')
      return
    }

    setSaving(true)
    try {
      const slug = event.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        slug,
        title: event.title,
        description: event.description,
        category: event.category,
        start_date: fromDatetimeLocal(event.startDate),
        end_date: event.endDate ? fromDatetimeLocal(event.endDate) : null,
        location: event.location,
        registration_url: event.registrationUrl || null,
        is_published: publish,
      }

      if (isNew) {
        const { error } = await supabase.from('events').insert([payload])
        if (error) throw error
        alert('Event created successfully!')
      } else {
        const { error } = await supabase.from('events').update(payload).eq('id', id)
        if (error) throw error
        alert(publish ? 'Event published!' : 'Changes saved!')
      }

      router.push('/icode-hq/events')
    } catch (err) {
      console.error('Error saving event:', err)
      alert('Failed to save event. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
        <Loader2 className="size-6 text-[#0d9488] animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#0d9488]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/icode-hq/events"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0d9488] transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to Events
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'New Event' : 'Edit Event'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? 'Add a new bootcamp, hackathon, or workshop.' : `Editing "${event.title}"`}
          </p>
        </div>

        <form className="space-y-6">
          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={event.title}
                  onChange={(e) => setEvent({ ...event, title: e.target.value })}
                  placeholder="e.g. iCODE hackathon: build for health"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                  rows={2}
                  placeholder="Shown on the upcoming timeline"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={event.category}
                    onValueChange={(value) => setEvent({ ...event, category: value as EventCategory })}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={event.location}
                    onChange={(e) => setEvent({ ...event, location: e.target.value })}
                    placeholder="e.g. Douala (leave blank if remote)"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date &amp; time</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={event.startDate}
                    onChange={(e) => setEvent({ ...event, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date &amp; time (optional)</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={event.endDate}
                    onChange={(e) => setEvent({ ...event, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registrationUrl">Registration link (optional)</Label>
                <Input
                  id="registrationUrl"
                  type="url"
                  value={event.registrationUrl}
                  onChange={(e) => setEvent({ ...event, registrationUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visible on the public Events page
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={event.isPublished}
                  onCheckedChange={(checked) => setEvent({ ...event, isPublished: checked })}
                  className="data-[state=checked]:bg-[#0d9488]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/icode-hq/events')}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="border-[#0d9488]/30 text-[#0d9488] hover:bg-[#0d9488]/10 hover:text-[#0d9488]"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-[#e53888] hover:bg-[#d12d77] text-white ml-auto"
            >
              {saving ? 'Publishing...' : 'Publish Event'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
