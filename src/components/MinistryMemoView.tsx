import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  Scale,
  FileText,
  Loader2,
  Printer,
} from 'lucide-react';
import SovereignEmblem from './SovereignEmblem';
import { speakArabicText, stopAllAudio, subscribeToTTS } from '../services/ttsService';

interface MemoSection {
  id: string;
  sectionIndex: string;
  title: string;
  content: string;
  legalAnchor: string;
  documentedDate: string;
}

const MEMO_SECTIONS: MemoSection[] = [
  {
    id: 'memo-sec-1',
    sectionIndex: 'أولاً · الافتتاح الهادئ والجهة المختصة',
    title: 'إيداع الوقائع أمام دائرة المنافسة والاحتكار',
    content:
      'الأستاذ خالد المسروري المحترم، دائرة المنافسة والاحتكار، السلام عليكم. لا أتيتُ بشكوى، ولا أطلب تعويضاً. أضع بين أيديكم وقائع، والحكم لكم.',
    legalAnchor: 'وزارة التجارة والصناعة وترويج الاستثمار — دائرة المنافسة والاحتكار',
    documentedDate: 'صلالة 2026',
  },
  {
    id: 'memo-sec-2',
    sectionIndex: 'ثانياً · قاعدة الرفض والمهلة الرسمية (ثلاثة أيام عمل)',
    title: 'نفي حجة «نحن لم نرفض البيع» بالأدلة السلوكية',
    content:
      'الطرف الآخر يقول: نحن لم نرفض البيع. وأقول بهدوء: الرفض ليس كلمة تُقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض. الوزارة منحت مهلة رسمية ثلاثة أيام عمل. وأنا ومعي فيصل المعشني وأدهم البروشي ومهند الرئيسي، أرسلنا لكل واحد منهم رسالة PDF بقائمة المستندات، ومرفقاً بها صورة من وزارة التغير المناخي والبيئة. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي.',
    legalAnchor: 'الصمت الرسمي ثلاثة أيام أمام مهلة رسمية هو رفض فعلي',
    documentedDate: 'ثلاثة مسؤولين · ثلاث رسائل · ثلاثة أيام',
  },
  {
    id: 'memo-sec-3',
    sectionIndex: 'ثالثاً · الأسباب التعسفية والذرائع التي لم تُصحَّح',
    title: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ',
    content:
      'شهادة تحليل تذكر مادة مضادات الكوكزيديا، والملصق يتجاهلها ويكتفي بعبارة برنامج تناوبي. وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم. وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام. هذه ذرائع لم تُصحَّح. والذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ.',
    legalAnchor: 'ترك الذرائع الفنية دون تصحيح أمام مهلة رسمية يثبت القرار بالامتناع',
    documentedDate: 'شهادة التحليل · الملصق · إقرار السلامة · فترة السحب',
  },
  {
    id: 'memo-sec-4',
    sectionIndex: 'رابعاً · تصحيح الصورة والبعد الوطني والخاتمة',
    title: '5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي',
    content:
      'أنا لا أقول إن المستثمر لا يخطئ. المستثمر بشر. لكن المحاسبة تكون بإجراء مكتوب: بيان الخلل، ومهلة التصحيح. أما الصمت، فليس محاسبة، بل إغلاق باب. الدولة حفظها الله وضعتكم في موقع المسؤولية، ودائرتكم مباشرة مع مكتب الوزير. ونحن بعد الله نضع أمننا فيكم. نطلب أن تعود المياه إلى مجاريها، وأن يرجع الحق إلى صاحبه، وأن تمشي الأمور. كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.',
    legalAnchor: 'أن تعود المياه إلى مجاريها وأن يرجع الحق إلى صاحبه — الرمز الختامي: صلالة 2026',
    documentedDate: '5 أشهر و18 يوماً · صلالة 2026',
  },
];

