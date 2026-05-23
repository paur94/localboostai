import Link from "next/link";
import { Sparkles, History, Settings, CreditCard } from "lucide-react";

const actions = [
  { href: "/dashboard/generate", label: "Generate",  icon: Sparkles,   color: "from-blue-500/20 to-indigo-500/10 hover:from-blue-500/30",   iconColor: "text-blue-500" },
  { href: "/dashboard/history",  label: "History",   icon: History,    color: "from-purple-500/20 to-pink-500/10 hover:from-purple-500/30",  iconColor: "text-purple-500" },
  { href: "/dashboard/billing",  label: "Billing",   icon: CreditCard, color: "from-amber-500/20 to-orange-500/10 hover:from-amber-500/30",  iconColor: "text-amber-500" },
  { href: "/dashboard/settings", label: "Settings",  icon: Settings,   color: "from-emerald-500/20 to-teal-500/10 hover:from-emerald-500/30", iconColor: "text-emerald-500" },
];

export function QuickActions() {
  return (
    <div className="liquid-glass rounded-2xl p-6">
      <h3 className="text-base font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ href, label, icon: Icon, color, iconColor }) => (
          <Link
            key={href}
            href={href}
            className={`liquid-glass rounded-xl p-3 flex flex-col items-center gap-2 bg-linear-to-br ${color} transition-all duration-200 hover:scale-[1.03]`}
          >
            <Icon className={`h-5 w-5 ${iconColor}`} />
            <span className="text-xs font-semibold">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function QuickActionsSkeleton() {
  return (
    <div className="liquid-glass rounded-2xl p-6 space-y-4">
      <div className="h-5 w-28 rounded-full skeleton-shimmer" />
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl skeleton-shimmer" />
        ))}
      </div>
    </div>
  );
}
