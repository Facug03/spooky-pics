'use client'

import { DownloadSimple } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'
import { generateDownloadUrl } from '@/utils/generate-download-url'

interface Props {
  imageUrl: string
}

export function Download({ imageUrl }: Props) {
  const onClick = async () => {
    const image = generateDownloadUrl(imageUrl)

    const response = await fetch(image)

    const format = response.headers.get('content-type')?.split('/')[1]

    if (!response.ok) {
      console.error('Failed to download file:', response.statusText)
      return
    }

    const blob = await response.blob()

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `spooky_image.${format}`
    document.body.appendChild(link)
    link.click()

    link?.parentNode?.removeChild(link)
  }

  return (
    <Button variant="outline" onClick={onClick}>
      Download <DownloadSimple size={32} />
    </Button>
  )
}
