import React, { useState } from 'react';
import { useClass } from '../context/ClassContext';
import {
  GraduationCap,
  UserCheck,
  QrCode,
  Search,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLogin }) => {
  const { role, setRole, students, currentStudent, setCurrentStudentId, classInfo } = useClass();
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Cute Title: 7C - HỌC VĂN CÙNG CÔ VÂN ANH */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-rose-200 animate-gentle-float text-xl">
              <span>🌸</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-extrabold text-slate-800 text-base sm:text-xl tracking-tight flex items-center gap-1.5">
                  <span className="text-rose-600">7C</span>
                  <span className="text-slate-400 font-light">•</span>
                  <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-amber-600 bg-clip-text text-transparent">
                    HỌC VĂN CÙNG CÔ VÂN ANH
                  </span>
                  <span className="text-amber-500 text-sm animate-soft-pulse hidden sm:inline">✨</span>
                </h1>
                <span className="hidden lg:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                  Lớp 7C mến thương 🌷
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:flex items-center gap-2 mt-0.5">
                <span>Giáo viên môn Ngữ Văn: <strong className="text-slate-800">{classInfo.homeroomTeacher}</strong></span>
                <span className="text-slate-300">•</span>
                <span>THCS Tân Khai</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-600 font-medium">38 bạn nhỏ chăm ngoan 🎒</span>
              </p>
            </div>
          </div>

          {/* Right Controls: Role Switcher & Student Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Student Selector (Active when in Parent Mode or Quick Switch) */}
            <div className="relative">
              <button
                id="header-student-select-btn"
                onClick={() => setShowStudentDropdown(!showStudentDropdown)}
                className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200/80 transition-colors text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs"
                title="Chọn bạn học sinh để xem sổ liên lạc"
              >
                <div className={`w-6 h-6 rounded-full ${currentStudent?.avatarColor || 'bg-rose-500'} text-white flex items-center justify-center text-xs font-bold shadow-2xs`}>
                  {currentStudent?.name.slice(-1) || 'A'}
                </div>
                <span className="max-w-[90px] sm:max-w-[140px] truncate">
                  {currentStudent?.name || 'Chọn học sinh'}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {/* Student Dropdown */}
              {showStudentDropdown && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-xl border border-rose-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2 border-b border-rose-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                        <span>🎒</span> 38 bạn nhỏ Lớp 7C
                      </span>
                      <button
                        onClick={() => {
                          setShowStudentDropdown(false);
                          onOpenLogin();
                        }}
                        className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <QrCode className="w-3.5 h-3.5" /> Tra cứu mã
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-rose-300" />
                      <input
                        type="text"
                        placeholder="Tìm tên hoặc mã (vd: 7C09)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-rose-50/40 border border-rose-200/70 rounded-xl focus:outline-hidden focus:border-rose-400"
                      />
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto px-2 py-1 space-y-0.5">
                    {filteredStudents.map((s, idx) => {
                      const isSelected = s.id === currentStudent?.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setCurrentStudentId(s.id);
                            setShowStudentDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl text-xs transition-colors ${
                            isSelected
                              ? 'bg-rose-100/70 text-rose-900 font-bold'
                              : 'hover:bg-rose-50/50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-6 text-[10px] font-mono text-rose-400 font-bold">
                              {s.code}
                            </span>
                            <span className="truncate">{s.name}</span>
                          </div>
                          {isSelected && <span className="text-xs">🌸</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="flex items-center bg-rose-50/70 p-1 rounded-2xl border border-rose-200/70">
              <button
                id="role-switch-parent"
                onClick={() => setRole('parent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  role === 'parent'
                    ? 'bg-white text-rose-700 shadow-xs'
                    : 'text-slate-600 hover:text-rose-800'
                }`}
              >
                <span>👨‍👩‍👧</span>
                <span className="hidden sm:inline">Góc Ba Mẹ</span>
              </button>
              <button
                id="role-switch-teacher"
                onClick={() => setRole('teacher')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  role === 'teacher'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-rose-800'
                }`}
              >
                <span>🌸</span>
                <span className="hidden sm:inline">Cô Vân Anh</span>
                <span className="sm:hidden">Cô</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
