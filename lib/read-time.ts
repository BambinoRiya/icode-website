/**
 * Calculate estimated read time from text content
 * Based on average reading speed of 200 words per minute
 */
export function calculateReadTime(text: string): string {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute)
  
  if (readTimeMinutes <= 1) {
    return '1 min read'
  }
  
  return `${readTimeMinutes} min read`
}

/**
 * Extract plain text from Tiptap JSON content
 */
export function extractTextFromTiptap(content: any): string {
  if (!content || typeof content !== 'object') return ''
  
  let text = ''

  function traverse(node: any): void {
    if (node.type === 'text' && node.text) {
      text += node.text + ' '
    }
    
    if (node.content && Array.isArray(node.content)) {
      node.content.forEach(traverse)
    }
  }

  if (Array.isArray(content)) {
    content.forEach(traverse)
  } else {
    traverse(content)
  }

  return text.trim()
}