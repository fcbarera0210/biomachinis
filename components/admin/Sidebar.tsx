"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Newspaper, Users, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export const MODULE_CODES = {
  NEWS_MANAGE: "NEWS_MANAGE",
  USER_MANAGE: "USER_MANAGE",
  TAG_MANAGE: "TAG_MANAGE",
} as const;

interface SidebarProps {
  userModules: string[];
}

export function Sidebar({ userModules }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      requiredModule: null,
    },
    {
      href: "/admin/noticias",
      label: "Noticias",
      icon: Newspaper,
      requiredModule: MODULE_CODES.NEWS_MANAGE,
    },
    {
      href: "/admin/etiquetas",
      label: "Etiquetas",
      icon: Tag,
      requiredModule: MODULE_CODES.TAG_MANAGE,
    },
    {
      href: "/admin/usuarios",
      label: "Usuarios",
      icon: Users,
      requiredModule: MODULE_CODES.USER_MANAGE,
    },
  ];

  const filteredItems = menuItems.filter(
    (item) => !item.requiredModule || userModules.includes(item.requiredModule)
  );

  return (
    <aside className="w-64 bg-white dark:bg-darkBg-card border-r dark:border-darkBg-accent hidden lg:flex flex-col">
      <div className="p-6 flex items-center space-x-2">
        <Image
          src="/svg/logo-admin.svg"
          alt="Biomachinis Admin"
          width={32}
          height={32}
          className="w-8 h-8"
        />
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          Biomachinis
        </span>
      </div>

      <nav className="mt-6 flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-4 transition",
                isActive
                  ? "bg-primary/10 text-primary border-r-4 border-primary"
                  : "text-gray-500 hover:text-primary"
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t dark:border-darkBg-accent">
        <ThemeToggle />
      </div>
    </aside>
  );
}
