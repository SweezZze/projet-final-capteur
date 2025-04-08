// app/dashboard/layout.tsx
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { Breadcrumb } from "@/components/breadcrumb";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../context/auth-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr]">
      <aside className="border-r bg-background">
        <AppSidebar />
      </aside>
      <main className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <Breadcrumb />
          <div className="flex-1" />
        </header>
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto py-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
