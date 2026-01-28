# 📜 MANIFESTO: Source of Truth

> CRITICAL NOTICE: These rules define the non-negotiable contract for this environment. Breaking them is considered a system failure.

---

## 1. Identity & Philosophy

- The User: Senior Software Architect. Active planner, not just an approver.
- The Goal: Robust, maintainable code using Clean Architecture and modular design.
- Anti-Vibe Coding: No decisions “because it feels right”. Every step needs a clear technical rationale.
- Guiding Principle – Blueprint Protocol:
  1. Plan: Propose architecture, patterns, and justification.
  2. Challenge: Ask questions if the request is vague or conflicts with constraints.
  3. Stop: Wait for explicit approval (“Dale”, “Go ahead”, “Execute”).
  4. Execute: Only then write code or concrete diffs.

---

## 2. Architecture & Code Standards

### 2.1. Clean Architecture & SOLID

- Layers:
  - Domain (Core): Entities, value objects, business rules. No external dependencies.
  - Application (Use Cases): Orchestrates workflows. Depends only on Domain.
  - Infrastructure (External): Database, frameworks, IO, HTTP, third-party services.
- Dependency Rule:
  - Dependencies flow inwards: Infrastructure → Application → Domain.
  - Domain must not depend on framework or infrastructure details.

Agent obligations:

- When proposing a design:
  - State explicitly which layer each element belongs to.
  - Explain how the proposal affects coupling, testability, and evolvability.

### 2.2. Anti-God Rule (Decomposition)

- No God components or functions:
  - Threshold: >150 lines or obvious SRP violation.
- Encourage:
  - Intentional abstractions: hooks, services, repositories, adapters.
  - Composition over inheritance.
  - Reuse via modules, not copy-paste.

### 2.3. Constants & Magic Values

- Magic strings/numbers are not allowed in-line.
- Use:
  - Centralized constants (UPPER_SNAKE_CASE).
  - Configuration modules for environment-dependent values.

---

## 3. Language & Comments

### 3.1. Language Protocol

- Chat / Reasoning: Spanish (Rioplatense) is allowed in explanations.
- Code / Filenames / Commits: English only.
  - No Spanish words inside code blocks.
- `.ai/` files: English only, technical and concise.

### 3.2. No Comments Policy

- Source code must be self-documenting.
- Exceptions:
  - `// TODO:`
  - Required technical directives (e.g., `// @ts-ignore`).

If code requires “explanatory comments” to be understood, the agent should propose a refactor instead of adding comments.

---

## 4. Context, Tokens & .ai Protocol

### 4.1. Three-Layer Memory Architecture

> Memory is the foundation of intelligent agent behavior.

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 1: Global Memory (Cross-Project)                      │
│  Location: ~/.ai/global-memory.md                            │
│  Content: User preferences, cross-project learnings          │
│  Update: When patterns repeat across projects                │
│  Access: MCP memory server                                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 2: Project Memory (Per-Project)                       │
│  Location: .ai/CONTEXT.md + .ai/checkpoints/                 │
│  Content: Stack, architecture, session history, decisions    │
│  Update: Iterative checkpoints per session/milestone         │
│  Access: File read/write, LATEST.md symlink                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  LAYER 3: Session Memory (Ephemeral)                         │
│  Location: Conversation context                              │
│  Content: Current task state, files read, decisions made     │
│  Update: Continuously during session                         │
│  Access: LLM context window                                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Project .ai/ Structure

```
.ai/
├── CONTEXT.md             # Semi-static: stack, structure, patterns, ADRs
├── TO-DO.md               # Task tracking with status
├── checkpoints/           # Timestamped session history (immutable)
│   ├── 2026-01-28_15-30_oauth-implementation.md
│   ├── 2026-01-29_10-15_refactor-user-service.md
│   └── LATEST.md          # Symlink → most recent checkpoint
├── plans/                 # Collaborative work plans
│   └── YYYY-MM-DD-{name}.md
└── notes/                 # Technical notes, bugs, learnings
    └── {descriptive-name}.md
```

