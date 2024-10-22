import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Header } from '@/sections/header'
import { stack } from '@styled-system/patterns'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'Spooky Pics - Discover and Share Spooky Images',
  description:
    'Explore and upload haunting, spooky images in our growing collection. Join the Spooky Pics community and unleash your creativity!',
  icons: {
    icon: '/favicon.svg'
  },
  generator: 'Next.js',
  authors: [{ name: 'Facu', url: 'https://www.linkedin.com/in/facundogonza/' }],
  creator: 'Facundo Gonzalez'
}

export default function RootLayout({
  children,
  modal
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body
        className={stack({
          maxWidth: '85.375rem',
          margin: '0 auto',
          minHeight: '100dvh',
          paddingX: 4,
          gap: 0
        })}
      >
        <Header />
        {children}
        {modal}
        <div id="modal-root" />
      </body>
    </html>
  )
}
