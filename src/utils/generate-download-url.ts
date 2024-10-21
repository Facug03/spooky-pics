import { getCldImageUrl } from 'next-cloudinary'

import { removeTransformations } from './remove-transformations'

export const generateDownloadUrl = (url: string) => {
  return decodeURIComponent(
    getCldImageUrl({
      src: removeTransformations(url),
      preserveTransformations: true,
      quality: 100
    })
  )
}
