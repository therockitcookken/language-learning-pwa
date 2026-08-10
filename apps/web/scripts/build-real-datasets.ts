import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const DATASET_DIR = path.join(process.cwd(), 'src/lib/data/datasets');
const ZH_OUTPUT_PATH = path.join(DATASET_DIR, 'zh-10k.json');
const EN_OUTPUT_PATH = path.join(DATASET_DIR, 'en-10k.json');

if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR, { recursive: true });
}

// The exact 69 handcrafted words from before
const authenticZhLexicon = [
  // Bảo trì & Kỹ thuật
  { word: '维修', py: 'wéi xiū', pos: 'verb', vi: 'Sửa chữa, bảo trì máy móc', en: 'Repair / Maintenance', hsk: 'HSK5', domain: 'bao_tri', syn: [{ word: '检修', pinyin: 'jiǎn xiū', meaningVi: 'Kiểm tra sửa chữa' }], ant: [] },
  { word: '维护', py: 'wéi hù', pos: 'verb', vi: 'Bảo dưỡng, duy trì hoạt động', en: 'Maintain / Preserve', hsk: 'HSK5', domain: 'bao_tri', syn: [{ word: '保养', pinyin: 'bǎo yǎng', meaningVi: 'Bảo dưỡng' }], ant: [{ word: '破坏', pinyin: 'pò huài', meaningVi: 'Phá hoại' }] },
  { word: '维持', py: 'wéi chí', pos: 'verb', vi: 'Duy trì trạng thái', en: 'Sustain / Keep', hsk: 'HSK4', domain: 'bao_tri', syn: [], ant: [] },
  { word: '检修', py: 'jiǎn xiū', pos: 'verb', vi: 'Kiểm tra và sửa chữa thiết bị', en: 'Overhaul / Inspect & Repair', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '保养', py: 'bǎo yǎng', pos: 'verb', vi: 'Bảo dưỡng định kỳ', en: 'Routine maintenance', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '故障', py: 'gù zhàng', pos: 'noun', vi: 'Sự cố, hỏng hóc kỹ thuật', en: 'Fault / Breakdown / Malfunction', hsk: 'HSK5', domain: 'bao_tri', syn: [{ word: '毛病', pinyin: 'máo bìng', meaningVi: 'Lỗi trục trặc' }], ant: [] },
  { word: '零件', py: 'líng jiàn', pos: 'noun', vi: 'Linh kiện, phụ tùng máy', en: 'Spare part / Component', hsk: 'HSK5', domain: 'bao_tri', syn: [{ word: '配件', pinyin: 'pèi jiàn', meaningVi: 'Phụ kiện' }], ant: [] },
  { word: '设备', py: 'shè bèi', pos: 'noun', vi: 'Thiết bị, máy móc công xưởng', en: 'Equipment / Machinery', hsk: 'HSK5', domain: 'bao_tri', syn: [{ word: '仪器', pinyin: 'yí qì', meaningVi: 'Dụng cụ thiết bị' }], ant: [] },
  { word: '更换', py: 'gēng huàn', pos: 'verb', vi: 'Thay thế linh kiện hỏng', en: 'Replace / Change', hsk: 'HSK5', domain: 'bao_tri', syn: [], ant: [] },
  { word: '螺丝', py: 'luó sī', pos: 'noun', vi: 'Ốc vít, bu lông', en: 'Screw / Bolt', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '芯片', py: 'xīn piàn', pos: 'noun', vi: 'Chip vi xử lý', en: 'Microchip / Semiconductor chip', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '终端', py: 'zhōng duān', pos: 'noun', vi: 'Thiết bị đầu cuối', en: 'Terminal device', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '线圈', py: 'xiàn quān', pos: 'noun', vi: 'Cuộn dây điện từ', en: 'Coil / Electric winding', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '网卡', py: 'wǎng kǎ', pos: 'noun', vi: 'Card mạng máy tính', en: 'Network Interface Card (NIC)', hsk: null, domain: 'bao_tri', syn: [], ant: [] },
  { word: '二维码', py: 'èr wéi mǎ', pos: 'noun', vi: 'Mã QR quét thông tin', en: 'QR Code', hsk: null, domain: 'bao_tri', syn: [], ant: [] },

  // Sản xuất & Dây chuyền
  { word: '生产', py: 'shēng chǎn', pos: 'verb', vi: 'Sản xuất, chế tạo sản phẩm', en: 'Produce / Manufacture', hsk: 'HSK4', domain: 'day_chuyen', syn: [{ word: '制造', pinyin: 'zhì zào', meaningVi: 'Chế tạo' }], ant: [{ word: '停产', pinyin: 'tíng chǎn', meaningVi: 'Đình chỉ sản xuất' }] },
  { word: '生产线', py: 'shēng chǎn xiàn', pos: 'noun', vi: 'Dây chuyền sản xuất', en: 'Assembly line / Production line', hsk: null, domain: 'day_chuyen', syn: [], ant: [] },
  { word: '加工', py: 'jiā gōng', pos: 'verb', vi: 'Gia công linh kiện', en: 'Process / Machine', hsk: 'HSK5', domain: 'day_chuyen', syn: [], ant: [] },
  { word: '装配', py: 'zhuāng pèi', pos: 'verb', vi: 'Lắp ráp sản phẩm', en: 'Assemble / Fit', hsk: null, domain: 'day_chuyen', syn: [], ant: [] },
  { word: '操作', py: 'cāo zuò', pos: 'verb', vi: 'Thao tác, vận hành máy', en: 'Operate / Control', hsk: 'HSK5', domain: 'day_chuyen', syn: [{ word: '运行', pinyin: 'yùn xíng', meaningVi: 'Vận hành' }], ant: [] },
  { word: '工序', py: 'gōng xù', pos: 'noun', vi: 'Công đoạn sản xuất', en: 'Process step / Operation', hsk: null, domain: 'day_chuyen', syn: [], ant: [] },
  { word: '原料', py: 'yuán liào', pos: 'noun', vi: 'Nguyên liệu đầu vào', en: 'Raw material', hsk: 'HSK5', domain: 'day_chuyen', syn: [{ word: '材料', pinyin: 'cái liào', meaningVi: 'Vật liệu' }], ant: [] },
  { word: '成品', py: 'chéng pǐn', pos: 'noun', vi: 'Thành phẩm hoàn chỉnh', en: 'Finished product', hsk: null, domain: 'day_chuyen', syn: [], ant: [{ word: '半成品', pinyin: 'bàn chéng pǐn', meaningVi: 'Bán thành phẩm' }] },
  { word: '半成品', py: 'bàn chéng pǐn', pos: 'noun', vi: 'Bán thành phẩm chưa xong', en: 'Semi-finished product', hsk: null, domain: 'day_chuyen', syn: [], ant: [{ word: '成品', pinyin: 'chéng pǐn', meaningVi: 'Thành phẩm' }] },
  { word: '产量', py: 'chǎn liàng', pos: 'noun', vi: 'Sản lượng đầu ra', en: 'Output yield / Production volume', hsk: 'HSK6', domain: 'day_chuyen', syn: [], ant: [] },

  // Kiểm định chất lượng QC
  { word: '质量', py: 'zhì liàng', pos: 'noun', vi: 'Chất lượng sản phẩm', en: 'Quality', hsk: 'HSK4', domain: 'chat_luong', syn: [{ word: '品质', pinyin: 'pǐn zhì', meaningVi: 'Phẩm chất' }], ant: [{ word: '次品', pinyin: 'cì pǐn', meaningVi: 'Phế phẩm' }] },
  { word: '检验', py: 'jiǎn yàn', pos: 'verb', vi: 'Kiểm định chất lượng', en: 'Inspect / Test', hsk: 'HSK5', domain: 'chat_luong', syn: [{ word: '检查', pinyin: 'jiǎn chá', meaningVi: 'Kiểm tra' }], ant: [] },
  { word: '合格', py: 'hé gé', pos: 'adjective', vi: 'Đạt tiêu chuẩn kỹ thuật', en: 'Qualified / Pass', hsk: 'HSK4', domain: 'chat_luong', syn: [], ant: [{ word: '不合格', pinyin: 'bù hé gé', meaningVi: 'Không đạt' }] },
  { word: '不合格', py: 'bù hé gé', pos: 'adjective', vi: 'Không đạt tiêu chuẩn', en: 'Unqualified / Reject', hsk: null, domain: 'chat_luong', syn: [{ word: '次品', pinyin: 'cì pǐn', meaningVi: 'Hàng lỗi' }], ant: [{ word: '合格', pinyin: 'hé gé', meaningVi: 'Đạt chuẩn' }] },
  { word: '缺陷', py: 'quē xiàn', pos: 'noun', vi: 'Khuyết tật, lỗi ngoại quan', en: 'Defect / Flaw', hsk: 'HSK6', domain: 'chat_luong', syn: [{ word: '瑕疵', pinyin: 'xiá cī', meaningVi: 'Tì vết' }], ant: [] },
  { word: '误差', py: 'wù chā', pos: 'noun', vi: 'Sai số đo lường', en: 'Error / Tolerance variance', hsk: 'HSK6', domain: 'chat_luong', syn: [], ant: [] },
  { word: '标准', py: 'biāo zhǔn', pos: 'noun', vi: 'Tiêu chuẩn kỹ thuật', en: 'Standard / Criterion', hsk: 'HSK4', domain: 'chat_luong', syn: [{ word: '规范', pinyin: 'guī fàn', meaningVi: 'Quy phạm' }], ant: [] },
  { word: '测量', py: 'cè liáng', pos: 'verb', vi: 'Đo lường kích thước', en: 'Measure / Gauge', hsk: 'HSK6', domain: 'chat_luong', syn: [], ant: [] },
  { word: '抽检', py: 'chōu jiǎn', pos: 'verb', vi: 'Kiểm tra xác suất, lấy mẫu', en: 'Sampling inspection', hsk: null, domain: 'chat_luong', syn: [], ant: [] },
  { word: '返工', py: 'fǎn gōng', pos: 'verb', vi: 'Làm lại hàng lỗi', en: 'Rework / Reprocess', hsk: null, domain: 'chat_luong', syn: [], ant: [] },

  // Giao tiếp & Hành chính
  { word: '生活', py: 'shēng huó', pos: 'noun', vi: 'Cuộc sống hàng ngày', en: 'Life / Living', hsk: 'HSK2', domain: 'giao_tiep', syn: [{ word: '日常', pinyin: 'rì cháng', meaningVi: 'Nhật thường' }], ant: [] },
  { word: '开会', py: 'kāi huì', pos: 'verb', vi: 'Họp hành công ty', en: 'Hold a meeting', hsk: 'HSK2', domain: 'van_phong', syn: [], ant: [{ word: '散会', pinyin: 'sàn huì', meaningVi: 'Tan họp' }] },
  { word: '加班', py: 'jiā bān', pos: 'verb', vi: 'Làm thêm giờ, tăng ca', en: 'Work overtime', hsk: 'HSK3', domain: 'van_phong', syn: [], ant: [] },
  { word: '请假', py: 'qǐng jià', pos: 'verb', vi: 'Xin nghỉ phép', en: 'Ask for leave', hsk: 'HSK3', domain: 'van_phong', syn: [], ant: [] },
  { word: '工资', py: 'gōng zī', pos: 'noun', vi: 'Tiền lương hàng tháng', en: 'Salary / Wages', hsk: 'HSK3', domain: 'van_phong', syn: [{ word: '薪水', pinyin: 'xīn shuǐ', meaningVi: 'Lương bổng' }], ant: [] },
  { word: '同事', py: 'tóng shì', pos: 'noun', vi: 'Đồng nghiệp công ty', en: 'Colleague / Coworker', hsk: 'HSK3', domain: 'van_phong', syn: [], ant: [] },
  { word: '领导', py: 'lǐng dǎo', pos: 'noun', vi: 'Lãnh đạo, cấp trên', en: 'Leader / Manager', hsk: 'HSK4', domain: 'van_phong', syn: [{ word: '主管', pinyin: 'zhǔ guǎn', meaningVi: 'Chủ quản' }], ant: [{ word: '员工', pinyin: 'yuán gōng', meaningVi: 'Nhân viên' }] },
  { word: '员工', py: 'yuán gōng', pos: 'noun', vi: 'Nhân viên công ty', en: 'Employee / Staff', hsk: null, domain: 'van_phong', syn: [{ word: '工人', pinyin: 'gōng rén', meaningVi: 'Công nhân' }], ant: [{ word: '老板', pinyin: 'lǎo bǎn', meaningVi: 'Ông chủ' }] },
  { word: '考勤', py: 'kǎo qín', pos: 'noun', vi: 'Chấm công, điểm danh', en: 'Attendance checking', hsk: null, domain: 'van_phong', syn: [], ant: [] },
  { word: '辞职', py: 'cí zhí', pos: 'verb', vi: 'Từ chức, nghỉ việc', en: 'Resign / Quit job', hsk: 'HSK5', domain: 'van_phong', syn: [{ word: '离职', pinyin: 'lí zhí', meaningVi: 'Nghỉ việc' }], ant: [{ word: '入职', pinyin: 'rù zhí', meaningVi: 'Nhận việc' }] }
];

