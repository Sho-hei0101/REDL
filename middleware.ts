import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Public routes
  const isPublicRoute = pathname.startsWith('/p/') || pathname === '/login'

  // Protected app routes
  const isProtectedRoute = pathname.startsWith('/app')

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/app/dashboard', req.url))
  }

  if (pathname === '/' && isLoggedIn) {
    return NextResponse.redirect(new URL('/app/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
