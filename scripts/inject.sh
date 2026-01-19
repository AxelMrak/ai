#!/bin/bash
set -euo pipefail

AI_DIR="${HOME}/Developer/ai"

if [[ ! -d "$AI_DIR" ]]; then
  echo "Error: AI directory not found at $AI_DIR" >&2
  exit 1
fi

CAT_CMD="cat"
if command -v bat >/dev/null 2>&1; then
  CAT_CMD="bat --plain --paging=never"
fi

print_section() {
  local title="$1"
  local file="$2"
  
  if [[ ! -f "$file" ]]; then
    echo "Warning: $title file not found at $file" >&2
    return 1
  fi
  
  echo "## $title"
  echo ""
  $CAT_CMD "$file"
  echo ""
}

echo "# SYSTEM CONTEXT"
echo ""

print_section "MANIFESTO" "$AI_DIR/MANIFESTO.md"
print_section "AGENTS" "$AI_DIR/AGENTS.md"

echo "## MEMORY PROTOCOL"
echo "Read .ai/MEMORY.md in the project root."
echo ""

echo "## SKILLS"
if [[ -d "$AI_DIR/skills" ]]; then
  echo "Available skills in '$AI_DIR/skills/'"
else
  echo "No skills directory found"
fi
echo ""
