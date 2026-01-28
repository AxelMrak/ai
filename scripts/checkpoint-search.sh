#!/bin/bash
# checkpoint-search.sh - Search checkpoints for keywords
# Usage: checkpoint-search.sh "keyword"

QUERY="$1"
CHECKPOINTS_DIR="${PROJECT_ROOT:-.}/.ai/checkpoints"

if [ -z "$QUERY" ]; then
  echo "Usage: checkpoint-search.sh \"keyword\""
  exit 1
fi

if [ ! -d "$CHECKPOINTS_DIR" ]; then
  echo "No checkpoints directory found"
  exit 1
fi

echo "Searching checkpoints for: $QUERY"
echo "===================================="
grep -r -i -n --color=always "$QUERY" "$CHECKPOINTS_DIR"/*.md 2>/dev/null | grep -v LATEST
