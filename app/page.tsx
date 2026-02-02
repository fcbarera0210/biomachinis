import { db } from "@/lib/db";
import { posts, postTags, tags } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import Image from "next/image";
import { NewsCard } from "@/components/NewsCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

async function getPublishedPosts() {
  return await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImageUrl: posts.coverImageUrl,
      views: posts.views,
      published: posts.published,
      createdAt: posts.createdAt,
    })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(12);
}

async function getPostTags(postIds: string[]) {
  if (postIds.length === 0) return [];

  const postTagsList = await db
    .select({
      postId: postTags.postId,
      tag: tags,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(inArray(postTags.postId, postIds));

  return postTagsList;
}

export default async function Home() {
  const postsList = await getPublishedPosts();
  const postIds = postsList.map((p) => p.id);
  const postTagsList = await getPostTags(postIds);

  // Agrupar etiquetas por post
  const tagsByPost = postTagsList.reduce((acc, pt) => {
    if (!acc[pt.postId]) {
      acc[pt.postId] = [];
    }
    acc[pt.postId].push({ tag: pt.tag });
    return acc;
  }, {} as Record<string, Array<{ tag: typeof tags.$inferSelect }>>);

  const postsWithTags = postsList.map((post) => ({
    ...post,
    postTags: tagsByPost[post.id] || [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white dark:bg-darkBg-card sticky top-0 z-50 shadow-sm border-b dark:border-darkBg-accent transition-colors duration-300">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/svg/logo-bm.svg"
              alt="Biomachinis"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Biomachinis
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium text-gray-600 dark:text-gray-300">
            <Link href="/" className="text-primary">
              Inicio
            </Link>
            <Link href="/" className="hover:text-primary transition">
              Noticias
            </Link>
          </nav>

          <div className="flex items-center space-x-6">
            <ThemeToggle />
            <Link href="/admin/login">
              <button className="bg-primary text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 hover:bg-primary-dark transition">
                Admin <span className="hidden sm:inline">Panel</span>
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section flex items-center">
        <div className="container mx-auto px-6">
          <nav className="text-white text-sm mb-4 opacity-80">
            BIOMACHINIS <span className="mx-2">›</span> NOTICIAS
          </nav>
          <h1 className="text-white text-5xl font-bold">Noticias de Workout</h1>
        </div>
      </section>

      {/* News Grid */}
      <main className="container mx-auto px-6 py-20">
        {postsWithTags.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hay noticias publicadas aún
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {postsWithTags.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-darkBg-card text-gray-400 pt-20 pb-10 transition-colors">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image
                  src="/svg/logo-bm.svg"
                  alt="Biomachinis"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <span className="text-2xl font-bold text-white">Biomachinis</span>
              </div>
              <p className="text-sm leading-relaxed">
                Liderando la innovación en noticias de workout y superación personal.
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-darkBg-accent flex flex-col md:flex-row justify-between items-center text-xs">
            <p>Copyright © 2024 Biomachinis Demo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
