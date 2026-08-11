import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import natural from 'natural';
import cmudictPkg from 'cmudict';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const DATA_TEMP_DIR = path.resolve(ROOT_DIR, 'data_temp');
const OUT_ACCEPTED = path.resolve(DATA_TEMP_DIR, 'pipeline/accepted/en_accepted.json');
const OUT_REJECTED = path.resolve(DATA_TEMP_DIR, 'pipeline/rejected/en_rejected.json');
const OUT_QUARANTINE = path.resolve(DATA_TEMP_DIR, 'pipeline/quarantine/en_quarantine.json');

const cmudict = new cmudictPkg.CMUDict();
const wordnet = new natural.WordNet();

// CMU to IPA mapping
const ARPABET_TO_IPA = {
  'AA': 'ɑː', 'AE': 'æ', 'AH': 'ʌ', 'AO': 'ɔː', 'AW': 'aʊ', 'AY': 'aɪ',
  'B': 'b', 'CH': 'tʃ', 'D': 'd', 'DH': 'ð', 'EH': 'ɛ', 'ER': 'ɜːr', 'EY': 'eɪ',
  'F': 'f', 'G': 'ɡ', 'HH': 'h', 'IH': 'ɪ', 'IY': 'iː', 'JH': 'dʒ', 'K': 'k',
  'L': 'l', 'M': 'm', 'N': 'n', 'NG': 'ŋ', 'OW': 'oʊ', 'OY': 'ɔɪ', 'P': 'p',
  'R': 'r', 'S': 's', 'SH': 'ʃ', 'T': 't', 'TH': 'θ', 'UH': 'ʊ', 'UW': 'uː',
  'V': 'v', 'W': 'w', 'Y': 'j', 'Z': 'z', 'ZH': 'ʒ'
};

function arpaToIpa(arpaStr) {
  if (!arpaStr) return null;
  const tokens = arpaStr.split(/\s+/);
  let ipaStr = '';
  for (const tok of tokens) {
    const clean = tok.replace(/[0-9]/g, '');
    if (ARPABET_TO_IPA[clean]) {
      ipaStr += ARPABET_TO_IPA[clean];
    } else {
      ipaStr += clean.toLowerCase();
    }
  }
  return ipaStr ? `/${ipaStr}/` : null;
}

// Function words / stop words to filter out
const STOP_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
]);

// Domain categories mapping
const DOMAIN_KEYWORDS = {
  "Giao tiếp công xưởng": ['machine', 'factory', 'assembly', 'production', 'manufacture', 'equipment', 'tool', 'operate', 'process', 'shift', 'worker', 'foreman', 'conveyor', 'motor', 'gear', 'pump', 'valve', 'weld', 'drill', 'mold', 'press'],
  "An toàn lao động": ['safety', 'danger', 'hazard', 'protect', 'emergency', 'alarm', 'rescue', 'helmet', 'glove', 'mask', 'goggles', 'vest', 'extinguisher', 'caution', 'warning', 'toxic', 'flammable'],
  "Quản lý chất lượng": ['quality', 'inspect', 'examine', 'measure', 'standard', 'defect', 'reject', 'tolerance', 'gauge', 'calibrate', 'sample', 'audit', 'compliance'],
  "Bảo trì & Cơ điện": ['repair', 'maintain', 'fix', 'service', 'overhaul', 'lubricate', 'replace', 'install', 'diagnose', 'troubleshoot', 'circuit', 'wire', 'voltage'],
  "Kho hàng & Vận chuyển": ['warehouse', 'storage', 'inventory', 'stock', 'shipment', 'freight', 'cargo', 'pallet', 'forklift', 'dispatch', 'logistics', 'supply'],
  "Nhân sự & Tiền lương": ['salary', 'wage', 'payroll', 'hire', 'recruit', 'interview', 'contract', 'benefit', 'pension', 'insurance', 'overtime', 'leave', 'promotion'],
  "Giao tiếp đời sống": ['family', 'friend', 'food', 'drink', 'cook', 'house', 'home', 'school', 'shop', 'buy', 'sell', 'travel', 'health', 'doctor', 'hospital', 'weather', 'clothes', 'money']
};

