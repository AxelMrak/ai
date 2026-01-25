# PYTHON - _CUSTOM
> Generated: 2026-01-25
> Rules: 1


### RULE: No Re-exports in __init__.py
(File: _custom-no-init-reexports.md)

## No Re-exports in __init__.py

Re-exporting symbols through `__init__.py` obscures where code actually lives. 
It makes navigation harder and breaks "go to definition" in IDEs.

**Don't:**
```python
# mypackage/__init__.py
from .user_service import UserService
from .user_repository import UserRepository
from .exceptions import UserNotFoundError

# Then importing as:
from mypackage import UserService  # Where does this live? Unclear.
```

**Do:**
```python
# mypackage/__init__.py
# Empty or only package-level docstring
"""User management package."""

# Explicit imports from actual modules:
from mypackage.user_service import UserService
from mypackage.user_repository import UserRepository
from mypackage.exceptions import UserNotFoundError
```

**Why:**
- Explicit is better than implicit (PEP 20)
- "Go to definition" works correctly
- Clear dependency graph
- No magic, no surprises
