import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Scale,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  FileText,
  DollarSign,
  Maximize2,
  Building,
  ArrowUpRight,
  Printer,
  Sparkles,
} from 'lucide-react';
import { globalAudioManager } from '../services/audioManager';
import { generateSpeechAudio } from '../services/ttsService';

interface RoyalFourSlidesViewProps {
  onOpenEvidenceModal?: (docId: string) => void;
  onNavigateToUpload?: () => void;
  onNavigateToLaws?: () => void;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  categoryBadge: string;
  badgeColor: string;
  kpis: { label: string; value: string; note: string }[];
  narrationText: string;
  coreFacts: { title: string; desc: string; iconType: 'fact' | 'law' | 'violation' }[];
  omaniLaw: {
    lawName: string;
    articleNum: string;
    articleText: string;
    legalAdaptation: string;
  };
}

const ROYAL_SLIDES: SlideData[] = [
  {
    id: 1,
    title: 'الملاءة المالية التامة وانتفاء أي مخاطر ائتمانية: سداد نقدي مسبق 100%',
    subtitle: 'إثبات تحويل بنكي فوري لمصنع المطاحن العمانية ش.م.ع.ع بقيمة سنوية تفوق 1.87 مليون ريال عماني',
    categoryBadge: 'الشريحة الأولى: المركز المالي والتعاقدي',
    badgeColor: 'border-emerald-500 bg-emerald-50 text-emerald-800',
    kpis: [
      { label: 'السداد النقدي المسبق', value: '18,640.000 ر.ع', note: 'مسددة بالكامل مقدماً بحساب المصنع ببنك مسقط' },
      { label: 'التعاقد الشهري المستهدف', value: '24,000 كيس/شهر', note: 'توريد مباشر لمزرعة بركة الوقن بسويحان — الإمارات' },
      { label: 'القيمة الاستثمارية السنوية', value: '1,870,000 ر.ع', note: 'تدفقات نقدية ناصعة تدعم التصدير الوطني العماني' },
      { label: 'المخاطر الائتمانية والديون', value: '0% (منعدمة تماماً)', note: 'انتفاء أي حجة للمصنع بشأن التسهيلات أو التأجيل' },
    ],
    narrationText: `الشريحة الأولى: تثبت شركة بن كليلة العامري للتجارة والاستثمار ملاءتها المالية المطلقة. حيث قامت الشركة بسداد نقدي مسبق بنسبة 100% بحساب شركة المطاحن العمانية ببنك مسقط بمبلغ ثمانية عشر ألفاً وستمائة وأربعين ريالاً عمانياً. إن حجم التعاقد المستهدف مع مزرعة بركة الوقن بسويحان بدولة الإمارات يصل إلى أربعة وعشرين ألف كيس شهرياً بقيمة استثمارية سنوية تتجاوز مليوناً وثمانمائة وسبعين ألف ريال عماني، مما يبرهن على انتفاء أي مخاطر ائتمانية. استناداً إلى المادتين 155 و156 من قانون المعاملات المدنية العماني، يلتزم البائع بتسليم المبيع وتوابعه وملحقاته الصالحة للغرض المخصص لها.`,
    coreFacts: [
      {
        title: 'سداد نقدي مسبق 100% بحساب المطاحن ببنك مسقط',
        desc: 'قامت شركة بن كليلة بتحويل كامل قيمة الشحنات مقدماً (18,640.000 ر.ع) دون طلب أي تسهيلات ائتمانية، بما ينفي قطعاً أي عذر تجاري أو مالي للمصنع.',
        iconType: 'fact',
      },
      {
        title: 'شراكة إقليمية استراتيجية مع مزرعة بركة الوقن بسويحان',
        desc: 'تأمين منفذ تصديري مستدام لسوق دولة الإمارات الشقيقة بمعدل 24,000 كيس شهرياً، لدعم الصادرات الوطنية العمانية غير النفطية ورفع كفاءة المنتج المحلي.',
        iconType: 'fact',
      },
      {
        title: 'جاهزية الأسطول الميداني وسيارات النقل العمانية',
        desc: 'تجهيز الشاحنات والمقطورات المخصصة للنقل المباشر من الصوامع إلى المنفذ الحدودي، مع توفير كافة الضمانات اللوجستية دون أي حاجة لوسطاء أو أطراف وافدة.',
        iconType: 'fact',
      },
    ],
    omaniLaw: {
      lawName: 'قانون المعاملات المدنية العماني (المرسوم السلطاني رقم 29/2013)',
      articleNum: 'المادتان (155) و (156)',
      articleText: '«يلتزم البائع بتسليم المبيع للمشتري بالحالة التي كان عليها وقت البيع، ويشمل التسليم ملحقات المبيع وكل ما أُعد بصفة دائمة لاستعماله وذلك وفقاً لطبيعة الأشياء وعرف الجهة وقصد المتعاقدين».',
      legalAdaptation: 'تسليم البضاعة دون شهادات التحليل المخبري والبيطري الصالحة للفسح الجمركي والتصدير يُعد قانوناً امتناعاً عن تسليم ملحقات المبيع الجوهرية، وإخلالاً جسيماً بالتزام عقدي ملزم للمصنع.',
    },
  },
  {
    id: 2,
    title: 'التعسف المصنعي والامتناع المقنّع عن التوريد وافتعال التناقض المستندي',
    subtitle: 'إصدار شهادات مخبرية متضاربة وإقرار علف البياض كبديل واشتراط صفر يوم سحب مستحيل علمياً',
    categoryBadge: 'الشريحة الثانية: الامتناع المقنع وإساءة الوضع المهيمن',
    badgeColor: 'border-red-500 bg-red-50 text-red-800',
    kpis: [
      { label: 'فترة التعطيل المتعمد بالمنفذ', value: '57 يوماً', note: 'احتجاز الشاحنات بسبب تعارض شهادة الفحص الصادرة من المصنع' },
      { label: 'شرط فترة السحب المفتعل', value: '0 يوم (Zero Days)', note: 'شرط غير علمي لا يستقيم بيطرياً لإعاقة الفسح الجمركي' },
      { label: 'علف البياض البديل', value: 'Layer Feed 16%', note: 'محاولة إقرار علف مختلف فنياً للتهرب من مواصفات اللاحم' },
      { label: 'موقف إدارة المصنع', value: 'تجاهل مهلة الأيام الـ 3', note: 'انقضاء مهلة الاجتماع الأخير دون أي تصحيح للشهادات' },
    ],
    narrationText: `الشريحة الثانية: الامتناع المقنع عن التوريد وافتعال التناقض المستندي. ادعت شركة المطاحن العمانية أنها لم ترفض البيع، إلا أن الوقائع تثبت تعمداً مصنعياً لإفشال الصفقة من خلال إصدار شهادة تحليل مخبري معيبة تتعارض مع بطاقة العلف، وافتعال شرط صفر يوم سحب وهو شرط مستحيل بيطرياً في أعلاف الدواجن بهدف تعطيل الشحنة في المنفذ الحدودي، فضلاً عن محاولة إقرار علف البياض كبديل غير مطابق. هذا السلوك يمثل إساءة استغلال للوضع المهيمن وامتناعاً مقنعاً عن التعامل مجرماً بنص المادة العاشرة من قانون حماية المنافسة ومنع الاحتكار بسلطنة عمان.`,
    coreFacts: [
      {
        title: 'تناقض شهادة التحليل المخبري مع بطاقة العلف المعتمدة',
        desc: 'أصدر المصنع شهادات تحليل رسمية تحوي قيماً متناقضة مع الملصق المعتمد، مما أدى إلى رفض السلطات الجمركية والبيطرية فسح الإرسالية.',
        iconType: 'violation',
      },
      {
        title: 'مناورة «صفر يوم سحب» غير المطابقة لبروتوكولات التغذية',
        desc: 'إدراج بند (Withdrawal Period: 0 Days) المستحيل علمياً، كوسيلة تعجيزية متعمدة لإيقاف الشحنة على الحدود وإجبار المستثمر على التراجع.',
        iconType: 'violation',
      },
      {
        title: 'محاولة تصريف وإقرار علف البياض (Layer Feed) بدلاً من اللاحم',
        desc: 'عرض استبدال العلف المتعاقد عليه بعلف بياض يختلف كلياً في نسب البروتين والكالسيوم، مما يهدد صحة الدواجن في مزرعة سويحان بالهلاك.',
        iconType: 'violation',
      },
    ],
    omaniLaw: {
      lawName: 'قانون حماية المنافسة ومنع الاحتكار العماني (المرسوم السلطاني رقم 67/2014)',
      articleNum: 'المادة (10) — الفقرتان (أ) و (ب)',
      articleText: '«يحظر على أي شخص له وضع مهيمن إساءة استغلال هذا الوضع للإخلال بالمنافسة أو الحد منها أو منعها، وبصفة خاصة: أ) بيع السلعة بأقل من تكلفتها أو الامتناع عن التعامل في السلعة بالبيع أو الشراء مع أي عميل دون مبرر موضوعي. ب) فرض شروط مجحفة في التعامل أو تقييد الإنتاج أو التوزيع والتوريد».',
      legalAdaptation: 'افتعال وثائق معيبة وشرط سحب مستحيل هو تكييف مباشر لـ «الامتناع المقنّع عن التعامل» (Constructive Refusal to Deal) الذي يعاقب عليه القانون الرقابي العماني.',
    },
  },
  {
    id: 3,
    title: 'شبهة التواطؤ واقتسام الأسواق وتمرير المسار لوسيط خارجي (شركة نوفل)',
    subtitle: 'فرض عمولة إجبارية بقيمة 650 ر.ع لكل شاحنة ومحاولة الالتفاف للاستحواذ على العميل الإماراتي',
    categoryBadge: 'الشريحة الثالثة: التواطؤ واقتسام الأسواق والمنافذ',
    badgeColor: 'border-amber-600 bg-amber-50 text-amber-900',
    kpis: [
      { label: 'العمولة المفروضة قسراً للوسيط', value: '+650.000 ر.ع', note: 'إتاوة إضافية عن كل حمولة مقطورة دون أي سند تعاقدي' },
      { label: 'الهدر اللوجستي المالي', value: '52.36%', note: 'ارتفاع مصطنع في تكلفة التوريد لإخراج المستثمر الوطني' },
      { label: 'تسريب بيانات العميل', value: 'مزرعة سويحان', note: 'محاولة التواصل المباشر مع عميل المستثمر للاستحواذ عليه' },
      { label: 'الضرر بالسوق العماني', value: 'إغلاق مستودع صلالة', note: 'امتداد لممارسات الإغراق التي أدت لإغلاق المنشأة في مايو 2026' },
    ],
    narrationText: `الشريحة الثالثة: شبهة التواطؤ واقتسام الأسواق وتمرير المسار لوسيط خارجي. تكشف القرائن المستندية تداخلاً محاسبياً ولوجستياً غير مشروع؛ حيث حاولت شركة المطاحن إرغام شركة بن كليلة على التعامل عبر وسيط خارجي يدعى نوفل، مع فرض عمولة إجبارية قدرها ستمائة وخمسون ريالاً عمانياً لكل شاحنة يتم تحصيلها وتمريرها. كما تم تسريب بيانات العميل الإماراتي لمحاولة الاستحواذ عليه وإقصاء المستثمر العماني. هذه الممارسات محظورة جملة وتفصيلاً بنص المادتين الثامنة والتاسعة من قانون حماية المنافسة ومنع الاحتكار كجرائم تواطؤ واحتكار منافذ.`,
    coreFacts: [
      {
        title: 'فرض الوساطة الإلزامية وهدر 650 ر.ع لكل مقطورة',
        desc: 'تحويل مسار التوريد الطبيعي المباشر إلى وسيط خارجي محدد لفرض هوامش ربحية وتكاليف نقل مصطنعة ترهق كاهل المستثمر الوطني.',
        iconType: 'violation',
      },
      {
        title: 'تسريب البيانات التجارية للمشتري لمحاولة الاستحواذ على العميل',
        desc: 'استغلال بيانات التعاقد الخاصة بمزرعة بركة الوقن بسويحان والتواصل معهم عبر الوسيط في مسعى واضح لسلب المستثمر العماني قاعدته الاستثمارية.',
        iconType: 'violation',
      },
      {
        title: 'استكمال سلسلة التضييق التي بدأت في صلالة في مايو 2026',
        desc: 'نفس النهج الإقصائي الذي مارسته أطراف وافدة في ظفار وأدى إلى إغلاق مستودع صلالة، يتكرر الآن عبر تعطيل مسار التصدير إلى دولة الإمارات.',
        iconType: 'fact',
      },
    ],
    omaniLaw: {
      lawName: 'قانون حماية المنافسة ومنع الاحتكار العماني (المرسوم السلطاني رقم 67/2014)',
      articleNum: 'المادتان (8) و (9) — الفقرة (ج)',
      articleText: '«تحظر الاتفاقات أو العقود أو الممارسات المدبرة بين الأشخاص المتنافسين أو المتعاملين في السوق المعنية إذا كان موضوعها أو الغرض منها الإخلال بالمنافسة، وبخاصة: اقتسام أسواق المنتجات أو مناطق التوزيع أو مصادر التوريد أو العملاء».',
      legalAdaptation: 'الاتفاق على قصر التصدير عبر وسيط خارجي معين وتمرير الشحنات باسمه يمثل تواطؤاً واقتساماً لمنافذ التصدير والعملاء مخالفاً للنظام العام الاقتصادي.',
    },
  },
  {
    id: 4,
    title: 'الطلبات الرقابية والسيادية الحاسمة الموجهة لديوان الوزارة',
    subtitle: 'إلى الفاضل / خالد المسروري المحترم — مدير عام مركز حماية المنافسة ومنع الاحتكار',
    categoryBadge: 'الشريحة الرابعة: الطلبات الرقابية والقرارات العاجلة',
    badgeColor: 'border-purple-600 bg-purple-50 text-purple-950',
    kpis: [
      { label: 'المرجع الرقابي للمذكرة', value: 'BKA/MOCIIP-COMP/2026/10', note: 'إيداع رسمي عاجل مشفوع بكافة القرائن والمستندات' },
      { label: 'الجهة المخاطبة', value: 'خالد المسروري المحترم', note: 'مدير عام مركز حماية المنافسة ومنع الاحتكار' },
      { label: 'السند الجزائي المقترح', value: 'المادتان (15) و (19)', note: 'إلزام بتصحيح المخالفة وغرامات ردعية وإحالة قضائية' },
      { label: 'المطلب الفوري', value: 'إلزام المطاحن بالتسليم', note: 'إصدار شهادات بيطرية مطابقة فوراً واستئناف التوريد' },
    ],
    narrationText: `الشريحة الرابعة: الطلبات الرقابية والسيادية المرفوعة للفاضل خالد المسروري المحترم، مدير عام مركز حماية المنافسة ومنع الاحتكار بوزارة التجارة والصناعة وترويج الاستثمار. نطالب بإصدار قرار رقابي عاجل يلزم شركة المطاحن العمانية ش.م.ع.ع بتسليم كامل ملحقات المبيع القانونية والشهادات البيطرية والتحليلية المعتمدة فوراً دون قيد أو وسيط، مع إعمال أحكام المادة الخامسة عشرة لإلزامها بتصحيح أوضاعها، وفتح تحقيق رسمي في ممارسات الامتناع المقنع والتواطؤ مع الوسيط وإحالة المخالفة للجهات القضائية المختصة وفقاً للمادتين السابعة عشرة والتاسعة عشرة لحماية المستثمر الوطني.`,
    coreFacts: [
      {
        title: 'أولاً: الإلزام الفوري للمصنع بإصدار الوثائق والشهادات السليمة',
        desc: 'إصدار شهادات فحص وتحليل بيطرية مطابقة لاشتراطات دولة الإمارات الشقيقة فوراً دون أي إعاقة أو شروط تعجيزية، مع سداد الكاش المباشر.',
        iconType: 'fact',
      },
      {
        title: 'ثانياً: التحقيق الرقابي في شبهة التواطؤ واقتسام السوق مع الوسيط نوفل',
        desc: 'فحص السجلات المحاسبية والتحويلات المالية بين شركة المطاحن والوسيط نوفل للوقوف على أسباب فرض عمولة 650 ر.ع وإقصاء التعامل المباشر.',
        iconType: 'violation',
      },
      {
        title: 'ثالثاً: تطبيق الجزاءات المنصوص عليها في المادتين (15) و (19)',
        desc: 'اتخاذ التدابير الإدارية بوقف الممارسات الاحتكارية وتوقيع الجزاءات المقررة وإحالة الأوراق للادعاء العام في حال عدم الامتثال.',
        iconType: 'law',
      },
      {
        title: 'رابعاً: رد الاعتبار والتعويض عن أضرار تعطيل الشاحنات والسمعة الاستثمارية',
        desc: 'جبر الأضرار المالية الجسيمة الناتجة عن احتجاز المقطورات 57 يوماً بالمنفذ وحماية عقد التصدير الموقع مع مزرعة بركة الوقن بسويحان.',
        iconType: 'fact',
      },
    ],
    omaniLaw: {
      lawName: 'قانون حماية المنافسة ومنع الاحتكار العماني (المرسوم السلطاني رقم 67/2014)',
      articleNum: 'المادتان (15) و (19)',
      articleText: '«للمركز عند ثبوت مخالفة أي من أحكام هذا القانون إلزام المخالف بتعديل أوضاعه وإزالة المخالفة خلال مدة يحددها... ودون الإخلال بأي عقوبة أشد، يُعاقب بالسجن والغرامة كل من ارتكب أياً من الأفعال المحظورة في المادتين (8) و (10)».',
      legalAdaptation: 'اختصاص أصيل لمركز حماية المنافسة ومنع الاحتكار بديوان الوزارة للتدخل الحاسم وردع التعسف التجاري وفرض هيبة القانون.',
    },
  },
];

