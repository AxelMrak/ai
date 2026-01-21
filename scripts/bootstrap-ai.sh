#!/bin/bash
set -euo pipefail

AI_DIR="${HOME}/Developer/ai"
AI_LOCAL=".ai"

if [[ -d "$AI_LOCAL" ]]; then
  echo "✓ .ai/ already exists"
  
  if [[ -f "$AI_LOCAL/MEMORY.md" ]]; then
    echo "  - MEMORY.md present"
  else
    echo "  - Creating MEMORY.md..."
    cp "$AI_DIR/MEMORY.md" "$AI_LOCAL/MEMORY.md"
  fi
  
  if [[ -f "$AI_LOCAL/TO-DO.md" ]]; then
    echo "  - TO-DO.md present"
  else
    echo "  - Creating TO-DO.md..."
    cp "$AI_DIR/templates/TO-DO.md" "$AI_LOCAL/TO-DO.md"
  fi
  
  exit 0
fi

echo "Creating .ai/ folder..."
mkdir -p "$AI_LOCAL"
cp "$AI_DIR/MEMORY.md" "$AI_LOCAL/MEMORY.md"
cp "$AI_DIR/templates/TO-DO.md" "$AI_LOCAL/TO-DO.md"

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

echo ""
echo "✓ Created .ai/ folder with:"
echo "  - MEMORY.md (edit with project details)"
echo "  - TO-DO.md (track tasks)"
echo ""
echo "Next: Edit .ai/MEMORY.md with your project info"
