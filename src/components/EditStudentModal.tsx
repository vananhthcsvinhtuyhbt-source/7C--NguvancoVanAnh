import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X, UserCog, CheckCircle2, AlertTriangle } from 'lucide-react';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onUpdateStudent: (studentId: string, data: Partial<Student>) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onUpdateStudent,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Nam' | 'Nữ'>('Nữ');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [personalGoal, setPersonalGoal] = useState('');
  const [needsAttention, setNeedsAttention] = useState(false);
  const [attentionReason, setAttentionReason] = useState('');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setCode(student.code || '');
      setDob(student.dob || '');
      setGender(student.gender || 'Nữ');
      setParentName(student.parentName || '');
      setParentPhone(student.parentPhone || '');
      setPersonalGoal(student.personalGoal || '');
      setNeedsAttention(!!student.needsAttention);
      setAttentionReason(student.attentionReason || '');
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStudent(student.id, {
      name: name.trim() || student.name,
      code: code.trim() || student.code,
      dob: dob.trim() || student.dob,
      gender,
      parentName: parentName.trim() || student.parentName,
      parentPhone: parentPhone.trim() || student.parentPhone,
      personalGoal: personalGoal.trim() || student.personalGoal,
      needsAttention,
      attentionReason: needsAttention ? attentionReason.trim() : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <UserCog className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Chỉnh sửa thông tin học sinh</h3>
              <p className="text-xs text-purple-100">
                Mã {student.code} • {student.name}
              </p>
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
                Mã HS:
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-center focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên học sinh:
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày sinh:
              </label>
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="vd: 12/03/2011"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giới tính:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Nam' | 'Nữ')}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600 font-semibold"
              >
                <option value="Nữ">Nữ</option>
                <option value="Nam">Nam</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ tên Phụ huynh:
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="vd: Mẹ Nguyễn Thị Mai"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ:
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="vd: 0912.345.678"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mục tiêu học tập cá nhân của con:
            </label>
            <input
              type="text"
              value={personalGoal}
              onChange={(e) => setPersonalGoal(e.target.value)}
              placeholder="vd: Đạt điểm 8+ Ngữ Văn và viết đoạn văn mạch lạc hơn"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          {/* Special Attention */}
          <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={needsAttention}
                onChange={(e) => setNeedsAttention(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4"
              />
              <span className="text-xs text-rose-950 font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Học sinh cần Cô và gia đình quan tâm đặc biệt
              </span>
            </label>

            {needsAttention && (
              <div>
                <label className="block text-[11px] font-semibold text-rose-800 mb-1">
                  Lý do cần quan tâm:
                </label>
                <input
                  type="text"
                  value={attentionReason}
                  onChange={(e) => setAttentionReason(e.target.value)}
                  placeholder="vd: Còn rụt rè khi phát biểu, cần rèn thêm kỹ năng viết đoạn văn"
                  className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Cập nhật hồ sơ học sinh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
