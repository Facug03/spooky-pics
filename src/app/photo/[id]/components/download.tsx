'use client'

import { DownloadSimple } from '@phosphor-icons/react'
import { getCldImageUrl } from 'next-cloudinary'

import { Button } from '@/components/ui/button'
import { removeTransformations } from '@/utils/remove-transformations'

interface Props {
  imageUrl: string
  aspectRatio: string | null
}

export function Download({ imageUrl, aspectRatio }: Props) {
  const onClick = async () => {
    const width = aspectRatio ? Number.parseInt(aspectRatio.split('/')[0]) : undefined
    const height = aspectRatio ? Number.parseInt(aspectRatio.split('/')[1]) : undefined

    const image = getCldImageUrl({
      src: removeTransformations(imageUrl),
      width: width ?? 1200,
      height: height,
      quality: 100,
      format: 'webp'
    })

    console.log({ width, height, aspectRatio, image })

    const response = await fetch(image)

    // Verifica si la respuesta es exitosa
    if (!response.ok) {
      console.error('Failed to download file:', response.statusText)
      return
    }

    const blob = await response.blob()

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'spooky_image.webp'
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