export const MinistryMemoView: React.FC = () => {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsLoading(loading);
    });
    return () => unsub();
  }, []);

  const handlePlaySection = (sec: MemoSection) => {
    const key = `memo-${sec.id}`;
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(sec.content, key, 'khalid');
  };

  const handlePlayFullMemo = () => {
    const fullKey = 'memo-full-readout';
    if (activeAudioId === fullKey) {
      stopAllAudio();
      return;
    }
    const combined = MEMO_SECTIONS.map((s) => s.content).join(' ');
    speakArabicText(combined, fullKey, 'khalid');
  };

  const isPlayingFull = activeAudioId === 'memo-full-readout';

  return (
    <section
      className="space-y-8 bg-[#FAF9F6] text-[#2C2A28]"
      dir="rtl"
      aria-label="المذكرة الرسمية المرفوعة لدائرة المنافسة والاحتكار"
    >
      {/* Main Daytime Light-Mode Official Memorandum Sheet (#FFFFFF & #FAF9F6 with Calm Gold Frame) */}
      <div className="rounded-3xl bg-[#FFFFFF] border border-[#DEC98A] shadow-2xs overflow-hidden">
        {/* Subtle Warm Gold Hairline Strip */}
        <div className="h-1.5 w-full bg-gradient-to-l from-[#DEC98A] via-[#F3E9CB] to-[#D4B96A]" />

        {/* Official Letterhead with Uploaded Company Seal Logo */}
        <div className="p-6 sm:p-10 bg-[#FFFFFF] border-b border-[#EAE4D3]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Right: Uploaded Official Corporate Seal Logo + Company & Addressee Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-5">
              <SovereignEmblem size={92} className="ring-2 ring-[#F5EFE0]" />

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-medium text-[#8A6D2F]">
                  <span>شركة بن كليلة العامري للتجارة والاستثمار ش.م.م</span>
                  <span aria-hidden="true">·</span>
                  <span>صلالة، سلطنة عمان</span>
                  <span aria-hidden="true">·</span>
                  <span>الرمز: صلالة 2026</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A28] royal-heading leading-snug">
                  المذكرة الرسمية المرفوعة إلى{' '}
                  <span className="text-[#8A6D2F] underline decoration-[#DEC98A] underline-offset-8">
                    الأستاذ الفاضل / خالد المسروري المحترم
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-[#524E48] font-medium">
                  دائرة المنافسة والاحتكار — وزارة التجارة والصناعة وترويج الاستثمار
                </p>
              </div>
            </div>

            {/* Left: Calm Light Action Controls & Documented Timeframe */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-3 shrink-0">
              <div className="px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] text-right">
                <div className="text-xs text-[#6B655C] font-medium">ملخص الوقائع المودعة</div>
                <div className="text-sm font-semibold text-[#2C2A28] mt-0.5 tabular-nums">
                  5 أشهر و18 يوماً من التعطيل · 3 أيام من الصمت الرسمي
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 no-print">
                <button
                  onClick={handlePlayFullMemo}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border whitespace-nowrap shrink-0 cursor-pointer ${
                    isPlayingFull
                      ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                      : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                  }`}
                >
                  {isPlayingFull && isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8A6D2F]" />
                      <span>جاري التحضير الصوتي...</span>
                    </>
                  ) : isPlayingFull ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                      <span>إيقاف تلاوة المذكرة</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#8A6D2F]" />
                      <span>استماع فوري للمذكرة كاملة</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] text-xs font-medium flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8A6D2F]" />
                  <span>طباعة المذكرة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clean Light Metadata Summary Strip — Soft #FAF9F6 Cards with Calm Gold Hairline */}
          <div className="mt-6 pt-5 border-t border-[#EAE4D3] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
              <div className="text-xs font-medium text-[#8A6D2F]">الجهة الموجه إليها الخطاب حصراً</div>
              <div className="text-[#2C2A28] font-medium mt-1 leading-relaxed">
                وزارة التجارة والصناعة وترويج الاستثمار · دائرة المنافسة والاحتكار
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
              <div className="text-xs font-medium text-[#8A6D2F]">قاعدة الرفض والمهلة الرسمية</div>
              <div className="text-[#2C2A28] font-medium mt-1 leading-relaxed">
                ثلاثة مسؤولين · ثلاث رسائل · ثلاثة أيام صمت رسمي = رفض فعلي
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
              <div className="text-xs font-medium text-[#8A6D2F]">الأسباب التعسفية غير المصححة</div>
              <div className="text-[#2C2A28] font-medium mt-1 leading-relaxed">
                مضادات الكوكزيديا (برنامج تناوبي) · إقرار لاير لصفقة لاحم · سحب صفر يوم والاشتراط 7 أيام
              </div>
            </div>
          </div>
        </div>

        {/* Body of the Official Memorandum — Calm Light Reading Canvas (#FAF9F6 & #FFFFFF) */}
        <div className="p-6 sm:p-10 bg-[#FAF9F6] space-y-6">
          {MEMO_SECTIONS.map((sec) => {
            const isPlayingThis = activeAudioId === `memo-${sec.id}`;
            return (
              <article
                key={sec.id}
                className={`rounded-2xl p-6 sm:p-8 transition-colors border ${
                  isPlayingThis
                    ? 'bg-[#FFFFFF] border-[#C5A858] ring-1 ring-[#EAE0C0]'
                    : 'bg-[#FFFFFF] border-[#E6DEC8] hover:border-[#DEC98A]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE1]">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8A6D2F]">
                      <span>{sec.sectionIndex}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#6B655C]">{sec.documentedDate}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#2C2A28] royal-heading">
                      {sec.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => handlePlaySection(sec)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shrink-0 transition-colors border whitespace-nowrap no-print cursor-pointer ${
                      isPlayingThis
                        ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                        : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                    }`}
                  >
                    {isPlayingThis && isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6D2F]" />
                        <span>جاري التحضير...</span>
                      </>
                    ) : isPlayingThis ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                        <span>إيقاف الصوت</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                        <span>استماع فوري</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Comfortable, Calm Editorial Typography */}
                <p className="mt-4 text-base sm:text-[17px] text-[#33302C] leading-[2.05] font-normal max-w-4xl">
                  {sec.content}
                </p>

                <div className="mt-5 pt-3.5 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7D6227] font-medium">
                  <span className="flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>{sec.legalAnchor}</span>
                  </span>
                  <span className="text-[#6B655C] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>صلالة 2026</span>
                  </span>
                </div>
              </article>
            );
          })}

          {/* Official Closing & Sign-Off Block in Calm Light Mode (#FFFFFF & #FAF9F6) */}
          <div className="rounded-2xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DEC98A] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-right">
              <div className="text-xs font-medium text-[#8A6D2F]">
                الخاتمة المرفوعة إلى دائرة المنافسة والاحتكار
              </div>
              <p className="text-sm sm:text-base font-medium text-[#2C2A28] leading-relaxed max-w-2xl">
                «كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.»
              </p>
              <div className="text-xs text-[#6B655C] pt-1">
                شركة بن كليلة العامري للتجارة والاستثمار ش.م.م (صلالة، سلطنة عمان)
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 bg-[#FAF9F6] px-5 py-3.5 rounded-2xl border border-[#E6DEC8]">
              <SovereignEmblem size={56} />
              <div className="text-right">
                <div className="text-xs font-bold text-[#2C2A28]">بن كليلة العامري للتجارة والاستثمار</div>
                <div className="text-[11px] text-[#8A6D2F] font-medium">BIN KALILAH AL AMRI TRADE & INVESTMENT</div>
                <div className="text-[11px] text-[#6B655C]">SALALAH, OMAN · صلالة 2026</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinistryMemoView;
