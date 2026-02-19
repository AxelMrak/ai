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
echo "   - Agent personas, protocols, commandments"
echo ""
echo "3. **Project Context**: .ai/CONTEXT.md (in project root)"
echo "   - Active focus, architecture snapshot, ADRs, tech debt"
echo ""
echo "4. **Latest Checkpoint**: .ai/checkpoints/LATEST.md"
echo "   - Current state and recent decisions"
echo ""
echo "5. **Project TO-DO**: .ai/TO-DO.md"
echo "   - Pending tasks and sequential work"
echo ""
echo "6. **Skill Index**: $AI_DIR/skills/SKILL-INDEX.md"
echo "   - Canonical skill catalog and trigger mapping"
echo ""
echo "## Pre-Flight Checklist:"
echo ""
echo "Before ANY task:"
echo "- [ ] Check .ai/ folder exists (create if missing)"
echo "- [ ] Read .ai/CONTEXT.md, .ai/checkpoints/LATEST.md, .ai/TO-DO.md"
echo "- [ ] Verify .ai/ is in .gitignore"
echo "- [ ] Follow Blueprint Protocol"
echo ""
echo "## Skills: $AI_DIR/skills/"
echo "Use skill() to load domain-specific rules after scanning $AI_DIR/skills/SKILL-INDEX.md"
echo ""
echo "## Protocol Summary:"
echo "1. Observe -> 2. Orient -> 3. Plan -> 4. Approve -> 5. Execute -> 6. Document"
echo "Never skip steps. Always ask before executing."
