import { z } from 'zod';

export const FlashcardImportSchema = z.object({
  frontText: z.string().min(1, 'Mặt trước không được để trống'),
  backText: z.string().min(1, 'Mặt sau không được để trống'),
  pinyinOrIpa: z.string().optional().default(''),
  topic: z.string().optional().default('General'),
  factoryDomain: z.string().optional().default('general'),
  mnemonic: z.string().optional(),
});

export type FlashcardImportItem = z.infer<typeof FlashcardImportSchema>;

export interface ValidationErrorItem {
  row: number;
  field: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalRows: number;
  validCount: number;
  errorCount: number;
  errors: ValidationErrorItem[];
  validData: FlashcardImportItem[];
}

/**
 * Validates array of objects (from JSON or parsed CSV)
 */
export function validateFlashcardImport(data: any[]): ValidationReport {
  const errors: ValidationErrorItem[] = [];
  const validData: FlashcardImportItem[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      totalRows: 0,
      validCount: 0,
      errorCount: 1,
      errors: [{ row: 0, field: 'file', message: 'Tệp không chứa dữ liệu hợp lệ hoặc danh sách rỗng.' }],
      validData: [],
    };
  }

  data.forEach((item, index) => {
    const rowNum = index + 1;
    const normalizedItem = {
      frontText: item.frontText || item['Mặt trước'] || item.front || item.word || '',
      backText: item.backText || item['Mặt sau'] || item.back || item.meaningVi || item.meaning || '',
      pinyinOrIpa: item.pinyinOrIpa || item['Phiên âm'] || item.pinyin || item.ipa || '',
      topic: item.topic || item['Chủ đề'] || 'General',
      factoryDomain: item.factoryDomain || item['Lĩnh vực'] || 'general',
      mnemonic: item.mnemonic || item['Mẹo ghi nhớ'] || '',
    };

    const parseResult = FlashcardImportSchema.safeParse(normalizedItem);
    if (!parseResult.success) {
      parseResult.error.errors.forEach((err) => {
        errors.push({
          row: rowNum,
          field: err.path.join('.'),
          message: err.message,
        });
      });
    } else {
      validData.push(parseResult.data);
    }
  });

  return {
    isValid: errors.length === 0,
    totalRows: data.length,
    validCount: validData.length,
    errorCount: errors.length,
    errors,
    validData,
  };
}

/**
 * Parses raw CSV string to array of objects
 */
export function parseCSV(csvString: string): any[] {
  const lines = csvString
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map((h) => h.replace(/^"(.*)"$/, '$1').trim());
  const rows: any[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
      .map((val) => val.replace(/^"(.*)"$/, '$1').trim());

    const rowObj: Record<string, string> = {};
    headers.forEach((header, colIndex) => {
      rowObj[header] = values[colIndex] || '';
    });
    rows.push(rowObj);
  }

  return rows;
}
