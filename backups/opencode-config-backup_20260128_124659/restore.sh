#!/bin/bash
# restore.sh - Restore OpenCode configuration
# Usage: ./restore.sh

set -e

echo "OpenCode Configuration Restore"
echo "==============================="
echo ""
echo "This will restore OpenCode configuration to ~/.config/opencode/"
echo "Existing configs will be backed up to ~/.config/opencode/*.backup"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 1
fi

# Create config directory
mkdir -p ~/.config/opencode

# Restore opencode.json
if [ -f opencode.json ]; then
  if [ -f ~/.config/opencode/opencode.json ]; then
    cp ~/.config/opencode/opencode.json ~/.config/opencode/opencode.json.backup
    echo "✓ Backed up existing opencode.json"
  fi
  cp opencode.json ~/.config/opencode/opencode.json
  echo "✓ Restored opencode.json"
fi

# Restore oh-my-opencode.json
if [ -f oh-my-opencode.json ]; then
  if [ -f ~/.config/opencode/oh-my-opencode.json ]; then
    cp ~/.config/opencode/oh-my-opencode.json ~/.config/opencode/oh-my-opencode.json.backup
    echo "✓ Backed up existing oh-my-opencode.json"
  fi
  cp oh-my-opencode.json ~/.config/opencode/oh-my-opencode.json
  echo "✓ Restored oh-my-opencode.json"
fi

# Restore hooks.json
if [ -f hooks.json ]; then
  mkdir -p ~/.opencode
  if [ -f ~/.opencode/hooks.json ]; then
    cp ~/.opencode/hooks.json ~/.opencode/hooks.json.backup
    echo "✓ Backed up existing hooks.json"
  fi
  cp hooks.json ~/.opencode/hooks.json
  echo "✓ Restored hooks.json"
fi

echo ""
echo "Configuration restored successfully!"
echo ""
echo "Next steps:"
echo "1. Copy .env.template to .env and fill in API keys"
echo "2. Run: opencode auth login"
echo "3. Authenticate Google (Antigravity) if needed"
echo "4. Test: opencode --version"
