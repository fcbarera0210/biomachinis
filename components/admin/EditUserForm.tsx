"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateUser } from "@/app/actions/users";
import Link from "next/link";
import type { Module, User } from "@/lib/db/schema";

interface EditUserFormProps {
  user: User;
  modules: Module[];
  selectedModuleIds: number[];
}

export function EditUserForm({ user, modules, selectedModuleIds: initialModuleIds }: EditUserFormProps) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(user.isActive);
  const [selectedModuleIds, setSelectedModuleIds] = useState<number[]>(initialModuleIds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleModule = (moduleId: number) => {
    if (selectedModuleIds.includes(moduleId)) {
      setSelectedModuleIds(selectedModuleIds.filter((id) => id !== moduleId));
    } else {
      setSelectedModuleIds([...selectedModuleIds, moduleId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError("Nombre y email son requeridos");
      setLoading(false);
      return;
    }

    if (password && password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await updateUser(user.id, {
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
      isActive,
      moduleIds: selectedModuleIds,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/admin/usuarios");
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
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre completo"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="usuario@ejemplo.com"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Nueva Contraseña (dejar vacío para mantener la actual)</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          disabled={loading}
          minLength={6}
        />
      </div>

      <div className="space-y-4">
        <Label>Módulos de Acceso</Label>
        <div className="space-y-3 border dark:border-darkBg-accent rounded-lg p-4">
          {modules.map((module) => (
            <div key={module.id} className="flex items-center space-x-2">
              <Checkbox
                id={`module-${module.id}`}
                checked={selectedModuleIds.includes(module.id)}
                onCheckedChange={() => toggleModule(module.id)}
                disabled={loading}
              />
              <Label htmlFor={`module-${module.id}`} className="cursor-pointer flex-1">
                {module.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
          disabled={loading}
        />
        <Label htmlFor="isActive" className="cursor-pointer">
          Usuario activo
        </Label>
      </div>

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
        <Link href="/admin/usuarios">
          <Button type="button" variant="outline" disabled={loading}>
            Cancelar
          </Button>
        </Link>
      </div>
    </form>
  );
}
