# VOICE_BUG_ROOT_CAUSE.md - Root Cause Analysis & Diagnostic Report

This document details the exact root cause of the voice selection state synchronization bug in the Pronunciation Module.

---

## 1. BUG DESCRIPTION
When the user selected a different voice in the dropdown (e.g. `Microsoft Huihui`, `Microsoft Kangkang`, `Baidu Voice TTS`, `Youdao Audio`), the dropdown label updated visually, BUT all audio playback buttons across all 14 studio components ("Test Voice", Sơ đồ cấu âm, Pinyin Builder, Tone Pitch Lab, Minimal Pair Trainer, Shadowing Recorder, Panel chi tiết âm, Từ vựng trọng tâm, Ví dụ thực tế, Nút nghe giọng mẫu chuẩn, Nút nghe chậm, Các nút loa nhỏ trong danh sách từ, Quiz nghe, v.v.) continued playing with the old or default voice.

---

## 2. ROOT CAUSE IDENTIFICATION

### File Causing Bug:
- [`src/components/pronunciation/chinese-voice-panel.tsx`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/components/pronunciation/chinese-voice-panel.tsx) (Line 25)
- [`src/lib/services/chinese-voice-service.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/lib/services/chinese-voice-service.ts)
- [`src/lib/services/pronunciation-audio-service.ts`](file:///e:/App%20h%E1%BB%8Dc%20ng%C3%B4n%20ng%E1%BB%AF/apps/web/src/lib/services/pronunciation-audio-service.ts)

### Function / Code Causing Bug:
```tsx
// Inside ChineseVoicePanel.tsx:
const [selectedProvider, setSelectedProvider] = useState<'google' | 'youdao' | 'baidu' | 'auto'>('auto');
```

### Current Flawed Call Flow:
1. User changes dropdown in `ChineseVoicePanel`.
2. `ChineseVoicePanel` updates its own isolated local React `useState` (`selectedProvider`).
3. `ChineseVoicePanel` **NEVER** notifies `chineseVoiceService` or `pronunciationAudioService` of the newly selected voice.
4. When any other component in the studio (`ChineseSyllableBuilder`, `ChineseMinimalPairTrainer`, `ChineseShadowingRecorder`, `PhonemeDetailPanel`) clicks a play button, it calls `pronunciationAudioService.playSound(...)`.
5. `pronunciationAudioService` calls `chineseVoiceService.speakChinese(...)` without passing any voice parameter.
6. `chineseVoiceService.speakChinese` falls back to default `'auto'` (Google TTS), ignoring the user's selected browser voice or provider!

---

## 3. FIX STRATEGY & ARCHITECTURE

1. **Single Source of Truth (`ChineseVoiceService`)**:
   - Add centralized state `VoiceSettings` to `ChineseVoiceService` storing `selectedVoice`:
     - `providerId`: `'google'` | `'youdao'` | `'baidu'` | `'browser'`
     - `voiceId` / `voiceURI`: e.g. `'Microsoft Huihui - Chinese (Simplified, PRC)'`
     - `name`: e.g. `'Microsoft Huihui'`
     - `language`: `'zh-CN'`
   - Export `setSelectedVoice(voice: SelectedVoice)` method that updates memory state and `localStorage`.
   - Export event subscription listener `onVoiceChange(callback)`.

2. **Web Speech API Explicit Voice Object Assignment**:
   - When a browser voice is selected (`providerType === 'browser'`), `chineseVoiceService` looks up the exact `SpeechSynthesisVoice` object matching `v.voiceURI === voiceURI || v.name === name` and assigns `utterance.voice = targetVoice`.

3. **Global Audio Router Integration (`PronunciationAudioService`)**:
   - `pronunciationAudioService.playSound(...)` reads `chineseVoiceService.getSelectedVoice()` automatically when no voice override is passed.

4. **Component State Synchronization (`ChineseVoicePanel`)**:
   - `ChineseVoicePanel` subscribes to `chineseVoiceService`'s voice state and calls `chineseVoiceService.setSelectedVoice(...)` on dropdown change.

---

## 4. BLAST RADIUS & AFFECTED MODULES
- Test Voice button
- Sơ đồ cấu âm (SVG Phoneme Map)
- Pinyin Syllable Builder
- Tone Pitch Lab
- Minimal Pair Trainer
- Shadowing Recorder
- Phoneme Detail Panel
- Key Vocabulary Breakdown Cards
- Factory Example Cards
- Audio Sample buttons (1.0x & 0.75x)
- Small Speaker Icons in Vocabulary Lists
- Listening Quiz Modal
- 100% Chinese Audio Buttons across the entire application
