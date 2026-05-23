import Link from "next/link";
import {
  Sparkles,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate compelling marketing copy tailored to your business in seconds, not hours.",
    color: "from-blue-500/20 to-indigo-500/10",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    icon: Target,
    title: "Platform Optimized",
    description: "Content optimized for Instagram, Facebook, LinkedIn, Twitter, and Google Business.",
    color: "from-purple-500/20 to-pink-500/10",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Stop spending hours writing. Get professional content instantly and focus on what matters.",
    color: "from-amber-500/20 to-orange-500/10",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description: "Monitor your content generation history and track usage across campaigns.",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
];

const contentTypes = [
  "Social Media Posts",
  "Email Campaigns",
  "Ad Copy",
  "Blog Intros",
  "Product Descriptions",
  "SEO Descriptions",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Owner, Fresh Bites Café",
    content:
      "LocalBoost AI has transformed our social media presence. We went from posting once a week to daily, and our engagement tripled!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Mike Chen",
    role: "Manager, Downtown Auto Repair",
    content:
      "I used to spend 3 hours a week writing content. Now it takes 15 minutes. The quality is consistently excellent.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Lisa Martinez",
    role: "Director, Bloom Flower Studio",
    content:
      "Finally an AI tool that understands local businesses. The content feels authentic, not generic.",
    rating: 5,
    avatar: "LM",
  },
];

