import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import Link from 'next/link'

export function Header() {
  return (
    <header className={css({ paddingY: 2 })}>
      <nav className={hstack({ justify: 'space-between' })}>
        <Heading as="p">Spooky Pics</Heading>

        <Button asChild>
          <Link href="/login">Log in</Link>
        </Button>
      </nav>
    </header>
  )
}
