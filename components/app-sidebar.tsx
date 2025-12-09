"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/app/dashboard",
  },
  {
    label: "Leads",
    icon: Users,
    href: "/app/leads",
  },
  {
    label: "Properties",
    icon: Building2,
    href: "/app/properties",
  },
  {
    label: "Deals",
    icon: Briefcase,
    href: "/app/deals",
  },
  {
    label: "Activities",
    icon: Activity,
    href: "/app/activities",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/app/settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-16 items-center border-b px-6">
        <Building2 className="h-6 w-6 text-primary mr-2" />
        <span className="font-bold text-xl">RE CRM</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            {route.label}
          </Link>
        ))}
      </nav>

      <div className="border-t p-4">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start"
          // ← クライアント用 signOut。内部でCSRFも含めて処理してくれる
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
