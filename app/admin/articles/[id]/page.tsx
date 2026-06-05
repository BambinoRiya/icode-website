'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadImage, deleteImage } from '@/lib/supabase/storage'
import { calculateReadTime, extractTextFromTiptap } from '@/lib/read-time'
import { TiptapEditor } from '@/components/tiptap-editor'
import Link from 'next/link'
import Image from 'next/image'

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
      router.push('/admin/dashboard')
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

  

      router.push('/admin/dashboard')
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-foreground/60">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8faf9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-[#0d9488] hover:underline text-sm mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'New Article' : 'Edit Article'}
          </h1>
        </div>

        {/* Form */}
        <form className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Title
            </label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53888]/50"
              placeholder="Article title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              value={article.description}
              onChange={(e) => setArticle({ ...article, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53888]/50"
              placeholder="Brief description for preview"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={article.category}
              onChange={(e) => setArticle({ ...article, category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53888]/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date
            </label>
            <input
              type="date"
              value={article.date}
              onChange={(e) => setArticle({ ...article, date: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e53888]/50"
            />
          </div>

          {/* Featured Image */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Featured Image
            </label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
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
                  <label className="inline-block px-4 py-2 bg-[#e53888] text-white rounded-lg cursor-pointer hover:bg-[#d12d77] transition-colors text-sm font-medium">
                    Change Image
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
                <label className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-4xl">📸</div>
                    <div className="text-foreground font-medium">Click to upload image</div>
                    <div className="text-sm text-muted-foreground">or drag and drop</div>
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
              {uploadingImage && <div className="text-sm text-muted-foreground mt-2">Uploading...</div>}
            </div>
          </div>

          {/* Body Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Article Content
            </label>
            <TiptapEditor
              content={article.body_content}
              onChange={updateReadTime}
            />
            <div className="text-xs text-muted-foreground mt-2">
              Estimated read time: {article.read_time}
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving}
              className="px-6 py-2 bg-[#0d9488]/10 text-[#0d9488] rounded-lg hover:bg-[#0d9488]/20 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="px-6 py-2 bg-[#e53888] text-white rounded-lg hover:bg-[#d12d77] transition-colors font-medium disabled:opacity-50 ml-auto"
            >
              {saving ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
