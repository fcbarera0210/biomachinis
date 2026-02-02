import { db } from "@/lib/db";
import { modules } from "@/lib/db/schema";
import { CreateUserForm } from "@/components/admin/CreateUserForm";

async function getModules() {
  return await db.select().from(modules);
}

export default async function NewUserPage() {
  const modulesList = await getModules();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nuevo Usuario</h1>
        <p className="text-gray-500 mt-2">Crea un nuevo usuario y asigna sus permisos</p>
      </div>

      <div className="max-w-2xl">
        <CreateUserForm modules={modulesList} />
      </div>
    </div>
  );
}
