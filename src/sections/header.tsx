import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import { createClient } from '@/utils/supabase/server'
import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'

export async function Header() {
  const supabase = createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return (
    <header className={css({ paddingY: 2 })}>
      <nav className={hstack({ justify: 'space-between', alignItems: 'center' })}>
        <Link href="/" aria-label="Spooky Pics">
          <div className={css({ position: 'relative', height: '8', width: '36' })}>
            <Image src="/spooky-logo.svg" alt="Spooky Pics" fill />
          </div>
        </Link>

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
