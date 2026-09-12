import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import {
  GraduationCap,
  MessageSquareQuote,
  Bell,
  MessageSquare,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  User,
  Lock,
} from 'lucide-react';

type TabType = 'grades' | 'comments' | 'announcements' | 'messages';

export const ParentView: React.FC = () => {
  const {
    currentStudent,
    weeks,
    selectedWeek,
    setSelectedWeek,
    announcements,
    addParentMessage,
    classInfo,
    gradeColumnNames,
  } = useClass();

  // 4 mục đơn giản theo đúng yêu cầu: Điểm, Nhận xét, Dặn dò & Thông báo, Hộp thư Ph & HS
  const [activeTab, setActiveTab] = useState<TabType>('grades');
  const [messageSender, setMessageSender] = useState<string>('Phụ huynh');
  const [parentNote, setParentNote] = useState('');
  const [noteSentSuccess, setNoteSentSuccess] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'important' | 'reminder' | 'achievement'>('all');

  if (!currentStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center text-slate-500">
        Đang tải dữ liệu học sinh...
      </div>
    );
  }

  const currentEval = currentStudent.weeklyEvaluations?.[selectedWeek] || currentStudent.weeklyEvaluations?.[weeks[0]?.week || 1];
  const litGrades = currentStudent.literatureGrades || {};

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentNote.trim()) return;

    const senderText = messageSender === 'Học sinh' 
      ? `Học sinh ${currentStudent.name}` 
      : `Phụ huynh của em ${currentStudent.name}`;

    addParentMessage(currentStudent.id, parentNote.trim(), senderText);
    setParentNote('');
    setNoteSentSuccess(true);
    setTimeout(() => setNoteSentSuccess(false), 3500);
  };

  const filteredAnnouncements = announcements.filter((a) => {
    if (activeCategoryFilter === 'all') return true;
    return a.category === activeCategoryFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-sans text-slate-800">
      
      {/* Student Welcome Header Card */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl ${currentStudent.avatarColor || 'bg-rose-500'} text-white flex items-center justify-center text-3xl font-bold shadow-md shadow-rose-100 shrink-0 border-2 border-white`}>
                {currentStudent.avatarIcon || '🌸'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 font-mono">
                    {currentStudent.code}
                  </span>
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                    Lớp 7C - NGỮ VĂN
                  </span>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Giáo viên phụ trách: <strong>{classInfo.homeroomTeacher || 'Cô Vân Anh'}</strong>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
                  {currentStudent.name}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Phụ huynh: <strong>{currentStudent.parentName || 'Gia đình'}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:self-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5">
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Năm học
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {classInfo.academicYear || '2026 - 2027'}
                </span>
              </div>
            </div>

          </div>

          {/* 4 Navigation Tabs: Điểm, Nhận xét, Dặn dò & Thông báo, Hộp thư Ph & HS */}
          <div className="flex items-center gap-1 sm:gap-2 mt-5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
            {[
              { id: 'grades', label: '1. Điểm', icon: GraduationCap },
              { id: 'comments', label: '2. Nhận xét', icon: MessageSquareQuote },
              { id: 'announcements', label: '3. Dặn dò & Thông báo', icon: Bell, badge: announcements.length > 0 ? announcements.length : undefined },
              { id: 'messages', label: '4. Hộp thư Ph & HS', icon: MessageSquare, badge: currentStudent.parentMessages.length > 0 ? currentStudent.parentMessages.length : undefined },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`parent-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? tab.id === 'grades' 
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : tab.id === 'comments'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : tab.id === 'announcements'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500 text-white">
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
        {/* 1. MỤC: ĐIỂM (BẢNG ĐIỂM NGỮ VĂN CỦA HỌC SINH)            */}
        {/* ======================================================== */}
        {activeTab === 'grades' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {(() => {
              const hasAnyScore =
                (litGrades.oral !== null && litGrades.oral !== undefined) ||
                (litGrades.test15m1 !== null && litGrades.test15m1 !== undefined) ||
                (litGrades.test15m2 !== null && litGrades.test15m2 !== undefined) ||
                (litGrades.periodTest !== null && litGrades.periodTest !== undefined) ||
                (litGrades.midterm !== null && litGrades.midterm !== undefined) ||
                (litGrades.finalExam !== null && litGrades.finalExam !== undefined) ||
                (litGrades.semesterAverage !== null && litGrades.semesterAverage !== undefined);

              const isApproved =
                litGrades.isApproved === true || (litGrades.isApproved !== false && hasAnyScore);

              return (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
                  {/* Header Card Môn Ngữ Văn */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                          isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Môn Ngữ Văn 7 • Học kì I
                        </span>
                        <span className="text-xs text-slate-500 font-medium">Chương trình GDPT 2018</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                        Bảng điểm môn Ngữ Văn của con
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                        Học sinh: <strong>{currentStudent.name}</strong> ({currentStudent.code}) • Giáo viên phụ trách: <strong>{classInfo.homeroomTeacher || 'Cô Vân Anh'}</strong>
                      </p>
                    </div>

                    {isApproved ? (
                      <div className="flex items-center gap-2.5 self-start sm:self-auto bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200/80">
                        <div>
                          <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                            Điểm trung bình môn
                          </p>
                          <p className="text-2xl font-black text-emerald-900 leading-none mt-0.5">
                            {litGrades.semesterAverage !== null && litGrades.semesterAverage !== undefined
                              ? Number(litGrades.semesterAverage).toFixed(1)
                              : litGrades.averageScore !== null && litGrades.averageScore !== undefined
                              ? Number(litGrades.averageScore).toFixed(1)
                              : '--'}
                            <span className="text-xs font-normal text-emerald-700 ml-1">/ 10</span>
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 self-start sm:self-auto bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
                        <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                          <Lock className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-amber-900">
                            Chưa duyệt bảng điểm
                          </p>
                          <p className="text-[11px] text-amber-700">
                            Đang chờ Cô giáo phê duyệt
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {!isApproved ? (
                    /* Trạng thái chưa duyệt: Tên điểm để trống, chờ Cô giáo duyệt mới hiện cho PH thấy */
                    <div className="py-10 px-4 text-center max-w-xl mx-auto">
                      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-2xs">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
                        <Lock className="w-3.5 h-3.5" /> Bảng điểm đang trong quá trình chấm & cập nhật
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        🌸 Con đang chăm ngoan học tập và tiến bộ từng ngày
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        Bố mẹ yên tâm nhé, con đang học tập rất tích cực trên lớp. Cô Vân Anh đang hoàn thiện việc chấm bài và sẽ gửi bảng điểm cùng lời nhận xét chi tiết tới gia đình trong thời gian sớm nhất!
                      </p>

                      <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                            ✓
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-bold text-slate-800">Quy định công bố:</span>{' '}
                            Bảng điểm và nhận xét môn học sẽ tự động hiển thị ngay cho Phụ huynh và Học sinh sau khi Cô giáo bấm duyệt chính thức trên hệ thống sổ liên lạc.
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Trạng thái ĐÃ DUYỆT: Hiển thị đầy đủ bảng điểm cho Phụ huynh */
                    <>
                      {/* Trạng thái duyệt xác nhận */}
                      <div className="mt-4 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Cô Vân Anh đã duyệt và công bố bảng điểm chính thức</span>
                        </div>
                        <span className="text-[11px] text-emerald-700 font-medium">Học kì I • Năm học 2026 - 2027</span>
                      </div>

                      {/* 3 Năng lực môn Ngữ Văn theo GDPT 2018 */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            📖 Năng lực Đọc hiểu
                          </span>
                          <p className="text-sm font-bold text-slate-900 mt-1">
                            {litGrades.readingSkill || litGrades.readingCompetency || (
                              <span className="text-slate-400 font-normal">Chưa đánh giá</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Nắm bắt thông điệp & biện pháp tu từ</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            ✍️ Năng lực Viết văn
                          </span>
                          <p className="text-sm font-bold text-slate-900 mt-1">
                            {litGrades.writingSkill || litGrades.writingCompetency || (
                              <span className="text-slate-400 font-normal">Chưa đánh giá</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Nghị luận & biểu cảm có lập luận tốt</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                            🗣️ Năng lực Nói & Nghe
                          </span>
                          <p className="text-sm font-bold text-slate-900 mt-1">
                            {litGrades.speakingListeningCompetency || (
                              <span className="text-slate-400 font-normal">Chưa đánh giá</span>
                            )}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">Thuyết trình chủ đề nhóm rõ ràng</p>
                        </div>
                      </div>

                      {/* Bảng điểm chi tiết với tên điểm tùy chỉnh hoặc để trống */}
                      <div className="mt-6 pt-5 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                          <BookOpen className="w-4 h-4 text-emerald-600" />
                          Bảng điểm các bài kiểm tra chi tiết
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                          {/* Cột 1 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.oral || 'Để trống'}>
                              {gradeColumnNames.oral?.trim() ? gradeColumnNames.oral : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.oral !== undefined && litGrades.oral !== null
                                  ? 'text-slate-800 bg-white border-slate-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.oral !== undefined && litGrades.oral !== null ? litGrades.oral : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 1</span>
                          </div>

                          {/* Cột 2 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.test15m1 || 'Để trống'}>
                              {gradeColumnNames.test15m1?.trim() ? gradeColumnNames.test15m1 : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.test15m1 !== undefined && litGrades.test15m1 !== null
                                  ? 'text-slate-800 bg-white border-slate-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.test15m1 !== undefined && litGrades.test15m1 !== null ? litGrades.test15m1 : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 1</span>
                          </div>

                          {/* Cột 3 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.test15m2 || 'Để trống'}>
                              {gradeColumnNames.test15m2?.trim() ? gradeColumnNames.test15m2 : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.test15m2 !== undefined && litGrades.test15m2 !== null
                                  ? 'text-slate-800 bg-white border-slate-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.test15m2 !== undefined && litGrades.test15m2 !== null ? litGrades.test15m2 : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 1</span>
                          </div>

                          {/* Cột 4 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.periodTest || 'Để trống'}>
                              {gradeColumnNames.periodTest?.trim() ? gradeColumnNames.periodTest : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.periodTest !== undefined && litGrades.periodTest !== null
                                  ? 'text-slate-800 bg-white border-slate-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.periodTest !== undefined && litGrades.periodTest !== null ? litGrades.periodTest : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 2</span>
                          </div>

                          {/* Cột 5 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.midterm || 'Để trống'}>
                              {gradeColumnNames.midterm?.trim() ? gradeColumnNames.midterm : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.midterm !== undefined && litGrades.midterm !== null
                                  ? 'text-indigo-700 bg-white border-indigo-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.midterm !== undefined && litGrades.midterm !== null ? litGrades.midterm : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 2</span>
                          </div>

                          {/* Cột 6 */}
                          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center col-span-2 sm:col-span-1">
                            <span className="text-[11px] font-bold text-slate-600 block truncate" title={gradeColumnNames.finalExam || 'Để trống'}>
                              {gradeColumnNames.finalExam?.trim() ? gradeColumnNames.finalExam : <span className="italic text-slate-400 font-normal">[Để trống]</span>}
                            </span>
                            <div className="flex items-center justify-center gap-1.5 mt-1">
                              <span className={`text-base font-extrabold px-2 py-0.5 rounded-lg border ${
                                litGrades.finalExam !== undefined && litGrades.finalExam !== null
                                  ? 'text-emerald-700 bg-white border-emerald-200'
                                  : 'text-slate-400 bg-transparent border-transparent'
                              }`}>
                                {litGrades.finalExam !== undefined && litGrades.finalExam !== null ? litGrades.finalExam : '--'}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">Hệ số 3</span>
                          </div>
                        </div>
                      </div>

                      {/* Lời nhận xét chuyên môn về điểm số */}
                      <div className="mt-5 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1.5 text-emerald-900 font-bold text-xs sm:text-sm">
                          <span>🖋️</span> Lời nhận xét chuyên môn của Cô Vân Anh:
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-3 border-l-2 border-emerald-600">
                          {litGrades.feedback || litGrades.teacherRemarks ? (
                            `"${litGrades.feedback || litGrades.teacherRemarks}"`
                          ) : (
                            <span className="text-slate-400 not-italic">
                              Cô Vân Anh đang trong quá trình theo dõi và sẽ cập nhật nhận xét điểm số cho con.
                            </span>
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. MỤC: NHẬN XÉT (LỜI NHẬN XÉT CỦA CÔ GIÁO THEO TUẦN)    */}
        {/* ======================================================== */}
        {activeTab === 'comments' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Week Selector Bar */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs sm:text-sm font-bold text-slate-700">
                    Chọn tuần học cần xem nhận xét:
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Đang xem: <strong>Tuần {selectedWeek}</strong>
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pt-3">
                {weeks.map((wInfo) => {
                  const isSelected = selectedWeek === wInfo.week;
                  return (
                    <button
                      key={wInfo.week}
                      id={`parent-week-${wInfo.week}`}
                      onClick={() => setSelectedWeek(wInfo.week)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {wInfo.title || `Tuần ${wInfo.week}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Teacher Feedback Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Sổ liên lạc điện tử • Tuần {selectedWeek}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Nhận xét của Cô Vân Anh dành cho em {currentStudent.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {currentEval?.isApproved ? (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt sổ tuần
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Đang cập nhật
                    </span>
                  )}
                </div>
              </div>

              {/* Lời nhận xét chung */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2 text-indigo-900 font-bold text-sm">
                  <span>🌸</span> Lời nhận xét của Cô Vân Anh:
                </div>
                {(currentEval?.teacherComment || (currentEval as any)?.teacherFeedback) ? (
                  <p className="text-sm sm:text-base text-slate-800 italic leading-relaxed pl-3 border-l-2 border-indigo-600 whitespace-pre-line">
                    "{currentEval?.teacherComment || (currentEval as any)?.teacherFeedback}"
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-indigo-900/80 italic pl-3 border-l-2 border-indigo-400 leading-relaxed">
                    🌱 Con đang chăm ngoan học tập và rèn luyện rất tốt trên lớp. Cô Vân Anh đang hoàn thiện lời nhận xét tuần và sẽ gửi đến bố mẹ sớm nhất nhé!
                  </p>
                )}
              </div>

              {/* Chi tiết điểm mạnh và lời khuyên phụ huynh */}
              {(currentEval?.strengths || currentEval?.parentTip || currentEval?.familyCoordination) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentEval?.strengths && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                        🌟 Khen ngợi & Điểm mạnh của con
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {currentEval.strengths}
                      </p>
                    </div>
                  )}
                  {currentEval?.parentTip && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                        💡 Gợi ý phối hợp cùng gia đình
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {currentEval.parentTip}
                      </p>
                    </div>
                  )}
                  {currentEval?.familyCoordination && !currentEval?.parentTip && (
                    <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                      <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-1">
                        🤝 Phối hợp gia đình
                      </span>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {currentEval.familyCoordination}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3 Tiêu chí đánh giá */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    📚 Học tập & Chuẩn bị bài
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentEval?.academic || <span className="text-slate-400 font-normal">Chưa có đánh giá</span>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    ⭐ Nề nếp & Tác phong
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentEval?.discipline || <span className="text-slate-400 font-normal">Chưa có đánh giá</span>}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-500 block mb-1">
                    💡 Điểm cần phát huy / Lưu ý
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {currentEval?.improvements || <span className="text-slate-400 font-normal">Chưa có ghi chú</span>}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 3. MỤC: DẶN DÒ & THÔNG BÁO (BẢNG TIN CỦA CÔ VÂN ANH)     */}
        {/* ======================================================== */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Bảng tin lớp 7C
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                    Dặn dò & Thông báo từ Cô Vân Anh
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
                    Tất cả
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('important')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryFilter === 'important'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    Quan trọng
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('reminder')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryFilter === 'reminder'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    Nhắc nhở
                  </button>
                  <button
                    onClick={() => setActiveCategoryFilter('achievement')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCategoryFilter === 'achievement'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    Thành tích
                  </button>
                </div>
              </div>

              {filteredAnnouncements.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                    📢
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    Hiện chưa có dặn dò hoặc thông báo nào
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                    Mục này đang để trống để cô giáo tự đăng tải thông báo, lịch thi và dặn dò bài tập cho cả lớp.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  {filteredAnnouncements.map((ann) => (
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
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            ann.category === 'important'
                              ? 'bg-rose-100 text-rose-800'
                              : ann.category === 'reminder'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {ann.pinned ? '📌 ' : ''}
                          {ann.category === 'important'
                            ? 'Quan trọng'
                            : ann.category === 'reminder'
                            ? 'Nhắc nhở'
                            : 'Thành tích'}
                        </span>
                        <span className="text-xs text-slate-400">{ann.date}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base mb-1.5">
                        {ann.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                        {ann.content}
                      </p>

                      <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                        <span>
                          Người gửi: <strong>{ann.author}</strong>
                        </span>
                        <span className="text-[11px] text-amber-700 font-semibold">
                          Lớp 7C
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* 4. MỤC: HỘP THƯ PH & HS (TRAO ĐỔI 2 CHIỀU VỚI CÔ VÂN ANH) */}
        {/* ======================================================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Form gửi tin nhắn mới */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    Hộp thư trao đổi với Cô Vân Anh
                  </h2>
                  <p className="text-xs text-slate-500">
                    Gửi phản hồi, lời nhắn hoặc câu hỏi trực tiếp đến cô giáo phụ trách
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="text-xs font-bold text-slate-700">Người gửi lời nhắn:</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMessageSender('Phụ huynh')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        messageSender === 'Phụ huynh'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" /> Phụ huynh em {currentStudent.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageSender('Học sinh')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        messageSender === 'Học sinh'
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      🌸 Học sinh {currentStudent.name}
                    </button>
                  </div>
                </div>

                <div>
                  <textarea
                    rows={4}
                    value={parentNote}
                    onChange={(e) => setParentNote(e.target.value)}
                    placeholder={`Kính gửi Cô Vân Anh, gia đình/em muốn trao đổi về bài học hoặc tình hình học tập...`}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <p className="text-[11px] text-slate-400">
                    Tin nhắn sẽ được gửi bảo mật tới Cô Vân Anh. Cô sẽ phản hồi sớm nhất.
                  </p>
                  <button
                    type="submit"
                    disabled={!parentNote.trim()}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Send className="w-4 h-4" /> Gửi tin nhắn cho Cô
                  </button>
                </div>

                {noteSentSuccess && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đã gửi tin nhắn thành công đến Cô Vân Anh!
                  </div>
                )}
              </form>
            </div>

            {/* Danh sách tin nhắn đã gửi & Phản hồi của cô */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-600" />
                  Lịch sử trao đổi trong sổ liên lạc
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                  {currentStudent.parentMessages.length} tin nhắn
                </span>
              </div>

              {currentStudent.parentMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3 text-xl shadow-xs">
                    💬
                  </div>
                  <p className="font-semibold text-slate-600">Hộp thư hiện đang trống</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Chưa có tin nhắn nào. Phụ huynh hoặc học sinh có thể gửi lời nhắn hoặc câu hỏi cho Cô Vân Anh ở khung phía trên.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 mt-5">
                  {currentStudent.parentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">
                          {msg.sender || `Phụ huynh của em ${currentStudent.name}`}
                        </span>
                        <span className="text-slate-400">{msg.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 bg-white p-3.5 rounded-xl border border-slate-100 leading-relaxed">
                        "{msg.content}"
                      </p>

                      {msg.reply ? (
                        <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 text-xs sm:text-sm text-purple-950">
                          <span className="font-bold block mb-1 text-purple-900 flex items-center gap-1.5">
                            <span>🌸</span> Cô Vân Anh phản hồi:
                          </span>
                          <p className="italic leading-relaxed">"{msg.reply}"</p>
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block font-medium">
                          ⏳ Đang chờ cô giáo phản hồi...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </main>

    </div>
  );
};
