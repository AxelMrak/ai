---
name: blueprint-protocol
description: Planning workflow - OBSERVE → ORIENT → PLAN → APPROVE → EXECUTE → DOCUMENT
---

# Blueprint Protocol

> The non-negotiable workflow for non-trivial tasks.

## Cycle

```
OBSERVE → ORIENT → PLAN → APPROVE → EXECUTE → DOCUMENT
```

### 1. OBSERVE
Read `.ai/` files to understand current state:
- `.ai/CONTEXT.md` - Project fundamentals
- `.ai/checkpoints/LATEST.md` - Current focus
- `.ai/plans/` - Active plans
- `.ai/TO-DO.md` - Pending work

### 2. ORIENT
Analyze request against architecture:
- Identify gaps
- Check constraints
- Verify alignment with existing patterns

### 3. PLAN
Propose approach with:
- **Options**: A) Simple vs B) Scalable
- **Recommendation**: Explicit choice with justification
- **Steps**: Atomic, actionable items
- **Risks**: What could go wrong

### 4. APPROVE
**CRITICAL:** STOP and wait for explicit approval

Ask: "¿Le mando mecha?" / "Shall I execute?"

Never execute without:
- "dale" / "go ahead" / "execute"
- Explicit user approval

### 5. EXECUTE
Implement only after approval:
- Follow plan step-by-step
- Document deviations
- Update progress

### 6. DOCUMENT
Update working memory:
- Plan status
- `.ai/checkpoints/LATEST.md`
- `.ai/TO-DO.md`

## Anti-Patterns

❌ Skip approval and execute immediately
❌ Plan without reading existing context
❌ Execute without updating documentation
❌ Assume approval from silence

## Examples

**ATHENA (Planning):**
```markdown
## Analysis
Current auth uses JWT but lacks refresh tokens

## Options
**A) Simple:** Add basic refresh token rotation
**B) Scalable:** Implement OAuth2 with PKCE

## Recommendation
Option A - meets current needs, OAuth overkill for v1

## Plan
1. [ ] Add refresh token to JWT payload
2. [ ] Create /auth/refresh endpoint
3. [ ] Update client to auto-refresh

---
¿Aprobás? Lo paso a APOLLO para implementación.
```

**APOLLO (Execution):**
```markdown
## Executing Plan: auth-refresh
Step 1/3: Add refresh token to JWT

### Implementation
- Modified jwt.ts to include refresh_token claim
- Updated types to include refresh payload

### Verification
- [x] TypeScript compiles
- [x] Tests pass

---
¿Continúo con Step 2?
```