function ProductMockup() {
  return (
    <div className="relative mx-auto max-w-sm lg:max-w-none">
      <div className="liquid-glass-strong rounded-2xl overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-black/8 dark:border-white/8">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 ml-3">
            <div className="bg-black/6 dark:bg-white/8 rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
              app.localboost.ai/generate
            </div>
          </div>
        </div>
        {/* App body */}
        <div className="p-5 space-y-3">
          <p className="text-sm font-semibold">Generate Content</p>
          <div className="space-y-2">
            <div className="rounded-lg bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 px-3 h-9 flex items-center">
              <span className="text-xs text-muted-foreground">Fresh Bites Café</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 px-3 h-9 flex items-center">
                <span className="text-xs text-muted-foreground">Instagram Post</span>
              </div>
              <div className="rounded-lg bg-black/5 dark:bg-white/5 border border-black/8 dark:border-white/8 px-3 h-9 flex items-center">
                <span className="text-xs text-muted-foreground">Spring Menu</span>
              </div>
            </div>
            <div className="w-full rounded-lg bg-primary h-9 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
              <span className="text-xs font-semibold text-primary-foreground">Generate Content</span>
            </div>
          </div>
          {/* Generated result */}
          <div className="rounded-xl border border-primary/25 bg-primary/5 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-primary flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Generated
              </span>
              <span className="text-[10px] text-muted-foreground">Instagram · 12s</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-foreground/10 w-full" />
              <div className="h-2 rounded-full bg-foreground/10 w-[90%]" />
              <div className="h-2 rounded-full bg-foreground/10 w-[78%]" />
              <div className="h-2 rounded-full bg-foreground/10 w-[85%]" />
            </div>
            <div className="flex gap-2 pt-0.5">
              <div className="flex items-center gap-1 h-6 px-3 rounded-md bg-primary/15 text-primary text-[11px] font-medium cursor-default">
                <Copy className="h-2.5 w-2.5" /> Copy
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Floating badges */}
      <div className="absolute -bottom-3 -right-3 liquid-glass rounded-xl px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Ready to publish
      </div>
      <div className="absolute -top-3 -left-3 liquid-glass rounded-xl px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
        <Zap className="h-3.5 w-3.5" />
        Generated in 12s
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Fixed full-page background — single continuous gradient behind all sections */}
      <div className="fixed inset-0 -z-20 bg-background" />
      <div className="fixed inset-0 -z-10 mesh-bg pointer-events-none" />
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -5%, oklch(0.529 0.194 256.8 / 18%), transparent 60%)",
        }}
      />

      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center pt-16">
        {/* Floating orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute -top-32 -left-32 h-125 w-125 rounded-full animate-float"
            style={{
              background: "radial-gradient(circle, oklch(0.529 0.194 256.8 / 20%), transparent 70%)",
              animationDelay: "0s",
            }}
          />
          <div
            className="absolute top-1/3 -right-48 h-160 w-160 rounded-full animate-float"
            style={{
              background: "radial-gradient(circle, oklch(0.65 0.18 280 / 15%), transparent 70%)",
              animationDelay: "2s",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: copy */}
            <div className="text-center lg:text-left">
              <div className="inline-block mb-6">
                <span className="liquid-glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered for Local Businesses
                </span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
                Stop Writing.
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.529 0.194 256.8), oklch(0.65 0.18 280), oklch(0.72 0.15 256.8))",
                  }}
                >
                  Start Growing.
                </span>
              </h1>

              <p className="mt-6 mx-auto lg:mx-0 max-w-lg text-lg text-muted-foreground leading-relaxed">
                Generate professional marketing content for your local business in seconds. Social
                posts, emails, ads — all tailored to your brand and audience.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button
                  asChild
                  size="lg"
                  className="min-w-48 glow-primary rounded-xl h-12 text-base font-semibold"
                >
                  <Link href="/sign-up">
                    Start Free Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="min-w-48 liquid-glass rounded-xl h-12 text-base font-semibold border-0"
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>

              <p className="mt-5 text-sm text-muted-foreground">
                Free plan available · No credit card required
              </p>

              <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                {[
                  { label: "10K+ businesses", color: "text-blue-600 dark:text-blue-400" },
                  { label: "500K+ posts generated", color: "text-indigo-600 dark:text-indigo-400" },
                  { label: "4.9★ rating", color: "text-amber-600 dark:text-amber-400" },
                ].map(({ label, color }) => (
                  <span
                    key={label}
                    className={`liquid-glass rounded-full px-4 py-1.5 text-sm font-semibold ${color}`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: product mockup */}
            <div className="hidden lg:flex items-center justify-center">
              <ProductMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-5 relative">
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, oklch(0 0 0 / 10%), transparent)",
          }}
        />
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">Generate:</span>
            {contentTypes.map((type) => (
              <span
                key={type}
                className="liquid-glass rounded-full px-3 py-1 text-sm font-medium text-foreground/70"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, oklch(0 0 0 / 10%), transparent)",
          }}
        />
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Everything your local business needs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              Built specifically for local businesses — restaurants, retail, services, and more.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, color, iconColor, iconBg }) => (
              <div
                key={title}
                className={`liquid-glass rounded-2xl p-6 bg-linear-to-br ${color} transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBg} mb-4`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              How it works
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Three steps to professional content
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Describe your business",
                desc: "Tell us about your business, the content type, and your target platform.",
                color: "from-blue-500/20 to-indigo-500/10",
              },
              {
                step: "02",
                title: "AI generates content",
                desc: "Our AI creates tailored content optimized for your platform and audience.",
                color: "from-purple-500/20 to-pink-500/10",
              },
              {
                step: "03",
                title: "Copy and publish",
                desc: "Review, copy, and publish your content. Done in under 30 seconds.",
                color: "from-emerald-500/20 to-teal-500/10",
              },
            ].map(({ step, title, desc, color }, i) => (
              <div key={step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px border-t-2 border-dashed border-primary/30" />
                )}
                <div className={`liquid-glass rounded-2xl p-6 bg-linear-to-br ${color}`}>
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary font-bold text-lg">
                    {step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Loved by local businesses
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, content, rating, avatar }) => (
              <div
                key={name}
                className="liquid-glass rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              >
                <div className="flex mb-3 gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  &ldquo;{content}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container relative mx-auto px-4 text-center">
          <div className="liquid-glass-strong mx-auto max-w-2xl rounded-3xl p-12">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Ready to boost your local business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto text-lg">
              Join thousands of local businesses generating professional content with AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="min-w-44 glow-primary rounded-xl h-12 text-base font-semibold"
              >
                <Link href="/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="min-w-44 liquid-glass rounded-xl h-12 text-base font-semibold border-0"
              >
                <Link href="/pricing">See Pricing</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {["Free plan available", "No credit card required", "Cancel anytime"].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
