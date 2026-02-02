import { pgTable, serial, text, uuid, boolean, timestamp, integer, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabla de usuarios
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de módulos
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
});

// Tabla pivote de permisos de usuario
export const userModules = pgTable("user_modules", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  moduleId: integer("module_id").notNull().references(() => modules.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: unique().on(table.userId, table.moduleId),
}));

// Tabla de etiquetas
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

// Tabla de posts (noticias)
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(), // JSON string del contenido de Tiptap
  coverImageUrl: text("cover_image_url"),
  views: integer("views").default(0).notNull(),
  published: boolean("published").default(false).notNull(),
  authorId: uuid("author_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla pivote de etiquetas de posts
export const postTags = pgTable("post_tags", {
  postId: uuid("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
  tagId: integer("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (table) => ({
  pk: unique().on(table.postId, table.tagId),
}));

// Relaciones
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  userModules: many(userModules),
}));

export const modulesRelations = relations(modules, ({ many }) => ({
  userModules: many(userModules),
}));

export const userModulesRelations = relations(userModules, ({ one }) => ({
  user: one(users, {
    fields: [userModules.userId],
    references: [users.id],
  }),
  module: one(modules, {
    fields: [userModules.moduleId],
    references: [modules.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

// Tipos TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;
export type UserModule = typeof userModules.$inferSelect;
export type NewUserModule = typeof userModules.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;
export type NewPostTag = typeof postTags.$inferInsert;
