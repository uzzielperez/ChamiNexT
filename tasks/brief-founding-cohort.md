# How to take your first paying users (plain English)

You already have the **code**. This doc is only the **setup** so Stripe can charge people and your site unlocks their plan.

Do the steps **in order**. Use **Test mode** first (fake money). Switch to Live only when a test payment works.

---

## What buyers will see

| Plan | Normal price | Founding price (code `FOUNDING40`) |
|------|--------------|--------------------------------------|
| Sprint (job seeker, 90 days) | €149 once | **€89.40** once |
| Season (job seeker, monthly) | €49/mo | **€29.40**/mo |
| Small Business | €250/mo | **€150**/mo + 60 days free |
| Growth | €900/mo | **€540**/mo + 60 days free |

Only the **first 30** people who pay with that discount get it. After that, full price.

---

## Before you start

1. Open a terminal.
2. Go to the project:

```bash
cd ~/Desktop/ChamiNexT
```

3. Have ready:
   - A [Stripe](https://dashboard.stripe.com) account
   - Your Netlify site (where ChamiNexT is deployed)
   - ~20 minutes

---

## Step 1 — Get Stripe keys (Test mode)

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)  
   (toggle **Test mode** ON in the Stripe top-right).
2. Copy:
   - **Secret key** → starts with `sk_test_…`
   - **Publishable key** → starts with `pk_test_…`

Keep these in a notes app for Step 3. Do **not** commit them to git.

---

## Step 2 — Create the 40% founding discount in Stripe

In the same terminal:

```bash
cd ~/Desktop/ChamiNexT
STRIPE_SECRET_KEY='sk_test_PASTE_YOUR_KEY_HERE' npm run stripe:founding
```

Replace `sk_test_PASTE_YOUR_KEY_HERE` with your real test secret key.

**What you should see:** something like:

```text
Coupon: founding40 40% off
Promotion code: FOUNDING40

Add to Netlify env:
STRIPE_FOUNDING_PROMOTION_CODE_ID=promo_xxxxxxxxxx
```

Copy the `promo_…` value. You need it in Step 3.

If it says the coupon already exists, that’s fine — it will reuse it and still print the `promo_…` id.

---

## Step 3 — Put secrets into Netlify

