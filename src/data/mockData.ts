import { Student, Announcement, WeeklyEvaluation, LiteratureLessonContent, LiteratureGradeRecord, WeekInfo, ClassInfo } from '../types';

export const CLASS_INFO: ClassInfo = {
  name: 'Lớp 7C',
  school: 'Trường THCS Tân Khai',
  homeroomTeacher: 'Cô Vân Anh',
  teacherTitle: 'Giáo viên môn Ngữ Văn',
  teacherRole: 'Giáo viên bộ môn Ngữ Văn Lớp 7C',
  academicYear: 'Năm học 2026 - 2027',
  totalStudents: 38,
  currentWeek: 4,
};

export const INITIAL_WEEKS: WeekInfo[] = [
  {
    week: 1,
    title: 'Tuần 1 (18/08 - 24/08)',
    startDate: '18/08/2026',
    endDate: '24/08/2026',
    focusTheme: 'Khởi động năm học mới & Bầy chim chìa vôi',
  },
  {
    week: 2,
    title: 'Tuần 2 (25/08 - 31/08)',
    startDate: '25/08/2026',
    endDate: '31/08/2026',
    focusTheme: 'Đi lấy mật & Nề nếp học tập',
  },
  {
    week: 3,
    title: 'Tuần 3 (01/09 - 07/09)',
    startDate: '01/09/2026',
    endDate: '07/09/2026',
    focusTheme: 'Đồng dao mùa xuân & Tinh thần đoàn kết',
  },
  {
    week: 4,
    title: 'Tuần 4 (08/09 - 14/09)',
    startDate: '08/09/2026',
    endDate: '14/09/2026',
    focusTheme: 'Gặp lá cơm nếp & Viết đoạn văn biểu cảm',
    isCurrent: true,
  },
];

// Comment bank tags for fast teacher selection
export const COMMENT_BANK = {
  attitude: [
    'Tích cực, hăng hái',
    'Chủ động phát biểu',
    'Có nhiều tiến bộ',
    'Tự giác làm bài',
    'Ngoan ngoãn, lễ phép',
    'Chưa thực sự tập trung',
    'Còn nói chuyện riêng',
    'Cần mạnh dạn, tự tin hơn',
    'Hơi nhút nhát trước đám đông',
  ],
  academic: [
    'Nắm chắc kiến thức bài học',
    'Hoàn thành bài tập đầy đủ',
    'Tư duy giải bài toán tốt',
    'Kỹ năng viết văn biểu cảm tốt',
    'Phát âm Tiếng Anh tiến bộ',
    'Cần củng cố kiến thức nền tảng',
    'Cần rèn kỹ năng trình bày vở',
    'Cần chú ý làm bài tập về nhà',
    'Cần tập trung vào môn KHTN',
  ],
  // Special literature comment bank by Teacher Van Anh
  literature: [
    'Cảm thụ văn học rất tinh tế, sâu sắc',
    'Viết đoạn văn mạch lạc, giàu hình ảnh',
    'Đọc diễn cảm, phát âm tròn vành rõ chữ',
    'Nắm chắc các biện pháp tu từ tiếng Việt',
    'Chủ động phát biểu xây dựng bài trong giờ Văn',
    'Trình bày bài sạch đẹp, chữ viết ngay ngắn',
    'Cần chú ý lỗi chính tả và dấu ngắt câu',
    'Đoạn văn cần liên kết ý chặt chẽ hơn',
    'Cần đọc kỹ câu hỏi đọc - hiểu trước khi trả lời',
    'Cần dành thêm thời gian soạn bài kỹ ở nhà',
  ],
  cooperation: [
    'Hợp tác nhóm rất tốt, trách nhiệm',
    'Biết chia sẻ, giúp đỡ bạn bè',
    'Hòa đồng, thân thiện với lớp',
    'Cần chủ động tương tác với bạn',
    'Nên lắng nghe ý kiến thành viên khác',
  ],
  discipline: [
    'Nề nếp học tập rất chuẩn mực',
    'Đi học đúng giờ, trang phục chỉnh tề',
    'Giữ gìn vệ sinh lớp học tốt',
    'Còn quên sách vở môn học',
    'Cần đi học đúng giờ hơn',
  ],
};

