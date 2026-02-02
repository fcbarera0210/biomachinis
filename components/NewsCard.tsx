import Link from "next/link";
import Image from "next/image";
import type { Tag } from "@/lib/db/schema";

interface NewsCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImageUrl: string | null;
    views: number;
    published: boolean;
    createdAt: Date;
    postTags: Array<{
      tag: Tag;
    }>;
  };
}

export function NewsCard({ post }: NewsCardProps) {
  const tags = post.postTags?.map((pt) => pt.tag) || [];

  return (
    <Link href={`/noticias/${post.slug}`}>
      <div className="bg-white dark:bg-darkBg-card rounded-3xl overflow-hidden card-shadow border border-transparent dark:border-darkBg-accent hover:transform hover:-translate-y-1 transition-all duration-300">
        {post.coverImageUrl && (
          <div className="relative w-full h-56">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-4 flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="tag-pill px-3 py-1 rounded-full font-bold text-xs"
              >
                {tag.name}
              </span>
            ))}
            <span className="text-gray-400 dark:text-gray-500 text-xs font-semibold">
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 hover:text-primary cursor-pointer transition line-clamp-2">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
