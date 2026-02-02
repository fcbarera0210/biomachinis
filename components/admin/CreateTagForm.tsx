"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createTag } from "@/app/actions/tags";
import Link from "next/link";

export function CreateTagForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim()) {
      setError("El nombre es requerido");
      setLoading(false);
      return;
    }

    const result = await createTag(name.trim());

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/etiquetas");
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
        <Label htmlFor="name">Nombre de la Etiqueta</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Nutrición, Calistenia, CrossFit"
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          El slug se generará automáticamente a partir del nombre
        </p>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark"
        >
          {loading ? "Creando..." : "Crear Etiqueta"}
        </Button>
        <Link href="/admin/etiquetas">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
