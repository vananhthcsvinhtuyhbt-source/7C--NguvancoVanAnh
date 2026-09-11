import React, { useState, useEffect } from 'react';
import { Lock, X, KeyRound, Eye, EyeOff, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

interface TeacherPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const TEACHER_PASSWORD_REQUIRED = '20182022';

export const TeacherPasswordModal: React.FC<TeacherPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setIsSuccess(false);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = password.trim();
    if (trimmed === TEACHER_PASSWORD_REQUIRED) {
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 350);
    } else {
      setError('Mật mã không chính xác. Vui lòng nhập đúng mật mã của Cô Vân Anh để vào chỉnh sửa!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-rose-100 overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shadow-inner">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-100 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5" /> Xác thực quyền Cô giáo
              </span>
              <h3 className="text-xl font-bold tracking-tight">Mục Cô Vân Anh</h3>
            </div>
          </div>
          
          <p className="text-xs text-rose-50 leading-relaxed mt-1">
            Vui lòng nhập mật mã quản trị để truy cập và chỉnh sửa đánh giá học sinh, bài học và thông tin Lớp 7C.
          </p>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-rose-500" />
              <span>Mật mã đăng nhập</span>
            </label>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Nhập mật mã để vào chỉnh sửa..."
                className={`w-full pl-4 pr-11 py-3 text-sm bg-rose-50/40 border rounded-2xl focus:outline-hidden transition-all font-mono ${
                  error
                    ? 'border-rose-400 bg-rose-50 focus:border-rose-600 ring-2 ring-rose-200'
                    : 'border-rose-200 focus:border-rose-500 focus:bg-white focus:ring-2 focus:ring-rose-100'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 font-semibold mt-2 flex items-center gap-1 animate-in fade-in">
                <span>⚠️</span> {error}
              </p>
            )}

            {isSuccess && (
              <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Xác thực thành công! Đang vào giao diện Cô giáo...
              </p>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Quay lại Góc Ba Mẹ
            </button>
            <button
              type="submit"
              disabled={!password.trim() || isSuccess}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-200 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Mở khóa & Vào chỉnh sửa</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
