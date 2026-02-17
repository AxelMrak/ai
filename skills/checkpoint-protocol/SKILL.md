---
name: checkpoint-protocol
description: Iterative session history with timestamped checkpoints and LATEST.md symlink
---

# Checkpoint Protocol

> Immutable, timestamped snapshots of session progress. Replaces MEMORY.md with searchable history.

## Philosophy

- Every checkpoint builds on the previous (iteration)
- Technical debt carries forward until resolved
- LATEST.md symlink provides current context
- Full history enables debugging and rollback

## Structure

```
.ai/
├── CONTEXT.md                    # Semi-static project snapshot
├── TO-DO.md                      # Task tracking
├── checkpoints/                  # Timestamped session history
│   ├── 2026-01-28_15-30_oauth-implementation.md
│   ├── 2026-01-29_10-15_refactor-user-service.md
│   └── LATEST.md                 # Symlink → most recent checkpoint
└── plans/
    └── YYYY-MM-DD-{name}.md
```

## When to Create Checkpoints

| Trigger | Example |
|---------|---------|
| Feature completed | OAuth implemented and tested |
| Refactor done | Auth layer refactored |
| Bug fixed | Memory leak resolved |
| Session end | User says "terminamos" |
| Architecture change | ADR created |
| Auto-resume recovery | Session crashed |

## Naming Convention

```
YYYY-MM-DD_HH-MM_short-description.md
```

Examples:
- `2026-01-28_15-30_oauth-implementation.md`
- `2026-01-29_09-15_refactor-auth-layer.md`

## Template

```markdown
---
date: YYYY-MM-DD
time: HH:MM
agent: ATHENA|APOLLO|HEFESTO
feature: short-description
status: IN_PROGRESS|COMPLETED|BLOCKED
duration: Xh Ym
---

## Session Summary
[What was accomplished]

## Changes Made
- Added /api/auth/[...nextauth].ts route
- Updated Prisma schema

## Decisions (ADRs)
- [ADR-015] NextAuth.js over custom OAuth

## Technical Debt (Iterative)
[Unresolved items from previous]
- TODO: Add refresh token rotation
[New items this session]
- TODO: Add E2E tests

## Files Modified
- prisma/schema.prisma
- src/lib/auth.ts

## Tests
- ✅ Login flow working
- ⚠️ Missing E2E tests

## Next Steps
- Implement refresh token rotation
- Add E2E auth tests
```

## Iteration Chain

```
Checkpoint N-1              Checkpoint N               Checkpoint N+1
├─ Tech Debt: A, B     →   ├─ Tech Debt: B, C    →   ├─ Tech Debt: C
├─ Next: Impl OAuth        ├─ DONE: OAuth impl       ├─ DONE: Tests
└─ Status: IN_PROGRESS     ├─ Next: Add tests        └─ Next: Deploy
                           └─ Status: COMPLETED
```

## Auto-Resume Integration

When session crashes:

1. Read `.ai/checkpoints/LATEST.md`
2. Extract: last state, next steps, tech debt
3. Summarize: "Last session worked on X, completed Y, next was Z"
4. Ask: "¿Continúo desde donde quedó?"
5. Create new checkpoint with status: RESUMED

## Commands

```bash
# Create checkpoint
~/Developer/ai/scripts/checkpoint-create.sh "desc" "AGENT" "STATUS"

# List checkpoints
~/Developer/ai/scripts/checkpoint-list.sh

# Search checkpoints
~/Developer/ai/scripts/checkpoint-search.sh "keyword"
```
