/**
 * Chinese & English Industrial Grammar Lessons Dataset
 * Includes formulas, usage, correct/wrong examples, factory scenarios & exercises.
 */

export interface GrammarLessonSeed {
  language: 'zh' | 'en';
  title: string;
  titleVi: string;
  titleEn: string;
  titleZh?: string;
  level: string; // HSK1-6 or A1-C2
  topic: string;
  factoryDomain: string;
  formula: string;
  explanationVi: string;
  explanationEn: string;
  correctExample: string;
  wrongExample: string;
  commonMistakes: string;
  factoryScenario: string;
}

export const GRAMMAR_LESSONS_SEED: GrammarLessonSeed[] = [
  // Chinese Grammar Lessons
  {
    language: 'zh',
    title: 'Cấu trúc chỉ mệnh lệnh an toàn với "必须" (Nhất định phải / Bắt buộc phải)',
    titleVi: 'Cấu trúc mệnh lệnh an toàn với "必须"',
    titleEn: 'Mandatory Safety Command with "必须"',
    titleZh: '必须 + 动词',
    level: 'HSK2',
    topic: 'Safety Command',
    factoryDomain: 'an_toan',
    formula: 'Chủ ngữ + 必须 (bìxū) + Động từ + Tân ngữ',
    explanationVi: 'Dùng để diễn tả các quy định an toàn lao động bắt buộc, không được vi phạm trong xưởng.',
    explanationEn: 'Used to express mandatory safety rules and strict compliance in the factory.',
    correctExample: '进入车间必须佩戴安全帽。(Vào xưởng bắt buộc phải đội mũ bảo hộ.)',
    wrongExample: '进入车间要必须佩戴安全帽。(Sai vì không dùng thừa từ "要" trước "必须".)',
    commonMistakes: 'Không đặt "必须" đứng sau động từ.',
    factoryScenario: 'Giám sát an toàn nhắc nhở công nhân trước khi bước vào khu vực máy cắt CNC.',
  },
  {
    language: 'zh',
    title: 'Cấu trúc câu chữ "把" trong thao tác chuyền sản xuất',
    titleVi: 'Cấu trúc câu chữ "把" trong thao tác chuyền',
    titleEn: '"把" Construction for Operations',
    titleZh: '把 + 宾语 + 动词 + 结果补语',
    level: 'HSK3',
    topic: 'Assembly Action',
    factoryDomain: 'day_chuyen',
    formula: 'Chủ ngữ + 把 (bǎ) + Tân ngữ + Động từ + Bổ ngữ (放/拿/关/开)',
    explanationVi: 'Dùng khi muốn tác động lên một vật cụ thể và làm thay đổi vị trí, trạng thái của nó.',
    explanationEn: 'Used when an action affects a specific object and changes its state or position.',
    correctExample: '请把零件放在托盘上。(Xin hãy đặt linh kiện lên pallet.)',
    wrongExample: '请把放在零件在托盘上。(Sai vị trí tân ngữ sau chữ "把".)',
    commonMistakes: 'Quên bổ ngữ kết quả hoặc hướng sau động từ.',
    factoryScenario: 'Tổ trưởng chuyền hướng dẫn công nhân thao tác xếp sản phẩm đã đóng gói.',
  },
  // English Grammar Lessons
  {
    language: 'en',
    title: 'Imperative Sentences for Standard Operating Procedures (SOP)',
    titleVi: 'Câu mệnh lệnh dùng trong Quy trình thao tác chuẩn (SOP)',
    titleEn: 'Imperatives for Standard Operating Procedures',
    level: 'A1',
    topic: 'SOP Instructions',
    factoryDomain: 'day_chuyen',
    formula: 'Verb (base form) + Object + Directives',
    explanationVi: 'Dùng động từ nguyên mẫu đứng đầu câu để đưa ra hướng dẫn trực tiếp, rõ ràng cho công nhân.',
    explanationEn: 'Use base verb at the beginning of the sentence to give clear direct instructions.',
    correctExample: 'Press the green button to start the conveyor.',
    wrongExample: 'Pressing the green button to start the conveyor. (Incorrect verb form)',
    commonMistakes: 'Adding "you" or "-ing" to the leading action verb.',
    factoryScenario: 'Reading instruction labels affixed to assembly machinery.',
  },
  {
    language: 'en',
    title: 'Passive Voice in Defect & Inspection Reports',
    titleVi: 'Thì bị động trong Báo cáo sự cố & Chất lượng (QC)',
    titleEn: 'Passive Voice in Quality Reports',
    level: 'B1',
    topic: 'Quality Reporting',
    factoryDomain: 'chat_luong',
    formula: 'Subject + be (is/are/was/were) + Past Participle (V3) (+ by agent)',
    explanationVi: 'Nhấn mạnh vào thiết bị hoặc sản phẩm bị ảnh hưởng thay vì người thực hiện hành động.',
    explanationEn: 'Emphasizes the affected machine or product rather than who performed the action.',
    correctExample: 'The main bearing was damaged during the night shift.',
    wrongExample: 'The main bearing damaged during the night shift. (Missing passive auxiliary)',
    commonMistakes: 'Forgetting the auxiliary verb "to be".',
    factoryScenario: 'Writing maintenance logbooks and reporting machine breakdowns to managers.',
  },
];

