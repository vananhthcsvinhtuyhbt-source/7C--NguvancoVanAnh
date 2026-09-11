import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { LiteratureLessonContent } from '../types';
import {
  BookOpen,
  Plus,
  Sparkles,
  Edit3,
  Trash2,
  Calendar,
  CheckCircle2,
  BookmarkCheck,
  FileText,
  Save,
  X,
  Share2,
} from 'lucide-react';

export const LiteratureLessonManager: React.FC = () => {
  const { lessonContents, addLessonContent, updateLessonContent, deleteLessonContent, selectedWeek } = useClass();

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LiteratureLessonContent | null>(null);

  // Form states
  const [formWeek, setFormWeek] = useState<number>(selectedWeek);
  const [formTitle, setFormTitle] = useState('');
  const [formTopic, setFormTopic] = useState('');
  const [formKeyKnowledge, setFormKeyKnowledge] = useState('');
  const [formHomework, setFormHomework] = useState('');
  const [formSampleExcerpt, setFormSampleExcerpt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Open modal for new item
  const handleOpenNew = () => {
    setEditingItem(null);
    setFormWeek(selectedWeek);
    setFormTitle('');
    setFormTopic('Bài 2: Khúc nhạc tâm hồn');
    setFormKeyKnowledge('');
    setFormHomework('');
    setFormSampleExcerpt('');
    setShowModal(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item: LiteratureLessonContent) => {
    setEditingItem(item);
    setFormWeek(item.week);
    setFormTitle(item.title);
    setFormTopic(item.topic);
    setFormKeyKnowledge(item.keyKnowledge);
    setFormHomework(item.homework);
    setFormSampleExcerpt(item.sampleExcerpt || '');
    setShowModal(true);
  };

  // AI Assistant for Drafting Lesson Content
  const handleAiDraftContent = async () => {
    if (!formTitle.trim()) {
      alert('Vui lòng nhập tên Văn bản / Bài thơ (vd: Gặp lá cơm nếp) để AI hỗ trợ soạn nội dung nhé cô Vân Anh!');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/generate-lesson-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          week: formWeek,
          title: formTitle.trim(),
          topic: formTopic.trim(),
        }),
      });
      const data = await res.json();
      if (data.keyKnowledge) setFormKeyKnowledge(data.keyKnowledge);
      if (data.homework) setFormHomework(data.homework);
      if (data.sampleExcerpt) setFormSampleExcerpt(data.sampleExcerpt);
    } catch (err) {
      console.error('AI Lesson content error:', err);
      setFormKeyKnowledge(
        'Nắm chắc giá trị nội dung và nghệ thuật của tác phẩm. Thực hành tiếng Việt: Nhận diện và tác dụng của biện pháp tu từ được sử dụng.'
      );
      setFormHomework(
        '1. Đọc lại văn bản và ghi nhớ các dẫn chứng chính.\n2. Viết đoạn văn cảm nhận 7-10 câu.\n3. Soạn bài tiếp theo theo câu hỏi hướng dẫn.'
      );
      setFormSampleExcerpt(
        'Tác phẩm đã khơi gợi trong tâm hồn người đọc tình yêu thương tha thiết đối với quê hương đất nước qua những hình ảnh bình dị, thân thương...'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Handle Save
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTopic.trim()) return;

    if (editingItem) {
      updateLessonContent(editingItem.id, {
        week: formWeek,
        title: formTitle.trim(),
        topic: formTopic.trim(),
        keyKnowledge: formKeyKnowledge.trim(),
        homework: formHomework.trim(),
        sampleExcerpt: formSampleExcerpt.trim() || undefined,
      });
    } else {
      addLessonContent({
        week: formWeek,
        title: formTitle.trim(),
        topic: formTopic.trim(),
        keyKnowledge: formKeyKnowledge.trim(),
        homework: formHomework.trim(),
        sampleExcerpt: formSampleExcerpt.trim() || undefined,
        updatedDate: new Date().toLocaleDateString('vi-VN'),
        author: 'Cô Vân Anh - Giáo viên môn Ngữ Văn',
      });
    }

    setShowModal(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  // Sort lessons by week desc
  const sortedLessons = [...lessonContents].sort((a, b) => b.week - a.week);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5" />
          Đã lưu và đồng bộ nội dung bài học môn Ngữ Văn sang sổ liên lạc phụ huynh!
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-700 text-indigo-100 text-xs font-bold uppercase tracking-wider border border-indigo-500">
                Nội dung học tập & Dặn dò
              </span>
              <span className="text-xs text-indigo-200">Cô Vân Anh - Giáo viên môn Ngữ Văn</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Kế hoạch bài giảng & Dặn dò môn Ngữ Văn 7
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl leading-relaxed">
              Quản trị nội dung văn bản, trọng tâm kiến thức Tiếng Việt, dặn dò bài tập về nhà và đoạn văn tham khảo để phụ huynh nắm bắt và đồng hành cùng con hàng tuần.
            </p>
          </div>

          <button
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn bài học tuần mới</span>
          </button>
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4">
        {sortedLessons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            Chưa có nội dung bài học nào. Cô Vân Anh hãy bấm nút "Soạn bài học tuần mới" để bắt đầu!
          </div>
        ) : (
          sortedLessons.map((lesson) => {
            const isCurrentWeek = lesson.week === selectedWeek;
            return (
              <div
                key={lesson.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isCurrentWeek
                    ? 'border-indigo-500 ring-2 ring-indigo-100 shadow-md'
                    : 'border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                        isCurrentWeek
                          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      T.{lesson.week}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                          {lesson.topic}
                        </span>
                        {isCurrentWeek && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            ⭐ Tuần hiện tại
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                        {lesson.title}
                      </h3>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className="text-xs text-slate-400 mr-2 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {lesson.updatedDate}
                    </span>
                    <button
                      onClick={() => handleOpenEdit(lesson)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Chỉnh sửa bài học"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Cô có chắc chắn muốn xóa bài học "${lesson.title}" không?`)) {
                          deleteLessonContent(lesson.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                      title="Xóa bài học"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs sm:text-sm">
                  {/* Left: Key knowledge */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70">
                    <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Trọng tâm kiến thức & Thực hành Tiếng Việt</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                      {lesson.keyKnowledge || 'Đang cập nhật...'}
                    </p>
                  </div>

                  {/* Right: Homework & Parent guidance */}
                  <div className="bg-amber-50/70 rounded-2xl p-4 border border-amber-200/70">
                    <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
                      <BookmarkCheck className="w-4 h-4 text-amber-600" />
                      <span>Nhiệm vụ bài tập & Dặn dò cha mẹ</span>
                    </div>
                    <p className="text-amber-950 leading-relaxed whitespace-pre-line">
                      {lesson.homework || 'Hoàn thành bài tập trong SGK và đọc lại bài.'}
                    </p>
                  </div>
                </div>

                {/* Sample literature excerpt if present */}
                {lesson.sampleExcerpt && (
                  <div className="mt-4 bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200/70">
                    <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1.5 text-xs sm:text-sm">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Đoạn văn mẫu & Dẫn chứng tham khảo Cô gửi tặng:</span>
                    </div>
                    <p className="text-xs sm:text-sm italic text-emerald-900/90 leading-relaxed font-serif">
                      "{lesson.sampleExcerpt}"
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add/Edit Lesson Content */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingItem ? 'Chỉnh sửa bài học Ngữ Văn' : 'Soạn nội dung bài học Ngữ Văn mới'}
                  </h3>
                  <p className="text-xs text-slate-500">Giáo viên: Cô Vân Anh</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tuần học:
                  </label>
                  <select
                    value={formWeek}
                    onChange={(e) => setFormWeek(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-indigo-600"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((w) => (
                      <option key={w} value={w}>
                        Tuần {w} {w === 4 ? '(Hiện tại)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chủ đề bài học (SGK Ngữ Văn 7):
                  </label>
                  <input
                    type="text"
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="vd: Bài 2: Khúc nhạc tâm hồn"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Văn bản / Tác phẩm học trong tuần:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="vd: Văn bản thơ: Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn biểu cảm"
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-indigo-600"
                  />
                  <button
                    type="button"
                    onClick={handleAiDraftContent}
                    disabled={isAiLoading}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs hover:opacity-90 disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {isAiLoading ? 'AI đang soạn...' : '✨ AI soạn tự động'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  * Nhập tên tác phẩm rồi bấm <strong>"AI soạn tự động"</strong> để Gemini điền sẵn kiến thức và dặn dò cho cô.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Trọng tâm kiến thức & Thực hành Tiếng Việt:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formKeyKnowledge}
                  onChange={(e) => setFormKeyKnowledge(e.target.value)}
                  placeholder="Đặc điểm thể thơ, biện pháp tu từ, thông điệp bài học..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nhiệm vụ bài tập về nhà & Dặn dò phụ huynh nhắc con:
                </label>
                <textarea
                  rows={3}
                  required
                  value={formHomework}
                  onChange={(e) => setFormHomework(e.target.value)}
                  placeholder="1. Viết đoạn văn 7-10 câu...&#10;2. Học thuộc lòng bài thơ...&#10;3. Soạn bài tiếp theo..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đoạn văn mẫu / Đoạn bình giảng tham khảo (tùy chọn):
                </label>
                <textarea
                  rows={2}
                  value={formSampleExcerpt}
                  onChange={(e) => setFormSampleExcerpt(e.target.value)}
                  placeholder="Đoạn văn mẫu để học sinh đọc thêm và phụ huynh hướng dẫn con tại nhà..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-600"
                />
              </div>

              {/* Modal actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  Lưu & Gửi thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
