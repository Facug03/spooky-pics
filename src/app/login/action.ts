'use server'

import { createClient } from '@/utils/supabase/server'
import type { Provider } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

import { config } from '@/config'

export async function signInWithOAuth(formData: FormData) {
  const github = formData.get('github' as Provider) as Provider | null
  const provider = github
    ? github
    : (formData.get('google' as Provider) as Provider)

  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${config.NEXT_PUBLIC_SITE_URL}/auth/callback`
    }
  })

  if (error) {
    redirect('/login')
  }

  return redirect(data.url)
}
