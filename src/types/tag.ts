import type { Database } from './supabase'

export type Tag = Database['public']['Tables']['tag']['Row']