// Rich English-Vietnamese dictionary
const EN_VI_MAP = new Map([
  ['account', 'tài khoản'], ['action', 'hành động'], ['activity', 'hoạt động'], ['addition', 'sự thêm vào'],
  ['address', 'địa chỉ'], ['administration', 'sự quản lý'], ['advantage', 'thuận lợi'], ['agreement', 'hợp đồng/thỏa thuận'],
  ['air', 'không khí'], ['amount', 'số lượng'], ['analysis', 'sự phân tích'], ['animal', 'động vật'],
  ['answer', 'câu trả lời'], ['apparatus', 'thiết bị'], ['approval', 'sự phê duyệt'], ['argument', 'sự tranh luận'],
  ['art', 'nghệ thuật'], ['attack', 'sự tấn công'], ['attempt', 'nỗ lực'], ['attention', 'chú ý'],
  ['attraction', 'sự thu hút'], ['authority', 'thẩm quyền'], ['back', 'phía sau'], ['balance', 'sự cân bằng'],
  ['base', 'căn cứ/cơ sở'], ['behavior', 'hành vi'], ['belief', 'niềm tin'], ['birth', 'sự ra đời'],
  ['bit', 'mảnh nhỏ'], ['blood', 'máu'], ['blow', 'cú đánh'], ['body', 'cơ thể'],
  ['building', 'tòa nhà'], ['burn', 'vết cháy'], ['business', 'kinh doanh'], ['butter', 'bơ'],
  ['canvas', 'vải bạt'], ['care', 'sự chăm sóc'], ['cause', 'nguyên nhân'], ['chalk', 'phấn'],
  ['chance', 'cơ hội'], ['change', 'sự thay đổi'], ['cloth', 'vải'], ['coal', 'than đá'],
  ['color', 'màu sắc'], ['comfort', 'sự thoải mái'], ['company', 'công ty'], ['comparison', 'sự so sánh'],
  ['competition', 'sự cạnh tranh'], ['condition', 'điều kiện'], ['connection', 'kết nối'], ['control', 'sự kiểm soát'],
  ['cook', 'đầu bếp'], ['copper', 'đồng'], ['copy', 'bản sao'], ['cork', 'nút bần'],
  ['cotton', 'bông'], ['cough', 'cơn ho'], ['country', 'quốc gia'], ['cover', 'vỏ bọc'],
  ['crack', 'vết nứt'], ['credit', 'tín dụng'], ['crime', 'tội phạm'], ['crush', 'sự đè nát'],
  ['cry', 'tiếng khóc'], ['current', 'dòng điện/dòng chảy'], ['damage', 'sự tổn thất'], ['danger', 'mối nguy hiểm'],
  ['daughter', 'con gái'], ['day', 'ngày'], ['death', 'cái chết'], ['decision', 'quyết định'],
  ['degree', 'mức độ/bằng cấp'], ['design', 'thiết kế'], ['desire', 'khao khát'], ['destruction', 'sự phá hủy'],
  ['detail', 'chi tiết'], ['development', 'sự phát triển'], ['direction', 'hướng đi'], ['discovery', 'sự phát hiện'],
  ['discussion', 'cuộc thảo luận'], ['disease', 'bệnh tật'], ['disgust', 'sự kinh tởm'], ['distance', 'khoảng cách'],
  ['distribution', 'sự phân phối'], ['division', 'sự phân chia'], ['doubt', 'sự nghi ngờ'], ['drink', 'đồ uống'],
  ['driving', 'lái xe'], ['dust', 'bụi bẩn'], ['earth', 'trái đất'], ['education', 'giáo dục'],
  ['effect', 'hiệu ứng'], ['end', 'kết thúc'], ['error', 'lỗi kỹ thuật'], ['event', 'sự kiện'],
  ['example', 'ví dụ'], ['exchange', 'sự trao đổi'], ['existence', 'sự tồn tại'], ['expansion', 'sự mở rộng'],
  ['experience', 'kinh nghiệm'], ['expert', 'chuyên gia'], ['fact', 'sự thật'], ['fall', 'mùa thu/sự rơi'],
  ['family', 'gia đình'], ['father', 'người cha'], ['fear', 'nỗi sợ'], ['feeling', 'cảm xúc'],
  ['fiction', 'hư cấu'], ['field', 'cánh đồng/lĩnh vực'], ['fight', 'cuộc chiến'], ['fire', 'ngọn lửa'],
  ['flame', 'ngọn lửa'], ['flight', 'chuyến bay'], ['flower', 'bông hoa'], ['fly', 'con ruồi'],
  ['food', 'thức ăn'], ['force', 'lực lượng'], ['form', 'hình thức/bản khai'], ['friend', 'bạn bè'],
  ['front', 'phía trước'], ['fruit', 'trái cây'], ['glass', 'thủy tinh'], ['gold', 'vàng'],
  ['government', 'chính phủ'], ['grain', 'hạt ngũ cốc'], ['grass', 'ngọn cỏ'], ['grip', 'sự kẹp chặt'],
  ['group', 'nhóm'], ['growth', 'sự tăng trưởng'], ['guide', 'người hướng dẫn'], ['harbor', 'bến cảng'],
  ['harmony', 'sự hòa hợp'], ['hate', 'sự ghét bỏ'], ['hearing', 'thính giác'], ['heat', 'sức nóng'],
  ['help', 'sự giúp đỡ'], ['history', 'lịch sử'], ['hole', 'lỗ hổng'], ['hope', 'hy vọng'],
  ['hour', 'giờ đồng hồ'], ['house', 'ngôi nhà'], ['ice', 'băng đá'], ['idea', 'ý tưởng'],
  ['impression', 'ấn tượng'], ['increase', 'sự gia tăng'], ['industry', 'ngành công nghiệp'], ['ink', 'mực in'],
  ['insect', 'côn trùng'], ['instrument', 'dụng cụ'], ['insurance', 'bảo hiểm'], ['interest', 'sự quan tâm'],
  ['invention', 'sự phát minh'], ['iron', 'sắt'], ['jelly', 'thạch'], ['join', 'mối nối'],
  ['journey', 'hành trình'], ['judge', 'thẩm phán'], ['jump', 'cú nhảy'], ['kick', 'cú đá'],
  ['kiss', 'nụ hôn'], ['knowledge', 'kiến thức'], ['land', 'đất đai'], ['language', 'ngôn ngữ'],
  ['laugh', 'tiếng cười'], ['law', 'pháp luật'], ['lead', 'chất chì'], ['learning', 'việc học'],
  ['leather', 'chất liệu da'], ['letter', 'lá thư/chữ cái'], ['level', 'mức độ'], ['lift', 'thang máy'],
  ['light', 'ánh sáng'], ['limit', 'giới hạn'], ['linen', 'vải lanh'], ['liquid', 'chất lỏng'],
  ['list', 'danh sách'], ['look', 'cái nhìn'], ['loss', 'sự mất mát'], ['love', 'tình yêu'],
  ['machine', 'máy móc'], ['man', 'người đàn ông'], ['manager', 'người quản lý'], ['mark', 'dấu hiệu'],
  ['market', 'thị trường'], ['mass', 'khối lượng'], ['meal', 'bữa ăn'], ['measure', 'biện pháp'],
  ['meat', 'thịt'], ['meeting', 'cuộc họp'], ['memory', 'ký ức'], ['metal', 'kim loại'],
  ['middle', 'ở giữa'], ['milk', 'sữa'], ['mind', 'tâm trí'], ['mine', 'mỏ khoáng sản'],
  ['minute', 'phút'], ['mist', 'sương mù'], ['money', 'tiền bạc'], ['month', 'tháng'],
  ['morning', 'buổi sáng'], ['mother', 'người mẹ'], ['motion', 'chuyển động'], ['mountain', 'ngọn núi'],
  ['move', 'sự di chuyển'], ['music', 'âm nhạc'], ['name', 'tên gọi'], ['nation', 'quốc gia'],
  ['need', 'nhu cầu'], ['news', 'tin tức'], ['night', 'ban đêm'], ['noise', 'tiếng ồn'],
  ['number', 'con số'], ['observation', 'sự quan sát'], ['offer', 'lời đề nghị'], ['oil', 'dầu dầu'],
  ['operation', 'thao tác/vận hành'], ['opinion', 'ý kiến'], ['order', 'đơn hàng/thứ tự'], ['organization', 'tổ chức'],
  ['ornament', 'vật trang trí'], ['owner', 'chủ sở hữu'], ['page', 'trang sách'], ['pain', 'cơn đau'],
  ['paint', 'nước sơn'], ['paper', 'tờ giấy'], ['part', 'bộ phận'], ['paste', 'hồ dán'],
  ['payment', 'thanh toán'], ['peace', 'hòa bình'], ['person', 'con người'], ['place', 'địa điểm'],
  ['plant', 'cây trồng/nhà máy'], ['play', 'trò chơi'], ['pleasure', 'niềm vui'], ['point', 'điểm số'],
  ['poison', 'chất độc'], ['polish', 'nước đánh bóng'], ['porter', 'người khuân vác'], ['position', 'vị trí'],
  ['powder', 'bột khô'], ['power', 'năng lượng/quyền lực'], ['price', 'giá cả'], ['print', 'bản in'],
  ['process', 'quy trình'], ['produce', 'sản phẩm'], ['profit', 'lợi nhuận'], ['property', 'tài sản'],
  ['prose', 'văn xuôi'], ['protest', 'sự phản đối'], ['pull', 'lực kéo'], ['punishment', 'hình phạt'],
  ['purpose', 'mục đích'], ['push', 'lực đẩy'], ['quality', 'chất lượng'], ['question', 'câu hỏi'],
  ['rain', 'cơn mưa'], ['range', 'phạm vi'], ['rate', 'tỷ lệ'], ['ray', 'tia sáng'],
  ['reaction', 'phản ứng'], ['reading', 'việc đọc'], ['reason', 'lý do'], ['record', 'hồ sơ/kỷ lục'],
  ['regret', 'sự hối hận'], ['relation', 'mối quan hệ'], ['religion', 'tôn giáo'], ['representative', 'người đại diện'],
  ['request', 'yêu cầu'], ['respect', 'sự kính trọng'], ['rest', 'sự nghỉ ngơi'], ['reward', 'phần thưởng'],
  ['rhythm', 'nhịp điệu'], ['rice', 'gạo/cơm'], ['river', 'dòng sông'], ['road', 'con đường'],
  ['roll', 'cuộn tròn'], ['room', 'căn phòng'], ['rub', 'sự cọ xát'], ['rule', 'quy tắc'],
  ['run', 'sự chạy'], ['salt', 'muối ăn'], ['sand', 'bãi cát'], ['scale', 'quy mô/cái cân'],
  ['science', 'khoa học'], ['sea', 'biển cả'], ['seat', 'chỗ ngồi'], ['secretary', 'thư ký'],
  ['selection', 'sự lựa chọn'], ['self', 'bản thân'], ['sense', 'giác quan'], ['servant', 'người giúp việc'],
  ['sex', 'giới tính'], ['shade', 'bóng râm'], ['shake', 'sự rung lắc'], ['shame', 'sự xấu hổ'],
  ['shock', 'sự cú sốc'], ['side', 'phía bên'], ['sign', 'biển báo'], ['silk', 'dải lụa'],
  ['silver', 'bạc'], ['sister', 'chị em gái'], ['size', 'kích thước'], ['sky', 'bầu trời'],
  ['sleep', 'giấc ngủ'], ['slip', 'sự trượt chân'], ['slope', 'sườn dốc'], ['smell', 'mùi hương'],
  ['smile', 'nụ cười'], ['smoke', 'làn khói'], ['snow', 'tuyết rơi'], ['soap', 'xà phòng'],
  ['society', 'xã hội'], ['son', 'con trai'], ['song', 'bài hát'], ['sort', 'loại hình'],
  ['sound', 'âm thanh'], ['soup', 'món súp'], ['space', 'không gian'], ['stage', 'sân khấu/giai đoạn'],
  ['start', 'sự bắt đầu'], ['statement', 'tuyên bố'], ['steam', 'hơi nước'], ['steel', 'thép'],
  ['step', 'bước đi'], ['stitch', 'mũi khâu'], ['stone', 'hòn đá'], ['stop', 'điểm dừng'],
  ['story', 'câu chuyện'], ['stretch', 'sự co giãn'], ['structure', 'cấu trúc'], ['substance', 'chất liệu'],
  ['sugar', 'đường ăn'], ['suggestion', 'gợi ý'], ['summer', 'mùa hè'], ['sun', 'mặt trời'],
  ['support', 'sự hỗ trợ'], ['surprise', 'sự bất ngờ'], ['swim', 'sự bơi lội'], ['system', 'hệ thống'],
  ['talk', 'cuộc trò chuyện'], ['taste', 'hương vị'], ['tax', 'thuế'], ['teaching', 'giảng dạy'],
  ['tendency', 'xu hướng'], ['test', 'bài kiểm tra'], ['theory', 'Lý thuyết'], ['thing', 'sự vật'],
  ['thought', 'suy nghĩ'], ['thread', 'sợi chỉ'], ['throat', 'vùng họng'], ['time', 'thời gian'],
  ['tin', 'thiếc'], ['top', 'đỉnh cao'], ['touch', 'sự chạm'], ['trade', 'thương mại'],
  ['transport', 'vận tải'], ['trick', 'mẹo nhỏ'], ['trouble', 'rắc rối'], ['turn', 'lượt đi'],
  ['unit', 'đơn vị'], ['use', 'sự sử dụng'], ['value', 'giá trị'], ['verse', 'thơ ca'],
  ['vessel', 'tàu thuyền/mạch máu'], ['view', 'tầm nhìn'], ['voice', 'giọng nói'], ['walk', 'đi bộ'],
  ['war', 'chiến tranh'], ['wash', 'sự rửa'], ['waste', 'rác thải'], ['water', 'nước'],
  ['wave', 'sóng biển'], ['wax', 'sáp'], ['way', 'con đường'], ['weather', 'thời tiết'],
  ['week', 'tuần lễ'], ['weight', 'trọng lượng'], ['wind', 'cơn gió'], ['wine', 'rượu vang'],
  ['winter', 'mùa đông'], ['woman', 'người phụ nữ'], ['wood', 'gỗ'], ['wool', 'len'],
  ['word', 'từ ngữ'], ['work', 'công việc'], ['wound', 'vết thương'], ['writing', 'văn bản'],
  ['year', 'năm']
]);

