import React, { useState } from 'react';
import {
  Scale,
  ShieldAlert,
  AlertTriangle,
  FileText,
  Volume2,
  CheckCircle2,
  BookOpen,
  Building,
  Gavel,
  Search,
  Layers,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Sparkles,
  Info,
} from 'lucide-react';
import { globalAudioManager } from '../services/audioManager';
import { generateSpeechAudio } from '../services/ttsService';

interface ViolationLawMapping {
  id: number;
  abuseTitle: string;
  abuseDetails: string;
  evidenceRef: string;
  lawName: string;
  articleNumber: string;
  articleExactText: string;
  statutoryConsequence: string;
  legalCategory: 'antitrust' | 'civil' | 'collusion' | 'commercial' | 'food_safety' | 'article11';
  forensicBreakdown?: {
    trapTitle: string;
    trapDetails: string;
    financialAudit: string;
    borderImpact: string;
  };
}

const VIOLATIONS_LAWS: ViolationLawMapping[] = [
  {
    id: 1,
    abuseTitle: 'الامتناع المقنّع عن التوريد بعد قبض 100% نقداً مسبقاً',
    abuseDetails: 'تحصيل مبلغ 18,640.000 ر.ع كاملاً بحساب شركة المطاحن العمانية ببنك مسقط ثم الامتناع عن تسليم شهادات الفحص والتصدير المطابقة لاشتراطات دولة الإمارات الشقيقة.',
    evidenceRef: 'إشعار التحويل البنكي ببنك مسقط — مرفق 1',
    lawName: 'قانون المعاملات المدنية العماني (المرسوم السلطاني 29/2013)',
    articleNumber: 'المادتان (155) و (156)',
    articleExactText: '«يلتزم البائع بتسليم المبيع للمشتري بالحالة التي كان عليها وقت البيع، ويشمل التسليم ملحقات المبيع وكل ما أُعد بصفة دائمة لاستعماله وذلك وفقاً لطبيعة الأشياء وعرف الجهة وقصد المتعاقدين».',
    statutoryConsequence: 'إلزام البائع قانوناً بالتسليم العيني الفوري وجبر كافة الأضرار الناتجة عن حبس المبيع وملحقاته التعاقدية.',
    legalCategory: 'civil',
  },
  {
    id: 2,
    abuseTitle: 'إساءة استغلال الوضع المهيمن واحتكار منافذ بيع الأعلاف',
    abuseDetails: 'استغلال الطاقة الإنتاجية الوحيدة المعتمدة للأعلاف لتقييد تدفق السلع وفرض إملاءات تعسفية لحرمان المستثمر الوطني من حقه في الشراء المباشر.',
    evidenceRef: 'سجلات إنتاج صوامع المطاحن وسجلات حظر التوريد المباشر',
    lawName: 'قانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014)',
    articleNumber: 'المادة (10) — الفقرة (أ)',
    articleExactText: '«يحظر على أي شخص له وضع مهيمن إساءة استغلال هذا الوضع للإخلال بالمنافسة أو الحد منها أو منعها، وبصفة خاصة: الامتناع عن التعامل في السلعة بالبيع أو الشراء مع أي عميل دون مبرر موضوعي».',
    statutoryConsequence: 'توقيع الجزاءات الإدارية الصارمة وفق المادة (15) وفرض غرامات جزائية وإحالة المخالفة للادعاء العام وفق المادة (19).',
    legalCategory: 'antitrust',
  },
  {
    id: 3,
    abuseTitle: 'المادة (11) حظر الاتفاقات الاحتكارية والتواطؤ المحاسبي مع الوسيط وفخ علف البياض',
    abuseDetails: 'كشف التواطؤ المحاسبي بتمرير أجور الشحن بحساب المطاحن ببنك مسقط، ومضاعفة كلفة الشحن من 280 ر.ع إلى 700 ر.ع لصالح الوسيط نوفل. وتكرار تسليم شهادة سلامة علف البياض (Layer 16%) مرتين كفخ إجرائي، رغم نقل 100 ألف كغم (2,000 كيس) خالية تماماً من علف البياض، لإجبار المستثمر على إقرار رسمي كاذب يمنع الشحنة ويُمكّن الوسيط من خطف عميل سويحان (160 ألف دجاجة).',
    evidenceRef: 'شهادة سلامة Layer 16% + إيصال بنك مسقط 691776712 + تحويلات أجور الشحن 700 ر.ع ورسائل الـ 1,800 ر.ع',
    lawName: 'قانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014)',
    articleNumber: 'المادة (11) — حظر الاتفاقات التنافسية',
    articleExactText: '«يحظر إبرام أي اتفاق أو عقد يرمي إلى احتكار استيراد أي سلعة أو منتج أو خدمة أو توزيعها أو ترويجها في السلطنة، كما يحظر على أي شخص أو جهة أن يمنع أو يعيق دخول منتج أو سلعة أو تقييد حرية التجارة، أو إبرام اتفاقات تمييزية أو تقييدية تحد من حرية التعامل التجاري المباشر وتفرض وسائط غير مشروعة لرفع التكلفة وتمرير عوائد غير مبررة أو اقتسام عملاء ومنافذ».',
    statutoryConsequence: 'بطلان كافة الاتفاقات الالتفافية والوساطات الإلزامية بطلاناً مطلقاً لمخالفتها النظام العام، والمساءلة الجنائية والتأديبية عن التواطؤ المحاسبي والتلاعب بوثائق سلامة الغذاء، مع التعويض الكامل عن فوات كسب خط التوريد السنوي (1.87 مليون ر.ع).',
    legalCategory: 'article11',
    forensicBreakdown: {
      trapTitle: 'فخ شهادة سلامة منتج علف البياض (Layer 16% - كبس البيض)',
      trapDetails: 'نقل المستثمر الوطني أكثر من 2,000 كيس زنة 50 كغ (ما يقارب 100,000 كغم / 100 طن)، ولا يوجد كيس واحد منها من علف البياض، فجميعها أعلاف لاحم (Starter & Finisher). تعمد المصنع تسليم إقرار لمنتج Layer مرتين (قبل 3 أشهر وفي سبتمبر 2026) ليُجبر المستثمر على تقديمه لوزارة التغير المناخي والبيئة الإماراتية، ليقر رسمياً بأنه لا يستورد إلا هذا الصنف غير المطابق، مما يؤدي لمصادرة البضاعة جمركياً فور وصولها المنفذ!',
      financialAudit: 'التواطؤ المحاسبي الصارخ: فرض وسيط خارجي ومضاعفة أجور الشحن من 280 ريالاً للشحنة إلى 700 ريال (أكثر من الضعف)، وتحصيل المبالغ وتمريرها بحساب المطاحن ببنك مسقط، ثم محاولة الوسيط بيع العلف للعميل الإماراتي بفارق 5 دراهم زيادة لكل كيس على حساب المستثمر الوطني.',
      borderImpact: 'تعطيل الشاحنات قبل المنفذ بـ 100 كم واحتجازها 57 يوماً، وتصوير الوسيط لمقاطع فيديو داخل حرم المصنع مع موسيقى مستفزة رغم لافتة حظر التصوير الصريحة على البوابة (3 أمتار يسار المدخل)، وتجاهل المكالمات بدعوى "التنويم بالمستشفى" بينما أكد مدير الأمن تواجده بالمكتب!',
    },
  },
  {
    id: 4,
    abuseTitle: 'التواطؤ واقتسام الأسواق ومحاولة فرض وسيط خارجي إجباري',
    abuseDetails: 'إقحام شركة نوفل كوسيط إلزامي في التصدير، وفرض عمولة غير مشروعة قدرها 650 ر.ع على كل شاحنة، واحتجاز الشاحنات 57 يوماً بالمنفذ لإرغام المستثمر على الخضوع.',
    evidenceRef: 'مراسلات الوسيط نوفل وإيصالات التحصيل التابعة للمطاحن',
    lawName: 'قانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014)',
    articleNumber: 'المادتان (8) و (9) — الفقرة (ج)',
    articleExactText: '«تحظر الاتفاقات أو العقود أو الممارسات المدبرة بين الأشخاص المتنافسين أو المتعاملين في السوق المعنية إذا كان موضوعها أو الغرض منها الإخلال بالمنافسة، وبخاصة: اقتسام أسواق المنتجات أو مناطق التوزيع أو مصادر التوريد أو العملاء».',
    statutoryConsequence: 'بطلان كافة الاتفاقات الالتفافية بطلاناً مطلقاً لمخالفتها النظام العام وتطبيق العقوبات الجزائية الرادعة.',
    legalCategory: 'collusion',
  },
  {
    id: 5,
    abuseTitle: 'تسريب البيانات التجارية والائتمانية للعميل لمحاولة خطفه',
    abuseDetails: 'استغلال بيانات التعاقد الصادرة لمزرعة بركة الوقن بسويحان، والتواصل المباشر معهم عبر الوسيط في محاولة سافرة لإقصاء المستثمر العماني بعد بنائه للشراكة.',
    evidenceRef: 'سجلات الاتصالات وإفادة مسؤولي مزرعة بركة الوقن بسويحان',
    lawName: 'قانون التجارة العماني وقانون حماية المنافسة ومنع الاحتكار',
    articleNumber: 'المادة (10) فقرة (د) والمادة (92) تجارة',
    articleExactText: '«حظر إساءة استغلال السيطرة السوقية للتأثير على العملاء أو إفشاء أسرار التعاملات التجارية أو تحويل مسار التعاقد بطرق غير شريفة تخالف أعراف الأمانة التجارية».',
    statutoryConsequence: 'مسؤولية تقصيرية وتعويضية كاملة عن كافة الأرباح الفائتة وعقد التوريد البالغ 1.87 مليون ريال عماني سنوياً.',
    legalCategory: 'commercial',
  },
  {
    id: 6,
    abuseTitle: 'افتعال التناقض المستندي المخبري ومناورة صفر يوم سحب',
    abuseDetails: 'إصدار شهادة فحص مخبري صادرة من مختبر المصنع بقيم متناقضة مع بطاقة العلف، واشتراط فترة سحب مستحيلة علمياً (Zero Days) لإفشال الفسح الجمركي عمداً.',
    evidenceRef: 'شهادة التحليل المخبري الصادرة من المطاحن والبطاقة التعريفية',
    lawName: 'قانون سلامة الغذاء (المرسوم السلطاني 84/2008) وقانون حماية المنافسة',
    articleNumber: 'المادة (10) — الفقرة (ب) ومواصفات سلامة الغذاء',
    articleExactText: '«حظر فرض شروط غير معتادة أو مجحفة في التعامل أو افتعال عقبات فنية أو مستندية لا تتفق مع المعايير القياسية المعتمدة خليجياً لإعاقة حركة البضائع المشروعة».',
    statutoryConsequence: 'المساءلة الفنية والرقابية عن إخراج شهادات غير مطابقة للواقع ومحاولة فرض مواصفات مغلوطة.',
    legalCategory: 'food_safety',
  },
  {
    id: 7,
    abuseTitle: 'عرض علف البياض (Layer Feed) بديلاً قسرياً لعلف اللاحم',
    abuseDetails: 'محاولة إقرار علف بياض كبديل للعلف المتعاقد عليه لمزرعة دواجن لاحم، وهو ما ينطوي على مخاطر بيطرية جسيمة وهلاك محقق للقطيع الحيواني في سويحان.',
    evidenceRef: 'المراسلات الرسمية لعرض علف البياض 16%',
    lawName: 'قانون حماية المستهلك (المرسوم السلطاني 66/2014) وقانون المعاملات',
    articleNumber: 'المادة (19) حماية المستهلك والمادة (160) معاملات',
    articleExactText: '«يحظر تسليم سلعة تختلف في جوهرها وخصائصها ومكوناتها عن السلعة المتعاقد عليها، ويلتزم المزود بتقديم السلعة المطابقة للمواصفات الصحية والبيطرية المعتمدة».',
    statutoryConsequence: 'رد السلعة وإلزام المصنع بتسليم الصنف المطابق والتعويض عن أي تلفيات تلحق بالمشتري.',
    legalCategory: 'food_safety',
  },
  {
    id: 8,
    abuseTitle: 'اختصاص ديوان الوزارة بفرض تدابير تصحيحية عاجلة وجزاءات رادعة',
    abuseDetails: 'انقضاء مهلة الأيام الثلاثة التي منحها المستثمر للمصنع دون أي استجابة، مما استوجب تدخل مركز حماية المنافسة ومنع الاحتكار برئاسة الفاضل خالد المسروري المحترم.',
    evidenceRef: 'محضر الاجتماع المباشر ومذكرة الإيداع BKA/MOCIIP-COMP/2026/10',
    lawName: 'قانون حماية المنافسة ومنع الاحتكار (المرسوم السلطاني 67/2014)',
    articleNumber: 'المادتان (15) و (19)',
    articleExactText: '«للمركز عند ثبوت مخالفة أي من أحكام هذا القانون إلزام المخالف بتعديل أوضاعه وإزالة المخالفة خلال مدة يحددها... ودون الإخلال بأي عقوبة أشد يعاقب بالسجن والغرامة كل من ارتكب أياً من الأفعال المحظورة».',
    statutoryConsequence: 'إصدار قرار وزاري ملزم لشركة المطاحن العمانية، وفرض غرامة يومية عن التأخير، وإحالة الملف للادعاء العام.',
    legalCategory: 'antitrust',
  },
];

