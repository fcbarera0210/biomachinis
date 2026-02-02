"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createPost } from "@/app/actions/posts";
import { ImageUpload } from "./ImageUpload";
import { TagMultiSelect } from "./TagMultiSelect";
import { TiptapEditor } from "./TiptapEditor";
import Link from "next/link";
import type { Tag } from "@/lib/db/schema";

interface CreatePostFormProps {
  tags: Tag[];
}

export function CreatePostForm({ tags }: CreatePostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("{}");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!title.trim()) {
      setError("El título es requerido");
      setLoading(false);
      return;
    }

    if (!content || content === "{}") {
      setError("El contenido es requerido");
      setLoading(false);
      return;
    }

    const result = await createPost({
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      content,
      coverImageUrl: coverImageUrl || undefined,
      published,
      tagIds: selectedTagIds,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/noticias");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-darkBg-card p-8 rounded-2xl shadow-sm border dark:border-darkBg-accent">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título de la Noticia *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Avances en Prótesis Robóticas"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumen</Label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Breve descripción de la noticia..."
          rows={3}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Contenido *</Label>
        <TiptapEditor
          content={content}
          onChange={setContent}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen de Portada</Label>
        <ImageUpload
          value={coverImageUrl}
          onChange={setCoverImageUrl}
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label>Etiquetas</Label>
        <TagMultiSelect
          tags={tags}
          selectedTagIds={selectedTagIds}
          onChange={setSelectedTagIds}
          disabled={loading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          checked={published}
          onCheckedChange={(checked) => setPublished(checked === true)}
          disabled={loading}
        />
        <Label htmlFor="published" className="cursor-pointer">
          Publicar inmediatamente
        </Label>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark"
        >
          {loading ? "Guardando..." : "Guardar Noticia"}
        </Button>
        <Link href="/admin/noticias">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
