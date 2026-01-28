# AI Development System: MANIFESTO + Agents + oh-my-opencode

> **A production-ready system for AI-assisted development with persistent memory, specialized agents, and checkpoint-based history.**

Stop repeating yourself to AI assistants. Stop getting spaghetti code. This system creates a clear contract between you and your AI, with memory that persists across sessions and agents that know their role.

---

## Table of Contents

- [What Problem Does It Solve?](#what-problem-does-it-solve)
- [System Architecture](#system-architecture)
- [Quick Start](#quick-start)
- [The Three Layers](#the-three-layers)
  - [Layer 0: Knowledge Base](#layer-0-knowledge-base)
  - [Layer 1: Agent Personalities](#layer-1-agent-personalities)
  - [Layer 2: Specialized Workers](#layer-2-specialized-workers)
- [Memory System: Checkpoints](#memory-system-checkpoints)
- [Integration Guide](#integration-guide)
- [Workflows & Examples](#workflows--examples)
- [Scripts Reference](#scripts-reference)
- [Migration & Backup](#migration--backup)
- [Philosophy](#philosophy)

---

## What Problem Does It Solve?

**The Problem:**
- AI assistants lose context between sessions
- You repeat the same coding standards every time
- No clear handoff between planning, implementation, and debugging
- Memory gets lost when switching AI tools

**The Solution:**
- **Persistent Memory**: Checkpoint-based history that survives across sessions
- **Clear Roles**: Specialized agents (Architect, Executor, Debugger)
- **Documented Rules**: MANIFESTO defines non-negotiable principles
- **Skills System**: 249+ reusable best practices for different technologies
- **Backup/Restore**: Migrate your entire setup to another machine in minutes

---

## System Architecture

The system is organized in **3 layers** that work together:

```
┌──────────────────────────────────────────────────────────────┐
│  LAYER 0: KNOWLEDGE BASE (Source of Truth)                   │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  MANIFESTO.md                                          │  │
│  │  • Clean Architecture principles                      │  │
│  │  • SOLID patterns                                     │  │
│  │  • Checkpoint Protocol                                │  │
│  │  • Blueprint Protocol (Plan → Approve → Execute)     │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  AGENTS.md                                             │  │
│  │  • ATHENA (Architect) - Guide > Do                    │  │
│  │  • APOLLO (Executor) - Build Clean                    │  │
│  │  • HEFESTO (Debugger) - Diagnose > Fix               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  skills/ (249+ skills)                                 │  │
│  │  • react-patterns, python-best-practices              │  │
│  │  • nextjs, tailwind, security, testing                │  │
│  │  • Custom rules (_custom-*.md)                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                           ▲
                           │ Auto-injected every session
                           │
┌──────────────────────────┼────────────────────────────────────┐
│  LAYER 1: AGENT PERSONALITIES (Entry Point)                   │
│                                                               │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐            │
│  │ ATHENA   │      │ APOLLO   │      │ HEFESTO  │            │
│  │ Architect│      │ Executor │      │ Debugger │            │
│  │ Guide>Do │      │ Teach>Fix│      │Diagnose>Fix          │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘            │
│       │                 │                 │                   │
│       └─────────────────┼─────────────────┘                   │
│                         │ delegates to                        │
└─────────────────────────┼─────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────────┐
│  LAYER 2: SPECIALIZED WORKERS (oh-my-opencode)               │
│                                                               │
│  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────┐           │
│  │Sisyphus │ │Prometheus│ │ Oracle │ │Librarian │           │
│  │Orchestr.│ │ Planner  │ │DebugGod│ │DocsSearch│           │
│  └─────────┘ └──────────┘ └────────┘ └──────────┘           │
│                                                               │
│  ┌─────────┐ ┌──────────┐                                    │
│  │ Explore │ │Multimodal│  + Background Tasks (max 3)        │
│  │FastGrep │ │  Looker  │  + LSP Tools (rename, refactor)    │
│  └─────────┘ └──────────┘  + Session Tools (history)         │
│                             + Auto-resume (checkpoints)       │
└──────────────────────────────────────────────────────────────┘
```

### How the Layers Communicate

1. **User interacts** with Layer 1 (ATHENA, APOLLO, or HEFESTO)
2. **Agents consult** Layer 0 (MANIFESTO, skills) before making decisions
3. **Agents delegate** complex tasks to Layer 2 (Sisyphus, Librarian, etc.)
4. **Results flow back** through layers, respecting Blueprint Protocol
5. **Everything is checkpointed** for continuity across sessions

---

## Quick Start

### 1. Prerequisites

- **OpenCode CLI** installed ([opencode.ai](https://opencode.ai))
- **Node.js 18+** or **Bun**
- **Git** for version control
- Google account (for Antigravity OAuth - optional but recommended)

### 2. Clone & Install

```bash
# Clone repository
git clone https://github.com/AxelMrak/ai.git ~/Developer/ai
cd ~/Developer/ai

# Install dependencies
bun install  # or npm install

# Make scripts executable
chmod +x scripts/*.sh
```

### 3. Configure OpenCode

**Option A: Restore from backup (if migrating)**
```bash
cd ~/Developer/ai/backups/opencode-config-backup_*/
./restore.sh
```

**Option B: Fresh install**
```bash
# Install oh-my-opencode
bunx oh-my-opencode install --no-tui --claude=no --openai=no --gemini=yes --copilot=no

# Copy configuration files
cp ~/Developer/ai/backups/opencode-config-backup_*/opencode.json ~/.config/opencode/
cp ~/Developer/ai/backups/opencode-config-backup_*/oh-my-opencode.json ~/.config/opencode/
```

### 4. Authenticate

```bash
opencode auth login
# Select: Google → OAuth with Google (Antigravity)
```

### 5. Initialize Project

```bash
cd your-project

# Create .ai/ folder
mkdir -p .ai/checkpoints .ai/plans .ai/notes

# Create initial checkpoint
~/Developer/ai/scripts/checkpoint-create.sh "initial-setup" "SYSTEM" "COMPLETED"

# Create TO-DO.md
cat > .ai/TO-DO.md << 'EOF'
## Current Focus
Project initialization

## Tasks
- [ ] Set up base structure
- [ ] Configure dependencies
- [ ] Define architecture
EOF

# Create CONTEXT.md
cat > .ai/CONTEXT.md << 'EOF'
# Project Context
> Last updated: $(date +%Y-%m-%d)

## Stack
lang: typescript
runtime: node-22
framework: nextjs-15
db: postgres
ui: tailwind

## Structure
(describe your folder structure)

## Skills
(list relevant skills from ~/Developer/ai/skills/)
EOF
```

### 6. Start Coding

```bash
opencode
# Default agent: ATHENA
# Try: "ulw: Create user authentication system"
```

---

## The Three Layers

### Layer 0: Knowledge Base

**Location:** `~/Developer/ai/`

This is your **source of truth**. It defines how all agents should behave.

#### MANIFESTO.md

```
┌─────────────────────────────────────┐
│         MANIFESTO.md                │
│                                     │
│  1. Identity & Philosophy           │
│     • Blueprint Protocol            │
│     • Anti-Vibe Coding              │
│                                     │
│  2. Architecture & Code Standards   │
│     • Clean Architecture            │
│     • SOLID principles              │
│     • Anti-God Rule (<150 lines)    │
│                                     │
│  3. Language & Comments             │
│     • No Comments Policy            │
│     • English in code only          │
│                                     │
│  4. Context & Memory                │
│     • Checkpoint Protocol           │
│     • .ai/ Structure                │
│     • Skill Detection               │
└─────────────────────────────────────┘
```

**Key Principles:**
- **Blueprint Protocol**: Plan → Approve → Execute (never skip approval)
- **Clean Architecture**: Domain → Application → Infrastructure
- **No Comments**: Code must be self-documenting
- **Checkpoint System**: Immutable session history

#### AGENTS.md

```
┌──────────────────────────────────────────────────────┐
│              AGENTS.md                                │
│                                                       │
│  ┌─────────────────┐  ┌─────────────────┐           │
│  │    ATHENA       │  │    APOLLO       │           │
│  │   Architect     │  │   Executor      │           │
│  ├─────────────────┤  ├─────────────────┤           │
│  │ • Plans first   │  │ • Implements    │           │
│  │ • No execution  │  │ • Clean code    │           │
│  │ • Options A/B   │  │ • Tests pass    │           │
│  └─────────────────┘  └─────────────────┘           │
│                                                       │
│  ┌─────────────────┐                                 │
│  │   HEFESTO       │  Handoff Rules:                │
│  │   Debugger      │  • ATHENA → APOLLO (on plan)   │
│  ├─────────────────┤  • APOLLO → HEFESTO (on bug)   │
│  │ • Diagnose      │  • HEFESTO → ATHENA (arch fix) │
│  │ • Root cause    │                                │
│  │ • Prod review   │                                │
│  └─────────────────┘                                 │
└──────────────────────────────────────────────────────┘
```

**Agent Workflows:**

```
User: "Add OAuth"
    ↓
ATHENA:
1. Reads skills/authentication/
2. Reads .ai/checkpoints/LATEST.md
3. Proposes: Option A (Simple) vs B (Custom)
4. Asks: "¿Le mando mecha?"
    ↓
User: "Dale"
    ↓
APOLLO:
1. Reads skills/react-patterns/
2. Implements OAuth flow
3. Runs tests
4. Creates checkpoint: "oauth-implementation"
    ↓
HEFESTO (final review):
1. Checks code quality
2. Verifies tests
3. Approves for production
```

#### skills/ (249+ Skills)

```
skills/
├── SKILL-INDEX.md              # Auto-generated index
├── react-patterns/
│   ├── SKILL.md
│   └── rules/
│       ├── hooks-best-practices.md
│       ├── component-composition.md
│       └── _custom-my-rule.md   # User-added
├── nextjs-best-practices/
├── python-patterns/
├── security/
├── testing-patterns/
└── _scripts/
    ├── build.ts                 # Generate SKILL.md from rules/
    ├── sync-external.ts         # Sync from GitHub
    └── generate-index.ts        # Rebuild index
```

**Skill Discovery:**
1. Agent scans `SKILL-INDEX.md`
2. Loads specific skill when needed
3. Never loads all skills (token economy)
4. User can add custom rules with `_custom-` prefix

---

### Layer 1: Agent Personalities

**Your entry point.** You always interact with one of these three agents.

#### ATHENA - The Architect

```
┌─────────────────────────────────────┐
│            ATHENA                   │
│         "Guide > Do"                │
├─────────────────────────────────────┤
│ Phase: OBSERVE + ORIENT (Planning)  │
│ Question: "¿Cómo debería ser?"      │
│                                     │
│ Capabilities:                       │
│ ✓ Read-only filesystem              │
│ ✓ Memory operations                 │
│ ✓ Search & research                 │
│ ✗ Write code (delegates to APOLLO)  │
│                                     │
│ Outputs:                            │
│ • Architecture diagrams             │
│ • Option A vs B comparison          │
│ • Risk analysis                     │
│ • Plans in .ai/plans/               │
│                                     │
│ Signature Phrases:                  │
│ "Esto es de fisura"                 │
│ "No escala"                         │
│ "Técnicamente impecable"            │
└─────────────────────────────────────┘
```

**When to use ATHENA:**
- "How should I architect this feature?"
- "Plan a refactor for the auth system"
- "Compare NextAuth vs custom OAuth"

#### APOLLO - The Executor

```
┌─────────────────────────────────────┐
│            APOLLO                   │
│         "Teach > Fix"               │
├─────────────────────────────────────┤
│ Phase: DECIDE + ACT (Building)      │
│ Question: "¿Cómo lo construyo?"     │
│                                     │
│ Capabilities:                       │
│ ✓ Read + Write filesystem           │
│ ✓ Git operations                    │
│ ✓ Terminal execution                │
│ ✓ Create checkpoints                │
│                                     │
│ Outputs:                            │
│ • Clean, tested code                │
│ • Git commits                       │
│ • Checkpoints on completion         │
│ • Implementation logs               │
│                                     │
│ Signature Phrases:                  │
│ "Quedó una pinturita"               │
│ "Limpio como quirófano"             │
│ "Esto es música para mis oídos"     │
└─────────────────────────────────────┘
```

**When to use APOLLO:**
- "Implement the OAuth flow from ATHENA's plan"
- "Add tests for the user service"
- "Refactor the payment component"

#### HEFESTO - The Debugger

```
┌─────────────────────────────────────┐
│           HEFESTO                   │
│       "Diagnose > Fix"              │
├─────────────────────────────────────┤
│ Phase: DIAGNOSE + REVIEW            │
│ Question: "¿Por qué se rompió?"     │
│                                     │
│ Capabilities:                       │
│ ✓ All diagnostic tools              │
│ ✓ Session history analysis          │
│ ✓ Checkpoint search                 │
│ ✓ Production gatekeeper             │
│                                     │
│ Outputs:                            │
│ • Root cause analysis               │
│ • Bug reports in .ai/notes/         │
│ • Quick Fix vs Proper Fix options   │
│ • Production approval               │
│                                     │
│ Signature Phrases:                  │
│ "Veamos qué se rompió"              │
│ "Vamos por partes"                  │
│ "El log dice la verdad"             │
└─────────────────────────────────────┘
```

**When to use HEFESTO:**
- "Debug why tests are failing"
- "Find when this bug was introduced"
- "Review code before production"

---

### Layer 2: Specialized Workers (oh-my-opencode)

**Background orchestration.** These agents work behind the scenes.

```
┌──────────────────────────────────────────────────────────┐
│                 oh-my-opencode Agents                     │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Sisyphus (Orchestrator)                                 │
│  ├─ Coordinates background tasks                         │
│  ├─ Manages parallel execution                           │
│  └─ Ensures task completion                              │
│                                                           │
│  Prometheus (Planner)                                    │
│  ├─ Interview-based planning                             │
│  ├─ Generates work plans                                 │
│  └─ Tab mode: /start-work                                │
│                                                           │
│  Oracle (High-IQ Backup)                                 │
│  ├─ Complex debugging                                    │
│  ├─ Architecture decisions                               │
│  └─ Second opinion on fixes                              │
│                                                           │
│  Librarian (Docs + Code Search)                          │
│  ├─ Official documentation (context7)                    │
│  ├─ GitHub code search (grep_app)                        │
│  └─ Codebase exploration                                 │
│                                                           │
│  Explore (Fast Grep)                                     │
│  ├─ Ultra-fast codebase search                           │
│  ├─ Pattern matching                                     │
│  └─ Dependency mapping                                   │
│                                                           │
│  Multimodal Looker (Visual)                              │
│  ├─ Image analysis                                       │
│  ├─ UI screenshots                                       │
│  └─ Visual debugging                                     │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Infrastructure Tools:**

```
┌──────────────────────────────────────────────────────────┐
│                   Built-in Tools                          │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Background Agents (max 3 concurrent)                    │
│  ├─ ATHENA launches Librarian + Explore in parallel      │
│  └─ Results merge for comprehensive context              │
│                                                           │
│  LSP Tools                                               │
│  ├─ Rename symbols safely                                │
│  ├─ Extract methods                                      │
│  ├─ Diagnostics (errors, warnings)                       │
│  └─ Refactor with confidence                             │
│                                                           │
│  AST-Grep (Structural Search)                            │
│  ├─ Find patterns, not just strings                      │
│  ├─ Language-aware search                                │
│  └─ Reliable code transformations                        │
│                                                           │
│  Session Tools                                           │
│  ├─ List previous sessions                               │
│  ├─ Search session history                               │
│  └─ Analyze debugging patterns                           │
│                                                           │
│  MCPs (Model Context Protocol)                           │
│  ├─ websearch (Exa) - AI-powered web search             │
│  ├─ grep_app - GitHub public code search                 │
│  ├─ context7 - Official documentation                    │
│  ├─ fast-filesystem - File operations                    │
│  └─ 8+ more MCPs available                               │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

**Productivity Hooks:**

- **Todo Enforcer**: Forces completion of .ai/TO-DO.md tasks
- **Comment Checker**: Validates no-comments policy
- **Ralph Loop**: Iterates until satisfaction
- **Think Mode**: Deep reasoning for complex problems
- **Auto-resume**: Uses LATEST.md checkpoint for crash recovery

---

## Memory System: Checkpoints

**The key innovation:** Replace MEMORY.md with immutable, timestamped checkpoints.

### Architecture

```
.ai/
├── CONTEXT.md              # Semi-static: stack, structure, ADRs
├── TO-DO.md                # Current tasks
├── checkpoints/            # ← The memory system
│   ├── 2026-01-28_15-30_oauth-implementation.md
│   ├── 2026-01-29_10-15_refactor-user-service.md
│   ├── 2026-01-29_14-00_fix-memory-leak.md
│   └── LATEST.md           # Symlink → most recent checkpoint
├── plans/                  # Collaborative work plans
│   └── 2026-01-28-oauth-strategy.md
└── notes/                  # Technical notes, bugs
    └── memory-leak-investigation.md
```

### Checkpoint Flow

```
┌─────────────────────────────────────────────────────────┐
│                  Checkpoint Lifecycle                    │
└─────────────────────────────────────────────────────────┘

1. TRIGGER
   ├─ Feature completed
   ├─ Session end ("terminamos")
   ├─ Refactor done
   ├─ Bug fixed
   └─ Crash (auto-resume)
           ↓
2. AGENT ASKS
   "¿Creo checkpoint de esta sesión?"
           ↓
3. USER APPROVES
   "Dale" (or auto for crash)
           ↓
4. SCRIPT RUNS
   checkpoint-create.sh "description" "AGENT" "STATUS"
           ↓
5. TEMPLATE GENERATED
   ├─ Reads previous checkpoint
   ├─ Carries forward tech debt
   ├─ Adds iteration context
   └─ Creates timestamped file
           ↓
6. AGENT FILLS
   ├─ Session summary
   ├─ Changes made
   ├─ Decisions (ADRs)
   ├─ Tech debt (updated)
   ├─ Files modified
   ├─ Tests status
   └─ Next steps
           ↓
7. LATEST.md UPDATED
   Symlink → new checkpoint
           ↓
8. CONTEXT INJECTION
   Next session auto-loads LATEST.md
```

### Checkpoint Template

```markdown
---
date: 2026-01-28
time: 15:30
agent: APOLLO
feature: oauth-implementation
status: COMPLETED
duration: 2h 15m
checkpoint: 2026-01-28_15-30_oauth-implementation.md
previous: 2026-01-28_10-30_setup-auth-structure.md
---

## Session Summary
Implemented OAuth 2.0 authentication flow using NextAuth.js.
Integrated with Google provider, configured session management.

## Changes Made
- Added /api/auth/[...nextauth].ts route
- Updated Prisma schema with Account/Session models
- Configured Google OAuth provider
- Migrated database

## Decisions (ADRs)
- [ADR-015] NextAuth.js over custom OAuth (faster, battle-tested)
- [ADR-016] JWT session strategy (stateless, scales)

## Technical Debt (Iterative)
[Carried forward from previous checkpoint]
- ~~TODO: Set up auth structure~~ ✓ DONE
- ~~TODO: Implement OAuth flow~~ ✓ DONE

[New items this session]
- TODO: Add refresh token rotation
- TODO: Implement PKCE flow for mobile
- TODO: Add E2E tests for auth flow

## Files Modified
- prisma/schema.prisma
- src/pages/api/auth/[...nextauth].ts
- src/lib/auth.ts
- .env.local

## Tests
- ✓ Login flow working
- ✓ Session persistence
- ⚠ Missing E2E tests for logout
- ✗ No mobile PKCE tests yet

## Next Steps
- Implement refresh token rotation
- Add E2E auth tests
- Document OAuth setup in README

---
## Previous Context (Iteration)
Previous checkpoint: 2026-01-28_10-30_setup-auth-structure.md

Summary from previous:
- Set up auth folder structure
- Added placeholder routes
- Configured Prisma for auth tables
```

### Intelligent Iteration

Checkpoints form a chain where context flows:

```
Checkpoint N-1              Checkpoint N               Checkpoint N+1
├─ Tech Debt: A, B     →   ├─ Tech Debt: B, C    →   ├─ Tech Debt: C
├─ Next: Impl OAuth        ├─ DONE: OAuth impl       ├─ DONE: Tests
└─ Status: IN_PROGRESS     ├─ Next: Add tests        └─ Next: Deploy
                           └─ Status: COMPLETED
```

### Benefits Over MEMORY.md

| Before (MEMORY.md) | After (checkpoints/) |
|-------------------|---------------------|
| ❌ Overwrites history | ✅ Immutable, traceable |
| ❌ No precise timing | ✅ Timestamped |
| ❌ Can't rollback | ✅ View any previous state |
| ❌ Hard to search | ✅ grep, diff, analyze |
| ❌ No iteration | ✅ Tech debt carries forward |
| ❌ Single point of failure | ✅ Distributed history |

---

## Integration Guide

### How the Layers Work Together

```
USER REQUEST: "Add user authentication"
    ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 1: ATHENA (Entry Point)                       │
├─────────────────────────────────────────────────────┤
│ 1. Reads MANIFESTO.md (Blueprint Protocol)          │
│ 2. Reads .ai/checkpoints/LATEST.md (current state)  │
│ 3. Consults skills/authentication/                  │
│ 4. Launches background tasks:                       │
│    ├─ Librarian: "Search Next.js auth docs"         │
│    └─ Explore: "Grep existing auth code"            │
│ 5. Results merge → ATHENA                           │
│ 6. Proposes plan:                                   │
│    ├─ Option A: NextAuth.js (Simple)                │
│    └─ Option B: Custom OAuth (Full control)         │
│ 7. Asks: "¿Le mando mecha?"                         │
└─────────────────────────────────────────────────────┘
    ↓
USER: "Dale, opción A"
    ↓
┌─────────────────────────────────────────────────────┐
│ LAYER 1: APOLLO (Executor)                          │
├─────────────────────────────────────────────────────┤
│ 1. Reads skills/react-patterns/                     │
│ 2. Implements NextAuth.js flow                      │
│ 3. Uses LSP tools for safe refactoring              │
│ 4. Runs tests                                       │
│ 5. Comment checker validates clean code             │
│ 6. Creates checkpoint:                              │
│    checkpoint-create.sh "oauth-impl" "APOLLO" "DONE"│
└─────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────┐
│ CHECKPOINT CREATED                                   │
├─────────────────────────────────────────────────────┤
│ .ai/checkpoints/2026-01-28_15-30_oauth-impl.md      │
│ LATEST.md → 2026-01-28_15-30_oauth-impl.md          │
│ .ai/TO-DO.md updated (mark OAuth complete)          │
└─────────────────────────────────────────────────────┘
    ↓
NEXT SESSION: Reads LATEST.md and continues from here
```

### Context Injection Flow

Every session automatically loads:

```
┌──────────────────────────────────────────┐
│      oh-my-opencode Context Injection    │
├──────────────────────────────────────────┤
│ Auto-loaded on every session start:      │
│                                          │
│ 1. ~/Developer/ai/MANIFESTO.md           │
│    → Architecture rules, protocols       │
│                                          │
│ 2. ~/Developer/ai/AGENTS.md              │
│    → Agent behaviors, handoff rules      │
│                                          │
│ 3. ~/Developer/ai/skills/SKILL-INDEX.md  │
│    → Available skills for discovery      │
│                                          │
│ 4. .ai/CONTEXT.md                        │
│    → Project stack, structure            │
│                                          │
│ 5. .ai/checkpoints/LATEST.md             │
│    → Current state, recent decisions     │
│                                          │
└──────────────────────────────────────────┘
           ↓
All agents have full context from minute 1
```

---

## Workflows & Examples

### Workflow 1: Planning a Feature (ATHENA)

```bash
opencode
# Select agent: ATHENA (or default)

User: "I need to add payment processing to the app"

ATHENA:
1. Reads .ai/checkpoints/LATEST.md
2. Sees current focus: "User management complete"
3. Consults skills/payment-integration/
4. Launches Librarian (background): "Search Stripe docs"
5. Launches Explore (background): "Find payment-related code"
6. Results merge
7. Presents options:

   Option A (Stripe Checkout):
   - Pros: Hosted, PCI compliant, faster
   - Cons: Less customization
   - Time: 1 day

   Option B (Stripe Elements):
   - Pros: Custom UI, full control
   - Cons: More complex, PCI considerations
   - Time: 3 days

8. Asks: "¿Le mando mecha con opción A?"

User: "Dale"

ATHENA:
9. Creates plan in .ai/plans/2026-01-29-stripe-integration.md
10. Updates .ai/TO-DO.md with tasks
11. Hands off to APOLLO: "Implementa según plan"
```

### Workflow 2: Implementing (APOLLO)

```bash
opencode
# Select agent: APOLLO

User: "Implement the Stripe plan from ATHENA"

APOLLO:
1. Reads .ai/plans/2026-01-29-stripe-integration.md
2. Reads skills/react-patterns/ and skills/nextjs/
3. Implements:
   - API route: /api/payment/create-checkout
   - Component: <CheckoutButton />
   - Webhook handler: /api/webhooks/stripe
4. Uses LSP tools for safe refactoring
5. Runs tests: ✓ All passing
6. Comment checker: ✓ No unnecessary comments
7. Creates checkpoint:

$ ~/Developer/ai/scripts/checkpoint-create.sh "stripe-checkout" "APOLLO" "COMPLETED"

8. Fills checkpoint with:
   - Summary: "Implemented Stripe Checkout"
   - Changes: API routes, components, webhooks
   - Tech debt: "TODO: Add retry logic for webhooks"
   - Files: List all modified files
   - Tests: Status of test suite
   - Next: "Add subscription management"

9. Updates .ai/TO-DO.md (mark payment as done)
10. Reports: "Stripe Checkout implemented. Checkpoint created."
```

### Workflow 3: Debugging (HEFESTO)

```bash
opencode
# Select agent: HEFESTO

User: "Payment webhook failing in production"

HEFESTO:
1. Reads .ai/checkpoints/LATEST.md
2. Searches previous checkpoints:
   $ ~/Developer/ai/scripts/checkpoint-search.sh "webhook"
3. Finds: 2026-01-29_15-30_stripe-checkout.md
4. Sees tech debt: "TODO: Add retry logic for webhooks"
5. Analyzes logs
6. Identifies root cause: "Webhook signature verification fails"
7. Proposes:

   Quick Fix: Disable signature verification (NOT RECOMMENDED)
   Proper Fix: Use raw body parser for webhook route

8. Asks: "¿Implemento Proper Fix?"

User: "Dale"

HEFESTO:
9. Implements fix
10. Verifies in production
11. Creates checkpoint:
   - Summary: "Fixed webhook signature verification"
   - Root cause: Body parser middleware
   - Solution: Raw body parser for /api/webhooks/*
   - Prevention: Added test for webhook verification
12. Documents in .ai/notes/webhook-debugging-2026-01-29.md
```

### Workflow 4: Using "ultrawork" Keyword

```bash
opencode

User: "ulw: Refactor authentication to support OAuth + email/password"

# "ulw" triggers full orchestration:

1. Sisyphus (orchestrator) takes control
2. Prometheus generates work plan (interview mode)
3. Multiple agents work in parallel:
   - Librarian: Searches auth best practices
   - Explore: Maps current auth implementation
   - Oracle: Reviews architecture implications
4. Results merge
5. ATHENA reviews and approves plan
6. APOLLO implements step-by-step
7. Todo Enforcer ensures completion
8. Checkpoint created automatically
9. Reports: "Refactor complete. 47 files modified, all tests passing."
```

---

## Scripts Reference

### Checkpoint Scripts

```bash
# Create checkpoint
~/Developer/ai/scripts/checkpoint-create.sh "description" [agent] [status]

# Examples:
./checkpoint-create.sh "oauth-implementation" "APOLLO" "COMPLETED"
./checkpoint-create.sh "refactor-auth" "ATHENA" "IN_PROGRESS"

# List recent checkpoints
~/Developer/ai/scripts/checkpoint-list.sh [--recent N]

# Search checkpoints
~/Developer/ai/scripts/checkpoint-search.sh "keyword"

# Migrate existing MEMORY.md
~/Developer/ai/scripts/migrate-memory-to-checkpoints.sh /path/to/project
```

### Backup & Migration

```bash
# Create full backup
~/Developer/ai/scripts/backup-opencode-config.sh ~/Desktop

# Output:
# - opencode-config-backup_YYYYMMDD_HHMMSS/
# - opencode-config-backup_YYYYMMDD_HHMMSS.tar.gz

# Restore on new machine
tar -xzf opencode-config-backup_*.tar.gz
cd opencode-config-backup_*/
./restore.sh
```

### Skill Management

```bash
# Regenerate skill index
cd ~/Developer/ai
bun run skills/_scripts/generate-index.ts

# Sync external skills (anthropics, vercel-labs)
bun run skills/_scripts/sync-external.ts

# Build individual skill from rules/
bun run skills/_scripts/build.ts
```

---

## Migration & Backup

### Migrating to Another Machine

**Step 1: Backup on current machine**
```bash
cd ~/Developer/ai
./scripts/backup-opencode-config.sh ~/Desktop
```

**Step 2: Transfer files**
```bash
# Copy to new machine:
# - opencode-config-backup_*.tar.gz
# - Clone git repo: git clone https://github.com/AxelMrak/ai.git ~/Developer/ai
```

**Step 3: Restore on new machine**
```bash
# Install OpenCode first
# Then restore config:
tar -xzf opencode-config-backup_*.tar.gz
cd opencode-config-backup_*/
./restore.sh

# Authenticate
opencode auth login
```

**Step 4: Verify**
```bash
opencode --version
opencode run -m google/gemini-3-flash -p "test"
```

### Migrating Project Checkpoints

```bash
# If project has old MEMORY.md:
cd your-project
~/Developer/ai/scripts/migrate-memory-to-checkpoints.sh .

# Result:
# - .ai/checkpoints/YYYY-MM-DD_HH-MM_migrated-from-memory.md
# - .ai/checkpoints/LATEST.md (symlink)
# - .ai/MEMORY.md.deprecated
```

---

## Philosophy

### You Are the Architect

This system doesn't automate thinking—it creates a framework where thinking is:
- **Explicit**: Every decision is documented
- **Persistent**: Nothing is lost between sessions
- **Reusable**: Skills and patterns are codified
- **Traceable**: Full history in checkpoints

### Agents Are Your Team

- **ATHENA** is your senior architect who asks hard questions
- **APOLLO** is your craftsman who builds with pride
- **HEFESTO** is your debugger who finds root causes
- **Layer 2** provides infrastructure (LSP, search, background tasks)

### Blueprint Protocol Is Sacred

```
Plan → Approve → Execute
```

**Never skip approval.** This prevents:
- Vibe coding (building without thinking)
- Wasted work (building the wrong thing)
- Tech debt (taking shortcuts)

### The Code Is Yours

Use what works. Ignore what doesn't. Adapt to your needs.

This is a **framework**, not a prison.

---

## FAQ

**Q: Do I need all three agents?**  
A: No. Use ATHENA for planning, APOLLO for coding, or HEFESTO for debugging as needed.

**Q: Can I use this without oh-my-opencode?**  
A: Yes. MANIFESTO + AGENTS work standalone. oh-my-opencode adds power tools.

**Q: What if I switch AI tools (Claude → ChatGPT)?**  
A: Context lives in `.ai/` files. Copy them, and you're good.

**Q: Is it overkill for small projects?**  
A: For 1-file scripts, yes. For anything with >3 files, it pays off fast.

**Q: How much does it cost?**  
A: The repo is free. OpenCode + oh-my-opencode use your existing AI subscriptions.

**Q: What about API keys?**  
A: Antigravity OAuth uses your Google account quota (no separate API key needed).

**Q: Can I add my own skills?**  
A: Yes! Create `skills/your-skill/rules/_custom-your-rule.md` and run the build script.

**Q: How do I update?**  
A: `cd ~/Developer/ai && git pull origin main`

---

## Contributing

Pull requests welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

MIT

---

**Made by developers, for developers who think before coding.**

🔗 **Links:**
- [GitHub](https://github.com/AxelMrak/ai)
- [OpenCode](https://opencode.ai)
- [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode)
- [Antigravity Auth](https://github.com/shekohex/opencode-google-antigravity-auth)
