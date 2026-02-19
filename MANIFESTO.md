# MANIFESTO: Source of Truth

> Version: 2.2
> CRITICAL: These rules define the non-negotiable contract. Breaking them is a system failure.

---

## 1. Identity & Philosophy

- **User**: Senior Software Architect. Active planner, not just approver.
- **Goal**: Robust, maintainable code using Clean Architecture.
- **Anti-Vibe Coding**: No decisions "because it feels right". Every step needs technical rationale.
- **Blueprint Protocol**:
  1. Plan: Propose architecture, patterns, justification.
  2. Challenge: Ask questions if vague or conflicts exist.
  3. Stop: Wait for explicit approval ("Dale", "Go ahead").
  4. Execute: Only then write code.

---

## 2. Architecture & Code Standards

### 2.1 Clean Architecture & SOLID

**Layers**:
- Domain (Core): Entities, value objects, business rules. No external deps.
- Application (Use Cases): Orchestrates workflows. Depends only on Domain.
- Infrastructure (External): DB, frameworks, IO, HTTP, third-party.

**Dependency Rule**: Infrastructure -> Application -> Domain (inward flow).

### 2.2 Anti-God Rule

- Threshold: >150 lines or obvious SRP violation = split required.
- Prefer: composition, hooks, services, repositories, adapters.

### 2.3 Constants

- No magic strings/numbers inline.
- Use: centralized constants (UPPER_SNAKE_CASE), config modules.

---

## 3. Language & Comments

### 3.1 Language Protocol

- Chat/Reasoning: Spanish (Rioplatense) allowed.
- Code/Filenames/Commits: English only.
- `.ai/` files: English only, technical, concise.

### 3.2 No Comments Policy

- Code must be self-documenting.
- Exceptions: `// TODO:`, `// @ts-ignore` directives.
- If code needs explanatory comments -> refactor instead.

---

## 4. Context, Tokens & .ai Protocol

### 4.1 Memory Architecture (3 Layers)

```
Layer 1: Global Memory (cross-project)
  Location: MCP memory server
  Content: User preferences, learnings
  
Layer 2: Project Memory (per-project)
  Location: .ai/ folder
  Content: Stack, decisions, checkpoints
  
Layer 3: Session Memory (ephemeral)
  Location: Conversation context
  Content: Current task state
```

### 4.2 Project .ai/ Structure (5 files max)

```
.ai/
├── context.md       # Stack + focus + ADRs (frontmatter-first)
├── todo.md          # Tasks (frontmatter + compact list)
├── checkpoint.md    # Current state (THE active checkpoint)
├── history/         # Archived checkpoints (auto-rotated)
│   └── YYYY-MM-DD_HH-MM_feature.md
└── plans/           # Optional: ONE active plan
    └── active.md
```

**File Purposes**:

