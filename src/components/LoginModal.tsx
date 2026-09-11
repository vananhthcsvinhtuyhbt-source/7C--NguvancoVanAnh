import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import { QrCode, X, Search, CheckCircle2, KeyRound, User } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { students, setCurrentStudentId, currentStudentId, setRole } = useClass();
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleLoginByCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanCode = inputCode.trim().toUpperCase();
    const found = students.find((s) => s.code.toUpperCase() === cleanCode || s.id.toUpperCase() === cleanCode);

    if (found) {
      setCurrentStudentId(found.id);
      setRole('parent');
      onClose();
    } else {
      setError(`Không tìm thấy mã học sinh "${inputCode}". Vui lòng thử từ 7C01 đến 7C38.`);
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setCurrentStudentId(studentId);
    setRole('parent');
    onClose();
  };

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-3">
            <QrCode className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">Đăng nhập Phụ huynh 7C</h3>
          <p className="text-xs text-indigo-100 mt-1">
            Mỗi học sinh có mã riêng để đảm bảo tính riêng tư thông tin con em.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Form input student code */}
          <form onSubmit={handleLoginByCode} className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Nhập mã học sinh hoặc quét mã QR
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ví dụ: 7C09, 7C01, 7C17..."
                  value={inputCode}
                  onChange={(e) => {
                    setInputCode(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white transition-all font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shrink-0 shadow-xs"
              >
                Vào sổ
              </button>
            </div>
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </form>

          {/* Quick 1-click roster selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Hoặc chọn nhanh học sinh lớp 7C
              </span>
              <span className="text-[11px] text-slate-400">{filtered.length}/38 em</span>
            </div>

            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
              />
            </div>

            <div className="max-h-52 overflow-y-auto space-y-1 pr-1">
              {filtered.map((s) => {
                const isCurrent = s.id === currentStudentId;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleSelectStudent(s.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold'
                        : 'hover:bg-slate-50 border border-transparent text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${s.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                        {s.avatarIcon}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 leading-none">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">Mã: {s.code}</p>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <span className="text-[11px] text-indigo-600 hover:underline">Chọn</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
            <p className="text-[11px] text-slate-500">
              💡 Phụ huynh chỉ xem được dữ liệu của con mình để bảo mật thông tin cá nhân.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
