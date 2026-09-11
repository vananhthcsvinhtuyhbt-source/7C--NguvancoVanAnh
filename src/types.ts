export interface WeekInfo {
  week: number;
  title: string; // e.g. "Tuần 4 (08/09 - 14/09)"
  startDate?: string;
  endDate?: string;
  focusTheme?: string;
  isCurrent?: boolean;
}

export interface ClassInfo {
  name: string;
  school: string;
  homeroomTeacher: string;
  teacherTitle: string;
  teacherRole: string;
  academicYear: string;
  totalStudents: number;
  currentWeek: number;
}

export interface WeeklyEvaluation {
  week: number;
  title: string; // e.g. "Tuần 4 (08/09 - 14/09)"
  academic: 'Xuất sắc' | 'Tốt' | 'Khá tốt' | 'Cần cố gắng';
  academicScore: number; // 1 - 5 stars
  discipline: 'Tốt' | 'Khá tốt' | 'Cần nhắc nhở';
  disciplineScore: number; // 1 - 5 stars
  attitude: 'Rất tích cực' | 'Tích cực' | 'Chưa tập trung';
  attitudeScore: number; // 1 - 5 stars
  cooperation: 'Tốt' | 'Khá tốt' | 'Cần hòa đồng hơn';
  cooperationScore: number; // 1 - 5 stars
  attendance: 'Tốt (Đúng giờ)' | 'Nghỉ có phép' | 'Đi muộn';
  attendanceScore: number; // 1 - 5 stars
  progressStars: number; // 1 - 5 stars
  progressTrend: 'up' | 'steady' | 'needs_attention';

  // Specific weekly notes
  strengths: string;
  improvements: string;
  familyCoordination: string;
  teacherComment: string;

  // Subject notes
  subjectNotes?: {
    math?: string;
    literature?: string;
    english?: string;
    science?: string;
  };

  // Specific literature evaluation from Teacher Van Anh
  literatureWeekly?: {
    grade?: number | null;
    gradeType?: string;
    comment?: string;
    readingLevel?: string;
    writingLevel?: string;
    score?: number | null;
    feedback?: string;
    lessonTitle?: string;
    readingSkill?: string;
    writingSkill?: string;
  };

  parentTip: string; // "Gợi ý dành cho cha mẹ"
  isApproved: boolean; // Cô giáo đã duyệt hay chưa
}

export interface LiteratureGradeRecord {
  oral?: number | null; // Điểm miệng (hệ số 1)
  test15m1?: number | null; // Điểm 15 phút đợt 1
  test15m2?: number | null; // Điểm 15 phút đợt 2
  periodTest?: number | null; // Điểm 1 tiết / viết đoạn văn biểu cảm
  midterm?: number | null; // Điểm thi giữa kỳ (hệ số 2)
  finalExam?: number | null; // Điểm thi cuối kỳ (hệ số 3)
  semesterAverage?: number | null; // ĐTB môn Ngữ Văn
  isCustomAverage?: boolean; // Cô tự tay điều chỉnh ĐTB riêng biệt
  feedback?: string; // Lời phê chuyên môn Ngữ Văn của Cô Vân Anh
  writingSkill?: string; // Kỹ năng viết đoạn/bài
  readingSkill?: string; // Kỹ năng đọc - hiểu & cảm thụ
  customNote?: string; // Ghi chú riêng
  // Compatibility aliases for ParentView:
  averageScore?: number | null;
  oralScores?: (number | null)[];
  fifteenMinScores?: (number | null)[];
  onePeriodScores?: (number | null)[];
  midTermScore?: number | null;
  finalTermScore?: number | null | string;
  teacherRemarks?: string;
  readingCompetency?: string;
  writingCompetency?: string;
  speakingListeningCompetency?: string;
}

export interface LiteratureLessonContent {
  id: string;
  week: number;
  title: string; // Tên tác phẩm / văn bản (ví dụ: "Gặp lá cơm nếp")
  topic: string; // Chủ đề lớn (ví dụ: "Bài 2: Khúc nhạc tâm hồn")
  keyKnowledge: string; // Trọng tâm kiến thức & Thực hành Tiếng Việt
  homework: string; // Nhiệm vụ bài tập & chuẩn bị bài ở nhà
  sampleExcerpt?: string; // Đoạn văn mẫu / bài viết tham khảo cô gửi
  updatedDate: string;
  author: string; // "Cô Vân Anh - Giáo viên môn Ngữ Văn"
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  date: string;
  description: string;
  color: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'Dự án học tập' | 'Giấy khen' | 'Hoạt động ngoại khóa' | 'Sản phẩm sáng tạo';
  date: string;
  description: string;
  image?: string;
}

export interface ParentMessage {
  id: string;
  date: string;
  sender: string; // e.g. "Phụ huynh em Nguyễn Minh Anh"
  content: string;
  reply?: string;
  repliedAt?: string;
}

export interface Student {
  id: string; // e.g. "7C01"
  code: string;
  name: string;
  dob: string;
  gender: 'Nam' | 'Nữ';
  parentName: string;
  parentPhone: string;
  avatarColor: string;
  avatarIcon: string;
  needsAttention?: boolean; // Học sinh cần cô giáo quan tâm đặc biệt
  attentionReason?: string;

  weeklyEvaluations: Record<number, WeeklyEvaluation>; // week number -> eval
  literatureGrades: LiteratureGradeRecord; // Sổ điểm & đánh giá môn Ngữ Văn của Cô Vân Anh
  badges: Badge[];
  portfolio: PortfolioItem[];
  personalGoal: string; // Mục tiêu cá nhân của con
  parentMessages: ParentMessage[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'important' | 'reminder' | 'achievement'; // 🔴, 🟡, 🟢
  date: string;
  author: string; // Cô Vân Anh - Giáo viên môn Ngữ Văn
  pinned?: boolean;
}
