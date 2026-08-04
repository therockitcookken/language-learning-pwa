# Database Schema

Core entities: User, Session, RoleAssignment, UserPreference, Language, VocabularyEntry, VocabularySense, ExampleSentence, PronunciationAsset, GrammarLesson, LearningPath, PathLesson, Flashcard, ReviewSchedule, Quiz, QuizQuestion, QuizAttempt, ProgressEvent, Favorite, PersonalNote, ContentImport, ContentVersion and AuditLog.

Vocabulary entries support Vietnamese, Simplified Chinese, Traditional Chinese and English forms. Chinese forms store tone-marked and numbered pinyin. Each import has source, license, checksum, validation result and exact item counts. User-owned progress records reference immutable content versions to preserve history after editorial changes.

Indexes: normalized headword/search aliases, HSK/CEFR/topic/industry filters, active review due date, progress by user/path, and admin audit timestamp. Foreign keys are restrictive for published content and cascading only for disposable session data.
