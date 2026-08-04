/**
 * Search Normalizer Utility for Multilingual Search
 * Supports accentless Vietnamese, tone-stripped Pinyin, numeric Pinyin, Hanzi, and English headwords.
 */

// Strip Vietnamese diacritics
export function removeVietnameseAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// Strip Pinyin tone marks to convert e.g., "ān quán" -> "an quan"
export function removePinyinTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .toLowerCase();
}

// Normalize search query for flexible matching
export function normalizeQuery(query: string): string {
  if (!query) return '';
  const trimmed = query.trim().toLowerCase();
  const noAccents = removeVietnameseAccents(trimmed);
  const noPinyinTones = removePinyinTones(noAccents);
  return noPinyinTones.replace(/[^\w\s\u4e00-\u9fa5]/gi, '');
}

// Convert numeric pinyin like "an1 quan2" to tone pinyin "ān quán"
export function convertNumericToTonePinyin(pinyinNumeric: string): string {
  const toneMap: Record<string, string[]> = {
    a: ['a', 'ā', 'á', 'ǎ', 'à', 'a'],
    e: ['e', 'ē', 'é', 'ě', 'è', 'e'],
    i: ['i', 'ī', 'í', 'ǐ', 'ì', 'i'],
    o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'o'],
    u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'u'],
    v: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
    ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ü'],
  };

  return pinyinNumeric
    .split(/\s+/)
    .map((syllable) => {
      const match = syllable.match(/^([a-züv]+)([1-5])?$/i);
      if (!match) return syllable;
      const [, letters, toneStr] = match;
      if (!toneStr || toneStr === '5') return letters;
      const tone = parseInt(toneStr, 10);

      // Apply tone mark according to standard Pinyin rules:
      // 1. 'a' or 'e' gets the tone mark.
      // 2. 'ou' gets the tone mark on 'o'.
      // 3. Otherwise the second vowel gets the tone mark.
      let targetVowel = '';
      if (letters.includes('a')) targetVowel = 'a';
      else if (letters.includes('e')) targetVowel = 'e';
      else if (letters.includes('ou')) targetVowel = 'o';
      else {
        for (let i = letters.length - 1; i >= 0; i--) {
          if ('iouüv'.includes(letters[i].toLowerCase())) {
            targetVowel = letters[i].toLowerCase();
            break;
          }
        }
      }

      if (!targetVowel || !toneMap[targetVowel]) return letters;
      const tonedChar = toneMap[targetVowel][tone];
      return letters.replace(targetVowel, tonedChar);
    })
    .join(' ');
}
