import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Protect admin routes only
  if (pathname.startsWith('/admin')) {
    const session = req.cookies.get('sb-auth-token')

    if (!session) {
      return NextResponse.redirect(
        new URL('/admin/login', req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}