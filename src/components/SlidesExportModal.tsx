import React from 'react';
import { X, Layers, Printer, CheckCircle2, FileText } from 'lucide-react';
import { TWENTY_TWO_SLIDES_DATA } from '../data/presentation22SlidesData';

interface SlidesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSlides?: () => void;
}

export const SlidesExportModal: React.FC<SlidesExportModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSlides,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EAE4D3] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#23153C]">
                تصدير واستعراض العرض التقديمي الملكي (Google Slides / A4 PDF)
              </h3>
              <p className="text-xs text-[#6B655C]">
                {TWENTY_TWO_SLIDES_DATA.length} شريحة رسمية بمقاس A4 عمودي — صلالة 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF9F6] border border-[#DEC98A] text-[#2C2A28] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] space-y-2 text-xs sm:text-sm text-[#2C2A28]">
          <div className="font-bold text-[#23153C] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8A6D2F]" />
            <span>العرض التقديمي المعتمد (Slide 1 to 22) جاهز للطباعة والتصدير المباشر:</span>
          </div>
          <p className="text-xs text-[#524E48] leading-relaxed">
            يتضمن 22 شريحة A4 عمودية تغطي السداد النقدي المسبق 100% (18,640 ر.ع)، وعبور الشحنة الأولى خلال 24 ساعة مقابل 5 أشهر و18 يوماً من التعطيل المستندي، والمهلة الرسمية (3 أيام عمل) الممنوحة من دائرة المنافسة.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          {onNavigateToSlides && (
            <button
              onClick={() => {
                onNavigateToSlides();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] text-[#23153C] border border-[#DEC98A] text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#8A6D2F]" />
              <span>استعراض الـ 22 شريحة في المنصة</span>
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              setTimeout(() => window.print(), 150);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>تصدير وطباعة الشرائح (PDF / A4)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlidesExportModal;
