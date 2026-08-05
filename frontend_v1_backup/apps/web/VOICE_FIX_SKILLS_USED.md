# VOICE_FIX_SKILLS_USED.md - Skills & Allocation for Voice State Synchronization Fix

The following active skills are used for diagnosing and refactoring the Voice Selection State Engine across all Pronunciation Studio components:

| Skill Name | Allocation Area | Specific Purpose / Application |
|---|---|---|
| `pronunciation-validator` | Voice & Locale Verification | Runtime locale guard `assertChineseVoiceLocale`, Web Speech API voice matching (`voiceURI`, `lang`), Chinese Hanzi Pinyin dictionary resolver. |
| `audio-pack-builder` | Web Audio / Speech Synthesis | `speechSynthesis.cancel()`, `HTMLAudioElement` lifecycle management, provider failover routing, rate/pitch control. |
| `frontend-design` | UI State Synchronization | Single Source of Truth voice state integration, dropdown reactivity, instant status badge updates. |
| `superpowers` | Engineering & QA | Root cause analysis, Vitest integration test verification, zero-defect release checklist. |

### Applied Changes & Results:
1. **Single Source of Truth (`ChineseVoiceService` & `PronunciationAudioService`)**: Centralized `VoiceSettings` state storing `selectedVoice` (`providerId`, `providerType`, `voiceId`, `voiceURI`, `name`, `language`).
2. **Global Event Subscription**: Components subscribe to `chineseVoiceService.onVoiceChange(...)` to guarantee instant UI rerender when voice changes.
3. **Strict Audio Router**: `speakChinese` and `playSound` automatically pick `activeVoiceSettings.selectedVoice` across all 14 studio modules.
