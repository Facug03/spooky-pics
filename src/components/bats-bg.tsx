import Image from 'next/image'

import { css } from '@styled-system/css'

export function BatsBg() {
  return (
    <div className={css({ position: 'absolute', top: 0, right: 0, zIndex: '-100' })}>
      <Image src="/bats.webp" width={500} height={500} alt="Bats background image" />
    </div>
  )
}
