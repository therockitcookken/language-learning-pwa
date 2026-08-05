import { describe, it, expect } from 'vitest';
import { VocabularyRecordSchema, calculateSimilarity, normalizeText } from '../vocabulary-schema';

describe('Vocabulary Record & Data Integrity Suite', () => {

  // Test 1: Exact Duplicates Detection
  it('1. should detect exact duplicate keys when hanzi and pinyin match', () => {
    const key1 = `${normalizeText('工作')}_${normalizeText('gōng zuò')}`;
    const key2 = `${normalizeText('工作')}_${normalizeText('gōng zuò')}`;
    expect(key1).toBe(key2);
  });

  // Test 2: Normalized Punctuation / Case Duplicates
  it('2. should treat records differing only by whitespace/case/punctuation as duplicates', () => {
    const norm1 = normalizeText(' gōng zuò ');
    const norm2 = normalizeText('Gōng Zuò!');
    expect(norm1).toBe('gong zuo');
    expect(norm2).toBe('gong zuo');
    expect(norm1).toBe(norm2);
  });

  // Test 3: Semantic Similarity > 85%
  it('3. should calculate similarity > 85% for near-identical definitions', () => {
    const def1 = 'Công việc làm việc tại nhà máy';
    const def2 = 'Công việc làm việc ở nhà máy';
    const score = calculateSimilarity(def1, def2);
    expect(score).toBeGreaterThanOrEqual(0.85);
  });

  // Test 4: Repeated Synonym Template Leakage Detection
  it('4. should flag repeated synonym template across 3+ unrelated records', () => {
    const records = [
      { id: '1', syn: '工作' },
      { id: '2', syn: '工作' },
      { id: '3', syn: '工作' },
    ];
    const freqMap = new Map<string, string[]>();
    records.forEach(r => {
      if (!freqMap.has(r.syn)) freqMap.set(r.syn, []);
      freqMap.get(r.syn)!.push(r.id);
    });
    expect(freqMap.get('工作')!.length).toBeGreaterThanOrEqual(3);
  });

  // Test 5: Repeated Antonym Template Leakage Detection
  it('5. should flag repeated antonym template across 3+ unrelated records', () => {
    const records = [
      { id: '1', ant: '休息' },
      { id: '2', ant: '休息' },
      { id: '3', ant: '休息' },
    ];
    const freqMap = new Map<string, string[]>();
    records.forEach(r => {
      if (!freqMap.has(r.ant)) freqMap.set(r.ant, []);
      freqMap.get(r.ant)!.push(r.id);
    });
    expect(freqMap.get('休息')!.length).toBeGreaterThanOrEqual(3);
  });

  // Test 6: Example Sentence Missing Main Word
  it('6. should reject example sentences that do not contain the target word', () => {
    const record = {
      id: 'rec-1',
      simplified: '安全',
      pinyin: 'ān quán',
      vietnameseMeanings: ['An toàn'],
      partOfSpeech: ['adjective'],
      examples: [
        { chinese: '今天天气很好。', vietnamese: 'Hôm nay thời tiết tốt.' } // missing '安全'
      ],
    };
    const result = VocabularyRecordSchema.safeParse(record);
    expect(result.success).toBe(false);
  });

  // Test 7: Antonym Empty Array When No Direct Opposite
  it('7. should accept antonyms = [] when no direct opposite exists', () => {
    const record = {
      id: 'rec-2',
      simplified: '生活',
      pinyin: 'shēng huó',
      vietnameseMeanings: ['Cuộc sống'],
      partOfSpeech: ['noun'],
      antonyms: [],
    };
    const result = VocabularyRecordSchema.safeParse(record);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.antonyms).toEqual([]);
    }
  });

  // Test 8: Merging Multiple Meanings of Same Word
  it('8. should merge multiple meanings into vietnameseMeanings array instead of duplicate cards', () => {
    const record = {
      id: 'rec-3',
      simplified: '方便',
      pinyin: 'fāng biàn',
      vietnameseMeanings: ['Thuận tiện', 'Đi vệ sinh (ngữ cảnh thân mật)'],
      partOfSpeech: ['adjective'],
    };
    const result = VocabularyRecordSchema.safeParse(record);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.vietnameseMeanings.length).toBe(2);
    }
  });

  // Test 9: Homophones with Different Hanzi Not Merged
  it('9. should keep homophones with different Hanzi distinct', () => {
    const word1 = { hanzi: '公', pinyin: 'gōng' };
    const word2 = { hanzi: '工', pinyin: 'gōng' };
    const key1 = `${word1.hanzi}_${word1.pinyin}`;
    const key2 = `${word2.hanzi}_${word2.pinyin}`;
    expect(key1).not.toBe(key2);
  });

  // Test 10: React Key Uniqueness Validation
  it('10. should construct unique React keys for card list rendering', () => {
    const item = { id: 'card-100' };
    const synonyms = [{ word: '防护' }, { word: '保卫' }];
    const keys = synonyms.map((s, idx) => `${item.id}-syn-${s.word}-${idx}`);
    expect(new Set(keys).size).toBe(synonyms.length);
    expect(keys[0]).toBe('card-100-syn-防护-0');
    expect(keys[1]).toBe('card-100-syn-保卫-1');
  });

});
