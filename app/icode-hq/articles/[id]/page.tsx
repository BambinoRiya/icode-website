'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, deleteImage } from '@/lib/supabase/storage'
import { calculateReadTime, extractTextFromTiptap } from '@/lib/read-time'
import { TiptapEditor } from '@/components/tiptap-editor'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ImagePlus, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FieldNote {
  id: string
  slug: string
  title: string
  description: string
  category: string
  date: string
  read_time: string
  featured_image_url: string
  body_content: any
  is_published: boolean
}

const CATEGORIES = [
  'AI & EDUCATION',
  'BUILD LOGS',
  'RESEARCH NOTES',
  'FIELD REPORTS',
  'COMMUNITY',
  'HACKATHON',
  'ORIGIN STORIES',
]

export default function ArticleEditorPage() {
  const params = useParams()
  const id = params.id as string
  const isNew = id === 'new'
  const [article, setArticle] = useState<FieldNote>({
    id: '',
    slug: '',
    title: '',
    description: '',
    category: 'AI & EDUCATION',
    date: new Date().toISOString().split('T')[0],
    read_time: '5 min read',
    featured_image_url: '',
    body_content: { type: 'doc', content: [] },
    is_published: false,
  })

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    if (!isNew) {
      fetchArticle()
    } else {
      setImagePreview('')
    }
  }, [id, isNew])

  async function fetchArticle() {
    try {
      const { data, error } = await supabase
        .from('field_notes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)
      setImagePreview(data.featured_image_url || '')
    } catch (err) {
      console.error('Error fetching article:', err)
      router.push('/icode-hq/dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      // Delete old image if exists
      if (article.featured_image_url) {
        await deleteImage(article.featured_image_url)
      }

      // Upload new image
      const publicUrl = await uploadImage(file)
      setArticle({ ...article, featured_image_url: publicUrl })
      setImagePreview(publicUrl)
    } catch (err) {
      console.error('Error uploading image:', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  function updateReadTime(newContent: any) {
    const text = extractTextFromTiptap(newContent)
    const readTime = calculateReadTime(text)
    setArticle({ ...article, body_content: newContent, read_time: readTime })
  }

  async function handleSave(published: boolean) {
    if (!article.title.trim()) {
      alert('Please enter a title')
      return
    }
    if (!article.description.trim()) {
      alert('Please enter a description')
      return
    }
    if (!article.featured_image_url) {
      alert('Please upload a featured image')
      return
    }

    setSaving(true)
    try {
      // Generate slug from title
      const slug = article.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

      const payload = {
        ...article,
        slug,
        is_published: published,
      }

      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([key, value]) => {
          if (key === "id" && value === "") return false
          if (key === "author_id" && value === "") return false
          return true
        })
      )

      console.log("Saving payload:", payload)
      console.log("Clean payload:", cleanPayload)

      if (isNew) {
        const { error } = await supabase.from('field_notes').insert([cleanPayload])
        if (error) throw error
        alert('Article created successfully!')
      } else {
        const { error } = await supabase
          .from('field_notes')
          .update(cleanPayload)
          .eq('id', id)
        if (error) throw error
        alert(published ? 'Article published!' : 'Draft saved!')
      }



      router.push('/icode-hq/dashboard')
    } catch (err) {
      console.error('Error saving article:', JSON.stringify(err, null, 2))
      console.error('Raw error:', err)
      alert('Failed to save article. Please try again.')
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
            href="/icode-hq/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#0d9488] transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'New Article' : 'Edit Article'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNew ? 'Draft a new Field Note.' : `Editing "${article.title}"`}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          <Card>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  placeholder="Article title"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={article.description}
                  onChange={(e) => setArticle({ ...article, description: e.target.value })}
                  rows={2}
                  placeholder="Brief description for preview"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={article.category}
                    onValueChange={(value) => setArticle({ ...article, category: value })}
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={article.date}
                    onChange={(e) => setArticle({ ...article, date: e.target.value })}
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48">
                        <Image
                          src={imagePreview}
                          alt="Featured image preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                      <label
                        className={cn(
                          buttonVariants({ variant: 'outline', size: 'sm' }),
                          uploadingImage ? 'pointer-events-none opacity-50' : 'cursor-pointer',
                        )}
                      >
                        {uploadingImage ? 'Uploading...' : 'Change Image'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="flex flex-col items-center gap-2">
                        <div className="size-10 rounded-lg bg-[#0d9488]/10 flex items-center justify-center">
                          <ImagePlus className="size-5 text-[#0d9488]" />
                        </div>
                        <div className="text-foreground font-medium text-sm">
                          {uploadingImage ? 'Uploading...' : 'Click to upload image'}
                        </div>
                        <div className="text-xs text-muted-foreground">or drag and drop</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Body Content */}
              <div className="space-y-2">
                <Label>Article Content</Label>
                <TiptapEditor content={article.body_content} onChange={updateReadTime} />
                <p className="text-xs text-muted-foreground">
                  Estimated read time: {article.read_time}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.push('/icode-hq/dashboard')}>
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
              {saving ? 'Publishing...' : 'Publish Article'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  )
}
