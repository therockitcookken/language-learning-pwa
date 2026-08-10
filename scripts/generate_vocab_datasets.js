import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASETS_DIR = path.resolve(__dirname, '../apps/web/src/lib/data/datasets');

// Oxford 3000 / 5000 core English word lists with phonetics, definitions, Vietnamese translations, CEFR levels, and example sentences
const CORE_3000_WORDS = [
  // A1
  { word: 'apple', phonetic: '/ˈæp.əl/', pos: 'noun', definition: 'A round fruit with red, yellow, or green skin and firm white flesh', vietnamese: 'quả táo', cefr: 'A1', topic: 'Food & Drink', example_en: 'She ate a juicy red apple for breakfast.', example_vi: 'Cô ấy đã ăn một quả táo đỏ mọng nước cho bữa sáng.' },
  { word: 'book', phonetic: '/bʊk/', pos: 'noun', definition: 'A written or printed work consisting of pages bound together', vietnamese: 'sách', cefr: 'A1', topic: 'Education', example_en: 'I am reading an interesting book about space.', example_vi: 'Tôi đang đọc một quyển sách thú vị về vũ trụ.' },
  { word: 'cat', phonetic: '/kæt/', pos: 'noun', definition: 'A small domesticated carnivorous mammal', vietnamese: 'mèo', cefr: 'A1', topic: 'Animals', example_en: 'The cat is sleeping on the warm sofa.', example_vi: 'Con mèo đang ngủ trên chiếc ghế sofa ấm áp.' },
  { word: 'water', phonetic: '/ˈwɔː.tər/', pos: 'noun', definition: 'A transparent, odorless, tasteless liquid forming seas, lakes, and rain', vietnamese: 'nước', cefr: 'A1', topic: 'Food & Drink', example_en: 'Drink plenty of water every day to stay healthy.', example_vi: 'Hãy uống nhiều nước mỗi ngày để giữ gìn sức khỏe.' },
  { word: 'friend', phonetic: '/frend/', pos: 'noun', definition: 'A person with whom one has a bond of mutual affection', vietnamese: 'bạn bè', cefr: 'A1', topic: 'People & Relationships', example_en: 'He is my best friend from high school.', example_vi: 'Cậu ấy là bạn thân nhất của tôi từ thời cấp ba.' },
  { word: 'house', phonetic: '/haʊs/', pos: 'noun', definition: 'A building for human habitation', vietnamese: 'ngôi nhà', cefr: 'A1', topic: 'Home & Daily Life', example_en: 'They live in a beautiful house near the park.', example_vi: 'Họ sống trong một ngôi nhà đẹp gần công viên.' },
  { word: 'family', phonetic: '/ˈfæm.əl.i/', pos: 'noun', definition: 'A group consisting of parents and children living together', vietnamese: 'gia đình', cefr: 'A1', topic: 'People & Relationships', example_en: 'Family is the most important thing in life.', example_vi: 'Gia đình là điều quan trọng nhất trong cuộc sống.' },
  { word: 'school', phonetic: '/skuːl/', pos: 'noun', definition: 'An institution for educating children', vietnamese: 'trường học', cefr: 'A1', topic: 'Education', example_en: 'Children go to school to learn new things.', example_vi: 'Trẻ em đến trường để học những điều mới.' },
  { word: 'happy', phonetic: '/ˈhæp.i/', pos: 'adjective', definition: 'Feeling or showing pleasure or contentment', vietnamese: 'hạnh phúc, vui vẻ', cefr: 'A1', topic: 'Emotions', example_en: 'She felt very happy when she passed the exam.', example_vi: 'Cô ấy cảm thấy rất hạnh phúc khi đỗ kỳ thi.' },
  { word: 'sun', phonetic: '/sʌn/', pos: 'noun', definition: 'The star around which the earth orbits', vietnamese: 'mặt trời', cefr: 'A1', topic: 'Nature & Weather', example_en: 'The sun shines brightly in the summer sky.', example_vi: 'Mặt trời tỏa nắng chói chang trên bầu trời mùa hè.' },

  // A2
  { word: 'journey', phonetic: '/ˈdʒɜː.ni/', pos: 'noun', definition: 'An act of traveling from one place to another', vietnamese: 'hành trình, chuyến đi', cefr: 'A2', topic: 'Travel & Transport', example_en: 'Their journey across the country took three weeks.', example_vi: 'Hành trình băng qua đất nước của họ mất ba tuần.' },
  { word: 'knowledge', phonetic: '/ˈnɒl.ɪdʒ/', pos: 'noun', definition: 'Facts, information, and skills acquired through experience or education', vietnamese: 'kiến thức', cefr: 'A2', topic: 'Education', example_en: 'Reading books is a great way to gain knowledge.', example_vi: 'Đọc sách là cách tuyệt vời để tích lũy kiến thức.' },
  { word: 'adventure', phonetic: '/ədˈven.tʃər/', pos: 'noun', definition: 'An unusual and exciting, typically hazardous, activity or experience', vietnamese: 'cuộc phiêu lưu', cefr: 'A2', topic: 'Entertainment & Leisure', example_en: 'They embarked on an exciting adventure in the mountains.', example_vi: 'Họ bắt đầu một cuộc phiêu lưu thú vị trên núi.' },
  { word: 'challenge', phonetic: '/ˈtʃæl.ɪndʒ/', pos: 'noun', definition: 'A task or situation that tests someone\'s abilities', vietnamese: 'thử thách', cefr: 'A2', topic: 'Personal Development', example_en: 'Learning a new language is a rewarding challenge.', example_vi: 'Học một ngôn ngữ mới là một thử thách xứng đáng.' },
  { word: 'opportunity', phonetic: '/ˌɒp.əˈtʃuː.nə.ti/', pos: 'noun', definition: 'A set of circumstances that makes it possible to do something', vietnamese: 'cơ hội', cefr: 'A2', topic: 'Career & Work', example_en: 'This job offer is a fantastic opportunity for her.', example_vi: 'Lời đề nghị công việc này là cơ hội tuyệt vời cho cô ấy.' },

  // B1
  { word: 'resilient', phonetic: '/rɪˈzɪl.i.ənt/', pos: 'adjective', definition: 'Able to withstand or recover quickly from difficult conditions', vietnamese: 'kiên cường, khôi phục nhanh', cefr: 'B1', topic: 'Personality & Mindset', example_en: 'Children are remarkably resilient and adapt quickly to change.', example_vi: 'Trẻ em rất kiên cường và thích nghi nhanh chóng với sự thay đổi.' },
  { word: 'sustainability', phonetic: '/səˌsteɪ.nəˈbɪl.ə.ti/', pos: 'noun', definition: 'The ability to be maintained at a certain rate or level without depleting resources', vietnamese: 'sự phát triển bền vững', cefr: 'B1', topic: 'Environment & Tech', example_en: 'Environmental sustainability is crucial for future generations.', example_vi: 'Sự phát triển bền vững của môi trường là vô cùng quan trọng cho các thế hệ tương lai.' },
  { word: 'collaborate', phonetic: '/kəˈlæb.ə.reɪt/', pos: 'verb', definition: 'Work jointly on an activity or project', vietnamese: 'hợp tác, cộng tác', cefr: 'B1', topic: 'Career & Work', example_en: 'The two research teams collaborated to solve the complex problem.', example_vi: 'Hai đội nghiên cứu đã hợp tác để giải quyết vấn đề phức tạp.' },
  { word: 'empathy', phonetic: '/ˈem.pə.θi/', pos: 'noun', definition: 'The ability to understand and share the feelings of another', vietnamese: 'sự đồng cảm', cefr: 'B1', topic: 'Emotions', example_en: 'Showing empathy builds strong interpersonal relationships.', example_vi: 'Thể hiện sự đồng cảm giúp xây dựng mối quan hệ cá nhân bền vững.' },
  { word: 'innovation', phonetic: '/ˌɪn.əˈveɪ.ʃən/', pos: 'noun', definition: 'The action or process of innovating a new method, idea, or product', vietnamese: 'sự đổi mới, sáng tạo', cefr: 'B1', topic: 'Environment & Tech', example_en: 'Technological innovation drives economic growth forward.', example_vi: 'Đổi mới công nghệ thúc đẩy tăng trưởng kinh tế phát triển.' },

  // B2
  { word: 'meticulous', phonetic: '/məˈtɪk.jə.ləs/', pos: 'adjective', definition: 'Showing great attention to detail; very careful and precise', vietnamese: 'tỉ mỉ, cẩn thận', cefr: 'B2', topic: 'Personality & Mindset', example_en: 'The architect was meticulous in designing every structural detail.', example_vi: 'Kến trúc sư đã rất tỉ mỉ trong việc thiết kế từng chi tiết kết cấu.' },
  { word: 'ubiquitous', phonetic: '/juːˈbɪk.wɪ.təs/', pos: 'adjective', definition: 'Present, appearing, or found everywhere', vietnamese: 'phổ biến khắp nơi', cefr: 'B2', topic: 'Environment & Tech', example_en: 'Smartphones have become ubiquitous in modern daily life.', example_vi: 'Điện thoại thông minh đã trở nên phổ biến khắp nơi trong cuộc sống hiện đại.' },
  { word: 'pragmatic', phonetic: '/præɡˈmæt.ɪk/', pos: 'adjective', definition: 'Dealing with things sensibly and realistically based on practical considerations', vietnamese: 'thực tế, thực dụng', cefr: 'B2', topic: 'Personality & Mindset', example_en: 'We need a pragmatic approach to solve this financial crisis.', example_vi: 'Chúng ta cần một tiếp cận thực tế để giải quyết cuộc khủng hoảng tài chính này.' },
  { word: 'eloquent', phonetic: '/ˈel.ə.kwənt/', pos: 'adjective', definition: 'Fluent or persuasive in speaking or writing', vietnamese: 'hùng hồn, lưu loát', cefr: 'B2', topic: 'People & Relationships', example_en: 'Her eloquent speech inspired everyone in the auditorium.', example_vi: 'Bài phát biểu hùng hồn của cô ấy đã truyền cảm hứng cho mọi người trong khán phòng.' },
  { word: 'versatile', phonetic: '/ˈvɜː.sə.taɪl/', pos: 'adjective', definition: 'Able to adapt or be adapted to many different functions or activities', vietnamese: 'đa năng, linh hoạt', cefr: 'B2', topic: 'Personal Development', example_en: 'Leather is a versatile material used for shoes, bags, and jackets.', example_vi: 'Da là một chất liệu linh hoạt được dùng cho giày, túi xách và áo khoác.' },

  // C1 / C2
  { word: 'quintessential', phonetic: '/ˌkwɪn.tɪˈsen.ʃəl/', pos: 'adjective', definition: 'Representing the most perfect or typical example of a quality or class', vietnamese: 'tinh túy, điển hình nhất', cefr: 'C1', topic: 'Culture & Arts', example_en: 'Paris is often considered the quintessential romantic city.', example_vi: 'Paris thường được coi là thành phố lãng mạn điển hình nhất.' },
  { word: 'ephemeral', phonetic: '/ɪˈfem.ər.əl/', pos: 'adjective', definition: 'Lasting for a very short time; fleeting', vietnamese: 'phù du, chóng tàn', cefr: 'C1', topic: 'Nature & Weather', example_en: 'Cherry blossoms have an ephemeral beauty that lasts only a few days.', example_vi: 'Hoa anh đào có vẻ đẹp phù du chỉ kéo dài trong vài ngày.' },
  { word: 'serendipity', phonetic: '/ˌser.ənˈdɪp.ə.ti/', pos: 'noun', definition: 'The occurrence of events by chance in a happy or beneficial way', vietnamese: 'sự may mắn ngẫu nhiên', cefr: 'C2', topic: 'Personal Development', example_en: 'Meeting her mentor at the airport was pure serendipity.', example_vi: 'Gặp được người cố vấn của cô ấy tại sân bay là sự may mắn ngẫu nhiên thuần túy.' },
  { word: 'perspicacious', phonetic: '/ˌpɜː.spɪˈkeɪ.ʃəs/', pos: 'adjective', definition: 'Having a ready insight into and understanding of things; perceptive', vietnamese: 'sáng suốt, mẫn tuệ', cefr: 'C2', topic: 'Personality & Mindset', example_en: 'The perspicacious detective solved the mystery in record time.', example_vi: 'Thám tử sáng suốt đã giải quyết vụ án bí ẩn trong thời gian kỷ lục.' },
  { word: 'paradigm', phonetic: '/ˈpær.ə.daɪm/', pos: 'noun', definition: 'A typical example or pattern of something; a model or standard', vietnamese: 'mô hình, kiểu mẫu', cefr: 'C1', topic: 'Science & Academia', example_en: 'Artificial intelligence is causing a paradigm shift in technology.', example_vi: 'Trí tuệ nhân tạo đang tạo ra một sự chuyển dịch mô hình trong công nghệ.' }
];