export const ViolationsLawsMatrix: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [expandedBreakdownId, setExpandedBreakdownId] = useState<number | null>(3); // Article 11 expanded by default

  const filteredItems = VIOLATIONS_LAWS.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.legalCategory === selectedCategory;
    const matchesSearch =
      item.abuseTitle.includes(filterQuery) ||
      item.abuseDetails.includes(filterQuery) ||
      item.lawName.includes(filterQuery) ||
      item.articleNumber.includes(filterQuery) ||
      item.articleExactText.includes(filterQuery);
    return matchesCat && matchesSearch;
  });

  const handlePlayRowTTS = async (item: ViolationLawMapping) => {
    if (playingId === item.id) {
      globalAudioManager.stopAll();
      setPlayingId(null);
      return;
    }

    globalAudioManager.stopAll();
    setPlayingId(item.id);

    const speechText = `${item.abuseTitle}. التوصيف الواقعي: ${item.abuseDetails}. السند في القانون العماني: ${item.lawName}، ${item.articleNumber}. نص المادة: ${item.articleExactText}. الأثر والجزاء القانوني: ${item.statutoryConsequence}`;

    try {
      const audioUrl = await generateSpeechAudio(
        speechText,
        'Fenrir',
        'Formal Omani judicial prosecutor reciting statutes and violations with clarity'
      );
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.onerror = () => {
        fallbackSpeech(speechText);
      };
      globalAudioManager.playAudio(audio).catch(() => fallbackSpeech(speechText));
    } catch (e) {
      fallbackSpeech(speechText);
    }
  };

  const fallbackSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setPlayingId(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    globalAudioManager.speak(utterance);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Matrix Header Banner */}
      <div className="bg-[#1e1233] rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                جدول الرصد القانوني الفاصل — كل تعسف وأمامه المادة في القانون العماني
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              مطابقة الوقائع الميدانية مع نصوص القانون والمادة (11) بدقة
            </h2>
            <p className="text-xs text-gray-300">
              توثيق صارم للتواطؤ المحاسبي، فخ شهادة علف البياض (Layer 16%)، واحتكار منافذ التصدير مع النصوص القانونية الجزائية.
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-xl bg-[#C59B27]/30 text-amber-200 border border-[#D4AF37] text-xs font-bold font-mono">
            {VIOLATIONS_LAWS.length} وقائع مكيفة قانوناً
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
            {[
              { id: 'all', label: 'كافة المواد' },
              { id: 'article11', label: 'المادة (11) والتواطؤ المحاسبي' },
              { id: 'antitrust', label: 'حماية المنافسة ومنع الاحتكار' },
              { id: 'civil', label: 'المعاملات المدنية' },
              { id: 'collusion', label: 'التواطؤ واقتسام الأسواق' },
              { id: 'commercial', label: 'التجارة والأسرار' },
              { id: 'food_safety', label: 'سلامة الغذاء والمواصفات' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                  selectedCategory === tab.id
                    ? 'bg-[#D4AF37] text-[#23153c] font-black shadow-xs'
                    : 'bg-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="ابحث برقم المادة أو نوع التعسف..."
              className="w-full text-xs pr-9 pl-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 outline-none focus:border-[#D4AF37]"
            />
          </div>
        </div>
      </div>

      {/* Grid of Violations & Laws Cards */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const isPlayingThis = playingId === item.id;
          const isArticle11 = item.legalCategory === 'article11';
          const isExpanded = expandedBreakdownId === item.id;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border-2 transition-all p-6 sm:p-7 shadow-sm text-right space-y-4 ${
                isArticle11
                  ? 'border-[#D4AF37] bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 shadow-md ring-1 ring-[#D4AF37]'
                  : isPlayingThis
                  ? 'border-[#C59B27] ring-2 ring-[#C59B27]/40 shadow-md'
                  : 'border-gray-200 hover:border-[#D4AF37]'
              }`}
            >
              {/* Card Header with Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center ${
                      isArticle11 ? 'bg-[#D4AF37] text-[#23153c]' : 'bg-[#23153c] text-amber-300'
                    }`}
                  >
                    0{item.id}
                  </span>
                  <h3 className="font-black text-base text-[#23153c]">
                    {item.abuseTitle}
                  </h3>
                  {isArticle11 && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-black bg-amber-200 text-amber-900 border border-amber-300 animate-pulse">
                      شريحة تفاعلية موسعة — فخ الـ 100 ألف كغم
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                    {item.articleNumber}
                  </span>
                  <button
                    onClick={() => handlePlayRowTTS(item)}
                    className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                      isPlayingThis
                        ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                        : 'bg-gray-50 border-gray-300 text-gray-700 hover:border-[#D4AF37] hover:text-[#23153c]'
                    }`}
                    title="استماع صوتي للمادة والتعسف"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isPlayingThis ? 'إيقاف الصوت' : 'استماع صوتي'}</span>
                  </button>
                </div>
              </div>

              {/* Two Column Layout: Abuse Fact on Left / Omani Law on Right */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                {/* Column 1: The Real Abuse Fact */}
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded">
                        التعسف والمخالفة الميدانية والمحاسبية
                      </span>
                    </div>
                    <p className="text-xs text-red-950 font-medium leading-relaxed">
                      {item.abuseDetails}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-red-200/60 text-[11px] text-red-800 font-bold">
                    📎 <strong>السند المستندي:</strong> {item.evidenceRef}
                  </div>
                </div>

                {/* Column 2: The Exact Omani Law & Article */}
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                        القانون العماني ورقم المادة
                      </span>
                      <span className="text-[11px] font-bold text-gray-600">
                        {item.lawName}
                      </span>
                    </div>

                    <blockquote className="p-3 bg-white rounded-xl border-r-4 border-purple-700 text-xs font-semibold text-[#23153c] leading-relaxed shadow-xs">
                      {item.articleExactText}
                    </blockquote>
                  </div>

                  <div className="pt-2 border-t border-purple-200/60 text-[11px] text-purple-950 font-bold">
                    ⚖️ <strong>الجزاء والأثر النظامي:</strong> {item.statutoryConsequence}
                  </div>
                </div>
              </div>

              {/* Forensic Breakdown Toggle for Article 11 */}
              {item.forensicBreakdown && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 space-y-3">
                  <button
                    onClick={() => setExpandedBreakdownId(isExpanded ? null : item.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-amber-100/70 hover:bg-amber-200/80 text-amber-950 text-xs font-black transition flex items-center justify-between border border-amber-300"
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C59B27]" />
                      <span>
                        {isExpanded ? 'إخفاء التفكيك الجنائي لفخ علف البياض والتواطؤ المحاسبي' : 'عرض التفكيك الجنائي المفصل: فخ الـ 100,000 كغم والتواطؤ المحاسبي مع الوسيط'}
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-right animate-in fade-in duration-200 text-xs">
                      <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-black">
                          <AlertOctagon className="w-4 h-4 text-red-600" />
                          <span>{item.forensicBreakdown.trapTitle}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-[11px]">
                          {item.forensicBreakdown.trapDetails}
                        </p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-black">
                          <Building className="w-4 h-4 text-purple-700" />
                          <span>التواطؤ المحاسبي وتمرير أجور الشحن</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-[11px]">
                          {item.forensicBreakdown.financialAudit}
                        </p>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-amber-200 space-y-1.5 shadow-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-black">
                          <Layers className="w-4 h-4 text-emerald-700" />
                          <span>الأثر الجمركي والتصوير داخل الحرم</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-[11px]">
                          {item.forensicBreakdown.borderImpact}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
