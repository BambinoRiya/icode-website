'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
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
import type { Milestone, SystemStatus, Update } from '@/lib/systems-data'

interface SystemForm {
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
  link: string
  milestones: Milestone[]
  updates: Update[]
  isPublished: boolean
}

const STATUS_OPTIONS: { value: SystemStatus; label: string }[] = [
  { value: 'live', label: 'Live' },
  { value: 'building', label: 'Building' },
  { value: 'exploring', label: 'Exploring' },
]

const MILESTONE_STATUS_OPTIONS: { value: Milestone['status']; label: string }[] = [
  { value: 'not-started', label: 'Not started' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
]

function newId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
}

export default function SystemEditorPage() {
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'

  const [system, setSystem] = useState<SystemForm>({
    id: '',
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    fullDescription: '',
    status: 'exploring',
    icon: '🛠️',
    progress: 0,
    teamSize: 1,
    targetLaunch: '',
    link: '',
    milestones: [],
    updates: [],
    isPublished: false,
  })

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!isNew) {
      fetchSystem()
    }
  }, [id, isNew])

  async function fetchSystem() {
    try {
      const { data, error } = await supabase.from('systems').select('*').eq('id', id).single()
      if (error) throw error

      setSystem({
        id: data.id,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle ?? '',
        description: data.description ?? '',
        fullDescription: data.full_description ?? '',
        status: data.status,
        icon: data.icon ?? '🛠️',
        progress: data.progress ?? 0,
        teamSize: data.team_size ?? 1,
        targetLaunch: data.target_launch ?? '',
        link: data.link ?? '',
        milestones: data.milestones ?? [],
        updates: data.updates ?? [],
        isPublished: data.is_published,
      })
    } catch (err) {
      console.error('Error fetching system:', err)
      router.push('/icode-hq/systems')
    } finally {
      setLoading(false)
    }
  }

  function addMilestone() {
    setSystem({
      ...system,
      milestones: [...system.milestones, { id: newId(), title: '', status: 'not-started' }],
    })
  }

  function updateMilestone(index: number, patch: Partial<Milestone>) {
    setSystem({
      ...system,
      milestones: system.milestones.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    })
  }

  function removeMilestone(index: number) {
    setSystem({ ...system, milestones: system.milestones.filter((_, i) => i !== index) })
  }

  function addUpdate() {
    setSystem({
      ...system,
      updates: [{ id: newId(), date: '', content: '' }, ...system.updates],
    })
  }

  function updateUpdate(index: number, patch: Partial<Update>) {
    setSystem({
      ...system,
      updates: system.updates.map((u, i) => (i === index ? { ...u, ...patch } : u)),
    })
  }

  function removeUpdate(index: number) {
    setSystem({ ...system, updates: system.updates.filter((_, i) => i !== index) })
  }

  async function handleSave(publish: boolean) {
    if (!system.title.trim()) {
      alert('Please enter a title')
      return
    }

    setSaving(true)
    try {
      const slug = system.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        slug,
        title: system.title,
        subtitle: system.subtitle,
        description: system.description,
        full_description: system.fullDescription,
        status: system.status,
        icon: system.icon,
        progress: system.progress,
        team_size: system.teamSize,
        target_launch: system.targetLaunch,
        link: system.link || null,
        milestones: system.milestones,
        updates: system.updates,
        is_published: publish,
      }

      if (isNew) {
        const { error } = await supabase.from('systems').insert([payload])
        if (error) throw error
        alert('System created successfully!')
      } else {
        const { error } = await supabase.from('systems').update(payload).eq('id', id)
        if (error) throw error
        alert(publish ? 'System published!' : 'Changes saved!')
      }

      router.push('/icode-hq/systems')
    } catch (err) {
      console.error('Error saving system:', err)
      alert('Failed to save system. Please try again.')
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
            href="/icode-hq/systems"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0d9488] transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to Systems
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'New System' : 'Edit System'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? 'Add a new system to the Systems page.' : `Editing "${system.title}"`}
          </p>
        </div>

        <form className="space-y-6">
          {/* Overview */}
          <Card>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-[1fr_auto] gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={system.title}
                    onChange={(e) => setSystem({ ...system, title: e.target.value })}
                    placeholder="System title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Input
                    id="icon"
                    value={system.icon}
                    onChange={(e) => setSystem({ ...system, icon: e.target.value })}
                    placeholder="🛠️"
                    className="w-20 text-center text-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={system.subtitle}
                  onChange={(e) => setSystem({ ...system, subtitle: e.target.value })}
                  placeholder="e.g. Learning system"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short description</Label>
                <Textarea
                  id="description"
                  value={system.description}
                  onChange={(e) => setSystem({ ...system, description: e.target.value })}
                  rows={2}
                  placeholder="Shown on the Systems grid card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullDescription">Full description</Label>
                <Textarea
                  id="fullDescription"
                  value={system.fullDescription}
                  onChange={(e) => setSystem({ ...system, fullDescription: e.target.value })}
                  rows={4}
                  placeholder="Shown on the system's detail page"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={system.status}
                    onValueChange={(value) => setSystem({ ...system, status: value as SystemStatus })}
                  >
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min={0}
                    max={100}
                    value={system.progress}
                    onChange={(e) =>
                      setSystem({ ...system, progress: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    value={system.teamSize}
                    onChange={(e) =>
                      setSystem({ ...system, teamSize: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetLaunch">Target launch</Label>
                  <Input
                    id="targetLaunch"
                    value={system.targetLaunch}
                    onChange={(e) => setSystem({ ...system, targetLaunch: e.target.value })}
                    placeholder="e.g. Q4 2026, Live"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link">Link (optional)</Label>
                  <Input
                    id="link"
                    type="url"
                    value={system.link}
                    onChange={(e) => setSystem({ ...system, link: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Visible on the public Systems page
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={system.isPublished}
                  onCheckedChange={(checked) => setSystem({ ...system, isPublished: checked })}
                  className="data-[state=checked]:bg-[#0d9488]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Milestones</Label>
                <Button type="button" variant="outline" size="sm" onClick={addMilestone}>
                  <Plus className="size-4" />
                  Add milestone
                </Button>
              </div>
              {system.milestones.length === 0 ? (
                <p className="text-sm text-muted-foreground">No milestones yet.</p>
              ) : (
                <div className="space-y-3">
                  {system.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex flex-wrap gap-2 items-start">
                      <Input
                        value={milestone.title}
                        onChange={(e) => updateMilestone(index, { title: e.target.value })}
                        placeholder="Milestone title"
                        className="flex-1 min-w-[10rem]"
                      />
                      <Select
                        value={milestone.status}
                        onValueChange={(value) =>
                          updateMilestone(index, { status: value as Milestone['status'] })
                        }
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MILESTONE_STATUS_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={milestone.date ?? ''}
                        onChange={(e) => updateMilestone(index, { date: e.target.value })}
                        placeholder="Date (optional)"
                        className="w-40"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeMilestone(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Updates</Label>
                <Button type="button" variant="outline" size="sm" onClick={addUpdate}>
                  <Plus className="size-4" />
                  Add update
                </Button>
              </div>
              {system.updates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              ) : (
                <div className="space-y-3">
                  {system.updates.map((update, index) => (
                    <div key={update.id} className="flex flex-wrap gap-2 items-start">
                      <Input
                        value={update.date}
                        onChange={(e) => updateUpdate(index, { date: e.target.value })}
                        placeholder="e.g. June 15, 2024"
                        className="w-40"
                      />
                      <Textarea
                        value={update.content}
                        onChange={(e) => updateUpdate(index, { content: e.target.value })}
                        placeholder="What happened?"
                        rows={1}
                        className="flex-1 min-w-[12rem]"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeUpdate(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/icode-hq/systems')}>
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
              {saving ? 'Publishing...' : 'Publish System'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
