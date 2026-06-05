import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const BUCKET_NAME = 'field-note-images'

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient()
  
  // Generate unique filename
  const fileExt = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExt}`
  
  try {
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`articles/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`articles/${fileName}`)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image')
  }
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const supabase = createClient()
  
  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1]
    const filePath = `articles/${fileName}`

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw - continue even if delete fails
  }
}