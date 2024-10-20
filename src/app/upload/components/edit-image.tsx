'use client'

import {
  ArrowCircleLeft,
  ArrowCircleRight,
  Ghost,
  MinusCircle,
  SelectionBackground,
  Swap,
  XCircle
} from '@phosphor-icons/react'
import { type GetCldImageUrlOptions, getCldImageUrl } from 'next-cloudinary'
import Image from 'next/image'
import { type PropsWithChildren, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Heading } from '@/components/ui/heading'
import { IconButton } from '@/components/ui/icon-button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs } from '@/components/ui/tabs'
import { TagsInput } from '@/components/ui/tags-input'
import { Text } from '@/components/ui/text'
import { areValuesInObjTruthy } from '@/utils/areValuesInObjTruthy'
import { css } from '@styled-system/css'
import { hstack, stack } from '@styled-system/patterns'
import { getTransformedImage } from '../services/get-transformed-image'
import { LoadingText } from './loading-text'

const options = [
  { id: 'background', label: 'Background', icon: <SelectionBackground size={32} /> },
  { id: 'remove', label: 'Remove', icon: <MinusCircle size={32} /> },
  { id: 'replace', label: 'Replace', icon: <Swap size={32} /> }
]

interface Props {
  publicId: string
  step: number
  changeStep: (step: number) => void
  transformations: Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>
  changeTransformations: (transformation: Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>) => void
}

