'use client'

import {
  ArrowCircleLeft,
  ArrowCircleRight,
  Ghost,
  MinusCircle,
  SelectionBackground,
  Swap,
  WarningCircle,
  XCircle
} from '@phosphor-icons/react'
import { type GetCldImageUrlOptions, getCldImageUrl } from 'next-cloudinary'
import Image from 'next/image'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

import { Alert } from '@/components/ui/alert'
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
  { id: 'replace', label: 'Replace', icon: <Swap size={32} /> },
  { id: 'background', label: 'Background', icon: <SelectionBackground size={32} /> },
  { id: 'remove', label: 'Remove', icon: <MinusCircle size={32} /> }
]

interface Props {
  aspectRatio: string
  publicId: string
  step: number
  changeStep: (step: number) => void
  transformations: Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>
  changeTransformations: (transformation: Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>) => void
}

export function EditImage({ publicId, step, changeStep, transformations, changeTransformations, aspectRatio }: Props) {
  const [urlTransformed, setUrlTransformed] = useState(getCldImageUrl({ src: publicId, width: 800 }))
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const lastTransformation = useRef<keyof typeof transformations | null>(null)

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
    setError('')

    const url = getCldImageUrl({
      src: publicId,
      replaceBackground: transformations.replaceBackground,
      replace: transformations.replace,
      remove: transformations.remove,
      quality: 90,
      width: 800
    })

    getTransformedImage({
      url,
      maxRetries: 10,
      signal
    })
      .then(([error]) => {
        if (error) {
          if (aspectRatio.length > 0) {
            const splitAspectRatio = aspectRatio.split('/')
            const width = Number.parseInt(splitAspectRatio[0])
            const height = Number.parseInt(splitAspectRatio[1])

            if (!Number.isNaN(width) && !Number.isNaN(height)) {
              const maxMegapixels = 25
              const megapixels = (width * height) / 1_000_000

              if (megapixels > maxMegapixels) {
                setError(
                  `The image size is ${megapixels.toFixed(2)} megapixels, which exceeds the limit of ${maxMegapixels} megapixels to transform. Please select a smaller image.`
                )
                return
              }
            }
          }

          setError('An error has ocurred while transforming the image')

          return
        }

        setUrlTransformed(url)
      })
      .catch(() => {
        setError('An error has ocurred while transforming the image')
      })
      .finally(() => setIsLoading(false))

    return () => {
      controller.abort()
    }
  }, [transformations])

  useEffect(() => {
    if (publicId.length === 0) return

    const url = getCldImageUrl({ src: publicId, width: 800 })

    if (url.length === 0) return

    setUrlTransformed(url)
  }, [publicId])

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (error.length === 0) return

    if (lastTransformation.current === 'replace') {
      changeTransformations({
        ...transformations,
        replace: undefined
      })
    }

    if (lastTransformation.current === 'replaceBackground') {
      changeTransformations({
        ...transformations,
        replaceBackground: ''
      })
    }

    if (lastTransformation.current === 'remove') {
      changeTransformations({
        ...transformations,
        remove: ''
      })
    }
  }, [error])

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
          Edit the image to make it spooky <Ghost size={32} />
        </Heading>

        {publicId && (
          <nav className={hstack({ gap: 2 })}>
            {step > 1 && (
              <Button
                variant="outline"
                size={{ smDown: 'md', sm: 'lg' }}
                onClick={() => changeStep(step - 1)}
                disabled={isLoading}
              >
                <ArrowCircleLeft size={32} /> Back
              </Button>
            )}

            <Button size={{ smDown: 'md', sm: 'lg' }} onClick={() => changeStep(step + 1)} disabled={isLoading}>
              Next <ArrowCircleRight size={32} />
            </Button>
          </nav>
        )}
      </header>

      <Text as="p" marginBottom="8" fontSize={{ smDown: '0.950rem', sm: 'md' }}>
        Use our AI to modify the background, substitute objects, or remove them from the image.
      </Text>

      <div>
        <Tabs.Root defaultValue="replace" width="max-content">
          <Tabs.List>
            {options.map((option) => (
              <Tabs.Trigger
                disabled={isLoading}
                key={option.id}
                value={option.id}
                fontSize={{ smDown: 'xs', sm: 'md' }}
                paddingInline={{ smDown: '0', sm: '3' }}
              >
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
                  lastTransformation.current = 'replace'
                }
              }}
              className={hstack({
                flexDirection: 'column',
                alignItems: 'start',
                sm: {
                  flexDirection: 'row',
                  gap: 2,
                  marginBottom: '6',
                  alignItems: 'end'
                }
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

          <Tabs.Content value={options[1].id}>
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
                  lastTransformation.current = 'replaceBackground'
                }
              }}
              className={hstack({
                flexDirection: 'column',
                alignItems: 'start',
                sm: {
                  flexDirection: 'row',
                  gap: 2,
                  marginBottom: '6',
                  alignItems: 'end'
                }
              })}
            >
              <Field.Root maxWidth="max-content" disabled={isLoading}>
                <Field.Label>Prompt to generate background</Field.Label>
                <Field.Input name="background" placeholder="Create a dark forest" />
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
                const remove = formData.get('remove')

                if (remove) {
                  changeTransformations({
                    ...transformations,
                    remove: remove.toString()
                  })
                  lastTransformation.current = 'remove'
                }
              }}
              className={hstack({
                flexDirection: 'column',
                alignItems: 'start',
                sm: {
                  flexDirection: 'row',
                  gap: 2,
                  marginBottom: '6',
                  alignItems: 'end'
                }
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
        </Tabs.Root>

        <Alert.Root maxWidth="xs" paddingY="2" borderColor="red" opacity={error.length > 0 ? 'unset' : '0'}>
          <Alert.Icon asChild>
            <WarningCircle size={32} color="red" />
          </Alert.Icon>
          <Alert.Title color="red">{error}</Alert.Title>
        </Alert.Root>
      </div>

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
