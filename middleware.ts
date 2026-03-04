import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const publicPaths = ['/login', '/signup', '/auth/callback', '/demo']
const protectedPaths = [
  '/cockpit', '/agents', '/approvals',
  '/integrations', '/settings', '/activity', '/workflows',
]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Authenticated user on login/signup → send to cockpit
  if (user && publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/cockpit', request.url))
  }

  // Unauthenticated user on protected route → send to login
  if (!user && protectedPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/cockpit/:path*', '/agents/:path*', '/approvals/:path*',
    '/integrations/:path*', '/settings/:path*', '/activity/:path*',
    '/workflows/:path*', '/login', '/signup',
  ],
}