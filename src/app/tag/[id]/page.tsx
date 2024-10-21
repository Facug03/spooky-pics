import { Heading } from '@/components/ui/heading'
import { createClient } from '@/utils/supabase/server'
import { stack } from '@styled-system/patterns'
import { Items } from './sections/items'

export default async function Tag({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data, error } = await supabase.from('post').select('*, tag!inner(*)').eq('tag.name', params.id).range(0, 9)

  if (error) {
    return null
  }

  return (
    <main className={stack({ paddingY: '10', gap: '8' })}>
      <Heading as="h1" fontSize="2xl" textTransform="capitalize">
        {params.id}
      </Heading>

      {data && data.length > 0 ? <Items items={data} tag={params.id} /> : <Heading as="h2">No photos found</Heading>}
    </main>
  )
}
