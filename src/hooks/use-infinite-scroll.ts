import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite from 'swr/infinite'

import { getPhotosPaginated } from '@/services/get-photos-paginated'

interface Props {
  url: string
}

export function useInfiniteScroll({ url }: Props) {
  const { ref, inView } = useInView({
    rootMargin: '100px 0px 0px 0px'
  })
  const { data, setSize } = useSWRInfinite(
    (page, previousData) => {
      if (!inView) return null

      if (previousData && previousData.nextPage === null) return null

      return url.replace(/page=\d+/, `page=${page + 1}`)
    },
    (url) => {
      return getPhotosPaginated({ url })
    },
    {
      errorRetryCount: 1,
      keepPreviousData: true,
      revalidateOnFocus: false,
      revalidateAll: false,
      revalidateFirstPage: false,
      parallel: false,
      dedupingInterval: 10000
    }
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (inView) {
      setSize((prev) => {
        if (prev === 1 && !data) return 1

        return prev + 1
      })
    }
  }, [inView, setSize])

  const reachEnd = data && data[data.length - 1]?.nextPage === null

  return {
    data,
    reachEnd,
    ref
  }
}
