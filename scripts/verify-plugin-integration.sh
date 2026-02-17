#!/bin/bash
# Verify OpenCode Plugin Integration
# Run after OpenCode restart to verify plugins loaded correctly

set -e

echo "🔍 OpenCode Plugin Integration Verification"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 (not installed yet)"
        return 1
    fi
}

# 1. Check config files
echo "📄 Configuration Files"
echo "----------------------"
check_file ~/.config/opencode/opencode.json
check_file ~/.config/opencode/dcp.jsonc
check_file ~/.config/opencode/opencode-notifier.json
check_file ~/.config/opencode-skillful/config.json
check_file ~/Developer/ai/AGENTS.md
check_file ~/Developer/ai/PLUGIN-INTEGRATION.md
echo ""

# 2. Check plugin cache (after OpenCode restart)
echo "📦 Plugin Cache (After OpenCode Restart)"
echo "----------------------------------------"
check_dir ~/.cache/opencode/node_modules/@tarquinen/opencode-dcp
check_dir ~/.cache/opencode/node_modules/@mohak34/opencode-notifier
check_dir ~/.cache/opencode/node_modules/@zenobius/opencode-skillful
check_dir ~/.cache/opencode/node_modules/opencode-pty
echo ""

# 3. Check skills directory
echo "🎓 Skills Directory"
echo "-------------------"
if [ -d ~/Developer/ai/skills ]; then
    SKILL_COUNT=$(find ~/Developer/ai/skills -name "SKILL.md" | wc -l | tr -d ' ')
    echo -e "${GREEN}✓${NC} ~/Developer/ai/skills (${SKILL_COUNT} skills found)"
else
    echo -e "${RED}✗${NC} ~/Developer/ai/skills (missing)"
fi
echo ""

# 4. Check bash permissions
echo "🔐 Bash Permissions"
echo "-------------------"
if grep -q '"bash"' ~/.config/opencode/opencode.json; then
    echo -e "${GREEN}✓${NC} Bash permissions configured"
else
    echo -e "${YELLOW}⚠${NC} No bash permissions found"
fi
echo ""

# 5. Verify JSON syntax
echo "✅ JSON Syntax Validation"
echo "-------------------------"
for file in ~/.config/opencode/opencode.json ~/.config/opencode-skillful/config.json; do
    if command -v jq &> /dev/null; then
        if jq empty "$file" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $file (valid JSON)"
        else
            echo -e "${RED}✗${NC} $file (invalid JSON)"
        fi
    else
        echo -e "${YELLOW}⚠${NC} jq not installed, skipping JSON validation"
        break
    fi
done
echo ""

# 6. JSONC validation (dcp.jsonc, opencode-notifier.json)
echo "📝 JSONC Files"
echo "--------------"
echo -e "${YELLOW}ℹ${NC} JSONC files (with comments) cannot be validated with standard tools"
echo -e "${YELLOW}ℹ${NC} OpenCode will validate on load"
for file in ~/.config/opencode/dcp.jsonc ~/.config/opencode/opencode-notifier.json; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    fi
done
echo ""

# 7. Final summary
echo "📊 Summary"
echo "----------"
echo "1. Restart OpenCode to install plugins"
echo "2. Check OpenCode logs for plugin loading confirmation"
echo "3. Test each plugin with commands in PLUGIN-INTEGRATION.md"
echo ""
echo "Expected in logs:"
echo "  ✓ Loaded plugin: @tarquinen/opencode-dcp"
echo "  ✓ Loaded plugin: @mohak34/opencode-notifier"
echo "  ✓ Loaded plugin: @zenobius/opencode-skillful"
echo "  ✓ Loaded plugin: opencode-pty"
echo ""
echo "🎯 Next Step: Restart OpenCode"
