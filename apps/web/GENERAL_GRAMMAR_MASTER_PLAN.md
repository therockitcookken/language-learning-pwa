# GENERAL_GRAMMAR_MASTER_PLAN.md - General Grammar Architecture & Master Plan

Master execution plan for building and ingesting the **General Daily Life Communication Grammar System** for Chinese (HSK 1-6, Groups A to Z) and English (CEFR A1-C2, Groups A to AN).

---

## 1. Master Catalog Taxonomies

### A. Chinese Master Catalog (HSK 1-6, Groups A to Z)
- **A. Basic Sentence Structure (Cấu trúc câu nền tảng)**: SVO, Topic-Comment, Vị ngữ danh từ/tính từ/động từ, Câu hai tân ngữ, Câu không chủ ngữ, Câu liên động, Câu kiêm ngữ, Câu tồn hiện.
- **B. Nouns & Noun Phrases (Danh từ & Cụm danh từ)**: Thời gian, Phương vị, Địa điểm, Cụm danh từ có/không 的.
- **C. Pronouns (Đại từ)**: 人称, 指示, 疑问代词 (谁/什么/哪儿/怎么/为什么), 自己, 别人, 某.
- **D. Numerals & Quantifiers (Số từ & Lượng từ)**: 数词, 序数, 概数 (左右/上下/多/来/几), 常用量词 (个/本/张/件/条/块/瓶/杯/双/套/趟/次/遍).
- **E. Verbs & Verb Phrases (Động từ & Cụm động từ)**: 是, 有, 在, 离合词, 能愿动词 (会/能/可以/要/想/打算/敢/应该), 趋向动词, 动词重叠 (AA/ABAB/V一V/V一下).
- **F. Adjectives (Tính từ)**: Tính từ vị ngữ/định ngữ, Trùng điệp (AA/AABB), Mức độ (很/非常/太……了/真/挺/比较/特别/极了/越来越/越……越……).
- **G. Adverbs (Phó từ)**: Phủ định (不/没/未/别/不要/不必), Thời gian (已经/曾经/正在/正/在/将要/快要……了/刚/刚刚), Tần suất & Lặp lại (总是/经常/常常/往往/偶尔/从来/又 vs 再), Phạm vi & Giới hạn (都/也/还/只/光/连……都).
- **H. Prepositions (Giới từ)**: 在, 从, 到, 离, 对, 对于, 关于, 跟, 和, 与, 向, 往, 给, 为, 为了, 替, 按, 按照, 根据, 通过, 经过, 除了, 由于, 随着, 自从, 比.
- **I. Structural & Aspect Particles (Trợ từ kết cấu & Thời thể)**: 的 - 地 - 得, 所, 者, 似的, 了(động từ & cuối câu), 过, 着, 正在.
- **J. Modal Particles (Trợ từ ngữ khí)**: 吗, 呢, 吧, 啊, 呀, 啦, 嘛, 罢了, 而已, 来着.
- **K. Complements (Bổ ngữ)**: Result (完/好/到/见/懂/会/对/错/清楚/干净/成), Direction (来/去/上来/下去/出来/起来), Potential (得/不 + Bổ ngữ, 看得懂/听得见/来得及/受不了), Degree & State (V+得+Tính từ), Quantity & Duration (V+次/遍/趟/ thời gian).
- **L. Special Sentence Structures (Câu đặc biệt)**: Câu chữ 把, Câu bị động 被/让/叫/给, Câu so sánh 比/没有/不如/跟……一样.
- **M. Daily Communication & General Writing**: Chào hỏi, Giới thiệu, Gia đình, Mua sắm, Nhà hàng, Du lịch, Thời tiết, Sở thích, Cảm xúc, Kế hoạch cá nhân.

### B. English Master Catalog (CEFR A1-C2, Groups A to AN)
- **A. Sentence Components & Word Order**: Subject, Predicate, Verb, Direct/Indirect Object, Subject/Object Complement, Word Order.
- **B. Nouns, Articles & Determiners**: Common/Proper/Concrete/Abstract, Countable/Uncountable, Articles (A, An, The, Zero article), Determiners (This, That, Some, Any, Each, Every, Both, All, Much, Many, Few, Little).
- **C. Pronouns & Auxiliaries**: Personal, Possessive, Reflexive, Relative, Dummy It, Existential There, Do-support, Subject-Verb Agreement.
- **D. Tenses & Aspects**: Present Simple, Present Continuous, Present Perfect, Present Perfect Continuous, Past Simple, Past Continuous, Past Perfect, Past Perfect Continuous, Future forms (Will, Be going to, Present Continuous for future, Future Continuous, Future Perfect).
- **E. Modals & Modal Perfects**: Can, Could, May, Might, Must, Have to, Should, Ought to, Had better, Would rather, Must have done, Should have done, Could have done.
- **F. Passive Voice & Causatives**: Present/Past/Future Passive, Modal Passive, Get-passive, Causatives (Have/Get something done, Make/Let/Allow someone to do).
- **G. Conditionals & Subjunctive**: Zero, First, Second, Third, Mixed Conditionals, Unless, As long as, In case, Mandative Subjunctive (It is important that...).
- **H. Relative Clauses & Participles**: Defining & Non-defining relative clauses, Participle clauses (-ing / -ed).
- **I. Gerunds, Infinitives & Reported Speech**: Verb + Gerund, Verb + Infinitive, Stop doing/to do, Remember doing/to do, Reported speech & Reporting verbs.
- **J. Comparisons, Adjectives & Adverbs**: Comparative & Superlative adjectives/adverbs, As...as, Adjective order, Frequency adverbs.
- **K. Prepositions, Conjunctions & Inversion**: Prepositions of time/place/movement, Linking devices, Negative Inversion (Never have I..., Hardly... when...).
- **L. Daily Life Communication**: Family, School, Travel, Shopping, Dining, Hobbies, Weather, Movies, Emotions, Social Invitations.

---

## 2. General Grammar Execution Strategy

1. **Purge Factory Contexts**: Inspect all grammar datasets and replace any factory/workplace/office terms with everyday daily communication examples.
2. **Master Catalogs Update**: Re-populate `chinese-grammar-catalog.ts`, `english-grammar-catalog.ts`, `grammar-comparisons-catalog.ts`, `grammar-dialogues-catalog.ts`, and `grammar-error-lab-catalog.ts` with general daily life content.
3. **Seeding & Validation Pipeline**: Seed Prisma database via `validate-and-seed-grammar.ts` and ensure zero dummy placeholders.
4. **Interactive Feature Verification**: Verify Search, Multi-dimensional Filtering, Audio Playback, Comparison Studio, Error Lab, Flashcards, and Exercise Suite.
