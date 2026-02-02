import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

async function getPosts() {
  return await db.select().from(posts).orderBy(desc(posts.createdAt));
}

export default async function PostsPage() {
  const postsList = await getPosts();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Noticias</h1>
        <Link href="/admin/noticias/nuevo">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Noticia
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-darkBg-card rounded-2xl shadow-sm border dark:border-darkBg-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-darkBg text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Fecha</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Vistas</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-darkBg-accent text-sm">
              {postsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No hay noticias aún
                  </td>
                </tr>
              ) : (
                postsList.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-gray-50 dark:hover:bg-darkBg-accent transition"
                  >
                    <td className="px-6 py-4 font-medium max-w-xs truncate">
                      {post.title}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          post.published
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {post.published ? "Publicado" : "Borrador"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{post.views}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/noticias/${post.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
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
