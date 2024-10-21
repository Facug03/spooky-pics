import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { ReactCompareSlider } from 'react-compare-slider'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Photos } from '@/sections/photos'
import { css } from '@styled-system/css'
import { grid, hstack, stack } from '@styled-system/patterns'

export default async function Home() {
  const supabase = createClient()
  const { data: dataUser } = await supabase.auth.getUser()
  const { error: errorPost, data: dataPost } = await supabase.from('post').select('*').range(0, 19)
  const { error: errorTag, data: dataTag } = await supabase.from('tag').select('*').order('name', { ascending: true })

  if (errorPost || !dataPost || errorTag || !dataTag) {
    return null
  }

  return (
    <main className={stack({ paddingY: '28', gap: '28' })}>
      <section>
        <Heading
          as="h1"
          className={css({
            textAlign: 'center',
            fontSize: '6xl',
            fontWeight: 'bold ',
            lineHeight: 'tight',
            marginBottom: '8'
          })}
        >
          Discover your favorites <br />
          <div className={css({ position: 'relative', height: '16', width: 'auto' })}>
            <Image src="/spooky-logo.svg" alt="Spooky Pics" fill />
          </div>
        </Heading>

        <Text
          as="p"
          className={css({
            textAlign: 'center',
            fontSize: 'xl',
            lineHeight: 'tight',
            marginBottom: '4',
            color: 'gray.11'
          })}
        >
          Share your spookiest moments with the world, discover costumes, decorations and more.
        </Text>

        <div className={hstack({ gap: '8', justifyContent: 'center' })}>
          <Button size="lg" bgColor="primary" asChild>
            <Link href="/#content">Discover</Link>
          </Button>

          {!dataUser.user && (
            <Button size="lg" variant="outline">
              Register
            </Button>
          )}
        </div>
      </section>

      <section>
        <Heading as="h2" className={css({ fontSize: '4xl', fontWeight: 'bold' })}>
          Find your next <span className={css({ color: 'primary' })}>costume</span> and{' '}
          <span className={css({ color: 'primary' })}>share it with others</span>
        </Heading>

        <Text as="p" className={css({ fontSize: 'lg', marginBottom: '8', color: 'gray.11' })}>
          You can spookify your images with our AI.
        </Text>

        <ReactCompareSlider
          className={stack({
            margin: '0 auto',
            position: 'relative',
            alignSelf: 'center',
            aspectRatio: '16/9',
            width: '70vw',
            height: 'auto',
            maxWidth: '45rem',
            xl: {
              width: '50vw'
            }
          })}
          itemOne={
            <Image
              className={css({ objectFit: 'cover', objectPosition: 'top' })}
              src="https://res.cloudinary.com/dlkdvbani/image/upload/c_limit,w_800/f_auto/q_auto/v1/spooky/c1zzpnllr4ekwijjcenc?_a=BAVCyODW0"
              alt="Image one"
              fill
            />
          }
          itemTwo={
            <Image
              className={css({ objectFit: 'cover', objectPosition: 'top' })}
              src="https://res.cloudinary.com/dlkdvbani/image/upload/e_gen_replace:from_male;to_frankenstein%20costume;preserve-geometry_true/c_limit,w_800/f_auto/q_auto/v1/spooky/c1zzpnllr4ekwijjcenc?_a=BAVCyODW0"
              alt="Image two"
              fill
            />
          }
        />
      </section>

      <section>
        <ul className={grid({ gridTemplateColumns: 'repeat(auto-fit, minmax(9.375rem, 1fr))', gap: '2' })}>
          {dataTag.map((tag) => {
            return (
              <li key={tag.name}>
                <Button size="md" width="full" variant="outline" textTransform="capitalize" asChild>
                  <Link href={`/tag/${tag.name}`}>{tag.name}</Link>
                </Button>
              </li>
            )
          })}
        </ul>
      </section>

      <Photos items={dataPost} />
    </main>
  )
}
