import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Si es la ruta de login, verificar si ya está autenticado
  if (pathname === "/admin/login") {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Si no está autenticado, permitir acceso
    return NextResponse.next();
  }

  // Para todas las demás rutas /admin/*, verificar autenticación
  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
