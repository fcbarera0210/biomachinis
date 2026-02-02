import { db } from "@/lib/db";
import { posts, postTags, tags } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { incrementViews } from "@/app/actions/posts-views";
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getPost(slug: string) {
  const post = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
  });
  return post;
}

async function getPostTags(postId: string) {
  const postTagsList = await db
    .select({
      tag: tags,
    })
    .from(postTags)
    .innerJoin(tags, eq(postTags.tagId, tags.id))
    .where(eq(postTags.postId, postId));

  return postTagsList.map((pt) => pt.tag);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    return {
      title: "Noticia no encontrada",
    };
  }

  const imageUrl = post.coverImageUrl || `${baseUrl}/svg/logo-bm.svg`;

  return {
    title: `${post.title} | Biomachinis`,
    description: post.excerpt || "Plataforma de noticias deportivas enfocada en Workout y superación personal",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Plataforma de noticias deportivas enfocada en Workout y superación personal",
      url: `${baseUrl}/noticias/${slug}`,
      siteName: "Biomachinis",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Plataforma de noticias deportivas enfocada en Workout y superación personal",
      images: [imageUrl],
    },
  };
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post || !post.published) {
    notFound();
  }

  const postTagsList = await getPostTags(post.id);

  // Incrementar vistas (no bloquea la renderización)
  incrementViews(post.id);

  let content;
  try {
    content = JSON.parse(post.content);
  } catch {
    content = { type: "doc", content: [] };
  }

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

      {/* Article */}
      <article className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          href="/"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary mb-6 inline-block"
        >
          ← Volver a noticias
        </Link>

        {postTagsList.length > 0 && (
          <div className="flex items-center space-x-3 mb-6 flex-wrap gap-2">
            {postTagsList.map((tag) => (
              <span
                key={tag.id}
                className="tag-pill px-3 py-1 rounded-full font-bold text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.excerpt}
          </p>
        )}

        {post.coverImageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <TiptapContent content={content} />
        </div>

        <div className="mt-12 pt-8 border-t dark:border-darkBg-accent">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>
              Publicado el{" "}
              {new Date(post.createdAt).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>{post.views} vistas</span>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-darkBg-card text-gray-400 pt-20 pb-10 transition-colors mt-20">
        <div className="container mx-auto px-6">
          <div className="pt-8 border-t border-darkBg-accent flex flex-col md:flex-row justify-between items-center text-xs">
            <p>Copyright © 2024 Biomachinis Demo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TiptapContent({ content }: { content: any }) {
  if (!content || !content.content) {
    return <p>No hay contenido disponible.</p>;
  }

  return (
    <div>
      {content.content.map((node: any, index: number) => {
        if (node.type === "paragraph") {
          return (
            <p key={index} className="mb-4">
              {node.content?.map((textNode: any, textIndex: number) => {
                if (textNode.type === "text") {
                  let text = textNode.text;
                  if (textNode.marks) {
                    textNode.marks.forEach((mark: any) => {
                      if (mark.type === "bold") {
                        text = <strong key={textIndex}>{text}</strong>;
                      } else if (mark.type === "italic") {
                        text = <em key={textIndex}>{text}</em>;
                      }
                    });
                  }
                  return text;
                }
                return null;
              })}
            </p>
          );
        }
        if (node.type === "heading") {
          const level = node.attrs?.level || 2;
          const headingProps = { key: index, className: "font-bold mb-4 mt-8" };
          
          switch (level) {
            case 1:
              return <h1 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h1>;
            case 2:
              return <h2 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h2>;
            case 3:
              return <h3 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h3>;
            case 4:
              return <h4 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h4>;
            case 5:
              return <h5 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h5>;
            case 6:
              return <h6 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h6>;
            default:
              return <h2 {...headingProps}>{node.content?.map((textNode: any) => textNode.text).join("")}</h2>;
          }
        }
        if (node.type === "bulletList" || node.type === "orderedList") {
          const ListTag = node.type === "orderedList" ? "ol" : "ul";
          return (
            <ListTag key={index} className="mb-4 ml-6">
              {node.content?.map((listItem: any, itemIndex: number) => (
                <li key={itemIndex}>
                  {listItem.content?.map((p: any) =>
                    p.content?.map((textNode: any) => textNode.text).join("")
                  )}
                </li>
              ))}
            </ListTag>
          );
        }
        if (node.type === "image") {
          return (
            <img
              key={index}
              src={node.attrs?.src}
              alt={node.attrs?.alt || ""}
              className="my-8 rounded-lg max-w-full"
            />
          );
        }
        return null;
      })}
    </div>
  );
}
