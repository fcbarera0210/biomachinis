import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Newspaper, Eye, TrendingUp } from "lucide-react";

async function getStats() {
  const totalPosts = await db.select({ count: sql<number>`count(*)` }).from(posts);
  const totalViews = await db.select({ sum: sql<number>`sum(${posts.views})` }).from(posts);
  const publishedPosts = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(sql`${posts.published} = true`);

  return {
    totalPosts: Number(totalPosts[0]?.count || 0),
    totalViews: Number(totalViews[0]?.sum || 0),
    publishedPosts: Number(publishedPosts[0]?.count || 0),
  };
}

async function getRecentPosts() {
  const recentPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(5);

  return recentPosts;
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentPosts = await getRecentPosts();

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Dashboard Section */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-darkBg-card p-6 rounded-2xl shadow-sm border dark:border-darkBg-accent">
              <p className="text-gray-500 text-sm mb-1">Total Noticias</p>
              <h4 className="text-2xl font-bold">{stats.totalPosts}</h4>
              <span className="text-green-500 text-xs font-semibold flex items-center mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.publishedPosts} publicadas
              </span>
            </div>
            <div className="bg-white dark:bg-darkBg-card p-6 rounded-2xl shadow-sm border dark:border-darkBg-accent">
              <p className="text-gray-500 text-sm mb-1">Vistas Totales</p>
              <h4 className="text-2xl font-bold">
                {stats.totalViews >= 1000
                  ? `${(stats.totalViews / 1000).toFixed(1)}k`
                  : stats.totalViews}
              </h4>
              <span className="text-green-500 text-xs font-semibold flex items-center mt-2">
                <Eye className="h-3 w-3 mr-1" />
                Total acumulado
              </span>
            </div>
            <div className="bg-white dark:bg-darkBg-card p-6 rounded-2xl shadow-sm border dark:border-darkBg-accent">
              <p className="text-gray-500 text-sm mb-1">Publicadas</p>
              <h4 className="text-2xl font-bold">{stats.publishedPosts}</h4>
              <span className="text-primary text-xs font-semibold mt-2 block">
                {stats.totalPosts - stats.publishedPosts} borradores
              </span>
            </div>
          </div>

          {/* Recent News Table */}
          <div className="bg-white dark:bg-darkBg-card rounded-2xl shadow-sm border dark:border-darkBg-accent overflow-hidden">
            <div className="p-6 border-b dark:border-darkBg-accent flex justify-between items-center">
              <h3 className="font-bold">Noticias Recientes</h3>
              <Link href="/admin/noticias">
                <Button variant="ghost" className="text-primary text-sm font-semibold">
                  Ver todas
                </Button>
              </Link>
            </div>
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
                  {recentPosts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No hay noticias aún
                      </td>
                    </tr>
                  ) : (
                    recentPosts.map((post) => (
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
                          <Link href={`/admin/noticias/${post.id}`}>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                              Editar
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-darkBg-card p-8 rounded-2xl shadow-sm border dark:border-darkBg-accent sticky top-8">
            <h3 className="font-bold text-xl mb-6">Acciones Rápidas</h3>
            <div className="space-y-4">
              <Link href="/admin/noticias/nuevo">
                <Button className="w-full bg-primary hover:bg-primary-dark">
                  <Newspaper className="mr-2 h-4 w-4" />
                  Nueva Noticia
                </Button>
              </Link>
              <Link href="/admin/etiquetas/nuevo">
                <Button variant="outline" className="w-full">
                  Nueva Etiqueta
                </Button>
              </Link>
              <Link href="/admin/usuarios/nuevo">
                <Button variant="outline" className="w-full">
                  Nuevo Usuario
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
