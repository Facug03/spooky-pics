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
    tags: ''
  })
  const [tagsSelected, setTagsSelected] = useState<string[]>([])

  const collection = createListCollection({
    items: tags.map((tag) => ({ label: capitalize(tag.name), value: tag.name }))
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    console.log(title, description, tagsSelected)

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
      tags: ''
    })
    uploadPost({
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
  }

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
          Last Step <RocketLaunch size={32} />
        </Heading>

        {publicId && (
          <nav className={hstack({ gap: 2 })}>
            {step > 1 && (
              <Button variant="outline" onClick={() => changeStep(step - 1)} size="lg">
                <ArrowCircleLeft size={32} /> Back
              </Button>
            )}
          </nav>
        )}
      </header>

      <Text as="p" marginBottom="8">
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
                  <Select.ValueText placeholder="Select a Framework" />
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

        <Button size="lg" bgColor="primary">
          Save
        </Button>
      </form>
    </section>
  )
}
