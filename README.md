# AI Agent Configuration System

This repository contains a structured approach to managing AI coding assistants through explicit architectural principles and context management.

## Why This Exists

Large language models are powerful but suffer from context loss and inconsistent behavior across conversations. This system addresses those problems by establishing a persistent contract between you and your AI assistant that defines how code should be written and how decisions should be made.

Rather than repeatedly explaining your preferences or fighting the same architectural battles in every conversation, this system codifies your engineering philosophy into reusable context that agents can reference.

## What This Does

The system provides three core components:

**MANIFESTO.md** defines the non-negotiable technical standards. It covers clean architecture principles, SOLID compliance, import policies, type safety requirements, and output constraints. Think of it as the constitutional law of your codebase.

**AGENTS.md** specifies two distinct AI personas with different approaches to problem-solving. Athena acts as a strict architectural enforcer focused on preventing technical debt. Apollo serves as a teaching-oriented architect who explains the theory behind design decisions. Both follow the same core principles but have different communication styles and priorities.

**MEMORY.md** serves as project-specific context that tracks your current architectural state, active goals, technical debt, and architecture decision records. This prevents the AI from proposing solutions that conflict with past decisions or current constraints.

## How It Works

The system uses a blueprint protocol that prevents "vibe coding" where decisions are made without clear technical justification. Before any code is written, the agent must:

1. Analyze the request and identify which architectural principles apply
2. Propose a strategy with explicit comparison of alternatives
3. Explain why the recommended approach is superior
4. Wait for explicit approval before generating code

This creates a forcing function for thoughtful design rather than reflexive implementation.

## Structure

```
ai/
├── MANIFESTO.md          # Core technical principles
├── AGENTS.md             # Agent personas and protocols
├── MEMORY.md             # Project context template
├── scripts/
│   ├── sync-opencode.ts  # Sync config to OpenCode
│   └── inject.sh         # Inject context into prompts
├── skills/               # Specialized rule sets
│   ├── react/
│   └── python/
└── templates/
    └── TO-DO.md          # Task tracking template
```

## Setup

The repository is designed to live at `~/Developer/ai`. If you prefer a different location, update the path references in the scripts.

### Sync to OpenCode

If you use OpenCode as your AI coding environment:

```bash
bun run ~/Developer/ai/scripts/sync-opencode.ts
```

This creates or updates `~/.config/opencode/opencode.json` with agent configurations and syncs skills to `~/.config/opencode/skills/`.

### Manual Injection

For other AI tools or custom setups, use the inject script to output formatted context:

```bash
bash ~/Developer/ai/scripts/inject.sh
```

This outputs all context files in a format you can paste into a system prompt or agent configuration.

## Using MEMORY.md

Each project should have its own `.ai/MEMORY.md` file that tracks project-specific state. The template in this repo shows the expected format. Key sections include:

**Active Focus** defines what you are currently working on and what is explicitly out of scope. This prevents scope creep and keeps conversations focused.

**Architecture Snapshot** documents the current state of major modules using a simple status system: stable, volatile, or broken. This tells the agent which areas are safe to build on versus which need refactoring first.

**Architecture Decision Records** capture the reasoning behind major technical choices. When proposing a change that conflicts with a past decision, the agent must acknowledge the conflict and justify why the previous decision should be revisited.

**Tech Debt** maintains an explicit list of known issues. When working in an area with existing debt, the agent will warn you and offer the choice between refactoring first or building on the current foundation.

## Skills System

The skills directory contains specialized rule sets for specific technologies or patterns. Each skill is a markdown file that documents performance patterns, anti-patterns, or framework-specific best practices.

Skills are organized by technology (react, python, etc.) and can reference sub-rules. The sync script automatically makes these available to OpenCode agents.

## Philosophy

This system assumes you are the architect and the AI is a senior engineer who executes your vision. The agent should not make autonomous decisions about architecture, dependencies, or major refactors without explicit approval.

The goal is not to automate away thinking but to create a framework where thinking is explicit, documented, and reusable across conversations and projects.

## Requirements

- Bun runtime for the sync script
- bash for the inject script
- Optional: bat, rg, fd, sd, eza for enhanced tooling

## License

Use this however you want. If you find it useful, consider sharing improvements or adaptations.
