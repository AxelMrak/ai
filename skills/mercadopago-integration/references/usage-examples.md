# Usage Examples

Copy and adapt these prompts when asking Claude to integrate MercadoPago.

## Quick Start

### Minimal Prompt (Claude Explores First)

```
Integrar MercadoPago en mi app
```

or in English:

```
Integrate MercadoPago payments using the mercadopago-integration skill.
Explore my codebase first to find the cart store, product model, database setup,
and existing routes before implementing.
```

Claude will automatically:
1. Detect your database (Supabase/Prisma/pg)
2. Find your cart store
3. Identify existing routes
4. Determine currency from country context
5. Implement the full integration

---

## Full Integration Examples

### Supabase

```
Integrate MercadoPago Checkout Pro following the mercadopago-integration skill.

Details:
- Database: Supabase
- Currency: ARS
- Success route: /pago-exitoso
- Failure route: /pago-fallido
- Brand name (statement): MY_BRAND
- Product table: photos (id, price, title)
- Cart store: src/store/cart.ts (zustand with persist)
- Supabase server client: src/lib/supabase/server.ts (createServiceClient)

Run the migration, create all files, and add env vars to .env.example.
```

### Prisma + AWS RDS

```
Integrate MercadoPago Checkout Pro following the mercadopago-integration skill.

Details:
- Database: PostgreSQL on AWS RDS via Prisma
- Currency: BRL
- Success route: /payment-success
- Failure route: /payment-failure
- Brand name: MY_STORE
- Product table: products (id, price, name)
- Prisma client: src/lib/prisma.ts

Use the Prisma database reference for the DB helper.
```

### Raw PostgreSQL / Neon

```
Integrate MercadoPago Checkout Pro following the mercadopago-integration skill.

Details:
- Database: PostgreSQL (Neon) with raw pg driver
- Currency: MXN
- Success route: /pago-exitoso
- Brand name: MI_TIENDA

Use the raw PostgreSQL database reference for the DB helper.
```

### Drizzle ORM

```
Integrate MercadoPago Checkout Pro following the mercadopago-integration skill.

Details:
- Database: PostgreSQL with Drizzle ORM
- Currency: COP
- Success route: /checkout/success
- Brand name: TIENDA_CO

Check references/database-postgresql.md for the Drizzle variant.
```

---

## Add to Existing Project

```
Add MercadoPago Checkout Pro to my app using the mercadopago-integration skill.
My cart is in src/store/cart.ts, products are in the "products" table.
Currency: BRL. Success route: /payment-success. Brand: MY_STORE.
Explore my codebase to detect which database adapter I'm using.
```

---

## Country-Specific Integration

### Argentina

```
Integrate MercadoPago Checkout Pro for an Argentine app.
Currency: ARS. Follow the mercadopago-integration skill.
Include support for Rapipago and Pago Fácil (pending payment UI).
```

### Brazil

```
Integrate MercadoPago Checkout Pro for a Brazilian app.
Currency: BRL. Follow the mercadopago-integration skill.
Check references/countries.md for Brazil-specific payment methods and test cards.
Support PIX and Boleto (pending payment handling needed).
```

### Mexico

```
Integrate MercadoPago Checkout Pro for a Mexican app.
Currency: MXN. Follow the mercadopago-integration skill.
Include OXXO support with pending payment UI.
```

### Colombia

```
Integrate MercadoPago Checkout Pro for a Colombian app.
Currency: COP (no decimals). Follow the mercadopago-integration skill.
Include PSE and Efecty support.
```

---

## Partial Integration / Add Features

### Add Webhook to Existing Integration

```
I already have MercadoPago checkout working but I need to add the webhook handler.
Follow the mercadopago-integration skill for the webhook implementation with
idempotency check.
```

### Add Success Page Verification

```
My MercadoPago checkout works but the success page doesn't verify the payment.
Add server-side verification following the mercadopago-integration skill.
```

### Add Pending Payment UI

```
My checkout works for card payments but I need to handle pending payments
(for Rapipago, OXXO, Boleto, etc). Add the pending status UI following
the mercadopago-integration skill.
```

### Add Double-Click Prevention

```
Users are creating duplicate purchases by clicking the pay button multiple times.
Fix the checkout hook with useRef guard following the mercadopago-integration skill.
```

---

## Troubleshooting Prompts

### Diagnose Error 400

```
My MercadoPago integration is returning a 400 error when creating the preference.
Use the mercadopago-integration skill to diagnose and fix the issue.
The error says: [paste error here]
```

### Fix auto_return Error

```
I'm getting "auto_return invalid. back_url.success must be defined" error.
Fix this following the mercadopago-integration skill's troubleshooting guide.
```

### Webhook Not Receiving

```
My webhook at /api/webhooks/mercadopago isn't receiving notifications.
Diagnose the issue using the mercadopago-integration skill.
I'm testing on [localhost / production URL].
```

### Payment Stuck in Pending

```
Payments are stuck in pending status and never update to approved.
Check my webhook implementation and database updates following
the mercadopago-integration skill.
```

### Hydration Mismatch

```
I'm getting React hydration mismatch errors on my checkout page.
My cart uses zustand with persist. Fix it following the mercadopago-integration skill.
```

---

## Production Deployment

### Pre-Production Checklist

```
Review my MercadoPago integration for production readiness using
the mercadopago-integration skill checklist. Check:
- HTTPS URLs
- Production credentials
- Webhook accessibility
- Error handling
```

### Switch to Production Credentials

```
My MercadoPago integration works in test mode. Help me switch to production
credentials following the mercadopago-integration skill. My production URL
is https://myapp.com
```

---

## Testing Prompts

### Setup Test Environment

```
Help me set up a test environment for MercadoPago following the
mercadopago-integration skill's testing guide. I need test accounts
and want to simulate approved, rejected, and pending payments.
```

### Test Different Payment Outcomes

```
Show me how to test different payment outcomes (approved, rejected, pending,
insufficient funds) using MercadoPago test cards. Follow the testing.md reference.
```

---

## Advanced Prompts

### Add Idempotency Keys

```
Add idempotency keys to my MercadoPago preference creation to prevent
duplicate payments on retries.
```

### Add Webhook Signature Verification

```
Add webhook signature verification to my MercadoPago webhook handler
for added security. I have MP_WEBHOOK_SECRET in my env vars.
```

### Custom Payment Expiration

```
Configure my MercadoPago preferences to expire after 30 minutes instead
of the default 24 hours.
```

### Add Order Items to Preference

```
My checkout creates the preference but doesn't include the individual items.
Update it to include proper item details (title, quantity, unit_price) for
each cart item.
```
