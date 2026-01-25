# POSTGRES-BEST-PRACTICES - ADVANCED
> Generated: 2026-01-25
> Rules: 2


### RULE: Use tsvector for Full-Text Search
(File: advanced-full-text-search.md)

## Use tsvector for Full-Text Search

LIKE with wildcards can't use indexes. Full-text search with tsvector is orders of magnitude faster.

**Incorrect (LIKE pattern matching):**

```sql
-- Cannot use index, scans all rows
select * from articles where content like '%postgresql%';

-- Case-insensitive makes it worse
select * from articles where lower(content) like '%postgresql%';
```

**Correct (full-text search with tsvector):**

```sql
-- Add tsvector column and index
alter table articles add column search_vector tsvector
  generated always as (to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''))) stored;

create index articles_search_idx on articles using gin (search_vector);

-- Fast full-text search
select * from articles
where search_vector @@ to_tsquery('english', 'postgresql & performance');

-- With ranking
select *, ts_rank(search_vector, query) as rank
from articles, to_tsquery('english', 'postgresql') query
where search_vector @@ query
order by rank desc;
```

Search multiple terms:

```sql
-- AND: both terms required
to_tsquery('postgresql & performance')

-- OR: either term
to_tsquery('postgresql | mysql')

-- Prefix matching
to_tsquery('post:*')
```

Reference: [Full Text Search](https://supabase.com/docs/guides/database/full-text-search)

### RULE: Index JSONB Columns for Efficient Querying
(File: advanced-jsonb-indexing.md)

## Index JSONB Columns for Efficient Querying

JSONB queries without indexes scan the entire table. Use GIN indexes for containment queries.

**Incorrect (no index on JSONB):**

```sql
create table products (
  id bigint primary key,
  attributes jsonb
);

-- Full table scan for every query
select * from products where attributes @> '{"color": "red"}';
select * from products where attributes->>'brand' = 'Nike';
```

**Correct (GIN index for JSONB):**

```sql
-- GIN index for containment operators (@>, ?, ?&, ?|)
create index products_attrs_gin on products using gin (attributes);

-- Now containment queries use the index
select * from products where attributes @> '{"color": "red"}';

-- For specific key lookups, use expression index
create index products_brand_idx on products ((attributes->>'brand'));
select * from products where attributes->>'brand' = 'Nike';
```

Choose the right operator class:

```sql
-- jsonb_ops (default): supports all operators, larger index
create index idx1 on products using gin (attributes);

-- jsonb_path_ops: only @> operator, but 2-3x smaller index
create index idx2 on products using gin (attributes jsonb_path_ops);
```

Reference: [JSONB Indexes](https://www.postgresql.org/docs/current/datatype-json.html#JSON-INDEXING)
