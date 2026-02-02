"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteTag } from "@/app/actions/tags";
import { useRouter } from "next/navigation";

interface DeleteTagButtonProps {
  tagId: number;
  tagName: string;
}

export function DeleteTagButton({ tagId, tagName }: DeleteTagButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteTag(tagId);
    setLoading(false);
    
    if (result.success) {
      setOpen(false);
      router.refresh();
    } else {
      alert(result.error || "Error al eliminar la etiqueta");
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-red-500"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Etiqueta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar la etiqueta "{tagName}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
