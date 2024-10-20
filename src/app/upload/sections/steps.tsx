'use client'

import type { GetCldImageUrlOptions } from 'next-cloudinary'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'
import { type PropsWithChildren, useState } from 'react'

import type { Tag } from '@/types/tag'
import { css } from '@styled-system/css'
import { EditImage } from '../components/edit-image'
import { LastStep } from '../components/last-step'
import { UploadImage } from '../components/upload-image'

interface Props {
  tags: Tag[]
}

export function Steps({ tags }: Props) {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1))
  const [publicId] = useQueryState('public_id', parseAsString.withDefault(''))
  const [aspectRatio, setAspectRatio] = useState('')
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
        <UploadImage changeAspectRatio={(newAspectRatio) => setAspectRatio(newAspectRatio)} />
      </HideStep>

      <HideStep show={step === 2}>
        <EditImage
          changeStep={(newStep) => setStep(newStep)}
          publicId={publicId}
          step={step}
          changeTransformations={(newTransformations) => setTransformations(newTransformations)}
          transformations={transformations}
        />
      </HideStep>

      <HideStep show={step === 3}>
        <LastStep
          aspectRatio={aspectRatio}
          tags={tags}
          changeStep={(newStep) => setStep(newStep)}
          publicId={publicId}
          step={step}
          transformations={transformations}
        />
      </HideStep>
    </>
  )
}

interface PropsStep extends PropsWithChildren {
  show: boolean
}

export function HideStep({ children, show }: PropsStep) {
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
