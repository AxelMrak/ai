#!/bin/bash
# backup-opencode-config.sh - Backup complete OpenCode configuration
# Usage: backup-opencode-config.sh [output-dir]

set -e

OUTPUT_DIR="${1:-~/Developer/ai/backups}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="opencode-config-backup_${TIMESTAMP}"
BACKUP_DIR="${OUTPUT_DIR}/${BACKUP_NAME}"

echo "OpenCode Configuration Backup"
echo "=============================="
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup OpenCode config
echo "1. Backing up OpenCode configuration..."
if [ -f ~/.config/opencode/opencode.json ]; then
  cp ~/.config/opencode/opencode.json "$BACKUP_DIR/opencode.json"
  echo "   ✓ opencode.json"
else
  echo "   ⚠ opencode.json not found"
fi

# Backup oh-my-opencode config
echo "2. Backing up oh-my-opencode configuration..."
if [ -f ~/.config/opencode/oh-my-opencode.json ]; then
  cp ~/.config/opencode/oh-my-opencode.json "$BACKUP_DIR/oh-my-opencode.json"
  echo "   ✓ oh-my-opencode.json"
else
  echo "   ⚠ oh-my-opencode.json not found"
fi

# Backup hooks config (if exists)
echo "3. Backing up hooks configuration..."
if [ -f ~/.opencode/hooks.json ]; then
  cp ~/.opencode/hooks.json "$BACKUP_DIR/hooks.json"
  echo "   ✓ hooks.json"
else
  echo "   ⚠ hooks.json not found"
fi

# Backup package.json (plugin versions)
echo "4. Backing up plugin versions..."
if [ -f ~/.config/opencode/package.json ]; then
  cp ~/.config/opencode/package.json "$BACKUP_DIR/package.json"
  echo "   ✓ package.json"
fi

# Backup environment variables template (without secrets)
echo "5. Creating environment template..."
cat > "$BACKUP_DIR/.env.template" << 'EOF'
# OpenCode Environment Variables Template
# Copy to .env and fill in your values

# Context7 API Key (for documentation search)
CONTEXT7_API_KEY=your_key_here

# Brave Search API Key (optional)
BRAVE_API_KEY=your_key_here

# Other API keys as needed
EOF
echo "   ✓ .env.template"

# Create restore script
echo "6. Creating restore script..."
cat > "$BACKUP_DIR/restore.sh" << 'RESTORE_EOF'
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
RESTORE_EOF

chmod +x "$BACKUP_DIR/restore.sh"
echo "   ✓ restore.sh"

# Create README
echo "7. Creating README..."
cat > "$BACKUP_DIR/README.md" << 'README_EOF'
# OpenCode Configuration Backup

This backup contains your complete OpenCode configuration.

## Contents

- `opencode.json` - Main OpenCode configuration (plugins, providers, agents, MCPs)
- `oh-my-opencode.json` - oh-my-opencode plugin configuration
- `hooks.json` - Session hooks configuration (if exists)
- `package.json` - Plugin versions
- `.env.template` - Environment variables template (fill in your keys)
- `restore.sh` - Automatic restore script
- `README.md` - This file

## Restore on New Machine

### Quick Restore (Automatic)

```bash
chmod +x restore.sh
./restore.sh
```

### Manual Restore

1. Copy files to `~/.config/opencode/`:
   ```bash
   mkdir -p ~/.config/opencode
   cp opencode.json ~/.config/opencode/
   cp oh-my-opencode.json ~/.config/opencode/
   ```

2. Copy hooks (if exists):
   ```bash
   mkdir -p ~/.opencode
   cp hooks.json ~/.opencode/
   ```

3. Set up environment variables:
   ```bash
   cp .env.template ~/.config/opencode/.env
   # Edit .env and add your API keys
   ```

4. Install OpenCode (if not installed):
   ```bash
   # See: https://opencode.ai/docs
   ```

5. Authenticate providers:
   ```bash
   opencode auth login
   # Select Google → OAuth with Antigravity
   ```

6. Verify installation:
   ```bash
   opencode --version
   opencode run -m google/gemini-3-flash -p "test"
   ```

## Configuration Summary

### Plugins Installed
- `opencode-google-antigravity-auth` - Google Antigravity OAuth
- `@franlol/opencode-md-table-formatter@0.0.3` - Markdown table formatter
- `oh-my-opencode` - Agent framework with LSP, MCPs, background tasks

### Agents Available
- **ATHENA** (default) - Architect, Blueprint-first
- **APOLLO** - Executor, Clean code
- **HEFESTO** - Debugger, Diagnose-first
- Sisyphus, Prometheus, Oracle, Librarian, Explore (oh-my-opencode)

### MCPs Configured
- fast-filesystem
- next-devtools
- playwright
- ddg-search
- context7
- git
- memory
- sequential-thinking
- brave-search
- websearch (Exa - via oh-my-opencode)
- grep_app (GitHub search - via oh-my-opencode)

### Key Features
- Auto-resume enabled (with Blueprint Protocol respect)
- Context injection (MANIFESTO, AGENTS, skills, checkpoints)
- Checkpoint system (replaces MEMORY.md)
- Background agents (max 3 concurrent)
- LSP & AST tools
- Session tools
- Todo enforcer, Comment checker, Ralph loop

## Migration Checklist

- [ ] Install OpenCode CLI
- [ ] Run restore.sh or copy files manually
- [ ] Set up .env with API keys
- [ ] Authenticate Google (Antigravity)
- [ ] Test basic functionality
- [ ] Clone ~/Developer/ai/ repository (MANIFESTO, AGENTS, skills)
- [ ] Update paths in oh-my-opencode.json if needed
- [ ] Migrate project checkpoints if needed

## Related Repositories

- **MANIFESTO & AGENTS**: `~/Developer/ai/MANIFESTO.md`, `~/Developer/ai/AGENTS.md`
- **Skills**: `~/Developer/ai/skills/` (249+ skills)
- **Scripts**: `~/Developer/ai/scripts/` (checkpoint helpers)
- **Hooks**: `~/Developer/ai/hooks/` (session hooks)

## Support

- OpenCode: https://opencode.ai/docs
- oh-my-opencode: https://github.com/code-yeongyu/oh-my-opencode
- Antigravity Auth: https://github.com/shekohex/opencode-google-antigravity-auth
README_EOF

echo "   ✓ README.md"

# Create archive
echo "8. Creating compressed archive..."
cd "$OUTPUT_DIR"
tar -czf "${BACKUP_NAME}.tar.gz" "$BACKUP_NAME"
echo "   ✓ ${BACKUP_NAME}.tar.gz"

# Summary
echo ""
echo "Backup completed successfully!"
echo "================================"
echo ""
echo "Location: $BACKUP_DIR"
echo "Archive:  ${OUTPUT_DIR}/${BACKUP_NAME}.tar.gz"
echo ""
echo "Files backed up:"
ls -lh "$BACKUP_DIR" | grep -v total
echo ""
echo "To restore on another machine:"
echo "  1. Extract: tar -xzf ${BACKUP_NAME}.tar.gz"
echo "  2. cd ${BACKUP_NAME}"
echo "  3. ./restore.sh"
echo ""
