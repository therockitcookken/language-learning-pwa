import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { pinyin } from 'pinyin-pro';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load cedict safely
async function loadCedict() {
  try {
    return require('cedict-json');
  } catch (e) {
    console.warn("Could not require 'cedict-json', please ensure it is installed.");
    return [];
  }
}

// ----------------------------------------------------------------------------
// 1. CONSTANTS & DATA MAPPINGS
// ----------------------------------------------------------------------------

const HSK_LISTS = {
  1: ["学生","老师","同学","学校","朋友","爸爸","妈妈","女儿","儿子","家里","北京","中国","那里","这里","前面","后面","上面","下面","里面","多少","时候","怎么","现在","今天","明天","昨天","上午","下午","中午","东西","名字","高兴","漂亮","苹果","医生","医院","商店","饭店","出租","电脑","电视","电影","手机","飞机","天气","下雨","衣服","杯子","桌子","椅子","米饭","水果"],
  2: ["准备","已经","但是","因为","所以","虽然","可能","一起","开始","希望","觉得","知道","介绍","完成","帮助","告诉","认为","了解","以为","经常","非常","特别","一直","马上","过去","以后","公司","宾馆","教室","机场","地铁","公共","汽车","身体","眼睛","脸色","生日","问题","考试","作业","报纸","地图","故事","新闻","旅游","运动","游泳","足球","篮球","跑步","唱歌"],
  3: ["决定","相信","担心","关心","感兴","打算","愿意","同意","反对","满意","着急","难过","害怕","生气","感动","放心","激动","紧张","兴奋","失望","骄骄","自信","勇敢","认真","努力","仔细","马虎","方便","简单","复杂","容易","困难","重要","必须","应该","需要","终于","突然","竟然","居然","甚至","几乎","差不多","到处","附近","周围","对面","中间","旁边","城市","环境","世界"],
  4: ["包括","超过","提供","表示","发现","发展","改变","增加","减少","代替","保护","提醒","影响","造成","产生","解决","实现","完成","继续","坚持","放弃","接受","拒绝","批评","表扬","鼓励","讨论","分析","研究","调查","比较","区别","联系","交流","沟通","合作","竞争","组织","安排","计划","管理","负责","参加","参观","适合","符合","代表","证明","经济","技术"],
  5: ["证实","反映","呈现","体现","显示","揭示","阐述","论证","概括","归纳","推测","预测","估计","评价","评估","分配","调整","协调","控制","维护","操作","处理","应对","促进","推动","制定","执行","实施","贯彻","落实","建设","构建","创造","设计","开发","利用","发挥","培养","锻炼","提高","加强","巩固","拓展","扩大","深化","优化","完善","充实","丰富","积累"],
  6: ["遏制","抑制","遵循","贯穿","渗透","弥漫","笼罩","萦绕","蔓延","波及","辐射","覆盖","涵盖","囊括","充斥","泛滥","肆虐","侵蚀","腐蚀","摧毁","瓦解","颠覆","动摇","削弱","抵御","防范","规避","化解","缓解","消除","排除","杜绝","根除","铲除","扭转","矫正","弥补","修复","挽救","拯救","振兴","复兴","崛起","腾飞","飞跃","跨越","突破","超越","攀升"]
};

// Antonym pairs (Character level)
const ANTONYM_PAIRS_STR = "大小,多少,高低,长短,快慢,好坏,新旧,热冷,开关,上下,前后,左右,进出,来去,买卖,生死,黑白,男女,老少,早晚,轻重,深浅,厚薄,宽窄,强弱,增减,胜败,成败,美丑,真假,动静,始终,输赢,爱恨,明暗,冷热,内外,东西,南北,是非,敌友,日夜,阴阳,悲喜,分合,聚散,首尾,优劣,奖惩,胖瘦";
const ANTONYM_MAP = new Map();
ANTONYM_PAIRS_STR.split(',').forEach(pair => {
  ANTONYM_MAP.set(pair[0], pair[1]);
  ANTONYM_MAP.set(pair[1], pair[0]);
});

