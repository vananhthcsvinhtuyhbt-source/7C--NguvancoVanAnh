import React, { useState, useEffect } from 'react';
import { ClassInfo } from '../types';
import { X, Settings, CheckCircle2, School } from 'lucide-react';

interface ClassInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  classInfo: ClassInfo;
  onUpdateClassInfo: (data: Partial<ClassInfo>) => void;
}

export const ClassInfoModal: React.FC<ClassInfoModalProps> = ({
  isOpen,
  onClose,
  classInfo,
  onUpdateClassInfo,
}) => {
  const [className, setClassName] = useState(classInfo.className || 'Lớp 7C');
  const [school, setSchool] = useState(classInfo.school || 'Trường THCS Tân Khai');
  const [homeroomTeacher, setHomeroomTeacher] = useState(classInfo.homeroomTeacher || 'Cô Vân Anh');
  const [roleDescription, setRoleDescription] = useState(
    classInfo.roleDescription || 'Giáo viên môn Ngữ Văn'
  );
  const [academicYear, setAcademicYear] = useState(classInfo.academicYear || 'Năm học 2026 - 2027');
  const [totalStudents, setTotalStudents] = useState<number>(classInfo.totalStudents || 38);

  useEffect(() => {
    setClassName(classInfo.className || 'Lớp 7C');
    setSchool(classInfo.school || 'Trường THCS Tân Khai');
    setHomeroomTeacher(classInfo.homeroomTeacher || 'Cô Vân Anh');
    setRoleDescription(classInfo.roleDescription || 'Giáo viên môn Ngữ Văn');
    setAcademicYear(classInfo.academicYear || 'Năm học 2026 - 2027');
    setTotalStudents(classInfo.totalStudents || 38);
  }, [classInfo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateClassInfo({
      className: className.trim() || 'Lớp 7C',
      school: school.trim() || 'Trường THCS Tân Khai',
      homeroomTeacher: homeroomTeacher.trim() || 'Cô Vân Anh',
      roleDescription: roleDescription.trim() || 'Giáo viên môn Ngữ Văn',
      academicYear: academicYear.trim() || 'Năm học 2026 - 2027',
      totalStudents: totalStudents || 38,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <School className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Cài đặt thông tin Lớp & Giáo viên</h3>
              <p className="text-xs text-slate-300">Tùy chỉnh tên lớp, trường học, họ tên giáo viên</p>
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tên lớp học:
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="vd: Lớp 7C"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Năm học:
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="vd: Năm học 2026 - 2027"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trường học:
            </label>
            <input
              type="text"
              required
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="vd: Trường THCS Tân Khai"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ và tên giáo viên:
              </label>
              <input
                type="text"
                required
                value={homeroomTeacher}
                onChange={(e) => setHomeroomTeacher(e.target.value)}
                placeholder="vd: Cô Vân Anh"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-indigo-900 focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Chức danh / Vai trò:
              </label>
              <input
                type="text"
                value={roleDescription}
                onChange={(e) => setRoleDescription(e.target.value)}
                placeholder="vd: Giáo viên môn Ngữ Văn"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sĩ số học sinh:
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={totalStudents}
              onChange={(e) => setTotalStudents(Number(e.target.value))}
              className="w-32 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-center focus:bg-white focus:outline-hidden focus:border-indigo-600"
            />
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
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Lưu thông tin lớp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
