import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditTagForm } from "@/components/admin/EditTagForm";

async function getTag(id: number) {
  const tag = await db.query.tags.findFirst({
    where: eq(tags.id, id),
  });
  return tag;
}

export default async function EditTagPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tagId = parseInt(id);
  
  if (isNaN(tagId)) {
    notFound();
  }

  const tag = await getTag(tagId);

  if (!tag) {
    notFound();
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Etiqueta</h1>
        <p className="text-gray-500 mt-2">Modifica los datos de la etiqueta</p>
      </div>

      <div className="max-w-2xl">
        <EditTagForm tag={tag} />
      </div>
    </div>
  );
}