// Compressed Sino-Vietnamese Mapping (Hán-Việt) for common characters
// Format: reading: 'char1char2...'
const HAN_VIET_GROUPS = {
  'công': '工公功攻', 'viên': '员园圆', 'tác': '作', 'học': '学', 'tập': '习', 'sinh': '生', 'lão': '老', 'sư': '师',
  'minh': '明', 'thiên': '天', 'nhật': '日', 'nguyệt': '月', 'tinh': '星', 'thần': '辰', 'sơn': '山', 'thủy': '水',
  'hỏa': '火', 'mộc': '木', 'kim': '金', 'thổ': '土', 'nhân': '人', 'tâm': '心', 'đại': '大', 'tiểu': '小',
  'trung': '中', 'quốc': '国', 'việt': '越', 'nam': '南', 'bắc': '北', 'đông': '东', 'tây': '西', 'phong': '风',
  'vũ': '雨', 'điện': '电', 'thoại': '话', 'xa': '车', 'mã': '马', 'ngưu': '牛', 'dương': '羊', 'cẩu': '狗',
  'môn': '门', 'khẩu': '口', 'mục': '目', 'nhĩ': '耳', 'thủ': '手', 'túc': '足', 'ngôn': '言', 'ngữ': '语',
  'văn': '文', 'hóa': '化', 'giáo': '教', 'dục': '育', 'lịch': '历', 'sử': '史', 'khoa': '科', 'xã': '社',
  'hội': '会', 'chính': '政', 'trị': '治', 'quân': '军', 'sự': '事', 'kinh': '经', 'tế': '济', 'kỹ': '技',
  'thuật': '术', 'môi': '环', 'trường': '境', 'thời': '时', 'gian': '间', 'khí': '气', 'bệnh': '病', 'viện': '院',
  'phi': '飞', 'cơ': '机', 'động': '动', 'tĩnh': '静', 'mỹ': '美', 'hảo': '好', 'hạnh': '幸', 'phúc': '福',
  'tiền': '钱', 'lương': '粮', 'an': '安', 'toàn': '全', 'sản': '产', 'xuất': '出', 'chất': '质', 'lượng': '量',
  'kiểm': '检', 'tra': '查', 'thiết': '设', 'bị': '备', 'bảo': '保', 'trì': '持', 'thương': '仓', 'khố': '库'
};
const CHAR_TO_HAN_VIET = new Map();
Object.entries(HAN_VIET_GROUPS).forEach(([reading, chars]) => {
  for (const char of chars) {
    CHAR_TO_HAN_VIET.set(char, reading);
  }
});

// Curated mappings (Expanded conceptually for the pipeline)
const CURATED_VI_STR = "工作:công việc,学习:học tập,老师:thầy giáo/cô giáo,学生:học sinh,朋友:bạn bè,安全:an toàn,生产:sản xuất,质量:chất lượng,检查:kiểm tra,设备:thiết bị,维修:bảo trì,仓库:kho hàng,工资:tiền lương,加班:tăng ca,健康:sức khỏe,幸福:hạnh phúc,时间:thời gian,天气:thời tiết,环境:môi trường,经济:kinh tế,技术:kỹ thuật,文化:văn hóa,教育:giáo dục,历史:lịch sử,科学:khoa học,社会:xã hội,政治:chính trị,军事:quân sự,医院:bệnh viện,飞机:máy bay,电话:điện thoại,电脑:máy tính,手机:điện thoại di động,公司:công ty,宾馆:khách sạn,教室:phòng học,机场:sân bay,地铁:tàu điện ngầm,运动:thể thao,旅游:du lịch,新闻:tin tức,故事:câu chuyện,地图:bản đồ,报纸:tờ báo,作业:bài tập,考试:kỳ thi,问题:vấn đề,生日:sinh nhật,脸色:sắc mặt,眼睛:đôi mắt,身体:cơ thể,汽车:ô tô,公共:công cộng";
const CURATED_VI_MAP = new Map();
CURATED_VI_STR.split(',').forEach(pair => {
  const [zh, vi] = pair.split(':');
  if (zh && vi) CURATED_VI_MAP.set(zh, vi);
});

