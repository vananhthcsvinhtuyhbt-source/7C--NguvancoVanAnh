import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { Student, LiteratureGradeRecord } from '../types';
import {
  BookOpen,
  Search,
  Sparkles,
  Save,
  CheckCircle2,
  Edit3,
  Award,
  TrendingUp,
  AlertCircle,
  X,
  FileSpreadsheet,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Zap,
  Clock,
  Lock,
  Tag,
} from 'lucide-react';

export const LiteratureGradebook: React.FC = () => {
  const {
    students,
    updateLiteratureGrades,
    batchRecalculateLiteratureAverages,
    clearAllGradesAndComments,
    classInfo,
    gradeColumnNames,
    updateGradeColumnNames,
    toggleApproveLiteratureGrade,
    batchApproveLiteratureGrades,
  } = useClass();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'excellent' | 'good' | 'average' | 'needs_attention'>('all');

  // Column names customization modal state
  const [showColumnNamesModal, setShowColumnNamesModal] = useState(false);
  const [tempColNames, setTempColNames] = useState(gradeColumnNames);

  // Modal edit single student detail
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formOral, setFormOral] = useState<string>('');
  const [formTest15m1, setFormTest15m1] = useState<string>('');
  const [formTest15m2, setFormTest15m2] = useState<string>('');
  const [formPeriod, setFormPeriod] = useState<string>('');
  const [formMidterm, setFormMidterm] = useState<string>('');
  const [formFinalExam, setFormFinalExam] = useState<string>('');
  const [formAverage, setFormAverage] = useState<string>('');
  const [formIsCustomAverage, setFormIsCustomAverage] = useState<boolean>(false);
  const [formIsApproved, setFormIsApproved] = useState<boolean>(false);
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [formWritingSkill, setFormWritingSkill] = useState<string>('Tốt');
  const [formReadingSkill, setFormReadingSkill] = useState<string>('Nắm chắc ý chính');
  const [formSpeakingSkill, setFormSpeakingSkill] = useState<string>('Tự tin');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveToast, setSaveToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  const showToast = (msg: string) => {
    setSaveToast({ show: true, msg });
    setTimeout(() => setSaveToast({ show: false, msg: '' }), 3500);
  };

  // Open edit modal for student
  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    const g = student.literatureGrades || {};
    setFormOral(g.oral !== undefined && g.oral !== null ? String(g.oral) : '');
    setFormTest15m1(g.test15m1 !== undefined && g.test15m1 !== null ? String(g.test15m1) : '');
    setFormTest15m2(g.test15m2 !== undefined && g.test15m2 !== null ? String(g.test15m2) : '');
    setFormPeriod(g.periodTest !== undefined && g.periodTest !== null ? String(g.periodTest) : '');
    setFormMidterm(g.midterm !== undefined && g.midterm !== null ? String(g.midterm) : '');
    setFormFinalExam(g.finalExam !== undefined && g.finalExam !== null ? String(g.finalExam) : '');
    setFormAverage(g.semesterAverage !== undefined && g.semesterAverage !== null ? String(g.semesterAverage) : '');
    setFormIsCustomAverage(!!g.isCustomAverage);
    setFormIsApproved(!!g.isApproved);
    setFormFeedback(g.feedback || g.teacherRemarks || '');
    setFormWritingSkill(g.writingSkill || g.writingCompetency || 'Tốt');
    setFormReadingSkill(g.readingSkill || g.readingCompetency || 'Nắm chắc ý chính');
    setFormSpeakingSkill(g.speakingListeningCompetency || 'Tự tin');
  };

  // Calculate auto average for modal
  const calculateAutoAverageInModal = (
    oralStr: string,
    t1Str: string,
    t2Str: string,
    periodStr: string,
    midStr: string,
    finalStr: string
  ): number | null => {
    const scores: number[] = [];
    const weights: number[] = [];
    const o = oralStr === '' ? null : parseFloat(oralStr);
    const t1 = t1Str === '' ? null : parseFloat(t1Str);
    const t2 = t2Str === '' ? null : parseFloat(t2Str);
    const p = periodStr === '' ? null : parseFloat(periodStr);
    const m = midStr === '' ? null : parseFloat(midStr);
    const f = finalStr === '' ? null : parseFloat(finalStr);

    if (o !== null && !isNaN(o)) { scores.push(o); weights.push(1); }
    if (t1 !== null && !isNaN(t1)) { scores.push(t1); weights.push(1); }
    if (t2 !== null && !isNaN(t2)) { scores.push(t2); weights.push(1); }
    if (p !== null && !isNaN(p)) { scores.push(p); weights.push(2); }
    if (m !== null && !isNaN(m)) { scores.push(m); weights.push(2); }
    if (f !== null && !isNaN(f)) { scores.push(f); weights.push(3); }

    if (scores.length === 0) return null;
    const totalScore = scores.reduce((sum, s, idx) => sum + s * weights[idx], 0);
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    return Math.round((totalScore / totalWeight) * 10) / 10;
  };

  // Handle save from modal
  const handleSaveModal = () => {
    if (!editingStudent) return;
    const oralNum = formOral === '' ? null : parseFloat(formOral);
    const t1Num = formTest15m1 === '' ? null : parseFloat(formTest15m1);
    const t2Num = formTest15m2 === '' ? null : parseFloat(formTest15m2);
    const periodNum = formPeriod === '' ? null : parseFloat(formPeriod);
    const midtermNum = formMidterm === '' ? null : parseFloat(formMidterm);
    const finalNum = formFinalExam === '' ? null : parseFloat(formFinalExam);
    const avgNum = formAverage === '' ? undefined : parseFloat(formAverage);

    updateLiteratureGrades(editingStudent.id, {
      oral: oralNum,
      test15m1: t1Num,
      test15m2: t2Num,
      periodTest: periodNum,
      midterm: midtermNum,
      finalExam: finalNum,
      semesterAverage: formIsCustomAverage ? avgNum : undefined,
      isCustomAverage: formIsCustomAverage,
      feedback: formFeedback.trim(),
      writingSkill: formWritingSkill,
      readingSkill: formReadingSkill,
      speakingListeningCompetency: formSpeakingSkill,
      isApproved: formIsApproved !== undefined ? formIsApproved : true,
    });

    setEditingStudent(null);
    showToast(`Đã lưu toàn bộ điểm & đánh giá cho em ${editingStudent.name}`);
  };

  // Quick inline update for score columns
  const handleInlineChange = (studentId: string, field: keyof LiteratureGradeRecord, value: string) => {
    const num = value === '' ? null : parseFloat(value);
    if (num !== null && (isNaN(num) || num < 0 || num > 10)) return;
    updateLiteratureGrades(studentId, { [field]: num, isApproved: true });
  };

  // Quick inline update for average
  const handleInlineAverageChange = (studentId: string, value: string) => {
    if (value === '') {
      updateLiteratureGrades(studentId, { isCustomAverage: false, isApproved: true });
      return;
    }
    const num = parseFloat(value);
    if (isNaN(num) || num < 0 || num > 10) return;
    updateLiteratureGrades(studentId, { semesterAverage: num, isCustomAverage: true, isApproved: true });
  };

  // Reset student average to formula
  const handleResetStudentAverage = (studentId: string, studentName: string) => {
    updateLiteratureGrades(studentId, { isCustomAverage: false });
    showToast(`Đã tính lại ĐTB tự động theo hệ số chuẩn cho ${studentName}`);
  };

  // Batch recalculate all
  const handleBatchRecalculate = () => {
    batchRecalculateLiteratureAverages();
    showToast('Đã tính lại ĐTB tự động theo hệ số chuẩn cho toàn bộ 38 học sinh!');
  };

  // AI Generator for Literature Comment
  const handleGenerateAiLiteratureFeedback = async () => {
    if (!editingStudent) return;
    setIsAiLoading(true);
    try {
      const avgScore = formAverage || formPeriod || formTest15m1 || formOral || '8.5';
      const res = await fetch('/api/gemini/generate-literature-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: editingStudent.name,
          score: parseFloat(avgScore),
          testType: 'Viết đoạn văn cảm thụ, Đọc hiểu văn bản & Điểm tổng kết',
          writingSkill: formWritingSkill,
          readingSkill: formReadingSkill,
          notes: formFeedback || 'Em có ý thức học môn Ngữ Văn tốt',
        }),
      });
      const data = await res.json();
      if (data.feedback) {
        setFormFeedback(data.feedback);
      }
    } catch (err) {
      console.error('Error generating AI literature feedback:', err);
      setFormFeedback(
        `Em ${editingStudent.name} có năng lực cảm thụ văn học tốt, diễn đạt trong sáng và giàu cảm xúc. Cần tiếp tục chú ý trình bày bài sạch đẹp và liên kết các luận điểm chặt chẽ hơn nữa.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Stats calculation
  const totalStudents = students.length;
  const gradedStudents = students.filter((s) => s.literatureGrades?.semesterAverage !== undefined && s.literatureGrades?.semesterAverage !== null);
  const classAverage =
    gradedStudents.length > 0
      ? Math.round(
          (gradedStudents.reduce((acc, s) => acc + (s.literatureGrades.semesterAverage || 0), 0) /
            gradedStudents.length) *
            10
        ) / 10
      : 8.2;

  const countExcellent = students.filter((s) => (s.literatureGrades?.semesterAverage || 0) >= 8.5).length;
  const countGood = students.filter(
    (s) => (s.literatureGrades?.semesterAverage || 0) >= 7.0 && (s.literatureGrades?.semesterAverage || 0) < 8.5
  ).length;
  const countAverage = students.filter(
    (s) => (s.literatureGrades?.semesterAverage || 0) < 7.0
  ).length;

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    const avg = s.literatureGrades?.semesterAverage || 0;
    if (gradeFilter === 'excellent') return avg >= 8.5;
    if (gradeFilter === 'good') return avg >= 7.0 && avg < 8.5;
    if (gradeFilter === 'needs_attention') return avg < 7.0;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {saveToast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom border border-emerald-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{saveToast.msg}</span>
        </div>
      )}

      {/* Header Info Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold uppercase tracking-wider border border-emerald-600">
                Sổ điểm điện tử môn Ngữ Văn
              </span>
              <span className="text-xs text-emerald-200">Giáo viên: Cô Vân Anh</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[11px] font-extrabold flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Cô tự do điều chỉnh mọi mục
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Bảng điểm môn Ngữ Văn – {classInfo.name} ({classInfo.school})
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Cô Vân Anh có thể điều chỉnh trực tiếp tất cả các cột điểm (Miệng, 15p, 1 tiết, Giữa kỳ, Cuối kỳ, ĐTB môn) hoặc mở chi tiết từng em để phê duyệt lời phê, đánh giá năng lực Đọc - Viết - Nói và đồng bộ ngay sang sổ liên lạc phụ huynh.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-xs">
              {classAverage}
            </div>
            <div>
              <p className="text-xs text-emerald-200 font-medium">ĐTB môn Ngữ Văn</p>
              <p className="text-sm font-bold text-white">Toàn lớp 7C</p>
              <p className="text-[11px] text-emerald-300">Dựa trên {totalStudents} học sinh</p>
            </div>
          </div>
        </div>

        {/* 3 Metric cards inside banner */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-white/15">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-emerald-200 font-medium">Xuất sắc & Giỏi (≥ 8.5)</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{countExcellent} em</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-emerald-200 font-medium">Khá (7.0 - 8.4)</p>
            <p className="text-lg sm:text-xl font-bold text-white mt-0.5">{countGood} em</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[11px] text-emerald-200 font-medium">Cần cố gắng (&lt; 7.0)</p>
            <p className="text-lg sm:text-xl font-bold text-amber-200 mt-0.5">{countAverage} em</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Batch Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh hoặc mã số (vd: 7C09, Châu...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filters */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setGradeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                gradeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({totalStudents})
            </button>
            <button
              onClick={() => setGradeFilter('excellent')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                gradeFilter === 'excellent'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Giỏi ({countExcellent})
            </button>
            <button
              onClick={() => setGradeFilter('good')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                gradeFilter === 'good'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Khá ({countGood})
            </button>
            <button
              onClick={() => setGradeFilter('needs_attention')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                gradeFilter === 'needs_attention'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Cần rèn ({countAverage})
            </button>
          </div>

          {/* Công bố bảng điểm cho Phụ huynh */}
          <button
            onClick={() => {
              batchApproveLiteratureGrades(true);
              showToast('Đã phê duyệt và công bố bảng điểm môn Ngữ Văn cho toàn bộ phụ huynh!');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Công bố toàn bộ bảng điểm cho phụ huynh học sinh xem trên điện thoại"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Công bố bảng điểm cho PH</span>
          </button>

          {/* Batch Recalculate Button */}
          <button
            onClick={handleBatchRecalculate}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Tính lại toàn bộ ĐTB tự động theo công thức: (Miệng + 15p1 + 15p2 + 1Tiết*2 + GK*2 + CK*3) / Tổng hệ số"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tính lại ĐTB tự động</span>
          </button>

          {/* Clear All Grades & Comments Button */}
          <button
            onClick={() => {
              if (window.confirm('Cô Vân Anh có chắc muốn để trống toàn bộ điểm và nhận xét môn Ngữ Văn của tất cả học sinh để bắt đầu nhập mới?')) {
                clearAllGradesAndComments();
                showToast('Đã để trống toàn bộ điểm và nhận xét của lớp 7C!');
              }
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Để trống toàn bộ điểm số và lời phê môn Ngữ Văn của cả lớp"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
            <span>Để trống điểm & nhận xét</span>
          </button>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Bảng điểm chi tiết môn Ngữ Văn – Năm học 2026 - 2027
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Cô có thể gõ trực tiếp vào bất kỳ ô nào (kể cả ĐTB)
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3 w-10 text-center">STT</th>
                <th className="py-3 px-3 w-16">Mã HS</th>
                <th className="py-3 px-4 min-w-[150px]">Họ và tên học sinh</th>
                <th className="py-3 px-1 text-center w-16" title="Kiểm tra miệng - Hệ số 1">
                  Miệng <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-1 text-center w-16" title="15 phút đợt 1 - Hệ số 1">
                  15p (1) <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-1 text-center w-16" title="15 phút đợt 2 - Hệ số 1">
                  15p (2) <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-1 text-center w-20" title="1 tiết viết đoạn văn - Hệ số 2">
                  1 Tiết <span className="text-[9px] text-slate-400 block font-normal">(HS2)</span>
                </th>
                <th className="py-3 px-1 text-center w-20" title="Thi giữa kỳ - Hệ số 2">
                  Giữa kỳ <span className="text-[9px] text-slate-400 block font-normal">(HS2)</span>
                </th>
                <th className="py-3 px-1 text-center w-20" title="Thi cuối kỳ - Hệ số 3">
                  Cuối kỳ <span className="text-[9px] text-slate-400 block font-normal">(HS3)</span>
                </th>
                <th className="py-3 px-2 text-center w-24 bg-emerald-50/80 text-emerald-950 font-black">
                  ĐTB môn <span className="text-[9px] text-emerald-700 block font-normal">(Cô có thể sửa)</span>
                </th>
                <th className="py-3 px-3 min-w-[200px]">Lời phê & Đánh giá của Cô Vân Anh</th>
                <th className="py-3 px-3 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const g = student.literatureGrades || {};
                  const avg = g.semesterAverage;
                  const isCustom = !!g.isCustomAverage;

                  const avgColor =
                    avg !== undefined && avg !== null
                      ? avg >= 8.5
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : avg >= 7.0
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-amber-500 bg-amber-50 text-amber-800'
                      : 'border-slate-200 bg-slate-50 text-slate-500';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/90 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 text-xs">
                        {student.code}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full ${student.avatarColor} text-white text-[10px] flex items-center justify-center font-bold`}>
                            {student.name.slice(-1)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>

                      {/* Oral (HS1) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.oral !== undefined && g.oral !== null ? g.oral : ''}
                          onChange={(e) => handleInlineChange(student.id, 'oral', e.target.value)}
                          className="w-13 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* 15m (1) (HS1) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.test15m1 !== undefined && g.test15m1 !== null ? g.test15m1 : ''}
                          onChange={(e) => handleInlineChange(student.id, 'test15m1', e.target.value)}
                          className="w-13 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* 15m (2) (HS1) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.test15m2 !== undefined && g.test15m2 !== null ? g.test15m2 : ''}
                          onChange={(e) => handleInlineChange(student.id, 'test15m2', e.target.value)}
                          className="w-13 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* Period test (HS2) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.periodTest !== undefined && g.periodTest !== null ? g.periodTest : ''}
                          onChange={(e) => handleInlineChange(student.id, 'periodTest', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* Midterm (HS2) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.midterm !== undefined && g.midterm !== null ? g.midterm : ''}
                          onChange={(e) => handleInlineChange(student.id, 'midterm', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* Final exam (HS3) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={g.finalExam !== undefined && g.finalExam !== null ? g.finalExam : ''}
                          onChange={(e) => handleInlineChange(student.id, 'finalExam', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-bold focus:border-emerald-600 focus:outline-hidden transition-colors"
                          placeholder="-"
                        />
                      </td>

                      {/* Semester Average (ĐTB) - Editable & Auto Toggle */}
                      <td className="py-2 px-1 text-center bg-emerald-50/40">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={avg !== undefined && avg !== null ? avg : ''}
                            onChange={(e) => handleInlineAverageChange(student.id, e.target.value)}
                            className={`w-14 text-center py-1 border rounded-lg text-xs font-black focus:outline-hidden ${avgColor}`}
                            title={isCustom ? 'Điểm này do Cô Vân Anh tự nhập điều chỉnh' : 'Điểm tự động tính theo công thức hệ số'}
                          />
                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => handleResetStudentAverage(student.id, student.name)}
                              className="p-1 text-slate-400 hover:text-emerald-700 rounded-md hover:bg-white"
                              title="Bấm để tính lại ĐTB tự động theo các đầu điểm"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                        <span className="text-[9px] block text-slate-400 font-medium">
                          {isCustom ? 'Cô chốt' : 'Tự động'}
                        </span>
                      </td>

                      {/* Feedback summary */}
                      <td className="py-2.5 px-3 text-xs text-slate-600">
                        {g.feedback || g.teacherRemarks ? (
                          <div className="line-clamp-2" title={g.feedback || g.teacherRemarks}>
                            <span className="font-semibold text-emerald-800">
                              [{g.writingSkill || 'Tốt'} - {g.readingSkill || 'Đọc hiểu tốt'}]:
                            </span>{' '}
                            {g.feedback || g.teacherRemarks}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có nhận xét riêng</span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => openEditModal(student)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1 ml-auto border border-emerald-200 transition-colors shadow-2xs"
                          title="Sửa mọi mục: Tất cả điểm, ĐTB, kỹ năng và lời phê"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Sửa mọi mục</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Edit Student Literature Grade & Comment with FULL Controls */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl ${editingStudent.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-xs`}>
                  {editingStudent.avatarIcon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-lg">
                      {editingStudent.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
                      {editingStudent.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Phụ huynh: {editingStudent.parentName} • Cô Vân Anh toàn quyền điều chỉnh mọi mục
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {/* Score inputs grid */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  1. Các đầu điểm bài kiểm tra (Thang điểm 10):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Miệng (HS1)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formOral}
                      onChange={(e) => setFormOral(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">15p (1) (HS1)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formTest15m1}
                      onChange={(e) => setFormTest15m1(e.target.value)}
                      placeholder="vd: 8.0"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">15p (2) (HS1)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formTest15m2}
                      onChange={(e) => setFormTest15m2(e.target.value)}
                      placeholder="vd: 9.0"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">1 Tiết (HS2)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Giữa kỳ (HS2)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formMidterm}
                      onChange={(e) => setFormMidterm(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-600 block mb-1 font-semibold">Cuối kỳ (HS3)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formFinalExam}
                      onChange={(e) => setFormFinalExam(e.target.value)}
                      placeholder="Chưa thi"
                      className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-center focus:border-emerald-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Semester Average Setting */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-bold text-emerald-950 block">
                      2. Điểm Trung Bình Môn Ngữ Văn (ĐTB):
                    </label>
                    <p className="text-[11px] text-emerald-800 mt-0.5">
                      {formIsCustomAverage
                        ? 'Đang bật chế độ: Cô tự do gõ và chốt điểm ĐTB theo ý muốn'
                        : 'Đang bật chế độ: Tự động tính theo công thức hệ số chuẩn'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={formAverage}
                        onChange={(e) => {
                          setFormAverage(e.target.value);
                          setFormIsCustomAverage(true);
                        }}
                        placeholder="vd: 8.5"
                        className="w-20 px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-sm font-black text-center text-emerald-900 focus:outline-hidden"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const calculated = calculateAutoAverageInModal(
                          formOral,
                          formTest15m1,
                          formTest15m2,
                          formPeriod,
                          formMidterm,
                          formFinalExam
                        );
                        if (calculated !== null) {
                          setFormAverage(String(calculated));
                        }
                        setFormIsCustomAverage(false);
                      }}
                      className="px-2.5 py-1.5 text-[11px] font-bold bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl flex items-center gap-1 transition-colors"
                      title="Tính lại ĐTB tự động từ các đầu điểm đã nhập"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Tự động tính
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Skills Rating Under Chương trình GDPT 2018 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kỹ năng Viết văn:
                  </label>
                  <select
                    value={formWritingSkill}
                    onChange={(e) => setFormWritingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  >
                    <option value="Xuất sắc">Xuất sắc – Giàu cảm xúc, lập luận sâu</option>
                    <option value="Tốt">Tốt – Mạch lạc, từ ngữ phong phú</option>
                    <option value="Khá">Khá – Đúng bố cục, cần trau chuốt câu</option>
                    <option value="Cần rèn luyện">Cần rèn luyện – Còn lỗi chính tả/ngắt câu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kỹ năng Đọc - Cảm thụ:
                  </label>
                  <select
                    value={formReadingSkill}
                    onChange={(e) => setFormReadingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  >
                    <option value="Cảm thụ rất tốt">Cảm thụ rất tốt – Hiểu sâu thông điệp</option>
                    <option value="Nắm chắc ý chính">Nắm chắc ý chính – Trả lời chuẩn xác</option>
                    <option value="Cần đọc kĩ văn bản">Cần đọc kĩ văn bản – Tránh trả lời sơ sài</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kỹ năng Nói & Nghe:
                  </label>
                  <select
                    value={formSpeakingSkill}
                    onChange={(e) => setFormSpeakingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600 font-medium"
                  >
                    <option value="Rất tự tin, diễn đạt truyền cảm">Rất tự tin, diễn đạt truyền cảm</option>
                    <option value="Tự tin, tương tác tốt">Tự tin, tương tác tốt</option>
                    <option value="Khá, cần nói to rõ ràng hơn">Khá, cần nói to rõ ràng hơn</option>
                    <option value="Còn rụt rè trước lớp">Còn rụt rè trước lớp</option>
                  </select>
                </div>
              </div>

              {/* Feedback text area with AI assist */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800">
                    Lời phê & Nhận xét của Cô Vân Anh gửi Phụ huynh:
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiLiteratureFeedback}
                    disabled={isAiLoading}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {isAiLoading ? 'AI đang soạn...' : '✨ AI gợi ý lời phê'}
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formFeedback}
                  onChange={(e) => setFormFeedback(e.target.value)}
                  placeholder="Nhập lời phê của cô Vân Anh về bài làm, chữ viết, khả năng cảm thụ và sự tiến bộ của con..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                />
              </div>

              {/* Quick comment snippets */}
              <div>
                <span className="text-[11px] text-slate-500 font-medium block mb-1.5">
                  Nhận xét nhanh gợi ý từ Cô:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Cảm thụ văn học tinh tế, sâu sắc',
                    'Viết đoạn văn biểu cảm giàu hình ảnh',
                    'Nắm chắc kiến thức tiếng Việt',
                    'Cần chú ý lỗi chính tả và ngắt câu',
                    'Chữ viết nắn nót, bài làm sạch đẹp',
                    'Cần dành thêm thời gian soạn bài ở nhà',
                    'Tích cực giơ tay phát biểu xây dựng bài',
                  ].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setFormFeedback((prev) => (prev ? `${prev}. ${tag}` : tag))
                      }
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] text-slate-700 transition-colors"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-between gap-2.5 pt-5 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setFormOral('');
                  setFormTest15m1('');
                  setFormTest15m2('');
                  setFormPeriod('');
                  setFormMidterm('');
                  setFormFinalExam('');
                  setFormAverage('');
                  setFormIsCustomAverage(false);
                  setFormFeedback('');
                  setFormWritingSkill('');
                  setFormReadingSkill('');
                  setFormSpeakingSkill('');
                }}
                className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                title="Xóa trắng để trống toàn bộ điểm và lời phê của học sinh này"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Để trống điểm & lời phê
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleSaveModal}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Lưu toàn bộ thay đổi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
