import React, { useState, useEffect } from 'react';
import { WeekInfo } from '../types';
import { X, Sliders, Trash2, CheckCircle2, Star } from 'lucide-react';

interface EditWeekModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekInfo?: WeekInfo;
  canDelete: boolean;
  onUpdateWeek: (week: number, data: Partial<WeekInfo>) => void;
  onDeleteWeek: (week: number) => void;
}

export const EditWeekModal: React.FC<EditWeekModalProps> = ({
  isOpen,
  onClose,
  weekInfo,
  canDelete,
  onUpdateWeek,
  onDeleteWeek,
}) => {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [focusTheme, setFocusTheme] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  useEffect(() => {
    if (weekInfo) {
      setTitle(weekInfo.title || `Tuần ${weekInfo.week}`);
      setStartDate(weekInfo.startDate || '');
      setEndDate(weekInfo.endDate || '');
      setFocusTheme(weekInfo.focusTheme || '');
      setIsCurrent(!!weekInfo.isCurrent);
    }
  }, [weekInfo]);

  if (!isOpen || !weekInfo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateWeek(weekInfo.week, {
      title: title.trim() || `Tuần ${weekInfo.week}`,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      focusTheme: focusTheme.trim() || undefined,
      isCurrent,
    });
    onClose();
  };

  const handleDelete = () => {
    if (!canDelete) {
      alert('Không thể xóa khi lớp chỉ còn một tuần duy nhất.');
      return;
    }
    if (
      window.confirm(
        `Cô có chắc chắn muốn xóa Tuần ${weekInfo.week} (${weekInfo.title})? Dữ liệu đánh giá của tuần này sẽ bị gỡ bỏ.`
      )
    ) {
      onDeleteWeek(weekInfo.week);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Điều chỉnh thông tin: Tuần {weekInfo.week}</h3>
              <p className="text-xs text-slate-300">Chỉnh sửa tiêu đề, thời gian, chủ đề trọng tâm</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề hiển thị tuần:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="vd: Tuần 4 (08/09 - 14/09)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày bắt đầu:
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="vd: 08/09/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày kết thúc:
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="vd: 14/09/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Chủ đề trọng tâm bài học Ngữ Văn:
            </label>
            <input
              type="text"
              value={focusTheme}
              onChange={(e) => setFocusTheme(e.target.value)}
              placeholder="vd: Gặp lá cơm nếp (Thanh Thảo) & Viết đoạn văn"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span className="text-xs text-amber-950 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                Đặt làm Tuần hiện tại (Phụ huynh mở ứng dụng sẽ thấy tuần này đầu tiên)
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleDelete}
              disabled={!canDelete}
              className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Xóa tuần này
            </button>

            <div className="flex items-center gap-2">
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
                <CheckCircle2 className="w-4 h-4" /> Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
