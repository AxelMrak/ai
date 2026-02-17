# Database Helper - Raw PostgreSQL

Implementation of `src/lib/db/purchases.ts` using `pg` (node-postgres) directly. Adapt for Drizzle, Kysely, or any other query builder.

## Prerequisites

- `pg` installed: `npm install pg`
- PostgreSQL database (AWS RDS, Neon, self-hosted, etc.)
- Run `assets/migration.sql` against your database

## Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## Connection Pool

```typescript
// src/lib/db/pool.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export default pool;
```

## Implementation

```typescript
// src/lib/db/purchases.ts
import pool from './pool';

interface PurchaseInsert {
  user_email: string;
  status: 'pending';
  total_amount: number;
}

interface PurchaseUpdate {
  status?: 'pending' | 'approved' | 'rejected';
  mercadopago_payment_id?: string;
  mercadopago_preference_id?: string;
  user_email?: string;
  updated_at?: string;
}

export async function createPurchase(data: PurchaseInsert) {
  const { rows } = await pool.query(
    `INSERT INTO purchases (user_email, status, total_amount)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [data.user_email, data.status, data.total_amount]
  );
  return rows[0];
}

export async function updatePurchase(id: string, data: PurchaseUpdate) {
  const fields: string[] = [];
  const values: unknown[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  if (fields.length === 0) return;

  values.push(id);
  await pool.query(
    `UPDATE purchases SET ${fields.join(', ')} WHERE id = $${idx}`,
    values
  );
}

export async function getPurchaseStatus(id: string) {
  const { rows } = await pool.query(
    `SELECT id, status FROM purchases WHERE id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function createPurchaseItems(
  purchaseId: string,
  items: { item_id: string; price: number }[]
) {
  if (items.length === 0) return;

  const values: unknown[] = [];
  const placeholders = items.map((item, i) => {
    const offset = i * 3;
    values.push(purchaseId, item.item_id, item.price);
    return `($${offset + 1}, $${offset + 2}, $${offset + 3})`;
  });

  await pool.query(
    `INSERT INTO purchase_items (purchase_id, item_id, price)
     VALUES ${placeholders.join(', ')}`,
    values
  );
}
```

## Drizzle ORM Variant

If using Drizzle instead of raw `pg`:

```typescript
// src/lib/db/schema.ts
import { pgTable, uuid, varchar, numeric, timestamp, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const purchases = pgTable('purchases', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  mercadopago_payment_id: varchar('mercadopago_payment_id'),
  mercadopago_preference_id: varchar('mercadopago_preference_id'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  total_amount: numeric('total_amount', { precision: 10, scale: 2 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const purchaseItems = pgTable('purchase_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  purchase_id: uuid('purchase_id').notNull().references(() => purchases.id, { onDelete: 'cascade' }),
  item_id: uuid('item_id').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
});
```

```typescript
// src/lib/db/purchases.ts
import { db } from '@/lib/db/drizzle';
import { purchases, purchaseItems } from './schema';
import { eq } from 'drizzle-orm';

export async function createPurchase(data: { user_email: string; status: 'pending'; total_amount: number }) {
  const [purchase] = await db.insert(purchases).values(data).returning({ id: purchases.id });
  return purchase;
}

export async function updatePurchase(id: string, data: Record<string, unknown>) {
  await db.update(purchases).set(data).where(eq(purchases.id, id));
}

export async function getPurchaseStatus(id: string) {
  const [purchase] = await db.select({ id: purchases.id, status: purchases.status })
    .from(purchases).where(eq(purchases.id, id));
  return purchase || null;
}

export async function createPurchaseItems(purchaseId: string, items: { item_id: string; price: number }[]) {
  await db.insert(purchaseItems).values(items.map((item) => ({ purchase_id: purchaseId, ...item })));
}
```
