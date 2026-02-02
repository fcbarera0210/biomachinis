import { db } from "@/lib/db";
import { posts, postTags, tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { EditPostForm } from "@/components/admin/EditPostForm";

async function getPost(id: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, id),
  });
  return post;
}

async function getPostTags(postId: string) {
  const postTagsList = await db
    .select({ tagId: postTags.tagId })
    .from(postTags)
    .where(eq(postTags.postId, postId));
  return postTagsList.map((pt) => pt.tagId);
}

async function getAllTags() {
  return await db.select().from(tags);
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const postTagIds = await getPostTags(id);
  const allTags = await getAllTags();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Editar Noticia</h1>
        <p className="text-gray-500 mt-2">Modifica los datos de la noticia</p>
      </div>

      <div className="max-w-4xl">
        <EditPostForm post={post} tags={allTags} selectedTagIds={postTagIds} />
      </div>
    </div>
  );
}
