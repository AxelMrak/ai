# PYTHON - NO
> Generated: 2026-01-25
> Rules: 1


### RULE: No Barrel Files / Explicit Imports
(File: no-barrel-files.md)

Implicit imports via `__init__.py` (Barrel Files) obscure dependency graphs and cause circular import errors in large Python projects.

**❌ Incorrect (The "Magic" Way):**
Putting logic or imports inside `__init__.py` to shorten paths.

```python
# src/domain/__init__.py
from .user import User  # BAD: Implicit re-export
```

✅ Correct (Explicit is better than Implicit): Keep **init**.py empty (just a package marker). Import from the exact module.

```python

# src/application/service.py
from src.domain.user import User  # GOOD: Explicit source
```
