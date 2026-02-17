# MercadoPago Checkout Pro - Troubleshooting

## Table of Contents

### Configuration Errors
1. [auto_return + localhost = 400](#auto_return-localhost-400)
2. [invalid_notification_url](#invalid-notification-url)
3. [Invalid Token (401)](#invalid-token)
4. [Currency mismatch](#currency-mismatch)

### Database Errors
5. [Failed to create purchase (NULL email)](#failed-to-create-purchase)
6. [Transaction amount too small](#transaction-amount-too-small)

### Frontend Errors
7. [Hydration mismatch on checkout page](#hydration-mismatch)
8. [Double purchase on double-click](#double-purchase)
9. [useSearchParams error in App Router](#usesearchparams-error)

### Payment Flow Errors
10. [Success page shows approved without real payment](#success-page-trust)
11. [Webhook not received locally](#webhook-not-received)
12. [Webhook duplicate updates](#webhook-duplicates)
13. [Payment stuck in pending](#payment-stuck-pending)

### API Errors
14. [Preference creation fails with invalid items](#invalid-items)
15. [Invalid users involved](#invalid-users)
16. [Generic error "Ops, ocorreu um erro"](#generic-error)

### Environment Errors
17. [Node.js version incompatible](#node-version)
18. [NPX not found](#npx-not-found)
19. [Unauthorized use of live credentials](#unauthorized-credentials)
20. [Mixed test/production credentials](#mixed-credentials)

---

## auto_return + localhost = 400 {#auto_return-localhost-400}

**Error:** `auto_return invalid. back_url.success must be defined`

**Cause:** `auto_return: 'approved'` requires all `back_urls` to be valid HTTPS URLs. On localhost (HTTP), MercadoPago rejects the preference.

**Fix:** Conditionally set `auto_return`:

```typescript
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// In preference body:
...(baseUrl.startsWith('https') ? { auto_return: 'approved' as const } : {}),
```

**Note:** Without `auto_return`, the buyer must click "Return to site" manually after payment on localhost. This is fine for development.

---

## invalid_notification_url {#invalid-notification-url}

**Error:** `notification_url attribute must be a valid url` (code: `invalid_notification_url`)

**Cause:** The notification URL is malformed or exceeds 500 characters.

**Fix:**
1. Ensure URL is properly formatted: `https://yourdomain.com/api/webhooks/mercadopago`
2. Keep URL under 500 characters
3. Don't include query parameters in the base URL
4. Verify the domain is accessible

```typescript
// Good
notification_url: `${baseUrl}/api/webhooks/mercadopago`

// Bad - query params in notification URL
notification_url: `${baseUrl}/api/webhooks/mercadopago?token=abc`
```

---

## Invalid Token (401) {#invalid-token}

**Error:** HTTP 401 Unauthorized

**Cause:** Access token is expired, invalid, or doesn't have required permissions.

**Fix:**
1. Verify token is correct (no extra spaces)
2. Check token hasn't expired
3. Regenerate from [Developer Panel](https://www.mercadopago.com/developers/panel/app)
4. Ensure you're using the correct environment (TEST vs production)

```bash
# Test your credentials
curl -X GET \
  "https://api.mercadopago.com/v1/payment_methods" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Currency mismatch {#currency-mismatch}

**Error:** 400 Bad Request when creating preference

**Cause:** The `currency_id` doesn't match the country of your MercadoPago account.

**Fix:** Use the correct currency for your account's country:

| Country | currency_id |
|---------|-------------|
| Argentina | `ARS` |
| Brazil | `BRL` |
| Mexico | `MXN` |
| Colombia | `COP` |
| Chile | `CLP` |
| Peru | `PEN` |
| Uruguay | `UYU` |

**Note:** Cross-border payments are not supported. Each country needs its own MP account.

---

## Failed to create purchase {#failed-to-create-purchase}

**Error:** 500 from `/api/checkout` - `Failed to create purchase`

**Cause:** The `user_email` column has a `NOT NULL` constraint but no email was provided at checkout time.

**Fix:** Use a placeholder that the webhook will update later:

```typescript
user_email: email || 'pending@checkout',
```

MercadoPago collects the buyer's email during payment. The webhook updates `user_email` with the real payer email from `payment.payer.email`.

---

## Transaction amount too small {#transaction-amount-too-small}

**Error:** `The value for transaction_amount is too small`

**Cause:** MercadoPago has minimum amounts for card payments (approximately $15 ARS or equivalent).

**Fix:**
1. Ensure product prices meet minimum requirements
2. For testing, use amounts above the minimum
3. Consider showing error to user if cart total is too low

```typescript
const MIN_AMOUNT = 15; // Adjust per country

if (totalAmount < MIN_AMOUNT) {
  return NextResponse.json({
    error: `Minimum purchase amount is $${MIN_AMOUNT}`
  }, { status: 400 });
}
```

---

## Hydration mismatch {#hydration-mismatch}

**Error:** React hydration mismatch warning on checkout page. Content differs between server and client.

**Cause:** Cart store uses `localStorage` (e.g., zustand with `persist` middleware). Server-side rendering has no access to `localStorage`, so it renders empty state while the client renders cart items.

**Fix:** Add a `mounted` guard:

```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);

if (!mounted) return <LoadingSpinner />;
// Now safe to render cart-dependent content
```

---

## Double purchase {#double-purchase}

**Cause:** User clicks "Pay" multiple times before redirect. Each click creates a new purchase and preference.

**Fix:** Use a `useRef` flag (survives React re-renders, unlike state which may be stale in closures):

```typescript
const submittingRef = useRef(false);

const submit = async () => {
  if (submittingRef.current) return;
  submittingRef.current = true;
  // ... fetch ...
  // Only reset on error (success redirects away from the page)
};
```

Also disable the button via `isSubmitting` state for visual feedback.

---

## useSearchParams error {#usesearchparams-error}

**Error:** `useSearchParams() should be wrapped in a suspense boundary at page...`

**Cause:** Next.js App Router requires `useSearchParams()` to be inside a `<Suspense>` boundary.

**Fix:**

```tsx
function SuccessContent() {
  const searchParams = useSearchParams();
  // ... component logic
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SuccessContent />
    </Suspense>
  );
}
```

---

## Success page shows approved without real payment {#success-page-trust}

**Cause:** The page trusts the MercadoPago redirect URL parameters without verifying actual payment status in the database.

**Fix:** Always verify via API:

```typescript
const res = await fetch(`/api/purchases/${purchaseId}`);
const data = await res.json();
// data.status is 'pending' | 'approved' | 'rejected'
```

The webhook updates the real status. If the webhook hasn't arrived yet, status will be `pending` - show appropriate UI.

---

## Webhook not received {#webhook-not-received}

**Cause:** MercadoPago cannot reach `localhost`. Webhooks require a publicly accessible URL.

**Fix options:**

1. **ngrok (recommended for dev):**
   ```bash
   ngrok http 3000
   ```
   Set `NEXT_PUBLIC_APP_URL` to the ngrok HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

2. **localtunnel:**
   ```bash
   npx localtunnel --port 3000
   ```

3. **Local-only fallback:** For local testing, rely on the redirect flow. The success page will show `pending` since the webhook never updates the status. This is acceptable for development.

**Production:** Ensure your webhook URL is publicly accessible and returns HTTP 200 within 500ms.

---

## Webhook duplicates {#webhook-duplicates}

**Cause:** MercadoPago retries webhooks if it doesn't get a 2xx response, or sends multiple notifications for the same payment event.

**Fix:** Idempotency check before updating:

```typescript
const existing = await getPurchaseStatus(externalReference);

// Skip if already in terminal state
if (existing?.status === 'approved' || existing?.status === 'rejected') {
  return NextResponse.json({ received: true });
}
```

Always return `{ received: true }` even on errors to prevent MercadoPago from retrying indefinitely.

---

## Payment stuck in pending {#payment-stuck-pending}

**Cause:** Several possible reasons:
1. Webhook never arrived (localhost issue)
2. Buyer used a payment method that requires time (e.g., Rapipago, PagoFacil, Boleto, OXXO)
3. MercadoPago is still processing

**Fix:**
- In dev: Verify webhook is reachable (see "Webhook not received" above)
- In production: This is normal for offline payment methods. Show appropriate UI:
  ```
  "Your payment is being processed. You'll receive an email when confirmed."
  ```
- Check MercadoPago dashboard for the payment status manually if needed

---

## Invalid items {#invalid-items}

**Error:** MercadoPago returns 400 when creating preference.

**Common causes:**
- `unit_price` is 0 or negative
- `quantity` is 0 or negative
- `currency_id` doesn't match the account's country
- `title` is empty

**Fix:** Validate with Zod before calling MercadoPago:

```typescript
const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    title: z.string().min(1),
    quantity: z.number().positive(),
    unit_price: z.number().positive(),
  })).min(1),
});
```

---

## Invalid users involved {#invalid-users}

**Error:** `invalid users involved`

**Cause:** The buyer's email belongs to a test user while the seller's credentials are production (or vice versa).

**Fix:** Ensure consistency:
- **Testing:** Use test seller credentials + test buyer account
- **Production:** Use production credentials + real buyer accounts

Never mix test and production environments.

---

## Generic error "Ops, ocorreu um erro" {#generic-error}

**Error:** Vague error message with no technical details

**Cause:** This generic error can mean many things. Common causes:
1. Mixed credentials (test/production)
2. Invalid back_urls (not HTTPS)
3. Webhook URL unreachable
4. Preference misconfiguration

**Fix:** Check all of these:
- [ ] Credentials match environment (all test or all production)
- [ ] back_urls are valid HTTPS URLs
- [ ] notification_url is publicly accessible
- [ ] Items have valid prices and quantities
- [ ] Currency matches account country

For debugging, check the MercadoPago dashboard for more details on failed payments.

---

## Node.js version incompatible {#node-version}

**Error:** Syntax errors or module not found when using MCP Server

**Cause:** Node.js version is below 20.

**Fix:**
```bash
# Check version
node -v

# Install Node.js 20+ with nvm
nvm install 20
nvm use 20
```

---

## NPX not found {#npx-not-found}

**Error:** `command not found: npx`

**Cause:** NPM version is below 5.2.0 (npx was introduced in npm 5.2.0).

**Fix:**
```bash
# Update npm
npm install -g npm

# Verify
npx --version
```

---

## Unauthorized use of live credentials {#unauthorized-credentials}

**Error:** `Unauthorized use of live credentials`

**Cause:** Trying to use production credentials in a test environment or with test user accounts.

**Fix:**
1. Use TEST credentials during development
2. Don't use test buyer emails with production credentials
3. Create separate applications for test and production

---

## Mixed test/production credentials {#mixed-credentials}

**Error:** Payments work intermittently, fail with vague errors

**Cause:** Using a mix of test and production credentials, or test buyer with production seller.

**Fix:**
1. **Development:** Use TEST Access Token + TEST buyer accounts
2. **Production:** Use PRODUCTION Access Token + real buyer accounts
3. Never mix them

```env
# Development
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx

# Production
MERCADOPAGO_ACCESS_TOKEN=APP-xxxx
```

---

## Quick Diagnosis Checklist

When something fails, check in this order:

1. **Credentials:** Correct token? Matches environment?
2. **URLs:** All HTTPS? Publicly accessible?
3. **Items:** Valid prices? Correct currency?
4. **Environment:** Test with test, production with production?
5. **Webhook:** Reachable? Returns 200?
6. **Logs:** Check server logs for detailed errors
7. **Dashboard:** Check MercadoPago developer dashboard for API errors
