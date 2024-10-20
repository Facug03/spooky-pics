import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import Link from 'next/link'

import { UserMenu } from '@/components/user-menu'
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
          <Button asChild bgColor="primary">
            <Link href="/login">Log in</Link>
          </Button>
        )}

        {user && (
          <div className={hstack({ gap: 6 })}>
            <Button asChild size="sm" bgColor="primary">
              <Link href="/upload">Upload</Link>
            </Button>

            <UserMenu avatarURL={user.user_metadata?.avatar_url ?? ''} fullName={user.user_metadata?.full_name ?? ''} />
          </div>
        )}
      </nav>
    </header>
  )
}
