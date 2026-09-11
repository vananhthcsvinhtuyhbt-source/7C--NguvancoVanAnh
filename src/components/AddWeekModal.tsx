import React, { useState } from 'react';
import { WeekInfo } from '../types';
import { X, CalendarPlus, CheckCircle2, Sparkles } from 'lucide-react';

interface AddWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: WeekInfo[];
  onAddWeek: (params: {
    week: number;
    title: string;
    startDate?: string;
    endDate?: string;
    focusTheme?: string;
    copyFromPrevious?: boolean;
    setAsCurrent?: boolean;
  }) => void;
}

export const AddWeekModal: React.FC<AddWeekModalProps> = ({
  isOpen,
  onClose,
  weeks,
  onAddWeek,
}) => {
  const nextNum = weeks.length > 0 ? Math.max(...weeks.map((w) => w.week)) + 1 : 1;
  const [weekNum, setWeekNum] = useState<number>(nextNum);
  const [title, setTitle] = useState<string>(`Tuần ${nextNum}`);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [focusTheme, setFocusTheme] = useState<string>('Thực hành Tiếng Việt & Đọc hiểu văn bản');
  const [copyFromPrevious, setCopyFromPrevious] = useState<boolean>(true);
  const [setAsCurrent, setSetAsCurrent] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weekNum || weekNum < 1) return;

    onAddWeek({
      week: weekNum,
      title: title.trim() || `Tuần ${weekNum}`,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      focusTheme: focusTheme.trim() || undefined,
      copyFromPrevious,
      setAsCurrent,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <CalendarPlus className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Thêm tuần đánh giá mới</h3>
              <p className="text-xs text-indigo-100">Dành cho Cô Vân Anh quản lý theo dõi học tập lớp 7C</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số thứ tự tuần <span className="text-rose-500">*</span>:
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={weekNum}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeekNum(val);
                  if (!title || title.startsWith('Tuần ')) {
                    setTitle(`Tuần ${val}`);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên hiển thị tuần:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="vd: Tuần 5 (15/09 - 21/09)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày bắt đầu (tùy chọn):
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="vd: 15/09/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày kết thúc (tùy chọn):
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="vd: 21/09/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trọng tâm / Chủ đề môn Ngữ Văn tuần này:
            </label>
            <input
              type="text"
              value={focusTheme}
              onChange={(e) => setFocusTheme(e.target.value)}
              placeholder="vd: Thực hành Tiếng Việt & Đọc hiểu văn bản"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={copyFromPrevious}
                onChange={(e) => setCopyFromPrevious(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs text-indigo-950 font-medium">
                Tự động kế thừa dữ liệu mẫu từ tuần gần nhất để Cô chỉnh sửa nhanh
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={setAsCurrent}
                onChange={(e) => setSetAsCurrent(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="text-xs text-indigo-950 font-medium">
                Đặt làm <strong>Tuần hiện tại</strong> cho phụ huynh và học sinh theo dõi
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Tạo tuần mới ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
