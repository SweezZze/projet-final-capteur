// components/app-sidebar.tsx
"use client";

import { useAuth } from "@/app/context/auth-context";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { HomeIcon, ListIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Définition des routes AVANT le composant
const routes = [
  {
    path: "/dashboard",
    label: "Home",
    icon: HomeIcon,
  },
  {
    path: "/dashboard/logs",
    label: "Logs",
    icon: ListIcon,
  },
  {
    path: "/dashboard/interaction",
    label: "Interaction",
    icon: ZapIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col py-2.5 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <HomeIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">Dashboard</span>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-grow">
        <div className="space-y-1 px-3 py-2">
          {routes.map((route) => (
            <Link key={route.path} href={route.path}>
              <Button
                variant={pathname === route.path ? "secondary" : "ghost"}
                className={cn("w-full justify-start px-3", {
                  "bg-secondary": pathname === route.path,
                })}
              >
                <route.icon className="mr-3 h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Se déconnecter
        </Button>
      </div>
    </div>
  );
}
