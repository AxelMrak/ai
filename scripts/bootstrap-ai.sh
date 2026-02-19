#!/bin/bash
set -euo pipefail

AI_DIR="${HOME}/Developer/ai"
AI_LOCAL=".ai"

ensure_gitignore() {
  if [[ -f ".gitignore" ]]; then
    if ! grep -q "^\.ai/$" .gitignore 2>/dev/null; then
      echo "" >> .gitignore
      echo "# AI Agent Context (local memory, not committed)" >> .gitignore
      echo ".ai/" >> .gitignore
      echo "✓ Added .ai/ to existing .gitignore"
    else
      echo "✓ .ai/ already in .gitignore"
    fi
  else
    echo "# AI Agent Context (local memory, not committed)" > .gitignore
    echo ".ai/" >> .gitignore
    echo "✓ Created .gitignore with .ai/"
  fi
}

ensure_context_file() {
  if [[ -f "$AI_LOCAL/CONTEXT.md" ]]; then
    echo "  - CONTEXT.md present"
  else
    echo "  - Creating CONTEXT.md..."
    cp "$AI_DIR/templates/CONTEXT.md" "$AI_LOCAL/CONTEXT.md"
  fi
}

ensure_todo_file() {
  if [[ -f "$AI_LOCAL/TO-DO.md" ]]; then
    echo "  - TO-DO.md present"
  else
    echo "  - Creating TO-DO.md..."
    cp "$AI_DIR/templates/TO-DO.md" "$AI_LOCAL/TO-DO.md"
  fi
}

ensure_checkpoints() {
  mkdir -p "$AI_LOCAL/checkpoints" "$AI_LOCAL/plans" "$AI_LOCAL/notes"

  if [[ -f "$AI_LOCAL/checkpoints/LATEST.md" ]]; then
    echo "  - checkpoints/LATEST.md present"
    return
  fi

  echo "  - Creating checkpoints/LATEST.md..."
  cat > "$AI_LOCAL/checkpoints/LATEST.md" <<'EOF'
# Latest Checkpoint

**Date**: TBD
**Session**: Initialization
**Status**: In Progress

## Current Focus
- Bootstrap .ai context for this repository.

## Next Actions
1. Update .ai/CONTEXT.md for this project.
2. Add active items to .ai/TO-DO.md.
3. Start first plan in .ai/plans/.
EOF
}

if [[ -d "$AI_LOCAL" ]]; then
  echo "✓ .ai/ already exists"
  ensure_context_file
  ensure_todo_file
  ensure_checkpoints
  ensure_gitignore
  exit 0
fi

echo "Creating .ai/ folder..."
mkdir -p "$AI_LOCAL"
ensure_context_file
ensure_todo_file
ensure_checkpoints
ensure_gitignore

echo ""
echo "✓ Created .ai/ folder with:"
echo "  - CONTEXT.md"
echo "  - TO-DO.md"
echo "  - checkpoints/LATEST.md"
echo "  - plans/ and notes/"
echo ""
echo "Next: update .ai/CONTEXT.md and .ai/TO-DO.md for this project"
