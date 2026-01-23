# AI Agent System for Development

Do you find yourself explaining the same coding rules to AI assistants over and over? Or getting spaghetti code that doesn't follow your standards? This repo solves that by creating a clear "contract" between you and your AI assistant.

## What Problem Does It Solve?

AIs are great, but they lose context easily. You end up fighting the same spaghetti code or explaining why you don't use `any` in TypeScript. This system creates clear rules and persistent memory so every conversation is productive from minute one.

## Quick Start

### 1. Clone the Repo
```bash
git clone https://github.com/your-repo/ai-agents-system.git
cd ai-agents-system
```

### 2. Install Dependencies
```bash
bun install  # or npm install
```

### 3. Set Up in Your Project
Copy these files to `~/Developer/ai/` (or wherever you prefer):
- `MANIFESTO.md` - Your technical rules
- `AGENTS.md` - The AI personas
- `skills/` - Rules specific to technologies

### 4. Use in a New Project
In any project, create a `.ai/` folder and copy the templates:
```bash
mkdir .ai
cp ~/Developer/ai/templates/* .ai/
```

Done! Now your AI knows exactly how to work.

## How the Agents Work

Imagine you have a development team:

```
User asks something ──┬── "How should it be?" ── ATHENA (Architect)
                      ├── "How do I implement it?" ── APOLLO (Developer)
                      └── "Why did it break?" ── HEFESTO (Debugger)
```

### ATHENA - The Architect
She's the strict "boss". Plans everything before coding.
- **Does:** Diagrams, strategies, options with pros/cons
- **Doesn't do:** Final code (delegates that)
- **Typical phrase:** "This doesn't scale, dude"

### APOLLO - The Craftsman
The one who gets hands-on. Implements clean and symmetrical.
- **Does:** Impeccable code, tests, commits
- **Doesn't do:** Complex plans (asks ATHENA for help)
- **Typical phrase:** "That came out nice"

### HEFESTO - The Blacksmith
Fixes what's broken. Finds the root of bugs.
- **Does:** Debugging, quality reviews, approves for prod
- **Doesn't do:** Big changes without planning
- **Typical phrase:** "Let's take it step by step"

## The Memory System (.ai/)

Each project has its own "memory" in the `.ai/` folder:

```
.ai/
├── CONTEXT.md     # "This is the project" - stack, structure, rules
├── MEMORY.md      # "Where are we" - current focus, recent decisions
├── TO-DO.md       # "What's left" - pending tasks
├── plans/         # "Detailed plans" - for complex features
└── notes/         # "Lessons learned" - bugs found, lessons
```

**Analogy:** It's like each project has its own diary. When you pick up after days, you know exactly where to continue.

### Practical Example
If you're working on an e-commerce app:

- **CONTEXT.md:** "We use Next.js, Tailwind, PostgreSQL. Components in `/components/`"
- **MEMORY.md:** "We're adding the shopping cart. Last decision: use Zustand for state"
- **TO-DO.md:** `[ ] Add payment API`, `[x] Cart design`

## Skills (Special Abilities)

These are specific rules for technologies. Like proven "recipes".

```
skills/
├── react/         # How to write clean React
├── python/        # Python patterns
└── _scripts/      # For syncing external skills
```

**Example:** The React skill says "always use custom hooks for reusable logic" or "never pass inline functions to components".

## The Manifesto - Your Technical Principles

It's the "constitution" of the code. Non-negotiable rules:

### Architecture
- **Clear layers:** Domain (logic), Application (use cases), Infrastructure (databases)
- **No big monkeys:** Nothing with 200-line functions
- **Absolute imports:** `@/components/Button`, not `../../Button`

### Clean Code
- **No `any`:** Use `unknown` and type guards
- **Self-documenting:** Code explains what it does without comments
- **English in code:** Variables, functions, commits in English

### Process
- **Blueprint first:** Architecture before coding
- **Real tests:** Not `assert true`, cover real cases
- **Explicit approval:** Nothing executes without "go ahead"

## Project Structure

```
ai/
├── MANIFESTO.md          # The fundamental rules
├── AGENTS.md             # The 3 AI personas
├── README.md             # This file
├── scripts/
│   ├── sync-opencode.ts  # Connect with OpenCode
│   └── inject.sh         # Paste context into prompts
├── skills/               # Rules by technology
│   ├── react/
│   └── python/
└── templates/            # To copy to new projects
    └── TO-DO.md
```

## Usage Examples

### New Project
```bash
# 1. Create memory folder
mkdir .ai

# 2. Copy templates
cp ~/Developer/ai/templates/* .ai/

# 3. Edit CONTEXT.md with your stack
# Edit MEMORY.md with current focus
```

### Adding a Feature
1. **ATHENA:** "How should the login be?"
2. **APOLLO:** Implement according to the plan
3. **HEFESTO:** Check there are no bugs

### Fixing a Bug
1. **HEFESTO:** "Why did it break?"
2. **APOLLO:** Fix the code
3. **ATHENA:** If it's an architecture issue, replan

## Why It Works

- **Persistent memory:** No repeating explanations
- **Clear roles:** Each agent knows what to do
- **Explicit rules:** Less "vibe coding", more technical decisions
- **Scalable:** Works in small and large projects

## FAQ

**Is it only for TypeScript?** No, it works with any language. Skills are per technology.

**Do I need all agents?** No, you can use only ATHENA for planning or APOLLO for coding.

**What if I switch AIs?** Copy the .ai/ files and you're good - the context travels with you.

**Is it a lot of setup?** For the first project yes, but after it's copy-paste.

## Philosophy

You are the architect, the AI is the senior developer executing your vision. This doesn't automate thinking, it creates a framework where thinking is explicit, documented, and reusable.

If it helps you, use it. If not, adapt it. The code is yours.

---

*Made with love for developers who think before coding*