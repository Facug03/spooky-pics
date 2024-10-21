'use client'

import { DownloadSimple } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { generateDownloadUrl } from '@/utils/generate-download-url'
import { useState } from 'react'

interface Props {
  imageUrl: string
}

export function Download({ imageUrl }: Props) {
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)

    try {
      const image = generateDownloadUrl(imageUrl)
      const response = await fetch(image)
      const format = response.headers.get('content-type')?.split('/')[1]

      if (!response.ok) {
        throw new Error('Failed to download file')
      }

      const blob = await response.blob()

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `spooky_image.${format}`
      document.body.appendChild(link)
      link.click()

      link?.parentNode?.removeChild(link)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="outline" onClick={onClick} loadingText={loading ? 'Downloading...' : ''} loading={Boolean(loading)}>
      Download <DownloadSimple size={32} />
    </Button>
  )
}
