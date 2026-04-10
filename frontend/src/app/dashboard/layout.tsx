// src/app/dashboard/layout.tsx
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, Settings, BarChart3 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated or not a farmer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "farmer")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "farmer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Farmer Dashboard
            </h2>
            <p className="text-sm text-slate-500 mt-1">{user.name}</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Package className="h-5 w-5" />
              <span>My Products</span>
            </Link>

            {/* <Link
              href="/dashboard/stats"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Statistics</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link> */}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
