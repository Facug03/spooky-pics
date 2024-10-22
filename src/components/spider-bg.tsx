import Image from 'next/image'

import { css } from '@styled-system/css'

export function SpiderBg() {
  return (
    <div className={css({ position: 'absolute', zIndex: '-100' })}>
      <Image src="/spider.png" width={200} height={200} alt="Bats background image" />
    </div>
  )
}