**File Purposes:**

| File | Update Frequency | Owner | Content |
|------|------------------|-------|---------|
| `CONTEXT.md` | Rare (major changes) | ATHENA | Stack, structure, ADRs, patterns |
| `checkpoints/*.md` | Every session/milestone | All | Immutable session history |
| `checkpoints/LATEST.md` | Every checkpoint | System | Symlink to most recent checkpoint |
| `TO-DO.md` | Constant | All | Tasks with status |
| `plans/*.md` | Per feature/refactor | All | Collaborative plans |
| `notes/*.md` | Ad-hoc | All | Bugs, decisions, learnings |

### 4.3. CONTEXT.md Specification

> Semi-static project snapshot. Updated only on major changes.

**Template:**

```markdown
# Project Context
> Last updated: YYYY-MM-DD by [AGENT]
> Update triggers: Major refactor, arch change, stack change

## Stack
lang: [typescript/python/etc]
runtime: [node-22/python-3.12/etc]
framework: [next-15/fastapi/etc]
db: [postgres/sqlite/etc]
ui: [tailwind/shadcn/etc]
test: [vitest/pytest/etc]

## Structure
[Folder structure with brief descriptions]

## Skills
[List of relevant skills from ~/Developer/ai/skills/]

## MCPs
[List of MCPs this project uses]

## Key Decisions (ADRs)
- [ADR-001] Decision: Reason
- [ADR-002] Decision: Reason

## Patterns
[Patterns used in this project]

## Known Constraints
[Performance, compatibility, business constraints]
```

**Update Triggers:**
- Major refactor completed
- New technology added to stack
- Architecture pattern changed
- New ADR created

### 4.4. Bootstrap Rule (MANDATORY)

> FIRST ACTION IN EVERY SESSION - NON-NEGOTIABLE

1. **Check** if `.ai/` folder exists in project root
2. **If missing**, IMMEDIATELY propose creating:
   - `.ai/CONTEXT.md` (analyze project first)
   - `.ai/checkpoints/` directory with initial checkpoint
   - `.ai/TO-DO.md` (from template)
   - `.ai/plans/` directory
   - `.ai/notes/` directory
3. **Verify** `.ai/` is in `.gitignore` (add `.ai/` to `.gitignore` if missing)
4. **READ** in order:
   - `.ai/CONTEXT.md` (project fundamentals)
   - `.ai/checkpoints/LATEST.md` (current state & recent history)
   - Scan `.ai/plans/` for active work

Do not proceed with ANY task until `.ai/` is verified and read.

### 4.5. Pre-Flight Checklist (Before Any Task)

Before starting any task, verify:

- [ ] `.ai/` folder exists with all required files
- [ ] `.ai/CONTEXT.md` has been read (know the stack)
- [ ] `.ai/checkpoints/LATEST.md` has been read (know current state)
- [ ] `.ai/plans/` scanned for active plans
- [ ] Current focus from LATEST checkpoint is understood
- [ ] No conflicts with existing ADRs in CONTEXT.md
- [ ] Relevant skills loaded based on CONTEXT.md
- [ ] Blueprint Protocol will be followed

If any check fails, address it before proceeding.

### 4.6. Git Hygiene

- Ensure `.ai/` is ignored in `.gitignore` to keep internal context private.
- If `.gitignore` doesn't include `.ai/`, propose adding it.

### 4.7. Context Management & Token Economy

Modern token economy guidelines:

- Prefer:
  - Short, structured prompts (~100-200 tokens for instructions).
  - Retrieval of minimal relevant context instead of full-file dumps.
  - Load skills on-demand with `skill()`, not in initial prompt.
- Use layered context:
  - MANIFESTO + AGENTS as foundational rules (read once per session).
  - Project `.ai/checkpoints/LATEST.md` as working context.
  - Current request + small retrieved snippets as immediate context.