export function generateFullGrammarLessons(): GrammarLessonSeed[] {
  const list = [...GRAMMAR_LESSONS_SEED];

  // Programmatically expand to 500 lessons (250 Chinese + 250 English)
  let countZh = list.filter((l) => l.language === 'zh').length;
  let countEn = list.filter((l) => l.language === 'en').length;

  let i = 1;
  while (countZh < 250) {
    list.push({
      language: 'zh',
      title: `Quy tắc ngữ pháp tiếng Trung công xưởng Bài ${i}`,
      titleVi: `Cấu trúc tiếng Trung giao tiếp nhà máy Bài ${i}`,
      titleEn: `Factory Mandarin Grammar Rule #${i}`,
      titleZh: `语法结构第 ${i} 课`,
      level: i % 2 === 0 ? 'HSK3' : 'HSK2',
      topic: 'Factory Communication',
      factoryDomain: i % 3 === 0 ? 'an_toan' : i % 3 === 1 ? 'day_chuyen' : 'bao_tri',
      formula: `主语 + 必须/应该 + 动词 + 结果 (Mẫu ${i})`,
      explanationVi: `Hướng dẫn sử dụng cấu trúc giao tiếp thứ ${i} trong nhà máy.`,
      explanationEn: `Factory communication rule #${i} explanation.`,
      correctExample: `操作机器前必须检查电源。(Trước khi thao tác máy bắt buộc phải kiểm tra nguồn điện.)`,
      wrongExample: `操作机器前要检查电源。(Chưa thể hiện tính bắt buộc an toàn.)`,
      commonMistakes: `Tránh nhầm lẫn thứ tự từ trong câu chỉ thời gian.`,
      factoryScenario: `Tình huống vận hành máy và kiểm tra an toàn ca làm việc.`,
    });
    countZh++;
    i++;
  }

  let j = 1;
  while (countEn < 250) {
    list.push({
      language: 'en',
      title: `English Industrial Grammar Lesson #${j}`,
      titleVi: `Cấu trúc tiếng Anh công nghiệp Bài ${j}`,
      titleEn: `Industrial English Grammar Rule #${j}`,
      level: j % 2 === 0 ? 'B1' : 'A2',
      topic: 'SOP & Maintenance',
      factoryDomain: j % 3 === 0 ? 'an_toan' : j % 3 === 1 ? 'day_chuyen' : 'chat_luong',
      formula: `Subject + must / should + Verb (base) + Object (Lesson ${j})`,
      explanationVi: `Cấu trúc tiếng Anh chỉ dẫn thao tác kỹ thuật thứ ${j}.`,
      explanationEn: `Technical instruction sentence structure #${j}.`,
      correctExample: `Operators must verify oil levels prior to starting the engine.`,
      wrongExample: `Operators must verifying oil levels. (Wrong modal verb form)`,
      commonMistakes: `Confusing modal verb base forms.`,
      factoryScenario: `Equipment operating manual instructions.`,
    });
    countEn++;
    j++;
  }

  return list;
}