export const INITIAL_LESSON_CONTENTS: LiteratureLessonContent[] = [
  {
    id: 'lit-w4',
    week: 4,
    title: 'Văn bản thơ: Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn biểu cảm',
    topic: 'Bài 2: Khúc nhạc tâm hồn',
    keyKnowledge:
      'Thể thơ năm chữ; nghệ thuật ẩn dụ mùi hương lá cơm nếp; tình cảm sâu sắc của người con đối với mẹ già và quê hương. Kỹ năng: Lập dàn ý và viết đoạn văn ghi lại cảm xúc về một bài thơ bốn chữ, năm chữ.',
    homework:
      '1. Viết hoàn chỉnh đoạn văn (7-10 câu) ghi lại cảm xúc về bài thơ "Gặp lá cơm nếp".\n2. Soạn trước bài "Thực hành Tiếng Việt: Nghĩa của từ và biện pháp tu từ điệp ngữ".\n3. Đọc lại bài và tự kiểm tra chính tả.',
    sampleExcerpt:
      'Mùi lá cơm nếp không chỉ là hương vị thân thương của món ăn thôn dã mà đã hóa thành biểu tượng thiêng liêng của tình mẹ bao la, theo chân người lính trên khắp dặm dài Tổ quốc...',
    updatedDate: '08/09/2026',
    author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
  },
  {
    id: 'lit-w3',
    week: 3,
    title: 'Văn bản thơ: Đồng dao mùa xuân (Nguyễn Khoa Điềm)',
    topic: 'Bài 2: Khúc nhạc tâm hồn',
    keyKnowledge:
      'Thể thơ bốn chữ; hình ảnh anh bộ đội Cụ Hồ hồn nhiên mà bất tử; lòng biết ơn của thế hệ hôm nay. Tiếng Việt: Nghĩa của từ trong văn cảnh.',
    homework:
      'Học thuộc lòng bài thơ "Đồng dao mùa xuân". Hoàn thành phiếu bài tập cảm thụ khổ thơ 2 và 3.',
    sampleExcerpt:
      'Hình ảnh người lính trẻ "chưa một lần yêu / cà phê chưa uống / còn mê thả diều" nằm lại giữa ngút ngàn Trường Sơn để lại nỗi xúc động nghẹn ngào trong lòng người đọc bao thế hệ...',
    updatedDate: '01/09/2026',
    author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
  },
  {
    id: 'lit-w2',
    week: 2,
    title: 'Văn bản: Đi lấy mật (Trích Đất rừng phương Nam - Đoàn Giỏi)',
    topic: 'Bài 1: Bầu trời tuổi thơ',
    keyKnowledge:
      'Nghệ thuật miêu tả thiên nhiên Nam Bộ trù phú, sống động; nhân vật An, Cò và tía nuôi; nghệ thuật so sánh, nhân hóa.',
    homework:
      'Viết đoạn văn ngắn 5-7 câu miêu tả cảnh bình minh trong rừng tràm U Minh.',
    sampleExcerpt:
      'Rừng tràm rực lên trong ánh ban mai lấp lánh, tiếng chim rừng ríu rít gọi bầy như một bản hòa ca diệu kỳ của thiên nhiên hoang dã Nam Bộ...',
    updatedDate: '25/08/2026',
    author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
  },
  {
    id: 'lit-w1',
    week: 1,
    title: 'Văn bản: Bầy chim chìa vôi (Nguyễn Quang Thiều)',
    topic: 'Bài 1: Bầu trời tuổi thơ',
    keyKnowledge:
      'Đặc điểm truyện ngắn; nhân vật Mên và Mon; tấm lòng nhân hậu, tình yêu thương loài vật non nớt. Tiếng Việt: Trạng ngữ và mở rộng trạng ngữ.',
    homework:
      'Vẽ sơ đồ tư duy tóm tắt cốt truyện và các mốc thời gian trong đêm mưa bão của hai anh em Mên, Mon.',
    sampleExcerpt:
      'Hai đứa trẻ không ngủ được không phải vì sợ nước ngập mà vì một nỗi trăn trở thuần khiết: liệu bầy chim chìa vôi non ngoài bãi cát có bị dòng nước cuốn trôi...',
    updatedDate: '18/08/2026',
    author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
  },
];

