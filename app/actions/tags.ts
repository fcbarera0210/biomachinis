"use server";

import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";

export async function createTag(name: string) {
  try {
    // Verificar si ya existe una etiqueta con ese nombre
    const existing = await db.query.tags.findFirst({
      where: eq(tags.name, name),
    });

    if (existing) {
      return { error: "Ya existe una etiqueta con ese nombre" };
    }

    const slug = generateSlug(name);

    // Verificar si el slug ya existe
    const existingSlug = await db.query.tags.findFirst({
      where: eq(tags.slug, slug),
    });

    if (existingSlug) {
      return { error: "El slug generado ya existe" };
    }

    const newTag = await db
      .insert(tags)
      .values({
        name,
        slug,
      })
      .returning();

    revalidatePath("/admin/etiquetas");
    return { success: true, data: newTag[0] };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { error: "Error al crear la etiqueta" };
  }
}

export async function updateTag(id: number, name: string) {
  try {
    // Verificar si ya existe otra etiqueta con ese nombre
    const existing = await db.query.tags.findFirst({
      where: eq(tags.name, name),
    });

    if (existing && existing.id !== id) {
      return { error: "Ya existe otra etiqueta con ese nombre" };
    }

    const slug = generateSlug(name);

    // Verificar si el slug ya existe en otra etiqueta
    const existingSlug = await db.query.tags.findFirst({
      where: eq(tags.slug, slug),
    });

    if (existingSlug && existingSlug.id !== id) {
      return { error: "El slug generado ya existe" };
    }

    const updatedTag = await db
      .update(tags)
      .set({ name, slug })
      .where(eq(tags.id, id))
      .returning();

    revalidatePath("/admin/etiquetas");
    return { success: true, data: updatedTag[0] };
  } catch (error) {
    console.error("Error updating tag:", error);
    return { error: "Error al actualizar la etiqueta" };
  }
}

export async function deleteTag(id: number) {
  try {
    await db.delete(tags).where(eq(tags.id, id));
    revalidatePath("/admin/etiquetas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { error: "Error al eliminar la etiqueta" };
  }
}
