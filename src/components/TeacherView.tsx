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
  Settings,
  CalendarPlus,
  Sliders,
  UserCog,
  Lock,
  RotateCcw,
} from 'lucide-react';
import { LiteratureGradebook } from './LiteratureGradebook';
import { LiteratureLessonManager } from './LiteratureLessonManager';
import { AddWeekModal } from './AddWeekModal';
import { EditWeekModal } from './EditWeekModal';
import { ClassInfoModal } from './ClassInfoModal';
import { EditStudentModal } from './EditStudentModal';
import { EvaluationComposerModal } from './EvaluationComposerModal';

export const TeacherView: React.FC = () => {
  const {
    students,
    weeks,
    selectedWeek,
    setSelectedWeek,
    addWeek,
    updateWeekInfo,
    deleteWeek,
    updateEvaluation,
    batchApproveEvaluations,
    clearAllGradesAndComments,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    replyParentMessage,
    toggleNeedsAttention,
    addBadge,
    classInfo,
    updateClassInfo,
    updateStudentInfo,
    setCurrentStudentId,
    setRole,
    lockTeacher,
  } = useClass();

  // Admin Active Tab: Điểm, Nhận xét, Dặn dò & Thông báo, Nội dung học tập, Hộp thư Ph & HS
  const [activeAdminTab, setActiveAdminTab] = useState<
    'grades' | 'comments' | 'announcements' | 'lessons' | 'messages'
  >('grades');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs_attention' | 'unapproved' | 'approved'>('all');

  // Dynamic Week & Class & Student & Evaluation Modals
  const [showAddWeekModal, setShowAddWeekModal] = useState(false);
  const [showEditWeekModal, setShowEditWeekModal] = useState(false);
  const [showClassInfoModal, setShowClassInfoModal] = useState(false);
  const [editingStudentProfile, setEditingStudentProfile] = useState<Student | null>(null);
  const [editingStudentEvaluation, setEditingStudentEvaluation] = useState<Student | null>(null);

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

  // Quick inline cycle adjustments for evaluations
  const handleQuickCycleAcademic = (studentId: string, currentScore: number = 4) => {
    const scoreMap: Record<number, { score: number; label: 'Xuất sắc' | 'Tốt' | 'Khá tốt' | 'Cần cố gắng' }> = {
      5: { score: 4, label: 'Tốt' },
      4: { score: 3, label: 'Khá tốt' },
      3: { score: 2, label: 'Cần cố gắng' },
      2: { score: 5, label: 'Xuất sắc' },
    };
    const next = scoreMap[currentScore] || { score: 5, label: 'Xuất sắc' };
    updateEvaluation(studentId, selectedWeek, {
      academicScore: next.score,
      academic: next.label,
    });
  };

  const handleQuickCycleDiscipline = (studentId: string, currentScore: number = 5) => {
    const scoreMap: Record<number, { score: number; label: 'Tốt' | 'Khá tốt' | 'Cần nhắc nhở' }> = {
      5: { score: 4, label: 'Khá tốt' },
      4: { score: 3, label: 'Cần nhắc nhở' },
      3: { score: 5, label: 'Tốt' },
    };
    const next = scoreMap[currentScore] || { score: 5, label: 'Tốt' };
    updateEvaluation(studentId, selectedWeek, {
      disciplineScore: next.score,
      discipline: next.label,
    });
  };

  const handleQuickToggleTrend = (studentId: string, currentTrend?: string) => {
    const nextTrend: 'up' | 'steady' | 'down' = currentTrend === 'up' ? 'steady' : currentTrend === 'steady' ? 'down' : 'up';
    updateEvaluation(studentId, selectedWeek, {
      progressTrend: nextTrend,
    });
  };

  const handleQuickToggleApproval = (studentId: string, currentApproval?: boolean) => {
    updateEvaluation(studentId, selectedWeek, {
      isApproved: !currentApproval,
    });
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
                  <span>🌸</span> 7C - NGỮ VĂN
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Môn Ngữ Văn 7 📖
                </span>
                <span className="text-xs text-slate-500 font-medium">{classInfo.academicYear || 'Năm học 2026 - 2027'} ✨</span>
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
                id="btn-lock-teacher"
                onClick={lockTeacher}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-rose-200 shadow-xs transition-colors"
                title="Khóa quyền chỉnh sửa và quay lại Góc Ba Mẹ"
              >
                <Lock className="w-4 h-4 text-rose-600" /> Khóa quyền sửa
              </button>

              <button
                id="btn-settings-class"
                onClick={() => setShowClassInfoModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border border-slate-300 shadow-xs transition-colors"
                title="Tùy chỉnh thông tin lớp học và giáo viên"
              >
                <Settings className="w-4 h-4 text-slate-600" /> Cài đặt lớp & GV
              </button>

              <button
                id="btn-clear-all-data"
                onClick={() => {
                  if (window.confirm('Cô Vân Anh có chắc muốn để trống toàn bộ điểm và nhận xét của cả lớp 7C để nhập mới từ đầu?')) {
                    clearAllGradesAndComments();
                  }
                }}
                className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
                title="Để trống toàn bộ điểm và lời phê của học sinh để bắt đầu nhập liệu mới"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" /> Để trống điểm & nhận xét
              </button>

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

          {/* 4 Admin Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mt-6 pt-4 border-t border-slate-200">
            <button
              id="admin-nav-grades"
              onClick={() => setActiveAdminTab('grades')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'grades'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>1. Điểm</span>
            </button>

            <button
              id="admin-nav-comments"
              onClick={() => setActiveAdminTab('comments')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'comments'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>2. Nhận xét ({totalStudents})</span>
            </button>

            <button
              id="admin-nav-announcements"
              onClick={() => setActiveAdminTab('announcements')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'announcements'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookmarkPlus className="w-4 h-4" />
              <span>3. Dặn dò & Thông báo ({announcements.length})</span>
            </button>

            <button
              id="admin-nav-lessons"
              onClick={() => setActiveAdminTab('lessons')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'lessons'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>4. Nội dung học tập</span>
            </button>

            <button
              id="admin-nav-messages"
              onClick={() => setActiveAdminTab('messages')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeAdminTab === 'messages'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>5. Hộp thư Ph & HS ({students.reduce((acc, s) => acc + s.parentMessages.length, 0)})</span>
            </button>
          </div>

          {/* Week Selector Bar - When activeAdminTab === 'comments' */}
          {activeAdminTab === 'comments' && (
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  Tuần đánh giá:
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {weeks.map((wInfo) => {
                    const isSelected = selectedWeek === wInfo.week;
                    const isCurrent = wInfo.isCurrent || wInfo.week === classInfo.currentWeek;
                    return (
                      <button
                        key={wInfo.week}
                        onClick={() => setSelectedWeek(wInfo.week)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <span>{wInfo.title || `Tuần ${wInfo.week}`}</span>
                        {isCurrent && <span className="text-amber-300">⭐</span>}
                      </button>
                    );
                  })}

                  {/* Button: Cô giáo tự thêm tuần mới */}
                  <button
                    id="btn-add-week-modal"
                    onClick={() => setShowAddWeekModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1 shadow-2xs"
                    title="Cô giáo thêm tuần đánh giá mới cho lớp"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>+ Thêm tuần</span>
                  </button>

                  {/* Button: Chỉnh sửa thông tin tuần đang chọn */}
                  <button
                    id="btn-edit-week-modal"
                    onClick={() => setShowEditWeekModal(true)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1"
                    title={`Chỉnh sửa tiêu đề, thời gian, bài trọng tâm hoặc xóa Tuần ${selectedWeek}`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sửa tuần {selectedWeek}</span>
                  </button>
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
      {/* 1. TAB: ĐIỂM (SỔ ĐIỂM NGỮ VĂN CÔ VÂN ANH)                */}
      {/* ======================================================== */}
      {activeAdminTab === 'grades' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <LiteratureGradebook />
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. TAB: NHẬN XÉT (SỔ NHẬN XÉT HỌC SINH)                 */}
      {/* ======================================================== */}
      {activeAdminTab === 'comments' && (
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

                        {/* Học tập - Click to cycle or adjust */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickCycleAcademic(s.id, ev?.academicScore || 4)}
                            className="inline-flex flex-col items-center p-1.5 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors cursor-pointer group"
                            title="Bấm để đổi nhanh số sao & mức học tập (Xuất sắc -> Tốt -> Khá tốt -> Cần cố gắng)"
                          >
                            <span className="text-amber-500 font-bold text-xs group-hover:scale-110 transition-transform">
                              {'★'.repeat(ev?.academicScore || 4)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-semibold mt-0.5">{ev?.academic || 'Tốt'}</span>
                          </button>
                        </td>

                        {/* Nề nếp - Click to cycle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickCycleDiscipline(s.id, ev?.disciplineScore || 5)}
                            className="inline-flex flex-col items-center p-1.5 rounded-xl hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-colors cursor-pointer group"
                            title="Bấm để đổi nhanh nề nếp (Tốt -> Khá tốt -> Cần nhắc nhở)"
                          >
                            <span className="text-amber-500 font-bold text-xs group-hover:scale-110 transition-transform">
                              {'★'.repeat(ev?.disciplineScore || 5)}
                            </span>
                            <span className="text-[10px] text-slate-600 font-semibold mt-0.5">{ev?.discipline || 'Tốt'}</span>
                          </button>
                        </td>

                        {/* Tiến bộ (↑ / → / ↓) - Click to cycle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleTrend(s.id, ev?.progressTrend)}
                            className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs hover:scale-105 ${
                              ev?.progressTrend === 'up'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : ev?.progressTrend === 'down'
                                ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                            title="Bấm để chuyển nhanh: ↑ Tiến bộ / → Ổn định / ↓ Cần cố gắng"
                          >
                            {ev?.progressTrend === 'up' ? '↑ Tiến bộ' : ev?.progressTrend === 'down' ? '↓ Cần cố gắng' : '→ Ổn định'}
                          </button>
                        </td>

                        {/* Status (Duyệt hay chưa) - Click to toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleApproval(s.id, isApproved)}
                            className="inline-flex items-center gap-1 cursor-pointer transition-all hover:scale-105"
                            title="Bấm để chuyển trạng thái: Đã gửi phụ huynh <-> Chờ duyệt"
                          >
                            {isApproved ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs hover:bg-emerald-200">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã gửi
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs hover:bg-amber-200">
                                ✏️ Chờ duyệt
                              </span>
                            )}
                          </button>
                        </td>

                        {/* Snippet Comment */}
                        <td className="py-3 px-4 max-w-xs">
                          <button
                            type="button"
                            onClick={() => setEditingStudentEvaluation(s)}
                            className="text-left w-full group cursor-pointer"
                            title="Bấm để mở trình biên soạn nhận xét chi tiết"
                          >
                            <p className="text-xs text-slate-600 truncate group-hover:text-indigo-700 group-hover:underline">
                              {ev?.teacherComment || 'Chưa nhập nhận xét...'}
                            </p>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            
                            {/* Soạn / Điều chỉnh mọi mục nhận xét & điểm */}
                            <button
                              id={`edit-comment-${s.id}`}
                              onClick={() => setEditingStudentEvaluation(s)}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-all flex items-center gap-1.5 shadow-2xs border border-indigo-200"
                              title="Cô Vân Anh điều chỉnh mọi mục: Thang điểm 5 tiêu chí, Môn Ngữ Văn, Nhận xét, Trợ lý AI, Gia đình..."
                            >
                              <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Sửa mọi mục</span>
                            </button>

                            {/* Chỉnh sửa hồ sơ học sinh */}
                            <button
                              onClick={() => setEditingStudentProfile(s)}
                              className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                              title="Chỉnh sửa thông tin học sinh (Họ tên, SĐT phụ huynh, mục tiêu...)"
                            >
                              <UserCog className="w-4 h-4" />
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
      {/* 3. TAB: DẶN DÒ & THÔNG BÁO                               */}
      {/* ======================================================== */}
      {activeAdminTab === 'announcements' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookmarkPlus className="w-5 h-5 text-amber-600" />
                  Dặn dò & Thông báo Lớp 7C
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Đăng dặn dò, lịch thi, bài tập hoặc thông báo mới để gửi trực tiếp đến phụ huynh và học sinh
                </p>
              </div>
              <button
                onClick={() => setShowAnnounceModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Đăng thông báo mới
              </button>
            </div>

            {announcements.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                  📢
                </div>
                <h4 className="text-base font-bold text-slate-800">Chưa có dặn dò hoặc thông báo nào</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Dữ liệu hiện đang để trống để cô giáo tự chỉnh. Cô Vân Anh hãy nhấn nút <strong>"Đăng thông báo mới"</strong> ở góc trên để tạo bài đăng đầu tiên.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB: NỘI DUNG HỌC TẬP (ĐỒNG BỘ ONLINE FIRESTORE)      */}
      {/* ======================================================== */}
      {activeAdminTab === 'lessons' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <LiteratureLessonManager />
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB: HỘP THƯ PH & HS                                  */}
      {/* ======================================================== */}
      {activeAdminTab === 'messages' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Hộp thư Phụ huynh & Học sinh Lớp 7C
                  </h3>
                  <p className="text-xs text-slate-500">
                    Trao đổi 2 chiều giữa phụ huynh/học sinh và cô giáo Vân Anh
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                {students.reduce((acc, s) => acc + s.parentMessages.length, 0)} tin nhắn
              </span>
            </div>

            {students.reduce((acc, s) => acc + s.parentMessages.length, 0) === 0 ? (
              <div className="py-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                  💬
                </div>
                <h4 className="text-base font-bold text-slate-800">Hộp thư hiện đang trống</h4>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Chưa có tin nhắn nào từ phụ huynh hoặc học sinh gửi đến. Khi phụ huynh gửi lời nhắn, tin nhắn sẽ hiển thị tại đây để cô giáo xem và phản hồi trực tiếp.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CÔ GIÁO TỰ THÊM TUẦN MỚI                       */}
      {/* ======================================================== */}
      <AddWeekModal
        isOpen={showAddWeekModal}
        onClose={() => setShowAddWeekModal(false)}
        weeks={weeks}
        onAddWeek={addWeek}
      />

      {/* ======================================================== */}
      {/* MODAL 2: ĐIỀU CHỈNH THÔNG TIN TUẦN / XÓA TUẦN           */}
      {/* ======================================================== */}
      <EditWeekModal
        isOpen={showEditWeekModal}
        onClose={() => setShowEditWeekModal(false)}
        weekInfo={weeks.find((w) => w.week === selectedWeek)}
        canDelete={weeks.length > 1}
        onUpdateWeek={updateWeekInfo}
        onDeleteWeek={deleteWeek}
      />

      {/* ======================================================== */}
      {/* MODAL 3: CÀI ĐẶT THÔNG TIN LỚP & GIÁO VIÊN              */}
      {/* ======================================================== */}
      <ClassInfoModal
        isOpen={showClassInfoModal}
        onClose={() => setShowClassInfoModal(false)}
        classInfo={classInfo}
        onUpdateClassInfo={updateClassInfo}
      />

      {/* ======================================================== */}
      {/* MODAL 4: CHỈNH SỬA HỒ SƠ HỌC SINH                      */}
      {/* ======================================================== */}
      <EditStudentModal
        isOpen={!!editingStudentProfile}
        onClose={() => setEditingStudentProfile(null)}
        student={editingStudentProfile}
        onUpdateStudent={updateStudentInfo}
      />

      {/* ======================================================== */}
      {/* MODAL 5: ĐIỀU CHỈNH MỌI MỤC ĐÁNH GIÁ TUẦN & AI GEMINI   */}
      {/* ======================================================== */}
      <EvaluationComposerModal
        isOpen={!!editingStudentEvaluation}
        onClose={() => setEditingStudentEvaluation(null)}
        student={editingStudentEvaluation}
        selectedWeek={selectedWeek}
        onSave={(data, isApproved) => {
          if (editingStudentEvaluation) {
            updateEvaluation(editingStudentEvaluation.id, selectedWeek, {
              ...data,
              isApproved,
            });
          }
        }}
      />

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
                  Giáo viên: Cô Vân Anh • Sĩ số: 38 học sinh • Thời gian: Tháng 09/2026
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
                  <p className="italic text-slate-500">Hà Nội, ngày 11 tháng 09 năm 2026</p>
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
