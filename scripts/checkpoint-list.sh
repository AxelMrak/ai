#!/bin/bash
# checkpoint-list.sh - List all checkpoints chronologically
# Usage: checkpoint-list.sh [--recent N]

CHECKPOINTS_DIR="${PROJECT_ROOT:-.}/.ai/checkpoints"
RECENT="${1:-10}"

if [ ! -d "$CHECKPOINTS_DIR" ]; then
  echo "No checkpoints directory found"
  exit 1
fi

echo "Recent Checkpoints:"
echo "==================="
ls -lt "$CHECKPOINTS_DIR"/*.md 2>/dev/null | grep -v LATEST | head -n "$RECENT" | while read -r line; do
  FILE=$(echo "$line" | awk '{print $NF}')
  BASENAME=$(basename "$FILE")
  DATE=$(grep "^date:" "$FILE" | cut -d' ' -f2)
  TIME=$(grep "^time:" "$FILE" | cut -d' ' -f2)
  AGENT=$(grep "^agent:" "$FILE" | cut -d' ' -f2)
  FEATURE=$(grep "^feature:" "$FILE" | cut -d' ' -f2-)
  STATUS=$(grep "^status:" "$FILE" | cut -d' ' -f2)
  
  echo "[$DATE $TIME] [$AGENT] $FEATURE ($STATUS)"
  echo "  File: $BASENAME"
  echo ""
done
