#!/bin/bash
# migrate-memory-to-checkpoints.sh - Migrate existing MEMORY.md to checkpoint system
# Usage: migrate-memory-to-checkpoints.sh [project-root]

set -e

PROJECT_ROOT="${1:-.}"
MEMORY_FILE="${PROJECT_ROOT}/.ai/MEMORY.md"
CHECKPOINTS_DIR="${PROJECT_ROOT}/.ai/checkpoints"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
CHECKPOINT_FILE="${CHECKPOINTS_DIR}/${TIMESTAMP}_migrated-from-memory.md"

# Check if MEMORY.md exists
if [ ! -f "$MEMORY_FILE" ]; then
  echo "No MEMORY.md found at $MEMORY_FILE"
  echo "Nothing to migrate. Use checkpoint-create.sh to create first checkpoint."
  exit 0
fi

# Create checkpoints directory
mkdir -p "$CHECKPOINTS_DIR"

echo "Migrating MEMORY.md to checkpoint system..."
echo "============================================"

# Create checkpoint from MEMORY.md
cat > "$CHECKPOINT_FILE" << 'EOF'
---
date: $(date +%Y-%m-%d)
time: $(date +%H:%M)
agent: SYSTEM
feature: migrated-from-memory
status: MIGRATED
duration: N/A
checkpoint: $(basename "$CHECKPOINT_FILE")
previous: none
---

## Session Summary
This checkpoint was automatically created from the legacy MEMORY.md file.
All content below is preserved from the original MEMORY.md.

---
## Content from MEMORY.md

EOF

# Append MEMORY.md content
cat "$MEMORY_FILE" >> "$CHECKPOINT_FILE"

# Create LATEST symlink
ln -sf "$(basename "$CHECKPOINT_FILE")" "${CHECKPOINTS_DIR}/LATEST.md"

# Rename MEMORY.md to deprecated
mv "$MEMORY_FILE" "${MEMORY_FILE}.deprecated"

echo ""
echo "✅ Migration complete!"
echo "  Created: $CHECKPOINT_FILE"
echo "  LATEST symlink: ${CHECKPOINTS_DIR}/LATEST.md"
echo "  Old file: ${MEMORY_FILE}.deprecated"
echo ""
echo "Next steps:"
echo "  1. Review the migrated checkpoint"
echo "  2. Extract tech debt, decisions, next steps if needed"
echo "  3. Update context_injection in oh-my-opencode.json to use LATEST.md"
echo "  4. Create new checkpoints going forward with checkpoint-create.sh"
