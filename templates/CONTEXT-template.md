# Project Context

> This file is the single source of truth for project architecture and patterns.
> Location: `.ai/CONTEXT.md` in project root

---

## Overview

**Project:** {project-name}
**Type:** {web-app | api | library | cli | mobile}
**Status:** {development | staging | production}

---

## Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend | {Next.js / React / Vue} | {version} |
| Backend | {Node / Python / Go} | {version} |
| Database | {PostgreSQL / MongoDB} | {version} |
| ORM | {Prisma / Drizzle / TypeORM} | {version} |
| Auth | {Clerk / NextAuth / Supabase} | {version} |
| Styling | {Tailwind / CSS Modules} | {version} |
| Testing | {Jest / Vitest / Pytest} | {version} |

---

## Active Skills

> Auto-discovered based on project stack. Updated: {YYYY-MM-DD}
> 
> These skills are loaded on every session. Update when stack changes.

| Skill | Purpose | Last Used |
|-------|---------|-----------|
| {skill-name} | {brief-purpose} | {YYYY-MM-DD} |
| systematic-debugging | Root cause analysis | ALWAYS |

### Loading Command
```bash
skill_use(['{skill-1}', '{skill-2}', ...])
```

### Stack-to-Skill Mapping Used
- {technology} -> {skill-name}
- {technology} -> {skill-name}

---

## Architecture

### Layers
```
{presentation} -> {application} -> {domain} -> {infrastructure}
```

### Key Patterns
- {Pattern 1}: {brief description}
- {Pattern 2}: {brief description}

### Constraints
- {Constraint 1}
- {Constraint 2}

---

## ADRs (Architecture Decision Records)

### ADR-001: {Title}
**Date:** {YYYY-MM-DD}
**Status:** {proposed | accepted | deprecated}
**Context:** {why this decision was needed}
**Decision:** {what was decided}
**Consequences:** {trade-offs}

---

## Conventions

### Naming
- Files: `{convention}`
- Components: `{convention}`
- Functions: `{convention}`

### Imports
- Style: `{absolute | relative}`
- Alias: `@/{path}`

### Git
- Branch: `{feat|fix|chore}/{description}`
- Commit: `{type}: {description}`

---

## Environment

| Variable | Purpose | Required |
|----------|---------|----------|
| {VAR_NAME} | {purpose} | {yes|no} |

---

## Notes

{Any additional context agents should know}
