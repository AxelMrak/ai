# 🧠 PROJECT MEMORY & CONTEXT

> SYSTEM INSTRUCTION: Read this file at the start of every session.
> PURPOSE: High-signal project cache so the agent does not need to scan the full repo on every query.

---

## 📍 Meta-Data

- Project Name: [Project Name]
- Stack: [e.g., Next.js, Bun, Tailwind, PostgreSQL]
- Last Update: [YYYY-MM-DD]
- Current Phase: [MVP / Refactoring / Scaling]
- Context Version: v[major.minor.patch]

### Versioning Rules

- Patch: Small clarifications (notes, typos), no behavioral change.
- Minor: New sections, new conventions, new ADRs.
- Major: Changes to architecture principles, agent protocol, or folder layout.

---

## 🎯 Active Focus (What we are doing NOW)

> Work only within this focus unless the user explicitly changes it.

- Current Goal: [e.g., Implement Auth Flow with JWT]
- Next Step: [e.g., Create route protection middleware]
- User Constraints:
  - [e.g., Do not use external validation libs, keep it manual]
  - [e.g., Do not change database schema during this iteration]
- Non-Goals (for now):
  - [e.g., Do not touch billing until auth is stabilized]

Agent rules:

- If a user request conflicts with this focus, ask for confirmation before planning.
- If the focus is empty or outdated, ask the user to redefine it.

---

## 🗺️ Architecture Snapshot (State of the Union)

Legend: ✅ Stable | 🚧 Volatile | ❌ Broken/Refactor

| Module / Feature | Status      | Path              | Notes                                  |
| :--------------- | :---------- | :---------------- | :------------------------------------- |
| UI Components    | ✅ Stable   | `components/ui/`  | Shadcn-like, atomic, reusable.         |
| Auth Feature     | 🚧 WIP      | `features/auth/`  | Missing password reset.                |
| Database Schema  | ✅ Stable   | `infra/db/schema` | Users & Posts tables, normalized.      |
| API Routes       | ❌ Refactor | `app/api/`        | Move logic to Controllers / Use Cases. |

Agent rules:

- Read volatile (🚧) and broken (❌) modules first when planning changes.
- Do not propose changes to stable (✅) modules without a clear, stated benefit.

---

## 📐 Architecture Decision Records (ADR - Lite)

> Always check these before proposing patterns or libraries.

- ADR-001 – State Management
  Zustand chosen instead of Redux due to lower complexity and overhead for this dashboard.

- ADR-002 – CSS
  Tailwind only. `@apply` allowed only in `globals.css` for design tokens and primitives.

- ADR-003 – Data Fetching
  TanStack Query on the client; native `fetch` on the server.

Proposals that conflict with an ADR must:

1. Name the ADR that would be affected.
2. Explain the trade-offs.
3. Ask the user whether to:
   - Keep the ADR and adapt the solution, or
   - Amend / deprecate the ADR.

---

## 💣 Tech Debt & Hitlist

> Known issues that are allowed (and encouraged) to be refactored.

- [ ] `UserDashboard` is a God Component (>300 lines). Split into smaller containers, views, and hooks.
- [ ] Hardcoded strings in `features/billing`. Move to `constants.ts`.
- [ ] Missing integration tests for payment flow.

Agent behavior:

- When the user requests work in an area that has tech debt:
  - Explain the risks of building on top of the current shape.
  - Offer two paths: (a) minimal targeted refactor first, (b) conscious quick patch.

---

## 📝 Project-Specific Preferences

- React strict mode disabled for legacy modules.
- All dates must be handled in UTC.
- The user prefers:
  - Refactor and architecture plans before code.
  - Clear theoretical justification of patterns (why A vs B).
- No autonomous actions:
  - Do not write files, run commands, or trigger migrations without explicit instruction.

---

## 🔁 Memory & Evolution Protocol

### When to Propose MEMORY.md Updates

The agent should propose MEMORY.md updates (never apply them silently) when:

- A new architecture decision is made or strongly implied.
- A module status changes (e.g., WIP → Stable, Refactor → Stable).
- Repeated patterns of tech debt or smells are identified.
- The current focus clearly changes (e.g., auth done, moving to billing).

For each update:

1. Specify the section (e.g., "Architecture Snapshot", "ADRs").
2. Provide the proposed new content or diff.
3. Explain why this update will improve future iterations.
4. Ask: "Apply this change to MEMORY.md?" and wait for confirmation.

---

## 🔄 Checkpoint & Cleanup Protocol

### Post-Refactor / Post-Feature Process

After completing a major refactor or feature, the agent should:

1. **Analyze recent work:**
   - Review git commit history (last 15-20 commits)
   - Identify architectural changes, new patterns, eliminated debt

2. **Update project `.ai/MEMORY.md`:**
   - Add ONE concise "## [PHASE] COMPLETED ✅" section
   - List 3-7 key accomplishments (bullet points)
   - Update architecture snapshot if structure changed
   - Remove resolved tech debt items
   - Keep it lean - avoid bloat

3. **Reset project `.ai/TO-DO.md`:**
   - If fully complete: Use minimal template with "NEXT" section empty
   - If partially complete: Move done items to "COMPLETED" section
   - Remove outdated metrics and old priorities

4. **Propose, don't apply:**
   - Show diffs for both files
   - Wait for explicit approval
   - Explain what changed and why

### When to trigger this protocol:

- User explicitly indicates completion ("we're done", "terminamos")
- User asks to update memory/todo
- Clear milestone reached (ask if uncertain)

**Goal:** Keep `.ai/` files fresh, concise, and useful for future sessions without historical bloat.

---

## 🪙 Token Economy Modes (Context & Cost Strategy)

> Choose the mode based on the task and be explicit in reasoning.

### Mode A – Minimal Context (Cost-First)

- Use only:
  - This MEMORY.md
  - The relevant files for the current module
  - The latest user message
- Suitable for:
  - Small refactors inside a well-known module
  - Simple questions about existing patterns

### Mode B – Targeted Retrieval (RAG-Style)

- Use project search / embeddings / MCP tools to retrieve:
  - Only the most relevant snippets (functions, components, schemas).
- Summarize retrieved context before reasoning.
- Suitable for:
  - Non-trivial refactors touching multiple files
  - Features that reuse existing patterns heavily

### Mode C – Deep Audit (Rare, Expensive)

- Read broader parts of the codebase:
  - Module-level directories
  - Related infra (e.g., db schema + use cases + controllers)
- Only use when:
  - The user explicitly asks for a “full audit”, or
  - There is strong evidence that local changes will have cross-cutting impact.

### Context Hygiene Practices

- Prefer:
  - Summaries over raw code dumps.
  - Referencing existing patterns by name (“follow the existing auth use-case pattern”) rather than pasting large chunks.
- If a conversation grows long:
  - Periodically summarize the state and minimize older details that are no longer relevant.

---

## 🔌 Tools & MCP Usage (High-Level)

- Use tools / MCPs to:
  - Retrieve specific files, trees, or diffs.
  - Search codebase by symbol, path, or semantic meaning.
- Do not:
  - Execute destructive operations or writes without explicit user confirmation.
- When proposing tool usage:
  - State clearly what will be retrieved and why it matters for the solution.

---