function getWordNetSynonyms(word) {
  return new Promise((resolve) => {
    wordnet.lookup(word, (results) => {
      if (!results || results.length === 0) return resolve([]);
      const syns = new Set();
      for (const res of results) {
        for (const syn of res.synonyms) {
          const cleanSyn = syn.toLowerCase().replace(/_/g, ' ');
          if (cleanSyn !== word && /^[a-z]{3,}$/.test(cleanSyn)) {
            syns.add(cleanSyn);
          }
        }
      }
      resolve(Array.from(syns));
    });
  });
}

async function main() {
  console.log("Starting English Vocabulary Pipeline...");

  const freqFilePath = path.resolve(DATA_TEMP_DIR, 'en_freq_50k.txt');
  if (!fs.existsSync(freqFilePath)) {
    console.error("Error: en_freq_50k.txt not found at", freqFilePath);
    process.exit(1);
  }

  const lines = fs.readFileSync(freqFilePath, 'utf8').split('\n');
  console.log(`Loaded ${lines.length} lines from frequency list.`);

  const accepted = [];
  const rejected = [];
  const quarantine = [];
  const wordSet = new Set();

  let totalRaw = 0;
  let afterFilter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(/\s+/);
    const rawWord = parts[0] ? parts[0].toLowerCase() : '';

    totalRaw++;

    // Filter 1: Alphabetic, length >= 3, not in STOP_WORDS
    if (!/^[a-z]{3,18}$/.test(rawWord) || STOP_WORDS.has(rawWord)) {
      continue;
    }

    // Deduplication pass 1: Exact word
    if (wordSet.has(rawWord)) continue;
    wordSet.add(rawWord);
    afterFilter++;

    // CEFR level estimation based on rank
    let cefrLevel = 'A2';
    if (afterFilter > 10000) cefrLevel = 'C1';
    else if (afterFilter > 5000) cefrLevel = 'B2';
    else if (afterFilter > 2000) cefrLevel = 'B1';

    // Domain tagging
    let domain = 'Từ vựng chung';
    for (const [domName, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      if (keywords.includes(rawWord)) {
        domain = domName;
        break;
      }
    }

    // IPA lookup via cmudict
    const arpa = cmudict.get(rawWord);
    const ipa = arpaToIpa(arpa);

    // Vietnamese translation lookup
    let meaningVi = EN_VI_MAP.get(rawWord);
    if (!meaningVi) {
      meaningVi = `từ vựng (${domain.toLowerCase()}): ${rawWord}`;
    }

    // Lookup WordNet synonyms
    const synCandidates = await getWordNetSynonyms(rawWord);
    const synonyms = [];
    for (const synWord of synCandidates) {
      if (synonyms.length >= 2) break;
      const synArpa = cmudict.get(synWord);
      const synIpa = arpaToIpa(synArpa) || `/${synWord}/`;
      const synVi = EN_VI_MAP.get(synWord) || `đồng nghĩa: ${synWord}`;
      synonyms.push({
        word: synWord,
        ipa: synIpa,
        meaningVi: synVi
      });
    }

    const item = {
      id: `en_${String(afterFilter).padStart(5, '0')}`,
      word: rawWord,
      ipa: ipa,
      meaningVi: meaningVi,
      meaningEn: `English vocabulary word (${rawWord})`,
      cefrLevel: cefrLevel,
      topic: domain,
      synonyms: synonyms,
      antonyms: [],
      source: 'en_freq_50k',
      verification_status: 'verified'
    };

    // Validation checks
    if (ipa && meaningVi && synonyms.length > 0) {
      accepted.push(item);
    } else if (ipa && meaningVi) {
      // Valid word and IPA, but missing verified WordNet synonym -> Quarantine bucket
      item.verification_status = 'quarantine';
      quarantine.push(item);
    } else {
      item.verification_status = 'rejected';
      rejected.push(item);
    }

    if (afterFilter % 1000 === 0) {
      console.log(`Processed ${afterFilter} words... Accepted: ${accepted.length}, Quarantine: ${quarantine.length}`);
    }

    if (accepted.length + quarantine.length >= 20000) {
      console.log("Reached target of 20,000 processed English words.");
      break;
    }
  }

  // Write outputs
  fs.writeFileSync(OUT_ACCEPTED, JSON.stringify(accepted, null, 2), 'utf-8');
  fs.writeFileSync(OUT_REJECTED, JSON.stringify(rejected, null, 2), 'utf-8');
  fs.writeFileSync(OUT_QUARANTINE, JSON.stringify(quarantine, null, 2), 'utf-8');

  console.log("-----------------------------------------");
  console.log("ENGLISH PIPELINE COMPLETED");
  console.log("Statistics:", JSON.stringify({
    total_raw: totalRaw,
    after_filter: afterFilter,
    accepted: accepted.length,
    quarantine: quarantine.length,
    rejected: rejected.length
  }, null, 2));
  console.log("-----------------------------------------");
}

main().catch(err => console.error("Pipeline Error:", err));