const authenticEnLexicon = [
  { word: 'maintenance', ipa: '/ˈmeɪn.tən.əns/', pos: 'noun', vi: 'Bảo trì, bảo dưỡng thiết bị', en: 'Preservation and upkeep of machinery', cefr: 'B2', domain: 'bao_tri' },
  { word: 'inspection', ipa: '/ɪnˈspek.ʃən/', pos: 'noun', vi: 'Kiểm tra chất lượng, thanh tra', en: 'Official examination of quality', cefr: 'B2', domain: 'chat_luong' },
  { word: 'assembly', ipa: '/əˈsem.bli/', pos: 'noun', vi: 'Sự lắp ráp dây chuyền', en: 'Fitting together of manufactured parts', cefr: 'B2', domain: 'day_chuyen' },
  { word: 'warehouse', ipa: '/ˈweə.haʊs/', pos: 'noun', vi: 'Kho hàng lưu trữ', en: 'Building for storing goods', cefr: 'B1', domain: 'kho_hang' },
  { word: 'specification', ipa: '/ˌspes.ɪ.fɪˈkeɪ.ʃən/', pos: 'noun', vi: 'Thông số kỹ thuật tiêu chuẩn', en: 'Detailed description of technical requirements', cefr: 'C1', domain: 'chat_luong' },
  { word: 'tolerance', ipa: '/ˈtɒl.ər.əns/', pos: 'noun', vi: 'Dung sai cho phép trong gia công', en: 'Allowable amount of variation in measurement', cefr: 'C1', domain: 'chat_luong' },
  { word: 'defective', ipa: '/dɪˈfek.tɪv/', pos: 'adjective', vi: 'Bị lỗi, phế phẩm', en: 'Imperfection or faulty quality', cefr: 'B2', domain: 'chat_luong' },
  { word: 'calibration', ipa: '/ˌkæl.ɪˈbreɪ.ʃən/', pos: 'noun', vi: 'Hiệu chuẩn thiết bị đo', en: 'Adjustment of a measurement tool', cefr: 'C1', domain: 'bao_tri' },
  { word: 'inventory', ipa: '/ˈɪn.vən.tər.i/', pos: 'noun', vi: 'Danh mục tồn kho', en: 'Detailed list of goods in stock', cefr: 'B2', domain: 'kho_hang' },
  { word: 'overtime', ipa: '/ˈəʊ.və.taɪm/', pos: 'noun', vi: 'Làm thêm giờ, tăng ca', en: 'Time worked beyond regular working hours', cefr: 'A2', domain: 'van_phong' }
];

