import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const protectedRoutes = ['/dashboard', '/admin', '/scanner', '/jury']
  const isProtected = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (!isProtected) return NextResponse.next()

  const token = req.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    verifyToken(token)
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/scanner/:path*', '/jury/:path*']
}