'use client'

import type { GetCldImageUrlOptions } from 'next-cloudinary'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { type PropsWithChildren, useState } from 'react'

import { css } from '@styled-system/css'
import { EditImage } from '../components/EditImage'
import { UploadImage } from '../components/UploadImage'

export function Steps() {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1))
  const [publicId] = useQueryState('public_id', parseAsString.withDefault(''))
  const [transformations, setTransformations] = useState<
    Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>
  >({
    replaceBackground: '',
    replace: undefined,
    remove: ''
  })

  return (
    <>
      <HideStep show={step === 1}>
        <UploadImage />
      </HideStep>

      <HideStep show={step === 2}>
        <EditImage
          changeStep={(newStep) => setStep(newStep)}
          publicId={publicId}
          step={step}
          changeTransformations={(newTransformations) =>
            setTransformations(newTransformations)
          }
          transformations={transformations}
        />
      </HideStep>
    </>
  )
}

interface Props extends PropsWithChildren {
  show: boolean
}

export function HideStep({ children, show }: Props) {
  return (
    <div
      className={css({
        display: show ? 'block' : 'none',
        height: show ? 'auto' : '0'
      })}
    >
      {children}
    </div>
  )
}