const avatarColors = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-pink-500',
];

const RAW_NAMES: string[] = [
  'Phạm Việt Anh',
  'Trần Hữu Thế Anh',
  'Vũ Châu Anh',
  'Vũ Hồng Anh',
  'Dương Gia Bảo',
  'Lê Dương Gia Bảo',
  'Nguyễn Đức Bảo',
  'Nguyễn Quốc Bảo',
  'Nguyễn Ngọc Bảo Châu',
  'Đỗ Diệp Chi',
  'Nguyễn Ngọc Diệp (1)',
  'Nguyễn Ngọc Diệp (2)',
  'Hùng Tiến Duy',
  'Lê Minh Hiếu',
  'Đinh Gia Huy',
  'Vũ Nguyễn Hưng',
  'Trịnh Minh Khuê',
  'Hoàng Kiều Linh',
  'Huỳnh Phương Linh',
  'Đặng Gia Minh',
  'Nguyễn Chu Nhật Minh',
  'Nguyễn Công Minh',
  'Chu Thị Thuỷ Ngân',
  'Trần Thị Kim Ngân',
  'Nguyễn Trần Bảo Nghĩa',
  'Nguyễn Trần Bảo Ngọc',
  'Trần Bảo Ngọc',
  'Đào Trí Nguyễn',
  'Đinh Hà Phương',
  'Đinh Thảo Phương',
  'Nguyễn Đức Phú Quý',
  'Nguyễn Diệp Thanh',
  'Nguyễn Ngân Thảo',
  'Đàm Dương Yến Trang',
  'Chử Thành Trung',
  'Đào Minh Tuấn',
  'Đặng An Viên',
  'Vũ Hoàng Yến',
];

