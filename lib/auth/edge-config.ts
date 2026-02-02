import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Configuración para Edge Runtime
// Los providers se cargan de forma lazy para evitar imports de Node.js en tiempo de importación
export const { auth } = NextAuth({
  providers: [
    // Provider dummy para Edge Runtime - la autenticación real se hace en las rutas de API
    Credentials({
      name: "Credentials",
      credentials: {},
      async authorize() {
        // Esta función nunca se ejecuta en el middleware
        // Solo se usa para validar tokens JWT existentes
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
