# 🧠 PROJECT MEMORY

> SYSTEM: Read this file at session start. This is your project cache.

---

## 📍 Meta

- **Project**: [Project Name]
- **Stack**: [e.g., Next.js, Bun, Tailwind, PostgreSQL]
- **Updated**: [YYYY-MM-DD]
- **Phase**: [MVP / Refactoring / Scaling]
- **Version**: v1.0.0

---

## 🎯 Active Focus

> Work only within this focus unless explicitly changed.

- **Current Goal**: [e.g., Implement Auth Flow with JWT]
- **Next Step**: [e.g., Create route protection middleware]
- **Constraints**:
  - [e.g., Do not use external validation libs]
  - [e.g., Do not change database schema]
- **Non-Goals** (for now):
  - [e.g., Do not touch billing until auth is stable]

---

## 🗺️ Architecture Snapshot

Legend: ✅ Stable | 🚧 WIP | ❌ Needs Refactor

| Module | Status | Path | Notes |
|:-------|:------:|:-----|:------|
| UI Components | ✅ | `components/ui/` | Atomic, reusable |
| Auth Feature | 🚧 | `features/auth/` | Missing password reset |
| Database | ✅ | `infra/db/` | Users & Posts, normalized |
| API Routes | ❌ | `app/api/` | Move to Controllers |

---

## 📐 ADRs (Architecture Decision Records)

- **ADR-001 – State**: [e.g., Zustand over Redux - lower overhead]
- **ADR-002 – CSS**: [e.g., Tailwind only, @apply in globals.css]
- **ADR-003 – Data**: [e.g., TanStack Query client, fetch server]

> Proposals conflicting with ADRs must name the conflict and ask before changing.

---

## 💣 Tech Debt

- [ ] [Issue] - [Location] - [Suggested fix]
- [ ] [Issue] - [Location] - [Suggested fix]

---

## 📝 Preferences

- Refactor plans before code
- Clear theoretical justification (why A vs B)
- No autonomous actions without approval
- UTC for all dates

---

## 📝 Recent Changes

- **Inter-Agent Awareness Protocol**: Added comprehensive rules for agents to recognize when another agent is better suited for a task and proactively suggest handoffs. Includes HEFESTO as production gatekeeper with final review responsibilities.

## 🪙 Token Mode

- **Mode A (Minimal)**: MEMORY.md + relevant files only
- **Mode B (RAG)**: Search + summarize + reason
- **Mode C (Deep Audit)**: Full module scan (rare, expensive)

Default to Mode A unless complexity requires more.

---
