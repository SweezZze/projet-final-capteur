"use client";

import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  dashboard: "Dashboard",
  logs: "Logs",
  interaction: "Interaction",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const name = routeNames[segment] || segment;

        return (
          <>
            <span
              key={segment}
              className={isLast ? "font-medium text-foreground" : ""}
            >
              {name}
            </span>
            {!isLast && (
              <span className="text-muted-foreground/40 mx-1">/</span>
            )}
          </>
        );
      })}
    </nav>
  );
}
