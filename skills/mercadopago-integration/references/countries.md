# MercadoPago - Countries, Currencies & Configuration

## Supported Countries

| Country | Currency | `currency_id` | MP Developer Portal |
|---------|----------|---------------|---------------------|
| Argentina | Peso argentino | `ARS` | mercadopago.com.ar/developers |
| Brazil | Real | `BRL` | mercadopago.com.br/developers |
| Mexico | Peso mexicano | `MXN` | mercadopago.com.mx/developers |
| Colombia | Peso colombiano | `COP` | mercadopago.com.co/developers |
| Chile | Peso chileno | `CLP` | mercadopago.cl/developers |
| Peru | Sol | `PEN` | mercadopago.com.pe/developers |
| Uruguay | Peso uruguayo | `UYU` | mercadopago.com.uy/developers |

## Important Currency Notes

- The `currency_id` in the preference **must match the country of the MercadoPago account**. An Argentine account can only use `ARS`.
- Cross-border payments are not supported via Checkout Pro. Each country requires its own MP account.
- `CLP` and `COP` do not support decimal amounts. Use whole numbers only.

## Test Credentials

Each country has separate test credentials. Get them from:
`https://www.mercadopago.com/developers/panel/app`

Test credentials include:
- **Public Key:** Starts with `TEST-` (safe for frontend, `NEXT_PUBLIC_` prefix OK)
- **Access Token:** Starts with `TEST-` (backend only, **never** expose to frontend)

## Test Cards

All test cards use:
- **CVV:** `123` (or `1234` for American Express)
- **Expiration:** `11/30`
- **Cardholder name:** Controls result (see `references/testing.md`)

### Argentina (ARS)

| Card | Number | Type |
|------|--------|------|
| Visa | 4509 9535 6623 3704 | Credit |
| Mastercard | 5031 7557 3453 0604 | Credit |
| American Express | 3711 803032 57522 | Credit |
| Visa Debit | 4002 7686 9439 5619 | Debit |

### Brazil (BRL)

| Card | Number | Type |
|------|--------|------|
| Visa | 4235 6477 2802 5682 | Credit |
| Mastercard | 5031 4332 1540 6351 | Credit |
| Elo | 5067 2686 5051 7446 | Credit |
| Hipercard | 6062 8267 8627 6634 | Credit |

### Mexico (MXN)

| Card | Number | Type |
|------|--------|------|
| Visa | 4075 5957 1648 3764 | Credit |
| Mastercard | 5474 9254 3267 0366 | Credit |
| American Express | 3753 651535 56885 | Credit |

### Colombia (COP)

| Card | Number | Type |
|------|--------|------|
| Visa | 4013 5406 8274 6260 | Credit |
| Mastercard | 5254 1336 7440 3564 | Credit |
| Diners | 3612 484805 9452 | Credit |

### Chile (CLP)

| Card | Number | Type |
|------|--------|------|
| Visa | 4168 8188 4444 7115 | Credit |
| Mastercard | 5416 7526 0258 2580 | Credit |
| American Express | 3756 878590 78769 | Credit |

### Peru (PEN)

| Card | Number | Type |
|------|--------|------|
| Visa | 4009 1753 3280 6176 | Credit |
| Mastercard | 5031 7557 3453 0604 | Credit |
| Diners | 3622 720594 9822 | Credit |

### Uruguay (UYU)

| Card | Number | Type |
|------|--------|------|
| Visa | 4157 2362 1173 6486 | Credit |
| Mastercard | 5161 4413 1585 2820 | Credit |
| Diners | 3659 108564 5765 | Credit |

For all test cards, use any name (or special names like `APRO`, `FUND` to control results) and a valid-format document number (DNI, CPF, etc.).

See `references/testing.md` for how to use cardholder names to simulate different payment outcomes.

See the full list at: https://www.mercadopago.com/developers/en/docs/checkout-pro/additional-content/your-integrations/test/cards

## Payment Methods by Country

### Argentina
**Cards:**
- Credit: Visa, Mastercard, American Express, Naranja, Cabal, Tarjeta Shopping, Argencard
- Debit: Visa Debito, Mastercard Debito, Maestro

**Offline (pending status):**
- Rapipago
- Pago Fácil

**Other:**
- Bank transfer
- Mercado Pago wallet

### Brazil
**Cards:**
- Credit: Visa, Mastercard, American Express, Elo, Hipercard
- Debit: Available

**Offline (pending status):**
- Boleto Bancario (takes 1-3 business days)

**Instant:**
- PIX (instant bank transfer)
- Mercado Pago wallet

### Mexico
**Cards:**
- Credit: Visa, Mastercard, American Express
- Debit: Available

**Offline (pending status):**
- OXXO (cash payment at convenience stores)
- PayCash

**Other:**
- SPEI (bank transfer)
- Mercado Pago wallet

### Colombia
**Cards:**
- Credit: Visa, Mastercard, American Express, Diners
- Debit: Available

**Offline (pending status):**
- Efecty
- Baloto

**Other:**
- PSE (bank transfer)
- Mercado Pago wallet

### Chile
**Cards:**
- Credit: Visa, Mastercard, American Express, Diners
- Debit: Redcompra

**Other:**
- Webpay (bank integration)
- Mercado Pago wallet

### Peru
**Cards:**
- Credit: Visa, Mastercard, American Express, Diners
- Debit: Available

**Offline (pending status):**
- PagoEfectivo

**Other:**
- Mercado Pago wallet

### Uruguay
**Cards:**
- Credit: Visa, Mastercard, American Express, Diners
- Debit: Available

**Other:**
- Mercado Pago wallet

## Handling Offline Payments

When a buyer chooses an offline payment method (Rapipago, OXXO, Boleto, etc.), the payment status will be `pending` until they complete payment at the physical location.

### Recommended UI

```tsx
if (status === 'pending') {
  return (
    <div>
      <h2>Payment Pending</h2>
      <p>Your payment is being processed.</p>
      <p>You'll receive an email confirmation when the payment is complete.</p>
      <p>This may take 1-3 business days for offline payment methods.</p>
    </div>
  );
}
```

### Webhook Behavior

MercadoPago will send a webhook notification when the offline payment is completed. Your webhook handler should update the purchase status from `pending` to `approved`.

## Notification URL Requirements

- Must be HTTPS in production
- Must be publicly accessible (not localhost)
- Must return HTTP 200 or 201
- Maximum response time: 500ms recommended (MP retries on timeout)
- For local development, use ngrok: `ngrok http 3000`

## Minimum Payment Amounts

Each country has minimum payment amounts for card transactions:

| Country | Approximate Minimum |
|---------|---------------------|
| Argentina | ~$15 ARS |
| Brazil | ~R$1 BRL |
| Mexico | ~$10 MXN |
| Colombia | ~$500 COP |
| Chile | ~$50 CLP |
| Peru | ~S/1 PEN |
| Uruguay | ~$15 UYU |

*Note: These are approximate values and may change. Check MercadoPago documentation for current limits.*

## Statement Descriptor

The `statement_descriptor` appears on the buyer's card statement. Requirements:
- Maximum 22 characters
- Alphanumeric only
- No special characters

```typescript
statement_descriptor: 'MYSTORE', // Will appear as "MYSTORE" on card statement
```