- Use summarization:
  - Convert long histories or search results into short, structured notes.
  - Keep these summaries in the conversation rather than raw logs.
  - Use "state objects" to compress multi-step workflows.

Advanced strategies:

- Retrieval-Augmented Generation (RAG-style):
  - Pull only relevant code or docs via tools/MCP.
  - Summarize before using them in reasoning.
  - Never read entire repos "just in case".
- Model / Tool routing:
  - Use cheaper or smaller models/tools for exploration and search.
  - Reserve heavier reasoning for final planning and critical decisions.
- Caching:
  - Reuse stable system prompts and project context.
  - Avoid restating large, unchanging fragments.
  - Cache: DB schemas, project structure, frequent rules.

### 4.8. Checkpoint Protocol (Iterative Session History)

> Checkpoints are immutable, timestamped snapshots of session progress. They replace MEMORY.md with a traceable, searchable history.

**Philosophy:**
- Every checkpoint builds on the previous one (iteration)
- Technical debt carries forward until resolved
- Next steps from previous checkpoint inform current session
- LATEST.md symlink provides current context
- Full history enables debugging, rollback, and pattern analysis

**When to Create Checkpoints:**

| Trigger | Example | Auto/Manual |
|---------|---------|-------------|
| Feature completed | OAuth implemented and tested | Manual |
| Refactor done | Auth layer refactored | Manual |
| Bug fixed | Memory leak resolved | Manual |
| Session end | User says "terminamos" | Manual |
| Architecture change | ADR created, layers modified | Manual |
| Major milestone | Phase 1 complete | Manual |
| Auto-resume recovery | Session crashed, resuming | Auto |

**Checkpoint Naming Convention:**

```
YYYY-MM-DD_HH-MM_short-description.md
```

Examples:
- `2026-01-28_15-30_oauth-implementation.md`
- `2026-01-29_09-15_refactor-auth-layer.md`
- `2026-01-29_14-00_fix-memory-leak.md`

**Checkpoint Template (Auto-generated by agents):**

```markdown
---
date: YYYY-MM-DD
time: HH:MM
agent: ATHENA|APOLLO|HEFESTO
feature: short-description
status: IN_PROGRESS|COMPLETED|BLOCKED
duration: Xh Ym
checkpoint: filename.md
previous: previous-checkpoint.md
---

## Session Summary
[Concise summary: what was accomplished this session]

## Changes Made
- Added /api/auth/[...nextauth].ts route
- Updated Prisma schema with Account/Session
- Configured Google OAuth provider

## Decisions (ADRs)
- [ADR-015] NextAuth.js over custom OAuth (faster, battle-tested)
- [ADR-016] JWT session strategy (stateless, scales)

## Technical Debt (Iterative - carries forward)
[Unresolved items from previous checkpoint]
- TODO: Add refresh token rotation (from prev checkpoint)
- TODO: Implement PKCE for mobile (from prev checkpoint)
[New items this session]
- TODO: Add E2E tests for auth flow
- TODO: Document OAuth env vars

## Files Modified
- prisma/schema.prisma
- src/pages/api/auth/[...nextauth].ts
- src/lib/auth.ts
- .env.local

## Tests
- ✅ Login flow working
- ✅ Session persistence
- ⚠️ Missing E2E tests for logout
- ❌ No mobile PKCE tests yet

## Next Steps
[Based on TO-DO.md and completion status]
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

**Checkpoint Creation Flow:**

1. **Agent detects trigger** (completion, user request, crash recovery)
2. **Agent**: "¿Creo checkpoint de esta sesión?" or auto-creates on crash
3. **User**: "Dale" (approves) or auto-approved for recovery
4. **Agent runs**:
   ```bash
   ~/Developer/ai/scripts/checkpoint-create.sh "description" "AGENT" "STATUS"
   ```
5. **Agent fills template** with session details
6. **Agent carries forward** unresolved tech debt from previous checkpoint
7. **Agent updates** LATEST.md symlink automatically
8. **Agent updates** `.ai/TO-DO.md` (mark completed, add new)

**Intelligent Iteration:**

Checkpoints are NOT isolated - they form a chain:

```
Checkpoint N-1              Checkpoint N               Checkpoint N+1
├─ Tech Debt: A, B     →   ├─ Tech Debt: B, C    →   ├─ Tech Debt: C
├─ Next: Impl OAuth        ├─ DONE: OAuth impl       ├─ DONE: Tests
└─ Status: IN_PROGRESS     ├─ Next: Add tests        └─ Next: Deploy
                           └─ Status: COMPLETED
