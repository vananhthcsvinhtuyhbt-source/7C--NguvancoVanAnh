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
} from 'lucide-react';

export const LiteratureGradebook: React.FC = () => {
  const { students, updateLiteratureGrades, classInfo } = useClass();

  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'all' | 'excellent' | 'good' | 'average' | 'needs_attention'>('all');
  
  // Modal edit single student detail
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formOral, setFormOral] = useState<string>('');
  const [formTest15m1, setFormTest15m1] = useState<string>('');
  const [formTest15m2, setFormTest15m2] = useState<string>('');
  const [formPeriod, setFormPeriod] = useState<string>('');
  const [formMidterm, setFormMidterm] = useState<string>('');
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [formWritingSkill, setFormWritingSkill] = useState<string>('Tốt');
  const [formReadingSkill, setFormReadingSkill] = useState<string>('Nắm chắc ý chính');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Open edit modal for student
  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    const g = student.literatureGrades || {};
    setFormOral(g.oral !== undefined && g.oral !== null ? String(g.oral) : '');
    setFormTest15m1(g.test15m1 !== undefined && g.test15m1 !== null ? String(g.test15m1) : '');
    setFormTest15m2(g.test15m2 !== undefined && g.test15m2 !== null ? String(g.test15m2) : '');
    setFormPeriod(g.periodTest !== undefined && g.periodTest !== null ? String(g.periodTest) : '');
    setFormMidterm(g.midterm !== undefined && g.midterm !== null ? String(g.midterm) : '');
    setFormFeedback(g.feedback || '');
    setFormWritingSkill(g.writingSkill || 'Tốt');
    setFormReadingSkill(g.readingSkill || 'Nắm chắc ý chính');
  };

  // Handle save from modal
  const handleSaveModal = () => {
    if (!editingStudent) return;
    const oralNum = formOral === '' ? null : parseFloat(formOral);
    const t1Num = formTest15m1 === '' ? null : parseFloat(formTest15m1);
    const t2Num = formTest15m2 === '' ? null : parseFloat(formTest15m2);
    const periodNum = formPeriod === '' ? null : parseFloat(formPeriod);
    const midtermNum = formMidterm === '' ? null : parseFloat(formMidterm);

    updateLiteratureGrades(editingStudent.id, {
      oral: oralNum,
      test15m1: t1Num,
      test15m2: t2Num,
      periodTest: periodNum,
      midterm: midtermNum,
      feedback: formFeedback.trim(),
      writingSkill: formWritingSkill,
      readingSkill: formReadingSkill,
    });

    setEditingStudent(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Quick inline update for table inputs
  const handleInlineChange = (studentId: string, field: keyof LiteratureGradeRecord, value: string) => {
    const num = value === '' ? null : parseFloat(value);
    if (num !== null && (isNaN(num) || num < 0 || num > 10)) return;
    updateLiteratureGrades(studentId, { [field]: num });
  };

  // AI Generator for Literature Comment
  const handleGenerateAiLiteratureFeedback = async () => {
    if (!editingStudent) return;
    setIsAiLoading(true);
    try {
      const avgScore = formPeriod || formTest15m1 || formOral || '8.5';
      const res = await fetch('/api/gemini/generate-literature-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: editingStudent.name,
          score: parseFloat(avgScore),
          testType: 'Viết đoạn văn cảm thụ & Đọc hiểu văn bản',
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
        `Em ${editingStudent.name} có khả năng cảm thụ văn học tốt, diễn đạt trong sáng và giàu cảm xúc. Cần tiếp tục chú ý trình bày vở sạch đẹp và liên kết các câu văn chặt chẽ hơn.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Stats calculation
  const totalStudents = students.length;
  const gradedStudents = students.filter((s) => s.literatureGrades?.semesterAverage);
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
    if (gradeFilter === 'average') return avg < 7.0;
    if (gradeFilter === 'needs_attention') return s.needsAttention || avg < 7.0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          Đã lưu điểm môn Ngữ Văn và đồng bộ sang sổ liên lạc phụ huynh!
        </div>
      )}

      {/* Header Info Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold uppercase tracking-wider border border-emerald-600">
                Sổ điểm điện tử môn Ngữ Văn
              </span>
              <span className="text-xs text-emerald-200">Giáo viên phụ trách: Cô Vân Anh</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Bảng điểm môn Ngữ Văn – {classInfo.name} ({classInfo.school})
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Cô Vân Anh có thể nhập điểm kiểm tra miệng, 15 phút, 1 tiết, giữa kỳ và nhận xét năng khiếu cảm thụ văn học cho 38 học sinh. Điểm số tự động tính trung bình và cập nhật ngay vào sổ liên lạc phụ huynh.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-xl shadow-xs">
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

      {/* Control Bar: Search & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
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

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
            Cần rèn luyện
          </button>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Bảng điểm chi tiết môn Ngữ Văn – Học kỳ I
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            * Nhập điểm trực tiếp vào từng ô hoặc bấm biểu tượng bút để mở nhận xét chi tiết
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-3 w-12 text-center">STT</th>
                <th className="py-3 px-3 w-16">Mã HS</th>
                <th className="py-3 px-4 min-w-[160px]">Họ và tên học sinh</th>
                <th className="py-3 px-2 text-center w-20" title="Hệ số 1">
                  Miệng <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-2 text-center w-20" title="15 phút đợt 1 - Hệ số 1">
                  15p (1) <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-2 text-center w-20" title="15 phút đợt 2 - Hệ số 1">
                  15p (2) <span className="text-[9px] text-slate-400 block font-normal">(HS1)</span>
                </th>
                <th className="py-3 px-2 text-center w-24" title="1 tiết viết đoạn văn - Hệ số 2">
                  1 Tiết <span className="text-[9px] text-slate-400 block font-normal">(HS2)</span>
                </th>
                <th className="py-3 px-2 text-center w-24" title="Thi giữa kỳ - Hệ số 2">
                  Giữa kỳ <span className="text-[9px] text-slate-400 block font-normal">(HS2)</span>
                </th>
                <th className="py-3 px-3 text-center w-20 bg-emerald-50/70 text-emerald-900 font-bold">
                  ĐTB <span className="text-[9px] text-emerald-700 block font-normal">(Tự động)</span>
                </th>
                <th className="py-3 px-4 min-w-[220px]">Lời phê & Đánh giá của Cô Vân Anh</th>
                <th className="py-3 px-3 text-right w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    Không tìm thấy học sinh nào trong danh sách.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => {
                  const g = student.literatureGrades || {};
                  const avg = g.semesterAverage;

                  const avgColor =
                    avg !== undefined && avg !== null
                      ? avg >= 8.5
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : avg >= 7.0
                        ? 'bg-blue-100 text-blue-800 font-bold'
                        : 'bg-amber-100 text-amber-800 font-bold'
                      : 'bg-slate-100 text-slate-500';

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 text-center text-slate-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-indigo-700 text-xs">
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
                      
                      {/* Oral */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={g.oral !== undefined && g.oral !== null ? g.oral : ''}
                          onChange={(e) => handleInlineChange(student.id, 'oral', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                          placeholder="-"
                        />
                      </td>

                      {/* 15m (1) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={g.test15m1 !== undefined && g.test15m1 !== null ? g.test15m1 : ''}
                          onChange={(e) => handleInlineChange(student.id, 'test15m1', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                          placeholder="-"
                        />
                      </td>

                      {/* 15m (2) */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={g.test15m2 !== undefined && g.test15m2 !== null ? g.test15m2 : ''}
                          onChange={(e) => handleInlineChange(student.id, 'test15m2', e.target.value)}
                          className="w-14 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                          placeholder="-"
                        />
                      </td>

                      {/* Period test */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={g.periodTest !== undefined && g.periodTest !== null ? g.periodTest : ''}
                          onChange={(e) => handleInlineChange(student.id, 'periodTest', e.target.value)}
                          className="w-16 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                          placeholder="-"
                        />
                      </td>

                      {/* Midterm */}
                      <td className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={g.midterm !== undefined && g.midterm !== null ? g.midterm : ''}
                          onChange={(e) => handleInlineChange(student.id, 'midterm', e.target.value)}
                          className="w-16 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:bg-white focus:border-emerald-600 focus:outline-hidden"
                          placeholder="Chưa thi"
                        />
                      </td>

                      {/* Average */}
                      <td className="py-2.5 px-2 text-center bg-emerald-50/40">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs ${avgColor}`}>
                          {avg !== undefined && avg !== null ? avg.toFixed(1) : '-'}
                        </span>
                      </td>

                      {/* Feedback summary */}
                      <td className="py-2.5 px-4 text-xs text-slate-600">
                        {g.feedback ? (
                          <span className="line-clamp-2" title={g.feedback}>
                            "{g.feedback}"
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Chưa có nhận xét riêng</span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => openEditModal(student)}
                          className="px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs flex items-center gap-1 ml-auto border border-emerald-200 transition-colors"
                          title="Sửa nhận xét & điểm chi tiết"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Chi tiết</span>
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

      {/* Modal: Edit Student Literature Grade & Comment */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${editingStudent.avatarColor} text-white flex items-center justify-center font-bold text-lg`}>
                  {editingStudent.avatarIcon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Nhập điểm & Nhận xét Ngữ Văn: {editingStudent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: {editingStudent.code} • Phụ huynh: {editingStudent.parentName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {/* Score inputs row */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Các đầu điểm môn Ngữ Văn (Thang điểm 10):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Điểm Miệng</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={formOral}
                      onChange={(e) => setFormOral(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">15 phút (1)</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={formTest15m1}
                      onChange={(e) => setFormTest15m1(e.target.value)}
                      placeholder="vd: 8.0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">15 phút (2)</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={formTest15m2}
                      onChange={(e) => setFormTest15m2(e.target.value)}
                      placeholder="vd: 9.0"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">1 Tiết (HS2)</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={formPeriod}
                      onChange={(e) => setFormPeriod(e.target.value)}
                      placeholder="vd: 8.5"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block mb-1">Giữa kỳ (HS2)</span>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="10"
                      value={formMidterm}
                      onChange={(e) => setFormMidterm(e.target.value)}
                      placeholder="Chưa thi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-center focus:bg-white focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Skills rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kỹ năng Viết đoạn / Bài văn:
                  </label>
                  <select
                    value={formWritingSkill}
                    onChange={(e) => setFormWritingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="Xuất sắc">Xuất sắc – Giàu cảm xúc, lập luận sâu</option>
                    <option value="Tốt">Tốt – Mạch lạc, từ ngữ phong phú</option>
                    <option value="Khá">Khá – Đúng bố cục, cần trau chuốt câu</option>
                    <option value="Cần rèn luyện">Cần rèn luyện – Còn lỗi chính tả/ngắt câu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kỹ năng Đọc - Hiểu văn bản:
                  </label>
                  <select
                    value={formReadingSkill}
                    onChange={(e) => setFormReadingSkill(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="Cảm thụ rất tốt">Cảm thụ rất tốt – Hiểu sâu thông điệp</option>
                    <option value="Nắm chắc ý chính">Nắm chắc ý chính – Trả lời chuẩn xác</option>
                    <option value="Cần đọc kĩ văn bản">Cần đọc kĩ văn bản – Tránh trả lời sơ sài</option>
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
                  placeholder="Nhập lời phê của cô Vân Anh về bài làm, kỹ năng hành văn, chữ viết và nỗ lực của con..."
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
            <div className="flex items-center justify-end gap-2.5 pt-5 mt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                Lưu sổ điểm
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
