import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PricingCards } from "@/components/pricing/pricing-cards";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for every local business.",
};

const faq = [
  {
    q: "Can I change plans at any time?",
    a: "Yes. You can upgrade or downgrade your plan at any time. Changes take effect at the start of the next billing cycle.",
  },
  {
    q: "What counts as a generation?",
    a: "Each time you click Generate and receive content, that counts as one generation.",
  },
  {
    q: "Is there a free trial?",
    a: "The Free plan gives you 10 generations per month at no cost — no credit card required.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. Cancel your subscription anytime from your account settings with no cancellation fees.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="py-20 text-center bg-background">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20 bg-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <PricingCards />
          </div>
        </section>

        {/* Guarantee */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">30-day money-back guarantee</h2>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto text-sm">
              Not satisfied? Contact us within 30 days of your first payment and we'll issue a full refund — no questions asked.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-2xl font-bold text-center mb-10">Frequently asked questions</h2>
            <div className="space-y-6">
              {faq.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-1">{q}</h3>
                  <p className="text-sm text-muted-foreground">{a}</p>
                  {i < faq.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
