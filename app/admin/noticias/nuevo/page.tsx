import { db } from "@/lib/db";
import { tags } from "@/lib/db/schema";
import { CreatePostForm } from "@/components/admin/CreatePostForm";

async function getTags() {
  return await db.select().from(tags);
}

export default async function NewPostPage() {
  const tagsList = await getTags();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nueva Noticia</h1>
        <p className="text-gray-500 mt-2">Crea una nueva noticia para publicar</p>
      </div>

      <div className="max-w-4xl">
        <CreatePostForm tags={tagsList} />
      </div>
    </div>
  );
}
