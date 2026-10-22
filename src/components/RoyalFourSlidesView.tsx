import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Square,
  Play,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Scale,
  Landmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Printer,
  LayoutGrid,
  BookOpen,
  FileCheck2,
} from 'lucide-react';
import SovereignEmblem from './SovereignEmblem';
import IsometricSlideGraphics from './IsometricSlideGraphics';
import { TWENTY_TWO_SLIDES_DATA, LuxurySlideItem } from '../data/presentation22SlidesData';
import {
  speakArabicText,
  speakSequence,
  stopAllAudio,
  subscribeToTTS,
  isSequentialPlaybackActive,
} from '../services/ttsService';

interface CoreVerticalSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  dateTag: string;
  mainText: string;
  responseLabel: string;
  responseText: string;
  confirmationBanner: string;
  docRef: string;
  graphicType:
    | 'cover_emblem'
    | ' contradiction_matrix'
    | 'intermediary_bypass'
    | 'six_questions'
    | 'timeline_hourglass';
}

const INTERACTIVE_VERTICAL_PILLARS: CoreVerticalSlide[] = [
  {
    id: 'pillar-salalah-story',
    badge: 'الشريحة المحورية الأولى · حكاية العميل الوطني',
    title: 'حكاية العميل الوطني: ماذا حدث في صلالة؟',
    subtitle: 'من إغلاق المحل الأكبر في صلالة حفاظاً على النزاهة إلى مشروع التصدير الإماراتي الضخم',
    dateTag: 'مايو 2026 — صلالة وظفار',
    mainText:
      'يوثق هذا المحور إغلاق المحل الأكبر في صلالة في نفس الشهر (مايو عام 2026) بعد معاناة سنة كاملة من ممارسات الإغراق والتمييز، حيث آثر المستثمر الوطني حفظ كرامته ونزاهته وتصفية تجارته المحلية بدلاً من الطرق الملتوية، وجاء العميل الوطني إلى المصنع بصفقة إماراتية ضخمة ومشروع توريد استراتيجي تبلغ قيمته الإجمالية مليوناً و877 ألف ريال عماني.',
    responseLabel: 'الرد والمقارنة الوقائعية (الجهد الوطني مقابل التعطيل)',
    responseText:
      'يظهر التباين الواضح بين الجهد الوطني الملتزم — المتمثل في جدول توريد 16 تريلا (7,500 كيس)، والسداد النقدي المسبق بنسبة 100% عبر بنك مسقط (18,640 ريالاً عمانياً للدفعات الأولى)، وتحمل كافة التكاليف اللوجستية والرسوم — وبين خذلان المصنع لهذا الجهد عبر الامتناع عن تسليم المستندات المصنعية المطابقة.',
    confirmationBanner:
      'نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.',
    docRef: 'أمر الشراء BK-OFM-PO-001 · إيصالات بنك مسقط 686568727 / 689375818 / 691776712',
    graphicType: 'cover_emblem',
  },
  {
    id: 'pillar-technical-audit',
    badge: 'الشريحة المحورية الثانية · التدقيق الفني',
    title: 'التدقيق الفني: التناقض المستندي',
    subtitle: 'توضيح التضارب المستندي بين شهادة التحليل والبطاقة التعريفية واشتراطات فترة السحب (7 أيام)',
    dateTag: '23 يونيو 2026 — الطلب الرقابي APH-12062026-3382929',
    mainText:
      'يوضح هذا المحور الفخ المستندي والتضارب الفني الذي واجه العميل الوطني؛ حيث أظهرت شهادة التحليل (COA / ECI) الصادرة بتاريخ 23 من يونيو عام 2026 تعارضاً صريحاً مع البطاقة التعريفية للمنتج (Label) التي أشارت لوجود برنامج تدوير (Rotation Program) دون تحديد المادة ونسبتها، فضلاً عن إرسال إقرار سلامة يخص علف الدجاج البياض (Layer 16%) لصفقة موضوعها الحصري علف الدجاج اللاحم (Broiler Starter & Finisher). وقد أثر هذا التضارب مباشرة على شروط وزارة التغير المناخي والبيئة الإماراتية (MOCCAE) التي تشترط التطابق التام وتحديد فترة سحب لا تقل عن 7 أيام (أو شهادة خلو مخبرية معتمدة).',
    responseLabel: 'تأكيد حاسم أمام دائرة حماية المنافسة',
    responseText:
      'المتهم هنا هو التعطيل الإداري والمستندي المتعمد وليس المال؛ فالمستندات المصنعية (شهادة التحليل COA، والبطاقة التعريفية Label، وإقرار السلامة لمنتج اللاحم) تصدر حصرياً عن المصنع المنتج ولا يملك المستثمر صلاحية تعديلها قانوناً.',
    confirmationBanner:
      'تأكيد: المتهم هنا هو التعطيل الإداري المتعمد وليس المال — الذريعة التي لا تُصحَّح أمام مهلة رسمية هي قرار لا خطأ.',
    docRef: 'شهادة التحليل COA بتاريخ 23/06/2026 · ملاحظة الوزارة APH-12062026-3382929',
    graphicType: 'intermediary_bypass',
  },
  {
    id: 'pillar-intermediary-bypass',
    badge: 'الشريحة المحورية الثالثة · الوسيط وتجاوز الأصول',
    title: 'الوسيط وتجاوز الأصول: شركة الأطياف جنوباً ومزرعة سويحان',
    subtitle: 'توثيق محاولة الالتفاف المباشر على المشتري النهائي ورسالة حصر التعامل بالوسيط',
    dateTag: '19 مايو 2026 — مزرعة سويحان (الإمارات)',
    mainText:
      'توثيق تجاوزات الوسيط نوفل (شركة الأطياف جنوباً)، حيث قام بالتوجه مباشرة للمشتري النهائي (العميل الإماراتي في مزرعة سويحان) لعرض الاستحواذ على الصفقة متجاوزاً شركة بن كليلة العامري، ليتم طرده ورفض التعامل معه من قبل المشتري الإماراتي الذي تمسك بالعميل الوطني وبكلمته المبدئية. وقد تزامن ذلك مع رسالة مهند الموثقة بتاريخ 19 مايو 2026 التي نصت على حصر معاملات عميل الإمارات عبر الوسيط نوفل، ومع التهديدات المتكررة بغرامات تأخير قدرها 50 ريالاً عمانياً يومياً رغم أن التأخير تسبب فيه الوسيط ومصنع المطاحن.',
    responseLabel: 'الدلالة النظامية بموجب قانون حماية المنافسة ومنع الاحتكار (مرسوم سلطاني 67/2014)',
    responseText:
      'إن ربط معاملات المستثمر الوطني المسدد نقداً 100% بوسيط خارجي سعى للالتفاف على الصفقة في مزرعة سويحان يمثل إخلالاً صريحاً بحرية المنافسة وفرضاً لشروط تقييدية وتمييزية محظورة بموجب المادتين (9) و(10) من المرسوم السلطاني رقم 67/2014.',
    confirmationBanner:
      'رسالة 19 مايو 2026 الموثقة + واقعة مزرعة سويحان = قرينة قاطعة على تقييد التعامل المباشر مع المستثمر الوطني.',
    docRef: 'رسالة 19 مايو 2026 (Hi Nofal...) · محضر واقعة مزرعة سويحان',
    graphicType: 'intermediary_bypass',
  },
];

