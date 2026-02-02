"use server";

import { db } from "@/lib/db";
import { posts, postTags } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { generateSlug } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/session";

export async function createPost(data: {
  title: string;
  excerpt?: string;
  content: string;
  coverImageUrl?: string;
  published: boolean;
  tagIds: number[];
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    // Generar slug único
    const baseSlug = generateSlug(data.title);
    const existingSlugs = await db
      .select({ slug: posts.slug })
      .from(posts);
    const slugs = existingSlugs.map((p) => p.slug);
    
    let slug = baseSlug;
    let counter = 1;
    while (slugs.includes(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Crear post en una transacción
    const result = await db.transaction(async (tx) => {
      const [newPost] = await tx
        .insert(posts)
        .values({
          title: data.title,
          slug,
          excerpt: data.excerpt || null,
          content: data.content,
          coverImageUrl: data.coverImageUrl || null,
          published: data.published,
          authorId: user.id,
        })
        .returning();

      // Insertar relaciones con etiquetas
      if (data.tagIds.length > 0) {
        await tx.insert(postTags).values(
          data.tagIds.map((tagId) => ({
            postId: newPost.id,
            tagId,
          }))
        );
      }

      return newPost;
    });

    revalidatePath("/admin/noticias");
    revalidatePath("/");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "Error al crear la noticia" };
  }
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    excerpt?: string;
    content: string;
    coverImageUrl?: string;
    published: boolean;
    tagIds: number[];
  }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    // Verificar que el post existe y pertenece al usuario
    const existingPost = await db.query.posts.findFirst({
      where: eq(posts.id, id),
    });

    if (!existingPost) {
      return { error: "Noticia no encontrada" };
    }

    // Generar nuevo slug si el título cambió
    let slug = existingPost.slug;
    if (data.title !== existingPost.title) {
      const baseSlug = generateSlug(data.title);
      const existingSlugs = await db
        .select({ slug: posts.slug })
        .from(posts)
        .where(sql`${posts.id} != ${id}`);
      const slugs = existingSlugs.map((p) => p.slug);
      
      slug = baseSlug;
      let counter = 1;
      while (slugs.includes(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Actualizar post y etiquetas en una transacción
    await db.transaction(async (tx) => {
      await tx.update(posts).set({
        title: data.title,
        slug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImageUrl: data.coverImageUrl || null,
        published: data.published,
      }).where(eq(posts.id, id));

      // Eliminar relaciones existentes
      await tx.delete(postTags).where(eq(postTags.postId, id));

      // Insertar nuevas relaciones
      if (data.tagIds.length > 0) {
        await tx.insert(postTags).values(
          data.tagIds.map((tagId) => ({
            postId: id,
            tagId,
          }))
        );
      }
    });

    revalidatePath("/admin/noticias");
    revalidatePath(`/noticias/${slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "Error al actualizar la noticia" };
  }
}

export async function deletePost(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: "No autorizado" };
    }

    await db.delete(posts).where(eq(posts.id, id));
    revalidatePath("/admin/noticias");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: "Error al eliminar la noticia" };
  }
}
