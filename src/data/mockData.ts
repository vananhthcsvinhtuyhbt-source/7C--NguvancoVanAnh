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

function generateWeeklyEvaluations(_studentName: string, _index: number): Record<number, WeeklyEvaluation> {
  const createEmptyWeek = (week: number, title: string): WeeklyEvaluation => ({
    week,
    title,
    academic: 'Chưa đánh giá',
    academicScore: 0,
    discipline: 'Chưa đánh giá',
    disciplineScore: 0,
    attitude: 'Chưa đánh giá',
    attitudeScore: 0,
    cooperation: 'Chưa đánh giá',
    cooperationScore: 0,
    attendance: 'Đúng giờ',
    attendanceScore: 5,
    progressStars: 0,
    progressTrend: 'steady',
    strengths: '',
    improvements: '',
    familyCoordination: '',
    teacherComment: '',
    subjectNotes: {
      math: '',
      literature: '',
      english: '',
    },
    literatureWeekly: {
      grade: null,
      gradeType: '',
      comment: '',
      readingLevel: '',
      writingLevel: '',
    },
    parentTip: '',
    isApproved: false,
  });

  return {
    1: createEmptyWeek(1, 'Tuần 1 (18/08 - 24/08)'),
    2: createEmptyWeek(2, 'Tuần 2 (25/08 - 31/08)'),
    3: createEmptyWeek(3, 'Tuần 3 (01/09 - 07/09)'),
    4: createEmptyWeek(4, 'Tuần 4 (08/09 - 14/09) - Tuần hiện tại'),
  };
}

export const INITIAL_STUDENTS: Student[] = RAW_NAMES.map((name, idx) => {
  const codeNum = (idx + 1).toString().padStart(2, '0');
  const code = `7C${codeNum}`;
  const isFemale = name.includes('Châu Anh') || name.includes('Hồng Anh') || name.includes('Châu') ||
    name.includes('Chi') || name.includes('Diệp') || name.includes('Linh') ||
    name.includes('Ngân') || name.includes('Ngọc') || name.includes('Phương') ||
    name.includes('Thảo') || name.includes('Trang') || name.includes('Yến') || name.includes('Khuê') || name.includes('Viên');

  const color = avatarColors[idx % avatarColors.length];
  const needsAttention = false;

  const literatureGrades: LiteratureGradeRecord = {
    oral: null,
    test15m1: null,
    test15m2: null,
    periodTest: null,
    midterm: null,
    finalExam: null,
    semesterAverage: null,
    averageScore: null,
    isCustomAverage: false,
    isApproved: false,
    feedback: '',
    teacherRemarks: '',
    writingSkill: '',
    readingSkill: '',
    oralSkill: '',
    oralScores: [],
    fifteenMinScores: [],
    onePeriodScores: [],
    midTermScore: null,
    finalTermScore: null,
    readingCompetency: '',
    writingCompetency: '',
    speakingListeningCompetency: '',
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
    attentionReason: undefined,
    weeklyEvaluations: generateWeeklyEvaluations(name, idx),
    literatureGrades,
    badges: [],
    portfolio: [],
    personalGoal: '',
    parentMessages: [],
  };
});

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

