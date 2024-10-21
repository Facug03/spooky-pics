'use client'

import { X } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

import { Dialog } from '@/components/ui/dialog'
import { IconButton } from '@/components/ui/icon-button'
import { css } from '@styled-system/css'

export function Modal({ children }: PropsWithChildren) {
  const router = useRouter()

  return createPortal(
    <Dialog.Root
      open={true}
      onOpenChange={(e) => {
        if (e.open) return
        router.back()
      }}
    >
      <Dialog.Backdrop
        className={css({
          backdropFilter: 'auto',
          backgroundColor: 'rgba(0,0,0,.4)',
          cursor: 'auto'
        })}
      />
      <Dialog.Positioner>
        <Dialog.Content
          className={css({
            minWidth: '0'
          })}
        >
          <Dialog.CloseTrigger asChild position="fixed" top="3" right="3" zIndex="modal">
            <IconButton aria-label="Close Dialog" variant="ghost" size="lg">
              <X
                className={css({
                  width: '8',
                  height: '8'
                })}
                size={128}
                color="#fff"
                weight="bold"
              />
            </IconButton>
          </Dialog.CloseTrigger>
          {children}
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>,
    // biome-ignore lint/style/noNonNullAssertion: <explanation>
    document.getElementById('modal-root')!
  )
}
