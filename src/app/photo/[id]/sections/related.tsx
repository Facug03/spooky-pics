import { createClient } from '@/utils/supabase/server'

import { Heading } from '@/components/ui/heading'
import { Masonry } from '@/components/ui/masonry'
import type { Tag } from '@/types/tag'
import { stack } from '@styled-system/patterns'

interface Props {
  tags: Pick<Tag, 'name'>[]
  postId: string
}

export async function Related({ postId, tags }: Props) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('post')
    .select('*, tag (*)')
    .in(
      'tag.name',
      tags.map((tag) => tag.name)
    )
    .range(0, 20)
    .neq('id', postId)

  if (error || !data) {
    return null
  }

  return (
    <section className={stack({ gap: '4' })}>
      <Heading as="h2" fontSize="xl">
        Related
      </Heading>
      <Masonry items={data} />
    </section>
  )
}
