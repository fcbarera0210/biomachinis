import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteUserButton } from "@/components/admin/DeleteUserButton";
import { getCurrentUser } from "@/lib/auth/session";

async function getUsers() {
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export default async function UsersPage() {
  const usersList = await getUsers();
  const currentUser = await getCurrentUser();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Link href="/admin/usuarios/nuevo">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-darkBg-card rounded-2xl shadow-sm border dark:border-darkBg-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-darkBg text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha de Creación</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-darkBg-accent text-sm">
              {usersList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay usuarios aún
                  </td>
                </tr>
              ) : (
                usersList.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-darkBg-accent transition"
                  >
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          user.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/usuarios/${user.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        {currentUser?.id !== user.id && (
                          <DeleteUserButton userId={user.id} userName={user.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
