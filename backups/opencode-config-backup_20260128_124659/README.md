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
