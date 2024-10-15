'use client'

import { css } from '@styled-system/css'
import { hstack, stack } from '@styled-system/patterns'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'

export function UploadImage() {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1))
  const [publicId, setPublicId] = useQueryState(
    'public_id',
    parseAsString.withDefault('')
  )

  return (
    <section className={stack({ gap: '10' })}>
      <header className={hstack({ justify: 'space-between' })}>
        <Heading as="h1" fontSize="2xl">
          First select an image
        </Heading>

        {publicId && (
          <nav>
            {step > 1 && (
              <Button variant="outline" rounded="full">
                Back
              </Button>
            )}

            <Button rounded="full" size="lg" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </nav>
        )}
      </header>

      {!publicId && (
        <CldUploadWidget
          uploadPreset="fkdsburx"
          options={{
            folder: 'spooky',
            multiple: false,
            showUploadMoreButton: false,
            sources: ['local', 'url', 'camera']
          }}
          onSuccess={({ info }) => {
            if (typeof info === 'string') {
              return
            }

            setPublicId(info?.public_id ?? '')
          }}
        >
          {({ open }) => {
            return (
              <Button
                onClick={() => open()}
                rounded="full"
                width="fit-content"
                size="lg"
              >
                Upload
              </Button>
            )
          }}
        </CldUploadWidget>
      )}

      {publicId && (
        <div
          className={stack({
            position: 'relative',
            alignSelf: 'center',
            aspectRatio: '1/1',
            width: '70vw',
            height: 'auto',
            maxWidth: '37rem',
            sm: {
              width: '60vw'
            },
            lg: {
              width: '40vw'
            },
            xl: {
              width: '30vw'
            }
          })}
        >
          <CldImage
            className={css({ objectFit: 'contain' })}
            src={publicId}
            alt="image uploaded by user"
            sizes="30vw"
            fill
          />
        </div>
      )}
    </section>
  )
}
