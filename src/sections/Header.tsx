import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import Link from 'next/link'

import { signOut } from '@/actions/log-out'
import { createClient } from '@/utils/supabase/server'

export async function Header() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <header className={css({ paddingY: 2 })}>
      <nav className={hstack({ justify: 'space-between' })}>
        <Heading as="p">Spooky Pics</Heading>

        {!user && (
          <Button asChild rounded="full">
            <Link href="/login">Log in</Link>
          </Button>
        )}

        {user && (
          <div className={hstack({ gap: 2 })}>
            <Button asChild variant="outline" rounded="full">
              <Link href="/upload">Upload</Link>
            </Button>

            <form action={signOut}>
              <Button rounded="full">Log out</Button>
            </form>
          </div>
        )}
      </nav>
    </header>
  )
}
