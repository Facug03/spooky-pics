import type { Metadata } from 'next'
import { cache } from 'react'

import { Heading } from '@/components/ui/heading'
import { capitalize } from '@/utils/capitalize'
import { createClient } from '@/utils/supabase/server'
import { stack } from '@styled-system/patterns'
import { Items } from './sections/items'

interface Props {
  params: {
    id: string
  }
}

const getTag = cache(async (id: string) => {
  const supabase = createClient()
  const data = await supabase.from('post').select('*, tag!inner(*)').eq('tag.name', id).range(0, 19)

  return data
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id

  return {
    title: `${capitalize(id)} | Spooky Pics`,
    description: `Discover posts with the tag "${params.id}" on Spooky Pics. Browse spooky images and find your favorites!`
  }
}

export default async function Tag({ params }: Props) {
  const { data, error } = await getTag(params.id)

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
