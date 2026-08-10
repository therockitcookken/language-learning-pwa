---
name: "Dictionary Data Protection Rule"
description: "Strict rule against modifying data in the factory dictionary tab"
severity: critical
---

# Rule: Do Not Modify Factory Dictionary Data

**CRITICAL RULE**: Do not automatically or manually modify, update, or delete data (vocabulary entries, translations, examples, etc.) in the "từ điển công xưởng" (Factory Dictionary) tab or database tables without explicit permission from the user.

- **Reason**: The factory dictionary contains verified, authentic vocabulary that must remain intact. Automated scripts or AI generations might overwrite authentic data with hallucinated or fake terms.
- **Action**: Always ask for explicit user consent before running any script, Prisma migration, or manual database update that affects `VocabularyEntry`, `Flashcard`, or related tables.
- **Scope**: This applies to all operations that alter the dictionary data state.

**Do not violate this rule under any circumstances.**
