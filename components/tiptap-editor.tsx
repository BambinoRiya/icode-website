import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit' 
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import 'prosemirror-tables/style/tables.css'

interface TiptapEditorProps {
  content: any
  onChange: (content: any) => void
}

export function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: 'list-disc list-inside' } },
        orderedList: { HTMLAttributes: { class: 'list-decimal list-inside' } },
        blockquote: { HTMLAttributes: { class: 'border-l-4 border-[#e53888] pl-4 italic' } },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON())
    },
  })

  if (!editor) {
    return <div>Loading editor...</div>
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-border bg-[#f8faf9]">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bold')
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('italic')
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          Italic
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          H3
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          Bullet List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          Ordered List
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-[#e53888] text-white'
              : 'bg-white border border-border hover:bg-muted'
          }`}
        >
          Quote
        </button>

        <div className="w-px bg-border" />

        <button
          onClick={addLink}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-border hover:bg-muted transition-colors"
        >
          Link
        </button>

        <button
          onClick={addImage}
          className="px-3 py-1 rounded text-sm font-medium bg-white border border-border hover:bg-muted transition-colors"
        >
          Image
        </button>
      </div>

      {/* Editor Content */}
      <div className="prose max-w-none p-4">
        <EditorContent 
          editor={editor} 
          className="min-h-96 focus:outline-none [&>div]:focus:outline-none"
        />
      </div>
    </div>
  )
}