'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

const codeSnippets = [
  { code: 'supabase.auth.signIn()', x: 4, y: 12 },
  { code: 'if (isAdmin) grant();', x: 75, y: 18 },
  { code: 'role: "admin"', x: 2, y: 78 },
  { code: '<Dashboard access="secure" />', x: 68, y: 72 },
  { code: 'session.verify()', x: 85, y: 45 },
  { code: 'await auth.getUser()', x: 6, y: 45 },
]

const floatY = [0, -10, 0]

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        router.push('/icode-hq/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#f8faf9] px-4 py-16 overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e4ea_1px,transparent_1px),linear-gradient(to_bottom,#e8e4ea_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

      {/* Glow blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-[#0d9488]/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-[#e53888]/15 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Floating code snippets */}
      {codeSnippets.map((snippet, index) => (
        <motion.div
          key={snippet.code}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1, y: floatY }}
          transition={{
            default: { duration: 0.6, delay: 0.6 + index * 0.15 },
            y: {
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.3,
            },
          }}
          className="absolute hidden lg:block pointer-events-none"
          style={{ left: `${snippet.x}%`, top: `${snippet.y}%` }}
        >
          <div className="px-3 py-2 rounded-lg bg-white/80 backdrop-blur-sm border border-border shadow-lg">
            <code className="text-xs font-mono text-[#0d9488]">{snippet.code}</code>
          </div>
        </motion.div>
      ))}

      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/logo.svg"
            alt="iCODE Abakwa"
            width={320}
            height={96}
            priority
            className="h-24 sm:h-32 w-auto mb-6 drop-shadow-sm"
          />
          <div className="size-10 rounded-full bg-[#0d9488]/10 flex items-center justify-center mb-4">
            <Lock className="size-5 text-[#0d9488]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin sign in</h1>
          <p className="text-muted-foreground mt-1">iCODE HQ</p>
        </div>

        <Card>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@ebaseafrica.org"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0d9488] hover:bg-[#0a7a6e] text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/icode-hq/signup" className="text-[#0d9488] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
