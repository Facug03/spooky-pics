import { useEffect, useState } from 'react'

import { Text } from '@/components/ui/text'
import { css } from '@styled-system/css'
import { loadingPhrases } from '../consts/loading-phrases'

export const LoadingText = () => {
  const [currentPhrase, setCurrentPhrase] = useState(loadingPhrases[0])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingPhrases.length)
      setCurrentPhrase(loadingPhrases[index])
    }, 3000)

    return () => clearInterval(interval)
  }, [index])

  return (
    <Text
      as="p"
      className={css({
        position: 'absolute',
        zIndex: 'popover',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: 'primary',
        fontSize: 'md',
        fontWeight: 'bold',
        width: 'full',
        textAlign: 'center',
        animation: 'skeleton-pulse'
      })}
    >
      {currentPhrase}
    </Text>
  )
}
