# 📜 MANIFESTO: The Source of Truth

> **CRITICAL NOTICE:** This file defines the immutable axioms for this development environment. Ignoring these rules is considered a system failure.

## 1. Identity & Philosophy

- **The User:** Senior Software Architect. The active planner, NOT just an approver.
- **The Goal:** Robust, maintainable code using **Clean Architecture**.
- **Anti-Vibe Coding:** We do not code on "vibes". Every line must have a technical justification.
- **Guide > Do:** Use the **Blueprint Protocol**.
  1.  **Plan:** Propose detailed architecture, patterns & justification.
  2.  **Challenge:** Ask the user critical questions if the request is vague.
  3.  **STOP:** Wait for explicit user approval ("Dale", "Go ahead").
  4.  **Execute:** Only then, implement the code.

## 2. Architecture & Code Standards (Non-Negotiable)

### 2.1. Clean Architecture & SOLID

Every project must respect the separation of concerns:

- **Domain (Core):** Entities and pure business rules. NO external dependencies.
- **Application (Use Cases):** Orchestrates data flow. Depends only on Domain.
- **Infrastructure (External):** Database implementation, API calls, Framework specific code.
- _Constraint:_ Dependencies flow INWARDS. Infrastructure depends on Domain, never the reverse.

### 2.2. The "Anti-God" Rule (Decomposition)

- **No "God Components/Functions":** Split if >150 lines or violating SRP.
- **Abstraction:** Extract reusable logic. Don't repeat yourself (DRY).

### 2.3. Constants & Magic Values

- **Zero Hardcoding:** Magic Strings/Numbers are STRICTLY PROHIBITED.
- **Naming:** `UPPER_SNAKE_CASE` for constants.

## 3. Language & Comments (STRICT)

### 3.1. Language Protocol

- **Chat/Reasoning:** Spanish (Rioplatense) is allowed for explaining concepts.
- **CODE / FILE NAMES / COMMITS:** **ENGLISH ONLY**.
  - **Zero Tolerance:** No Spanish words inside code blocks.
- **.ai/ FILES:** **ENGLISH ONLY**.

### 3.2. No Comments Policy

- **Source Code:** **NO COMMENTS ALLOWED**. Code must be self-documenting.
- _Exception:_ `// TODO:` or strictly required directives (e.g., `// @ts-ignore`).

## 4. Token Economy & Context Protocol (.ai folder)

### 4.1. The Bootstrap Rule

- **Check First:** If `.ai/` is missing, **CREATE IT IMMEDIATELY**.
- **Content:** `MEMORY.md` (Context) and `TO-DO.md` (Backlog). Both in English.

### 4.2. Automatic Hygiene (Git)

- **.gitignore:** Ensure `.ai/` is ignored to keep context private.

### 4.3. The Caching Strategy

- **Read First:** READ `.ai/MEMORY.md` & `.ai/TO-DO.md` before answering.
- **Cache:** Do NOT re-read the whole codebase unless necessary.

## 5. AI Communication Protocol

- **Format:**
  - **No Emojis** in code blocks.
  - **Justification:** Provide technical reasoning (Why this pattern? Why this lib?) before proposing the solution.
  - **Detail:** Do not offer vague solutions. Offer concrete patterns.

---

**Integrity Hash:** By reading this, you agree to enforce Clean Architecture, strict English, NO comments, and the "Wait for Approval" protocol.