| File | Update | Owner | Content |
|------|--------|-------|---------|
| context.md | On ADR/stack change | ATHENA | Stack, focus, skills, ADRs |
| todo.md | Constant | All | Active tasks, compact format |
| checkpoint.md | On milestones | All | Current state, replaces LATEST |
| history/*.md | Auto-archive | System | Previous checkpoints |
| plans/active.md | Per feature | All | ONE active plan only |

### 4.3 Frontmatter-First Format (Token-Optimized)

**Principle**: 80% info in frontmatter (parseable), 20% body (only if prose needed).

#### context.md Template

```yaml
---
updated: 2026-02-19
agent: ATHENA
stack:
  lang: typescript
  runtime: node-22
  framework: next-15
  db: postgres
  ui: tailwind-shadcn
  test: vitest
focus:
  feature: user-authentication
  files: [src/lib/auth.ts, src/app/api/auth/]
  blockers: []
skills: [react-patterns, nextjs-best-practices, prisma-expert]
adrs:
  - id: 1
    decision: NextAuth over custom
    reason: time-to-market, maintained
  - id: 2
    decision: Server Components default
    reason: bundle size
---

## Constraints
<!-- Only if critical info doesn't fit frontmatter -->
```

#### todo.md Template

```yaml
---
updated: 2026-02-19
sprint: auth-implementation
started: 2026-02-15
target: 2026-02-22
---

## Active
- [~] auth-nextauth | APOLLO | deps:[x]db | test:bun test tests/auth/

## Pending
- [ ] error-boundaries | blocked:auth-nextauth

## Done (7d)
- [x] db-schema | 2026-02-14
```

**Compact format**: `status | task | owner | deps:[] | test:command`

#### checkpoint.md Template

```yaml
---
date: 2026-02-19
time: 14:30
agent: APOLLO
feature: auth-implementation
status: in_progress
trigger: feature-milestone
---

## Summary
[1-2 sentences: what was accomplished]

## Changes
- path/file.ts (created)
- path/other.ts (modified)

## Decisions
- [ADR-X] decision: reason

## Debt
- [ ] pending item

## Next
- Next action item
```

### 4.4 Bootstrap Protocol (MANDATORY FIRST ACTION)

> Every session starts here. No exceptions.

```
1. Check .ai/ exists
   ├─ NO  → Create structure + templates
   └─ YES → Validate against spec
            ├─ Missing files    → Create from template
            ├─ Wrong format     → Migrate to frontmatter
            └─ Valid            → Continue

2. Check .gitignore
   ├─ Missing .ai/ → Add ".ai/" line
   └─ Present      → Continue

3. Read in order:
   a) context.md (stack, focus, skills)
   b) checkpoint.md (current state)
   c) todo.md (active tasks)

4. Load skills from context.md → skills field

5. Announce:
   "Contexto: [stack] | Focus: [feature] | Skills: [list]
    Estado: [status]. ¿Arrancamos?"
```

### 4.5 Validation Rules

| File | Required Frontmatter | Auto-fix |
|------|---------------------|----------|
| context.md | updated, stack, focus, skills | Create with project scan |
| todo.md | updated, sprint | Create empty template |
| checkpoint.md | date, agent, status | Create initial checkpoint |

### 4.6 Auto-Update Triggers

**Create checkpoint when**:

| Trigger | Condition | Action |
|---------|-----------|--------|
| Feature critica | Tests pass, >3 files | checkpoint + todo |
| Refactor grande | >5 files, structure change | checkpoint + ADR |
| Plan completado | All tasks done | checkpoint, archive plan |
| Bug critico | Security/data fix | checkpoint + debt |
| ADR tomado | Architecture decision | update context.md |
| Session larga | >2hrs or "terminamos" | checkpoint |

**NOT a trigger**:
- Individual commits
- Lint/format fixes
- Tasks <15min
- Cosmetic changes

### 4.7 Checkpoint Lifecycle

```
checkpoint.md (active)
    │
    ├─ [milestone reached]
    │       │
    │       ▼
    │   Archive to history/YYYY-MM-DD_HH-MM_feature.md
    │       │
    │       ▼
    └── checkpoint.md (reset for next milestone)
```

### 4.8 Token Economy

| Action | Tokens | Frequency |
|--------|--------|-----------|
| Read context.md frontmatter | ~150 | Every session |
| Read checkpoint.md | ~100 | Every session |
| Read todo.md | ~80 | Every session |
| Load 3 skills | ~1500 | As needed |
| Full skill scan | ~2000 | Rarely (new project) |

**Savings**: ~70% vs verbose markdown format.

### 4.9 Context Iteration Protocol

> .ai/ is living memory, not "read once and forget".

**Re-read triggers**:
- Planning requests: "hagamos un plan"
- Feature requests: "agreguemos", "implementemos"
- Refactor requests: "refactoreemos"
- Context switches: topic/module change
- Resuming: "retomemos", "donde quedamos"

### 4.10 Skill Loading Protocol

**On bootstrap**:
1. Read context.md → skills field
2. Load listed skills
3. If task needs unlisted skill → load + add to context.md

**Skill caching**:
- Skills in context.md = cached for project
- New tech detected = add skill to context.md
- Never scan full SKILL-INDEX.md unless new project

---

## 5. Communication & Autonomy

- **Justification**: Always explain why. Compare 2+ options when possible.
- **Blueprint First**: Architecture plan before code.
- **No Silent Autonomy**: Never modify files, run commands, or apply migrations without approval.

**Answer shape**:
1. Technical justification
2. Strategy (chosen approach)
3. Plan (steps, files)
4. Confirmation request

---

## 6. Safety Against Over-Engineering

Prefer simplest design that:
- Respects Clean Architecture
- Controls coupling
- Supports foreseeable extensions

When multiple patterns viable, favor:
- Less ceremony
- Lower cognitive load
- Better fit with existing patterns

---

## 7. MCP Usage

> Use MCPs intelligently, not by default.

### Available MCPs

| MCP | Purpose | When to Use |
|-----|---------|-------------|
| fast-filesystem | Bulk file ops, safe edits | Multi-file changes |
| next-devtools | Next.js debugging | Next.js projects only |
| playwright | Browser automation, E2E | UI testing, scraping |
| ddg-search | Web search | Technical research |
| context7 | Code intelligence | Complex analysis |
| git | Version control | Commits, blame, history |
| memory | Cross-session memory | User preferences |
| sequential-thinking | Complex reasoning | Debug, architecture |

### MCP Rules

1. Detect project type first
2. Use on-demand, not speculatively
3. Prefer native tools before MCPs
4. Report MCP usage to user

### Anti-Patterns

- next-devtools on non-Next.js = WASTE
- playwright for non-browser = OVERKILL
- All MCPs "just in case" = TOKEN BURN
