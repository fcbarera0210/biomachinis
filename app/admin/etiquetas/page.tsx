import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { DeleteTagButton } from "@/components/admin/DeleteTagButton";

async function getTags() {
  return await db.select().from(tags).orderBy(desc(tags.id));
}

export default async function TagsPage() {
  const tagsList = await getTags();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Etiquetas</h1>
        <Link href="/admin/etiquetas/nuevo">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Etiqueta
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-darkBg-card rounded-2xl shadow-sm border dark:border-darkBg-accent overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-darkBg text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-darkBg-accent text-sm">
              {tagsList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No hay etiquetas aún
                  </td>
                </tr>
              ) : (
                tagsList.map((tag) => (
                  <tr
                    key={tag.id}
                    className="hover:bg-gray-50 dark:hover:bg-darkBg-accent transition"
                  >
                    <td className="px-6 py-4">{tag.id}</td>
                    <td className="px-6 py-4 font-medium">{tag.name}</td>
                    <td className="px-6 py-4 text-gray-500">{tag.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/etiquetas/${tag.id}`}>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteTagButton tagId={tag.id} tagName={tag.name} />
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
