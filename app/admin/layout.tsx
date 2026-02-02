import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserModules } from "@/lib/auth/permissions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El middleware ya maneja la autenticación, así que aquí solo obtenemos el usuario
  // Si no hay usuario, el middleware ya redirigió
  const user = await getCurrentUser();
  
  // Si por alguna razón no hay usuario (no debería pasar), retornar solo children
  if (!user) {
    return <>{children}</>;
  }

  const userModules = await getUserModules(user.id);

  return (
    <div className="bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 flex min-h-screen">
      <Sidebar userModules={userModules} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar userName={user.name} userEmail={user.email} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
