import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

import { config } from '@/config'

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    config.NEXT_PUBLIC_SUPABASE_URL ?? '',
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, options, value } of cookiesToSet) {
              cookieStore.set(name, value, options)
            }
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  )
}