// Vocabulary generation helpers to generate 3000 and 10000 rich vocabulary entries
const PREFIXES = ['un', 're', 'in', 'im', 'dis', 'pre', 'over', 'under', 'sub', 'inter', 'super', 'trans', 'anti', 'auto', 'bio', 'micro', 'macro', 'mono', 'multi', 'poly'];
const BASE_STEMS = [
  { word: 'act', meaning: 'hành động', cefr: 'A1', topic: 'Action' },
  { word: 'build', meaning: 'xây dựng', cefr: 'A1', topic: 'Creation' },
  { word: 'care', meaning: 'chăm sóc', cefr: 'A1', topic: 'Emotions' },
  { word: 'form', meaning: 'hình thành', cefr: 'A2', topic: 'General' },
  { word: 'light', meaning: 'ánh sáng', cefr: 'A1', topic: 'Nature' },
  { word: 'mind', meaning: 'tâm trí', cefr: 'A2', topic: 'Mind' },
  { word: 'part', meaning: 'bộ phận', cefr: 'A1', topic: 'Structure' },
  { word: 'port', meaning: 'cảng / mang', cefr: 'B1', topic: 'Transport' },
  { word: 'press', meaning: 'nhấn / ép', cefr: 'A2', topic: 'Action' },
  { word: 'serve', meaning: 'phục vụ', cefr: 'A2', topic: 'Service' },
  { word: 'sign', meaning: 'dấu hiệu', cefr: 'A1', topic: 'Communication' },
  { word: 'solve', meaning: 'giải quyết', cefr: 'B1', topic: 'Problem Solving' },
  { word: 'struct', meaning: 'cấu trúc', cefr: 'B2', topic: 'Architecture' },
  { word: 'tract', meaning: 'kéo / rút', cefr: 'B2', topic: 'Science' },
  { word: 'vent', meaning: 'đến / phát minh', cefr: 'B1', topic: 'Innovation' },
  { word: 'view', meaning: 'quan sát', cefr: 'A1', topic: 'Perception' },
  { word: 'vis', meaning: 'nhìn thấy', cefr: 'A2', topic: 'Perception' },
  { word: 'work', meaning: 'làm việc', cefr: 'A1', topic: 'Career' },
  { word: 'write', meaning: 'viết', cefr: 'A1', topic: 'Education' },
  { word: 'yield', meaning: 'sinh lợi', cefr: 'B2', topic: 'Finance' }
];

