# 🧠 PROJECT MEMORY & CONTEXT

> **SYSTEM INSTRUCTION:** Read this file at the start of every session.
> **TOKEN ECONOMY:** Use this file to understand the project state without reading the entire codebase.

## 📍 Meta-Data

- **Project Name:** [Project Name]
- **Stack:** [e.g., Next.js , Bun, Tailwind, PostgreSQL]
- **Last Update:** [Date]
- **Current Phase:** [e.g., MVP / Refactoring / Scaling]

## 🎯 Active Focus (What we are doing NOW)

> _Focus only on this context. Ignore unrelated files._

- **Current Goal:** [e.g., Implement Auth Flow with JWT]
- **Next Step:** [e.g., Create route protection middleware]
- **User Constraint:** [e.g., "Do not use external validation libs, keep it manual"]

## 🗺️ State of the Union (Architecture Cache)

_Legend: ✅ Stable (Do not read) | 🚧 Volatile (Read carefully) | ❌ Broken_

| Module / Feature    | Status      | Path              | Notes                      |
| :------------------ | :---------- | :---------------- | :------------------------- |
| **UI Components**   | ✅ Stable   | `components/ui/`  | Shadcn-like. Atomic.       |
| **Auth Feature**    | 🚧 WIP      | `features/auth/`  | Missing Password Reset.    |
| **Database Schema** | ✅ Stable   | `infra/db/schema` | Users & Posts tables.      |
| **API Routes**      | ❌ Refactor | `app/api/`        | Move logic to Controllers. |

## 📐 Architecture Decision Records (ADR - Lite)

> _Why did we do this? (Prevent loops)_

- **[ADR-001] State Management:** Used **Zustand** because Redux was overkill for this dashboard.
- **[ADR-002] CSS:** Used pure **Tailwind**. `@apply` is forbidden except in `globals.css`.
- **[ADR-003] Fetching:** Used **TanStack Query** on client, native `fetch` on server.

## 💣 Tech Debt & "Athena's Hitlist"

> _Things strictly forbidden or pending refactor._

- [ ] The `UserDashboard` component is a God Component (>300 lines). **SPLIT IT.**
- [ ] Hardcoded strings found in `features/billing`. Move to `constants.ts`.
- [ ] Missing integration tests for the payment flow.

## 📝 User Preferences (Project Specific)

- [e.g., In this project, strict mode is disabled for the legacy module]
- [e.g., All dates must be handled in UTC]