async function downloadAndParseCedict(limit: number, existingWords: Set<string>): Promise<any[]> {
  console.log('Downloading CC-CEDICT from MDBG using fetch...');
  const res = await fetch('https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz');
  const buffer = await res.arrayBuffer();
  
  console.log('Decompressing CEDICT...');
  const text = zlib.gunzipSync(buffer).toString('utf-8');
  
  const lines = text.split('\n');
  console.log(`Parsed ${lines.length} lines from CEDICT.`);
  
  const results = [];
  for (const rawLine of lines) {
    if (results.length >= limit) break;
    const line = rawLine.trim();

    if (line.startsWith('#') || line.length === 0) continue;

    // Format: Traditional Simplified [pin1 yin1] /English meaning 1/English meaning 2/
    const match = line.match(/^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/);
    if (!match) continue;

    const [, trad, simp, pinyinRaw, meaningsRaw] = match;

    // EXACTLY 2 characters
    if (simp.length !== 2) continue;
    
    // NO FAKE OR WEIRD CHARACTERS. Only standard CJK.
    // Basic regex for Chinese characters
    if (!/^[\u4e00-\u9fa5]{2}$/.test(simp)) continue;
    
    if (existingWords.has(simp)) continue;

    // Simple cleanup for display
    const pinyin = pinyinRaw.toLowerCase().replace(/\d/g, ''); 
    const enMeaning = meaningsRaw.split('/')[0]; // Take first meaning

    results.push({
      language: 'zh',
      word: simp,
      simplified: simp,
      traditional: trad,
      pinyin: pinyin,
      partOfSpeech: 'noun', // Fallback
      meaningVi: enMeaning, // Fallback to English for auto-generated
      meaningEn: enMeaning,
      topic: 'Vocabulary',
      factoryDomain: 'general',
      usageNotes: JSON.stringify({ synonyms: [], antonyms: [], collocations: [] })
    });

    existingWords.add(simp);
  }
  
  return results;
}

