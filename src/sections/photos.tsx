'use client'

import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'

import { Masonry } from '@/components/ui/masonry'
import { Spinner } from '@/components/ui/spinner'
import { config } from '@/config'
import type { Post } from '@/types/post'
import { css } from '@styled-system/css'

interface Props {
  items: Post[]
}

export function Photos({ items }: Props) {
  const { data, reachEnd, ref } = useInfiniteScroll({ url: `${config.NEXT_PUBLIC_SITE_URL}/api/photo?page=1` })

  const photos = data && data.length > 0 ? [...items, ...data.flatMap((m) => m.data ?? [])] : items

  return (
    <section id="explore" className={css({ color: 'primary' })}>
      {photos.length > 0 && (
        <>
          <div className={css({ minH: items.length >= 20 ? '90vh' : 'auto' })}>
            <Masonry items={photos} />
          </div>

          {!reachEnd && photos.length >= 20 && (
            <div className={css({ display: 'flex', width: '100%', justifyContent: 'center', padding: '3' })} ref={ref}>
              <Spinner size="lg" />
            </div>
          )}
        </>
      )}
    </section>
  )
}
