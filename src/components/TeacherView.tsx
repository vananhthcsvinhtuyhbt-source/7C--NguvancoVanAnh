import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Student, WeeklyEvaluation } from '../types';
import { COMMENT_BANK } from '../data/mockData';
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Search,
  Filter,
  Plus,
  Send,
  Printer,
  Edit3,
  BookmarkPlus,
  Trash2,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Award,
  KeyRound,
  FileSpreadsheet,
  X,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { LiteratureGradebook } from './LiteratureGradebook';
import { LiteratureLessonManager } from './LiteratureLessonManager';

export const TeacherView: React.FC = () => {
  const {
    students,
    selectedWeek,
    setSelectedWeek,
    updateEvaluation,
    batchApproveEvaluations,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    replyParentMessage,
    toggleNeedsAttention,
    addBadge,
    classInfo,
    setCurrentStudentId,
    setRole,
  } = useClass();

  // Admin Active Tab
  const [activeAdminTab, setActiveAdminTab] = useState<
    'evaluations' | 'literature_grades' | 'literature_lessons' | 'announcements' | 'messages'
  >('evaluations');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs_attention' | 'unapproved' | 'approved'>('all');

  // Fast Comment Composer Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedAttitudeTags, setSelectedAttitudeTags] = useState<string[]>([]);
  const [selectedStudyTags, setSelectedStudyTags] = useState<string[]>([]);
  const [selectedCoopTags, setSelectedCoopTags] = useState<string[]>([]);
  const [selectedDisciplineTags, setSelectedDisciplineTags] = useState<string[]>([]);
  const [customStrengths, setCustomStrengths] = useState('');
  const [customImprovements, setCustomImprovements] = useState('');
  const [customTeacherComment, setCustomTeacherComment] = useState('');
  const [customParentTip, setCustomParentTip] = useState('');
  const [customAcademicScore, setCustomAcademicScore] = useState(4);
  const [customDisciplineScore, setCustomDisciplineScore] = useState(5);
  const [customProgressStars, setCustomProgressStars] = useState(4);

  // Literature evaluation in modal
  const [customLitScore, setCustomLitScore] = useState<string>('');
  const [customLitFeedback, setCustomLitFeedback] = useState<string>('');
  const [customLitLesson, setCustomLitLesson] = useState<string>('');

  // AI Generation State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessBadge, setAiSuccessBadge] = useState(false);

  // Announcement Composer Modal
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState<'important' | 'reminder' | 'achievement'>('important');

  // Print/Report Modal
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Reply Parent Message Modal
  const [replyingStudent, setReplyingStudent] = useState<{ student: Student; messageId: string } | null>(null);
  const [replyText, setReplyText] = useState('');

  // Quick badge awarding
  const [awardingBadgeStudent, setAwardingBadgeStudent] = useState<Student | null>(null);
  const [badgeTitle, setBadgeTitle] = useState('Học sinh tiến bộ');

  // Summary Metrics
  const totalStudents = students.length;
  const needsAttentionCount = students.filter((s) => s.needsAttention).length;
  const approvedCount = students.filter((s) => s.weeklyEvaluations[selectedWeek]?.isApproved).length;
  const unapprovedCount = totalStudents - approvedCount;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === 'needs_attention') return s.needsAttention;
    if (filterType === 'unapproved') return !s.weeklyEvaluations[selectedWeek]?.isApproved;
    if (filterType === 'approved') return s.weeklyEvaluations[selectedWeek]?.isApproved;
    return true;
  });

  // Open Fast Comment Composer for a student
  const openComposer = (student: Student) => {
    const currentEval: Partial<WeeklyEvaluation> = student.weeklyEvaluations[selectedWeek] || {
      academicScore: 4,
      disciplineScore: 5,
      progressStars: 4,
      strengths: '',
      improvements: '',
      teacherComment: '',
      parentTip: '',
    };

    setEditingStudent(student);
    setSelectedAttitudeTags(['Tích cực, hăng hái']);
    setSelectedStudyTags(['Nắm chắc kiến thức bài học']);
    setSelectedCoopTags(['Hợp tác nhóm rất tốt, trách nhiệm']);
    setSelectedDisciplineTags(['Nề nếp học tập rất chuẩn mực']);
    setCustomStrengths(currentEval.strengths || 'Tích cực tham gia xây dựng bài');
    setCustomImprovements(currentEval.improvements || 'Cần tự tin hơn khi trình bày');
    setCustomTeacherComment(currentEval.teacherComment || `${student.name} có ý thức học tập tốt, ngoan ngoãn và tiến bộ.`);
    setCustomParentTip(currentEval.parentTip || 'Gia đình tiếp tục động viên và lắng nghe con chia sẻ về bài học trên lớp.');
    setCustomAcademicScore(currentEval.academicScore || 4);
    setCustomDisciplineScore(currentEval.disciplineScore || 5);
    setCustomProgressStars(currentEval.progressStars || 4);

    // Literature weekly evaluations
    const litWeekly = currentEval.literatureWeekly || {};
    setCustomLitScore(
      litWeekly.score !== undefined && litWeekly.score !== null
        ? String(litWeekly.score)
        : student.literatureGrades?.periodTest
        ? String(student.literatureGrades.periodTest)
        : ''
    );
    setCustomLitFeedback(litWeekly.feedback || student.literatureGrades?.feedback || '');
    setCustomLitLesson(litWeekly.lessonTitle || 'Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn');
  };

  // Combine checked tags into comment
  const handleAutoCombineFromTags = () => {
    if (!editingStudent) return;
    const attitudes = selectedAttitudeTags.join(', ');
    const studies = selectedStudyTags.join(', ');
    const disciplines = selectedDisciplineTags.join(', ');

    const combined = `Em ${editingStudent.name} tuần này có thái độ ${attitudes.toLowerCase() || 'tích cực'}. Về học tập, em ${studies.toLowerCase() || 'nắm chắc bài'}. Nề nếp: ${disciplines.toLowerCase() || 'rất tốt'}. Điểm sáng: ${customStrengths || 'chăm chỉ'}. Cô lưu ý em ${customImprovements || 'cần mạnh dạn hơn'}.`;
    const parentTipCombined = `Gợi ý cha mẹ: Tuần này con đang cần rèn luyện ${customImprovements || 'sự tự tin'}. Cha mẹ hãy dành 10 phút mỗi tối để khích lệ con trình bày lại một điều con học được hôm nay.`;

    setCustomTeacherComment(combined);
    setCustomParentTip(parentTipCombined);
  };

  // Call Gemini AI on backend to polish and individualize comment
  const handleGenerateAiComment = async () => {
    if (!editingStudent) return;
    setIsGeneratingAi(true);
    setAiSuccessBadge(false);

    try {
      const response = await fetch('/api/gemini/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: editingStudent.name,
          currentWeek: `Tuần ${selectedWeek}`,
          attitudeTags: selectedAttitudeTags,
          studyTags: selectedStudyTags,
          strengths: customStrengths,
          improvements: customImprovements,
        }),
      });

      const data = await response.json();
      if (data.comment) {
        setCustomTeacherComment(data.comment);
      }
      if (data.parentTip) {
        setCustomParentTip(data.parentTip);
      }
      setAiSuccessBadge(true);
      setTimeout(() => setAiSuccessBadge(false), 4000);
    } catch (err) {
      console.error('Error generating comment:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save changes to student's weekly evaluation
  const handleSaveComposer = () => {
    if (!editingStudent) return;

    updateEvaluation(editingStudent.id, selectedWeek, {
      academicScore: customAcademicScore,
      academic: customAcademicScore === 5 ? 'Xuất sắc' : customAcademicScore === 4 ? 'Tốt' : 'Khá tốt',
      disciplineScore: customDisciplineScore,
      discipline: customDisciplineScore === 5 ? 'Tốt' : 'Khá tốt',
      progressStars: customProgressStars,
      progressTrend: customProgressStars >= 4 ? 'up' : 'steady',
      strengths: customStrengths,
      improvements: customImprovements,
      teacherComment: customTeacherComment,
      parentTip: customParentTip,
      isApproved: true,
      literatureWeekly: {
        lessonTitle: customLitLesson || 'Văn bản Ngữ Văn tuần này',
        score: customLitScore !== '' ? parseFloat(customLitScore) : undefined,
        feedback: customLitFeedback.trim() || undefined,
        writingSkill: 'Tốt',
        readingSkill: 'Nắm chắc kiến thức',
      },
    });

    setEditingStudent(null);
  };

  // Submit announcement
  const handleAddAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) return;

    addAnnouncement({
      title: newAnnTitle.trim(),
      content: newAnnContent.trim(),
      category: newAnnCategory,
      date: new Date().toLocaleDateString('vi-VN'),
      author: 'Cô Vân Anh - Giáo viên Ngữ Văn',
      pinned: newAnnCategory === 'important',
    });

    setNewAnnTitle('');
    setNewAnnContent('');
    setShowAnnounceModal(false);
  };

  // Reply parent message
  const handleSendReply = () => {
    if (!replyingStudent || !replyText.trim()) return;
    replyParentMessage(replyingStudent.student.id, replyingStudent.messageId, replyText.trim());
    setReplyingStudent(null);
    setReplyText('');
  };

  // Award badge
  const handleAwardBadge = () => {
    if (!awardingBadgeStudent) return;
    addBadge(awardingBadgeStudent.id, {
      title: badgeTitle,
      icon: badgeTitle.includes('tiến bộ') ? '🏅' : badgeTitle.includes('Chăm học') ? '📚' : badgeTitle.includes('Đồng đội') ? '🤝' : '⭐',
      date: new Date().toLocaleDateString('vi-VN'),
      description: `Cô Vân Anh tuyên dương và tặng huy hiệu khích lệ trong Tuần ${selectedWeek}.`,
      color: 'bg-amber-100 text-amber-800 border-amber-300',
    });
    setAwardingBadgeStudent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-sans text-slate-800">
      
      {/* Top Banner: 7C Quản lý lớp */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                  <span>🌸</span> 7C - HỌC VĂN CÙNG CÔ VÂN ANH
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Môn Ngữ Văn 7 📖
                </span>
                <span className="text-xs text-slate-500 font-medium">Năm học 2024 - 2025 ✨</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5 flex items-center gap-2">
                <span>Cô Vân Anh</span>
                <span className="text-rose-500 text-xl font-normal">•</span>
                <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                  Góc Quản lý Lớp 7C & Môn Ngữ Văn
                </span>
                <span className="text-amber-500 text-lg animate-soft-pulse hidden sm:inline">🌷</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <span>Giáo viên môn Ngữ Văn: <strong className="text-slate-900">{classInfo.homeroomTeacher}</strong></span>
                <span className="text-slate-300">•</span>
                <span>{classInfo.school}</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 font-semibold">38 bạn nhỏ thân yêu 🎒</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-batch-approve"
                onClick={() => batchApproveEvaluations(selectedWeek)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Duyệt tất cả nhận xét trong tuần này cho phụ huynh xem"
              >
                <CheckCircle2 className="w-4 h-4" /> Duyệt nhanh tuần {selectedWeek} ({totalStudents} em)
              </button>

              <button
                id="btn-new-announcement"
                onClick={() => setShowAnnounceModal(true)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" /> Đăng thông báo
              </button>

              <button
                id="btn-print-report"
                onClick={() => setShowPrintModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-300 transition-colors"
              >
                <Printer className="w-4 h-4" /> Xuất phiếu/Báo cáo
              </button>
            </div>
          </div>

          {/* 3 Prominent Metric KPI Blocks as requested */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
            
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">Sĩ số lớp 7C</p>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                  {totalStudents}/{totalStudents} <span className="text-xs font-normal text-slate-500">học sinh</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-emerald-800">Nhận xét đã duyệt Tuần {selectedWeek}</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-900 mt-0.5">
                  {approvedCount}/{totalStudents} <span className="text-xs font-normal text-emerald-700">đã gửi PH</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-colors ${
              needsAttentionCount > 0
                ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <p className="text-xs font-semibold text-rose-800">Học sinh cần quan tâm</p>
                <p className="text-xl sm:text-2xl font-bold text-rose-900 mt-0.5">
                  {needsAttentionCount} <span className="text-xs font-normal text-rose-700">học sinh cần sát sao</span>
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* 5 Admin Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-6 pt-4 border-t border-slate-200">
            <button
              id="admin-nav-evaluations"
              onClick={() => setActiveAdminTab('evaluations')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'evaluations'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Sổ nhận xét tuần ({totalStudents})</span>
            </button>

            <button
              id="admin-nav-literature-grades"
              onClick={() => setActiveAdminTab('literature_grades')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'literature_grades'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. Sổ điểm Ngữ Văn (Nhập điểm)</span>
            </button>

            <button
              id="admin-nav-literature-lessons"
              onClick={() => setActiveAdminTab('literature_lessons')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'literature_lessons'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>3. Kế hoạch & Dặn dò bài học</span>
            </button>

            <button
              id="admin-nav-announcements"
              onClick={() => setActiveAdminTab('announcements')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'announcements'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>4. Thông báo lớp ({announcements.length})</span>
            </button>

            <button
              id="admin-nav-messages"
              onClick={() => setActiveAdminTab('messages')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'messages'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>5. Hộp thư phụ huynh ({students.reduce((acc, s) => acc + s.parentMessages.length, 0)})</span>
            </button>
          </div>

          {/* Week Selector Bar - When activeAdminTab === 'evaluations' */}
          {activeAdminTab === 'evaluations' && (
            <div className="flex items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 overflow-x-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  Chọn tuần đánh giá:
                </span>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4].map((w) => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedWeek === w
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Tuần {w} {w === 4 ? '⭐ (Hiện tại)' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick search input */}
              <div className="relative min-w-[200px] sm:min-w-[260px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc mã HS (vd: 7C01)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. TAB: SỔ NHẬN XÉT TUẦN                                 */}
      {/* ======================================================== */}
      {activeAdminTab === 'evaluations' && (
        <>
          {/* Filter Chips Bar */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                  filterType === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Tất cả ({totalStudents})
              </button>

              <button
                onClick={() => setFilterType('needs_attention')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  filterType === 'needs_attention'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>⚠️</span> Cần quan tâm ({needsAttentionCount})
              </button>

              <button
                onClick={() => setFilterType('unapproved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  filterType === 'unapproved'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>✏️</span> Chưa duyệt tuần này ({unapprovedCount})
              </button>

              <button
                onClick={() => setFilterType('approved')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                  filterType === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <span>✅</span> Đã duyệt ({approvedCount})
              </button>
            </div>
          </div>

      {/* Main Student List Table (Exact Table Structure from Prompt) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Mã HS</th>
                  <th className="py-3.5 px-4">Họ và tên học sinh</th>
                  <th className="py-3.5 px-4 text-center">Học tập</th>
                  <th className="py-3.5 px-4 text-center">Nề nếp</th>
                  <th className="py-3.5 px-4 text-center">Tiến bộ</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-4">Nhận xét tóm tắt của Cô</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      Không tìm thấy học sinh nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s, idx) => {
                    const ev = s.weeklyEvaluations[selectedWeek] || s.weeklyEvaluations[4];
                    const isApproved = ev?.isApproved;

                    return (
                      <tr
                        key={s.id}
                        className={`hover:bg-indigo-50/30 transition-colors ${
                          s.needsAttention ? 'bg-rose-50/30' : ''
                        }`}
                      >
                        {/* Student Code */}
                        <td className="py-3 px-4 font-mono font-bold text-slate-600 whitespace-nowrap">
                          {s.code}
                        </td>

                        {/* Name & Avatar */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full ${s.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0`}>
                              {s.avatarIcon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900">{s.name}</span>
                                {s.needsAttention && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 font-semibold">
                                    Cần quan tâm
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {s.parentPhone} • {s.parentName}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Học tập */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-amber-500 font-bold text-xs">
                              {'★'.repeat(ev?.academicScore || 4)}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">{ev?.academic || 'Tốt'}</span>
                          </div>
                        </td>

                        {/* Nề nếp */}
                        <td className="py-3 px-4 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className="text-amber-500 font-bold text-xs">
                              {'★'.repeat(ev?.disciplineScore || 5)}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">{ev?.discipline || 'Tốt'}</span>
                          </div>
                        </td>

                        {/* Tiến bộ (↑ / →) */}
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
                            ev?.progressTrend === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {ev?.progressTrend === 'up' ? '↑ Tiến bộ' : '→ Ổn định'}
                          </span>
                        </td>

                        {/* Status (Duyệt hay chưa) */}
                        <td className="py-3 px-4 text-center">
                          {isApproved ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Đã gửi
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              ✏️ Chờ duyệt
                            </span>
                          )}
                        </td>

                        {/* Snippet Comment */}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-xs text-slate-600 truncate" title={ev?.teacherComment}>
                            {ev?.teacherComment || 'Chưa nhập nhận xét...'}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Soạn nhận xét nhanh / Edit */}
                            <button
                              id={`edit-comment-${s.id}`}
                              onClick={() => openComposer(s)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs transition-colors flex items-center gap-1"
                              title="Soạn nhận xét bằng Ngân hàng mẫu & AI"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Nhận xét
                            </button>

                            {/* Award badge */}
                            <button
                              onClick={() => setAwardingBadgeStudent(s)}
                              className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Tặng huy hiệu khen thưởng"
                            >
                              <Award className="w-4 h-4" />
                            </button>

                            {/* View parent view for this student */}
                            <button
                              onClick={() => {
                                setCurrentStudentId(s.id);
                                setRole('parent');
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                              title="Xem góc nhìn Phụ huynh của em này"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>

                            {/* Toggle Attention */}
                            <button
                              onClick={() => toggleNeedsAttention(s.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                s.needsAttention
                                  ? 'text-rose-600 hover:bg-rose-50'
                                  : 'text-slate-300 hover:text-slate-500'
                              }`}
                              title={s.needsAttention ? 'Bỏ đánh dấu cần quan tâm' : 'Đánh dấu cần quan tâm'}
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <span>Hiển thị <strong>{filteredStudents.length}</strong> / 38 học sinh Lớp 7C</span>
            <span>Trường THCS Tân Khai • Hệ thống Sổ liên lạc điện tử</span>
          </div>

        </div>
      </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 2. TAB: SỔ ĐIỂM NGỮ VĂN (CÔ VÂN ANH)                     */}
      {/* ======================================================== */}
      {activeAdminTab === 'literature_grades' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <LiteratureGradebook />
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TAB: KẾ HOẠCH & DẶN DÒ BÀI HỌC (CÔ VÂN ANH)           */}
      {/* ======================================================== */}
      {activeAdminTab === 'literature_lessons' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <LiteratureLessonManager />
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB: THÔNG BÁO LỚP 7C                                 */}
      {/* ======================================================== */}
      {activeAdminTab === 'announcements' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookmarkPlus className="w-5 h-5 text-amber-600" />
                  Bảng tin & Thông báo Lớp 7C
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Đăng dặn dò, lịch thi, sự kiện lớp học gửi trực tiếp đến toàn thể phụ huynh
                </p>
              </div>
              <button
                onClick={() => setShowAnnounceModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Đăng thông báo mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    ann.pinned
                      ? 'bg-rose-50/40 border-rose-200'
                      : ann.category === 'reminder'
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ann.category === 'important'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.category === 'reminder'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ann.pinned ? '📌 ' : ''}{ann.category === 'important' ? 'Quan trọng' : ann.category === 'reminder' ? 'Nhắc nhở' : 'Thành tích'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{ann.date}</span>
                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base mb-1.5">{ann.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {ann.content}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Đăng bởi: <strong>{ann.author}</strong></span>
                    <span className="text-[11px] text-indigo-600 font-semibold">Tất cả PH 7C đều thấy</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB: HỘP THƯ PHỤ HUYNH                                */}
      {/* ======================================================== */}
      {(activeAdminTab === 'messages' || activeAdminTab === 'evaluations') && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Hộp thư phản hồi từ Phụ huynh Lớp 7C
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ý kiến, lời cảm ơn và trao đổi trực tiếp của cha mẹ học sinh gửi cô Vân Anh
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {students.reduce((acc, s) => acc + s.parentMessages.length, 0)} tin nhắn
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {students
                .flatMap((s) => s.parentMessages.map((m) => ({ ...m, student: s })))
                .map((msg) => (
                  <div key={msg.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{msg.sender} (HS: {msg.student.name})</span>
                      <span className="text-slate-400">{msg.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-slate-100">
                      "{msg.content}"
                    </p>
                    {msg.reply ? (
                      <div className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-xl border border-indigo-100">
                        <strong>Cô Vân Anh đã trả lời:</strong> "{msg.reply}"
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingStudent({ student: msg.student, messageId: msg.id })}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Trả lời phụ huynh
                      </button>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: NGÂN HÀNG NHẬN XÉT & TRỢ LÝ AI SOẠN SIÊU TỐC       */}
      {/* ======================================================== */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold font-mono">
                  Mã {editingStudent.code} • Tuần {selectedWeek}
                </span>
                <h3 className="text-xl font-bold tracking-tight mt-0.5">
                  Soạn nhận xét cho em: {editingStudent.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
              
              {/* 1. Quick Star Scoring */}
              <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Học tập:</label>
                  <select
                    value={customAcademicScore}
                    onChange={(e) => setCustomAcademicScore(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value={5}>5 sao (Xuất sắc)</option>
                    <option value={4}>4 sao (Tốt)</option>
                    <option value={3}>3 sao (Khá tốt)</option>
                    <option value={2}>2 sao (Cần cố gắng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nề nếp:</label>
                  <select
                    value={customDisciplineScore}
                    onChange={(e) => setCustomDisciplineScore(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value={5}>5 sao (Tốt)</option>
                    <option value={4}>4 sao (Khá tốt)</option>
                    <option value={3}>3 sao (Cần nhắc nhở)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Tiến bộ:</label>
                  <select
                    value={customProgressStars}
                    onChange={(e) => setCustomProgressStars(Number(e.target.value))}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                  >
                    <option value={5}>5 sao (Tiến bộ vượt bậc)</option>
                    <option value={4}>4 sao (Tiến bộ rõ rệt)</option>
                    <option value={3}>3 sao (Duy trì ổn định)</option>
                  </select>
                </div>
              </div>

              {/* 2. Ngân hàng nhận xét (Check-to-Select) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BookmarkPlus className="w-4 h-4 text-indigo-600" /> Ngân hàng nhận xét nhanh
                  </span>
                  <button
                    onClick={handleAutoCombineFromTags}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                  >
                    Ghép câu tự động
                  </button>
                </div>

                {/* Attitude tags */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Thái độ học tập:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMENT_BANK.attitude.map((tag) => {
                      const isSelected = selectedAttitudeTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSelectedAttitudeTags((prev) =>
                              isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '☑ ' : '☐ '} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Academic tags */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Học tập & Kiến thức:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMENT_BANK.academic.map((tag) => {
                      const isSelected = selectedStudyTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSelectedStudyTags((prev) =>
                              isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-600 font-medium'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '☑ ' : '☐ '} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cooperation & Discipline tags */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-1.5">Hợp tác & Nề nếp:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMENT_BANK.cooperation.slice(0, 3).concat(COMMENT_BANK.discipline.slice(0, 3)).map((tag) => {
                      const isSelected = selectedCoopTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            setSelectedCoopTags((prev) =>
                              isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 font-medium'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '☑ ' : '☐ '} {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. AI Smart Writer (Gemini 3.8 Flash) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-slate-900 text-xs">
                      Trợ lý AI (Gemini): Tạo nhận xét ấm áp & tự nhiên
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiComment}
                    disabled={isGeneratingAi}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      'AI đang viết...'
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Tạo nhận xét độc bản
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  AI sẽ dựa vào các thẻ cô vừa chọn để viết nhận xét chuẩn sư phạm, cá nhân hóa riêng cho em {editingStudent.name}, tránh học sinh nào cũng nhận xét giống nhau.
                </p>
                {aiSuccessBadge && (
                  <p className="text-xs text-emerald-700 font-semibold animate-in fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI đã tạo lời nhận xét và gợi ý cho cha mẹ thành công!
                  </p>
                )}
              </div>

              {/* 4. Textarea for Teacher Comment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung nhận xét của Cô Vân Anh:
                </label>
                <textarea
                  rows={3}
                  value={customTeacherComment}
                  onChange={(e) => setCustomTeacherComment(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  placeholder="Nhập hoặc để AI tạo nhận xét..."
                />
              </div>

              {/* 5. Textarea for Parent Tip */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  💡 Góc đồng hành - Gợi ý dành cho cha mẹ tuần này:
                </label>
                <textarea
                  rows={2}
                  value={customParentTip}
                  onChange={(e) => setCustomParentTip(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  placeholder="Gợi ý cha mẹ làm gì ở nhà để đồng hành cùng con..."
                />
              </div>

              {/* 6. Môn Ngữ Văn tuần này (Cô Vân Anh phụ trách) */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Đánh giá môn Ngữ Văn tuần này (Cô Vân Anh)</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Chuyên môn Ngữ Văn</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Văn bản / Bài học tuần:</label>
                    <input
                      type="text"
                      value={customLitLesson}
                      onChange={(e) => setCustomLitLesson(e.target.value)}
                      placeholder="vd: Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Điểm tuần (nếu có):</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={customLitScore}
                      onChange={(e) => setCustomLitScore(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg text-center font-bold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-emerald-800 mb-1">
                    Lời phê & Nhận xét kỹ năng cảm thụ/viết đoạn văn của Cô Vân Anh:
                  </label>
                  <textarea
                    rows={2}
                    value={customLitFeedback}
                    onChange={(e) => setCustomLitFeedback(e.target.value)}
                    className="w-full p-2.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-hidden"
                    placeholder="Nhận xét cách cảm nhận văn bản, diễn đạt, dùng từ, chính tả..."
                  />
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Điểm mạnh:</label>
                  <input
                    type="text"
                    value={customStrengths}
                    onChange={(e) => setCustomStrengths(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cần cải thiện:</label>
                  <input
                    type="text"
                    value={customImprovements}
                    onChange={(e) => setCustomImprovements(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleSaveComposer}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Lưu & Duyệt gửi phụ huynh
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ĐĂNG THÔNG BÁO MỚI (🔴 / 🟡 / 🟢)                */}
      {/* ======================================================== */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-indigo-600 p-5 text-white flex items-center justify-between">
              <h3 className="text-lg font-bold">Tạo thông báo mới cho lớp 7C</h3>
              <button onClick={() => setShowAnnounceModal(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAnnouncementSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phân loại thông báo:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAnnCategory('important')}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                      newAnnCategory === 'important'
                        ? 'bg-rose-50 border-rose-500 text-rose-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🔴 Quan trọng
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAnnCategory('reminder')}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                      newAnnCategory === 'reminder'
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🟡 Nhắc việc
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAnnCategory('achievement')}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center ${
                      newAnnCategory === 'achievement'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🟢 Thành tích
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tiêu đề thông báo:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Lịch kiểm tra giữa học kỳ môn Toán..."
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung chi tiết:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập nội dung cô muốn gửi tới toàn thể phụ huynh..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2 text-slate-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: XUẤT BÁO CÁO / IN PHIẾU NHẬN XÉT (PRINT VIEW)     */}
      {/* ======================================================== */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold">Bản in Sổ liên lạc Lớp 7C • Tuần {selectedWeek}</h3>
                <p className="text-xs text-slate-400">Trường THCS Tân Khai</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> In ra giấy / PDF
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 font-sans print:p-0">
              
              <div className="text-center border-b pb-4">
                <h2 className="text-sm uppercase font-semibold text-slate-500">
                  ỦY BAN NHÂN DÂN QUẬN HAI BÀ TRƯNG — TRƯỜNG THCS VĨNH TUY
                </h2>
                <h1 className="text-xl font-bold uppercase text-slate-900 mt-1">
                  BÁO CÁO SỔ LIÊN LẠC ĐIỆN TỬ LỚP 7C – TUẦN {selectedWeek}
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Giáo viên: Cô Vân Anh • Sĩ số: 38 học sinh • Thời gian: Tháng 09/2024
                </p>
              </div>

              <table className="w-full text-left text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 border-r border-slate-300 w-12 text-center">STT</th>
                    <th className="p-2 border-r border-slate-300 w-16">Mã</th>
                    <th className="p-2 border-r border-slate-300">Họ và tên</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-center">Học tập</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-center">Nề nếp</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-center">Tiến bộ</th>
                    <th className="p-2">Nhận xét của Cô Vân Anh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {students.map((st, i) => {
                    const ev = st.weeklyEvaluations[selectedWeek] || st.weeklyEvaluations[4];
                    return (
                      <tr key={st.id}>
                        <td className="p-2 border-r border-slate-200 text-center">{i + 1}</td>
                        <td className="p-2 border-r border-slate-200 font-mono font-semibold">{st.code}</td>
                        <td className="p-2 border-r border-slate-200 font-bold">{st.name}</td>
                        <td className="p-2 border-r border-slate-200 text-center">{ev?.academic || 'Tốt'}</td>
                        <td className="p-2 border-r border-slate-200 text-center">{ev?.discipline || 'Tốt'}</td>
                        <td className="p-2 border-r border-slate-200 text-center">
                          {ev?.progressTrend === 'up' ? 'Tiến bộ' : 'Ổn định'}
                        </td>
                        <td className="p-2 text-slate-700 italic">{ev?.teacherComment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="flex justify-between pt-6 text-xs text-center">
                <div>
                  <p className="font-bold">ĐẠI DIỆN BAN PHỤ HUYNH</p>
                  <p className="text-[10px] text-slate-400 mt-12">(Ký và ghi rõ họ tên)</p>
                </div>
                <div>
                  <p className="italic text-slate-500">Hà Nội, ngày 11 tháng 09 năm 2024</p>
                  <p className="font-bold mt-1">GIÁO VIÊN BỘ MÔN NGỮ VĂN</p>
                  <p className="font-semibold text-indigo-700 mt-12">Cô Vân Anh</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Reply Message Modal */}
      {replyingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Hồi đáp phụ huynh em: {replyingStudent.student.name}
            </h3>
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Nhập nội dung cô nhắn lại cho gia đình..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReplyingStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Hủy
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Award Badge Modal */}
      {awardingBadgeStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Tuyên dương em: {awardingBadgeStudent.name}
            </h3>
            <label className="block text-xs font-semibold text-slate-600">Chọn danh hiệu huy hiệu:</label>
            <select
              value={badgeTitle}
              onChange={(e) => setBadgeTitle(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl"
            >
              <option value="Học sinh tiến bộ">🏅 Học sinh tiến bộ</option>
              <option value="Chăm học chăm làm">📚 Chăm học chăm làm</option>
              <option value="Tích cực phát biểu">🙋 Tích cực phát biểu</option>
              <option value="Đồng đội tuyệt vời">🤝 Đồng đội tuyệt vời</option>
              <option value="Nỗ lực mỗi ngày">🌱 Nỗ lực mỗi ngày</option>
              <option value="Gương mặt tích cực tuần">⭐ Gương mặt tích cực tuần</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setAwardingBadgeStudent(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Hủy
              </button>
              <button
                onClick={handleAwardBadge}
                className="px-4 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold"
              >
                Trao huy hiệu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
