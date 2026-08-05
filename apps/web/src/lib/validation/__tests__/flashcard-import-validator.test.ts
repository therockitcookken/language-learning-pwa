import { describe, it, expect } from 'vitest';
import { validateFlashcardImport, parseCSV } from '../flashcard-import-validator';

describe('Flashcard Import Validator', () => {
  it('should validate valid flashcard items correctly', () => {
    const validJson = [
      { frontText: '安全', backText: 'An toàn', pinyinOrIpa: 'ān quán', topic: 'Safety' },
      { frontText: 'Maintenance', backText: 'Bảo trì', pinyinOrIpa: '/ˈmeɪn.tən.əns/', topic: 'Maintenance' },
    ];

    const report = validateFlashcardImport(validJson);
    expect(report.isValid).toBe(true);
    expect(report.validCount).toBe(2);
    expect(report.errorCount).toBe(0);
  });

  it('should detect missing frontText or backText', () => {
    const invalidJson = [
      { frontText: '', backText: 'An toàn' },
      { frontText: 'Safety', backText: '' },
    ];

    const report = validateFlashcardImport(invalidJson);
    expect(report.isValid).toBe(false);
    expect(report.errorCount).toBe(2);
    expect(report.errors[0].row).toBe(1);
    expect(report.errors[1].row).toBe(2);
  });

  it('should parse CSV strings correctly', () => {
    const csv = `Mặt trước,Mặt sau,Phiên âm,Chủ đề
"安全","An toàn","ān quán","Safety"
"Warehouse","Kho hàng","/ˈweə.haʊs/","Logistics"`;

    const parsed = parseCSV(csv);
    expect(parsed.length).toBe(2);
    const report = validateFlashcardImport(parsed);
    expect(report.validCount).toBe(2);
  });
});
