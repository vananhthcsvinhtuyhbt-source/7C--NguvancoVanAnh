import React, { useState, useEffect } from 'react';
import { Student, WeeklyEvaluation } from '../types';
import { COMMENT_BANK } from '../data/mockData';
import {
  X,
  CheckCircle2,
  Sparkles,
  BookmarkPlus,
  BookOpen,
  Award,
  Heart,
  TrendingUp,
  Save,
  MessageSquare,
  Users,
} from 'lucide-react';

interface EvaluationComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  selectedWeek: number;
  onSave: (data: Partial<WeeklyEvaluation>, isApproved: boolean) => void;
}

type TabType = 'criteria' | 'literature' | 'comment_ai' | 'family_other';

export const EvaluationComposerModal: React.FC<EvaluationComposerModalProps> = ({
  isOpen,
  onClose,
  student,
  selectedWeek,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('criteria');

  // Basic title
  const [evalTitle, setEvalTitle] = useState('');

  // 1. Criteria & Scores
  const [academicScore, setAcademicScore] = useState<number>(4);
  const [academic, setAcademic] = useState<'Xuất sắc' | 'Tốt' | 'Khá tốt' | 'Cần cố gắng'>('Tốt');

  const [disciplineScore, setDisciplineScore] = useState<number>(5);
  const [discipline, setDiscipline] = useState<'Tốt' | 'Khá tốt' | 'Cần nhắc nhở'>('Tốt');

  const [attitudeScore, setAttitudeScore] = useState<number>(4);
  const [attitude, setAttitude] = useState<'Rất tích cực' | 'Tích cực' | 'Chưa tập trung'>('Tích cực');

  const [cooperationScore, setCooperationScore] = useState<number>(4);
  const [cooperation, setCooperation] = useState<'Tốt' | 'Khá tốt' | 'Cần hòa đồng hơn'>('Tốt');

  const [attendanceScore, setAttendanceScore] = useState<number>(5);
  const [attendance, setAttendance] = useState<'Tốt (Đúng giờ)' | 'Nghỉ có phép' | 'Đi muộn'>('Tốt (Đúng giờ)');

  const [progressStars, setProgressStars] = useState<number>(4);
  const [progressTrend, setProgressTrend] = useState<'up' | 'steady' | 'needs_attention'>('steady');

  // 2. Literature specific
  const [litLesson, setLitLesson] = useState('');
  const [litScore, setLitScore] = useState<string>('');
  const [litFeedback, setLitFeedback] = useState('');
  const [litReadingSkill, setLitReadingSkill] = useState('Nắm chắc kiến thức & nội dung chính');
  const [litWritingSkill, setLitWritingSkill] = useState('Khá tốt, biết diễn đạt cảm xúc');

  // 3. Comments & AI
  const [selectedAttitudeTags, setSelectedAttitudeTags] = useState<string[]>([]);
  const [selectedStudyTags, setSelectedStudyTags] = useState<string[]>([]);
  const [selectedCoopTags, setSelectedCoopTags] = useState<string[]>([]);
  const [selectedDisciplineTags, setSelectedDisciplineTags] = useState<string[]>([]);
  const [teacherComment, setTeacherComment] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // 4. Family & Other
  const [parentTip, setParentTip] = useState('');
  const [familyCoordination, setFamilyCoordination] = useState('');
  const [subjectMath, setSubjectMath] = useState('');
  const [subjectEnglish, setSubjectEnglish] = useState('');
  const [subjectScience, setSubjectScience] = useState('');

  // Status
  const [isApproved, setIsApproved] = useState(true);

  const handleClearAllFields = () => {
    setTeacherComment('');
    setStrengths('');
    setImprovements('');
    setParentTip('');
    setFamilyCoordination('');
    setSubjectMath('');
    setSubjectEnglish('');
    setSubjectScience('');
    setLitScore('');
    setLitFeedback('');
    setAcademicScore(0);
    setAcademic('Chưa đánh giá' as any);
    setDisciplineScore(0);
    setDiscipline('Chưa đánh giá' as any);
    setAttitudeScore(0);
    setAttitude('Chưa đánh giá' as any);
    setCooperationScore(0);
    setCooperation('Chưa đánh giá' as any);
    setProgressStars(0);
    setSelectedAttitudeTags([]);
    setSelectedStudyTags([]);
    setSelectedCoopTags([]);
    setSelectedDisciplineTags([]);
  };

  useEffect(() => {
    if (!student) return;
    const ev = student.weeklyEvaluations[selectedWeek] || {
      week: selectedWeek,
      title: `Tuần ${selectedWeek}`,
      academic: 'Chưa đánh giá',
      academicScore: 0,
      discipline: 'Chưa đánh giá',
      disciplineScore: 0,
      attitude: 'Chưa đánh giá',
      attitudeScore: 0,
      cooperation: 'Chưa đánh giá',
      cooperationScore: 0,
      attendance: 'Tốt (Đúng giờ)',
      attendanceScore: 5,
      progressStars: 0,
      progressTrend: 'steady',
      strengths: '',
      improvements: '',
      familyCoordination: '',
      teacherComment: '',
      parentTip: '',
      isApproved: false,
    };

    setEvalTitle(ev.title || `Tuần ${selectedWeek}`);
    setAcademicScore(ev.academicScore ?? 0);
    setAcademic((ev.academic as any) || 'Chưa đánh giá');
    setDisciplineScore(ev.disciplineScore ?? 0);
    setDiscipline((ev.discipline as any) || 'Chưa đánh giá');
    setAttitudeScore(ev.attitudeScore ?? 0);
    setAttitude((ev.attitude as any) || 'Chưa đánh giá');
    setCooperationScore(ev.cooperationScore ?? 0);
    setCooperation((ev.cooperation as any) || 'Chưa đánh giá');
    setAttendanceScore(ev.attendanceScore ?? 5);
    setAttendance((ev.attendance as any) || 'Tốt (Đúng giờ)');
    setProgressStars(ev.progressStars ?? 0);
    setProgressTrend(ev.progressTrend || 'steady');

    const lit = ev.literatureWeekly || {};
    setLitLesson(lit.lessonTitle || '');
    setLitScore(lit.score !== undefined && lit.score !== null ? String(lit.score) : '');
    setLitFeedback(lit.feedback || student.literatureGrades?.feedback || '');
    setLitReadingSkill(lit.readingSkill || 'Nắm chắc kiến thức & nội dung chính');
    setLitWritingSkill(lit.writingSkill || 'Khá tốt, biết diễn đạt cảm xúc');

    setTeacherComment(ev.teacherComment || '');
    setStrengths(ev.strengths || '');
    setImprovements(ev.improvements || '');

    setParentTip(ev.parentTip || '');
    setFamilyCoordination(ev.familyCoordination || '');
    setSubjectMath(ev.subjectNotes?.math || '');
    setSubjectEnglish(ev.subjectNotes?.english || '');
    setSubjectScience(ev.subjectNotes?.science || '');

    setIsApproved(ev.isApproved ?? false);

    setSelectedAttitudeTags([]);
    setSelectedStudyTags([]);
    setSelectedCoopTags([]);
    setSelectedDisciplineTags([]);
  }, [student, selectedWeek]);

  if (!isOpen || !student) return null;

  // Auto combine tags into comment
  const handleAutoCombineTags = () => {
    const attitudes = selectedAttitudeTags.join(', ');
    const studies = selectedStudyTags.join(', ');
    const disciplines = selectedDisciplineTags.join(', ');

    const combined = `Em ${student.name} tuần này có thái độ ${attitudes.toLowerCase() || 'tích cực'}. Về học tập, em ${studies.toLowerCase() || 'nắm chắc bài'}. Nề nếp: ${disciplines.toLowerCase() || 'rất tốt'}. Điểm sáng: ${strengths || 'chăm chỉ'}. Cô lưu ý em ${improvements || 'cần mạnh dạn phát biểu hơn'}.`;
    const tip = `Gợi ý cha mẹ: Tuần này con đang cần rèn luyện ${improvements || 'sự tự tin'}. Cha mẹ hãy dành 10 phút mỗi tối để khích lệ con tự diễn đạt một điều con học được hôm nay.`;

    setTeacherComment(combined);
    setParentTip(tip);
  };

  // Gemini AI generation
  const handleGenerateAiComment = async () => {
    setIsGeneratingAi(true);
    setAiSuccess(false);

    try {
      const response = await fetch('/api/gemini/generate-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: student.name,
          currentWeek: `Tuần ${selectedWeek}`,
          attitudeTags: selectedAttitudeTags,
          studyTags: selectedStudyTags,
          strengths,
          improvements,
        }),
      });

      const data = await response.json();
      if (data.comment) setTeacherComment(data.comment);
      if (data.parentTip) setParentTip(data.parentTip);

      setAiSuccess(true);
      setTimeout(() => setAiSuccess(false), 4000);
    } catch (err) {
      console.error('Error generating AI comment:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSave = (approved: boolean) => {
    const payload: Partial<WeeklyEvaluation> = {
      title: evalTitle.trim() || `Tuần ${selectedWeek}`,
      academic,
      academicScore,
      discipline,
      disciplineScore,
      attitude,
      attitudeScore,
      cooperation,
      cooperationScore,
      attendance,
      attendanceScore,
      progressStars,
      progressTrend,
      strengths: strengths.trim(),
      improvements: improvements.trim(),
      familyCoordination: familyCoordination.trim(),
      teacherComment: teacherComment.trim(),
      parentTip: parentTip.trim(),
      isApproved: approved,
      literatureWeekly: {
        lessonTitle: litLesson.trim() || 'Văn bản Ngữ Văn tuần này',
        score: litScore !== '' ? parseFloat(litScore) : null,
        feedback: litFeedback.trim() || undefined,
        readingSkill: litReadingSkill,
        writingSkill: litWritingSkill,
      },
      subjectNotes: {
        math: subjectMath.trim() || undefined,
        english: subjectEnglish.trim() || undefined,
        science: subjectScience.trim() || undefined,
      },
    };

    onSave(payload, approved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 p-4 sm:p-5 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-indigo-200 font-bold font-mono bg-white/10 px-2 py-0.5 rounded-md">
                Mã {student.code} • Tuần {selectedWeek}
              </span>
              <span className="text-xs text-indigo-200">• Giáo viên: Cô Vân Anh</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-1 flex items-center gap-2">
              <span>Đánh giá toàn diện em: {student.name}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('criteria')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'criteria'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>⭐</span> 1. Thang điểm & 5 Tiêu chí
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('literature')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'literature'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>📖</span> 2. Chuyên môn Ngữ Văn
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('comment_ai')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'comment_ai'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>✍️</span> 3. Nhận xét của Cô & AI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('family_other')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'family_other'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>🤝</span> 4. Gia đình & Môn khác
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* ======================================================== */}
          {/* TAB 1: THANG ĐIỂM & 5 TIÊU CHÍ                          */}
          {/* ======================================================== */}
          {activeTab === 'criteria' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-indigo-950 block">Tiêu đề phiếu đánh giá:</label>
                  <input
                    type="text"
                    value={evalTitle}
                    onChange={(e) => setEvalTitle(e.target.value)}
                    placeholder="vd: Tuần 4 (08/09 - 14/09)"
                    className="mt-1 px-3 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg w-64 font-semibold"
                  />
                </div>
                <span className="text-[11px] text-indigo-700 font-medium">
                  Cô có thể điều chỉnh mọi thang điểm và mức xếp loại bên dưới
                </span>
              </div>

              {/* 5 Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Học tập */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      📚 Học tập & Tiếp thu
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(academicScore)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Số sao (1-5):</label>
                      <select
                        value={academicScore}
                        onChange={(e) => {
                          const s = Number(e.target.value);
                          setAcademicScore(s);
                          if (s === 5) setAcademic('Xuất sắc');
                          else if (s === 4) setAcademic('Tốt');
                          else if (s === 3) setAcademic('Khá tốt');
                          else setAcademic('Cần cố gắng');
                        }}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao ⭐⭐⭐⭐⭐</option>
                        <option value={4}>4 sao ⭐⭐⭐⭐</option>
                        <option value={3}>3 sao ⭐⭐⭐</option>
                        <option value={2}>2 sao ⭐⭐</option>
                        <option value={1}>1 sao ⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Xếp loại:</label>
                      <select
                        value={academic}
                        onChange={(e) => setAcademic(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Xuất sắc">Xuất sắc</option>
                        <option value="Tốt">Tốt</option>
                        <option value="Khá tốt">Khá tốt</option>
                        <option value="Cần cố gắng">Cần cố gắng</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Nề nếp */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      ⏰ Nề nếp & Kỷ luật
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(disciplineScore)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Số sao (1-5):</label>
                      <select
                        value={disciplineScore}
                        onChange={(e) => {
                          const s = Number(e.target.value);
                          setDisciplineScore(s);
                          if (s >= 4) setDiscipline('Tốt');
                          else if (s === 3) setDiscipline('Khá tốt');
                          else setDiscipline('Cần nhắc nhở');
                        }}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao ⭐⭐⭐⭐⭐</option>
                        <option value={4}>4 sao ⭐⭐⭐⭐</option>
                        <option value={3}>3 sao ⭐⭐⭐</option>
                        <option value={2}>2 sao ⭐⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Xếp loại:</label>
                      <select
                        value={discipline}
                        onChange={(e) => setDiscipline(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Tốt">Tốt</option>
                        <option value="Khá tốt">Khá tốt</option>
                        <option value="Cần nhắc nhở">Cần nhắc nhở</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Thái độ */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      🙋 Thái độ học & Phát biểu
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(attitudeScore)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Số sao (1-5):</label>
                      <select
                        value={attitudeScore}
                        onChange={(e) => {
                          const s = Number(e.target.value);
                          setAttitudeScore(s);
                          if (s === 5) setAttitude('Rất tích cực');
                          else if (s >= 3) setAttitude('Tích cực');
                          else setAttitude('Chưa tập trung');
                        }}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao ⭐⭐⭐⭐⭐</option>
                        <option value={4}>4 sao ⭐⭐⭐⭐</option>
                        <option value={3}>3 sao ⭐⭐⭐</option>
                        <option value={2}>2 sao ⭐⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Xếp loại:</label>
                      <select
                        value={attitude}
                        onChange={(e) => setAttitude(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Rất tích cực">Rất tích cực</option>
                        <option value="Tích cực">Tích cực</option>
                        <option value="Chưa tập trung">Chưa tập trung</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. Hợp tác */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      🤝 Kỹ năng hợp tác nhóm
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(cooperationScore)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Số sao (1-5):</label>
                      <select
                        value={cooperationScore}
                        onChange={(e) => setCooperationScore(Number(e.target.value))}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao ⭐⭐⭐⭐⭐</option>
                        <option value={4}>4 sao ⭐⭐⭐⭐</option>
                        <option value={3}>3 sao ⭐⭐⭐</option>
                        <option value={2}>2 sao ⭐⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Xếp loại:</label>
                      <select
                        value={cooperation}
                        onChange={(e) => setCooperation(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Tốt">Tốt</option>
                        <option value="Khá tốt">Khá tốt</option>
                        <option value="Cần hòa đồng hơn">Cần hòa đồng hơn</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 5. Chuyên cần */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      🎯 Chuyên cần & Đúng giờ
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(attendanceScore)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Số sao (1-5):</label>
                      <select
                        value={attendanceScore}
                        onChange={(e) => setAttendanceScore(Number(e.target.value))}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao ⭐⭐⭐⭐⭐</option>
                        <option value={4}>4 sao ⭐⭐⭐⭐</option>
                        <option value={3}>3 sao ⭐⭐⭐</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">Trạng thái:</label>
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                      >
                        <option value="Tốt (Đúng giờ)">Tốt (Đúng giờ)</option>
                        <option value="Nghỉ có phép">Nghỉ có phép</option>
                        <option value="Đi muộn">Đi muộn</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. Sao tiến bộ & Xu hướng */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" /> Tiến bộ & Xu hướng tuần
                    </span>
                    <span className="text-amber-500 font-bold">{'★'.repeat(progressStars)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-emerald-900 mb-1">Sao tiến bộ:</label>
                      <select
                        value={progressStars}
                        onChange={(e) => setProgressStars(Number(e.target.value))}
                        className="w-full p-2 text-xs bg-white border border-emerald-300 rounded-lg font-bold"
                      >
                        <option value={5}>5 sao (Tiến bộ vượt bậc)</option>
                        <option value={4}>4 sao (Tiến bộ rõ rệt)</option>
                        <option value={3}>3 sao (Duy trì ổn định)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-emerald-900 mb-1">Xu hướng:</label>
                      <select
                        value={progressTrend}
                        onChange={(e) => setProgressTrend(e.target.value as any)}
                        className="w-full p-2 text-xs bg-white border border-emerald-300 rounded-lg font-semibold"
                      >
                        <option value="up">↑ Đang tiến bộ</option>
                        <option value="steady">→ Duy trì ổn định</option>
                        <option value="needs_attention">↓ Cần theo sát</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CHUYÊN MÔN NGỮ VĂN                                */}
          {/* ======================================================== */}
          {activeTab === 'literature' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>Nội dung chuyên môn Ngữ Văn tuần {selectedWeek}</span>
                  </div>
                  <span className="text-xs bg-emerald-200/60 text-emerald-900 px-2 py-0.5 rounded-full font-semibold">
                    Cô Vân Anh phụ trách
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Tên bài học / Văn bản học trong tuần:
                    </label>
                    <input
                      type="text"
                      value={litLesson}
                      onChange={(e) => setLitLesson(e.target.value)}
                      placeholder="vd: Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn ghi lại cảm xúc"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-medium focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Điểm kiểm tra tuần (nếu có):
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={litScore}
                      onChange={(e) => setLitScore(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl font-bold text-center text-emerald-800 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Kỹ năng Đọc - Hiểu & Cảm thụ:
                    </label>
                    <select
                      value={litReadingSkill}
                      onChange={(e) => setLitReadingSkill(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-semibold focus:outline-hidden"
                    >
                      <option value="Đọc diễn cảm tốt, cảm thụ sâu sắc">Đọc diễn cảm tốt, cảm thụ sâu sắc</option>
                      <option value="Nắm chắc kiến thức & nội dung chính">Nắm chắc kiến thức & nội dung chính</option>
                      <option value="Hiểu bài khá, trả lời đúng câu hỏi">Hiểu bài khá, trả lời đúng câu hỏi</option>
                      <option value="Cần đọc kỹ và rèn luyện cảm thụ thêm">Cần đọc kỹ và rèn luyện cảm thụ thêm</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-emerald-900 mb-1">
                      Kỹ năng Viết đoạn / bài văn:
                    </label>
                    <select
                      value={litWritingSkill}
                      onChange={(e) => setLitWritingSkill(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-semibold focus:outline-hidden"
                    >
                      <option value="Văn phong giàu cảm xúc, lập luận tốt">Văn phong giàu cảm xúc, lập luận tốt</option>
                      <option value="Khá tốt, biết diễn đạt cảm xúc">Khá tốt, biết diễn đạt cảm xúc</option>
                      <option value="Diễn đạt mạch lạc, đúng thể loại">Diễn đạt mạch lạc, đúng thể loại</option>
                      <option value="Cần sửa lỗi diễn đạt và rèn chính tả">Cần sửa lỗi diễn đạt và rèn chính tả</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-900 mb-1">
                    Lời phê & Nhận xét chuyên môn Ngữ Văn của Cô Vân Anh:
                  </label>
                  <textarea
                    rows={3}
                    value={litFeedback}
                    onChange={(e) => setLitFeedback(e.target.value)}
                    placeholder="Nhận xét cụ thể cách viết đoạn văn, cảm thụ thơ văn, dùng từ, đặt câu của em..."
                    className="w-full p-3 bg-white border border-emerald-300 rounded-xl focus:outline-hidden text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: NHẬN XÉT CỦA CÔ & TRỢ LÝ AI                       */}
          {/* ======================================================== */}
          {activeTab === 'comment_ai' && (
            <div className="space-y-4 animate-in fade-in">
              {/* AI Assistant Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Trợ lý AI (Gemini 3.8 Flash): Soạn nhận xét tự nhiên & ấm áp</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateAiComment}
                    disabled={isGeneratingAi}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                  >
                    {isGeneratingAi ? (
                      'AI đang viết...'
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Tạo nhận xét độc bản cho em {student.name}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  AI sẽ kết hợp điểm mạnh, điểm cần cải thiện và các từ khóa cô đã chọn để viết nhận xét sư phạm giàu tình cảm, tránh trùng lặp giữa các em.
                </p>
                {aiSuccess && (
                  <p className="text-xs text-emerald-700 font-semibold animate-in fade-in flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> AI đã viết nhận xét và lời khuyên phụ huynh thành công!
                  </p>
                )}
              </div>

              {/* Ngân hàng nhận xét nhanh */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <BookmarkPlus className="w-4 h-4 text-indigo-600" /> Ngân hàng từ khóa nhận xét
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoCombineTags}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline"
                  >
                    Ghép câu tự động vào lời nhận xét
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">Thái độ & Tinh thần:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMENT_BANK.attitude.map((tag) => {
                        const isSel = selectedAttitudeTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setSelectedAttitudeTags((prev) =>
                                isSel ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                              isSel
                                ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSel ? '☑ ' : '☐ '} {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-1">Học tập & Tiếp thu:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMENT_BANK.academic.map((tag) => {
                        const isSel = selectedStudyTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() =>
                              setSelectedStudyTags((prev) =>
                                isSel ? prev.filter((t) => t !== tag) : [...prev, tag]
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                              isSel
                                ? 'bg-blue-600 text-white border-blue-600 font-medium'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {isSel ? '☑ ' : '☐ '} {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Textarea for Teacher Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Lời nhận xét chi tiết của Cô Vân Anh:
                </label>
                <textarea
                  rows={3}
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600 text-xs sm:text-sm"
                  placeholder="Nhập nội dung nhận xét tuần cho học sinh..."
                />
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm sáng nổi bật:</label>
                  <input
                    type="text"
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    placeholder="vd: Hăng hái phát biểu, chữ viết nắn nót"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm cần rèn luyện thêm:</label>
                  <input
                    type="text"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    placeholder="vd: Cần tự tin hơn khi trình bày trước đám đông"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: GIA ĐÌNH & MÔN HỌC KHÁC                           */}
          {/* ======================================================== */}
          {activeTab === 'family_other' && (
            <div className="space-y-4 animate-in fade-in">
              {/* Parent tip */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Góc đồng hành - Gợi ý dành cho cha mẹ tuần này:
                </label>
                <textarea
                  rows={2}
                  value={parentTip}
                  onChange={(e) => setParentTip(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600 text-xs sm:text-sm"
                  placeholder="Gợi ý cha mẹ làm gì ở nhà để giúp con tiến bộ hơn..."
                />
              </div>

              {/* Family coordination */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  Phối hợp giữa Cô và Gia đình:
                </label>
                <input
                  type="text"
                  value={familyCoordination}
                  onChange={(e) => setFamilyCoordination(e.target.value)}
                  placeholder="vd: Gia đình cùng theo sát việc con hoàn thành phiếu bài tập trước thứ Sáu"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Other subjects notes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Ghi chú các môn học khác (tùy chọn):
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Môn Toán:</label>
                    <input
                      type="text"
                      value={subjectMath}
                      onChange={(e) => setSubjectMath(e.target.value)}
                      placeholder="vd: Làm tốt bài tập hình học"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Môn Tiếng Anh:</label>
                    <input
                      type="text"
                      value={subjectEnglish}
                      onChange={(e) => setSubjectEnglish(e.target.value)}
                      placeholder="vd: Phát âm chuẩn, từ vựng tốt"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Môn KHTN:</label>
                    <input
                      type="text"
                      value={subjectScience}
                      onChange={(e) => setSubjectScience(e.target.value)}
                      placeholder="vd: Chăm chú làm thí nghiệm"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Trạng thái:</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                isApproved
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isApproved ? 'Đã duyệt gửi PH' : 'Bản nháp chờ duyệt'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearAllFields}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1 transition-colors"
              title="Xóa trắng để trống mọi điểm và nhận xét"
            >
              Để trống nội dung
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors"
            >
              Lưu bản nháp (Chờ duyệt)
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Lưu & Duyệt gửi phụ huynh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
