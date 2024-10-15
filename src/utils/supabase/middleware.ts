import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { config } from '@/config'

const restrictedAuthRoutes = ['/login']
const protectedRoutes = ['/upload']

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    config.NEXT_PUBLIC_SUPABASE_URL ?? '',
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value)
          }
          supabaseResponse = NextResponse.next({
            request
          })
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options)
          }
        }
      }
    }
  )

  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  const currentPath = request.nextUrl.pathname

  const isRestrictedAuthRoutes = restrictedAuthRoutes.includes(currentPath)

  if (user && isRestrictedAuthRoutes) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const isProtectedRoute = protectedRoutes.includes(currentPath)

  if (!isProtectedRoute) return supabaseResponse

  if (!user || error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}
