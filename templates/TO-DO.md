# 📝 PROJECT BACKLOG & TECH DEBT

> **INSTRUCTION:** This file is for the HUMAN developer. Write tasks clearly, specifying the specific file and the reason for the change.
> **MAINTENANCE:** Move completed items to the bottom or delete them.

## 🚨 Critical Bugs (Immediate Action)

> _Blocks production or development._

- [ ] **Memory Leak in Parser:** The `EXCLUDED_NORP_TERMS` set loads 500+ items on every import.
  - _Location:_ `domain/constants.py`
  - _Fix:_ Move to a separate JSON file or implement lazy loading.
- [ ] **Circular Import:** `SummaryValidator` imports `datetime` inside a method.
  - _Location:_ `domain/validators.py` (Line 164)
  - _Fix:_ Move import to top-level or use `TYPE_CHECKING`.

## 🚧 Feature Backlog (Roadmap)

> _Next steps approved by the user._

- [ ] **Feature:** [Name] - [Brief Description]

## 📉 Technical Debt (Athena's Hitlist)

> _Refactors required for scalability/maintainability._

- [ ] **Refactor God Component:** `constants.py` has >600 lines and violates SRP.
  - _Strategy:_ Split into `constants/names.ts`, `constants/skills.ts`.
- [ ] **DRY Violation:** Duplicated constants found between Domain and Infrastructure.
  - _Action:_ Centralize in `domain/constants.py` and import in Infra.
- [ ] **Hardcoded Values:** Found magic strings in `features/auth`.
  - _Action:_ Extract to `constants.ts`.

## 🧪 Testing & QA

- [ ] **Coverage:** Add unit tests for `ParsingPatterns` regex logic.

---

## ✅ Completed (Archive)

- [x] Example Task completed.
