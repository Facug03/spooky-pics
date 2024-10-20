import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import { stack } from '@styled-system/patterns'
import { Steps } from './sections/steps'

export default async function Upload() {
  const supabase = createClient()
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login')
  }

  const { data } = await supabase.from('tag').select('*').order('name', { ascending: true })

  return (
    <main className={stack({ paddingY: '10' })}>
      <Steps tags={data ?? []} />
    </main>
  )
}
