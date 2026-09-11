import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import {
  Home,
  BarChart3,
  FileText,
  Bell,
  Heart,
  Award,
  Sparkles,
  ChevronRight,
  Send,
  Calendar,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  BookmarkCheck,
  Target,
  Smile,
  ShieldCheck,
  GraduationCap,
  PenTool,
} from 'lucide-react';
import confetti from 'canvas-confetti';

type TabType = 'home' | 'evaluation' | 'weekly' | 'literature' | 'announcements' | 'cooperation' | 'portfolio';

export const ParentView: React.FC = () => {
  const {
    currentStudent,
    selectedWeek,
    setSelectedWeek,
    announcements,
    lessonContents,
    addParentMessage,
    updatePersonalGoal,
    classInfo,
  } = useClass();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [parentNote, setParentNote] = useState('');
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'important' | 'reminder' | 'achievement'>('all');
  const [aiAdviceTopic, setAiAdviceTopic] = useState('');
  const [aiAdviceResult, setAiAdviceResult] = useState<{ advice: string; actionItem: string } | null>(null);
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  if (!currentStudent) {
    return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu học sinh...</div>;
  }

  const currentEval = currentStudent.weeklyEvaluations[selectedWeek] || currentStudent.weeklyEvaluations[4];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentNote.trim()) return;
    addParentMessage(currentStudent.id, parentNote.trim());
    setParentNote('');
    setNoteSentSuccess(true);
    setTimeout(() => setNoteSentSuccess(false), 3000);
  };

  const handleSaveGoal = () => {
    if (newGoalInput.trim()) {
      updatePersonalGoal(currentStudent.id, newGoalInput.trim());
      setIsEditingGoal(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  const handleAskAiParentAdvice = async () => {
    setIsGeneratingAdvice(true);
    try {
      const res = await fetch('/api/gemini/parent-advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentStudent.name,
          topic: aiAdviceTopic || 'Phương pháp đồng hành và tạo động lực học tập tuần này',
          currentStatus: `Học tập: ${currentEval.academic}, Nề nếp: ${currentEval.discipline}, Cần cải thiện: ${currentEval.improvements}`,
        }),
      });
      const data = await res.json();
      setAiAdviceResult({
        advice: data.advice,
        actionItem: data.actionItem,
      });
    } catch (err) {
      console.error(err);
      setAiAdviceResult({
        advice: `Cha mẹ hãy dành 10 phút mỗi tối để cùng ${currentStudent.name} chia sẻ về những điều con thấy tâm đắc nhất trong bài học trên lớp.`,
        actionItem: 'Lắng nghe con và khen ngợi sự nỗ lực chân thành.',
      });
    } finally {
      setIsGeneratingAdvice(false);
    }
  };

  // Render Stars
  const renderStars = (count: number, max = 5) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < count ? 'text-amber-400' : 'text-slate-200'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeCategoryFilter === 'all') return true;
    return a.category === activeCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pb-24 md:pb-12 font-sans text-slate-800">
      
      {/* Student Welcome Header Card */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl ${currentStudent.avatarColor} text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-rose-100 shrink-0 animate-soft-pulse border-2 border-white`}>
                {currentStudent.avatarIcon}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 font-mono">
                    <span>🌸</span> {currentStudent.code}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                    7C - HỌC VĂN CÙNG CÔ VÂN ANH ✨
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Giáo viên Ngữ Văn: {classInfo.homeroomTeacher}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <span>{currentStudent.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-bold">
                    Học sinh chăm ngoan 🌷
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 flex items-center gap-1">
                  <span>Mến chào <strong>{currentStudent.parentName}</strong> đã đồng hành cùng góc học Văn Lớp 7C! 💖</span>
                </p>
              </div>
            </div>

            {/* Quick Badges / Progress indicator */}
            <div className="flex items-center gap-2.5 sm:self-center bg-gradient-to-br from-amber-50 to-rose-50 border border-amber-200/80 rounded-3xl p-3 sm:px-4 sm:py-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-white flex items-center justify-center font-bold text-base shadow-xs animate-gentle-float">
                ⭐
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-900">Bông hoa tiến bộ</span>
                  <span className="text-xs text-emerald-600 font-bold">↑ Tuần 4</span>
                </div>
                <div className="mt-0.5">
                  {renderStars(currentEval.progressStars)}
                </div>
              </div>
            </div>

          </div>

          {/* Screen Navigation Tabs */}
          <div className="flex items-center gap-1 sm:gap-2 mt-5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
            {[
              { id: 'home', label: 'Trang chủ', icon: Home },
              { id: 'literature', label: 'Môn Ngữ Văn (Cô Vân Anh)', icon: PenTool, highlight: true },
              { id: 'evaluation', label: 'Đánh giá & Tiến bộ', icon: BarChart3 },
              { id: 'weekly', label: 'Nhận xét theo tuần', icon: FileText },
              { id: 'announcements', label: 'Bảng thông báo', icon: Bell, badge: announcements.length },
              { id: 'cooperation', label: 'Góc đồng hành', icon: Heart },
              { id: 'portfolio', label: 'Portfolio & Khen thưởng', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? tab.id === 'literature' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-indigo-600 text-white shadow-xs'
                      : tab.id === 'literature'
                      ? 'bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100/80 border border-emerald-200/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : tab.id === 'literature' ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-rose-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* ======================================================== */}
        {/* MÀN 1: 🏠 TRANG CHỦ (TỔNG QUAN HỌC SINH)                 */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Spotlight Card: Tổng quan học sinh theo format người dùng yêu cầu */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-rose-50">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                    <span>🌸</span> 7C - HỌC VĂN CÙNG CÔ VÂN ANH • Sổ liên lạc Tuần 4 ✨
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                    <span>Tổng quan chăm ngoan & học tập của con</span>
                    <span className="text-sm">🌷</span>
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Cô Vân Anh đã duyệt 💌
                  </span>
                </div>
              </div>

              {/* 6 Key Criteria Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 my-5">
                
                {/* 1. Học tập */}
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-blue-500" /> Học tập
                    </span>
                    {renderStars(currentEval.academicScore)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">{currentEval.academic}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Bài kiểm tra & tiếp thu</p>
                </div>

                {/* 2. Bài tập */}
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <BookmarkCheck className="w-4 h-4 text-emerald-500" /> Bài tập
                    </span>
                    {renderStars(4)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">Khá tốt (Đầy đủ)</p>
                  <p className="text-xs text-slate-500 mt-0.5">Hoàn thành đúng hạn</p>
                </div>

                {/* 3. Thái độ */}
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Smile className="w-4 h-4 text-amber-500" /> Tham gia
                    </span>
                    {renderStars(currentEval.attitudeScore)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">{currentEval.attitude}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Phát biểu & xây dựng bài</p>
                </div>

                {/* 4. Hợp tác */}
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-purple-500" /> Hợp tác
                    </span>
                    {renderStars(currentEval.cooperationScore)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">{currentEval.cooperation}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Làm việc nhóm & giúp bạn</p>
                </div>

                {/* 5. Nề nếp - Chuyên cần */}
                <div className="bg-slate-50/80 hover:bg-slate-50 p-4 rounded-2xl border border-slate-200/70 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-rose-500" /> Nề nếp
                    </span>
                    {renderStars(currentEval.disciplineScore)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900">{currentEval.discipline}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Đúng giờ, trang phục chuẩn</p>
                </div>

                {/* 6. Mức độ tiến bộ */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200/70">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-amber-600" /> Tiến bộ
                    </span>
                    {renderStars(currentEval.progressStars)}
                  </div>
                  <p className="text-base sm:text-lg font-bold text-amber-900">
                    {currentEval.progressStars >= 4 ? 'Tiến bộ rõ rệt ↑' : 'Duy trì ổn định →'}
                  </p>
                  <p className="text-xs text-amber-700/80 mt-0.5">So với tuần trước</p>
                </div>

              </div>

              {/* Heartfelt Teacher Comment Box */}
              <div className="mt-4 bg-indigo-50/60 rounded-2xl p-4 sm:p-5 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    ❤️
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    Nhận xét tuần của Cô Vân Anh:
                  </h3>
                </div>
                <blockquote className="italic text-slate-700 text-sm sm:text-base leading-relaxed pl-2 border-l-2 border-indigo-400">
                  "{currentEval.teacherComment}"
                </blockquote>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors text-left"
                >
                  <span>📅 Xem lịch sử theo tuần</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('evaluation')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors text-left"
                >
                  <span>📊 Xem biểu đồ tiến bộ</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  onClick={() => setActiveTab('cooperation')}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors text-left"
                >
                  <span>💡 Gợi ý đồng hành cho cha mẹ</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

            </div>

            {/* Spotlight Card: Môn Ngữ Văn cùng Cô Vân Anh */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 rounded-3xl p-5 sm:p-6 border border-emerald-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Góc học tập chuyên môn
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Môn Ngữ Văn Lớp 7C • Cô Vân Anh
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('literature')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <span>Xem sổ điểm & dặn dò chi tiết</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {/* 1. Điểm TB môn Văn */}
                <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Điểm trung bình môn Văn
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-700">
                      {currentStudent.literatureGrades?.averageScore?.toFixed(1) || '8.5'}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">/ 10</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium mt-1">
                    Học lực: {(currentStudent.literatureGrades?.averageScore || 8.5) >= 8.0 ? 'Giỏi (Xuất sắc)' : 'Khá'}
                  </p>
                </div>

                {/* 2. Đánh giá chuyên môn */}
                <div className="bg-white/90 p-4 rounded-2xl border border-emerald-100 sm:col-span-2">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">
                    Nhận xét bài làm & kỹ năng của con:
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 italic">
                    "{currentStudent.literatureGrades?.teacherRemarks || currentEval.literatureWeekly?.teacherFeedback || 'Con viết bài cảm xúc, có ý sáng tạo, cần trau chuốt thêm các phép liên kết câu.'}"
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800 font-medium">
                      📖 Đọc hiểu: {currentStudent.literatureGrades?.readingCompetency || 'Tốt'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-teal-100/70 text-teal-800 font-medium">
                      ✍️ Viết văn: {currentStudent.literatureGrades?.writingCompetency || 'Khá tốt'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-100/70 text-blue-800 font-medium">
                      🗣️ Nói & Nghe: {currentStudent.literatureGrades?.speakingListeningCompetency || 'Tự tin'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dặn dò mới nhất tuần này */}
              {lessonContents.length > 0 && (
                <div className="mt-3 p-3.5 rounded-2xl bg-white/70 border border-emerald-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="font-bold text-emerald-800">📌 Bài học tuần {lessonContents[0].week}:</span>
                    <span className="font-semibold text-slate-900">{lessonContents[0].topic}</span>
                  </div>
                  <span className="text-slate-500 italic truncate sm:max-w-[280px]">
                    Bài tập: {lessonContents[0].homework}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Announcement Banner */}
            {announcements.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📢</span>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      Thông báo mới nhất từ Cô Vân Anh
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
                  >
                    Xem tất cả ({announcements.length}) <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-rose-100 text-rose-700">
                      {announcements[0].category === 'important' ? 'Quan trọng' : 'Lưu ý'}
                    </span>
                    <span className="text-xs text-slate-400">{announcements[0].date}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm">{announcements[0].title}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{announcements[0].content}</p>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN 2: 📊 ĐÁNH GIÁ & BIỂU ĐỒ TIẾN BỘ                      */}
        {/* ======================================================== */}
        {activeTab === 'evaluation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Phân tích toàn diện
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Biểu đồ tiến bộ 4 tuần qua
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Giúp cha mẹ nhìn rõ: <strong>“Con đang tiến bộ ở đâu, cần cải thiện gì”</strong>
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
                  <TrendingUp className="w-4 h-4 text-emerald-600" /> Xu hướng: Đang tiến bộ tích cực
                </div>
              </div>

              {/* Progress Timeline Matrix */}
              <div className="mt-6 space-y-5">
                
                {/* Metric 1: Học tập */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      📚 Học tập & Tiếp thu kiến thức
                    </span>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Tuần 4: ⭐⭐⭐⭐⭐
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[1, 2, 3, 4].map((w) => {
                      const ev = currentStudent.weeklyEvaluations[w];
                      const stars = ev?.academicScore || 4;
                      return (
                        <div key={w} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                          <p className="text-[11px] font-semibold text-slate-500">Tuần {w}</p>
                          <p className="text-xs font-bold text-amber-500 mt-0.5">{'★'.repeat(stars)}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{ev?.academic || 'Tốt'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 2: Nề nếp & Kỷ luật */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      ⏰ Nề nếp, Chuyên cần & Trang phục
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Tuần 4: Chuẩn mực
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[1, 2, 3, 4].map((w) => {
                      const ev = currentStudent.weeklyEvaluations[w];
                      const stars = ev?.disciplineScore || 5;
                      return (
                        <div key={w} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                          <p className="text-[11px] font-semibold text-slate-500">Tuần {w}</p>
                          <p className="text-xs font-bold text-amber-500 mt-0.5">{'★'.repeat(stars)}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{ev?.discipline || 'Tốt'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 3: Thái độ & Tham gia bài học */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      🙋 Thái độ học tập & Hăng hái phát biểu
                    </span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      Tiến bộ vượt bậc
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[1, 2, 3, 4].map((w) => {
                      const ev = currentStudent.weeklyEvaluations[w];
                      const stars = ev?.attitudeScore || 4;
                      return (
                        <div key={w} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                          <p className="text-[11px] font-semibold text-slate-500">Tuần {w}</p>
                          <p className="text-xs font-bold text-amber-500 mt-0.5">{'★'.repeat(stars)}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{ev?.attitude || 'Tích cực'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric 4: Kỹ năng hợp tác & Làm việc nhóm */}
                <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/70">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      🤝 Kỹ năng hợp tác nhóm & Giúp bạn
                    </span>
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      Rất hòa đồng
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[1, 2, 3, 4].map((w) => {
                      const ev = currentStudent.weeklyEvaluations[w];
                      const stars = ev?.cooperationScore || 4;
                      return (
                        <div key={w} className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">
                          <p className="text-[11px] font-semibold text-slate-500">Tuần {w}</p>
                          <p className="text-xs font-bold text-amber-500 mt-0.5">{'★'.repeat(stars)}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{ev?.cooperation || 'Tốt'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Insights: Điểm mạnh & Điểm cần cải thiện của cả quá trình */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-600 text-base">🌱</span>
                    <h3 className="font-bold text-emerald-950 text-sm">Điểm mạnh đang phát huy tốt:</h3>
                  </div>
                  <ul className="text-xs sm:text-sm text-emerald-900 space-y-1.5 list-disc pl-5">
                    <li>Có tinh thần tự giác cao, tiếp thu bài nhanh ở các môn tự nhiên.</li>
                    <li>Biết lắng nghe và nhiệt tình tương tác cùng bạn bè trong nhóm.</li>
                    <li>Đi học chuyên cần, đúng giờ, nội quy lớp thực hiện nghiêm túc.</li>
                  </ul>
                </div>

                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-amber-600 text-base">💡</span>
                    <h3 className="font-bold text-amber-950 text-sm">Điểm con cần tiếp tục rèn luyện:</h3>
                  </div>
                  <ul className="text-xs sm:text-sm text-amber-900 space-y-1.5 list-disc pl-5">
                    <li>Rèn luyện tính tự tin khi trình bày ý kiến độc lập trước toàn lớp.</li>
                    <li>Cẩn thận hơn khi làm bài thi, tránh các lỗi sót phép tính nhỏ.</li>
                    <li>Chủ động hỏi thầy cô khi gặp các phần kiến thức nâng cao.</li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN 3: 📝 NHẬN XÉT THEO TỪNG TUẦN (TUẦN 1 -> 4)            */}
        {/* ======================================================== */}
        {activeTab === 'weekly' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Week Selector Chips */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                Chọn tuần cần xem nhận xét:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((w) => {
                  const isSelected = selectedWeek === w;
                  const isCurrent = w === 4;
                  return (
                    <button
                      key={w}
                      id={`select-week-${w}`}
                      onClick={() => setSelectedWeek(w)}
                      className={`p-3 rounded-2xl text-left transition-all border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold">Tuần {w}</span>
                        {isCurrent && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                              isSelected ? 'bg-indigo-700 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Mới nhất
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {currentStudent.weeklyEvaluations[w]?.title || `Đánh giá tuần ${w}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Weekly Report Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Bản tin đánh giá tuần
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                    {currentEval.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Đánh giá chung:</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {currentEval.academic}
                  </span>
                </div>
              </div>

              {/* 4 Pillars of Weekly Evaluation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Điểm mạnh */}
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                  <div className="flex items-center gap-2 mb-2 text-emerald-800 font-bold text-sm">
                    <span>🌟</span> Điểm mạnh nổi bật trong tuần
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentEval.strengths || 'Em thể hiện tinh thần học tập tích cực và hào hứng.'}
                  </p>
                </div>

                {/* 2. Điều cần cải thiện */}
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                    <span>🎯</span> Điều con cần rèn luyện thêm
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentEval.improvements || 'Cần chú ý cẩn thận hơn trong khâu trình bày bài làm.'}
                  </p>
                </div>

                {/* 3. Việc cần phối hợp với gia đình */}
                <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-sm">
                    <span>🤝</span> Việc cần phối hợp cùng gia đình
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentEval.familyCoordination || 'Gia đình cùng nhắc nhở con duy trì thời gian biểu học tập tại nhà.'}
                  </p>
                </div>

                {/* 4. Gợi ý dành cho cha mẹ */}
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2 text-purple-800 font-bold text-sm">
                    <span>💡</span> Gợi ý dành cho cha mẹ tuần này
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {currentEval.parentTip || 'Dành 10 phút hỏi con về bài học vui nhất trong ngày.'}
                  </p>
                </div>

              </div>

              {/* Teacher Heartfelt Remarks */}
              <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200">
                <div className="flex items-center gap-2 mb-2 text-indigo-950 font-bold text-sm">
                  <span>❤️</span> Lời nhận xét & động viên của Cô Vân Anh:
                </div>
                <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed pl-3 border-l-2 border-indigo-500">
                  "{currentEval.teacherComment}"
                </p>
              </div>

              {/* Subject Specific Remarks (Toán, Văn, Anh, KHTN) */}
              {currentEval.subjectNotes && (
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Nhận xét giáo viên bộ môn:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentEval.subjectNotes.math && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-blue-700 block mb-1">📐 Môn Toán:</span>
                        <p className="text-xs text-slate-700">{currentEval.subjectNotes.math}</p>
                      </div>
                    )}
                    {currentEval.subjectNotes.literature && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-rose-700 block mb-1">📖 Môn Ngữ Văn:</span>
                        <p className="text-xs text-slate-700">{currentEval.subjectNotes.literature}</p>
                      </div>
                    )}
                    {currentEval.subjectNotes.english && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-emerald-700 block mb-1">🌐 Môn Tiếng Anh:</span>
                        <p className="text-xs text-slate-700">{currentEval.subjectNotes.english}</p>
                      </div>
                    )}
                    {currentEval.subjectNotes.science && (
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-xs font-bold text-amber-700 block mb-1">🔬 Môn Khoa học Tự nhiên:</span>
                        <p className="text-xs text-slate-700">{currentEval.subjectNotes.science}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN MỚI: 📚 MÔN NGỮ VĂN (CÔ VÂN ANH)                      */}
        {/* ======================================================== */}
        {activeTab === 'literature' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Header Card Môn Ngữ Văn */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Môn Ngữ Văn 7 • Năm học 2024 - 2025
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Chương trình GDPT 2018</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                    Sổ điểm & Kế hoạch học tập môn Ngữ Văn
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Học sinh: <strong>{currentStudent.name}</strong> ({currentStudent.code}) • Giáo viên phụ trách: <strong>{classInfo.homeroomTeacher}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200/80">
                  <div>
                    <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                      Điểm trung bình môn
                    </p>
                    <p className="text-2xl font-black text-emerald-900 leading-none mt-0.5">
                      {currentStudent.literatureGrades?.averageScore?.toFixed(1) || '8.5'}
                      <span className="text-xs font-normal text-emerald-700 ml-1">/ 10</span>
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                    <PenTool className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* 3 Core Competencies Under GDPT 2018 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
                <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    📖 Năng lực Đọc hiểu
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {currentStudent.literatureGrades?.readingCompetency || 'Đọc hiểu tốt, cảm thụ sâu sắc'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Nắm bắt thông điệp & biện pháp tu từ</p>
                </div>

                <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    ✍️ Năng lực Viết văn
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {currentStudent.literatureGrades?.writingCompetency || 'Diễn đạt lưu loát, giàu hình ảnh'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Nghị luận & biểu cảm có lập luận tốt</p>
                </div>

                <div className="bg-slate-50/90 p-4 rounded-2xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    🗣️ Năng lực Nói & Nghe
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {currentStudent.literatureGrades?.speakingListeningCompetency || 'Tự tin phát biểu, tranh biện nhã nhặn'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Thuyết trình chủ đề nhóm rõ ràng</p>
                </div>
              </div>

              {/* Detailed Grade Breakdown Table */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Bảng điểm các bài kiểm tra chi tiết (Học kì I)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">Kiểm tra Miệng</span>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      {currentStudent.literatureGrades?.oralScores?.map((sc, i) => (
                        <span key={i} className="text-base font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {sc !== null && sc !== undefined ? sc : '-'}
                        </span>
                      )) || <span className="text-base font-extrabold text-slate-800">8.5</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 1</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">Kiểm tra 15 phút</span>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      {currentStudent.literatureGrades?.fifteenMinScores?.map((sc, i) => (
                        <span key={i} className="text-base font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {sc !== null && sc !== undefined ? sc : '-'}
                        </span>
                      )) || <span className="text-base font-extrabold text-slate-800">9.0</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 1</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">Kiểm tra 1 tiết</span>
                    <div className="flex items-center justify-center gap-1.5 mt-1">
                      {currentStudent.literatureGrades?.onePeriodScores?.map((sc, i) => (
                        <span key={i} className="text-base font-extrabold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {sc !== null && sc !== undefined ? sc : '-'}
                        </span>
                      )) || <span className="text-base font-extrabold text-slate-800">8.0</span>}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 2</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                    <span className="text-[11px] font-bold text-slate-500 block">Thi Giữa học kì 1</span>
                    <p className="text-base font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-lg border border-slate-200 inline-block mt-1">
                      {currentStudent.literatureGrades?.midTermScore ?? 8.5}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 2</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                    <span className="text-[11px] font-bold text-slate-500 block">Thi Cuối kì 1</span>
                    <p className="text-base font-extrabold text-slate-400 bg-white px-2 py-0.5 rounded-lg border border-slate-200 inline-block mt-1">
                      {currentStudent.literatureGrades?.finalTermScore ?? 'Chưa thi'}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 3</span>
                  </div>
                </div>
              </div>

              {/* Teacher Remarks for Literature */}
              <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold text-xs sm:text-sm">
                  <span>🖋️</span> Lời nhận xét chuyên môn của Cô Vân Anh:
                </div>
                <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed pl-3 border-l-2 border-emerald-600">
                  "{currentStudent.literatureGrades?.teacherRemarks || currentEval.literatureWeekly?.teacherFeedback || 'Con có cảm xúc văn học rất tốt, tư duy hình tượng phong phú. Cô khuyến khích con đọc thêm sách tham khảo để làm phong phú vốn từ ngữ và rèn luyện chữ viết nắn nót hơn.'}"
                </p>
              </div>

            </div>

            {/* Lesson Content & Weekly Literature Preparation */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Kế hoạch bài học & Dặn dò của Cô Vân Anh
                    </h3>
                    <p className="text-xs text-slate-500">
                      Giúp cha mẹ nắm rõ bài học trên lớp để cùng con soạn bài và chuẩn bị chu đáo
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  {lessonContents.length} bài học
                </span>
              </div>

              <div className="space-y-4 mt-5">
                {lessonContents.map((lesson) => (
                  <div key={lesson.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          Tuần {lesson.week}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                          {lesson.topic}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Cập nhật: {lesson.createdAt}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="font-bold text-blue-800 block mb-1">📖 Chuẩn bị bài đọc ở nhà:</span>
                        <p className="text-slate-700 leading-relaxed">{lesson.readingPreparation}</p>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="font-bold text-purple-800 block mb-1">✍️ Trọng tâm kĩ năng viết:</span>
                        <p className="text-slate-700 leading-relaxed">{lesson.writingFocus}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs">
                      <span className="font-bold text-amber-800 block mb-1">📝 Bài tập về nhà cần hoàn thành:</span>
                      <p className="text-slate-700 leading-relaxed">{lesson.homework}</p>
                    </div>

                    {lesson.teacherNotes && (
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-950">
                        <span className="font-bold block mb-1">💡 Dặn dò riêng từ Cô Vân Anh:</span>
                        <p className="italic">{lesson.teacherNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN 4: 📢 BẢNG THÔNG BÁO LỚP 7C                           */}
        {/* ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Bảng tin lớp 7C
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Thông báo từ Cô Vân Anh & Nhà trường
                  </h2>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryFilter === 'all'
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả ({announcements.length})
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('important')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                      activeCategoryFilter === 'important'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <span>🔴</span> Quan trọng
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('reminder')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                      activeCategoryFilter === 'reminder'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <span>🟡</span> Nhắc việc
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('achievement')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                      activeCategoryFilter === 'achievement'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <span>🟢</span> Thành tích
                  </button>
                </div>
              </div>

              {/* Announcements Feed */}
              <div className="mt-6 space-y-4">
                {filteredAnnouncements.map((item) => {
                  const isImportant = item.category === 'important';
                  const isAchievement = item.category === 'achievement';
                  return (
                    <article
                      key={item.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        isImportant
                          ? 'bg-rose-50/30 border-rose-200 shadow-xs'
                          : isAchievement
                          ? 'bg-emerald-50/30 border-emerald-200 shadow-xs'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                              isImportant
                                ? 'bg-rose-100 text-rose-800'
                                : isAchievement
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isImportant ? '🔴 Quan trọng' : isAchievement ? '🟢 Thành tích' : '🟡 Nhắc việc'}
                          </span>
                          {item.pinned && (
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                              Ghim đầu trang
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{item.date}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{item.title}</h3>
                      <div className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                        {item.content}
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span>Đăng bởi: <strong>{item.author}</strong></span>
                        <span className="text-indigo-600 font-medium">Lớp 7C - THCS Tân Khai</span>
                      </div>
                    </article>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN 5: ❤️ GÓC ĐỒNG HÀNH CÙNG CON                          */}
        {/* ======================================================== */}
        {activeTab === 'cooperation' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* 1. Weekly Advice for Parents */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  💡
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Góc cha mẹ thông thái
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Gợi ý dành cho cha mẹ tuần này
                  </h2>
                </div>
              </div>

              <div className="mt-5 p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                  "{currentEval.parentTip}"
                </p>
                <div className="mt-3 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
                  <span>Lời khuyên từ Cô Vân Anh & Chuyên gia giáo dục</span>
                  <span className="font-semibold">Tuần 4 • 2024</span>
                </div>
              </div>

              {/* AI Family Assistant / Tâm sự & Tư vấn nuôi dạy con tuổi dậy thì */}
              <div className="mt-6 p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Hỏi Trợ lý AI Giáo dục cách đồng hành cùng {currentStudent.name}:
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Nhập câu hỏi hoặc băn khoăn của cha mẹ (ví dụ: "Làm sao để khích lệ con tự giác học?", "Con hay ngại phát biểu..."):
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ví dụ: Cách khuyên con bớt dùng điện thoại và tập trung học..."
                    value={aiAdviceTopic}
                    onChange={(e) => setAiAdviceTopic(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600"
                  />
                  <button
                    onClick={handleAskAiParentAdvice}
                    disabled={isGeneratingAdvice}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-colors shrink-0 disabled:opacity-50"
                  >
                    {isGeneratingAdvice ? 'Đang soạn...' : 'Nhận lời khuyên'}
                  </button>
                </div>

                {aiAdviceResult && (
                  <div className="mt-4 p-4 rounded-xl bg-white border border-indigo-200 animate-in fade-in">
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {aiAdviceResult.advice}
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
                      <span>🎯 Hành động gợi ý:</span> {aiAdviceResult.actionItem}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* 2. Personal Goals of Student */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                    🎯
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      Mục tiêu của con
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                      Cam kết rèn luyện cá nhân
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditingGoal(!isEditingGoal);
                    setNewGoalInput(currentStudent.personalGoal);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  {isEditingGoal ? 'Đóng' : 'Chỉnh sửa'}
                </button>
              </div>

              {isEditingGoal ? (
                <div className="mt-4 space-y-3">
                  <textarea
                    rows={2}
                    value={newGoalInput}
                    onChange={(e) => setNewGoalInput(e.target.value)}
                    placeholder="Nhập mục tiêu của con tuần này..."
                    className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingGoal(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveGoal}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                    >
                      Lưu mục tiêu
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <span className="text-xl">🏆</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{currentStudent.personalGoal}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Đã đăng ký cùng Cô Vân Anh và bố mẹ</p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Two-Way Parent-Teacher Messaging Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  💬
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Trao đổi trực tiếp 2 chiều
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Hộp thư trao đổi với Cô Vân Anh
                  </h2>
                </div>
              </div>

              {/* Message History */}
              <div className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
                {currentStudent.parentMessages.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    Chưa có tin nhắn nào. Phụ huynh có thể gửi phản hồi cho Cô Vân Anh bên dưới.
                  </p>
                ) : (
                  currentStudent.parentMessages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      {/* Parent Note */}
                      <div className="bg-slate-100 p-3.5 rounded-2xl rounded-tr-xs ml-6">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                          <span className="font-semibold text-slate-700">{msg.sender}</span>
                          <span>{msg.date}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800">{msg.content}</p>
                      </div>

                      {/* Teacher Reply */}
                      {msg.reply && (
                        <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl rounded-tl-xs mr-6">
                          <div className="flex items-center justify-between text-[11px] text-indigo-700 mb-1">
                            <span className="font-bold flex items-center gap-1">
                              👩‍🏫 Cô Vân Anh
                            </span>
                            <span className="text-slate-400">{msg.repliedAt}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-800 italic">"{msg.reply}"</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Send Form */}
              <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Gửi ý kiến, cảm ơn hoặc nhắn nhủ của gia đình tới Cô Vân Anh:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập lời nhắn gửi Cô Vân Anh..."
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" /> Gửi cô
                  </button>
                </div>
                {noteSentSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold mt-2 animate-in fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã gửi tin nhắn đến cô giáo thành công!
                  </p>
                )}
              </form>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* MÀN 6: 🏆 PORTFOLIO & HUY HIỆU THÀNH TÍCH                  */}
        {/* ======================================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Badges Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                    🏅
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                      Động viên & Khích lệ
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                      Huy hiệu tích cực đã đạt được
                    </h2>
                  </div>
                </div>
                <button
                  onClick={triggerConfetti}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-colors border border-amber-200 flex items-center gap-1"
                >
                  🎉 Chúc mừng con
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
                {currentStudent.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border ${badge.color} transition-all hover:scale-[1.02] shadow-2xs`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm">{badge.title}</h4>
                        <span className="text-[10px] opacity-75 font-mono">{badge.date}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed">{badge.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 text-center border border-slate-200">
                <p className="text-xs text-slate-500">
                  ⭐ <em>Lớp 7C chủ trương không xếp hạng học sinh để tránh tạo áp lực, thay vào đó ghi nhận từng sự nỗ lực và tiến bộ của mỗi em hàng ngày.</em>
                </p>
              </div>
            </div>

            {/* Portfolio Items */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  📁
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Sản phẩm & Hoạt động
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Hồ sơ học tập (Portfolio 7C)
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {currentStudent.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white text-indigo-700 border border-slate-200">
                        {item.type}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{item.date}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation Bar (5 Screens Quick Access) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 flex justify-around items-center">
        {[
          { id: 'home', label: 'Trang chủ', icon: Home },
          { id: 'evaluation', label: 'Đánh giá', icon: BarChart3 },
          { id: 'weekly', label: 'Nhận xét', icon: FileText },
          { id: 'announcements', label: 'Báo lớp', icon: Bell, badge: announcements.length },
          { id: 'cooperation', label: 'Đồng hành', icon: Heart },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
                isActive ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
              {item.badge && (
                <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
};
