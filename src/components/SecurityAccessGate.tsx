import React, { useState } from 'react';
import { Lock, ShieldCheck, KeyRound, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import SovereignEmblem from './SovereignEmblem';

interface SecurityAccessGateProps {
  onUnlock: () => void;
}

export const SecurityAccessGate: React.FC<SecurityAccessGateProps> = ({ onUnlock }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      const normalized = passwordInput.trim().toUpperCase();
      if (normalized === 'SALALAH2026') {
        onUnlock();
      } else {
        setErrorMsg('الرقم السري غير صحيح. يُرجى إدخال الرقم السري المعتمد للدخول.');
        setIsSubmitting(false);
      }
    }, 150);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#FAF9F6] text-[#2C2A28]"
    >
      <div className="w-full max-w-lg">
        <div className="bg-[#FFFFFF] border border-[#DEC98A] rounded-3xl p-7 sm:p-10 shadow-xs text-center relative overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-l from-[#DEC98A] via-[#F3E9CB] to-[#D4B96A] absolute top-0 inset-x-0" />

          {/* Official Company Emblem */}
          <div className="flex justify-center mb-5 pt-2">
            <SovereignEmblem size={96} className="ring-2 ring-[#F5EFE0]" />
          </div>

          {/* Title & Official Direction Header */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold text-[#2C2A28] bg-[#FAF9F6] border border-[#DEC98A]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8A6D2F]" />
              <span>وثيقة رسمية مخصصة للجهات المختصة</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#2C2A28] royal-heading leading-snug">
              شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
            </h1>

            <div className="pt-3 border-t border-[#EAE4D3] mt-3">
              <p className="text-xs sm:text-sm text-[#524E48] font-medium">
                إلى الفاضل /{' '}
                <span className="text-[#2C2A28] font-bold text-sm sm:text-base">
                  خالد المسروري
                </span>{' '}
                المحترم
              </p>
              <p className="text-xs text-[#6B655C] mt-0.5">
                مدير عام دائرة المنافسة والاحتكار — وزارة التجارة والصناعة وترويج الاستثمار
              </p>
            </div>
          </div>

          {/* Security Notice Note */}
          <div className="bg-[#FAF9F6] border border-[#E6DEC8] rounded-2xl p-4 mb-6 text-xs text-[#33302C] leading-relaxed text-right flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#8A6D2F] shrink-0 mt-0.5" />
            <span>
              يُرجى إدخال الرقم السري المعتمد للدخول إلى الوثيقة واستعراض الوقائع الموثقة.
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative text-right">
              <label
                htmlFor="gate-pass-input"
                className="block text-xs sm:text-sm font-semibold text-[#2C2A28] mb-2 mr-1"
              >
                الرقم السري للدخول:
              </label>

              <div className="relative flex items-center">
                <input
                  id="gate-pass-input"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="أدخل الرقم السري"
                  dir="ltr"
                  className="w-full bg-[#FAF9F6] border border-[#DEC98A] focus:border-[#8A6D2F] text-[#2C2A28] rounded-xl px-4 py-3.5 text-center text-base sm:text-lg font-bold tracking-widest transition outline-none"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 p-1 text-[#6B655C] hover:text-[#2C2A28] transition cursor-pointer"
                  title={showPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FDF6F6] border border-[#E6B8B8] text-[#7A2E2E] rounded-xl text-xs font-semibold flex items-center gap-2.5 text-right">
                <AlertTriangle className="w-4 h-4 text-[#9E3B3B] shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !passwordInput.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-[#F5EFE0] hover:bg-[#EDE2C8] text-[#2C2A28] border border-[#C5A858] font-bold text-sm sm:text-base transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#8A6D2F]" />
              <span>{isSubmitting ? 'جاري التحقق...' : 'دخول إلى الوثيقة'}</span>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#EAE4D3] text-[11px] text-[#6B655C] flex flex-wrap justify-between items-center gap-2">
            <span>شركة بن كليلة العامري للتجارة والاستثمار ش.م.م</span>
            <span className="font-semibold text-[#8A6D2F]">صلالة، سلطنة عمان</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessGate;
