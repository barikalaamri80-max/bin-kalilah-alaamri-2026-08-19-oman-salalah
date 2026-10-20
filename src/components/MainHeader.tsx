import React from 'react';
import {
  Printer,
  Copy,
  Presentation,
  Mic,
  Volume2,
  LogIn,
  LogOut,
  CheckCircle2,
  Scale,
  FileText,
  Sparkles,
  Camera,
  Layers,
  MessageSquare,
  Lock,
  Upload,
  Gavel,
} from 'lucide-react';
import { User } from 'firebase/auth';

export type ViewTab =
  | 'slides_royal'
  | 'dialogue_sim'
  | 'violations_laws'
  | 'studio_upload'
  | 'dossier'
  | 'ministry'
  | 'ai_advisor'
  | 'gallery';

interface MainHeaderProps {
  user: User | null;
  activeView: ViewTab;
  onChangeView: (view: ViewTab) => void;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSlides: () => void;
  onOpenLiveVoice: () => void;
  onPlayFullTTS: () => void;
  isTTSPlaying: boolean;
  onLockApp?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  user,
  activeView,
  onChangeView,
  onLogin,
  onLogout,
  onOpenSlides,
  onOpenLiveVoice,
  onPlayFullTTS,
  isTTSPlaying,
  onLockApp,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="border-b-2 border-[#D4AF37] bg-white/95 sticky top-0 z-40 backdrop-blur-md shadow-sm no-print">
      {/* Top Bar with Brand & Global Actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100">
        {/* Real User Corporate Logo & Entity Details */}
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="relative w-14 h-14 rounded-full border-2 border-[#D4AF37] p-0.5 bg-white shadow-md flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg"
              alt="شعار شركة بن كليلة العامري للتجارة والاستثمار"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/aistudio/Image_1_1985a852.png';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-[#23153c] tracking-tight">
                شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                صلالة — ظفار
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-900 font-bold">
              إلى الفاضل / <span className="text-[#23153c] font-black">خالد المسروري</span> المحترم — مدير عام مركز حماية المنافسة ومنع الاحتكار
            </p>
          </div>
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Lock Button */}
          {onLockApp && (
            <button
              onClick={onLockApp}
              className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-gray-300 hover:border-red-400 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold text-xs transition shadow-xs cursor-pointer"
              title="قفل الشاشة وتشفير الملف برمز المرور السري"
            >
              <Lock className="w-3.5 h-3.5 ml-1 text-gray-500" />
              <span>قفل الملف</span>
            </button>
          )}

          {/* Google Slides Integration */}
          <button
            onClick={onOpenSlides}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#D4AF37] bg-amber-500/10 hover:bg-[#C59B27] text-[#23153c] hover:text-white font-bold text-xs transition duration-200 shadow-xs"
            title="إنشاء وتصدير شرائح رسمية إلى Google Slides"
          >
            <Presentation className="w-4 h-4 ml-1.5 text-[#C59B27]" />
            <span>Google Slides</span>
          </button>

          {/* Voice Live API */}
          <button
            onClick={onOpenLiveVoice}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#23153c] bg-[#23153c] text-amber-200 hover:bg-[#35215c] font-bold text-xs transition duration-200 shadow-xs"
            title="محادثة صوتية تفاعلية مع المستشار القانوني الحي (Live API)"
          >
            <Mic className="w-4 h-4 ml-1.5 text-amber-400 animate-pulse" />
            <span>المستشار الصوتي (Live)</span>
          </button>

          {/* TTS Audio Narration */}
          <button
            onClick={onPlayFullTTS}
            className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-xs font-bold transition duration-200 shadow-xs ${
              isTTSPlaying
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white border-gray-300 text-gray-800 hover:border-[#C59B27] hover:text-[#23153c]'
            }`}
            title="استماع صوتي للملخص التنفيذي (Gemini Flash TTS)"
          >
            <Volume2 className={`w-4 h-4 ml-1.5 ${isTTSPlaying ? 'animate-bounce' : 'text-amber-600'}`} />
            <span>{isTTSPlaying ? 'جاري الاستماع...' : 'استماع صوتي'}</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#D4AF37] text-gray-700 hover:text-[#23153c] font-bold text-xs transition duration-200"
          >
            <Printer className="w-4 h-4 ml-1.5" />
            <span>طباعة / PDF</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#D4AF37] text-gray-700 hover:text-[#23153c] font-medium text-xs transition duration-200"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 ml-1.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 ml-1.5 text-amber-600" />
                <span>نسخ</span>
              </>
            )}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center space-x-2 space-x-reverse pr-2 border-r border-gray-300">
              <span className="text-xs font-bold text-[#23153c] max-w-[110px] truncate" title={user.email || ''}>
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <button
                onClick={onLogout}
                className="p-1 rounded text-gray-400 hover:text-red-700 transition"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition shadow-xs"
              title="تسجيل الدخول باستخدام Google"
            >
              <LogIn className="w-4 h-4 ml-1.5" />
              <span>دخول Google</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <nav aria-label="أقسام المنصة" className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-2 py-2 text-xs font-bold scrollbar-none">
        {/* TAB 1: 4 Royal Slides */}
        <button
          onClick={() => onChangeView('slides_royal')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'slides_royal'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Presentation className="w-4 h-4 text-amber-400" />
          <span>العرض التقديمي الملكي (٤ شرائح)</span>
        </button>

        {/* TAB 2: Duo Audio Simulation */}
        <button
          onClick={() => onChangeView('dialogue_sim')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'dialogue_sim'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#ECC870]" />
          <span>المحاكاة الصوتية الحوارية (شخصان)</span>
        </button>

        {/* TAB 3: Violations & Laws Table */}
        <button
          onClick={() => onChangeView('violations_laws')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'violations_laws'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Gavel className="w-4 h-4 text-[#C59B27]" />
          <span>جدول التعسف ونصوص القانون العماني</span>
        </button>

        {/* TAB 4: Studio Direct Upload */}
        <button
          onClick={() => onChangeView('studio_upload')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'studio_upload'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-500" />
          <span>الرفع المباشر للأدلة من الاستوديو</span>
        </button>

        {/* TAB 5: Original Master Dossier */}
        <button
          onClick={() => onChangeView('dossier')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'dossier'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>الملف الرقابي والسيادي (BKA-ANTITRUST)</span>
        </button>

        {/* TAB 6: Ministry Memo */}
        <button
          onClick={() => onChangeView('ministry')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'ministry'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>مذكرة ديوان الوزارة (خالد المسروري)</span>
        </button>

        {/* TAB 7: AI Advisor */}
        <button
          onClick={() => onChangeView('ai_advisor')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'ai_advisor'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#E8C56B]" />
          <span>المستشار وكاشف المغالطات (Gemini)</span>
        </button>

        {/* TAB 8: Fleet & Field Gallery */}
        <button
          onClick={() => onChangeView('gallery')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
            activeView === 'gallery'
              ? 'bg-[#23153c] text-amber-200 border-2 border-[#D4AF37] shadow-xs'
              : 'text-gray-700 hover:bg-gray-100 hover:text-[#23153c]'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>معرض الرصد الميداني والأسطول</span>
        </button>
      </nav>
    </header>
  );
};