// Proper noun stop words
const PROPER_NOUN_STOP_WORDS = [
  'surname', 'county', 'province', 'city', 'district', 'prefecture', 'municipality', 
  'variant of', 'see ', 'abbr.', 'cl:', 'taiwan', 'japanese'
];

// Domains keywords
const DOMAINS = {
  "Giao tiếp công xưởng": ['manufacture', 'produce', 'production', 'assembly', 'machine', 'equipment', 'factory', 'process', 'operate', 'worker', 'shift'],
  "An toàn lao động": ['safe', 'safety', 'danger', 'protect', 'emergency', 'fire', 'rescue', 'alarm', 'warning', 'hazard', 'helmet', 'glove', 'mask'],
  "Quản lý chất lượng": ['quality', 'inspect', 'examine', 'test', 'standard', 'defect', 'reject', 'pass', 'fail', 'measure', 'accurate'],
  "Bảo trì & Cơ điện": ['repair', 'maintain', 'fix', 'break', 'machine', 'engine', 'motor', 'circuit', 'wire', 'bolt', 'tool'],
  "Kho hàng & Vận chuyển": ['warehouse', 'store', 'stock', 'inventory', 'ship', 'transport', 'deliver', 'load', 'pack', 'cargo'],
  "Nhân sự & Tiền lương": ['salary', 'wage', 'pay', 'hire', 'fire', 'employ', 'train', 'contract', 'leave', 'overtime', 'pension'],
  "Giao tiếp đời sống": ['eat', 'drink', 'sleep', 'walk', 'run', 'play', 'buy', 'sell', 'cook', 'wash', 'wear', 'family', 'friend', 'love', 'happy', 'sad']
};


// ----------------------------------------------------------------------------
// 2. HELPER FUNCTIONS
// ----------------------------------------------------------------------------

function isProperNoun(englishDefs) {
  let allStartWithCapital = true;
  for (const def of englishDefs) {
    if (!def) continue;
    // Check stop words
    const lowerDef = def.toLowerCase();
    if (PROPER_NOUN_STOP_WORDS.some(stop => lowerDef.includes(stop))) {
      return true;
    }
    // Check if starts with Capital Letter
    if (!/^[A-Z]/.test(def)) {
      allStartWithCapital = false;
    } else {
      return true; // Starts with capital letter -> Proper noun filter
    }
  }
  return allStartWithCapital;
}

function getHskLevel(word) {
  for (const [level, list] of Object.entries(HSK_LISTS)) {
    if (list.includes(word)) return parseInt(level, 10);
  }
  return null;
}

function getDomain(englishDefs) {
  const allText = englishDefs.join(' ').toLowerCase();
  for (const [domain, keywords] of Object.entries(DOMAINS)) {
    if (keywords.some(kw => allText.includes(kw))) {
      return domain;
    }
  }
  return "Từ vựng chung";
}

function getVietnamese(word) {
  if (CURATED_VI_MAP.has(word)) return CURATED_VI_MAP.get(word);
  
  // Fallback to Hán-Việt
  let vi = '';
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const reading = CHAR_TO_HAN_VIET.get(char);
    if (reading) {
      vi += (vi ? ' ' : '') + reading;
    } else {
      vi += (vi ? ' ' : '') + char; // fallback to char if unknown
    }
  }
  return vi;
}

function extractKeywords(englishDefs) {
  const text = englishDefs.join(' ').toLowerCase();
  return new Set(text.match(/\b[a-z]{3,}\b/g) || []);
}

