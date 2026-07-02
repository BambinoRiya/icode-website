import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function IcodeHqRootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  redirect(user ? '/icode-hq/dashboard' : '/icode-hq/login')
}