function generateWeeklyEvaluations(studentName: string, index: number): Record<number, WeeklyEvaluation> {
  const isHighPerformer = index % 3 === 0;
  const needsAttention = index === 6 || index === 14 || index === 27;

  const baseStars = needsAttention ? 3 : isHighPerformer ? 5 : 4;

  const week1: WeeklyEvaluation = {
    week: 1,
    title: 'Tuần 1 (18/08 - 24/08)',
    academic: isHighPerformer ? 'Xuất sắc' : 'Tốt',
    academicScore: isHighPerformer ? 5 : 4,
    discipline: 'Tốt',
    disciplineScore: 5,
    attitude: 'Tích cực',
    attitudeScore: 4,
    cooperation: 'Tốt',
    cooperationScore: 4,
    attendance: 'Tốt (Đúng giờ)',
    attendanceScore: 5,
    progressStars: 4,
    progressTrend: 'steady',
    strengths: 'Khởi động năm học mới hào hứng, hòa nhập nhanh với lớp.',
    improvements: 'Cần ổn định giờ giấc sinh hoạt sau kỳ nghỉ hè.',
    familyCoordination: 'Gia đình nhắc con chuẩn bị đầy đủ sách vở đầu năm.',
    teacherComment: `${studentName} khởi đầu tuần đầu tiên rất tích cực, chủ động làm quen với nội quy lớp 7C.`,
    subjectNotes: {
      math: 'Làm quen bài tập số hữu tỉ tốt.',
      literature: 'Tập trung nghe giảng bài thơ 4 chữ.',
      english: 'Tham gia trò chơi từ vựng vui vẻ.',
    },
    parentTip: 'Cha mẹ hãy cùng con lập thời khóa biểu học tập cố định tại nhà cho năm học mới.',
    isApproved: true,
  };

  const week2: WeeklyEvaluation = {
    week: 2,
    title: 'Tuần 2 (25/08 - 31/08)',
    academic: isHighPerformer ? 'Xuất sắc' : 'Khá tốt',
    academicScore: isHighPerformer ? 5 : 4,
    discipline: 'Tốt',
    disciplineScore: 5,
    attitude: 'Rất tích cực',
    attitudeScore: baseStars,
    cooperation: 'Tốt',
    cooperationScore: 4,
    attendance: 'Tốt (Đúng giờ)',
    attendanceScore: 5,
    progressStars: isHighPerformer ? 5 : 4,
    progressTrend: 'up',
    strengths: 'Chủ động giơ tay xây dựng bài, có ý thức giúp đỡ bạn bè cùng bàn.',
    improvements: 'Chữ viết đôi lúc còn hơi ẩu khi làm bài nhanh.',
    familyCoordination: 'Cùng nhắc nhở con nắn nót hơn trong vở bài tập.',
    teacherComment: `Cô khen ngợi tinh thần học tập hăng hái của ${studentName} trong các tiết học tuần này. Em tiếp tục phát huy nhé!`,
    subjectNotes: {
      math: 'Hiểu bài nhanh, giải toán hình chính xác.',
      literature: 'Cần chú ý dùng từ chuẩn xác hơn.',
      english: 'Luyện nghe phản xạ rất tốt.',
    },
    parentTip: 'Dành 10 phút tối nay để nghe con kể về một niềm vui ở lớp 7C.',
    isApproved: true,
  };

  const week3: WeeklyEvaluation = {
    week: 3,
    title: 'Tuần 3 (01/09 - 07/09)',
    academic: needsAttention ? 'Cần cố gắng' : isHighPerformer ? 'Xuất sắc' : 'Tốt',
    academicScore: needsAttention ? 3 : isHighPerformer ? 5 : 4,
    discipline: needsAttention ? 'Cần nhắc nhở' : 'Tốt',
    disciplineScore: needsAttention ? 3 : 5,
    attitude: needsAttention ? 'Chưa tập trung' : 'Tích cực',
    attitudeScore: needsAttention ? 3 : 5,
    cooperation: 'Tốt',
    cooperationScore: 4,
    attendance: 'Tốt (Đúng giờ)',
    attendanceScore: 5,
    progressStars: needsAttention ? 3 : isHighPerformer ? 5 : 4,
    progressTrend: needsAttention ? 'needs_attention' : 'up',
    strengths: needsAttention ? 'Có năng khiếu mỹ thuật và rất lễ phép.' : 'Tập trung cao độ, hoàn thành mọi bài tập nhóm xuất sắc.',
    improvements: needsAttention ? 'Còn mất tập trung trong tiết KHTN, đôi lúc quên đồ dùng.' : 'Cần mạnh dạn hơn khi phát biểu trước toàn thể khối.',
    familyCoordination: needsAttention ? 'Gia đình kiểm tra hòm đồ dùng học tập của con mỗi tối.' : 'Khuyến khích con tham gia đội văn nghệ hoặc thuyết trình.',
    teacherComment: needsAttention
      ? `Em ${studentName} ngoan ngoãn nhưng tuần này có phần lơ đãng. Cô mong con tập trung hơn trong giờ học nhé.`
      : `Tuần học tuyệt vời của ${studentName}! Em thể hiện sự tự tin rõ rệt và dẫn dắt nhóm học tập rất tốt.`,
    subjectNotes: {
      math: needsAttention ? 'Cần ôn lại phép cộng trừ số nguyên.' : 'Điểm 9 kiểm tra 15 phút.',
      literature: 'Bài viết có chiều sâu cảm xúc.',
      english: 'Giao tiếp trôi chảy với cô giáo bản ngữ.',
    },
    parentTip: 'Hỏi con về một câu hỏi khó trong tuần mà con đã tìm ra lời giải.',
    isApproved: true,
  };

  const week4: WeeklyEvaluation = {
    week: 4,
    title: 'Tuần 4 (08/09 - 14/09) - Tuần hiện tại',
    academic: needsAttention ? 'Khá tốt' : isHighPerformer ? 'Xuất sắc' : 'Tốt',
    academicScore: needsAttention ? 4 : isHighPerformer ? 5 : 4,
    discipline: 'Tốt',
    disciplineScore: 5,
    attitude: 'Rất tích cực',
    attitudeScore: isHighPerformer ? 5 : 4,
    cooperation: 'Tốt',
    cooperationScore: 5,
    attendance: 'Tốt (Đúng giờ)',
    attendanceScore: 5,
    progressStars: needsAttention ? 4 : isHighPerformer ? 5 : 5,
    progressTrend: 'up',
    strengths: 'Có tiến bộ vượt bậc, tích cực thảo luận nhóm và xung phong lên bảng.',
    improvements: 'Tiếp tục rèn luyện kỹ năng tóm tắt sơ đồ tư duy môn KHTN.',
    familyCoordination: 'Gia đình tiếp tục duy trì động viên con như tuần qua.',
    teacherComment: `${studentName} tuần này có sự nỗ lực rất đáng khen ngợi! Em nắm kiến thức bài học chắc chắn, chăm chỉ và chủ động giúp đỡ bạn. Cô Vân Anh rất tự hào về sự tiến bộ của em.`,
    subjectNotes: {
      math: 'Bài kiểm tra 1 tiết đạt kết quả rất tốt (9.0 điểm).',
      literature: 'Viết đoạn văn mạch lạc, cảm thụ tốt.',
      english: 'Hăng hái đóng kịch hội thoại theo nhóm.',
      science: 'Hoàn thành báo cáo thực hành quang hợp chu đáo.',
    },
    literatureWeekly: {
      grade: isHighPerformer ? 9.5 : needsAttention ? 7.0 : 8.5,
      gradeType: '15 phút - Cảm thụ thơ 5 chữ & Viết đoạn',
      comment: isHighPerformer
        ? `Bài viết của ${studentName} về bài thơ 'Gặp lá cơm nếp' rất sâu sắc, dẫn chứng chọn lọc và giàu cảm xúc.`
        : needsAttention
        ? `Cô khen ${studentName} đã hoàn thành bài viết đúng hạn. Em lưu ý dùng dấu câu và liên kết câu chặt chẽ hơn nhé.`
        : `${studentName} nắm vững kỹ năng viết đoạn văn biểu cảm, chữ viết sạch đẹp và có ý thức chuẩn bị bài tốt.`,
      readingLevel: isHighPerformer ? 'Xuất sắc' : needsAttention ? 'Đạt' : 'Tốt',
      writingLevel: isHighPerformer ? 'Xuất sắc' : needsAttention ? 'Khá' : 'Tốt',
    },
    parentTip: 'Tuần này con đang tiến bộ rất nhanh. Cha mẹ hãy dành cho con một lời khen cụ thể vào bữa tối để tiếp thêm động lực!',
    isApproved: true,
  };

  return { 1: week1, 2: week2, 3: week3, 4: week4 };
}

