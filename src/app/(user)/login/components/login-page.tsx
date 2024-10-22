'use client'

import { GithubLogo, GoogleLogo } from '@phosphor-icons/react/dist/ssr'
import { parseAsString, useQueryState } from 'nuqs'

import { signInWithOAuth } from '@/app/(user)/login/action'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { providers } from '@/const/providers'
import { stack } from '@styled-system/patterns'

export function LogInPage() {
  const [mode, setMode] = useQueryState('mode', parseAsString.withDefault('login'))

  return (
    <main
      className={stack({
        align: 'center',
        justify: 'center',
        flex: 1
      })}
    >
      <Card.Root width={{ smDown: 'full', sm: 'sm' }} asChild>
        <article>
          <Card.Header asChild>
            <header>
              {mode === 'login' ? (
                <>
                  <Card.Title>Welcome back</Card.Title>
                  <Card.Description>Log in to your account to continue</Card.Description>
                </>
              ) : (
                <>
                  <Card.Title>Join Spooky Pics</Card.Title>
                  <Card.Description>Create an account to start sharing and discovering spooky images</Card.Description>
                </>
              )}
            </header>
          </Card.Header>
          <Card.Body asChild>
            <form className={stack()} action={signInWithOAuth}>
              {providers.map((provider) => (
                <Button key={provider} name={provider} value={provider} textTransform="capitalize">
                  {provider}

                  {provider === 'github' && <GithubLogo size={32} />}
                  {provider === 'google' && <GoogleLogo size={32} />}
                </Button>
              ))}
            </form>
          </Card.Body>

          <Card.Footer asChild>
            <footer>
              {mode === 'login' ? (
                <Text as="small" textAlign="center">
                  Don't have an account?{' '}
                  <Button variant="link" color="primary" onClick={() => setMode('register')}>
                    Sign up here!
                  </Button>
                </Text>
              ) : (
                <Text as="small" textAlign="center">
                  Already have an account?{' '}
                  <Button variant="link" color="primary" onClick={() => setMode('login')}>
                    Log in here.
                  </Button>
                </Text>
              )}
            </footer>
          </Card.Footer>
        </article>
      </Card.Root>
    </main>
  )
}
