# AI Agent System - Quick Guide

## What Is This?
A system that makes AI coding assistants remember your rules and standards. No more repeating explanations.

## Quick Setup
1. Clone this repo
2. Copy `MANIFESTO.md`, `AGENTS.md`, and `skills/` to `~/Developer/ai/`
3. In any project: `mkdir .ai && cp ~/Developer/ai/templates/* .ai/`

## The Agents
- **ATHENA**: Plans architecture ("How should it be?")
- **APOLLO**: Writes clean code ("How do I build it?")
- **HEFESTO**: Fixes bugs ("Why did it break?")

## Memory System
Each project gets a `.ai/` folder with:
- `CONTEXT.md` - Project setup and rules
- `MEMORY.md` - Current focus and decisions
- `TO-DO.md` - Task list

## Key Rules (Manifesto)
- Clean architecture with clear layers
- No `any` types, use `unknown`
- Absolute imports only (`@/components`)
- Self-documenting code (no comments needed)
- Tests for real scenarios, not just `assert true`

## Usage
Start every project with `.ai/` setup. Use agents for different tasks. Context persists across conversations.

---
Full documentation in README.md