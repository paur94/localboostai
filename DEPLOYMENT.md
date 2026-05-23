# LocalBoost AI — Deployment Checklist

> Note: This project uses **LemonSqueezy** for payments (not Stripe).

---

## 1. Supabase Setup

- [ ] Create a new Supabase project at [supabase.com](https://supabase.com)
- [ ] Run `supabase/schema.sql` in the SQL editor (creates `users`, `content_generations`, `subscriptions` tables + RLS)
- [ ] Run `supabase/migrations/002_business_profiles_posts_calendars.sql`
- [ ] Run `supabase/migrations/003_ai_generations.sql`
- [ ] Verify RLS is enabled on all tables (`users`, `content_generations`, `subscriptions`, `business_profiles`, `content_calendars`, `generated_posts`)
- [ ] Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copy **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep secret — server only)
- [ ] In Supabase Auth settings: disable email auth (Clerk handles auth, Supabase JWT is used for RLS only)
- [ ] Set Supabase JWT secret to match Clerk's JWT — in Supabase dashboard → Settings → Auth → JWT Secret, set to the Clerk JWKS endpoint or use a shared secret

---

## 2. Clerk Setup

- [ ] Create application at [clerk.com](https://clerk.com) — choose Social + Email providers as needed
- [ ] Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Copy **Secret Key** → `CLERK_SECRET_KEY`
- [ ] In Clerk dashboard → Webhooks → Add endpoint:
  - URL: `https://yourdomain.com/api/webhooks/clerk`
  - Events: `user.created`, `user.updated`, `user.deleted`
  - Copy **Signing Secret** → `CLERK_WEBHOOK_SECRET`
- [ ] Configure JWT template in Clerk to issue tokens Supabase can verify (Supabase integration template)
- [ ] Set allowed redirect URLs to your production domain
- [ ] Configure sign-in/sign-up appearance to match brand (optional)

---

## 3. LemonSqueezy Setup

- [ ] Create account at [lemonsqueezy.com](https://lemonsqueezy.com) and complete store setup
- [ ] Create a **Store** and note the Store ID → `LEMONSQUEEZY_STORE_ID`
- [ ] Generate **API Key** → `LEMONSQUEEZY_API_KEY`
- [ ] Create **Pro** product with monthly/annual variants → copy variant ID → `LEMONSQUEEZY_PRO_VARIANT_ID`
- [ ] Create **Business** product with monthly/annual variants → copy variant ID → `LEMONSQUEEZY_BUSINESS_VARIANT_ID`
- [ ] In LemonSqueezy → Settings → Webhooks → Add endpoint:
  - URL: `https://yourdomain.com/api/webhooks/lemonsqueezy`
  - Events: `subscription_created`, `subscription_updated`, `subscription_cancelled`, `order_created`
  - Copy **Signing Secret** → `LEMONSQUEEZY_WEBHOOK_SECRET`
- [ ] Enable test mode for staging; switch to live mode for production
- [ ] Test checkout flow end-to-end with a test card

---

## 4. Environment Variables

Set all of the following in Vercel (Settings → Environment Variables). Mark server-only keys as non-public.

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# LemonSqueezy
LEMONSQUEEZY_API_KEY=eyJ...
LEMONSQUEEZY_STORE_ID=12345
LEMONSQUEEZY_WEBHOOK_SECRET=...
LEMONSQUEEZY_PRO_VARIANT_ID=123456
LEMONSQUEEZY_BUSINESS_VARIANT_ID=123457

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

- [ ] Confirm no `NEXT_PUBLIC_` prefix on secret keys (`CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `LEMONSQUEEZY_API_KEY`, `ANTHROPIC_API_KEY`)
- [ ] Set variables for **Production**, **Preview**, and **Development** environments separately where needed
- [ ] Rotate all `_test_` / placeholder keys to live/production keys

---

## 5. Vercel Deployment

- [ ] Connect GitHub repo to Vercel project
- [ ] Set **Framework Preset** to `Next.js`
- [ ] Set **Node.js version** to 20.x
- [ ] Confirm **Root Directory** is `/` (or the monorepo subfolder if applicable)
- [ ] Add all environment variables (section 4 above)
- [ ] Run first deployment and confirm build passes (`npm run build` locally first)
- [ ] Check Function logs for any missing env var errors after first deploy
- [ ] Set **Serverless Function Region** close to your Supabase region to reduce latency

---

## 6. Domain Setup

- [ ] Purchase domain or use existing one
- [ ] In Vercel → Settings → Domains → Add your domain
- [ ] Add the DNS records Vercel provides (A record or CNAME) at your registrar
- [ ] Wait for SSL certificate to provision (usually < 5 min)
- [ ] Update `NEXT_PUBLIC_APP_URL` to `https://yourdomain.com`
- [ ] Redeploy after updating `NEXT_PUBLIC_APP_URL`
- [ ] Update Clerk allowed redirect URLs to production domain
- [ ] Update LemonSqueezy webhook URL to production domain
- [ ] Update Clerk webhook URL to production domain
- [ ] Test the full auth flow on the live domain

---

## 7. Analytics

- [ ] **Vercel Analytics** — enable in Vercel dashboard → Analytics tab (built-in, no code needed for Next.js)
- [ ] **Vercel Speed Insights** — enable in Vercel dashboard → Speed Insights tab
- [ ] **(Optional) PostHog** — add `NEXT_PUBLIC_POSTHOG_KEY` and install `posthog-js` for product analytics
- [ ] **(Optional) Google Analytics** — add GA4 tag via `@next/third-parties/google` in root layout
- [ ] Verify analytics are recording real traffic after first day live

---

## 8. Error Tracking

- [ ] Create account at [sentry.io](https://sentry.io) and create a Next.js project
- [ ] Install: `npm install @sentry/nextjs`
- [ ] Run `npx @sentry/wizard@latest -i nextjs` to auto-configure
- [ ] Add to environment variables:
  ```
  NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
  SENTRY_AUTH_TOKEN=sntrys_...
  SENTRY_ORG=your-org
  SENTRY_PROJECT=localboost-ai
  ```
- [ ] Set **Sentry environment** to `production` in Vercel env vars: `SENTRY_ENVIRONMENT=production`
- [ ] Configure alert rules in Sentry for new issues → notify via email/Slack
- [ ] Test error tracking by triggering a test error (add a temporary `throw new Error("test")` and remove after)

---

## Pre-Launch Smoke Test

- [ ] Sign up as a new user → user row created in Supabase
- [ ] Sign in → redirects to `/dashboard`
- [ ] Generate content (AI) → result saved to `content_generations`
- [ ] Click upgrade → LemonSqueezy checkout loads
- [ ] Complete test purchase → subscription row created, tier updated in `users`
- [ ] Customer portal link works
- [ ] Sign out → redirected to home
- [ ] Error page (`/nonexistent`) returns 404, not 500
