import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;

// Asegurar que las rutas de auth usen Node.js runtime
export const runtime = "nodejs";
