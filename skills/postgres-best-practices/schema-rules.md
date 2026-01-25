# POSTGRES-BEST-PRACTICES - SCHEMA
> Generated: 2026-01-25
> Rules: 5


### RULE: Choose Appropriate Data Types
(File: schema-data-types.md)

## Choose Appropriate Data Types

Using the right data types reduces storage, improves query performance, and prevents bugs.

**Incorrect (wrong data types):**

```sql
create table users (
  id int,                    -- Will overflow at 2.1 billion
  email varchar(255),        -- Unnecessary length limit
  created_at timestamp,      -- Missing timezone info
  is_active varchar(5),      -- String for boolean
  price varchar(20)          -- String for numeric
);
```

**Correct (appropriate data types):**

```sql
create table users (
  id bigint generated always as identity primary key,  -- 9 quintillion max
  email text,                     -- No artificial limit, same performance as varchar
  created_at timestamptz,         -- Always store timezone-aware timestamps
  is_active boolean default true, -- 1 byte vs variable string length
  price numeric(10,2)             -- Exact decimal arithmetic
);
```

Key guidelines:

```sql
-- IDs: use bigint, not int (future-proofing)
-- Strings: use text, not varchar(n) unless constraint needed
-- Time: use timestamptz, not timestamp
-- Money: use numeric, not float (precision matters)
-- Enums: use text with check constraint or create enum type
```

Reference: [Data Types](https://www.postgresql.org/docs/current/datatype.html)

### RULE: Index Foreign Key Columns
(File: schema-foreign-key-indexes.md)

## Index Foreign Key Columns

Postgres does not automatically index foreign key columns. Missing indexes cause slow JOINs and CASCADE operations.

**Incorrect (unindexed foreign key):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- No index on customer_id!
-- JOINs and ON DELETE CASCADE both require full table scan
select * from orders where customer_id = 123;  -- Seq Scan
delete from customers where id = 123;          -- Locks table, scans all orders
```

**Correct (indexed foreign key):**

```sql
create table orders (
  id bigint generated always as identity primary key,
  customer_id bigint references customers(id) on delete cascade,
  total numeric(10,2)
);

-- Always index the FK column
create index orders_customer_id_idx on orders (customer_id);

-- Now JOINs and cascades are fast
select * from orders where customer_id = 123;  -- Index Scan
delete from customers where id = 123;          -- Uses index, fast cascade
```

Find missing FK indexes:

```sql
select
  conrelid::regclass as table_name,
  a.attname as fk_column
from pg_constraint c
join pg_attribute a on a.attrelid = c.conrelid and a.attnum = any(c.conkey)
where c.contype = 'f'
  and not exists (
    select 1 from pg_index i
    where i.indrelid = c.conrelid and a.attnum = any(i.indkey)
  );
```

Reference: [Foreign Keys](https://www.postgresql.org/docs/current/ddl-constraints.html#DDL-CONSTRAINTS-FK)

### RULE: Use Lowercase Identifiers for Compatibility
(File: schema-lowercase-identifiers.md)

## Use Lowercase Identifiers for Compatibility

PostgreSQL folds unquoted identifiers to lowercase. Quoted mixed-case identifiers require quotes forever and cause issues with tools, ORMs, and AI assistants that may not recognize them.

**Incorrect (mixed-case identifiers):**

```sql
-- Quoted identifiers preserve case but require quotes everywhere
CREATE TABLE "Users" (
  "userId" bigint PRIMARY KEY,
  "firstName" text,
  "lastName" text
);

-- Must always quote or queries fail
SELECT "firstName" FROM "Users" WHERE "userId" = 1;

-- This fails - Users becomes users without quotes
SELECT firstName FROM Users;
-- ERROR: relation "users" does not exist
```

**Correct (lowercase snake_case):**

```sql
-- Unquoted lowercase identifiers are portable and tool-friendly
CREATE TABLE users (
  user_id bigint PRIMARY KEY,
  first_name text,
  last_name text
);

-- Works without quotes, recognized by all tools
SELECT first_name FROM users WHERE user_id = 1;
```

Common sources of mixed-case identifiers:

```sql
-- ORMs often generate quoted camelCase - configure them to use snake_case
-- Migrations from other databases may preserve original casing
-- Some GUI tools quote identifiers by default - disable this

-- If stuck with mixed-case, create views as a compatibility layer
CREATE VIEW users AS SELECT "userId" AS user_id, "firstName" AS first_name FROM "Users";
```

Reference: [Identifiers and Key Words](https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS)

### RULE: Partition Large Tables for Better Performance
(File: schema-partitioning.md)

## Partition Large Tables for Better Performance

Partitioning splits a large table into smaller pieces, improving query performance and maintenance operations.

**Incorrect (single large table):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz,
  data jsonb
);

-- 500M rows, queries scan everything
select * from events where created_at > '2024-01-01';  -- Slow
vacuum events;  -- Takes hours, locks table
```

**Correct (partitioned by time range):**

```sql
create table events (
  id bigint generated always as identity,
  created_at timestamptz not null,
  data jsonb
) partition by range (created_at);

-- Create partitions for each month
create table events_2024_01 partition of events
  for values from ('2024-01-01') to ('2024-02-01');

create table events_2024_02 partition of events
  for values from ('2024-02-01') to ('2024-03-01');

-- Queries only scan relevant partitions
select * from events where created_at > '2024-01-15';  -- Only scans events_2024_01+

-- Drop old data instantly
drop table events_2023_01;  -- Instant vs DELETE taking hours
```

When to partition:

- Tables > 100M rows
- Time-series data with date-based queries
- Need to efficiently drop old data

Reference: [Table Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

### RULE: Select Optimal Primary Key Strategy
(File: schema-primary-keys.md)

## Select Optimal Primary Key Strategy

Primary key choice affects insert performance, index size, and replication
efficiency.

**Incorrect (problematic PK choices):**

```sql
-- identity is the SQL-standard approach
create table users (
  id serial primary key  -- Works, but IDENTITY is recommended
);

-- Random UUIDs (v4) cause index fragmentation
create table orders (
  id uuid default gen_random_uuid() primary key  -- UUIDv4 = random = scattered inserts
);
```

**Correct (optimal PK strategies):**

```sql
-- Use IDENTITY for sequential IDs (SQL-standard, best for most cases)
create table users (
  id bigint generated always as identity primary key
);

-- For distributed systems needing UUIDs, use UUIDv7 (time-ordered)
-- Requires pg_uuidv7 extension: create extension pg_uuidv7;
create table orders (
  id uuid default uuid_generate_v7() primary key  -- Time-ordered, no fragmentation
);

-- Alternative: time-prefixed IDs for sortable, distributed IDs (no extension needed)
create table events (
  id text default concat(
    to_char(now() at time zone 'utc', 'YYYYMMDDHH24MISSMS'),
    gen_random_uuid()::text
  ) primary key
);
```

Guidelines:

- Single database: `bigint identity` (sequential, 8 bytes, SQL-standard)
- Distributed/exposed IDs: UUIDv7 (requires pg_uuidv7) or ULID (time-ordered, no
  fragmentation)
- `serial` works but `identity` is SQL-standard and preferred for new
  applications
- Avoid random UUIDs (v4) as primary keys on large tables (causes index
  fragmentation)

Reference:
[Identity Columns](https://www.postgresql.org/docs/current/sql-createtable.html#SQL-CREATETABLE-PARMS-GENERATED-IDENTITY)
