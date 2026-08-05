export interface ComparisonSet {
  id: string;
  title: string;
  language: 'zh' | 'en';
  category: string;
  structures: {
    name: string;
    level: string;
    description: string;
    example: string;
  }[];
}

export const GRAMMAR_COMPARISONS_CATALOG: ComparisonSet[] = [
  // ==========================================
  // TIẾNG TRUNG - BỘ SO SÁNH THỜI–THỂ QUAN TRỌNG
  // ==========================================
  {
    id: 'zh-comp-yaohui',
    title: 'Dự định / Nhu cầu 要 (yào) vs Dự đoán / Khả năng 会 (huì)',
    language: 'zh',
    category: 'Cấu trúc tương lai & Động từ năng nguyện',
    structures: [
      { name: '要 (yào)', level: 'HSK2', description: 'Biểu thị ý định chủ quan, kế hoạch, nhu cầu cá nhân hoặc sự việc sắp xảy ra.', example: '我明年要去中国。 (Tôi năm sau định đi Trung Quốc.)' },
      { name: '会 (huì)', level: 'HSK2', description: 'Biểu thị sự dự đoán khả năng xảy ra trong tương lai hoặc kỹ năng đã học được.', example: '明天会下雨。 (Ngày mai trời sẽ mưa.)' }
    ]
  },
  {
    id: 'zh-comp-01',
    title: 'Phủ định hiện tại/thói quen 不 (bù) vs Phủ định quá khứ/chưa xảy ra 没有 (méi)',
    language: 'zh',
    category: 'Phủ định (Negation)',
    structures: [
      { name: '不 (bù)', level: 'HSK1', description: 'Phủ định ý muốn, thói quen, bản chất hoặc hành động ở hiện tại và tương lai. (我不喝咖啡 — Tôi không uống cà phê).', example: '我不喝咖啡。' },
      { name: '没 / 没有 (méi)', level: 'HSK1', description: 'Phủ định hành động chưa hoặc không xảy ra trong quá khứ. (我昨天没喝咖啡 — Hôm qua tôi không uống cà phê).', example: '我昨天没喝咖啡。' }
    ]
  },
  {
    id: 'zh-comp-leguo',
    title: 'Hành động hoàn thành 了 (le) vs Trải nghiệm quá khứ 过 (guo)',
    language: 'zh',
    category: 'Trợ từ động thái (Aspect Particles)',
    structures: [
      { name: '了 (le)', level: 'HSK1', description: 'Một hành động cụ thể đã hoàn thành hoặc trạng thái có sự thay đổi.', example: '我吃了饭。 (Tôi đã ăn cơm xong.)' },
      { name: '过 (guo)', level: 'HSK2', description: 'Đã từng có trải nghiệm thực hiện trong quá khứ, hiện tại không còn tiếp diễn.', example: '我去过北京。 (Tôi đã từng đến Bắc Kinh.)' }
    ]
  },
  {
    id: 'zh-comp-zaizhe',
    title: 'Hành động đang diễn ra 在 / 正在 vs Trạng thái đang duy trì 着 (zhe)',
    language: 'zh',
    category: 'Trợ từ động thái (Aspect Particles)',
    structures: [
      { name: '在 / 正在', level: 'HSK2', description: 'Nhấn mạnh động tác/hành động đang trong tiến trình diễn ra.', example: '我正在看书呢。 (Tôi đang đọc sách.)' },
      { name: '着 (zhe)', level: 'HSK2', description: 'Nhấn mạnh trạng thái tư thế/sự vật đang được duy trì.', example: '门开着。 (Cửa đang mở.)' }
    ]
  },
  {
    id: 'zh-comp-02',
    title: 'Lặp lại tương lai 再 (zài) vs Lặp lại quá khứ 又 (yòu)',
    language: 'zh',
    category: 'Trạng từ lặp lại (Repetition)',
    structures: [
      { name: '再 (zài)', level: 'HSK2', description: 'Hành động lặp lại chưa xảy ra (sẽ lặp lại trong tương lai hoặc sau khi hoàn thành việc khác).', example: '请你再说一遍操作步骤。' },
      { name: '又 (yòu)', level: 'HSK2', description: 'Hành động lặp lại đã thực sự xảy ra trong quá khứ.', example: '3号机组今天又停机了。' }
    ]
  },
  {
    id: 'zh-comp-03',
    title: 'Chậm/Muộn/Khó 才 (cái) vs Nhanh/Sớm/Thuận lợi 就 (jiù)',
    language: 'zh',
    category: 'Trạng từ thời gian (Time Adverbs)',
    structures: [
      { name: '才 (cái)', level: 'HSK2', description: 'Biểu thị hành động xảy ra muộn, chậm, hoặc gặp khó khăn mới hoàn thành.', example: '修了三个小时才修好。' },
      { name: '就 (jiù)', level: 'HSK2', description: 'Biểu thị hành động xảy ra sớm, nhanh, hoặc dễ dàng tiến hành.', example: '他十分钟就完成了质检。' }
    ]
  },
  {
    id: 'zh-comp-04',
    title: 'Hoàn thành 了 (le) vs Kinh nghiệm 过 (guo) vs Duy trì 着 (zhe)',
    language: 'zh',
    category: 'Trợ từ động thái (Aspect Particles)',
    structures: [
      { name: '了 (le)', level: 'HSK1', description: 'Hành động đã hoàn thành hoặc trạng thái có sự thay đổi.', example: '我已经提交了保养报告。' },
      { name: '过 (guo)', level: 'HSK2', description: 'Từng có kinh nghiệm thực hiện trong quá khứ, hiện tại không còn tiếp diễn.', example: '我以前操作过这种数控车床。' },
      { name: '着 (zhe)', level: 'HSK2', description: 'Trạng thái của hành động đang được duy trì.', example: '安全门紧闭着。' }
    ]
  },
  {
    id: 'zh-comp-05',
    title: 'Kỹ năng qua học tập 会 (huì) vs Khả năng thực tế 能 (néng) vs Phép tắc/Cho phép 可以 (kěyǐ)',
    language: 'zh',
    category: 'Động từ năng nguyện (Modal Verbs)',
    structures: [
      { name: '会 (huì)', level: 'HSK1', description: 'Biết làm gì nhờ qua học tập, rèn luyện kỹ năng.', example: '他会编程调机。' },
      { name: '能 (néng)', level: 'HSK1', description: 'Có khả năng, công suất hoặc điều kiện thực hiện.', example: '这台机器一小时能切500件。' },
      { name: '可以 (kěyǐ)', level: 'HSK2', description: 'Được phép (về mặt quy định/nội quy) hoặc có thể làm.', example: '检查合格后才可以装箱。' }
    ]
  },
  {
    id: 'zh-comp-06',
    title: 'Bắt buộc 必须 (bìxū) vs Khuyên 应该 (yīnggāi) vs Phải 得 (děi) vs Cần 要/需要 (yào/xūyào)',
    language: 'zh',
    category: 'Mệnh lệnh & Yêu cầu công việc',
    structures: [
      { name: '必须 (bìxū)', level: 'HSK2', description: 'Bắt buộc 100% theo quy trình an toàn PCCC & PPE.', example: '进入车间必须戴安全帽。' },
      { name: '应该 (yīnggāi)', level: 'HSK2', description: 'Nên làm (khuyên bảo vệ thiết bị, bảo dưỡng).', example: '开机前应该先检查油位。' },
      { name: '得 (děi)', level: 'HSK3', description: 'Phải làm (khẩu ngữ bắt buộc khẩn cấp).', example: '这批货今天得装完。' },
      { name: '要 / 需要', level: 'HSK2', description: 'Cần thiết hoặc nhu cầu kĩ thuật.', example: '换刀具需要专用的钥匙。' }
    ]
  },
  {
    id: 'zh-comp-07',
    title: 'Câu hỏi 还是 (háishi) vs Khẳng định 或者 (huòzhě)',
    language: 'zh',
    category: 'Liên từ lựa chọn (Alternative Conjunctions)',
    structures: [
      { name: '还是 (háishi)', level: 'HSK2', description: 'Dùng trong câu hỏi lựa chọn (Hoặc A hay B?).', example: '你是白班还是夜班？' },
      { name: '或者 (huòzhě)', level: 'HSK2', description: 'Dùng trong câu khẳng định (Hoặc A hoặc B đều được).', example: '发邮件或者打电话通知都可以。' }
    ]
  },
  {
    id: 'zh-comp-08',
    title: 'Định ngữ 的 (de) vs Trạng ngữ 地 (de) vs Bổ ngữ 得 (de)',
    language: 'zh',
    category: 'Trợ từ kết cấu (Structural Particles)',
    structures: [
      { name: '的 (de)', level: 'HSK1', description: 'Đứng trước danh từ (Cụm danh từ / Sở hữu).', example: '新来的操作工。' },
      { name: '地 (de)', level: 'HSK3', description: 'Đứng trước động từ (Cách thức thực hiện hành động).', example: '仔细地检查线路。' },
      { name: '得 (de)', level: 'HSK2', description: 'Đứng sau động từ/tính từ (Mức độ / Khả năng / Trạng thái).', example: '这台机器运行得非常稳定。' }
    ]
  },
  {
    id: 'zh-comp-09',
    title: 'So sánh hơn 比 (bǐ) vs So sánh kém 没有 (méiyǒu) vs So sánh không bằng 不如 (bùrú)',
    language: 'zh',
    category: 'Câu so sánh (Comparisons)',
    structures: [
      { name: '比 (bǐ)', level: 'HSK2', description: 'A hơn B về mặt tính chất/thông số.', example: '新机台比旧机台省电。' },
      { name: '没有 (méiyǒu)', level: 'HSK2', description: 'A không bằng B (kém hơn).', example: '手动切削没有自动切削精准。' },
      { name: '不如 (bùrú)', level: 'HSK3', description: 'A không bằng B (văn viết / khuyên dùng B hơn).', example: '修旧件不如直接换新件。' }
    ]
  },
  {
    id: 'zh-comp-10',
    title: 'Giống nhau 跟……一样 (gēn...yīyàng) vs Đạt mức 有……那么…… (yǒu...nàme...)',
    language: 'zh',
    category: 'So sánh bằng & Mức độ',
    structures: [
      { name: '跟……一样', level: 'HSK2', description: 'A và B hoàn toàn đồng nhất về thuộc tính.', example: '这个零件的规格跟图纸一样。' },
      { name: '有……那么……', level: 'HSK3', description: 'A đạt đến độ cao/mức độ như B.', example: '这种材料有钢铁那么硬。' }
    ]
  },
  {
    id: 'zh-comp-11',
    title: 'Chủ động xử lý 把 (bǎ) vs Bị động hư hỏng 被 (bèi)',
    language: 'zh',
    category: 'Cấu trúc câu đặc biệt (Special Structures)',
    structures: [
      { name: '把字句', level: 'HSK3', description: 'Chủ động tác động xử lý linh kiện/thiết bị.', example: '请把废料清理干净。' },
      { name: '被字句', level: 'HSK3', description: 'Bị động chịu sự cố/ngoại lực làm hư hỏng.', example: '模具被硬物撞坏了。' }
    ]
  },
  {
    id: 'zh-comp-12',
    title: 'Khẩu ngữ 让/叫 (ràng/jiào) vs Văn viết/Chính thức 使 (shǐ)',
    language: 'zh',
    category: 'Động từ gây khiến (Causative Verbs)',
    structures: [
      { name: '让 / 叫', level: 'HSK3', description: 'Cho phép, bảo hoặc bắt ai làm gì (thường dùng trong giao tiếp hàng ngày).', example: '班长让我去取量具。' },
      { name: '使', level: 'HSK4', description: 'Làm cho, khiến cho (dùng trong báo cáo kỹ thuật, văn bản chính thức).', example: '自动化改造使产能提升了30%。' }
    ]
  },
  {
    id: 'zh-comp-13',
    title: 'Đối tượng trực tiếp 对 (duì) vs Thảo luận chuyên đề 对于 (duìyú) vs Phạm vi 关于 (guānyú)',
    language: 'zh',
    category: 'Giới từ (Prepositions)',
    structures: [
      { name: '对', level: 'HSK2', description: 'Hướng về, đối với (ngắn gọn, trực tiếp).', example: '我们对产品质量要求很严。' },
      { name: '对于', level: 'HSK4', description: 'Đối với (dùng ở đầu câu để xướng xuất chủ đề).', example: '对于新安全规定，大家都很支持。' },
      { name: '关于', level: 'HSK4', description: 'Về, liên quan đến (phạm vi nội dung/chủ đề).', example: '关于设备保养的通知。' }
    ]
  },
  {
    id: 'zh-comp-14',
    title: 'Điểm bắt đầu 从 (cóng) vs Mốc thời điểm 自从 (zìcóng) vs Trách nhiệm 由 (yóu)',
    language: 'zh',
    category: 'Giới từ mốc & Trách nhiệm',
    structures: [
      { name: '从', level: 'HSK1', description: 'Từ (thời gian, địa điểm, điểm xuất phát).', example: '从一楼搬到二楼。' },
      { name: '自从', level: 'HSK4', description: 'Kể từ khi (mốc sự kiện quá khứ).', example: '自从更换了刀具，不良率就下降了。' },
      { name: '由', level: 'HSK4', description: 'Do (chỉ định cá nhân/bộ phận chịu trách nhiệm).', example: '本 ca 由张工程师负责。' }
    ]
  },
  {
    id: 'zh-comp-15',
    title: 'Địa điểm/Trạng thái 在 (zài) vs Đang tiến hành 正在 (zhèngzài) vs Đúng lúc 正 (zhèng)',
    language: 'zh',
    category: 'Trạng thái tiếp diễn',
    structures: [
      { name: '在', level: 'HSK1', description: 'Ở tại địa điểm hoặc đang làm gì.', example: '他在质检室测尺寸。' },
      { name: '正在', level: 'HSK2', description: 'Đang trong quá trình tiến hành hành động.', example: '3号线正在试产。' },
      { name: '正', level: 'HSK3', description: 'Đúng lúc, khớp thời điểm.', example: '我正要去找你交接。' }
    ]
  },
  {
    id: 'zh-comp-16',
    title: 'Vừa mới 刚 (gāng) vs Vừa mới xong 刚刚 (gānggāng)',
    language: 'zh',
    category: 'Phó từ thời gian (Recent Time)',
    structures: [
      { name: '刚', level: 'HSK3', description: 'Phó từ (có thể đứng sau chủ ngữ hoặc thời gian).', example: '我刚拿到检验报告。' },
      { name: '刚刚', level: 'HSK3', description: 'Danh từ thời gian (có thể đứng trước chủ ngữ).', example: '刚刚维修班组把电机修好了。' }
    ]
  },
  {
    id: 'zh-comp-17',
    title: 'Đã 已经 (yǐjīng) vs Từng 曾经 (céngjīng)',
    language: 'zh',
    category: 'Thời thể quá khứ',
    structures: [
      { name: '已经', level: 'HSK2', description: 'Đã hoàn thành và kết quả còn ảnh hưởng đến hiện tại.', example: '机器已经清理干净了。' },
      { name: '曾经', level: 'HSK4', description: 'Đã từng xảy ra trong quá khứ, nay không còn nữa.', example: '他曾经在这家工厂当过厂长。' }
    ]
  },
  {
    id: 'zh-comp-18',
    title: 'Bổ ngữ số lượng 一点儿 (yìdiǎnr) vs Phó từ tâm lý 有点儿 (yǒudiǎnr)',
    language: 'zh',
    category: 'Số lượng & Mức độ',
    structures: [
      { name: '一点儿', level: 'HSK2', description: 'Đứng sau tính từ/động từ (Một chút - số lượng bớt đi/thêm vào).', example: '请再快一点儿。' },
      { name: '有点儿', level: 'HSK2', description: 'Đứng trước tính từ (Hơi... - tiêu cực/không hài lòng).', example: '这批料有点儿硬。' }
    ]
  },
  {
    id: 'zh-comp-19',
    title: 'Thời gian ngắn 一会儿 (yíhuìr) vs Thử thao tác 一下 (yíxià)',
    language: 'zh',
    category: 'Bổ ngữ thời lượng & Động lượng',
    structures: [
      { name: '一会儿', level: 'HSK2', description: 'Khoảng thời gian ngắn (Chờ một chút).', example: '请稍微等一会儿。' },
      { name: '一下', level: 'HSK2', description: 'Thử làm 1 lần ngắn/nhẹ nhàng.', example: '按一下复位键。' }
    ]
  },
  {
    id: 'zh-comp-20',
    title: 'Cảm giác 觉得 (juéde) vs Phán đoán chuẩn xác 认为 (rènwéi) vs Tưởng nhầm 以为 (yǐwéi)',
    language: 'zh',
    category: 'Động từ phán đoán & Thẩm định',
    structures: [
      { name: '觉得', level: 'HSK2', description: 'Cảm thấy (cảm nhận cá nhân).', example: '我觉得这台机器声音不对。' },
      { name: '认为', level: 'HSK3', description: 'Cho rằng, nhận định (có căn cứ kỹ thuật/chính thức).', example: '工程师认为这是油压不足造成的。' },
      { name: '以为', level: 'HSK3', description: 'Nghĩ rằng (nhưng thực tế kết quả ngược lại - tưởng thế).', example: '我以为修好了，结果又停机了。' }
    ]
  },
  {
    id: 'zh-comp-21',
    title: 'Hiểu rõ 了解 (liǎojiě) vs Biết thông tin 知道 (zhīdào) vs Quen biết 认识 (rènshi)',
    language: 'zh',
    category: 'Nhận thức & Kỹ năng',
    structures: [
      { name: '了解', level: 'HSK3', description: 'Hiểu sâu sắc về quy trình/tình hình.', example: '我很了解 5S 的标准。' },
      { name: '知道', level: 'HSK1', description: 'Biết tin tức/thông tin cụ thể.', example: '你知道事故原因吗？' },
      { name: '认识', level: 'HSK1', description: 'Quen biết mặt người hoặc nhận biết chữ/ký hiệu.', example: '我认识这位安全员。' }
    ]
  },
  {
    id: 'zh-comp-22',
    title: 'Sự cố phát sinh 发生 (fāshēng) vs Năng suất/Hiệu quả 产生 (chǎnshēng)',
    language: 'zh',
    category: 'Động từ sự cố & Biến đổi',
    structures: [
      { name: '发生', level: 'HSK3', description: 'Xảy ra (sự cố, tai nạn, thay đổi ngoài ý muốn).', example: '昨天夜班发生了一起漏油事故。' },
      { name: '产生', level: 'HSK4', description: 'Nảy sinh, tạo ra (nhiệt, ma sát, sản phẩm nạp).', example: '摩擦会产生高温。' }
    ]
  },
  {
    id: 'zh-comp-23',
    title: 'Tiến hành thao tác 进行 (jìnxíng) vs Tổ chức sự kiện 举行 (jǔxíng)',
    language: 'zh',
    category: 'Động từ thực thi',
    structures: [
      { name: '进行', level: 'HSK4', description: 'Tiến hành (kiểm tra, bảo dưỡng, cải tiến Kaizen).', example: '对设备进行全面保养。' },
      { name: '举行', level: 'HSK4', description: 'Tổ chức (cuộc họp, lễ diễn tập PCCC).', example: '明天举行消防演习。' }
    ]
  },
  {
    id: 'zh-comp-24',
    title: 'Thông qua phương pháp 通过 (tōngguò) vs Trải qua quá trình 经过 (jīngguò)',
    language: 'zh',
    category: 'Giới từ phương thức & Trải nghiệm',
    structures: [
      { name: '通过', level: 'HSK4', description: 'Bằng cách, thông qua (biện pháp, công cụ, kiểm định).', example: '通过 ISO 认证。' },
      { name: '经过', level: 'HSK4', description: 'Sau khi trải qua (quá trình xử lý, kiểm tra).', example: '经过三个小时的抢修，恢复了生产。' }
    ]
  },
  {
    id: 'zh-comp-25',
    title: 'Khẩu ngữ 因为……所以…… vs Văn phong báo cáo 由于……因此……',
    language: 'zh',
    category: 'Nguyên nhân - Kết quả (Cause & Effect)',
    structures: [
      { name: '因为……所以……', level: 'HSK2', description: 'Bởi vì... cho nên... (thông dụng trong giao tiếp hàng ngày).', example: '因为停电，所以停工。' },
      { name: '由于……因此……', level: 'HSK4', description: 'Do... vì vậy... (trang trọng trong báo cáo sự cố 8D/SOP).', example: '由于气压不足，因此封口不严。' }
    ]
  },
  {
    id: 'zh-comp-26',
    title: 'Mặc dù……nhưng…… 虽然……但是…… vs 尽管……可是……',
    language: 'zh',
    category: 'Nhượng bộ (Concession)',
    structures: [
      { name: '虽然……但是……', level: 'HSK2', description: 'Mặc dù... nhưng... (phổ biến nhất).', example: '虽然任务重，但是我们按时交货了。' },
      { name: '尽管……可是……', level: 'HSK4', description: 'Cho dù... nhưng... (nhấn mạnh sự khắc phục khó khăn).', example: '尽管有难度，可是工程师解决了。' }
    ]
  },
  {
    id: 'zh-comp-27',
    title: 'Điều kiện đủ 只要……就…… vs Điều kiện duy nhất 只有……才……',
    language: 'zh',
    category: 'Điều kiện (Conditionals)',
    structures: [
      { name: '只要……就……', level: 'HSK3', description: 'Chỉ cần... là... (có điều kiện này thì sẽ có kết quả).', example: '只要按规程操作就不会出事。' },
      { name: '只有……才……', level: 'HSK3', description: 'Chỉ có... mới... (đây là điều kiện DUY NHẤT).', example: '只有戴防护手套才可以拿强酸。' }
    ]
  },
  {
    id: 'zh-comp-28',
    title: 'Giả định Cho dù 即使……也…… vs 哪怕……也……',
    language: 'zh',
    category: 'Giả định nhượng bộ',
    structures: [
      { name: '即使……也……', level: 'HSK4', description: 'Dù cho... cũng... (giả thiết tình huống cực đoan).', example: '即使加班也要完成抽检。' },
      { name: '哪怕……也……', level: 'HSK4', description: 'Cho dù có... đi nữa cũng... (khẩu ngữ quyết tâm).', example: '哪怕只有 1% 的不良，也要全检。' }
    ]
  },
  {
    id: 'zh-comp-29',
    title: 'Thà B làm A 与其……不如…… vs Quyết không làm B 宁可……也不……',
    language: 'zh',
    category: 'Lựa chọn đánh đổi',
    structures: [
      { name: '与其……不如……', level: 'HSK4', description: 'Thay vì A (dở hơn) thì thà B (tốt hơn).', example: '与其返工，不如第一次就做对。' },
      { name: '宁可……也不……', level: 'HSK4', description: 'Thà hy sinh A chứ nhất quyết không làm B (tiêu cực/nguy hiểm).', example: '宁可停线，也不能出违规隐患。' }
    ]
  },
  {
    id: 'zh-comp-30',
    title: 'Bất luận 无论……都…… vs 不管……都……',
    language: 'zh',
    category: 'Bất biến (Universal Condition)',
    structures: [
      { name: '无论……都……', level: 'HSK4', description: 'Bất luận (văn viết trang trọng).', example: '无论难度多大，都要符合 ISO 标准。' },
      { name: '不管……都……', level: 'HSK3', description: 'Bất kể (khẩu ngữ thân mật công xưởng).', example: '不管是谁，进入车间都要签到。' }
    ]
  },

  // ==========================================
  // TIẾNG ANH - 40 BỘ SO SÁNH BẮT BUỘC
  // ==========================================
  {
    id: 'en-comp-01',
    title: 'Present Simple vs Present Continuous in Assembly Operations',
    language: 'en',
    category: 'Tenses',
    structures: [
      { name: 'Present Simple', level: 'A1', description: 'Routine SOP steps, permanent facts, and standard specifications.', example: 'The robot arm welds 50 units per hour.' },
      { name: 'Present Continuous', level: 'A1', description: 'Current ongoing actions or temporary production changes happening right now.', example: 'Technicians are calibrating machine #3 at the moment.' }
    ]
  },
  {
    id: 'en-comp-02',
    title: 'Present Perfect vs Past Simple in Quality & Incident Reporting',
    language: 'en',
    category: 'Tenses',
    structures: [
      { name: 'Present Perfect', level: 'A2', description: 'Completed action with present impact or unfinished time frame (no specific past time given).', example: 'We have inspected all 500 batches.' },
      { name: 'Past Simple', level: 'A2', description: 'Action completed at a specific, defined time in the past.', example: 'The power tripped at 02:15 AM.' }
    ]
  },
  {
    id: 'en-comp-03',
    title: 'Present Perfect vs Present Perfect Continuous in Defect Troubleshooting',
    language: 'en',
    category: 'Tenses',
    structures: [
      { name: 'Present Perfect', level: 'B1', description: 'Emphasizes result or quantity completed.', example: 'The team has replaced three pneumatic valves.' },
      { name: 'Present Perfect Continuous', level: 'B1', description: 'Emphasizes duration of continuous ongoing activity.', example: 'The line has been leaking hydraulic oil since morning.' }
    ]
  },
  {
    id: 'en-comp-04',
    title: 'Past Simple vs Past Continuous in Shift Accident Reporting',
    language: 'en',
    category: 'Tenses',
    structures: [
      { name: 'Past Simple', level: 'A2', description: 'Completed action that interrupted an ongoing background process.', example: 'The main fuse blew.' },
      { name: 'Past Continuous', level: 'B1', description: 'Ongoing background action in progress when something happened.', example: 'The motor was running at peak load when the fuse blew.' }
    ]
  },
  {
    id: 'en-comp-05',
    title: 'Past Simple vs Past Perfect in Root-Cause Investigation',
    language: 'en',
    category: 'Tenses',
    structures: [
      { name: 'Past Simple', level: 'A2', description: 'Past event.', example: 'The engine stalled.' },
      { name: 'Past Perfect', level: 'B1', description: 'Action completed BEFORE another past event (earlier past).', example: 'The sensor had triggered three warnings before the engine stalled.' }
    ]
  },
  {
    id: 'en-comp-06',
    title: 'Will vs Be Going To in Production Schedules',
    language: 'en',
    category: 'Future',
    structures: [
      { name: 'Will', level: 'A2', description: 'Spontaneous decisions or formal announcements.', example: 'I will shut down line 2 immediately.' },
      { name: 'Be Going To', level: 'A2', description: 'Pre-planned schedules or clear present evidence.', example: 'We are going to upgrade the PLC software tomorrow.' }
    ]
  },
  {
    id: 'en-comp-07',
    title: 'Will vs Present Continuous for Future Events',
    language: 'en',
    category: 'Future',
    structures: [
      { name: 'Will', level: 'A2', description: 'Uncertain future prediction or offer.', example: 'The supplier will send the replacement parts next week.' },
      { name: 'Present Continuous (Future)', level: 'A2', description: 'Confirmed arrangement with fixed time/place.', example: 'The external ISO auditor is visiting our plant tomorrow at 9 AM.' }
    ]
  },
  {
    id: 'en-comp-08',
    title: 'Must vs Have To in Factory Compliance',
    language: 'en',
    category: 'Modals',
    structures: [
      { name: 'Must', level: 'A2', description: 'Internal requirement, personal obligation, or safety law.', example: 'You must lock out tag out before entering the cell.' },
      { name: 'Have To', level: 'A2', description: 'External rule, company policy, or physical necessity.', example: 'Operators have to wear steel-toe boots in the warehouse.' }
    ]
  },
  {
    id: 'en-comp-09',
    title: 'Must Not vs Do Not Have To in Safety Rules',
    language: 'en',
    category: 'Modals',
    structures: [
      { name: 'Must Not', level: 'A2', description: 'Strict prohibition (100% forbidden - safety risk).', example: 'You must not operate the press without the safety guard.' },
      { name: 'Do Not Have To', level: 'A2', description: 'Lack of obligation (optional - not necessary).', example: 'You do not have to clean the floor; the cleaning crew will handle it.' }
    ]
  },
  {
    id: 'en-comp-10',
    title: 'Can / Could vs Be Able To for Technical Capabilities',
    language: 'en',
    category: 'Modals',
    structures: [
      { name: 'Can', level: 'A1', description: 'General present ability or permission.', example: 'This lathe can cut titanium sheets.' },
      { name: 'Could', level: 'A2', description: 'Past general ability or polite request.', example: 'Could you pass me the torque wrench?' },
      { name: 'Be Able To', level: 'B1', description: 'Specific successful accomplishment or future ability.', example: 'We were able to restore power within ten minutes.' }
    ]
  },
  {
    id: 'en-comp-11',
    title: 'May vs Might in Risk Probability',
    language: 'en',
    category: 'Modals',
    structures: [
      { name: 'May', level: 'B1', description: 'Formal possibility (~50% chance) or formal permission.', example: 'Overheating may cause component distortion.' },
      { name: 'Might', level: 'B1', description: 'Lower probability (~30% chance) or hypothetical scenario.', example: 'A loose belt might cause faint vibration.' }
    ]
  },
  {
    id: 'en-comp-12',
    title: 'Should / Ought To vs Had Better in Safety Directives',
    language: 'en',
    category: 'Modals',
    structures: [
      { name: 'Should / Ought To', level: 'A2', description: 'General advice or recommended standard practice.', example: 'Technicians should inspect gaskets during maintenance.' },
      { name: 'Had Better', level: 'B1', description: 'Strong warning with negative consequences if ignored.', example: 'You had better turn off the main valve, or it will burst.' }
    ]
  },
  {
    id: 'en-comp-13',
    title: 'Used To vs Be Used To vs Get Used To',
    language: 'en',
    category: 'Habits & Adaptation',
    structures: [
      { name: 'Used To + V', level: 'B1', description: 'Past habit or state that is no longer true.', example: 'We used to assemble these valves manually.' },
      { name: 'Be Used To + V-ing', level: 'B1', description: 'Accustomed to a situation (present comfort).', example: 'The shift leader is used to working night shifts.' },
      { name: 'Get Used To + V-ing', level: 'B1', description: 'Process of becoming accustomed over time.', example: 'New operators quickly get used to wearing earplugs.' }
    ]
  },
  {
    id: 'en-comp-14',
    title: 'Gerund vs Infinitive after Action Verbs',
    language: 'en',
    category: 'Verb Complimentation',
    structures: [
      { name: 'Verb + Gerund (-ing)', level: 'B1', description: 'Activity or completed action focus (avoid, finish, practice).', example: 'Avoid touching bare copper wires.' },
      { name: 'Verb + Infinitive (to V)', level: 'B1', description: 'Goal, intention, or future action (agree, decide, plan).', example: 'We plan to install two new CNC machines next month.' }
    ]
  },
  {
    id: 'en-comp-15',
    title: 'Stop Doing vs Stop To Do in Machinery SOPs',
    language: 'en',
    category: 'Verb Complimentation',
    structures: [
      { name: 'Stop Doing', level: 'B1', description: 'Cease an ongoing action completely.', example: 'Stop running the motor if you smell smoke.' },
      { name: 'Stop To Do', level: 'B1', description: 'Pause one action in order to perform another.', example: 'The operator stopped to clean the sensor lens.' }
    ]
  },
  {
    id: 'en-comp-16',
    title: 'Remember Doing vs Remember To Do',
    language: 'en',
    category: 'Verb Complimentation',
    structures: [
      { name: 'Remember Doing', level: 'B1', description: 'Recall a past memory of an action.', example: 'I remember locking the warehouse door last night.' },
      { name: 'Remember To Do', level: 'B1', description: 'Don\'t forget a duty or task.', example: 'Remember to switch off the air compressor before leaving.' }
    ]
  },
  {
    id: 'en-comp-17',
    title: 'Try Doing vs Try To Do in Machinery Debugging',
    language: 'en',
    category: 'Verb Complimentation',
    structures: [
      { name: 'Try Doing', level: 'B1', description: 'Experiment with a method to see if it solves a problem.', example: 'Try resetting the PLC unit to clear the fault code.' },
      { name: 'Try To Do', level: 'B1', description: 'Attempt a difficult effort.', example: 'We tried to realign the conveyor shaft.' }
    ]
  },
  {
    id: 'en-comp-18',
    title: 'Active Voice vs Passive Voice in Quality Audits',
    language: 'en',
    category: 'Voice',
    structures: [
      { name: 'Active Voice', level: 'A2', description: 'Focus on who performed the action.', example: 'The QC engineer checked 100 samples.' },
      { name: 'Passive Voice', level: 'B1', description: 'Focus on the object/result (agent is secondary or obvious).', example: '100 samples were checked by the QC engineer.' }
    ]
  },
  {
    id: 'en-comp-19',
    title: 'First Conditional vs Second Conditional in Risk Assessment',
    language: 'en',
    category: 'Conditionals',
    structures: [
      { name: 'First Conditional', level: 'A2', description: 'Real high probability operational risk.', example: 'If pressure exceeds 5 bar, the relief valve will open.' },
      { name: 'Second Conditional', level: 'B1', description: 'Hypothetical / imaginary situation.', example: 'If the main grid failed, backup generators would power line 1.' }
    ]
  },
  {
    id: 'en-comp-20',
    title: 'Second Conditional vs Third Conditional in Post-Incident Analysis',
    language: 'en',
    category: 'Conditionals',
    structures: [
      { name: 'Second Conditional', level: 'B1', description: 'Unreal present or future hypothesis.', example: 'If we had automated assembly, throughput would double.' },
      { name: 'Third Conditional', level: 'B2', description: 'Unreal past regret or missed prevention opportunity.', example: 'If the guard had been installed, the injury would not have occurred.' }
    ]
  },
  {
    id: 'en-comp-21',
    title: 'Defining vs Non-defining Relative Clauses in Component Specs',
    language: 'en',
    category: 'Relative Clauses',
    structures: [
      { name: 'Defining Relative Clause', level: 'B1', description: 'Essential identifying information (no commas).', example: 'The pump that supplies coolant is leaking.' },
      { name: 'Non-defining Relative Clause', level: 'B2', description: 'Extra non-essential detail (surrounded by commas).', example: 'Machine 4, which was purchased in 2024, operates flawlessly.' }
    ]
  },
  {
    id: 'en-comp-22',
    title: 'Say vs Tell in Shift Communication',
    language: 'en',
    category: 'Reported Speech',
    structures: [
      { name: 'Say', level: 'A2', description: 'Say + words / Say to someone (no direct personal object required).', example: 'The supervisor said that the line was ready.' },
      { name: 'Tell', level: 'A2', description: 'Tell + personal object (Requires someone: tell me, tell the team).', example: 'The supervisor told the operators to wear gloves.' }
    ]
  },
  {
    id: 'en-comp-23',
    title: 'Make vs Do in Maintenance & Quality Tasks',
    language: 'en',
    category: 'Collocations',
    structures: [
      { name: 'Make', level: 'A2', description: 'Produce, create, or alter something (make repairs, make adjustments).', example: 'Please make necessary adjustments to the feed rate.' },
      { name: 'Do', level: 'A2', description: 'Perform work, tasks, or maintenance (do maintenance, do inspections).', example: 'The team will do daily maintenance at 5 PM.' }
    ]
  },
  {
    id: 'en-comp-24',
    title: 'Since vs For in Operation Tracking',
    language: 'en',
    category: 'Prepositions of Time',
    structures: [
      { name: 'Since', level: 'A2', description: 'Starting point of a time period (since 8 AM, since Monday).', example: 'Line 2 has been active since 6:00 AM.' },
      { name: 'For', level: 'A2', description: 'Total duration of a time period (for 8 hours, for two days).', example: 'Line 2 has been active for eight hours.' }
    ]
  },
  {
    id: 'en-comp-25',
    title: 'During vs While in Safety Instructions',
    language: 'en',
    category: 'Conjunctions',
    structures: [
      { name: 'During + Noun', level: 'A2', description: 'Preposition followed by a noun phrase.', example: 'Never touch moving belts during operation.' },
      { name: 'While + Clause / V-ing', level: 'B1', description: 'Conjunction followed by subject + verb or -ing participle.', example: 'Wear ear defenders while operating the punch press.' }
    ]
  },
  {
    id: 'en-comp-26',
    title: 'Because vs Because Of in Breakdown Root Causes',
    language: 'en',
    category: 'Cause & Effect',
    structures: [
      { name: 'Because + Clause', level: 'A2', description: 'Followed by full subject + verb clause.', example: 'The motor stopped because the circuit overheated.' },
      { name: 'Because Of + Noun', level: 'A2', description: 'Followed by noun or noun phrase.', example: 'The motor stopped because of circuit overheating.' }
    ]
  },
  {
    id: 'en-comp-27',
    title: 'Although vs Despite / In Spite Of',
    language: 'en',
    category: 'Concession',
    structures: [
      { name: 'Although + Clause', level: 'B1', description: 'Followed by subject + verb clause.', example: 'Although the parts were delayed, target output was reached.' },
      { name: 'Despite + Noun / V-ing', level: 'B1', description: 'Followed by noun phrase or gerund.', example: 'Despite raw material delays, target output was reached.' }
    ]
  },
  {
    id: 'en-comp-28',
    title: 'So vs Such in Quality Complaints',
    language: 'en',
    category: 'Emphasis & Extent',
    structures: [
      { name: 'So + Adjective / Adverb', level: 'A2', description: 'Modifies an adjective directly.', example: 'The bearings were so hot that lubrication melted.' },
      { name: 'Such + (a/an) + Adj + Noun', level: 'B1', description: 'Modifies a noun phrase.', example: 'It was such a severe breakdown that assembly stopped.' }
    ]
  },
  {
    id: 'en-comp-29',
    title: 'Too vs Enough in Quality Tolerance Limits',
    language: 'en',
    category: 'Extent & Limits',
    structures: [
      { name: 'Too + Adjective', level: 'A2', description: 'Excessive (negative condition - beyond limit).', example: 'The tolerance gap is too wide.' },
      { name: 'Adjective + Enough', level: 'A2', description: 'Sufficient (meets necessary requirement).', example: 'The steel plate is strong enough for heavy loading.' }
    ]
  },
  {
    id: 'en-comp-30',
    title: 'Few / A Few vs Little / A Little in Inventory',
    language: 'en',
    category: 'Quantifiers',
    structures: [
      { name: 'A Few (Countable)', level: 'A2', description: 'Some (positive small quantity of plural nouns).', example: 'We have a few spare bolts in stock.' },
      { name: 'Few (Countable)', level: 'B1', description: 'Hardly any (negative shortage of plural nouns).', example: 'Few operators passed the advanced welding test.' },
      { name: 'A Little (Uncountable)', level: 'A2', description: 'Some (positive small quantity of mass nouns).', example: 'Add a little lubricant to the bearing.' },
      { name: 'Little (Uncountable)', level: 'B1', description: 'Hardly any (negative shortage of mass nouns).', example: 'There is little coolant remaining in the reservoir.' }
    ]
  },
  {
    id: 'en-comp-31',
    title: 'Much vs Many in Scraped Defect Reports',
    language: 'en',
    category: 'Quantifiers',
    structures: [
      { name: 'Much', level: 'A1', description: 'Used with uncountable nouns (questions/negatives).', example: 'How much oil was used during shift 1?' },
      { name: 'Many', level: 'A1', description: 'Used with plural countable nouns.', example: 'How many defective chips were found today?' }
    ]
  },
  {
    id: 'en-comp-32',
    title: 'Another vs Other vs The Other in Parts Replacement',
    language: 'en',
    category: 'Determiners',
    structures: [
      { name: 'Another + Singular Noun', level: 'A2', description: 'One additional or different item.', example: 'Hand me another washer.' },
      { name: 'Other + Plural Noun', level: 'A2', description: 'Additional or different items in general.', example: 'Check other valves for leakage.' },
      { name: 'The Other + Noun', level: 'B1', description: 'The remaining specific item of a set.', example: 'The left valve is fine, but the other valve is broken.' }
    ]
  },
  {
    id: 'en-comp-33',
    title: 'Like vs As in Technical Standard Comparison',
    language: 'en',
    category: 'Prepositions & Conjunctions',
    structures: [
      { name: 'Like + Noun', level: 'A2', description: 'Preposition meaning "similar to".', example: 'This noise sounds like gear grinding.' },
      { name: 'As + Clause / Role', level: 'B1', description: 'Conjunction or preposition indicating function/role.', example: 'He works as a Senior Quality Technician.' }
    ]
  },
  {
    id: 'en-comp-34',
    title: 'In vs Into in Workshop Material Handling',
    language: 'en',
    category: 'Prepositions of Movement',
    structures: [
      { name: 'In', level: 'A1', description: 'Static location inside a space.', example: 'The spare parts are stored in bin B4.' },
      { name: 'Into', level: 'A2', description: 'Movement entering inside a space.', example: 'Pour the hydraulic fluid into the reservoir.' }
    ]
  },
  {
    id: 'en-comp-35',
    title: 'By vs Until in Production Deadlines',
    language: 'en',
    category: 'Prepositions of Time',
    structures: [
      { name: 'By + Deadline', level: 'A2', description: 'Completion on or before a specific moment.', example: 'The batch must be packaged by 4 PM.' },
      { name: 'Until + Time', level: 'A2', description: 'Continuous activity continuing up to a moment.', example: 'Keep the cooling fan running until 5 PM.' }
    ]
  },
  {
    id: 'en-comp-36',
    title: 'Rise vs Raise in Production Output Reports',
    language: 'en',
    category: 'Confusing Verbs',
    structures: [
      { name: 'Rise (Intransitive)', level: 'B1', description: 'Go up on its own (no direct object).', example: 'The temperature will rise rapidly under overload.' },
      { name: 'Raise (Transitive)', level: 'B1', description: 'Lift or increase something (requires direct object).', example: 'Please raise the lever to unlock the clamp.' }
    ]
  },
  {
    id: 'en-comp-37',
    title: 'Lie vs Lay in Component Placement',
    language: 'en',
    category: 'Confusing Verbs',
    structures: [
      { name: 'Lie (Intransitive)', level: 'B2', description: 'Recline or be situated in a flat position.', example: 'The sensor lies beneath the conveyor belt.' },
      { name: 'Lay (Transitive)', level: 'B2', description: 'Place or put something down flat (requires direct object).', example: 'Lay the metal sheet flat on the cutting table.' }
    ]
  },
  {
    id: 'en-comp-38',
    title: 'Affect vs Effect in Incident Root Causes',
    language: 'en',
    category: 'Confusing Words',
    structures: [
      { name: 'Affect (Verb)', level: 'B1', description: 'Influence or produce a change in something.', example: 'Voltage drops affect machine accuracy.' },
      { name: 'Effect (Noun)', level: 'B1', description: 'Result or consequence of a cause.', example: 'The main effect of wear is reduced precision.' }
    ]
  },
  {
    id: 'en-comp-39',
    title: 'Advice (Noun) vs Advise (Verb)',
    language: 'en',
    category: 'Confusing Words',
    structures: [
      { name: 'Advice (Uncountable Noun)', level: 'A2', description: 'Recommendations or suggestions.', example: 'Follow the safety engineer\'s advice.' },
      { name: 'Advise (Verb)', level: 'B1', description: 'To give recommendation to someone.', example: 'We advise operators to wear protective helmets.' }
    ]
  },
  {
    id: 'en-comp-40',
    title: 'Work (Uncountable) vs Job (Countable)',
    language: 'en',
    category: 'Nouns',
    structures: [
      { name: 'Work (Uncountable Noun)', level: 'A1', description: 'General effort, labor, or tasks.', example: 'Maintenance work is scheduled for Sunday.' },
      { name: 'Job (Countable Noun)', level: 'A1', description: 'Specific role, occupation, or individual task.', example: 'He completed three repair jobs today.' }
    ]
  }
];
