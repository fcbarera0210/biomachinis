"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/db/schema";

interface TagMultiSelectProps {
  tags: Tag[];
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
  disabled?: boolean;
}

export function TagMultiSelect({
  tags,
  selectedTagIds,
  onChange,
  disabled,
}: TagMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const selectedTags = tags.filter((tag) => selectedTagIds.includes(tag.id));

  const toggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {selectedTags.length > 0
            ? `${selectedTags.length} etiqueta(s) seleccionada(s)`
            : "Seleccionar etiquetas..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="max-h-60 overflow-auto p-2">
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500 p-2">No hay etiquetas disponibles</p>
          ) : (
            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-darkBg-accent rounded-md cursor-pointer"
                  onClick={() => toggleTag(tag.id)}
                >
                  <Checkbox
                    checked={selectedTagIds.includes(tag.id)}
                    onCheckedChange={() => toggleTag(tag.id)}
                  />
                  <label className="text-sm font-medium cursor-pointer flex-1">
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
