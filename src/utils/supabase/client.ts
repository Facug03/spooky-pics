import { createBrowserClient } from '@supabase/ssr'

import { config } from '@/config'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(config.NEXT_PUBLIC_SUPABASE_URL ?? '', config.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '')
}
