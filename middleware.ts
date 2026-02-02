import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Verificar si existe la cookie de sesión de NextAuth
  // NextAuth usa el nombre de cookie: next-auth.session-token (o authjs.session-token en v5)
  const sessionToken = request.cookies.get("authjs.session-token") || 
                       request.cookies.get("__Secure-authjs.session-token") ||
                       request.cookies.get("next-auth.session-token") ||
                       request.cookies.get("__Secure-next-auth.session-token");
  
  const hasSession = !!sessionToken;
  
  // Si es la ruta de login, verificar si ya está autenticado
  if (pathname === "/admin/login") {
    if (hasSession) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Si no está autenticado, permitir acceso
    return NextResponse.next();
  }

  // Para todas las demás rutas /admin/*, verificar autenticación
  if (pathname.startsWith("/admin")) {
    if (!hasSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
