"use server";

import { db } from "@/lib/db";
import { users, userModules, modules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  moduleIds: number[];
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { error: "No autorizado" };
    }

    // Verificar si el email ya existe
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existing) {
      return { error: "Ya existe un usuario con ese email" };
    }

    // Hashear password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear usuario y asignar módulos en una transacción
    const result = await db.transaction(async (tx) => {
      const [newUser] = await tx
        .insert(users)
        .values({
          name: data.name,
          email: data.email,
          password: hashedPassword,
          isActive: data.isActive,
        })
        .returning();

      // Asignar módulos
      if (data.moduleIds.length > 0) {
        await tx.insert(userModules).values(
          data.moduleIds.map((moduleId) => ({
            userId: newUser.id,
            moduleId,
          }))
        );
      }

      return newUser;
    });

    revalidatePath("/admin/usuarios");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Error al crear el usuario" };
  }
}

export async function updateUser(
  id: string,
  data: {
    name: string;
    email: string;
    password?: string;
    isActive: boolean;
    moduleIds: number[];
  }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { error: "No autorizado" };
    }

    // Verificar si el email ya existe en otro usuario
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existing && existing.id !== id) {
      return { error: "Ya existe otro usuario con ese email" };
    }

    // Actualizar usuario y módulos en una transacción
    await db.transaction(async (tx) => {
      const updateData: any = {
        name: data.name,
        email: data.email,
        isActive: data.isActive,
      };

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      await tx.update(users).set(updateData).where(eq(users.id, id));

      // Eliminar módulos existentes
      await tx.delete(userModules).where(eq(userModules.userId, id));

      // Insertar nuevos módulos
      if (data.moduleIds.length > 0) {
        await tx.insert(userModules).values(
          data.moduleIds.map((moduleId) => ({
            userId: id,
            moduleId,
          }))
        );
      }
    });

    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Error al actualizar el usuario" };
  }
}

export async function deleteUser(id: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { error: "No autorizado" };
    }

    // No permitir eliminar el propio usuario
    if (currentUser.id === id) {
      return { error: "No puedes eliminar tu propio usuario" };
    }

    await db.delete(users).where(eq(users.id, id));
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Error al eliminar el usuario" };
  }
}
