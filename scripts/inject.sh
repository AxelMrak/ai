#!/bin/bash
set -euo pipefail

AI_DIR="${HOME}/Developer/ai"

if [[ ! -d "$AI_DIR" ]]; then
  echo "Error: AI directory not found at $AI_DIR" >&2
  exit 1
fi

echo "# SYSTEM CONTEXT"
echo ""
echo "## Required Reading (use tools to read these files):"
echo ""
echo "1. **MANIFESTO**: $AI_DIR/MANIFESTO.md"
echo "   - Core rules, architecture principles, token economy"
echo ""
echo "2. **AGENTS**: $AI_DIR/AGENTS.md"
echo "   - Agent personas (ATHENA/APOLLO), protocols, commandments"
echo ""
echo "3. **Project MEMORY**: .ai/MEMORY.md (in project root)"
echo "   - Active focus, architecture snapshot, ADRs, tech debt"
echo ""
echo "## Pre-Flight Checklist:"
echo ""
echo "Before ANY task:"
echo "- [ ] Check .ai/ folder exists (create if missing)"
echo "- [ ] Read .ai/MEMORY.md"
echo "- [ ] Verify .ai/ is in .gitignore"
echo "- [ ] Follow Blueprint Protocol"
echo ""
echo "## Skills: $AI_DIR/skills/"
echo "Use skill() to load domain-specific rules (python, react, etc.)"
echo ""
echo "## Protocol Summary:"
echo "1. Observe → 2. Diagnose → 3. Plan → 4. Approve → 5. Execute"
echo "Never skip steps. Always ask before executing."
