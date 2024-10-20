'use client'

import { useState } from 'react'

import { signOut } from '@/actions/log-out'
import { Heart, SignOut } from '@phosphor-icons/react'
import { css } from '@styled-system/css'
import { stack } from '@styled-system/patterns'
import { Avatar } from './ui/avatar'
import { Button } from './ui/button'
import { IconButton } from './ui/icon-button'

interface Props {
  avatarURL: string
  fullName: string
}

export function UserMenu({ avatarURL, fullName }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {open && (
        <div
          className={css({
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 40,
            height: '100dvh',
            width: '100%'
          })}
          onClick={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setOpen(false)
            }
          }}
        />
      )}
      <div className={css({ position: 'relative' })}>
        <IconButton variant="ghost" aria-label="User menu" onClick={() => setOpen(!open)}>
          <Avatar src={avatarURL} name={fullName} size="md" />
        </IconButton>

        {open && (
          <ul
            className={stack({
              position: 'absolute',
              top: '125%',
              right: 0,
              zIndex: 'modal',
              backgroundColor: 'white',
              borderRadius: 'sm',
              boxShadow: 'md',
              paddingX: '3',
              paddingY: '4',
              gap: 2
            })}
          >
            <li>
              <Button variant="link">
                Likes <Heart size={24} />
              </Button>
            </li>
            <hr className={css({ bg: 'gray' })} />
            <li>
              <Button variant="link" onClick={() => signOut()}>
                Sign out <SignOut size={24} />
              </Button>
            </li>
          </ul>
        )}
      </div>
    </>
  )
}
