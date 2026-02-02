"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("color-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = theme === "dark" || (!theme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-primary"
    >
      {isDark ? (
        <>
          <Sun className="mr-3 h-4 w-4" />
          <span>Modo Claro</span>
        </>
      ) : (
        <>
          <Moon className="mr-3 h-4 w-4" />
          <span>Modo Oscuro</span>
        </>
      )}
    </Button>
  );
}