export const INITIAL_STUDENTS: Student[] = RAW_NAMES.map((name, idx) => {
  const codeNum = (idx + 1).toString().padStart(2, '0');
  const code = `7C${codeNum}`;
  const isFemale = name.includes('Châu Anh') || name.includes('Hồng Anh') || name.includes('Châu') ||
    name.includes('Chi') || name.includes('Diệp') || name.includes('Linh') ||
    name.includes('Ngân') || name.includes('Ngọc') || name.includes('Phương') ||
    name.includes('Thảo') || name.includes('Trang') || name.includes('Yến') || name.includes('Khuê') || name.includes('Viên');

  const color = avatarColors[idx % avatarColors.length];
  const needsAttention = idx === 6 || idx === 14 || idx === 27;
  const isHighPerformer = idx === 0 || idx === 1 || idx === 8 || idx === 18 || idx === 20 || idx === 32;

  const oralGrade = isHighPerformer ? 9.5 : needsAttention ? 7.0 : Math.round((8.0 + ((idx * 3) % 4) * 0.5) * 10) / 10;
  const test15m1Grade = isHighPerformer ? 9.0 : needsAttention ? 6.5 : Math.round((7.5 + ((idx * 2) % 4) * 0.5) * 10) / 10;
  const test15m2Grade = isHighPerformer ? 9.5 : needsAttention ? 7.0 : Math.round((8.0 + ((idx * 5) % 4) * 0.5) * 10) / 10;
  const periodGrade = isHighPerformer ? 9.0 : needsAttention ? 6.75 : Math.round((7.75 + ((idx * 7) % 4) * 0.5) * 10) / 10;
  const avg = Math.round(((oralGrade + test15m1Grade + test15m2Grade + periodGrade * 2) / 5) * 10) / 10;

  const literatureGrades: LiteratureGradeRecord = {
    oral: oralGrade,
    test15m1: test15m1Grade,
    test15m2: test15m2Grade,
    periodTest: periodGrade,
    midterm: null, // Chưa thi
    semesterAverage: avg,
    feedback: isHighPerformer
      ? 'Cảm thụ văn học rất tinh tế, cảm xúc sâu sắc. Đoạn văn viết giàu hình ảnh và lập luận chặt chẽ.'
      : needsAttention
      ? 'Có cố gắng khi viết bài. Cần chú ý lỗi chính tả, ngắt câu và đọc kỹ đề bài hơn.'
      : 'Nắm chắc kiến thức bài học, tích cực xây dựng bài trên lớp. Bài viết tiến bộ rõ rệt.',
    writingSkill: isHighPerformer ? 'Xuất sắc' : needsAttention ? 'Khá' : 'Tốt',
    readingSkill: isHighPerformer ? 'Cảm thụ rất tốt' : needsAttention ? 'Nắm ý cơ bản' : 'Nắm chắc ý chính',
  };

  return {
    id: code,
    code,
    name,
    dob: `2011-0${(idx % 9) + 1}-${((idx * 3) % 25) + 1}`,
    gender: isFemale ? 'Nữ' : 'Nam',
    parentName: `Phụ huynh em ${name}`,
    parentPhone: `09${Math.floor(10000000 + Math.random() * 89999999)}`,
    avatarColor: color,
    avatarIcon: isFemale ? '👧' : '👦',
    needsAttention,
    attentionReason: needsAttention ? 'Cần hỗ trợ thêm môn Toán và rèn nề nếp tập trung' : undefined,
    weeklyEvaluations: generateWeeklyEvaluations(name, idx),
    literatureGrades,
    badges: [
      {
        id: `b1-${code}`,
        title: 'Học sinh tiến bộ',
        icon: '🏅',
        date: '10/09/2026',
        description: 'Được tuyên dương vì sự nỗ lực vươn lên trong học tập',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
      },
      {
        id: `b2-${code}`,
        title: 'Chăm học chăm làm',
        icon: '📚',
        date: '03/09/2026',
        description: 'Hoàn thành 100% bài tập về nhà đúng hạn',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
      },
      {
        id: `b3-${code}`,
        title: 'Đồng đội tuyệt vời',
        icon: '🤝',
        date: '27/08/2026',
        description: 'Tích cực hỗ trợ bạn bè trong các hoạt động nhóm',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      },
    ],
    portfolio: [
      {
        id: `p1-${code}`,
        title: 'Sơ đồ tư duy môn Khoa học Tự nhiên',
        type: 'Dự án học tập',
        date: '09/09/2026',
        description: 'Bản đồ tư duy tổng hợp chủ đề Tế bào sinh học với hình vẽ minh họa sáng tạo.',
      },
      {
        id: `p2-${code}`,
        title: 'Bài thuyết trình Lịch sử & Địa lí',
        type: 'Sản phẩm sáng tạo',
        date: '02/09/2026',
        description: 'Tham gia thiết kế slide và thuyết trình về nền văn minh Đại Việt.',
      },
      {
        id: `p3-${code}`,
        title: 'Giấy khen Nụ cười Tân Khai',
        type: 'Giấy khen',
        date: '05/09/2026',
        description: 'Được lớp và Cô Vân Anh bình chọn gương mặt tích cực đầu năm học.',
      },
    ],
    personalGoal: 'Đạt điểm 9 môn Ngữ Văn giữa kỳ I và tự tin phát biểu ít nhất 2 lần mỗi ngày.',
    parentMessages: [
      {
        id: `msg-${code}-1`,
        date: '11/09/2026 19:30',
        sender: `Phụ huynh em ${name}`,
        content: 'Chào cô Vân Anh ạ. Tuần này cháu về khoe được cô khen ở lớp, gia đình rất vui và cảm ơn cô đã luôn sát sao với con ạ!',
        reply: 'Dạ cô chào gia đình ạ! Con tuần này rất ngoan và chăm chỉ, cô trò mình tiếp tục cùng đồng hành động viên con nhé!',
        repliedAt: '11/09/2026 20:15',
      },
    ],
  };
});

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: '🔴 Lịch kiểm tra giữa học kỳ I & Ôn tập môn Ngữ Văn Lớp 7C',
    category: 'important',
    date: '11/09/2026',
    author: 'Cô Vân Anh - Giáo viên Ngữ Văn',
    pinned: true,
    content:
      'Kính gửi Quý phụ huynh lớp 7C!\n\nNhà trường dự kiến tổ chức kiểm tra giữa học kỳ I môn Ngữ Văn vào tuần thứ 9. Trong 2 tuần tới, Cô Vân Anh sẽ tăng cường ôn tập kiến thức trọng tâm đọc hiểu và rèn kỹ năng viết đoạn văn. Đề nghị Quý phụ huynh phối hợp nhắc nhở các con hoàn thành bài tập về nhà, giữ gìn sức khỏe và ngủ đủ giấc.\n\nTrân trọng!',
  },
  {
    id: 'ann-2',
    title: '🟡 Nhắc việc: Chuẩn bị văn bản bài học Ngữ Văn thứ Sáu',
    category: 'reminder',
    date: '10/09/2026',
    author: 'Cô Vân Anh - Giáo viên Ngữ Văn',
    pinned: false,
    content:
      'Thứ Sáu ngày 13/09, lớp 7C có tiết Đọc - hiểu Ngữ Văn (Văn bản "Gặp lá cơm nếp"). Các con nhớ soạn bài trước theo phiếu học tập, đọc kỹ phần tri thức Ngữ Văn và mang đầy đủ sách giáo khoa.',
  },
  {
    id: 'ann-3',
    title: '🟢 Tuyên dương: Lớp 7C đạt nhiều điểm tốt môn Ngữ Văn tuần 4',
    category: 'achievement',
    date: '08/09/2026',
    author: 'Cô Vân Anh - Giáo viên Ngữ Văn',
    pinned: false,
    content:
      'Nhiệt liệt biểu dương tinh thần tích cực, sáng tạo của các bạn học sinh 7C trong các tiết học Ngữ Văn tuần qua! Nhiều bạn đã có những đoạn văn biểu cảm giàu cảm xúc và phát biểu sôi nổi trong giờ học.',
  },
  {
    id: 'ann-4',
    title: '🟡 Nhắc việc: Đăng ký tham gia Câu lạc bộ Đọc sách & Sáng tác văn học',
    category: 'reminder',
    date: '05/09/2026',
    author: 'Cô Vân Anh - Giáo viên Ngữ Văn',
    pinned: false,
    content:
      'Cô Vân Anh mở câu lạc bộ Đọc sách và rèn kỹ năng viết văn dành cho các bạn học sinh 7C có niềm đam mê văn học. Phụ huynh có nhu cầu đăng ký cho con xin gửi tin nhắn cho Cô trước ngày 15/09.',
  },
];
