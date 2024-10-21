import type { Post } from '@/types/post'
import type { ResponsePagination } from '@/utils/response-pagination'

export const getPhotosPaginated = async ({ url }: { url: string }): Promise<ResponsePagination<Post>> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch tags')
  }

  const data = (await response.json()) as ResponsePagination<Post>

  return data
}
