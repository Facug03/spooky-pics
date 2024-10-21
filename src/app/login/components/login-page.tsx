import { GithubLogo, GoogleLogo } from '@phosphor-icons/react/dist/ssr'

import { signInWithOAuth } from '@/app/login/action'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { providers } from '@/const/providers'
import { stack } from '@styled-system/patterns'

export function LogInPage() {
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
              <Card.Title>Welcome back</Card.Title>
              <Card.Description>Log in to your account to continue</Card.Description>
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
        </article>
      </Card.Root>
    </main>
  )
}
