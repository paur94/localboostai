"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { NAV_LINKS, APP_NAME } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
            <Zap className="h-4 w-4" />
          </div>
          <span className="tracking-tight">{APP_NAME}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors hover:text-primary hover:bg-accent outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                pathname === link.href ? "text-primary bg-accent" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Button asChild size="sm" className="rounded-xl">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="rounded-xl">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-xl glow-primary">Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>

        <button
          className="md:hidden rounded-lg p-2 hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/20 px-4 py-4 space-y-1 bg-background/95 backdrop-blur-xl">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-3 border-t border-border/40 mt-3">
            <ThemeToggle />
            {isSignedIn ? (
              <Button asChild size="sm" className="flex-1 rounded-xl">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm" className="flex-1 rounded-xl">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
