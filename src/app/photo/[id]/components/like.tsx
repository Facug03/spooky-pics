'use client'

import { Heart } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { updateLike } from '@/app/photo/[id]/actions/update-like'
import { IconButton } from '@/components/ui/icon-button'

interface Props {
  postId: number
  liked: boolean
  isAuthenticated: boolean
}

export function Like({ postId, liked, isAuthenticated }: Props) {
  const [like, setLike] = useState(liked)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        if (!isAuthenticated) {
          router.push('/login')
          return
        }

        if (loading) return

        setLoading(true)
        setLike((prevState) => !prevState)

        const { error } = await updateLike(postId, !like)

        if (error) {
          setLike((prevState) => !prevState)
        }

        setLoading(false)
      }}
    >
      <IconButton type="submit" variant="outline" aria-label="Like" color={like ? 'red' : 'black'}>
        <Heart size={32} color="currentColor" weight={like ? 'fill' : 'regular'} />
      </IconButton>
    </form>
  )
}