interface DecisiveQuestion {
  number: number;
  title: string;
  questionText: string;
  evidenceAnchor: string;
  legalBasis: string;
}

const SIX_DECISIVE_QUESTIONS: DecisiveQuestion[] = [
  {
    number: 1,
    title: 'السؤال الأول: التحول من إنجاز 24 ساعة إلى تعطيل 5 أشهر و18 يوماً',
    questionText:
      'كيف يفسر المصنع نجاح الشحنة الأولى (500 كيس علف بادي) وعبورها منفذ خطم الشكلة خلال 24 ساعة فقط في 1 مايو 2026، ثم التحول المفاجئ إلى 5 أشهر و18 يوماً من التعطيل المستندي فور صدور رسالة 19 مايو 2026 التي تحصر التعامل عبر الوسيط نوفل؟',
    evidenceAnchor: 'البيان الجمركي 20261501028987 (1 مايو 2026) مقابل رسالة 19 مايو 2026',
    legalBasis: 'المادة (9) والمادة (10) — مرسوم سلطاني 67/2014',
  },
  {
    number: 2,
    title: 'السؤال الثاني: التناقض بين شهادة التحليل (COA) والبطاقة التعريفية (Label)',
    questionText:
      'لماذا صدر التناقض الفني في 23 يونيو 2026 بين شهادة التحليل (COA) والبطاقة التعريفية للمنتج (Label) التي اكتفت بعبارة برنامج تدوير (Rotation Program)، ولماذا رفض مسؤول التصدير تعديل البطاقة التعريفية متذرعاً بتكلفة إعادة الطباعة رغم استلام كامل الثمن نقداً مقدماً؟',
    evidenceAnchor: 'شهادة التحليل 23/06/2026 + محادثة مسؤول التصدير (25 يونيو و2 يوليو 2026)',
    legalBasis: 'المادتان (155) و(158) من قانون المعاملات المدنية + القرار الوزاري 209/2020',
  },
  {
    number: 3,
    title: 'السؤال الثالث: إرسال إقرار علف دجاج بياض (Layer) لصفقة دجاج لاحم (Broiler)',
    questionText:
      'كيف تقوم إدارة المصنع في 23 و28 سبتمبر 2026 بإرسال إقرار سلامة علف خاص بالدجاج البياض (Layer 16%) مؤرخ في مايو 2025، بينما الفاتورتان الضريبيتان (OFM/270 و OFM/271) والشهادة البيطرية (829) تخصان حصراً علف الدجاج اللاحم (Broiler Starter & Finisher)؟',
    evidenceAnchor: 'الفاتورتان OFM/270 و OFM/271 مقابل إيميل 23 سبتمبر وإقرار 28 سبتمبر 2026',
    legalBasis: 'إخلال بالالتزام بتسليم ملحقات المبيع المطابقة لطبيعة البضاعة',
  },
  {
    number: 4,
    title: 'السؤال الرابع: تجاوزات الوسيط نوفل (شركة الأطياف جنوباً) في مزرعة سويحان',
    questionText:
      'بأي سند نظامي يُفرض على المستثمر الوطني العماني المرور عبر وسيط (نوفل — شركة الأطياف جنوباً) قام بالتوجه مباشرة إلى المشتري النهائي في مزرعة سويحان بدولة الإمارات لمحاولة الاستحواذ على الصفقة وتهديد العميل الوطني بغرامات تأخير 50 ريالاً يومياً عن تأخير تسبب فيه المصنع والوسيط؟',
    evidenceAnchor: 'رسالة 19 مايو 2026 + واقعة مزرعة سويحان الموثقة',
    legalBasis: 'حظر التمييز وتقييد التعامل المباشر — المادة (10) من قانون حماية المنافسة',
  },
  {
    number: 5,
    title: 'السؤال الخامس: تجاهل مذكرة المسارين النظاميين (7 أيام سحب أو شهادة خلو)',
    questionText:
      'لماذا امتنع المصنع عن الاستجابة لمذكرة التوضيح الفني المؤرخة في 7 أكتوبر 2026 (مرجع BK/REG-TECH/2026-10) التي وضعت أمامه الخيارين النظاميين المعتمدين لدى وزارة التغير المناخي والبيئة الإماراتية (فترة سحب 7 أيام مع ذكر المادة، أو فترة سحب 0 يوم مع شهادة خلو مخبرية معتمدة)، ولماذا أُلغيت 8 مكالمات هاتفية موثقة؟',
    evidenceAnchor: 'مذكرة 7 أكتوبر 2026 + سجل المكالمات الملغاة الموثق',
    legalBasis: 'امتناع مقنّع عن التعامل وإعاقة الانتفاع بالمبيع',
  },
  {
    number: 6,
    title: 'السؤال السادس: الصمت الرسمي لمدة 3 أيام عمل أمام المهلة الرسمية للوزارة',
    questionText:
      'ما هو التفسير القانوني لصمت المسؤولين الثلاثة (فيصل المعشني، أدهم كوهي/البلوشي، مهند الرئيسي) لمدة 3 أيام عمل كاملة بعد استلامهم رسائل PDF الرسمية ومرفق وزارة التغير المناخي والبيئة ضمن المهلة الرسمية الممنوحة من دائرة حماية المنافسة ومنع الاحتكار في 16–19 أكتوبر 2026؟',
    evidenceAnchor: 'خطاب المهلة الرسمية 16 أكتوبر 2026 + إشعارات التسليم الموثقة للثلاثة مسؤولين',
    legalBasis: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية هي قرار بالرفض لا خطأ عارض',
  },
];

