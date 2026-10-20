import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertTriangle, Eye, EyeOff, Building2 } from 'lucide-react';

interface SecurityAccessGateProps {
  onUnlock: () => void;
}

export const SecurityAccessGate: React.FC<SecurityAccessGateProps> = ({ onUnlock }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const cleanInput = passwordInput.trim().toUpperCase();
    if (cleanInput === 'SALALAH2026') {
      try {
        sessionStorage.setItem('bka_access_token', 'SALALAH2026_AUTHORIZED');
        localStorage.setItem('bka_access_token', 'SALALAH2026_AUTHORIZED');
      } catch (err) {
        console.warn('Storage unavailable:', err);
      }
      setTimeout(() => {
        setIsSubmitting(false);
        onUnlock();
      }, 250);
    } else {
      setTimeout(() => {
        setIsSubmitting(false);
        setErrorMsg('رمز المرور السري غير صحيح. يرجى التحقق وإعادة المحاولة.');
      }, 350);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-[#140b22]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 25%, rgba(197, 155, 39, 0.18) 0%, rgba(20, 11, 34, 0.98) 75%), url('/assets/aistudio/Videoframe_20260904_003537_com.huawei.himovie.overseas_7b184af5.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Royal Subtle Gold Lighting Accents */}
      <div className="absolute -top-36 -right-36 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Outer Prestigious Card */}
        <div className="bg-[#1c1031]/95 backdrop-blur-2xl border-2 border-[#D4AF37] rounded-3xl p-7 sm:p-10 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] text-center text-white relative overflow-hidden">
          {/* Top Decorative Gold Crown Ribbon */}
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>

          {/* Official Company Emblem */}
          <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-5">
            <div className="w-full h-full rounded-full border-2 border-[#D4AF37] p-1.5 bg-white shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src="/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg"
                alt="شعار شركة بن كليلة العامري للتجارة والاستثمار"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    '/assets/aistudio/Screenshot_20260903_041907_1697c674.jpg';
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#C59B27] border-2 border-white flex items-center justify-center text-[#23153c] shadow-lg">
              <Lock className="w-4 h-4" />
            </div>
          </div>

          {/* Title & Official Direction Header */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black tracking-wider text-amber-200 bg-[#C59B27]/20 border border-[#D4AF37]/50">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>ملف رقابي سيادي محمي ومشفر</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
              شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
            </h1>

            <p className="text-xs sm:text-sm text-amber-300 font-bold">
              سلطنة عُمان — ديوان عام الوزارة | مركز حماية المنافسة ومنع الاحتكار
            </p>

            <div className="pt-2 border-t border-white/10 mt-3">
              <p className="text-xs sm:text-sm text-gray-200">
                إلى الفاضل / <span className="text-amber-300 font-black text-sm sm:text-base">خالد المسروري</span> المحترم
              </p>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                مدير عام مركز حماية المنافسة ومنع الاحتكار
              </p>
            </div>
          </div>

          {/* Security Notice Note */}
          <div className="bg-[#261642]/80 border border-[#D4AF37]/35 rounded-2xl p-4 mb-6 text-xs text-gray-200 leading-relaxed text-right flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              هذا الملف مخصص للجهات الرقابية والمصرح لهم رسمياً. يُرجى إدخال رمز المرور السري المعتمد لفتح العرض التقديمي والمستندات الرقابية.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative text-right">
              <label
                htmlFor="gate-pass-input"
                className="block text-xs sm:text-sm font-bold text-amber-200 mb-2 mr-1"
              >
                رمز المرور السري:
              </label>

              <div className="relative flex items-center">
                <input
                  id="gate-pass-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder=""
                  className="w-full bg-[#100720] border-2 border-[#D4AF37]/60 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#C59B27]/50 text-white rounded-xl px-4 py-3.5 text-center text-base sm:text-lg font-bold tracking-widest transition outline-none"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 p-1 text-gray-400 hover:text-amber-300 transition cursor-pointer"
                  title={showPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 rounded-xl text-xs font-bold flex items-center gap-2.5 text-right animate-in fade-in duration-200">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !passwordInput.trim()}
              className="w-full py-3.5 px-6 rounded-xl gold-gradient-bg text-[#23153c] font-black text-sm sm:text-base tracking-wide hover:brightness-110 active:scale-[0.99] transition shadow-[0_6px_25px_rgba(212,175,55,0.45)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#23153c]" />
              <span>{isSubmitting ? 'جاري التحقق وفك التشفير...' : 'دخول وفك تشفير الملف الرقابي'}</span>
            </button>
          </form>

          {/* Confidentiality Notice */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] sm:text-xs text-gray-400 leading-normal block">
              يتم تزويد رمز المرور السري مباشرة من إدارة الشركة للمصرح لهم بالاطلاع
            </span>
          </div>
        </div>

        {/* Footer Authority */}
        <p className="text-center text-gray-400 text-xs mt-4">
          نظام التوثيق والمطابقة الرقابية © 2026 — شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
        </p>
      </div>
    </div>
  );
};