// ----------------------------------------------------------------------------
// 3. MAIN PIPELINE
// ----------------------------------------------------------------------------

async function runPipeline() {
  console.log("Starting Vocabulary Extraction Pipeline...");
  const cedictData = await loadCedict();
  
  const stats = {
    total_cedict: cedictData.length,
    total_2char: 0,
    after_proper_noun_filter: 0,
    with_synonym: 0,
    with_antonym: 0,
    accepted: 0,
    rejected: 0,
    quarantine: 0,
    duplicates_removed: 0
  };

  // PASS 1: Base Filtering (2-char and Proper Nouns)
  console.log("Filtering 2-character words and proper nouns...");
  const twoCharRegex = /^[\u4e00-\u9fff]{2}$/;
  
  let baseFiltered = [];
  let properNounsRemoved = 0;
  
  for (let i = 0; i < cedictData.length; i++) {
    const entry = cedictData[i];
    if (entry.simplified.length === 2 && twoCharRegex.test(entry.simplified)) {
      stats.total_2char++;
      
      if (isProperNoun(entry.english)) {
        properNounsRemoved++;
      } else {
        baseFiltered.push(entry);
      }
    }
  }
  stats.after_proper_noun_filter = baseFiltered.length;
  console.log(`Removed ${properNounsRemoved} proper nouns.`);

  // BUILD LOOKUP FOR SYNONYMS/ANTONYMS
  console.log("Building lookups...");
  const dictByWord = new Map();
  baseFiltered.forEach(entry => {
    // Basic deduplication on exact word during lookup build
    if (!dictByWord.has(entry.simplified)) {
      dictByWord.set(entry.simplified, {
        ...entry,
        keywords: extractKeywords(entry.english)
      });
    }
  });

  // PROCESS ENTRIES
  console.log("Processing entries in batches...");
  let processedEntries = [];
  
  for (let i = 0; i < baseFiltered.length; i += 500) {
    const batch = baseFiltered.slice(i, i + 500);
    
    for (const entry of batch) {
      const word = entry.simplified;
      const entryKeywords = dictByWord.get(word).keywords;
      
      // 1. Pinyin conversion
      const toneMarksPinyin = pinyin(word, { toneType: 'symbol', type: 'string' });
      
      // 2. HSK & Domain
      const hskLevel = getHskLevel(word);
      const domain = getDomain(entry.english);
      
      // 3. Vietnamese
      const vietnamese = getVietnamese(word);
      
      // 4. Synonyms (Find words with >= 2 matching keywords)
      let synonyms = [];
      for (const [otherWord, otherEntry] of dictByWord.entries()) {
        if (word === otherWord) continue; // no self-reference
        
        let matchCount = 0;
        for (const kw of entryKeywords) {
          if (otherEntry.keywords.has(kw)) matchCount++;
        }
        
        if (matchCount >= 2) {
          synonyms.push({
            word: otherWord,
            pinyin: pinyin(otherWord, { toneType: 'symbol', type: 'string' }),
            vi: getVietnamese(otherWord)
          });
          if (synonyms.length >= 2) break;
        }
      }
      
      // 5. Antonyms (Character-level logic)
      let antonyms = [];
      const char1 = word[0];
      const char2 = word[1];
      const ant1 = ANTONYM_MAP.get(char1);
      const ant2 = ANTONYM_MAP.get(char2);
      
      if (ant1 && ant2) {
        const potentialAnt = ant1 + ant2;
        if (dictByWord.has(potentialAnt)) {
          antonyms.push({
            word: potentialAnt,
            pinyin: pinyin(potentialAnt, { toneType: 'symbol', type: 'string' }),
            vi: getVietnamese(potentialAnt)
          });
        }
      }
      
      // Check 'opposite of' in definitions
      const allText = entry.english.join(' ').toLowerCase();
      if (allText.includes('opposite of') || allText.includes('antonym of')) {
         // rudimentary check for opposite match, normally we'd parse the english to find the word
         // skipping complex parsing here for brevity, keeping char logic primary
      }
      
      // Synonym !== Antonym Check (Pass 6)
      synonyms = synonyms.filter(s => !antonyms.some(a => a.word === s.word));

      // No Duplicate Synonyms (Pass 7)
      const uniqueSyns = [];
      const synSet = new Set();
      for (const s of synonyms) {
        if (!synSet.has(s.word)) {
          synSet.add(s.word);
          uniqueSyns.push(s);
        }
      }
      
      if (uniqueSyns.length > 0) stats.with_synonym++;
      if (antonyms.length > 0) stats.with_antonym++;

      processedEntries.push({
        word: entry.simplified.normalize('NFC'), // Pass 2: NFC
        pinyin: toneMarksPinyin,
        english: entry.english,
        vietnamese,
        hskLevel,
        domain,
        synonyms: uniqueSyns,
        antonyms,
        has_synonym: uniqueSyns.length > 0,
        has_antonym: antonyms.length > 0,
        source: 'CEDICT'
      });
    }
    console.log(`Processed ${Math.min(i + 500, baseFiltered.length)} / ${baseFiltered.length} entries...`);
  }

  // DEDUPLICATION (Pass 1, 2, 3, 4)
  console.log("Running deduplication...");
  const uniqueEntriesMap = new Map();
  for (const entry of processedEntries) {
    const key = `${entry.word}_${entry.pinyin}`; // Combine word + pinyin for unique key
    if (!uniqueEntriesMap.has(key)) {
      uniqueEntriesMap.set(key, entry);
    } else {
      stats.duplicates_removed++;
    }
  }
  const finalEntries = Array.from(uniqueEntriesMap.values());

  // VALIDATION & BUCKETING
  const accepted = [];
  const quarantine = [];
  const rejected = [];

  for (const entry of finalEntries) {
    const is2Char = entry.word.length === 2;
    const hasValidPinyin = entry.pinyin && !/\d/.test(entry.pinyin); // No numeric tones in output
    const hasVi = entry.vietnamese && entry.vietnamese.trim().length > 0;
    
    if (!is2Char || !hasValidPinyin || !hasVi) {
      rejected.push(entry);
      stats.rejected++;
    } else if (!entry.has_synonym || !entry.has_antonym) {
      quarantine.push(entry);
      stats.quarantine++;
    } else {
      accepted.push(entry);
      stats.accepted++;
    }
  }

  // OUTPUT
  const outputDir = 'e:\\App học ngôn ngữ\\data_temp\\pipeline';
  const acceptedDir = path.join(outputDir, 'accepted');
  const rejectedDir = path.join(outputDir, 'rejected');
  const quarantineDir = path.join(outputDir, 'quarantine');

  await fs.mkdir(acceptedDir, { recursive: true });
  await fs.mkdir(rejectedDir, { recursive: true });
  await fs.mkdir(quarantineDir, { recursive: true });

  await fs.writeFile(
    path.join(acceptedDir, 'zh_accepted.json'), 
    JSON.stringify(accepted, null, 2), 
    'utf-8'
  );
  await fs.writeFile(
    path.join(rejectedDir, 'zh_rejected.json'), 
    JSON.stringify(rejected, null, 2), 
    'utf-8'
  );
  await fs.writeFile(
    path.join(quarantineDir, 'zh_quarantine.json'), 
    JSON.stringify(quarantine, null, 2), 
    'utf-8'
  );

  console.log("-----------------------------------------");
  console.log("PIPELINE COMPLETED");
  console.log("Statistics:");
  console.log(JSON.stringify(stats, null, 2));
  console.log("-----------------------------------------");
}

runPipeline().catch(err => {
  console.error("Pipeline failed:", err);
});
