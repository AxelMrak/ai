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

### 4.1. Bootstrap Rule (MANDATORY)

> ⚠️ **FIRST ACTION IN EVERY SESSION - NON-NEGOTIABLE**

1. **Check** if `.ai/` folder exists in project root
2. **If missing**, IMMEDIATELY propose creating:
   - `.ai/MEMORY.md` (from template)
   - `.ai/TO-DO.md` (from template)
3. **Verify** `.ai/` is in `.gitignore`
4. **READ** `.ai/MEMORY.md` before any other action

Do not proceed with ANY task until `.ai/` is verified and read.

### 4.2. Pre-Flight Checklist (Before Any Task)

Before starting any task, verify:

- [ ] `.ai/` folder exists in project root
- [ ] `.ai/MEMORY.md` has been read this session
- [ ] `.ai/TO-DO.md` is current and relevant
- [ ] Current focus from MEMORY.md is understood
- [ ] No conflicts with existing ADRs
- [ ] Blueprint Protocol will be followed

If any check fails, address it before proceeding.

### 4.3. Git Hygiene

- Ensure `.ai/` is ignored in `.gitignore` to keep internal context private.
- If `.gitignore` doesn't include `.ai/`, propose adding it.

### 4.4. Context Management & Token Economy

Modern token economy guidelines:

- Prefer:
  - Short, structured prompts (~100-200 tokens for instructions).
  - Retrieval of minimal relevant context instead of full-file dumps.
  - Load skills on-demand with `skill()`, not in initial prompt.
- Use layered context:
  - MANIFESTO + AGENTS as foundational rules (read once per session).
  - Project `.ai/MEMORY.md` as working context.
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

### 4.5. Checkpoint Protocol (After Major Refactors/Features)

When a major refactor or feature is completed (user explicitly states "we're done" or similar):

1. **Review Git History:**
   - Check last 15-20 commits in current branch
   - Identify what was accomplished
   - Look for patterns: new architecture, eliminated tech debt, new modules

2. **Update `.ai/MEMORY.md`:**
   - Add ONE concise section documenting the completed work
   - Format: `## [PHASE-NAME] COMPLETED ✅` with bullet points
   - Update project structure if it changed significantly
   - Remove/update outdated technical debt mentions
   - Keep it minimal - only essential context for future sessions

3. **Clean `.ai/TO-DO.md`:**
   - If ALL tasks are completed: Reset to minimal template:
     ```markdown
     ## [PHASE-NAME] COMPLETED ✅
     
     Brief summary of what was accomplished.
     
     ---
     
     ## NEXT
     
     _Empty - Ready for new features or optimizations_
     ```
   - If some tasks remain: Move completed ones to a "COMPLETED" section at top
   - Remove noise and outdated metrics

4. **Ask Before Applying:**
   - Show proposed changes as diffs
   - Wait for user confirmation ("Dale", "Go ahead")
   - Never update silently

**Trigger conditions:**
- User says: "terminamos", "we're done", "refactor complete", or similar
- User explicitly asks to update memory/todo
- Major milestone clearly reached (ask if unsure)

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

- The conversation itself is the main “comment layer”.
- The agent should:
  - Use theory to justify proposals (SOLID, design patterns, DDD concepts).
  - Highlight trade-offs (runtime cost, complexity, familiarity).
  - Offer refactor strategies that can be implemented incrementally.

---
