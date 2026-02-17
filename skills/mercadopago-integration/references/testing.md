# MercadoPago Checkout Pro - Testing Guide

## Test Accounts

Before testing, you need test credentials from your MercadoPago developer panel.

### Creating Test Accounts

1. Go to **Your integrations > Your application > Test accounts**
2. Create both a **test seller** and **test buyer** account
3. Each account has: username, password, and 6-digit email verification code

### Important Rules

- **Never mix credentials**: Test seller credentials must be used with test buyer accounts
- **Use incognito mode**: Avoids credential caching errors between test sessions
- **Separate browsers**: Use different browsers or profiles for seller vs buyer

## Test Cards

All test cards use:
- **CVV**: `123` (or `1234` for American Express)
- **Expiration**: `11/30`
- **Document**: Any valid format for the country (DNI, CPF, etc.)

### Simulating Payment Results

The **cardholder name** determines the payment outcome:

| Name | Result | Use Case |
|------|--------|----------|
| `APRO` | Approved | Happy path testing |
| `OTHE` | General error | Generic decline handling |
| `CONT` | Pending | Offline payment simulation |
| `FUND` | Insufficient funds | Specific error handling |
| `SECU` | Invalid security code | CVV error handling |
| `CALL` | Call for authorization | Bank authorization required |
| `EXPI` | Expired card | Expiration error handling |
| `FORM` | Form error | Invalid data handling |
| `CARD` | Card disabled | Disabled card handling |
| `INST` | Invalid installments | Installment error |
| `DUPL` | Duplicate payment | Duplicate prevention |
| `LOCK` | Locked card | Frozen card handling |
| `CTNA` | Card type not allowed | Card type restriction |
| `ATTE` | Exceeded attempts | Rate limit handling |
| `BLAC` | Blacklisted card | Fraud prevention |
| `UNSU` | Unsupported card | Card not supported |
| `TEST` | Test payment | General testing |

### Example Test Flow

```typescript
// To test an approved payment:
// 1. Fill card number: 4509 9535 6623 3704 (Visa Argentina)
// 2. Fill cardholder name: APRO
// 3. Fill CVV: 123
// 4. Fill expiration: 11/30
// Result: Payment approved
```

## Test Cards by Country

### Argentina (ARS)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4509 9535 6623 3704 | Use name to control |
| Mastercard | 5031 7557 3453 0604 | Use name to control |
| American Express | 3711 803032 57522 | Use name to control |

### Brazil (BRL)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4235 6477 2802 5682 | Use name to control |
| Mastercard | 5031 4332 1540 6351 | Use name to control |
| Elo | 5067 2686 5051 7446 | Use name to control |

### Mexico (MXN)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4075 5957 1648 3764 | Use name to control |
| Mastercard | 5474 9254 3267 0366 | Use name to control |

### Colombia (COP)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4013 5406 8274 6260 | Use name to control |
| Mastercard | 5254 1336 7440 3564 | Use name to control |

### Chile (CLP)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4168 8188 4444 7115 | Use name to control |
| Mastercard | 5416 7526 0258 2580 | Use name to control |

### Peru (PEN)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4009 1753 3280 6176 | Use name to control |
| Mastercard | 5031 7557 3453 0604 | Use name to control |

### Uruguay (UYU)

| Card | Number | Result |
|------|--------|--------|
| Visa | 4157 2362 1173 6486 | Use name to control |
| Mastercard | 5161 4413 1585 2820 | Use name to control |

## Testing Webhooks Locally

MercadoPago webhooks require a publicly accessible URL.

### Option 1: ngrok (Recommended)

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000

# Use the HTTPS URL in your .env
# NEXT_PUBLIC_APP_URL=https://abc123.ngrok-free.app
```

**Important**: Update `NEXT_PUBLIC_APP_URL` every time ngrok restarts (URL changes).

### Option 2: localtunnel

```bash
npx localtunnel --port 3000
```

### Option 3: Skip Webhooks in Dev

For local testing, you can rely on the redirect flow:
1. Payment completes on MercadoPago
2. User is redirected to success page
3. Success page shows "pending" (webhook never updates)
4. Manually verify in MercadoPago dashboard

This is acceptable for development but webhooks are required for production.

## Testing Checklist

- [ ] Test accounts created (seller + buyer)
- [ ] Using incognito/private browsing
- [ ] Test card with `APRO` name for approved flow
- [ ] Test card with `FUND` name for rejected flow
- [ ] Test card with `CONT` name for pending flow
- [ ] Webhook receiving notifications (ngrok or similar)
- [ ] Success page correctly verifies status
- [ ] Failure page handles rejected payments
- [ ] Pending UI shows for offline payments

## Common Testing Issues

### "Ops, ocorreu um erro" (Generic Error)

This vague error usually means:
1. Mixed credentials (test seller with production buyer)
2. Invalid back_urls (not HTTPS)
3. Webhook URL unreachable
4. Misconfigured preference

### Webhook Not Triggering

1. Verify ngrok is running and URL is updated
2. Check that notification_url is publicly accessible
3. Ensure webhook endpoint returns 200
4. Look for errors in server logs

### Payment Works Once Then Fails

1. Clear browser cache/cookies
2. Use incognito mode
3. Don't reuse the same preference ID
4. Create a new test buyer account

## References

- [Official Test Cards](https://www.mercadopago.com/developers/en/docs/checkout-pro/additional-content/your-integrations/test/cards)
- [Test Purchases Guide](https://www.mercadopago.com.ar/developers/en/docs/checkout-pro/integration-test/test-purchases)
- [Sandbox Environment](https://www.mercadopago.com/developers/en/docs/checkout-pro/integration-test/sandbox)