export const RoyalFourSlidesView: React.FC<RoyalFourSlidesViewProps> = ({
  onOpenEvidenceModal,
  onNavigateToUpload,
  onNavigateToLaws,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const currentSlide = ROYAL_SLIDES[currentSlideIndex];

  const handleStopAudio = () => {
    globalAudioManager.stopAll();
    setIsPlayingAudio(false);
    setIsLoadingAudio(false);
  };

  const handlePlayCurrentSlideAudio = async () => {
    if (isPlayingAudio) {
      handleStopAudio();
      return;
    }

    handleStopAudio();
    setIsLoadingAudio(true);

    try {
      // Use Gemini TTS endpoint
      const audioUrl = await generateSpeechAudio(
        currentSlide.narrationText,
        'Fenrir',
        'Authoritative, judicial narrator in pure formal Arabic with royal pacing and firm legal tone'
      );

      const audio = new Audio(audioUrl);
      audio.onplay = () => {
        setIsPlayingAudio(true);
        setIsLoadingAudio(false);
      };
      audio.onended = () => {
        setIsPlayingAudio(false);
      };
      audio.onerror = () => {
        console.warn('Gemini TTS failed, falling back to browser speech synthesis');
        playSpeechSynthesisFallback(currentSlide.narrationText);
      };

      globalAudioManager.playAudio(audio).catch(() => {
        playSpeechSynthesisFallback(currentSlide.narrationText);
      });
    } catch (err) {
      console.warn('TTS API error, falling back to SpeechSynthesis:', err);
      playSpeechSynthesisFallback(currentSlide.narrationText);
    }
  };

  const playSpeechSynthesisFallback = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
      alert('القارئ الصوتي غير مدعوم في هذا المتصفح.');
      return;
    }

    handleStopAudio();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setIsLoadingAudio(false);
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsLoadingAudio(false);
    };

    globalAudioManager.speak(utterance);
  };

  const goToSlide = (idx: number) => {
    handleStopAudio();
    setCurrentSlideIndex(idx);
  };

  const handleNext = () => {
    if (currentSlideIndex < ROYAL_SLIDES.length - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Royal Presentation Header */}
      <div className="bg-[#1e1233] rounded-3xl border-2 border-[#D4AF37] p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        {/* Background Subtle Gradient & Coat */}
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                العرض التقديمي الرقابي الملكي — 4 شرائح موثقة
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C59B27]/30 text-amber-200 border border-[#D4AF37]/50">
                ديوان عام الوزارة | مركز حماية المنافسة
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              الملف الرقابي والتكييف القانوني الفاصل — شركة بن كليلة العامري
            </h2>
            <p className="text-xs text-gray-300">
              إلى الفاضل / <strong className="text-amber-300">خالد المسروري</strong> المحترم — مدير عام مركز حماية المنافسة ومنع الاحتكار
            </p>
          </div>

          {/* Slide Navigation Controls & Audio Narration Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayCurrentSlideAudio}
              disabled={isLoadingAudio}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition shadow-md border ${
                isPlayingAudio
                  ? 'bg-amber-600 border-amber-400 text-white animate-pulse'
                  : 'gold-gradient-bg text-[#23153c] border-[#D4AF37] hover:brightness-105'
              }`}
              title="تشغيل القراءة الصوتية الكاملة للشريحة"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 ml-1.5" />
                  <span>إيقاف الصوت</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 ml-1.5 text-[#23153c]" />
                  <span>{isLoadingAudio ? 'جاري التحضير...' : 'تشغيل صوت الشريحة (TTS)'}</span>
                </>
              )}
            </button>

            {onNavigateToUpload && (
              <button
                onClick={onNavigateToUpload}
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 text-xs font-bold transition"
                title="الرفع المباشر للأدلة من الاستوديو"
              >
                <span>رفع أدلة الاستوديو</span>
              </button>
            )}

            {onNavigateToLaws && (
              <button
                onClick={onNavigateToLaws}
                className="inline-flex items-center px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 text-xs font-bold transition"
                title="جدول المواد القانونية والتعسف"
              >
                <span>جدول القوانين</span>
              </button>
            )}
          </div>
        </div>

        {/* Slide Tabs Navigation (1 to 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-6 mt-4 border-t border-white/10">
          {ROYAL_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`p-3 rounded-2xl text-right transition border flex flex-col justify-between gap-1 text-xs ${
                currentSlideIndex === idx
                  ? 'bg-gradient-to-b from-[#C59B27]/30 to-[#C59B27]/10 border-[#D4AF37] text-white shadow-md ring-1 ring-[#D4AF37]'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#23153c] font-black text-[11px] flex items-center justify-center">
                  {slide.id}
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  {currentSlideIndex === idx ? 'الشريحة الحالية' : `شريحة ${slide.id}`}
                </span>
              </div>
              <p className="font-bold line-clamp-2 leading-snug pt-1 text-[11px]">
                {slide.title}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE SLIDE ROYAL CANVAS */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-10 shadow-lg space-y-8 relative overflow-hidden">
        {/* Subtle Archival Watermark */}
        <div className="absolute left-6 top-6 opacity-5 pointer-events-none w-48 h-48">
          <img
            src="/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg"
            alt="Watermark"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Slide Top Metadata & Category */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${currentSlide.badgeColor}`}>
              {currentSlide.categoryBadge}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              الشريحة {currentSlide.id} من 4
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-2 rounded-xl border border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#23153c] disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="الشريحة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-gray-600 px-2">
              {currentSlideIndex + 1} / {ROYAL_SLIDES.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === ROYAL_SLIDES.length - 1}
              className="p-2 rounded-xl border border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#23153c] disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="الشريحة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-[#23153c] leading-tight">
            {currentSlide.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold leading-relaxed">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Giant KPIs Grid (Strictly Real Numbers — No Mocking) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {currentSlide.kpis.map((kpi, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-amber-50/50 border border-[#D4AF37]/40 flex flex-col justify-between"
            >
              <span className="text-xs text-gray-600 font-bold mb-1">{kpi.label}</span>
              <span className="text-lg sm:text-2xl font-black text-[#23153c] tracking-tight font-num">
                {kpi.value}
              </span>
              <span className="text-[11px] text-amber-900 font-medium mt-1 leading-tight">
                {kpi.note}
              </span>
            </div>
          ))}
        </div>

        {/* Core Factual Evidence Points */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-[#23153c] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#C59B27]" />
            <span>الوقائع والقرائن الرقابية الميدانية الموثقة:</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentSlide.coreFacts.map((fact, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border text-right space-y-2 ${
                  fact.iconType === 'violation'
                    ? 'bg-red-50/60 border-red-200 text-red-950'
                    : fact.iconType === 'law'
                    ? 'bg-purple-50/60 border-purple-200 text-purple-950'
                    : 'bg-gray-50 border-gray-200 text-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-white/80 border border-current">
                    {fact.iconType === 'violation' ? 'قرينة تعسف' : fact.iconType === 'law' ? 'مستند قانوني' : 'واقعة ثابتة'}
                  </span>
                  <span className="text-xs font-mono font-bold text-gray-500">0{idx + 1}</span>
                </div>
                <h4 className="font-black text-xs sm:text-sm leading-snug text-[#23153c]">
                  {fact.title}
                </h4>
                <p className="text-xs leading-relaxed text-gray-700">
                  {fact.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Omani Law Article Dedicated Frame (المادة القانونية بالنص الحرفي) */}
        <div className="rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-r from-amber-50/80 via-white to-amber-50/40 p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/60 pb-2">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-800" />
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider">
                التأصيل في القانون العماني ورقم المادة بدقة
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-[#23153c] text-amber-200 border border-[#D4AF37]">
              {currentSlide.omaniLaw.articleNum}
            </span>
          </div>

          <p className="text-xs font-bold text-gray-700">
            {currentSlide.omaniLaw.lawName}
          </p>

          <blockquote className="p-3.5 bg-white rounded-xl border-r-4 border-[#C59B27] text-xs sm:text-sm font-semibold text-[#23153c] leading-relaxed shadow-xs">
            {currentSlide.omaniLaw.articleText}
          </blockquote>

          <div className="p-3 bg-amber-100/60 rounded-xl text-xs text-amber-950 leading-relaxed">
            <strong>التكييف القانوني وشبهة الانتهاك:</strong> {currentSlide.omaniLaw.legalAdaptation}
          </div>
        </div>

        {/* Bottom Slide Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayCurrentSlideAudio}
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-[#23153c] text-amber-200 hover:bg-[#35215c] border border-[#D4AF37] transition shadow-xs"
            >
              <Volume2 className="w-4 h-4 ml-1.5 text-amber-400" />
              <span>{isPlayingAudio ? 'إيقاف الاستماع' : 'استماع للشريحة كاملة'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3.5 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-[#D4AF37] text-xs font-bold transition"
            >
              <Printer className="w-4 h-4 ml-1.5" />
              <span>طباعة الشريحة</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {currentSlideIndex > 0 && (
              <button
                onClick={handlePrev}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:border-[#D4AF37] text-xs font-bold transition"
              >
                الشريحة السابقة
              </button>
            )}
            {currentSlideIndex < ROYAL_SLIDES.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-xl gold-gradient-bg text-[#23153c] font-black text-xs hover:brightness-105 transition shadow-sm"
              >
                الشريحة التالية (الشريحة {currentSlide.id + 1})
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                اكتمل العرض التقديمي (4 شرائح)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
