import { describe, it, expect } from 'vitest';
import {
  removeVietnameseAccents,
  removePinyinTones,
  normalizeQuery,
  convertNumericToTonePinyin,
} from '../search-normalizer';

describe('Search Normalizer Utilities', () => {
  it('should correctly strip Vietnamese diacritics', () => {
    expect(removeVietnameseAccents('An toàn lao động')).toBe('an toan lao dong');
    expect(removeVietnameseAccents('Kiểm tra chất lượng')).toBe('kiem tra chat luong');
  });

  it('should correctly strip Pinyin tone marks', () => {
    expect(removePinyinTones('ān quán')).toBe('an quan');
    expect(removePinyinTones('tóu kuī')).toBe('tou kui');
  });

  it('should normalize complex multilingual queries', () => {
    expect(normalizeQuery('  ān quán! ')).toBe('an quan');
    expect(normalizeQuery('Bảo trì CNC#1')).toBe('bao tri cnc1');
  });

  it('should convert numeric pinyin to tone pinyin', () => {
    expect(convertNumericToTonePinyin('an1 quan2')).toBe('ān quán');
    expect(convertNumericToTonePinyin('tou2 kui1')).toBe('tóu kuī');
  });
});
