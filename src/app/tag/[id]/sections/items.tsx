'use client'

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

import { Masonry } from '@/components/ui/masonry'
import { Spinner } from '@/components/ui/spinner'
import { config } from '@/config'
import type { Post } from '@/types/post'
import { css } from '@styled-system/css'

interface Props {
  tag: string
  items: Post[]
}

export function Items({ tag, items }: Props) {
  const { data, reachEnd, ref } = useInfiniteScroll({ url: `${config.NEXT_PUBLIC_SITE_URL}/api/tag?page=1&tag=${tag}` })

  const photos = data && data.length > 0 ? [...items, ...data.flatMap((m) => m.data ?? [])] : items

  console.log({ reachEnd, data, photos })

  return (
    <section className={css({ color: 'primary' })}>
      {photos.length > 0 && (
        <>
          <div className={css({ minH: items.length >= 10 ? '90vh' : 'auto' })}>
            <Masonry items={photos} />
          </div>

          {!reachEnd && photos.length >= 10 && (
            <div className={css({ display: 'flex', width: '100%', justifyContent: 'center', padding: '3' })} ref={ref}>
              <Spinner size="lg" />
            </div>
          )}
        </>
      )}
    </section>
  )
}
