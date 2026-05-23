import Link from "next/link";
import {
  Sparkles,
  Zap,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Generate compelling marketing copy tailored to your business in seconds, not hours.",
  },
  {
    icon: Target,
    title: "Platform Optimized",
    description: "Content optimized for Instagram, Facebook, LinkedIn, Twitter, and Google Business.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Stop spending hours writing. Get professional content instantly and focus on what matters.",
  },
  {
    icon: BarChart3,
    title: "Track Performance",
    description: "Monitor your content generation history and track usage across campaigns.",
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
    content: "LocalBoost AI has transformed our social media presence. We went from posting once a week to daily, and our engagement tripled!",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Manager, Downtown Auto Repair",
    content: "I used to spend 3 hours a week writing content. Now it takes 15 minutes. The quality is consistently excellent.",
    rating: 5,
  },
  {
    name: "Lisa Martinez",
    role: "Director, Bloom Flower Studio",
    content: "Finally an AI tool that understands local businesses. The content feels authentic, not generic.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-background pt-20 pb-28">
        <div
          className="absolute inset-0 -z-10 opacity-15"
          style={{
            background:
              "radial-gradient(ellipse 80% 80% at 50% -20%, var(--color-primary), transparent)",
          }}
        />
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 text-primary border-primary/20">
            <Sparkles className="mr-1 h-3 w-3" />
            AI-Powered for Local Businesses
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Stop Writing.
            <br />
            <span className="text-primary">Start Growing.</span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-muted-foreground">
            Generate professional marketing content for your local business in seconds. Social posts,
            emails, ads — all tailored to your brand and audience.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="min-w-45">
              <Link href="/sign-up">
                Start Free Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-45">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Free plan available · No credit card required
          </p>
        </div>
      </section>

      {/* Content Types */}
      <section className="border-y bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm font-medium text-muted-foreground mr-2">Generate:</span>
            {contentTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-sm">
                {type}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything your local business needs
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Built specifically for local businesses — restaurants, retail, services, and more.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">How it works</h2>
            <p className="mt-4 text-muted-foreground">Three steps to professional content</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Describe your business", desc: "Tell us about your business, the content type, and your target platform." },
              { step: "02", title: "AI generates content", desc: "Our AI creates tailored content optimized for your platform and audience." },
              { step: "03", title: "Copy and publish", desc: "Review, copy, and publish your content. Done in under 30 seconds." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                  {step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by local businesses</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, content, rating }) => (
              <Card key={name}>
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">&ldquo;{content}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-sm">{name}</p>
                    <p className="text-xs text-muted-foreground">{role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            Ready to boost your local business?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Join thousands of local businesses generating professional content with AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link href="/sign-up">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 hover:bg-primary-foreground/10 text-primary-foreground"
            >
              <Link href="/pricing">See Pricing</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-primary-foreground/70">
            {["Free plan available", "No credit card required", "Cancel anytime"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
