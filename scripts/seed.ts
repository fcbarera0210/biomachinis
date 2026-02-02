import "dotenv/config";
import { config } from "dotenv";
import { resolve } from "path";

// Cargar variables de entorno desde .env.local o .env
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

// Verificar que DATABASE_URL esté definida
if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL no está definida en las variables de entorno");
  console.error("   Asegúrate de tener un archivo .env.local o .env con DATABASE_URL");
  process.exit(1);
}

import { db } from "../lib/db";
import { users, modules, userModules, tags, posts, postTags } from "../lib/db/schema";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("🌱 Iniciando seed...");

    // Crear módulos
    console.log("📦 Creando módulos...");
    const [newsModule, userModule, tagModule] = await db
      .insert(modules)
      .values([
        { code: "NEWS_MANAGE", name: "Gestión de Noticias" },
        { code: "USER_MANAGE", name: "Gestión de Usuarios" },
        { code: "TAG_MANAGE", name: "Gestión de Etiquetas" },
      ])
      .returning();

    console.log("✅ Módulos creados");

    // Crear usuario admin
    console.log("👤 Creando usuario admin...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const [adminUser] = await db
      .insert(users)
      .values({
        name: "Admin Usuario",
        email: "admin@biomachinis.com",
        password: hashedPassword,
        isActive: true,
      })
      .returning();

    // Asignar todos los módulos al admin
    await db.insert(userModules).values([
      { userId: adminUser.id, moduleId: newsModule.id },
      { userId: adminUser.id, moduleId: userModule.id },
      { userId: adminUser.id, moduleId: tagModule.id },
    ]);

    console.log("✅ Usuario admin creado (admin@biomachinis.com / admin123)");

    // Crear etiquetas
    console.log("🏷️ Creando etiquetas...");
    const [tag1, tag2, tag3, tag4] = await db
      .insert(tags)
      .values([
        { name: "CrossFit", slug: "crossfit" },
        { name: "Calistenia", slug: "calistenia" },
        { name: "Powerlifting", slug: "powerlifting" },
        { name: "Nutrición", slug: "nutricion" },
      ])
      .returning();

    console.log("✅ Etiquetas creadas");

    // Crear posts de ejemplo
    console.log("📰 Creando posts de ejemplo...");
    const [post1] = await db
      .insert(posts)
      .values({
        title: "Guía Completa de CrossFit para Principiantes",
        slug: "guia-completa-crossfit-principiantes",
        excerpt: "Aprende los fundamentos del CrossFit y cómo comenzar tu viaje hacia una mejor condición física.",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "El CrossFit es un programa de entrenamiento de fuerza y acondicionamiento que combina ejercicios de alta intensidad con movimientos funcionales.",
                },
              ],
            },
          ],
        }),
        coverImageUrl: "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        published: true,
        authorId: adminUser.id,
      })
      .returning();

    const [post2] = await db
      .insert(posts)
      .values({
        title: "Calistenia: Entrenamiento con el Peso Corporal",
        slug: "calistenia-entrenamiento-peso-corporal",
        excerpt: "Descubre cómo la calistenia puede transformar tu cuerpo usando solo tu peso corporal.",
        content: JSON.stringify({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "La calistenia es una forma de entrenamiento que utiliza el peso del cuerpo para desarrollar fuerza, flexibilidad y resistencia.",
                },
              ],
            },
          ],
        }),
        coverImageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        published: true,
        authorId: adminUser.id,
      })
      .returning();

    // Asignar etiquetas a los posts
    await db.insert(postTags).values([
      { postId: post1.id, tagId: tag1.id },
      { postId: post1.id, tagId: tag4.id },
      { postId: post2.id, tagId: tag2.id },
      { postId: post2.id, tagId: tag4.id },
    ]);

    console.log("✅ Posts de ejemplo creados");

    console.log("🎉 Seed completado exitosamente!");
    console.log("\n📋 Credenciales de acceso:");
    console.log("   Email: admin@biomachinis.com");
    console.log("   Password: admin123");
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log("✅ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error fatal:", error);
    process.exit(1);
  });
