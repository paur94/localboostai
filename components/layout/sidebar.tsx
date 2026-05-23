"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  CreditCard,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { href: "/dashboard",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/generate", label: "Generate",  icon: Sparkles        },
  { href: "/dashboard/history",  label: "History",   icon: History         },
  { href: "/dashboard/billing",  label: "Billing",   icon: CreditCard      },
  { href: "/dashboard/settings", label: "Settings",  icon: Settings        },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-sidebar">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Zap className="h-4 w-4" />
        </div>
        <span className="font-semibold text-sidebar-foreground">{APP_NAME}</span>
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/10 p-3">
          <p className="text-xs font-medium text-primary">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground mt-1">Get 200 generations/month</p>
          <Link
            href="/pricing"
            className="mt-2 block text-xs font-semibold text-primary hover:underline"
          >
            View plans →
          </Link>
        </div>
      </div>
    </aside>
  );
}