export const RoyalFourSlidesView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'all' | 'single'>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSeqPlaying, setIsSeqPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsLoading(loading);
      setIsSeqPlaying(isSequentialPlaybackActive());
    });
    return () => unsub();
  }, []);

  const currentSlide = TWENTY_TWO_SLIDES_DATA[activeSlideIndex] || TWENTY_TWO_SLIDES_DATA[0];

  const handleToggleAudio = (text: string, key: string, title?: string) => {
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(text, key, 'khalid', undefined, title);
  };

  const handlePlayAllSlidesSequentially = () => {
    if (isSeqPlaying) {
      stopAllAudio();
      return;
    }

    const items = [
      {
        id: 'hero-mandatory-statement-audio',
        text: 'منازعات تصدير الأعلاف، حق المستثمر الوطني في مواجهة التعطيل. وثيقة توثيقية قانونية. نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.',
        title: 'المرتكز السيادي للوثيقة',
        persona: 'khalid' as const,
      },
      ...INTERACTIVE_VERTICAL_PILLARS.map((p) => ({
        id: `vertical-pillar-${p.id}`,
        text: `${p.title}. ${p.subtitle}. ${p.mainText} ${p.responseText} ${p.confirmationBanner}`,
        title: p.title,
        persona: 'khalid' as const,
      })),
      ...SIX_DECISIVE_QUESTIONS.map((q) => ({
        id: `decisive-q-${q.number}`,
        text: `${q.title}. ${q.questionText}`,
        title: q.title,
        persona: 'khalid' as const,
      })),
      ...TWENTY_TWO_SLIDES_DATA.map((s) => ({
        id: `royal-slide-22-${s.slideNumber}`,
        text: `الشريحة ${s.slideNumber}: ${s.title}. ${s.narrationScript}`,
        title: `الشريحة ${s.slideNumber} من 22 — ${s.title}`,
        persona: 'khalid' as const,
      })),
    ];

    speakSequence(items);
  };

  const renderA4PortraitSlide = (slide: LuxurySlideItem) => {
    const isPurpleSlide = slide.theme === 'purple';
    const audioKey = `royal-slide-22-${slide.slideNumber}`;
    const isPlayingThis = activeAudioId === audioKey;

    return (
      <article
        key={slide.slideNumber}
        id={`slide-a4-${slide.slideNumber}`}
        className={`w-full max-w-[840px] mx-auto rounded-[28px] p-3 sm:p-4 border-2 border-[#D4AF37] shadow-xl transition-all ${
          isPurpleSlide
            ? 'bg-gradient-to-b from-[#1E1136] via-[#261642] to-[#170C2B] text-[#FFFFFF]'
            : 'bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F6] to-[#F5EFE0] text-[#23153C]'
        }`}
        style={{ minHeight: '1040px' }}
      >
        <div
          className={`w-full h-full min-h-[1008px] rounded-[22px] border border-[#D4AF37]/80 p-6 sm:p-9 flex flex-col justify-between relative overflow-hidden ${
            isPurpleSlide ? 'bg-[#211339]/90' : 'bg-[#FAF9F6]/90'
          }`}
        >
          {/* Decorative Corner Gold Accents */}
          <div className="w-5 h-5 border-t-2 border-r-2 border-[#D4AF37] absolute top-3 right-3 rounded-tr-md pointer-events-none" />
          <div className="w-5 h-5 border-t-2 border-l-2 border-[#D4AF37] absolute top-3 left-3 rounded-tl-md pointer-events-none" />
          <div className="w-5 h-5 border-b-2 border-r-2 border-[#D4AF37] absolute bottom-3 right-3 rounded-br-md pointer-events-none" />
          <div className="w-5 h-5 border-b-2 border-l-2 border-[#D4AF37] absolute bottom-3 left-3 rounded-bl-md pointer-events-none" />

          {/* Top Header Strip */}
          <div
            className={`pb-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isPurpleSlide ? 'border-[#D4AF37]/40' : 'border-[#DEC98A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <SovereignEmblem size={54} className="border-2 border-[#D4AF37]" />
              <div>
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border ${
                    isPurpleSlide
                      ? 'bg-[#2E1B4F] text-[#F9E8A2] border-[#D4AF37]'
                      : 'bg-[#23153C] text-[#F9E8A2] border-[#D4AF37]'
                  }`}
                >
                  <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{slide.sectionBadge}</span>
                </div>
                <div
                  className={`text-xs font-bold mt-1 ${
                    isPurpleSlide ? 'text-[#E5DEC9]' : 'text-[#5C4B78]'
                  }`}
                >
                  شركة بن كليلة العامري · موجهة إلى: وزارة التجارة والصناعة (دائرة حماية المنافسة)
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center no-print">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  isPurpleSlide
                    ? 'bg-[#170C2B] text-[#F9E8A2] border-[#D4AF37]/60'
                    : 'bg-[#FFFFFF] text-[#23153C] border-[#D4AF37]'
                }`}
              >
                {slide.dateLabel}
              </span>
              <button
                onClick={() => handleToggleAudio(slide.narrationScript, audioKey, slide.title)}
                className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                  isPlayingThis
                    ? 'bg-[#D4AF37] text-[#23153C] border-[#FFF3C4]'
                    : isPurpleSlide
                    ? 'bg-[#2E1B4F] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#3B2363]'
                    : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#311E54]'
                }`}
              >
                {isPlayingThis && isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>تحضير...</span>
                  </>
                ) : isPlayingThis ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>إيقاف الصوت</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>استماع فوري</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Body: Title, 3D Isometric Graphic, Main Analytical Narrative, and Gold-Framed Cards */}
          <div className="my-auto py-5 space-y-6">
            <div
              className={`p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] text-center space-y-2 ${
                isPurpleSlide
                  ? 'bg-gradient-to-r from-[#190D2E] via-[#2A174B] to-[#190D2E]'
                  : 'bg-[#FFFFFF] shadow-xs'
              }`}
            >
              <h2
                className={`text-xl sm:text-2xl font-extrabold leading-relaxed royal-heading ${
                  isPurpleSlide ? 'text-[#FFF3C4]' : 'text-[#23153C]'
                }`}
              >
                {slide.title}
              </h2>
              <p
                className={`text-xs sm:text-sm font-bold ${
                  isPurpleSlide ? 'text-[#E5DEC9]' : 'text-[#7A5C12]'
                }`}
              >
                {slide.subtitle}
              </p>
            </div>

            <IsometricSlideGraphics type={slide.graphicType} theme={slide.theme} />

            <div
              className={`p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] leading-loose text-sm sm:text-base font-semibold text-justify ${
                isPurpleSlide
                  ? 'bg-[#170C2B]/90 text-[#FFFFFF]'
                  : 'bg-[#FFFFFF] text-[#23153C]'
              }`}
            >
              {slide.mainText}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {slide.cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border-2 border-[#D4AF37] flex flex-col justify-between space-y-3 ${
                    isPurpleSlide
                      ? 'bg-[#2A174B]/90 text-[#FFFFFF]'
                      : 'bg-[#FFFFFF] text-[#23153C]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                          isPurpleSlide
                            ? 'bg-[#170C2B] text-[#F9E8A2] border-[#D4AF37]'
                            : 'bg-[#23153C] text-[#F9E8A2] border-[#D4AF37]'
                        }`}
                      >
                        {card.tag}
                      </span>
                      <Scale className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    </div>
                    <h3
                      className={`text-base font-extrabold leading-snug ${
                        isPurpleSlide ? 'text-[#FFF3C4]' : 'text-[#23153C]'
                      }`}
                    >
                      {card.title}
                    </h3>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed ${
                        isPurpleSlide ? 'text-[#F3EFE6]' : 'text-[#2C223E]'
                      }`}
                    >
                      {card.body}
                    </p>
                  </div>

                  {card.docRef && (
                    <div
                      className={`pt-2.5 border-t text-xs font-bold flex items-center justify-between ${
                        isPurpleSlide
                          ? 'border-[#D4AF37]/30 text-[#F9E8A2]'
                          : 'border-[#EAE4D3] text-[#8A6D2F]'
                      }`}
                    >
                      <span>المرجع التوثيقي:</span>
                      <span className="font-mono">{card.docRef}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className={`p-4 sm:p-5 rounded-2xl border-2 border-[#D4AF37] flex items-center gap-3 ${
                isPurpleSlide
                  ? 'bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/15 to-[#D4AF37]/20 text-[#FFF3C4]'
                  : 'bg-[#23153C] text-[#FFF3C4]'
              }`}
            >
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
              <p className="text-xs sm:text-sm font-extrabold leading-relaxed">
                {slide.goldenCallout}
              </p>
            </div>
          </div>

          <div
            className={`pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold ${
              isPurpleSlide
                ? 'border-[#D4AF37]/40 text-[#E5DEC9]'
                : 'border-[#DEC98A] text-[#23153C]'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>منازعات تصدير الأعلاف — حق المستثمر الوطني في مواجهة التعطيل (بركات)</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[#D4AF37] font-extrabold">
                الشريحة {slide.slideNumber} من 22
              </span>
              <span>·</span>
              <span>صلالة 2026</span>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* =====================================================================
          1. MASTER INTERACTIVE PRESENTATION HEADER & SEQUENTIAL AUDIO BAR
      ===================================================================== */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-[#EAE4D3] pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8A6D2F]">
              <span>العرض التفاعلي والتقرير المقروء</span>
              <span aria-hidden="true">·</span>
              <span>شرائح تمشي عمودياً</span>
              <span aria-hidden="true">·</span>
              <span>استماع فوري ومتسلسل</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#23153C] royal-heading leading-snug">
              منازعات تصدير الأعلاف:{' '}
              <span className="text-[#8A6D2F] underline decoration-[#DEC98A] underline-offset-8">
                حق المستثمر الوطني في مواجهة التعطيل
              </span>
            </h1>

            <p className="text-sm sm:text-base font-bold text-[#4A3B63]">
              وثيقة توثيقية قانونية مرفوعة إلى وزارة التجارة والصناعة وترويج الاستثمار (مركز حماية المنافسة ومنع الاحتكار — الفاضل / خالد المسروري المحترم)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
            <button
              onClick={handlePlayAllSlidesSequentially}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 border cursor-pointer transition-colors ${
                isSeqPlaying
                  ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                  : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#311E54]'
              }`}
            >
              {isSeqPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>إيقاف القراءة المتسلسلة</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-[#D4AF37]" />
                  <span>تشغيل كل الشرائح وراء بعض</span>
                </>
              )}
            </button>

            <button
              onClick={() =>
                handleToggleAudio(
                  'منازعات تصدير الأعلاف، حق المستثمر الوطني في مواجهة التعطيل. وثيقة توثيقية قانونية. نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.',
                  'hero-mandatory-statement-audio',
                  'منازعات تصدير الأعلاف — النص الإلزامي'
                )
              }
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer transition-colors ${
                activeAudioId === 'hero-mandatory-statement-audio'
                  ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                  : 'bg-[#FAF9F6] text-[#23153C] border-[#D4AF37] hover:bg-[#F5EFE0]'
              }`}
            >
              {activeAudioId === 'hero-mandatory-statement-audio' ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>إيقاف الصوت</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#8A6D2F]" />
                  <span>استماع فوري للنص الإلزامي</span>
                </>
              )}
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'all' ? 'single' : 'all')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] text-[#23153C] border border-[#D4AF37] hover:bg-[#F5EFE0] text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              {viewMode === 'all' ? (
                <>
                  <BookOpen className="w-4 h-4 text-[#8A6D2F]" />
                  <span>عرض شريحة منفردة</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-4 h-4 text-[#8A6D2F]" />
                  <span>شرائح تمشي عمودياً (الوضع الافتراضي)</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl bg-[#FFFFFF] text-[#23153C] border border-[#DEC98A] hover:bg-[#FAF9F6] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#8A6D2F]" />
              <span>طباعة A4</span>
            </button>
          </div>
        </div>

        {/* MANDATORY STATEMENT BANNER */}
        <div
          id="hero-mandatory-statement-audio"
          className="p-5 sm:p-6 rounded-2xl bg-[#23153C] text-[#FFF3C4] border-2 border-[#D4AF37] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
        >
          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-7 h-7 text-[#D4AF37] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-xs font-bold text-[#D4AF37]">
                نص إلزامي — المرتكز السيادي للوثيقة التوثيقية القانونية
              </div>
              <p className="text-base sm:text-lg font-extrabold leading-relaxed text-[#FFFFFF]">
                «نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.»
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handleToggleAudio(
                'نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.',
                'mandatory-banner-listen',
                'المرتكز السيادي للوثيقة'
              )
            }
            className="px-4 py-2 rounded-xl bg-[#2E1B4F] hover:bg-[#3B2363] text-[#F9E8A2] border border-[#D4AF37] text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer no-print"
          >
            {activeAudioId === 'mandatory-banner-listen' ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                <span>إيقاف الصوت</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                <span>استماع فوري</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* =====================================================================
          2. INTERACTIVE VERTICAL SLIDES: THE 3 CORE PILLARS + 6 DECISIVE QUESTIONS
      ===================================================================== */}
      <div className="space-y-8">
        {INTERACTIVE_VERTICAL_PILLARS.map((pillar, idx) => {
          const audioKey = `vertical-pillar-${pillar.id}`;
          const fullNarration = `${pillar.title}. ${pillar.subtitle}. ${pillar.mainText} ${pillar.responseText} ${pillar.confirmationBanner}`;
          const isPlayingThis = activeAudioId === audioKey;

          return (
            <section
              key={pillar.id}
              id={audioKey}
              className="w-full max-w-[840px] mx-auto rounded-[28px] p-3 sm:p-4 border-2 border-[#D4AF37] shadow-lg bg-gradient-to-b from-[#FFFFFF] via-[#FAF9F6] to-[#F5EFE0] text-[#23153C]"
            >
              <div className="w-full rounded-[22px] border border-[#D4AF37]/80 p-6 sm:p-9 bg-[#FFFFFF] space-y-6 relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#DEC98A]">
                  <div className="flex items-center gap-3">
                    <SovereignEmblem size={52} className="border-2 border-[#D4AF37]" />
                    <div>
                      <div className="text-xs font-bold text-[#8A6D2F]">{pillar.badge}</div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#23153C] royal-heading mt-0.5">
                        {pillar.title}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 no-print">
                    <button
                      onClick={() => handleToggleAudio(fullNarration, audioKey, pillar.title)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                          : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#311E54]'
                      }`}
                    >
                      {isPlayingThis && isLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>تحضير...</span>
                        </>
                      ) : isPlayingThis ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>إيقاف الصوت</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>استماع فوري للمحور</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#7A5C12] bg-[#FAF9F6] px-4 py-2.5 rounded-xl border border-[#E6DEC8]">
                  <span>{pillar.subtitle}</span>
                  <span className="text-[#23153C]">{pillar.dateTag}</span>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF9F6] border-2 border-[#D4AF37] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#8A6D2F] flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4" />
                      <span>النص التوثيقي المعتمد:</span>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleAudio(pillar.mainText, `${audioKey}-main`, pillar.title)
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#FFFFFF] border border-[#DEC98A] text-xs font-bold text-[#23153C] flex items-center gap-1 cursor-pointer no-print"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                      <span>استماع</span>
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-[#23153C] leading-loose text-justify">
                    {pillar.mainText}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border-2 border-[#DEC98A] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-[#23153C] flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-[#8A6D2F]" />
                      <span>{pillar.responseLabel}:</span>
                    </div>
                    <button
                      onClick={() =>
                        handleToggleAudio(pillar.responseText, `${audioKey}-resp`, pillar.responseLabel)
                      }
                      className="px-2.5 py-1 rounded-lg bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#23153C] flex items-center gap-1 cursor-pointer no-print"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                      <span>استماع</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-[#33302C] leading-relaxed text-justify">
                    {pillar.responseText}
                  </p>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-[#23153C] text-[#FFF3C4] border-2 border-[#D4AF37] flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37] shrink-0" />
                  <p className="text-xs sm:text-sm font-extrabold leading-relaxed">
                    {pillar.confirmationBanner}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE4D3] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#6B655C]">
                  <span>السند المستندي: {pillar.docRef}</span>
                  <span className="text-[#8A6D2F]">شريحة تفاعلية عمودية {idx + 1} · صلالة 2026</span>
                </div>
              </div>
            </section>
          );
        })}

        {/* DECISIVE QUESTIONS VERTICAL SLIDE */}
        <section className="w-full max-w-[840px] mx-auto rounded-[28px] p-3 sm:p-4 border-2 border-[#D4AF37] shadow-xl bg-gradient-to-b from-[#1E1136] via-[#261642] to-[#170C2B] text-[#FFFFFF]">
          <div className="w-full rounded-[22px] border border-[#D4AF37]/80 p-6 sm:p-9 bg-[#211339]/95 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D4AF37]/40">
              <div className="flex items-center gap-3">
                <SovereignEmblem size={54} className="border-2 border-[#D4AF37]" />
                <div>
                  <div className="text-xs font-bold text-[#F9E8A2]">
                    المحور الرقابي الحاسم · دائرة حماية المنافسة ومنع الاحتكار
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#FFF3C4] royal-heading mt-0.5">
                    الأسئلة الحاسمة التي يجب توجيهها للوزارة (6 أسئلة رقابية)
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={() => {
                    const allQText = SIX_DECISIVE_QUESTIONS.map(
                      (q) => `${q.title}. ${q.questionText}`
                    ).join(' ');
                    handleToggleAudio(
                      allQText,
                      'all-six-decisive-questions',
                      'الأسئلة الحاسمة التي يجب توجيهها للوزارة'
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                    activeAudioId === 'all-six-decisive-questions'
                      ? 'bg-[#D4AF37] text-[#23153C] border-[#FFF3C4]'
                      : 'bg-[#2E1B4F] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#3B2363]'
                  }`}
                >
                  {activeAudioId === 'all-six-decisive-questions' ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>إيقاف الصوت</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>استماع للأسئلة الستة كاملة</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {SIX_DECISIVE_QUESTIONS.map((q) => {
                const qKey = `decisive-q-${q.number}`;
                const isPlayingQ = activeAudioId === qKey;

                return (
                  <div
                    key={q.number}
                    id={qKey}
                    className="p-5 rounded-2xl bg-[#170C2B]/90 border-2 border-[#D4AF37] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#D4AF37] text-[#23153C] font-extrabold text-xs flex items-center justify-center shrink-0">
                          {q.number}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold text-[#FFF3C4]">
                          {q.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 no-print">
                        <button
                          onClick={() =>
                            handleToggleAudio(`${q.title}. ${q.questionText}`, qKey, q.title)
                          }
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                            isPlayingQ
                              ? 'bg-[#D4AF37] text-[#23153C] border-[#FFF3C4]'
                              : 'bg-[#2E1B4F] text-[#FFF3C4] border-[#D4AF37]'
                          }`}
                        >
                          {isPlayingQ ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>إيقاف</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>استماع فوري</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#F3EFE6] leading-loose text-justify">
                      {q.questionText}
                    </p>

                    <div className="pt-2.5 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2 text-xs text-[#F9E8A2]">
                      <span>القرينة الموثقة: {q.evidenceAnchor}</span>
                      <span className="text-[#D4AF37] font-bold">{q.legalBasis}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          3. THE 22 LUXURY A4 PORTRAIT SLIDES (WALKING VERTICALLY BY DEFAULT)
      ===================================================================== */}
      <div className="rounded-3xl p-5 sm:p-6 bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-xs no-print space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#23153C] royal-heading">
              الشرائح التفصيلية الكاملة (22 شريحة A4 عمودية — Slide 1 to 22)
            </h3>
            <p className="text-xs text-[#524E48]">
              {viewMode === 'all'
                ? 'وضع العرض العمودي التفاعلي مفعل: جميع الشرائح الـ 22 تمشي عمودياً مع زر سماعة بجانب كل شريحة.'
                : `وضع الشريحة المنفردة: الشريحة ${currentSlide.slideNumber} من 22`}
            </p>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
            {TWENTY_TWO_SLIDES_DATA.map((s, idx) => {
              const isSelected = idx === activeSlideIndex;
              const isPlayingThis = activeAudioId === `royal-slide-22-${s.slideNumber}`;
              return (
                <button
                  key={s.slideNumber}
                  onClick={() => {
                    setActiveSlideIndex(idx);
                    if (viewMode === 'all') {
                      const el = document.getElementById(`slide-a4-${s.slideNumber}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-all border flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                      : 'bg-[#FAF9F6] text-[#23153C] border-[#DEC98A] hover:bg-[#F5EFE0]'
                  }`}
                  title={`انتقال إلى الشريحة ${s.slideNumber}: ${s.title}`}
                >
                  <span>{s.slideNumber}</span>
                  {isPlayingThis && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {viewMode === 'all' ? (
        <div className="space-y-10">
          {TWENTY_TWO_SLIDES_DATA.map((slide) => renderA4PortraitSlide(slide))}
        </div>
      ) : (
        <div className="space-y-4">
          {renderA4PortraitSlide(currentSlide)}

          <div className="max-w-[840px] mx-auto rounded-2xl p-4 bg-[#FFFFFF] border-2 border-[#D4AF37] flex items-center justify-between no-print">
            <button
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev > 0 ? prev - 1 : TWENTY_TWO_SLIDES_DATA.length - 1
                )
              }
              className="px-4 py-2.5 rounded-xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-[#D4AF37]" />
              <span>الشريحة السابقة</span>
            </button>

            <div className="text-xs sm:text-sm text-[#23153C] font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D2F]" />
              <span>
                الشريحة {currentSlide.slideNumber} من {TWENTY_TWO_SLIDES_DATA.length}
              </span>
            </div>

            <button
              onClick={() =>
                setActiveSlideIndex((prev) =>
                  prev < TWENTY_TWO_SLIDES_DATA.length - 1 ? prev + 1 : 0
                )
              }
              className="px-4 py-2.5 rounded-xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>الشريحة التالية</span>
              <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoyalFourSlidesView;
