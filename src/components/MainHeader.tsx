import React, { useState } from 'react';
import {
  Volume2,
  Square,
  Printer,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Award,
  Lock,
  FileText,
  Sparkles,
  UserCheck,
  Play,
} from 'lucide-react';
import SovereignEmblem from './SovereignEmblem';

export interface MainHeaderProps {
  onPlayWelcomeAudio?: () => void;
  isPlayingWelcome?: boolean;
  onPlayAllSequentially?: () => void;
  isPlayingSequential?: boolean;
  onLock?: () => void;
  onOpenSlidesModal?: () => void;
  onOpenLiveVoiceModal?: () => void;
}

export const MainHeader: React.FC<MainHeaderProps> = ({
  onPlayWelcomeAudio,
  isPlayingWelcome = false,
  onPlayAllSequentially,
  isPlayingSequential = false,
  onLock,
  onOpenSlidesModal,
  onOpenLiveVoiceModal,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <header
      className="relative overflow-hidden border-b-2 border-[#DEC98A] bg-[#FFFFFF] pt-5 pb-7 shadow-2xs"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5">
        {/* Top Utility & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE4D3]">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#524E48]">
            <span className="text-[#23153C]">شركة بن كليلة العامري للتجارة والاستثمار ش.م.م</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#8A6D2F]">صلالة — ظفار</span>
            <span aria-hidden="true">·</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-[#23153C]">
              Barik Alaamri
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            {onLock && (
              <button
                onClick={onLock}
                className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#2C2A28] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                title="قفل الملف بالرقم السري SALALAH2026"
              >
                <Lock className="w-3.5 h-3.5 text-[#8A6D2F]" />
                <span>قفل الملف</span>
              </button>
            )}

            {onOpenSlidesModal && (
              <button
                onClick={onOpenSlidesModal}
                className="px-4 py-2 rounded-xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>العرض التقديمي الشامل (PDF)</span>
              </button>
            )}

            {onOpenLiveVoiceModal && (
              <button
                onClick={onOpenLiveVoiceModal}
                className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8A6D2F]" />
                <span>المساعد الذكي والمستشار (PDF)</span>
              </button>
            )}

            {onPlayWelcomeAudio && (
              <button
                onClick={onPlayWelcomeAudio}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border whitespace-nowrap shrink-0 cursor-pointer ${
                  isPlayingWelcome
                    ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                    : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                }`}
              >
                {isPlayingWelcome ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current text-[#23153C]" />
                    <span>إيقاف الصوت</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>استماع فوري للوثيقة</span>
                  </>
                )}
              </button>
            )}

            {onPlayAllSequentially && (
              <button
                onClick={onPlayAllSequentially}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border whitespace-nowrap shrink-0 cursor-pointer ${
                  isPlayingSequential
                    ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                    : 'bg-[#F5EFE0] text-[#23153C] border-[#C5A858] hover:bg-[#EDE2C8]'
                }`}
              >
                {isPlayingSequential ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current text-[#23153C]" />
                    <span>إيقاف التسلسل</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                    <span>تشغيل الشرائح وراء بعض</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#8A6D2F]" />
              <span>طباعة / PDF</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8A6D2F]" />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Center Hero Identity: Official Uploaded Company Seal + Title + Exclusive Recipient */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-right gap-5">
            <SovereignEmblem size={88} className="ring-2 ring-[#F5EFE0]" />

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-[#8A6D2F]">
                شركة بن كليلة العامري للتجارة والاستثمار ش.م.م · صلالة — ظفار
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#23153C] royal-heading leading-tight">
                إلى الفاضل /{' '}
                <span className="text-[#8A6D2F] underline decoration-[#DEC98A] underline-offset-8">
                  خالد المسروري
                </span>{' '}
                المحترم — مدير عام مركز حماية المنافسة ومنع الاحتكار
              </h1>
              <div className="text-xs sm:text-sm font-semibold text-[#524E48] flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <UserCheck className="w-4 h-4 text-[#8A6D2F]" />
                <span>وزارة التجارة والصناعة وترويج الاستثمار — دائرة المنافسة والاحتكار</span>
              </div>
            </div>
          </div>

          {/* Key Fact Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] flex items-center gap-3">
              <Clock className="w-5 h-5 text-[#8A6D2F] shrink-0" />
              <div>
                <div className="text-[11px] text-[#6B655C] font-medium">إجمالي فترة التعطيل</div>
                <div className="text-xs sm:text-sm font-bold text-[#23153C]">5 أشهر و18 يوماً</div>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8A6D2F] shrink-0" />
              <div>
                <div className="text-[11px] text-[#6B655C] font-medium">المهلة الرسمية والصمت</div>
                <div className="text-xs sm:text-sm font-bold text-[#23153C]">3 أيام من الصمت الرسمي</div>
              </div>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] flex items-center gap-3">
              <Award className="w-5 h-5 text-[#8A6D2F] shrink-0" />
              <div>
                <div className="text-[11px] text-[#6B655C] font-medium">الرمز الذي يختصر الملف</div>
                <div className="text-xs sm:text-sm font-bold text-[#23153C]">صلالة 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
