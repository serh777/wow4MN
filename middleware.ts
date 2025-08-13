import { NextResponse, type NextRequest } from 'next/server'
import { securityHeaders } from './src/middleware/security-config'

export async function middleware(request: NextRequest) {
  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard']
  // Rutas de autenticación que redirigen si ya está autenticado
  const authRoutes = ['/login', '/register']

  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.includes(request.nextUrl.pathname)

  // Obtener token de autenticación de las cookies de Supabase
  // Supabase usa cookies con el formato: sb-{project-ref}-auth-token
  const authCookies = request.cookies.getAll().filter(cookie => 
    cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
  )
  const token = authCookies.length > 0 ? authCookies[0].value : null

  // Si es una ruta protegida y no hay token, redirigir a login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si es una ruta de auth y hay token, redirigir a dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Crear respuesta con headers de seguridad
  const response = NextResponse.next()
  
  // Aplicar headers de seguridad
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}