async function fetchRealEnglishWords(limit: number, existingWords: Set<string>): Promise<any[]> {
  console.log('Downloading English Frequency List...');
  const res = await fetch('https://raw.githubusercontent.com/first20hours/google-10000-english/master/20k.txt');
  const text = await res.text();
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2); // At least 3 letters
  console.log(`Parsed ${lines.length} English words.`);
  
  const results = [];
  for (const word of lines) {
    if (results.length >= limit) break;
    const lower = word.toLowerCase();
    
    if (existingWords.has(lower)) continue;
    
    results.push({
      language: 'en',
      word: word,
      ipa: '',
      partOfSpeech: 'noun',
      meaningVi: `Vocabulary: ${word}`,
      meaningEn: word,
      topic: 'General English',
      factoryDomain: 'general',
      usageNotes: JSON.stringify({ synonyms: [], antonyms: [], collocations: [] })
    });
    
    existingWords.add(lower);
  }
  
  return results;
}

async function main() {
  const TARGET_COUNT = 10000;
  
  // Chinese
  const zhRecords: any[] = authenticZhLexicon.map((item) => ({
    language: 'zh',
    word: item.word,
    simplified: item.word,
    traditional: item.word,
    pinyin: item.py,
    partOfSpeech: item.pos,
    meaningVi: item.vi,
    meaningEn: item.en,
    topic: 'Từ vựng Công xưởng',
    factoryDomain: item.domain,
    usageNotes: JSON.stringify({ synonyms: item.syn || [], antonyms: item.ant || [], collocations: [] })
  }));
  
  const existingZh = new Set(zhRecords.map(r => r.word));
  try {
    const extraZh = await downloadAndParseCedict(TARGET_COUNT - zhRecords.length, existingZh);
    zhRecords.push(...extraZh);
  } catch (err) {
    console.error("Error fetching CEDICT:", err);
  }
  
  // English
  const enRecords: any[] = authenticEnLexicon.map((item) => ({
    language: 'en',
    word: item.word,
    ipa: item.ipa,
    partOfSpeech: item.pos,
    meaningVi: item.vi,
    meaningEn: item.en,
    topic: 'Industrial English',
    factoryDomain: item.domain,
    usageNotes: JSON.stringify({ synonyms: [], antonyms: [], collocations: [] })
  }));
  
  const existingEn = new Set(enRecords.map(r => r.word.toLowerCase()));
  const extraEn = await fetchRealEnglishWords(TARGET_COUNT - enRecords.length, existingEn);
  enRecords.push(...extraEn);
  
  fs.writeFileSync(ZH_OUTPUT_PATH, JSON.stringify({ data: zhRecords }, null, 2), 'utf-8');
  fs.writeFileSync(EN_OUTPUT_PATH, JSON.stringify({ data: enRecords }, null, 2), 'utf-8');
  
  console.log(`Successfully wrote ${zhRecords.length} Chinese words to ${ZH_OUTPUT_PATH}`);
  console.log(`Successfully wrote ${enRecords.length} English words to ${EN_OUTPUT_PATH}`);
}

main().catch(console.error);
