import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = req.cookies.get('sb-auth-token')

  // Login page: if already logged in, go straight to the dashboard
  if (pathname === '/admin/login') {
    if (session) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // Everything else (dashboard + admin) requires login
  if (!session) {
    return NextResponse.redirect(
      new URL('/admin/login', req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  // Protect the dashboard and all admin pages.
  // Excludes /api, static assets, and files with extensions.
  matcher: ['/', '/admin/:path*'],
}