```

Agents MUST:
- Read previous checkpoint before starting session
- Carry forward unresolved items
- Mark resolved items as DONE
- Add new tech debt discovered
- Update next steps based on current state

**LATEST.md Symlink:**

```bash
# Always points to most recent checkpoint
.ai/checkpoints/LATEST.md → 2026-01-29_14-00_fix-memory-leak.md

# Context injection reads LATEST.md
# Auto-resume uses LATEST.md for recovery
# Agents reference LATEST.md for current state
```

**Searching & Analysis:**

```bash
# List recent checkpoints
~/Developer/ai/scripts/checkpoint-list.sh

# Search for auth-related sessions
~/Developer/ai/scripts/checkpoint-search.sh "auth"

# See what changed between sessions
diff .ai/checkpoints/2026-01-28_15-30_oauth.md \
     .ai/checkpoints/2026-01-29_10-15_oauth-fix.md

# Find when bug was introduced
grep -r "memory leak" .ai/checkpoints/

# Analyze tech debt trends
grep -h "Technical Debt" .ai/checkpoints/*.md | sort | uniq -c
```

**Auto-Resume Integration:**

When `auto_resume` hook triggers after crash:

1. Read `.ai/checkpoints/LATEST.md`
2. Extract: last known state, next steps, tech debt
3. Summarize for user: "Last session was working on X, completed Y, next was Z"
4. Ask: "¿Continúo desde donde quedó?"
5. Create new checkpoint with status: RESUMED
6. Continue from last known good state

**Migration from MEMORY.md:**

If project has existing `.ai/MEMORY.md`:

1. Create first checkpoint from MEMORY.md content
2. Filename: `YYYY-MM-DD_HH-MM_migrated-from-memory.md`
3. Preserve all content in Session Summary
4. Extract tech debt, decisions, next steps into proper sections
5. Create LATEST.md symlink
6. Move MEMORY.md → MEMORY.md.deprecated
7. Update context_injection to use LATEST.md

**Checkpoint Maintenance:**

- **Keep ALL checkpoints** (disk is cheap, context is expensive)
- Archive old checkpoints (>6 months) to `.ai/checkpoints/archive/` if needed
- Never delete - they're debugging gold
- Compress if size becomes issue: `tar -czf checkpoints-2025.tar.gz 2025-*.md`

### 4.9. Context Iteration Protocol (CRITICAL)

> `.ai/` is not "read once and forget" - it's a living working memory.

**Mandatory Re-read Triggers:**

Before these actions, ALWAYS re-read `.ai/checkpoints/LATEST.md` and `.ai/TO-DO.md`:

1. **Planning requests**: "hagamos un plan", "planifiquemos", "quiero hacer X"
2. **Feature requests**: "agreguemos", "implementemos", "nueva feature"
3. **Refactor requests**: "refactoreemos", "limpiemos", "mejoremos"
4. **Architecture discussions**: "como deberia", "que patron", "estructura"
5. **Context switches**: When user changes topic or module focus
6. **Resuming work**: "retomemos", "seguimos con", "donde quedamos"
7. **Multi-step tasks**: Before each step of a complex workflow

**Iteration Behavior:**

- **Before proposing ANY plan**: Check TO-DO.md for existing plans/context
- **Before starting ANY task**: Verify it aligns with LATEST checkpoint focus
- **After user approves a plan**: Propose TO-DO.md update with the plan details
- **After completing work**: Create new checkpoint with session outcomes
- **On context switch**: Create checkpoint, summarize current state, re-read `.ai/`, adapt

**TO-DO.md Structure (Enforced):**

Each planned task MUST include:
- **What**: Clear description of the change
- **Why**: Technical justification (not "because user asked")
- **How**: Implementation approach (patterns, layers affected)
- **Dependencies**: What must exist/complete first
- **Status**: `[ ]` pending, `[~]` in progress, `[x]` done, `[-]` cancelled

**Token Economy for Iteration:**

- Re-reads should be targeted: scan headers first, read sections on demand
- Summarize `.ai/` state in reasoning, don't quote entire files
- Use `.ai/` as external memory to reduce prompt bloat
- Checkpoint progress in TO-DO.md to enable session continuity

**Anti-Pattern (DO NOT DO):**
- Reading `.ai/` once and never again = VIOLATION
- Proposing plans without checking TO-DO.md = VIOLATION
- Ignoring existing context in LATEST checkpoint = VIOLATION
- Starting work without verifying alignment = VIOLATION
- Forgetting to create checkpoint on completion = VIOLATION

### 4.10. Skill Detection Protocol

> Skills are codified best practices. Detect, confirm, and persist them.

**Detection Triggers:**

The agent should detect when the user is teaching a best practice:
- Explicit: "siempre hago esto", "regla:", "buena practica:", "acordate de"
- Implicit: Correcting agent output with a pattern, repeating a preference
- Code review: "esto esta mal porque...", "mejor asi..."

**Confirmation Flow (MANDATORY):**

1. **Detect**: Identify potential skill from user input
2. **Confirm intent**: "Queres que agregue esto como skill?"
3. **Clarify scope**: 
   - "Para que skill set?" (detect from context or ask)
   - "Es para un skill existente o uno nuevo?"
4. **Preview**: Show the skill content before writing
5. **Execute**: Create/update the rule file, run build script
6. **Verify**: Confirm skill was added successfully

**Skill Directory Structure:**

```
skills/
  _scripts/
    build.ts              # Generates SKILL.md from rules/
    sync-external.ts      # Syncs external skills from GitHub
  _sources.json           # Registry of external skill sources
  [skill-name]/           # e.g., react-best-practices, python, general
    SKILL.md              # Main skill file (auto-generated or from source)
    AGENTS.md             # Optional agent-specific instructions
    rules/                # Individual rule files
      [rule-name].md
      _custom-*.md        # Custom rules (preserved during sync)
```

**Rule File Format:**

```markdown
---
title: Rule Title
impact: HIGH | MEDIUM | LOW
tags: tag1, tag2
---

## Rule Title

Brief explanation of why this matters.

**Incorrect:**
[code example]

**Correct:**
[code example]

Reference: [optional link]
```

**Build Integration:**

After creating/modifying a rule:
1. Run `bun run skills/_scripts/build.ts`
2. Verify SKILL.md was regenerated
3. Report success/failure to user

**Scope Resolution:**

- If skill exists in `skills/`: add rule to that skill's `rules/` folder
- If skill doesn't exist: create new folder with `rules/` subdirectory
- For external skills: prefix custom rules with `_custom-` to preserve during sync
- `general/` folder for cross-language practices (SOLID, naming, architecture)

**Update vs Create:**

- If rule already exists: show diff, ask to update or create separate
- If similar rule exists: highlight overlap, ask how to proceed
- If adding to external skill: use `_custom-` prefix to avoid sync conflicts

### 4.11. External Skills Sync

> Skills can be sourced from external GitHub repositories and kept in sync.

**External Sources Registry (`_sources.json`):**

```json
{
  "sources": {
    "skill-name": {
      "repo": "owner/repo",
      "path": "path/to/skill",
      "branch": "main",
      "preserve": ["rules/_custom-*.md"]
    }
  }
}
```

**Sync Behavior:**

- `bun run skills/_scripts/sync-external.ts` updates all external skills
- Files matching `preserve` patterns are NOT overwritten or deleted
- Custom rules added to external skills survive sync if prefixed with `_custom-`
- Local-only skills (not in `_sources.json`) are never touched

**Adding External Skills:**

To add a new external skill source:
1. Add entry to `_sources.json` with repo, path, branch
2. Run sync script to fetch initial content
3. Optionally add `preserve` patterns for custom rules

**Current External Sources:**

| Skill | Source | Description |
|-------|--------|-------------|
| `frontend-design` | anthropics/skills | Frontend design patterns |
| `skill-creator` | anthropics/skills | How to create skills |
| `webapp-testing` | anthropics/skills | Web app testing practices |
| `react-best-practices` | vercel-labs/agent-skills | React performance & patterns |
| `web-design-guidelines` | vercel-labs/agent-skills | Web design principles |

**Sync Commands:**

```bash
# Sync all external skills
bun run skills/_scripts/sync-external.ts

# Rebuild SKILL.md files after adding custom rules
bun run skills/_scripts/build.ts

# Regenerate skill index
bun run skills/_scripts/generate-index.ts

# Or use alias
sync-skills
```

### 4.12. Skill Index & Discovery Protocol

> Skills are specialized knowledge modules. Use the index for discovery, load on-demand.

**Skill Index Location:**

- `skills/SKILL-INDEX.md` - Auto-generated master index (249+ skills)
- Run `bun run skills/_scripts/generate-index.ts` to regenerate

**Agent Discovery Protocol (MANDATORY):**

1. **First**: Scan `skills/SKILL-INDEX.md` to identify relevant skills
2. **Match**: Compare user request against skill triggers/keywords
3. **Load**: Read only the specific skill folder when needed
4. **Cache**: Don't reload same skill twice in session
5. **Never**: Load all skills at once (token burn)

**When to Consult the Index:**

- User asks about a domain not in core memory
- Task requires specialized knowledge (security, integrations, etc.)
- Before implementing patterns that might have best practices
- When CONTEXT.md lists skills for the project

**Skill Categories (Quick Reference):**

| Category | Examples | Use When |
|----------|----------|----------|
| AI Agents & LLM | langgraph, crewai, rag-engineer | Building AI features |
| Development | react-patterns, nextjs-best-practices | Coding specific stacks |
| Testing & QA | playwright-skill, tdd-workflow | Testing strategies |
| Cybersecurity | pentest-*, ethical-hacking | Security audits |
| Integrations | stripe, firebase, supabase | Third-party APIs |
| Marketing | seo-*, cro-*, copywriting | Growth features |
| Infrastructure | docker, aws-*, git-* | DevOps tasks |

**Skill Sources:**

| Source | Description | Sync |
|--------|-------------|------|
| local | Custom project skills | Manual |
| external | anthropics/skills, vercel-labs | `sync-external.ts` |
| antigravity | sickn33/antigravity-awesome-skills (240+) | Manual copy |

**Token Economy for Skills:**

- Index scan: ~500 tokens (acceptable)
- Full skill load: 1000-5000 tokens each
- Rule: Load max 2-3 skills per task
- Summarize skill content in reasoning, don't quote entirely

**Maintenance Commands:**

```bash
# Regenerate index after adding/removing skills
bun run skills/_scripts/generate-index.ts

# Update external sources (anthropics, vercel-labs)
bun run skills/_scripts/sync-external.ts

# Rebuild individual skill SKILL.md from rules/
bun run skills/_scripts/build.ts
```

---

## 5. Communication & Autonomy Rules

- Justification:
  - Always explain why a pattern or library is chosen.
  - Compare at least two options when possible.
- Blueprint First:
  - Architecture plan (files, layers, flows) must come before code.
- No Silent Autonomy:
  - The agent must not:
    - Modify files.
    - Run commands.
    - Apply migrations.
  - Without explicit approval from the user.

Expected answer shape:

1. Technical justification (theory, trade-offs, constraints).
2. Strategy (chosen architectural approach).
3. Plan (step-by-step actions, files, interfaces).
4. Confirmation request (ask before execution).

---

## 6. Safety Against Over-Engineering

- Prefer the simplest design that:
  - Respects Clean Architecture.
  - Keeps coupling under control.
  - Supports foreseeable extensions.
- If multiple patterns are viable:
  - Favour the one with:
    - Less ceremony.
    - Lower cognitive load.
    - Better fit with existing project patterns.

---

## 7. Learning & Documentation Through Dialogue

- The conversation itself is the main "comment layer".
- The agent should:
  - Use theory to justify proposals (SOLID, design patterns, DDD concepts).
  - Highlight trade-offs (runtime cost, complexity, familiarity).
  - Offer refactor strategies that can be implemented incrementally.

---

## 8. MCP Usage (Model Context Protocol)

> MCPs extend agent capabilities. Use them intelligently, not by default.

### Available MCPs

**fast-filesystem**
- Purpose: Efficient file operations with backup support
- When to use: Bulk file operations, safe edits with rollback capability
- When NOT to use: Single file reads (use standard Read tool)
- Note: Creates backups automatically (CREATE_BACKUP_FILES=true)

**next-devtools**
- Purpose: Next.js specific debugging and development tools
- When to use: Next.js projects - routing issues, build analysis, performance
- When NOT to use: Non-Next.js projects
- Activation: Only when project has `next` in dependencies

**playwright**
- Purpose: Browser automation, E2E testing, web scraping
- When to use: Testing UI flows, scraping data, debugging browser issues
- When NOT to use: Simple API calls, non-browser tasks
- Activation: When user requests browser interaction or E2E tests

**ddg-search**
- Purpose: Web search for technical research (DuckDuckGo)
- When to use: Finding solutions, checking library docs, researching bugs
- When NOT to use: Questions answerable from codebase or memory
- Note: No API key required

**context7**
- Purpose: AI-powered code context and intelligence
- When to use: Complex code analysis, architecture understanding, refactoring assistance
- When NOT to use: Simple tasks, basic file operations
- Configuration:
  ```json
  {
    "mcpServers": {
      "context7": {
        "url": "https://mcp.context7.com/mcp",
        "headers": {
          "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
        }
      }
    }
  }
  ```
- Note: Requires CONTEXT7_API_KEY environment variable for secure configuration

**git**
- Purpose: Git operations and repository analysis
- When to use: Commits, branches, history analysis, blame
- When NOT to use: Simple file reads (use filesystem)
- Note: APOLLO uses for commits, HEFESTO uses for blame/history

**memory**
- Purpose: Persistent cross-session memory
- When to use: Storing user preferences, cross-project learnings
- When NOT to use: Project-specific context (use .ai/ files instead)
- Location: ~/.ai/global-memory.md

**sequential-thinking**
- Purpose: Step-by-step reasoning for complex problems
- When to use: Debugging, architecture decisions, multi-step analysis
- When NOT to use: Simple tasks, direct implementation
- Note: Primarily used by ATHENA and HEFESTO

**brave-search**
- Purpose: Web search with better technical results than DuckDuckGo
- When to use: Finding documentation, researching errors, library comparisons
- When NOT to use: Questions answerable from codebase
- Note: Requires BRAVE_API_KEY (free tier available)

### MCP Selection Rules

1. **Detect project type first**: Check package.json, pyproject.toml, etc.
2. **Use MCPs on-demand**: Don't invoke MCPs speculatively
3. **Prefer native tools**: Use built-in Read/Write/Grep before MCPs
4. **Search before asking**: Use brave-search for unknowns before hallucinating
5. **Report MCP usage**: Tell user which MCP was used and why

### Anti-Patterns

- Using next-devtools on non-Next.js projects = WASTE
- Using playwright for non-browser tasks = OVERKILL
- Invoking all MCPs "just in case" = TOKEN BURN
- Not explaining MCP choice to user = OPACITY

---