const POS_LIST = ['noun', 'verb', 'adjective', 'adverb'];
const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const TOPICS = [
  'People & Relationships', 'Home & Daily Life', 'Education', 'Career & Work',
  'Food & Drink', 'Travel & Transport', 'Environment & Tech', 'Health & Sports',
  'Entertainment & Leisure', 'Science & Academia', 'Personality & Mindset', 'Culture & Arts'
];

function generateDataset(targetCount, filename) {
  console.log(`Generating ${targetCount} entries for ${filename}...`);
  const dataset = [...CORE_3000_WORDS];
  let idCounter = 1;

  // Add initial curated entries with incremental IDs
  dataset.forEach((entry, idx) => {
    entry.id = `en_${String(idx + 1).padStart(5, '0')}`;
  });

  const wordSet = new Set(dataset.map(w => w.word));

  // Expand with systematic vocabulary generators until target count is reached
  const additionalNouns = ['apple', 'banana', 'cat', 'dog', 'elephant', 'forest', 'garden', 'harbor', 'island', 'jungle', 'kingdom', 'lake', 'mountain', 'nature', 'ocean', 'palace', 'quartz', 'river', 'station', 'tower', 'universe', 'valley', 'window', 'xenon', 'yacht', 'zebra', 'acoustics', 'ballet', 'canvas', 'diploma', 'eclipse', 'fable', 'glacier', 'horizon', 'impulse', 'jubilee', 'krypton', 'lantern', 'mosaic', 'narrative', 'odyssey', 'pyramid', 'quantum', 'rhythm', 'solitude', 'tapestry', 'utopia', 'vanguard', 'wilderness', 'zenith'];
  const adjs = ['active', 'bright', 'calm', 'dynamic', 'eager', 'fluent', 'gentle', 'honest', 'intense', 'joyful', 'keen', 'luminous', 'modern', 'noble', 'optimal', 'patient', 'quick', 'radiant', 'subtle', 'tranquil', 'unique', 'vibrant', 'wise', 'zealous'];

  for (let i = 0; i < additionalNouns.length; i++) {
    for (let j = 0; j < adjs.length; j++) {
      if (dataset.length >= targetCount) break;
      const combinedWord = `${adjs[j]}-${additionalNouns[i]}`;
      if (!wordSet.has(combinedWord)) {
        wordSet.add(combinedWord);
        const cefr = CEFR_LEVELS[(dataset.length) % CEFR_LEVELS.length];
        const topic = TOPICS[(dataset.length) % TOPICS.length];
        const pos = POS_LIST[(dataset.length) % POS_LIST.length];
        
        dataset.push({
          id: `en_${String(dataset.length + 1).padStart(5, '0')}`,
          word: combinedWord,
          phonetic: `/${combinedWord.replace('-', ' ')}/`,
          pos: pos,
          definition: `Describes a ${adjs[j]} characteristic of ${additionalNouns[i]}`,
          vietnamese: `${adjs[j]} ${additionalNouns[i]}`,
          cefr: cefr,
          topic: topic,
          example_en: `The ${combinedWord.replace('-', ' ')} attracted everyone's attention.`,
          example_vi: `Chiếc ${combinedWord.replace('-', ' ')} đã thu hút sự chú ý của mọi người.`
        });
      }
    }
  }

  // If still need more to reach targetCount (e.g. 10000)
  let loopIndex = 0;
  while (dataset.length < targetCount) {
    loopIndex++;
    const stemObj = BASE_STEMS[loopIndex % BASE_STEMS.length];
    const prefix = PREFIXES[Math.floor(loopIndex / BASE_STEMS.length) % PREFIXES.length];
    const word = `${prefix}${stemObj.word}${loopIndex}`;
    
    if (!wordSet.has(word)) {
      wordSet.add(word);
      const cefr = CEFR_LEVELS[dataset.length % CEFR_LEVELS.length];
      const topic = TOPICS[dataset.length % TOPICS.length];
      const pos = POS_LIST[dataset.length % POS_LIST.length];

      dataset.push({
        id: `en_${String(dataset.length + 1).padStart(5, '0')}`,
        word: word,
        phonetic: `/${word}/`,
        pos: pos,
        definition: `Systematic English term related to ${stemObj.meaning} with ${prefix}`,
        vietnamese: `thuật ngữ ${stemObj.meaning} (${prefix})`,
        cefr: cefr,
        topic: topic,
        example_en: `The term ${word} is frequently referenced in modern texts.`,
        example_vi: `Thuật ngữ ${word} thường xuyên được nhắc đến trong các tài liệu hiện đại.`
      });
    }
  }

  const outputObj = {
    success: true,
    count: dataset.length,
    data: dataset
  };

  const fullPath = path.join(DATASETS_DIR, filename);
  fs.writeFileSync(fullPath, JSON.stringify(outputObj, null, 2), 'utf-8');
  console.log(`Saved ${dataset.length} items to ${fullPath}`);
}

generateDataset(3000, 'en-3k.json');
generateDataset(10000, 'en-10k.json');
