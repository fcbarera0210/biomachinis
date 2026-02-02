import { db } from "@/lib/db";
import { users, userModules, modules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditUserForm } from "@/components/admin/EditUserForm";

async function getUser(id: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return user;
}

async function getUserModules(userId: string) {
  const userModulesList = await db
    .select({ moduleId: userModules.moduleId })
    .from(userModules)
    .where(eq(userModules.userId, userId));
  return userModulesList.map((um) => um.moduleId);
}

async function getAllModules() {
  return await db.select().from(modules);
}

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  const userModuleIds = await getUserModules(id);
  const allModules = await getAllModules();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Usuario</h1>
        <p className="text-gray-500 mt-2">Modifica los datos del usuario y sus permisos</p>
      </div>

      <div className="max-w-2xl">
        <EditUserForm user={user} modules={allModules} selectedModuleIds={userModuleIds} />
      </div>
    </div>
  );
}
