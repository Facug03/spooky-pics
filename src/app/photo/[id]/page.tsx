import { CalendarBlank } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import { getCldOgImageUrl } from 'next-cloudinary'
import Image from 'next/image'
import Link from 'next/link'
import { Suspense, cache } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { createClient } from '@/utils/supabase/server'
import { css } from '@styled-system/css'
import { hstack, stack } from '@styled-system/patterns'
import { Download } from './components/download'
import { Like } from './components/like'
import { Related } from './sections/related'

interface Props {
  params: {
    id: string
  }
}

const getPhoto = cache(async (id: string) => {
  const supabase = createClient()
  const resp = await supabase.from('post').select('*, user!post_user_id_fkey1 (*), tag (name)').eq('id', id).single()

  return resp
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { error, data } = await getPhoto(params.id)

  if (error) {
    throw error
  }

  const url = getCldOgImageUrl({
    src: data.image_public_id,
    width: 800
  })

  return {
    title: `${data.title || 'Spooky Pic'} | Spooky Pics`,
    description: `${data.description || 'A mysterious and captivating photo from Spooky Pics.'}`,
    openGraph: {
      type: 'website',
      siteName: 'Spooky Pics',
      locale: 'en_US',
      description: `${data.description || 'A mysterious and captivating photo from Spooky Pics.'}`,
      title: `${data.title || 'Spooky Pic'} | Spooky Pics`,
      images: [
        {
          url: url,
          width: 800
        }
      ]
    }
  }
}

export default async function Photo({ params }: Props) {
  const supabase = createClient()
  const { error, data } = await getPhoto(params.id)
  const { data: dataUser } = await supabase.auth.getUser()
  const { data: dataLike } = await supabase
    .from('like')
    .select('*')
    .match({ post_id: params.id, user_id: dataUser.user?.id })
    .single()

  if (error || !data) {
    return null
  }

  const { user, tag, ...post } = data

  const date = new Date(post.created_at)
  const dateFormatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const aspectRatio = (post.aspect_ratio ? post.aspect_ratio : '1/1').split('/')
  const isHorizontal = Number.parseInt(aspectRatio[0]) / Number.parseInt(aspectRatio[1]) >= 1

  return (
    <main className={stack({ paddingY: '10', gap: '8' })}>
      <section className={stack({ gap: '8' })}>
        <header
          className={hstack({
            flexDirection: 'column',
            gap: '2',
            alignItems: 'flex-start',
            sm: {
              justifyContent: 'space-between',
              flexDirection: 'row'
            }
          })}
        >
          <div className={hstack({ gap: '2' })}>
            <Avatar src={user?.avatar_url ?? ''} name={user?.full_name ?? ''} />
            <Text as="p" className={css({ fontSize: 'md' })}>
              {user?.user_name}
            </Text>
          </div>

          <div className={hstack({ gap: '2' })}>
            <Like postId={post.id} liked={Boolean(dataLike)} isAuthenticated={Boolean(dataUser.user)} />

            <Download imageUrl={post.image_url} />
          </div>
        </header>

        <div
          className={css({
            position: 'relative',
            margin: '0 auto',
            alignSelf: 'center',
            width: '100%',
            height: 'auto',
            '@media (min-width: 350px)': {
              width: isHorizontal ? '100%' : '75%'
            },
            '@media (min-width: 500px)': {
              width: isHorizontal ? '90%' : '60%'
            },
            sm: {
              width: isHorizontal ? '75%' : '35%'
            }
          })}
          style={{ aspectRatio: post.aspect_ratio ? post.aspect_ratio : '1/1' }}
        >
          <Image
            className={css({ objectFit: 'contain' })}
            src={post.image_url}
            alt={post.title ?? 'image uploaded'}
            fill
            priority
          />
        </div>

        <div>
          {post.title && (
            <Heading as="h1" fontSize="2xl">
              {post.title}
            </Heading>
          )}

          {post.description && (
            <Text as="p" color="gray">
              {post.description}
            </Text>
          )}
        </div>

        <div className={stack()}>
          {/* TODO <div>
            <div className={hstack({ gap: '2' })}>
              <DownloadSimple size={18} />
              <Text as="p" color="gray" fontSize="sm">
                Downloads {post.download_count}
              </Text>
            </div>
          </div> */}

          <div>
            <div className={hstack({ gap: '2' })}>
              <CalendarBlank size={18} />
              <Text as="p" color="gray" fontSize="sm">
                Published on {dateFormatted}
              </Text>
            </div>
          </div>
        </div>

        {tag.length > 0 && (
          <div className={hstack({ gap: '2' })}>
            {tag.map((tag) => (
              <Button key={tag.name} size="sm" variant="subtle" textTransform="capitalize" fontWeight="normal" asChild>
                <Link href={`/tag/${tag.name}`}>{tag.name}</Link>
              </Button>
            ))}
          </div>
        )}
      </section>

      <Suspense fallback={<div>Loading...</div>}>
        <Related postId={params.id} tags={tag} />
      </Suspense>
    </main>
  )
}
