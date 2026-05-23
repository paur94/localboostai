import Link from "next/link";
import { Sparkles, History, Settings, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const actions = [
  { href: "/dashboard/generate", label: "Generate Content", icon: Sparkles,   variant: "default"  as const },
  { href: "/dashboard/history",  label: "View History",    icon: History,    variant: "outline" as const },
  { href: "/dashboard/billing",  label: "Billing",         icon: CreditCard, variant: "outline" as const },
  { href: "/dashboard/settings", label: "Settings",        icon: Settings,   variant: "outline" as const },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map(({ href, label, icon: Icon, variant }) => (
          <Button key={href} asChild variant={variant} size="sm" className="h-auto py-3 flex-col gap-1.5">
            <Link href={href}>
              <Icon className="h-4 w-4" />
              <span className="text-xs">{label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
