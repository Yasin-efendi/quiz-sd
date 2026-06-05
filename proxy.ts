import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req: any) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // console.log('PROXY:', pathname, '| loggedIn:', isLoggedIn)

  const isLoginPage = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin')

  if (isLoginPage) {
    return NextResponse.next()
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}