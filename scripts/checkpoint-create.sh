#!/bin/bash
# checkpoint-create.sh - Create checkpoint with intelligent iteration
# Usage: checkpoint-create.sh "description" [agent] [status]

set -e

DESCRIPTION="${1:-session}"
AGENT="${2:-UNKNOWN}"
STATUS="${3:-IN_PROGRESS}"
TIMESTAMP=$(date +%Y-%m-%d_%H-%M)
PROJECT_ROOT="${PROJECT_ROOT:-.}"
CHECKPOINTS_DIR="${PROJECT_ROOT}/.ai/checkpoints"
LATEST_FILE="${CHECKPOINTS_DIR}/LATEST.md"
PREVIOUS_FILE=$(readlink -f "$LATEST_FILE" 2>/dev/null || echo "")

# Create checkpoints directory if missing
mkdir -p "$CHECKPOINTS_DIR"

# Generate filename
FILENAME="${TIMESTAMP}_${DESCRIPTION}.md"
FILEPATH="${CHECKPOINTS_DIR}/${FILENAME}"

# Calculate duration from previous checkpoint
DURATION="N/A"
if [ -f "$PREVIOUS_FILE" ]; then
  PREV_TIME=$(grep "^time:" "$PREVIOUS_FILE" | cut -d' ' -f2)
  CURR_TIME=$(date +%H:%M)
  # Simple duration calculation would go here
  DURATION="(see timestamp diff)"
fi

# Extract context from previous checkpoint (intelligent iteration)
PREV_TECH_DEBT=""
PREV_NEXT_STEPS=""
if [ -f "$PREVIOUS_FILE" ]; then
  PREV_TECH_DEBT=$(sed -n '/## Technical Debt/,/##/p' "$PREVIOUS_FILE" | grep -v "^##" || echo "")
  PREV_NEXT_STEPS=$(sed -n '/## Next Steps/,/##/p' "$PREVIOUS_FILE" | grep -v "^##" || echo "")
fi

# Generate checkpoint template
cat > "$FILEPATH" << EOF
---
date: $(date +%Y-%m-%d)
time: $(date +%H:%M)
agent: ${AGENT}
feature: ${DESCRIPTION}
status: ${STATUS}
duration: ${DURATION}
checkpoint: ${FILENAME}
previous: $(basename "$PREVIOUS_FILE" 2>/dev/null || echo "none")
---

## Session Summary
[AI: Provide concise summary of what was accomplished]

## Changes Made
[AI: List concrete changes - files, features, fixes]

## Decisions (ADRs)
[AI: Document architectural decisions made this session]

## Technical Debt
[AI: Carry forward unresolved items from previous checkpoint + new items]
${PREV_TECH_DEBT}

## Files Modified
[AI: List all modified files with brief description]

## Tests
[AI: Test status - passing, failing, missing]

## Next Steps
[AI: Based on completion status and TO-DO.md]
${PREV_NEXT_STEPS}

---
## Previous Context (Iteration)
EOF

# Add previous checkpoint summary for context
if [ -f "$PREVIOUS_FILE" ]; then
  echo "Previous checkpoint: $(basename "$PREVIOUS_FILE")" >> "$FILEPATH"
  echo "" >> "$FILEPATH"
  sed -n '/## Session Summary/,/##/p' "$PREVIOUS_FILE" | head -10 >> "$FILEPATH"
fi

# Update LATEST symlink
ln -sf "$FILENAME" "$LATEST_FILE"

echo "✅ Checkpoint created: $FILEPATH"
echo "✅ LATEST.md updated → $FILENAME"
echo ""
echo "Next: Edit checkpoint with session details"
