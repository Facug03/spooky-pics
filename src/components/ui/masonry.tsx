'use client'

import Link from 'next/link'
import { Masonry as MasonryPlock } from 'react-plock'

import type { Post } from '@/types/post'
import { css } from '@styled-system/css'

interface Props {
  items: Post[]
}

export const Masonry = ({ items }: Props) => {
  return (
    <MasonryPlock
      items={items}
      config={{
        columns: [1, 2, 3],
        gap: [24, 12, 6],
        media: [640, 768, 1024]
      }}
      render={(item) => (
        <Link href={`/photo/${item.id}`} key={item.id}>
          <img
            className={css({
              width: '100%',
              height: 'auto'
            })}
            src={item.image_url}
            alt={item.title ?? 'image'}
          />
        </Link>
      )}
    />
  )
}
