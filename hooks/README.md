# Git Hooks

## Enable project hooks

```bash
git config core.hooksPath hooks
chmod +x hooks/pre-commit
```

## Current checks

- `bun run skills/_scripts/validate-skills.ts --strict`
- `bun run skills/_scripts/generate-index.ts --strict`

These checks prevent committing a stale index or invalid skill metadata.
