"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

interface TopbarProps {
  userName?: string;
  userEmail?: string;
}

export function Topbar({ userName, userEmail }: TopbarProps) {
  const initials = userName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <header className="h-16 bg-white dark:bg-darkBg-card border-b dark:border-darkBg-accent flex items-center justify-between px-8 shrink-0">
      <h2 className="text-lg font-semibold">Panel de Administración</h2>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-gray-400 cursor-pointer hover:text-primary" />
          <span className="absolute -top-1 -right-1 bg-primary w-2 h-2 rounded-full border-2 border-white dark:border-darkBg-card" />
        </div>
        <div className="h-8 w-px bg-gray-200 dark:bg-darkBg-accent" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{userName || "Usuario"}</p>
                <p className="text-xs text-gray-500">{userEmail || "email"}</p>
              </div>
              <Avatar className="border dark:border-darkBg-accent">
                <AvatarImage
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    userName || "User"
                  )}&background=e11d48&color=fff`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/admin/login" })}>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
