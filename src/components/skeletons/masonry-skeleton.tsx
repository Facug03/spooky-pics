'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Masonry } from 'react-plock'

function getRandomSize(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const items = Array.from({ length: 10 }, () => ({
  width: getRandomSize(1000, 3000),
  height: getRandomSize(1000, 3000)
}))

export function MasonrySkeleton() {
  return (
    <Masonry
      items={items}
      config={{
        columns: [1, 2, 3],
        gap: [24, 12, 6],
        media: [640, 768, 1024]
      }}
      render={(item) => (
        <Skeleton
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: `${item.width}/${item.height}`
          }}
        />
      )}
    />
  )
}