1. Open [Netlify](https://app.netlify.com) → your ChamiNexT site.
2. **Site configuration** → **Environment variables** → **Add a variable**.
3. Add these (names must match exactly):

| Variable name | What to paste |
|---------------|----------------|
| `STRIPE_SECRET_KEY` | `sk_test_…` from Step 1 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_…` from Step 1 |
| `STRIPE_FOUNDING_PROMOTION_CODE_ID` | `promo_…` from Step 2 |
| `JWT_SECRET` | any long random string (e.g. run `openssl rand -hex 32`) |
| `GROQ_API_KEY` | your existing Groq key (if interviews already work, leave as-is) |

Optional but good for login emails:

| Variable name | What to paste |
|---------------|----------------|
| `RESEND_API_KEY` | from Resend |
| `MAGIC_LINK_FROM` | `ChamiNext <hello@chaminext.com>` |
| `JWT_SECRET` | long random string |
| `GOOGLE_CLIENT_ID` | from Google Cloud OAuth client (Web) |
| `GOOGLE_CLIENT_SECRET` | from same OAuth client |

**Google Console setup (once):** create an OAuth 2.0 Web client. Add authorized redirect URI:

`https://YOUR_NETLIFY_SITE/.netlify/functions/auth-google-callback`

(For local `netlify dev`, also add `http://localhost:8888/.netlify/functions/auth-google-callback`.)

Shipper sign-in at `/login`: **Continue with Google** or magic link. Both land on the same JWT session.

4. **Redeploy** the site (Deploys → Trigger deploy → Deploy site).  
   Env vars only apply after a new deploy.

---

## Step 4 — Tell Stripe to notify your site after payment

1. Stripe Dashboard (still **Test mode**) → **Developers** → **Webhooks** → **Add endpoint**.
2. **Endpoint URL** (use your real site domain):

```text
https://YOUR-SITE.netlify.app/.netlify/functions/stripe-webhook
```

If you use a custom domain, e.g.:

```text
https://chaminext.com/.netlify/functions/stripe-webhook
```

3. Select these events only:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `customer.subscription.deleted`
4. Create the endpoint, then open it → **Reveal** signing secret → copy `whsec_…`.
5. Back in Netlify env vars, add:

| Variable name | What to paste |
|---------------|----------------|
| `STRIPE_WEBHOOK_SECRET` | `whsec_…` |

6. Redeploy Netlify again.

---

## Step 5 — Quick check that code is healthy

```bash
cd ~/Desktop/ChamiNexT
npm test
npm run build
```

Both should finish without errors. (`npm test` = 10 passing checks about prices/discounts.)

---

## Step 6 — Do one fake purchase yourself

1. Open your **live** site (the Netlify URL), not only localhost.
2. Go to **Pricing** (`/pricing`).
3. You should see a banner about founding **40% off** and code **FOUNDING40**.
4. Click **Start Sprint** (or Season).
5. Stripe Checkout should open.
   - If the discount did **not** auto-apply, click “Add promotion code” and type `FOUNDING40`.
6. Pay with a [Stripe test card](https://docs.stripe.com/testing):
   - Card: `4242 4242 4242 4242`
   - Any future expiry, any CVC, any email.
7. You should land on a success page that says your plan is active (not an error).
8. Open **Practice** — you should have paid access.

**Company check (optional):**

1. `/pricing?for=companies`
2. Click **Start 60-day free pilot** on Small Business.
3. Complete Checkout (trial → often €0 due today).
4. Open `/employers` — Interview Studio.

---

## Step 7 — Invite real people (still Test mode is OK for friends)

- Send them the pricing link.
- Tell them: “Use code **FOUNDING40** at checkout if it isn’t already applied — first 30 only.”
- You are still in **Test mode** until you switch keys (next step). No real money yet.

---

## Step 8 — Go live (real money) — only after Step 6 worked

1. Stripe → turn **Test mode OFF**.
2. Get **live** keys (`sk_live_…`, `pk_live_…`) from [API keys](https://dashboard.stripe.com/apikeys).
3. Run the founding script again with the **live** secret key:

```bash
STRIPE_SECRET_KEY='sk_live_PASTE_HERE' npm run stripe:founding
```

4. In Netlify, **replace**:
   - `STRIPE_SECRET_KEY` → `sk_live_…`
   - `VITE_STRIPE_PUBLISHABLE_KEY` → `pk_live_…`
   - `STRIPE_FOUNDING_PROMOTION_CODE_ID` → the **new** live `promo_…`
5. Add a **second** webhook endpoint for live mode (same URL, live signing secret) → update `STRIPE_WEBHOOK_SECRET` to the live `whsec_…`.
6. Redeploy Netlify.
7. Buy Sprint yourself with a real card for €89.40 (or refund yourself after). Confirm success page works.

Then invite your 5–30 users.

---

## If something breaks

| Symptom | Likely fix |
|---------|------------|
| Checkout says demo / plan activates without Stripe | `STRIPE_SECRET_KEY` missing on Netlify, or you didn’t redeploy |
| No discount at Checkout | Missing `STRIPE_FOUNDING_PROMOTION_CODE_ID`, or user must type `FOUNDING40` manually |
| Success page: “verification failed” | Webhook secret wrong, or `session_id` missing — redo Step 4 + redeploy |
| Works on localhost, not on site | Env vars are only on Netlify; localhost needs a local `.env` (optional) |

---

## What you do **not** need for 5–30 users

- Neon / a database
- Custom invoices
- A separate “admin panel”

Studio candidate lists are still mostly in the browser for demos; that’s OK for early pilots.

---

## One-line summary

**Stripe test keys → `npm run stripe:founding` → paste 4–5 vars in Netlify → webhook → redeploy → fake pay with `4242…` → then switch to live keys and invite people with `FOUNDING40`.**
