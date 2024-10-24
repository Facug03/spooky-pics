'use client'

import { createListCollection } from '@ark-ui/react'
import { ArrowCircleLeft, CaretDown, CheckCircle, RocketLaunch } from '@phosphor-icons/react'
import { type GetCldImageUrlOptions, getCldImageUrl } from 'next-cloudinary'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { FormLabel } from '@/components/ui/form-label'
import { Heading } from '@/components/ui/heading'
import { Select } from '@/components/ui/select'
import { Text } from '@/components/ui/text'
import { Textarea } from '@/components/ui/textarea'
import type { Tag } from '@/types/tag'
import { capitalize } from '@/utils/capitalize'
import { css } from '@styled-system/css'
import { hstack, stack } from '@styled-system/patterns'
import { uploadPost } from '../actions/upload-post'

interface Props {
  aspectRatio: string
  tags: Tag[]
  step: number
  changeStep: (step: number) => void
  transformations: Pick<GetCldImageUrlOptions, 'replaceBackground' | 'replace' | 'remove'>
  publicId: string
}

export function LastStep({ aspectRatio, tags, changeStep, publicId, step, transformations }: Props) {
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    tags: '',
    errorUploading: ''
  })
  const [tagsSelected, setTagsSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const collection = createListCollection({
    items: tags.map((tag) => ({ label: capitalize(tag.name), value: tag.name }))
  })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    if (tagsSelected.length === 0) {
      setErrors({
        ...errors,
        tags: 'At least one tag is required'
      })

      return
    }

    if (tagsSelected.length > 5) {
      setErrors({
        ...errors,
        tags: 'Max 5 tags are allowed'
      })

      return
    }

    setErrors({
      title: '',
      description: '',
      tags: '',
      errorUploading: ''
    })
    setLoading(true)
    try {
      await uploadPost({
        aspectRatio,
        description,
        image_url: getCldImageUrl({
          src: publicId,
          replaceBackground: transformations.replaceBackground,
          replace: transformations.replace,
          remove: transformations.remove,
          width: 800
        }),
        tags: tagsSelected,
        title,
        publicId
      })
    } catch (_) {
      setLoading(false)
      setErrors({
        title: '',
        description: '',
        tags: '',
        errorUploading: 'An error has ocurred while uploading the image.'
      })
    }
  }

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
          Last Step <RocketLaunch size={32} />
        </Heading>

        {publicId && (
          <nav className={hstack({ gap: 2 })}>
            {step > 1 && (
              <Button variant="outline" onClick={() => changeStep(step - 1)} size={{ smDown: 'md', sm: 'lg' }}>
                <ArrowCircleLeft size={32} /> Back
              </Button>
            )}
          </nav>
        )}
      </header>

      <Text as="p" marginBottom="8" fontSize={{ smDown: '0.950rem', sm: 'md' }}>
        Finish the final details and save your image.
      </Text>

      <form
        onSubmit={onSubmit}
        className={stack({
          gap: 6,
          maxWidth: '3xl'
        })}
      >
        <Field.Root invalid={errors.title.length > 0}>
          <Field.Label>
            Title - <span className={css({ fontStyle: 'italic' })}>Optional</span>
          </Field.Label>
          <Field.Input maxLength={200} name="title" />

          <Field.ErrorText>{errors.title}</Field.ErrorText>
        </Field.Root>

        <div className={stack({ gap: 2 })}>
          <Field.Root invalid={errors.description.length > 0}>
            <FormLabel htmlFor="description">
              Description - <span className={css({ fontStyle: 'italic' })}>Optional</span>
            </FormLabel>
            <Textarea id="description" rows={4} resize="none" name="description" placeholder="Description" />

            <Field.ErrorText>{errors.description}</Field.ErrorText>
          </Field.Root>
        </div>

        {tags.length > 0 && (
          <Field.Root invalid={errors.tags.length > 0}>
            <Select.Root
              name="tags"
              collection={collection}
              multiple
              closeOnSelect={false}
              positioning={{ sameWidth: true }}
              required
              value={tagsSelected}
              onValueChange={(e) => {
                setTagsSelected([...e.value])
              }}
            >
              <Select.Label>Tags</Select.Label>
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="Select tags" />
                  <CaretDown size={32} />
                </Select.Trigger>
              </Select.Control>

              <Select.Positioner>
                <Select.Content maxH="xs" overflowY="scroll">
                  <Select.ItemGroup>
                    {collection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckCircle size={32} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Select.Root>

            <Field.HelperText>Max 5 tags</Field.HelperText>
            <Field.ErrorText>{errors.tags}</Field.ErrorText>
          </Field.Root>
        )}

        <div className={stack()}>
          <Button
            size={{ smDown: 'md', sm: 'lg' }}
            bgColor="primary"
            loading={loading}
            loadingText={loading ? 'Uploading...' : ''}
          >
            Save
          </Button>
          {errors.errorUploading.length > 0 && (
            <small className={css({ fontSize: 'sm', color: 'red' })}>{errors.errorUploading}</small>
          )}
          <small className={css({ fontSize: 'sm', color: 'gray.11' })}>
            If your image is not spooky enough, it will be automatically removed.
          </small>
        </div>
      </form>
    </section>
  )
}