export function EditImage({ publicId, step, changeStep, transformations, changeTransformations }: Props) {
  const [urlTransformed, setUrlTransformed] = useState(getCldImageUrl({ src: publicId, width: 800 }))
  const [isLoading, setIsLoading] = useState(false)
  console.log({ transformations })
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!areValuesInObjTruthy(transformations)) {
      if (urlTransformed !== getCldImageUrl({ src: publicId, width: 800 })) {
        setUrlTransformed(getCldImageUrl({ src: publicId, width: 800 }))
      }

      return
    }

    const controller = new AbortController()
    const signal = controller.signal

    setIsLoading(true)

    const url = getCldImageUrl({
      src: publicId,
      replaceBackground: transformations.replaceBackground,
      replace: transformations.replace,
      remove: transformations.remove,
      quality: 100,
      width: 800
    })

    console.log({ url })

    getTransformedImage({
      url,
      maxRetries: 10,
      signal
    })
      .then(([error]) => {
        if (error) {
          console.error(error)
          return
        }

        setUrlTransformed(url)
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setIsLoading(false))

    return () => {
      controller.abort()
    }
  }, [transformations])

  useEffect(() => {
    if (publicId.length === 0) return

    const url = getCldImageUrl({ src: publicId, width: 800 })

    console.log({ badUrlMaybe: url })

    if (url.length === 0) return

    setUrlTransformed(url)
  }, [publicId])

  return (
    <section className={stack()}>
      <header className={hstack({ justify: 'space-between' })}>
        <Heading
          as="h2"
          className={hstack({
            gap: 2,
            alignItems: 'center',
            fontSize: '2xl',
            color: 'white',
            bgColor: 'primary',
            fontWeight: 'bold',
            paddingX: '4',
            paddingY: '1',
            rounded: 'full'
          })}
        >
          Edit the image to make it spooky <Ghost size={32} />
        </Heading>

        {publicId && (
          <nav className={hstack({ gap: 2 })}>
            {step > 1 && (
              <Button variant="outline" size="lg" onClick={() => changeStep(step - 1)}>
                <ArrowCircleLeft size={32} /> Back
              </Button>
            )}

            <Button size="lg" onClick={() => changeStep(step + 1)}>
              Next <ArrowCircleRight size={32} />
            </Button>
          </nav>
        )}
      </header>

      <Text as="p" marginBottom="8">
        Change the background, replace or remove things with our AI.
      </Text>

      <Tabs.Root defaultValue="background" width="max-content">
        <Tabs.List>
          {options.map((option) => (
            <Tabs.Trigger disabled={isLoading} key={option.id} value={option.id}>
              {option.label} {option.icon}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator className={css({ bgColor: 'primary' })} />
        </Tabs.List>

        <Tabs.Content value={options[0].id}>
          <form
            onSubmit={(e) => {
              e.preventDefault()

              const formData = new FormData(e.target as HTMLFormElement)
              const formPrompt = formData.get('background')

              if (formPrompt) {
                changeTransformations({
                  ...transformations,
                  replaceBackground: formPrompt.toString()
                })
              }
            }}
            className={hstack({
              gap: 2,
              marginBottom: '10',
              alignItems: 'end'
            })}
          >
            <Field.Root maxWidth="max-content" disabled={isLoading}>
              <Field.Label>Prompt to generate background</Field.Label>
              <Field.Input name="background" placeholder="Add fire..." />
            </Field.Root>

            <Button variant="outline" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Tabs.Content>

        <Tabs.Content value={options[1].id}>
          <form
            onSubmit={(e) => {
              e.preventDefault()

              const formData = new FormData(e.target as HTMLFormElement)
              const remove = formData.get('remove')

              if (remove) {
                changeTransformations({
                  ...transformations,
                  remove: remove.toString()
                })
              }
            }}
            className={hstack({
              gap: 2,
              marginBottom: '10',
              alignItems: 'end'
            })}
          >
            <Field.Root maxWidth="max-content" disabled={isLoading}>
              <Field.Label>Item to remove</Field.Label>
              <Field.Input name="remove" placeholder="Ex: Mask on the floor" />
            </Field.Root>

            <Button variant="outline" disabled={isLoading}>
              Generate
            </Button>
          </form>
        </Tabs.Content>

        <Tabs.Content value={options[2].id}>
          <form
            onSubmit={(e) => {
              e.preventDefault()

              const formData = new FormData(e.target as HTMLFormElement)
              const replace = formData.get('replace')
              const insert = formData.get('insert')

              if (replace && insert) {
                changeTransformations({
                  ...transformations,
                  replace: {
                    from: replace.toString(),
                    to: insert.toString(),
                    preserveGeometry: true
                  }
                })
              }
            }}
            className={hstack({
              gap: 2,
              marginBottom: '10',
              alignItems: 'end'
            })}
          >
            <Field.Root maxWidth="max-content" disabled={isLoading}>
              <Field.Label>Item to replace</Field.Label>
              <Field.Input required name="replace" placeholder="Clothes" />
            </Field.Root>

            <Field.Root maxWidth="max-content" disabled={isLoading}>
              <Field.Label>Item to insert</Field.Label>
              <Field.Input required name="insert" placeholder="Halloween costume" />
            </Field.Root>

            <Button variant="outline" disabled={isLoading}>
              Replace
            </Button>
          </form>
        </Tabs.Content>
      </Tabs.Root>

      <TagsInput.Root
        disabled={isLoading}
        flexDirection="row"
        alignItems="center"
        value={
          areValuesInObjTruthy(transformations)
            ? Object.entries(transformations)
                .map(([key, value]) => {
                  if (!value) return ''

                  if (key === 'replaceBackground') return 'Background'

                  if (key === 'replace') return 'Replace'

                  if (key === 'remove') return 'Remove'

                  return ''
                })
                .filter(Boolean)
            : ['None']
        }
        maxW="lg"
      >
        <TagsInput.Context>
          {(api) => (
            <>
              <TagsInput.Label>Transformations applied:</TagsInput.Label>
              <TagsInput.Control border="none" flexDirection="row">
                {api.value.map((value, index) => (
                  <TagsInput.Item key={value} index={index} value={value} disabled>
                    <TagsInput.ItemPreview>
                      <TagsInput.ItemText>{value}</TagsInput.ItemText>
                      <TagsInput.ItemDeleteTrigger
                        asChild
                        onClick={() => {
                          if (value === 'Background') {
                            changeTransformations({
                              ...transformations,
                              replaceBackground: ''
                            })
                          }
                          if (value === 'Replace') {
                            changeTransformations({
                              ...transformations,
                              replace: undefined
                            })
                          }
                          if (value === 'Remove') {
                            changeTransformations({
                              ...transformations,
                              remove: ''
                            })
                          }
                        }}
                      >
                        <IconButton
                          visibility={value === 'None' ? 'hidden' : 'visible'}
                          variant="link"
                          size="xs"
                          aria-label="Close"
                        >
                          <XCircle size={16} />
                        </IconButton>
                      </TagsInput.ItemDeleteTrigger>
                    </TagsInput.ItemPreview>
                    <TagsInput.ItemInput />
                    <TagsInput.HiddenInput />
                  </TagsInput.Item>
                ))}
              </TagsInput.Control>
            </>
          )}
        </TagsInput.Context>
      </TagsInput.Root>

      {!isLoading && publicId && urlTransformed.length > 0 && (
        <ImageWrapper>
          <Image
            unoptimized
            className={css({ objectFit: 'contain' })}
            src={urlTransformed}
            alt="image uploaded by user"
            fill
            sizes="(max-width: 80rem) 70vw, 37rem"
            priority
          />
        </ImageWrapper>
      )}

      {isLoading && (
        <ImageWrapper>
          <LoadingText />
          <Skeleton width="full" height="full" />
        </ImageWrapper>
      )}
    </section>
  )
}

function ImageWrapper({ children }: PropsWithChildren) {
  return (
    <div
      className={stack({
        position: 'relative',
        alignSelf: 'center',
        aspectRatio: '1/1',
        width: '70vw',
        height: 'auto',
        maxWidth: '37rem',
        xl: {
          width: '30vw'
        }
      })}
    >
      {children}
    </div>
  )
}
