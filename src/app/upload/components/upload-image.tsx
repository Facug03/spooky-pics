'use client'

import { ArrowCircleRight, HandPointing, Image } from '@phosphor-icons/react'
import { css } from '@styled-system/css'
import { hstack, stack } from '@styled-system/patterns'
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'

interface Props {
  changeAspectRatio: (aspectRatio: string) => void
}

export function UploadImage({ changeAspectRatio }: Props) {
  const [step, setStep] = useQueryState('step', parseAsInteger.withDefault(1))
  const [publicId, setPublicId] = useQueryState('public_id', parseAsString.withDefault(''))

  return (
    <section className={stack({ gap: '6' })}>
      <header
        className={hstack({
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '4',
          md: { gap: '2', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }
        })}
      >
        <Heading
          as="h2"
          className={hstack({
            gap: 2,
            alignItems: 'center',
            fontSize: '1rem',
            color: 'white',
            bgColor: 'primary',
            fontWeight: 'bold',
            paddingX: '4',
            paddingY: '1',
            rounded: 'full',
            sm: {
              fontSize: '2xl'
            }
          })}
        >
          First select an image <HandPointing size={32} />
        </Heading>

        {publicId && (
          <nav>
            {step > 1 && <Button variant="outline">Back</Button>}

            <Button size={{ smDown: 'md', sm: 'lg' }} onClick={() => setStep(step + 1)}>
              Next <ArrowCircleRight size={32} />
            </Button>
          </nav>
        )}
      </header>

      <Text as="p" marginBottom="8" fontSize={{ smDown: '0.950rem', sm: 'md' }}>
        Choose the image you want to upload and share.
      </Text>

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

          changeAspectRatio(`${info?.width}/${info?.height}`)
          setPublicId(info?.public_id ?? '')
        }}
      >
        {({ open }) => {
          return (
            <Button onClick={() => open()} width="fit-content" size={{ smDown: 'md', sm: 'lg' }} variant="outline">
              {publicId ? 'Change image' : 'Select image'} <Image size={32} />
            </Button>
          )
        }}
      </CldUploadWidget>

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
