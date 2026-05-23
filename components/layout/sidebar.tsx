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
  ArrowUpRight,
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
    <aside className="hidden md:flex w-16 hover:w-64 transition-[width] duration-300 ease-in-out flex-col liquid-glass border-r border-sidebar-border shrink-0 overflow-hidden group/sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center justify-start gap-2.5 border-b border-sidebar-border px-4 shrink-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm glow-primary">
          <Zap className="h-4 w-4" />
        </div>
        <span className="font-bold text-sidebar-foreground tracking-tight whitespace-nowrap overflow-hidden max-w-0 group-hover/sidebar:max-w-xs transition-[max-width] duration-300">{APP_NAME}</span>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center justify-start gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm glow-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !active && "group-hover:scale-110")} />
                <span className="whitespace-nowrap overflow-hidden max-w-0 group-hover/sidebar:max-w-xs transition-[max-width] duration-300">{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/60 shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300" />}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Upgrade card — hidden when collapsed */}
      <div className="overflow-hidden max-h-0 group-hover/sidebar:max-h-44 transition-[max-height] duration-300 ease-in-out">
        <div className="p-4 border-t border-sidebar-border">
          <div className="liquid-glass rounded-2xl p-4 bg-linear-to-br from-primary/15 to-purple-500/10">
            <p className="text-xs font-bold text-primary whitespace-nowrap">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">Get 200 generations/month and unlock all features.</p>
            <Link
              href="/pricing"
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline outline-none focus-visible:underline"
            >
              View plans
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
