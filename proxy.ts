import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('jwt_token')

  // If going to a protected route and no token exists
  if (request.nextUrl.pathname.startsWith('/todo') && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If going to login/register and token exists, you might want to redirect to /todo
  if ((request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/register') && token) {
    // Optionally uncomment to prevent logged in users from seeing login again
    // return NextResponse.redirect(new URL('/todo', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/register', '/todo/:path*'],
}
