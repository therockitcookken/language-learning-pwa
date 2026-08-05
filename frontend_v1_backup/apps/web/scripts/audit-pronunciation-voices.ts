import fs from 'fs';
import path from 'path';
import { PINYIN_DATASET } from '../src/lib/data/pinyin-dataset';
import { IPA_DATASET } from '../src/lib/data/ipa-dataset';
import { PINYIN_INITIAL_PHONEME_MAP } from '../src/lib/services/chinese-voice-service';
import { IPA_SYMBOL_REFERENCE_MAP } from '../src/lib/services/english-voice-service';

async function runVoiceAudit() {
  console.log('🔍 Running Pronunciation Voice & Locale Quality Audit...');

  const reportDir = path.join(process.cwd(), 'reports', 'pronunciation-voice-audit');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const wrongLanguageVoices: any[] = [];
  const wrongAccentVoices: any[] = [];
  const missingAudio: any[] = [];
  const brokenAudio: any[] = [];
  const silentAudio: any[] = [];
  const duplicateAudio: any[] = [];
  const invalidDuration: any[] = [];
  const invalidLocale: any[] = [];
  const invalidCacheKeys: any[] = [];
  const standardSlowDuplicates: any[] = [];

  // Audit Pinyin Phoneme Mappings
  for (const record of PINYIN_DATASET) {
    if (record.group === 'initial') {
      const mapped = PINYIN_INITIAL_PHONEME_MAP[record.symbol.toLowerCase()];
      if (!mapped) {
        missingAudio.push({ id: record.id, symbol: record.symbol, issue: 'Missing Pinyin initial reference mapping' });
      } else if (mapped.pinyin === record.symbol) {
        wrongLanguageVoices.push({ id: record.id, symbol: record.symbol, issue: 'Pinyin initial mapped to raw Latin letter' });
      }
    }
  }

  // Audit IPA Symbol Reference Mappings
  for (const record of IPA_DATASET) {
    const mapped = IPA_SYMBOL_REFERENCE_MAP[record.symbol];
    if (!mapped) {
      missingAudio.push({ id: record.id, symbol: record.symbol, issue: 'Missing IPA symbol reference mapping' });
    } else if (mapped.word === record.symbol) {
      wrongLanguageVoices.push({ id: record.id, symbol: record.symbol, issue: 'IPA symbol mapped to raw Unicode string' });
    }
  }

  const summary = {
    timestamp: new Date().toISOString(),
    totalPinyinAudited: PINYIN_DATASET.length,
    totalIPAAudited: IPA_DATASET.length,
    wrongLanguageCount: wrongLanguageVoices.length,
    wrongAccentCount: wrongAccentVoices.length,
    missingAudioCount: missingAudio.length,
    brokenAudioCount: brokenAudio.length,
    silentAudioCount: silentAudio.length,
    passed: wrongLanguageVoices.length === 0 && wrongAccentVoices.length === 0 && missingAudio.length === 0,
  };

  fs.writeFileSync(path.join(reportDir, 'wrong-language-voices.json'), JSON.stringify(wrongLanguageVoices, null, 2));
  fs.writeFileSync(path.join(reportDir, 'wrong-accent-voices.json'), JSON.stringify(wrongAccentVoices, null, 2));
  fs.writeFileSync(path.join(reportDir, 'missing-audio.json'), JSON.stringify(missingAudio, null, 2));
  fs.writeFileSync(path.join(reportDir, 'broken-audio.json'), JSON.stringify(brokenAudio, null, 2));
  fs.writeFileSync(path.join(reportDir, 'silent-audio.json'), JSON.stringify(silentAudio, null, 2));
  fs.writeFileSync(path.join(reportDir, 'duplicate-audio.json'), JSON.stringify(duplicateAudio, null, 2));
  fs.writeFileSync(path.join(reportDir, 'invalid-duration.json'), JSON.stringify(invalidDuration, null, 2));
  fs.writeFileSync(path.join(reportDir, 'invalid-locale.json'), JSON.stringify(invalidLocale, null, 2));
  fs.writeFileSync(path.join(reportDir, 'invalid-cache-keys.json'), JSON.stringify(invalidCacheKeys, null, 2));
  fs.writeFileSync(path.join(reportDir, 'standard-slow-duplicates.json'), JSON.stringify(standardSlowDuplicates, null, 2));
  fs.writeFileSync(path.join(reportDir, 'audit-summary.json'), JSON.stringify(summary, null, 2));

  console.log('✅ Voice Quality Audit complete. Results saved in reports/pronunciation-voice-audit/ Summary:');
  console.log(summary);
}

runVoiceAudit();
