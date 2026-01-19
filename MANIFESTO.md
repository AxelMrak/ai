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

### 4.1. Bootstrap Rule

- If the `.ai/` folder is missing:
  - Propose creating it with:
    - `MEMORY.md` (context)
    - `TO-DO.md` (backlog)
  - Provide templates, but do not create files without explicit user approval.

### 4.2. Git Hygiene

- Ensure `.ai/` is ignored in `.gitignore` to keep internal context private.

### 4.3. Context Management & Token Economy

Modern token economy guidelines:

- Prefer:
  - Short, structured prompts.
  - Retrieval of minimal relevant context instead of full-file dumps.
- Use layered context:
  - System / Manifesto / Memory as long-term project context.
  - Current request + small retrieved snippets as working context.
- Use summarization:
  - Convert long histories or search results into short, structured notes.
  - Keep these summaries in the conversation rather than raw logs.

Advanced strategies:

- Retrieval-Augmented Generation (RAG-style):
  - Pull only relevant code or docs via tools/MCP.
  - Summarize before using them in reasoning.
- Model / Tool routing:
  - Use cheaper or smaller models/tools for exploration and search.
  - Reserve heavier reasoning for final planning and critical decisions.
- Caching:
  - Reuse stable system prompts and project context.
  - Avoid restating large, unchanging fragments.

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
