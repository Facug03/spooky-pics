import type { Database } from './supabase'

export type Post = Database['public']['Tables']['post']['Row']
