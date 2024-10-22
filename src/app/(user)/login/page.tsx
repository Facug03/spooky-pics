import type { Metadata } from 'next'

import { LogInPage } from './components/login-page'

export const metadata: Metadata = {
  title: 'Log In | Spooky Pics',
  description:
    'Access your Spooky Pics account to discover, share, and save your favorite spooky images. Log in to continue exploring the best spooky content!'
}

export default function LogIn() {
  return <LogInPage />
}
