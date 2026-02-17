---
name: teaching-detection
description: Detect when user is teaching best practices and persist as skills
---

# Teaching Detection Protocol

> Skills are codified best practices. Detect when user teaches, confirm, and persist.

## Detection Triggers

The user is TEACHING when they say:

| Signal | Example | Action |
|--------|---------|--------|
| Explicit rule | "siempre usá X", "regla:", "nunca hagas Y" | Confirm & create |
| Correction | "no, hacelo así..." + shows pattern | Ask if should persist |
| Preference | "prefiero X sobre Y porque..." | Note for skill |
| Repeated pattern | Same correction 3+ times | Propose skill creation |
| Best practice | "buena práctica:", "el estándar es..." | Confirm & create |
| Style guide | "en este proyecto usamos..." | Add to project skill |

## Confirmation Flow

1. **Recognize** the teaching moment (user explaining HOW, not WHAT)
2. **Confirm intent**: "¿Querés que guarde esto como skill/rule?"
3. **Clarify scope**:
   - "¿Para qué skill set?" (detect from context or ask)
   - "¿Skill existente o nuevo?"
   - "¿Solo este proyecto o global?"
4. **Preview** the rule before creating
5. **Create** in `skills/{skill-name}/rules/_custom-{name}.md`
6. **Rebuild** index: `bun run skills/_scripts/generate-index.ts`

## Rule File Format

```markdown
---
title: Rule Title
impact: HIGH | MEDIUM | LOW
tags: tag1, tag2
source: user-taught
date: YYYY-MM-DD
---

## Rule Title

[Why this matters]

**Do:**
```code```

**Don't:**
```code```
```

## Skill Directory Structure

```
skills/
  [skill-name]/
    SKILL.md              # Main skill file
    AGENTS.md             # Optional agent-specific instructions
    rules/                # Individual rule files
      [rule-name].md
      _custom-*.md        # Custom rules (preserved during sync)
```

## Scope Resolution

- If skill exists: add rule to that skill's `rules/` folder
- If skill doesn't exist: create new folder with `rules/` subdirectory
- For external skills: prefix custom rules with `_custom-`
- `general/` folder for cross-language practices

## Update vs Create

- If rule already exists: show diff, ask to update
- If similar rule exists: highlight overlap, ask how to proceed
- If adding to external skill: use `_custom-` prefix to avoid sync conflicts

## Cross-Agent Flow

- **ATHENA**: Identifies patterns during planning, proposes skills
- **APOLLO**: Applies skills during implementation, notes gaps
- **HEFESTO**: Discovers anti-patterns, documents as "don't do"

## Maintenance Commands

```bash
# Regenerate index after adding/removing skills
bun run skills/_scripts/generate-index.ts

# Update external sources
bun run skills/_scripts/sync-external.ts

# Rebuild individual skill SKILL.md from rules/
bun run skills/_scripts/build.ts
```
