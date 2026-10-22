import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Pause,
  Play,
  Square,
  ShieldCheck,
  Scale,
  Clock,
  CheckCircle2,
  Loader2,
  FileCheck2,
  Sparkles,
  UserCheck,
  VolumeX,
  Radio,
  Lock,
  Landmark,
  Award,
  Users,
} from 'lucide-react';
import {
  speakArabicText,
  stopAllAudio,
  subscribeToTTS,
  ambientTone,
  setGlobalPlaybackSpeed,
  getGlobalPlaybackSpeed,
} from '../services/ttsService';

export interface PodcastDialogueSegment {
  index: number;
  id: string;
  speaker: 'investor' | 'counsel';
  speakerShort: string;
  speakerBadge: string;
  speakerName: string;
  speakerRole: string;
  speakerFullTitle: string;
  timestampLabel: string;
  title: string;
  text: string;
  legalArticleBadge: string;
  docRef: string;
}

export const INVESTIGATIVE_PODCAST_10_SEGMENTS: PodcastDialogueSegment[] = [
  {
    index: 1,
    id: 'pod-seg-1',
    speaker: 'investor',
    speakerShort: 'ب.ع',
    speakerBadge: 'بريك',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'المستثمر الوطني المتضرر',
    speakerFullTitle: 'المستثمر بريك العامري (صاحب شركة بن كليلة العامري)',
    timestampLabel: '00:00 - مايو 2026',
    title: 'من إغلاق محل صلالة حفاظاً على النزاهة إلى فتح خط التصدير المباشر للإمارات بالسداد النقدي 100%',
    text: 'بسم الله الرحمن الرحيم.. في العام الماضي، عانيت لمدة سنة كاملة مع أحد المصانع في محافظة ظفار في محاولة لمعالجة ممارسات الإغراق والتمييز التي قادها أطراف وافدون وأضرت بالسوق المحلي بصورة لا تُطاق. وجدت نفسي بين خيارين: إما أن أسلك طرقاً ملتوية لا يرضاها الله ولا تربيت عليها، أو أن أحفظ كرامتي ونزاهتي وأصفي تجارتي. فاخترت إغلاق مستودعاتي ومحلاتي في صلالة، وتوجهت نحو التصدير النظامي المباشر للمنتج الوطني (علامة بركات) إلى دولة الإمارات العربية المتحدة، واضعاً ثقتي الكاملة في السداد النقدي المسبق 100% عبر بنك مسقط بإجمالي 18,640 ريالاً عمانياً.',
    legalArticleBadge: 'تمهيد الوقائع — السداد النقدي المسبق 100% (بنك مسقط: 18,640 ر.ع)',
    docRef: 'BM-686568727 / 689375818 / 691776712',
  },
  {
    index: 2,
    id: 'pod-seg-2',
    speaker: 'counsel',
    speakerShort: 'م.ق',
    speakerBadge: 'مستشار',
    speakerName: 'المستشار الرقابي',
    speakerRole: 'التكييف النظامي للمواد',
    speakerFullTitle: 'المستشار الرقابي (التكييف النظامي لقانون حماية المنافسة ومنع الاحتكار)',
    timestampLabel: '01:15 - التكييف التمهيدي',
    title: 'الأثر القانوني للسداد النقدي الكامل ونجاح الشحنة الأولى خلال 24 ساعة',
    text: 'هذا المنطلق يضع الملف في إطاره القانوني الصحيح أمام مركز حماية المنافسة ومنع الاحتكار؛ فالسداد النقدي المسبق بنسبة 100% بموجب إيصالات بنك مسقط الموثقة يسقط أي ذريعة تتعلق بالملاءة المالية أو الائتمان. والأهم من ذلك أن الشحنة الأولى المكونة من 500 كيس علف بادي عبرت منفذ خطم الشكلة في 1 مايو 2026 بموجب البيان الجمركي رقم 20261501028987 خلال 24 ساعة فقط، مما يثبت قدرة المصنع الفعلية على الإنجاز الفوري متى التزم بالمطابقة المستندية.',
    legalArticleBadge: 'المادة (9) والمادة (10) — مرسوم سلطاني رقم 67/2014 (قانون حماية المنافسة ومنع الاحتكار)',
    docRef: 'البيان الجمركي 20261501028987 — 1 مايو 2026',
  },
  {
    index: 3,
    id: 'pod-seg-3',
    speaker: 'investor',
    speakerShort: 'ب.ع',
    speakerBadge: 'بريك',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'المستثمر الوطني المتضرر',
    speakerFullTitle: 'المستثمر بريك العامري (صاحب شركة بن كليلة العامري)',
    timestampLabel: '02:30 - 7 إلى 19 مايو 2026',
    title: 'واقعة 7 مايو ورسالة 19 مايو الموثقة لحصر قناة التصدير في وسيط محدد',
    text: 'بعد نجاح الشحنة الأولى في 24 ساعة، تفاجأنا في 7 مايو 2026 بالامتناع عن إصدار الفاتورة طوال ساعات الدوام الرسمي من الساعة العاشرة صباحاً، وادعاء مدير التصدير مساءً أنه في المستشفى، بينما أثبت مدير الأمن بالمصنع علي العجمي الساعة الثانية ظهراً تواجده في مكتبه. ثم جاءت القرينة الكتابية القاطعة في 19 مايو 2026 حين أرسل موظف المبيعات رسالة نصية صريحة تقول: تحدثت مع مهند وأفاد بأن أي طلبات لعميل الإمارات ستكون عن طريق نوفل، وهو يرتب مع مهند مباشرة.',
    legalArticleBadge: 'قرينة كتابية قاطعة — فرض قناة وسيطة وتقييد التعامل المباشر',
    docRef: 'رسالة 19 مايو 2026 + الفاتورتان OFM/270 و OFM/271',
  },
  {
    index: 4,
    id: 'pod-seg-4',
    speaker: 'counsel',
    speakerShort: 'م.ق',
    speakerBadge: 'مستشار',
    speakerName: 'المستشار الرقابي',
    speakerRole: 'التكييف النظامي للمواد',
    speakerFullTitle: 'المستشار الرقابي (التكييف النظامي لقانون حماية المنافسة ومنع الاحتكار)',
    timestampLabel: '03:50 - التكييف الرقابي للمادة 10',
    title: 'تكييف حصر التعامل والتمييز وفق المادة (10) من قانون حماية المنافسة ومنع الاحتكار',
    text: 'من الناحية النظامية، إصدار المصنع للفاتورتين الضريبيتين 270 و271 والشهادة البيطرية رقم 829 وشهادتي المنشأ وخطاب 283/2026 يثبت علمه التام بأن الصفقة مخصصة للتصدير إلى دولة الإمارات. وحين تُربط معاملات المستثمر الوطني المسدد نقداً بقناة وسيط خارجي مسجل بمنطقة حرة بموجب رسالة 19 مايو 2026، فإن ذلك يندرج مباشرة تحت محظورات المادة (10) من قانون حماية المنافسة ومنع الاحتكار العماني الصادر بالمرسوم السلطاني رقم 67/2014 التي تحظر التمييز بين المتعاملين أو تعليق البيع على شروط مقيدة للمنافسة.',
    legalArticleBadge: 'المادة (10) من قانون حماية المنافسة ومنع الاحتكار (مرسوم سلطاني 67/2014)',
    docRef: 'الشهادة البيطرية 829 + شهادتا المنشأ 1626906/1626907',
  },
  {
    index: 5,
    id: 'pod-seg-5',
    speaker: 'investor',
    speakerShort: 'ب.ع',
    speakerBadge: 'بريك',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'المستثمر الوطني المتضرر',
    speakerFullTitle: 'المستثمر بريك العامري (صاحب شركة بن كليلة العامري)',
    timestampLabel: '05:10 - يونيو 2026',
    title: 'التناقض الفني الأول: شهادة التحليل (COA) تذكر مضادات الكوكزيديا والملصق يغفلها',
    text: 'في 12 يونيو 2026 قيدنا طلب تسجيل المنتج لدى وزارة التغير المناخي والبيئة بدولة الإمارات برقم RAC-12062026-3382929، وجاءت الملاحظات التنظيمية واضحة بضرورة مطابقة فترة السحب لسبعة أيام كحد أدنى. وفي 23 يونيو 2026 أصدرت دائرة الجودة بالمصنع شهادة التحليل المخبري COA التي تثبت وجود مادة مضادات الكوكزيديا Anticoccidials، بينما الملصق التعريفي يتجاهلها ويكتفي بعبارة برنامج تناوبي. وعند طلب التصحيح، رد مدير التصدير كتابياً: كيف نذكر في بطاقات تعريفية هذا يحتاج طباعة من جديد، زاعماً عدم استخدام المادة!',
    legalArticleBadge: 'تناقض مستندي داخلي — شهادة الجودة COA مقابل إفادة مدير التصدير',
    docRef: 'الطلب RAC-12062026-3382929 + شهادة COA بتاريخ 23 يونيو 2026',
  },
  {
    index: 6,
    id: 'pod-seg-6',
    speaker: 'counsel',
    speakerShort: 'م.ق',
    speakerBadge: 'مستشار',
    speakerName: 'المستشار الرقابي',
    speakerRole: 'التكييف النظامي للمواد',
    speakerFullTitle: 'المستشار الرقابي (التكييف النظامي لقانون حماية المنافسة ومنع الاحتكار)',
    timestampLabel: '06:30 - التكييف القانوني للامتناع المستندي',
    title: 'الإخلال بالالتزام بتسليم ملحقات المبيع المطابقة (المادتان 155 و158 من قانون المعاملات المدنية)',
    text: 'هنا يتجلى التناقض الفني الحاسم؛ فدائرة الجودة والمختبر بالمصنع تثبت في شهادة رسمية مختومة وجود مضادات الكوكزيديا، بينما يمتنع مسؤول التصدير عن تعديل البطاقة التعريفية بحجة تكلفة إعادة الطباعة وينفي وجود المادة أصلاً. وبموجب المادتين (155) و(158) من قانون المعاملات المدنية العماني، يلتزم البائع بتسليم المبيع وملحقاته المستندية الضرورية للانتفاع به، والامتناع عن تسليم البطاقة المطابقة هو امتناع ضمني عن إتمام البيع.',
    legalArticleBadge: 'المادتان (155) و(158) من قانون المعاملات المدنية العماني + القرار الوزاري 209/2020',
    docRef: 'محادثة مكتب الإدارة التنفيذية + إقرار مسؤول التصدير',
  },
  {
    index: 7,
    id: 'pod-seg-7',
    speaker: 'investor',
    speakerShort: 'ب.ع',
    speakerBadge: 'بريك',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'المستثمر الوطني المتضرر',
    speakerFullTitle: 'المستثمر بريك العامري (صاحب شركة بن كليلة العامري)',
    timestampLabel: '07:45 - سبتمبر 2026',
    title: 'التناقض الفني الثاني والثالث: إقرار سلامة لعلف بياض (Layer) لصفقة لاحم (Broiler) وفترة سحب صفر يوم',
    text: 'رغم إرسالنا خطابات رسمية متتالية في 14 و22 سبتمبر 2026 التزاماً بحسن النية، فوجئنا في 28 سبتمبر 2026 بإرسال المصنع إقرار سلامة خاص بعلف الدجاج البياض Layer Feed مؤرخ في مايو 2025، بينما صفقتنا المسددة بالكامل هي لعلف الدجاج اللاحم Broiler Starter & Finisher! كما أصروا في مطلع أكتوبر على فترة سحب صفر يوم في حين أن الاشتراط التنظيمي الصريح هو سبعة أيام، وعندما طرحنا عليهم المسارين النظاميين (سحب 7 أيام مع ذكر المادة، أو سحب 0 يوم مع شهادة خلو مخبرية)، قوبل خطابنا المؤرخ في 7 أكتوبر بالصمت وإلغاء 8 مكالمات موثقة.',
    legalArticleBadge: 'الذرائع الفنية الثلاث التي لم تُصحح — قرار بالامتناع لا خطأ عارض',
    docRef: 'خطابات 14 و22 سبتمبر و7 أكتوبر 2026 + إقرار 28 سبتمبر',
  },
  {
    index: 8,
    id: 'pod-seg-8',
    speaker: 'counsel',
    speakerShort: 'م.ق',
    speakerBadge: 'مستشار',
    speakerName: 'المستشار الرقابي',
    speakerRole: 'التكييف النظامي للمواد',
    speakerFullTitle: 'المستشار الرقابي (التكييف النظامي لقانون حماية المنافسة ومنع الاحتكار)',
    timestampLabel: '09:00 - تفنيد حجة عدم الرفض',
    title: 'القاعدة الرقابية الحاسمة: الرفض ليس كلمة تُقال، الرفض سلوك',
    text: 'هذا التسلسل الممتد من مايو إلى أكتوبر 2026 يهدم حجة المصنع القائلة: نحن لم نرفض البيع. ففي فقه قانون حماية المنافسة، الرفض ليس كلمة تُقال بل هو سلوك عملي؛ وتقديم مستند لعلف بياض لصفقة علف لاحم، والتمسك بفترة سحب صفر يوم خلافاً لاشتراط السبعة أيام، ورفض الخيارين النظاميين، كلها تشكل تعطيلًا زمنياً ممنهجاً دام 5 أشهر و18 يوماً.',
    legalArticleBadge: 'المادة (10) — الامتناع المقنّع والتعطيل الزمني الممنهج (5 أشهر و18 يوماً)',
    docRef: 'مصفوفة المطابقة المستندية — مايو إلى أكتوبر 2026',
  },
  {
    index: 9,
    id: 'pod-seg-9',
    speaker: 'investor',
    speakerShort: 'ب.ع',
    speakerBadge: 'بريك',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'المستثمر الوطني المتضرر',
    speakerFullTitle: 'المستثمر بريك العامري (صاحب شركة بن كليلة العامري)',
    timestampLabel: '10:15 - 16 إلى 19 أكتوبر 2026',
    title: 'المهلة الرسمية أمام دائرة المنافسة: ثلاثة مسؤولين، ثلاث رسائل PDF، ثلاثة أيام من الصمت الرسمي',
    text: 'في 16 أكتوبر 2026 عُقد الاجتماع الرسمي في وزارة التجارة والصناعة وترويج الاستثمار بحضور الفاضل خالد المسروري، ومنحت الدائرة الموقرة المصنع مهلة رسمية مدتها ثلاثة أيام عمل لإنجاز المطابقة المستندية. وفي 18 أكتوبر أرسلنا الخطاب الرسمي رقم BKA/OMF-MOCCAE/2026/10 بصيغة PDF مرفقاً بصورة متطلبات وزارة التغير المناخي والبيئة إلى ثلاثة مسؤولين: فيصل المعشني، وأدهم البلوشي، ومهند الرئيسي. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام عمل كاملة، والنتيجة: صمت رسمي مطبق دون أي رد.',
    legalArticleBadge: 'انقضاء المهلة الرسمية (3 أيام عمل) بصمت مطبق — 16 إلى 19 أكتوبر 2026',
    docRef: 'خطاب BKA/OMF-MOCCAE/2026/10 — ثلاثة مسؤولين · ثلاث رسائل · ثلاثة أيام',
  },
  {
    index: 10,
    id: 'pod-seg-10',
    speaker: 'counsel',
    speakerShort: 'م.ق',
    speakerBadge: 'مستشار',
    speakerName: 'المستشار الرقابي',
    speakerRole: 'التكييف النظامي للمواد',
    speakerFullTitle: 'المستشار الرقابي (التكييف النظامي لقانون حماية المنافسة ومنع الاحتكار)',
    timestampLabel: '11:30 - الخاتمة والقرار الرقابي',
    title: 'الخاتمة الرقابية: الصمت أمام مهلة الوزارة الرسمية هو رفض فعلي — والهدف الحصري هو المطابقة المستندية (صلالة 2026)',
    text: 'إن انقضاء المهلة الرسمية الممنوحة من دائرة حماية المنافسة ومنع الاحتكار لمدة ثلاثة أيام عمل دون تصحيح الذرائع الثلاث يحول تلك الذرائع من خطأ فني إلى قرار إداري بالامتناع. نحن أمام ملف نقي تماماً: كامل التعاملات مسددة 100% نقداً مقدماً، ولا توجد أي مطالبات مالية أو تعويضات، بل مطلب نظامي واحد هو إلزام المصنع بالمطابقة المستندية وإعادة المياه إلى مجاريها وفق القانون العماني. الرمز الذي يختصر الملف: صلالة 2026.',
    legalArticleBadge: 'الخلاصة الرقابية النهائية — المطابقة المستندية الحصرية · صلالة 2026',
    docRef: 'مذكرة 19 أكتوبر 2026 — الفاضل / خالد المسروري المحترم',
  },
];

export interface DiplomaticSegment {
  id: string;
  numberLabel: string;
  title: string;
  subtitle: string;
  text: string;
  keyFactBadge: string;
  dateReference: string;
  legalPrinciple: string;
}

export const DIPLOMATIC_MONOLOGUE_SEGMENTS: DiplomaticSegment[] = [
  {
    id: 'seg-1-opening',
    numberLabel: 'المقطع 1',
    title: 'الافتتاح الهادئ',
    subtitle: 'وضع الوقائع بين يدي دائرة المنافسة والاحتكار',
    text: 'الأستاذ خالد المسروري المحترم، دائرة المنافسة والاحتكار، السلام عليكم. لا أتيتُ بشكوى، ولا أطلب تعويضاً. أضع بين أيديكم وقائع، والحكم لكم.',
    keyFactBadge: 'لا أتيتُ بشكوى، ولا أطلب تعويضاً — أضع بين أيديكم وقائع، والحكم لكم',
    dateReference: 'دائرة المنافسة والاحتكار',
    legalPrinciple: 'إيداع الوقائع الموثقة أمام الجهة الرقابية المختصة',
  },
  {
    id: 'seg-2-refusal-rule',
    numberLabel: 'المقطع 2',
    title: 'قاعدة الرفض',
    subtitle: 'الرفض ليس كلمة تُقال، الرفض سلوك',
    text: 'الطرف الآخر يقول: نحن لم نرفض البيع. وأقول بهدوء: الرفض ليس كلمة تُقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض.',
    keyFactBadge: 'من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض',
    dateReference: 'نفي حجة «نحن لم نرفض البيع» بالأدلة السلوكية',
    legalPrinciple: 'إثبات الامتناع الفعلي عن البيع بالسلوك وترك المهلة تنتهي',
  },
  {
    id: 'seg-3-official-deadline',
    numberLabel: 'المقطع 3',
    title: 'المهلة الرسمية',
    subtitle: 'ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام',
    text: 'الوزارة منحت مهلة رسمية ثلاثة أيام عمل. وأنا ومعي فيصل المعشني وأدهم البروشي ومهند الرئيسي، أرسلنا لكل واحد منهم رسالة PDF بقائمة المستندات، ومرفقاً بها صورة من وزارة التغير المناخي والبيئة. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي.',
    keyFactBadge: 'فيصل المعشني · أدهم البروشي · مهند الرئيسي — 3 رسائل PDF ومرفق وزارة التغير المناخي والبيئة',
    dateReference: 'مهلة رسمية: ثلاثة أيام عمل',
    legalPrinciple: 'الصمت الرسمي ثلاثة أيام أمام مهلة رسمية هو رفض فعلي',
  },
  {
    id: 'seg-4-technical-pretexts',
    numberLabel: 'المقطع 4',
    title: 'الأسباب التعسفية',
    subtitle: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ',
    text: 'شهادة تحليل تذكر مادة مضادات الكوكزيديا، والملصق يتجاهلها ويكتفي بعبارة برنامج تناوبي. وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم. وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام. هذه ذرائع لم تُصحَّح. والذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ.',
    keyFactBadge: 'مضادات الكوكزيديا (برنامج تناوبي) · إقرار لاير لصفقة لاحم · فترة سحب صفر يوم والاشتراط 7 أيام',
    dateReference: 'ذرائع فنية لم تُصحَّح أمام مهلة رسمية',
    legalPrinciple: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية هي قرار لا خطأ',
  },
  {
    id: 'seg-5-investor-human',
    numberLabel: 'المقطع 5',
    title: 'تصحيح الصورة (المستثمر ليس معصوماً)',
    subtitle: 'المحاسبة بإجراء مكتوب مقابل إغلاق الباب بالصمت',
    text: 'أنا لا أقول إن المستثمر لا يخطئ. المستثمر بشر. لكن المحاسبة تكون بإجراء مكتوب: بيان الخلل، ومهلة التصحيح. أما الصمت، فليس محاسبة، بل إغلاق باب.',
    keyFactBadge: 'المحاسبة تكون بإجراء مكتوب: بيان الخلل، ومهلة التصحيح',
    dateReference: 'الصمت ليس محاسبة، بل إغلاق باب',
    legalPrinciple: 'غياب الإجراء المكتوب لبيان الخلل والتزام الصمت يُعد إغلاقاً للباب',
  },
  {
    id: 'seg-6-national-dimension',
    numberLabel: 'المقطع 6',
    title: 'البعد الوطني',
    subtitle: 'أن تعود المياه إلى مجاريها، وأن يرجع الحق إلى صاحبه',
    text: 'الدولة حفظها الله وضعتكم في موقع المسؤولية، ودائرتكم مباشرة مع مكتب الوزير. ونحن بعد الله نضع أمننا فيكم. نطلب أن تعود المياه إلى مجاريها، وأن يرجع الحق إلى صاحبه، وأن تمشي الأمور.',
    keyFactBadge: 'دائرتكم مباشرة مع مكتب الوزير — نطلب أن يرجع الحق إلى صاحبه وأن تمشي الأمور',
    dateReference: 'وزارة التجارة والصناعة وترويج الاستثمار',
    legalPrinciple: 'الركون إلى موقع المسؤولية المباشر لدائرة المنافسة والاحتكار لإعادة الحق لصاحبه',
  },
  {
    id: 'seg-7-diplomatic-closing',
    numberLabel: 'المقطع 7',
    title: 'الخاتمة',
    subtitle: '5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي — صلالة 2026',
    text: 'كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.',
    keyFactBadge: '5 أشهر و18 يوماً من التعطيل · 3 أيام من الصمت الرسمي · الرمز: صلالة 2026',
    dateReference: 'صلالة 2026',
    legalPrinciple: 'خلاصة الوقائع المرفوعة للأستاذ الفاضل / خالد المسروري المحترم',
  },
];

export const DuoAudioSimulation: React.FC = () => {
  const [studioMode, setStudioMode] = useState<'duo_10' | 'monologue_7'>('duo_10');
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  const autoAdvanceRef = useRef<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(getGlobalPlaybackSpeed());

  const [selectedMonoId, setSelectedMonoId] = useState<string>(DIPLOMATIC_MONOLOGUE_SEGMENTS[0].id);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [useNationalTone, setUseNationalTone] = useState<boolean>(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading, _title, speed) => {
      setActiveAudioId(id);
      setIsLoading(loading);
      if (speed) setPlaybackSpeed(speed);
      if (!id && !loading) {
        ambientTone.stop();
      }
    });
    return () => {
      unsub();
      ambientTone.stop();
    };
  }, []);

  const handleSpeedChange = (spd: number) => {
    setPlaybackSpeed(spd);
    setGlobalPlaybackSpeed(spd);
  };

  const playPodcastTurnByIndex = (idx: number) => {
    const seg = INVESTIGATIVE_PODCAST_10_SEGMENTS[idx];
    if (!seg) return;

    const audioKey = `podcast-10-${seg.id}`;
    if (activeAudioId === audioKey) {
      stopAllAudio();
      ambientTone.stop();
      return;
    }

    setActiveTurnIndex(idx);
    if (useNationalTone) {
      ambientTone.start();
    } else {
      ambientTone.stop();
    }

    const persona = seg.speaker === 'investor' ? 'khalid' : 'auditor';
    speakArabicText(
      seg.text,
      audioKey,
      persona,
      () => {
        setCompletedIds((prev) => (prev.includes(seg.id) ? prev : [...prev, seg.id]));
        if (autoAdvanceRef.current && idx + 1 < INVESTIGATIVE_PODCAST_10_SEGMENTS.length) {
          playPodcastTurnByIndex(idx + 1);
        } else {
          ambientTone.stop();
        }
      },
      `المقطع ${seg.index} من 10 — ${seg.speakerName}`
    );
  };

  const handlePlayMonologueSegment = (segment: DiplomaticSegment) => {
    const audioKey = `diplomatic-${segment.id}`;
    if (activeAudioId === audioKey) {
      stopAllAudio();
      ambientTone.stop();
      return;
    }

    setSelectedMonoId(segment.id);
    if (useNationalTone) {
      ambientTone.start();
    } else {
      ambientTone.stop();
    }

    speakArabicText(
      segment.text,
      audioKey,
      'khalid',
      () => {
        ambientTone.stop();
        setCompletedIds((prev) => (prev.includes(segment.id) ? prev : [...prev, segment.id]));
      },
      `${segment.numberLabel} — ${segment.title}`
    );
  };

  const currentPodSeg = INVESTIGATIVE_PODCAST_10_SEGMENTS[activeTurnIndex] || INVESTIGATIVE_PODCAST_10_SEGMENTS[0];
  const isCurrentPodPlaying = activeAudioId === `podcast-10-${currentPodSeg.id}`;

  const currentMonoSeg =
    DIPLOMATIC_MONOLOGUE_SEGMENTS.find((s) => s.id === selectedMonoId) || DIPLOMATIC_MONOLOGUE_SEGMENTS[0];
  const isCurrentMonoPlaying = activeAudioId === `diplomatic-${currentMonoSeg.id}`;

  return (
    <div className="space-y-6" dir="rtl">
      {/* Mode Switcher Bar */}
      <div className="rounded-3xl p-4 sm:p-5 bg-[#FFFFFF] border border-[#DEC98A] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              stopAllAudio();
              setStudioMode('duo_10');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
              studioMode === 'duo_10'
                ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
            }`}
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>المحاكاة الصوتية الحوارية الشاملة — شخصان (10 مقاطع)</span>
          </button>

          <button
            onClick={() => {
              stopAllAudio();
              setStudioMode('monologue_7');
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-colors cursor-pointer ${
              studioMode === 'monologue_7'
                ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
            }`}
          >
            <Radio className="w-4 h-4 text-[#8A6D2F]" />
            <span>صوتي الوثيقة المباشر (7 مقاطع مستقلة)</span>
          </button>
        </div>

        {/* Speed & Ambient Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-[#FAF9F6] border border-[#DEC98A] rounded-xl p-1 gap-1">
            {[0.9, 1, 1.25].map((spd) => (
              <button
                key={spd}
                onClick={() => handleSpeedChange(spd)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  playbackSpeed === spd
                    ? 'bg-[#23153C] text-[#FFF3C4]'
                    : 'text-[#524E48] hover:bg-[#F5EFE0]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const nextVal = !useNationalTone;
              setUseNationalTone(nextVal);
              if (activeAudioId) {
                if (nextVal) ambientTone.start();
                else ambientTone.stop();
              }
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
              useNationalTone
                ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                : 'bg-[#FAF9F6] text-[#524E48] border-[#DEC98A]'
            }`}
          >
            {useNationalTone ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                <span>نغمة وطنية هادئة</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#6B655C]" />
                <span>خلفية صامتة</span>
              </>
            )}
          </button>
        </div>
      </div>

      {studioMode === 'duo_10' ? (
        <div className="space-y-6">
          {/* Header Card for 2-Speaker 10-Segment Investigative Regulatory Podcast */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#DEC98A] shadow-2xs space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#EAE4D3] pb-6">
              <div className="space-y-2 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#8A6D2F]">
                  <Radio className="w-3.5 h-3.5" />
                  المحاكاة الصوتية الحوارية الشاملة — شخصان (بودكاست استقصائي رقابي)
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#23153C] royal-heading">
                  السرد الكامل للقضية: من إغلاق محل صلالة إلى ديوان عام الوزارة
                </h2>
                <p className="text-sm sm:text-base text-[#4A453E] leading-relaxed">
                  حوار تفصيلي متكامل بين المستثمر المتضرر بريك العامري والمستشار الرقابي، يوثق كل تعسف مع ذكر أرقام مواد قانون حماية المنافسة ومنع الاحتكار العماني.
                </p>
              </div>

              {/* Two Persona Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0">
                <div
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    currentPodSeg.speaker === 'investor'
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                      : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                    ب.ع
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold">المستثمر بريك العامري</div>
                    <div
                      className={`text-[11px] ${
                        currentPodSeg.speaker === 'investor' ? 'text-[#E6DEC8]' : 'text-[#6B655C]'
                      }`}
                    >
                      الشاهد وصاحب الحق
                    </div>
                  </div>
                </div>

                <div
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    currentPodSeg.speaker === 'counsel'
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                      : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center font-bold text-sm shrink-0">
                    م.ق
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold">المستشار الرقابي</div>
                    <div
                      className={`text-[11px] ${
                        currentPodSeg.speaker === 'counsel' ? 'text-[#E6DEC8]' : 'text-[#6B655C]'
                      }`}
                    >
                      التكييف النظامي للمواد
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Bar matching pasted layout: تشغيل الحوار الصوتي | 1 / 10 | تشغيل تتابعي تلقائي | 0.9x 1x 1.25x */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E6DEC8]">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => playPodcastTurnByIndex(activeTurnIndex)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                    isCurrentPodPlaying
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                      : 'bg-[#F5EFE0] text-[#23153C] border-[#C5A858] hover:bg-[#EDE2C8]'
                  }`}
                >
                  {isCurrentPodPlaying && isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
                      <span>جاري تحضير الصوت...</span>
                    </>
                  ) : isCurrentPodPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-current text-[#D4AF37]" />
                      <span>إيقاف الحوار الصوتي</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current text-[#8A6D2F]" />
                      <span>تشغيل الحوار الصوتي</span>
                    </>
                  )}
                </button>

                <div className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] border border-[#DEC98A] text-sm font-bold text-[#23153C]">
                  {currentPodSeg.index} / {INVESTIGATIVE_PODCAST_10_SEGMENTS.length}
                </div>

                <button
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 cursor-pointer ${
                    autoAdvance
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                      : 'bg-[#FFFFFF] text-[#524E48] border-[#DEC98A]'
                  }`}
                >
                  <CheckCircle2 className={`w-3.5 h-3.5 ${autoAdvance ? 'text-[#D4AF37]' : 'text-[#8A6D2F]'}`} />
                  <span>تشغيل تتابعي تلقائي</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-[#524E48]">
                  المتحدث الحالي في المحاكاة:{' '}
                  <span className="text-[#8A6D2F]">{currentPodSeg.speakerFullTitle}</span>
                </div>
              </div>
            </div>

            {/* Active Segment Spotlight Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border-2 border-[#D4AF37] space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAE4D3] pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-[#23153C] text-[#FFF3C4] text-xs font-bold border border-[#D4AF37]">
                    المقطع {currentPodSeg.index} من 10
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-[#F5EFE0] text-[#8A6D2F] text-xs font-bold border border-[#C5A858]">
                    {currentPodSeg.speakerBadge} — {currentPodSeg.speakerName}
                  </span>
                  <span className="text-xs text-[#6B655C] font-semibold">
                    ({currentPodSeg.speakerRole})
                  </span>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#FFFFFF] border border-[#DEC98A] text-xs font-bold text-[#8A6D2F]">
                  {currentPodSeg.timestampLabel}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#23153C] royal-heading">
                {currentPodSeg.title}
              </h3>

              <blockquote className="text-base sm:text-xl leading-[2.0] font-semibold text-[#2C2A28] bg-[#FFFFFF] p-5 sm:p-6 rounded-2xl border border-[#DEC98A]">
                «{currentPodSeg.text}»
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E6DEC8] flex items-center gap-2.5 text-xs font-bold text-[#23153C]">
                  <Scale className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                  <span>{currentPodSeg.legalArticleBadge}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#FFFFFF] border border-[#E6DEC8] flex items-center gap-2.5 text-xs font-bold text-[#8A6D2F]">
                  <FileCheck2 className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                  <span>المرجع المستندي: {currentPodSeg.docRef}</span>
                </div>
              </div>
            </div>

            {/* Full 10-Turn Interactive Script List */}
            <div className="space-y-3 pt-2">
              <div className="text-sm font-bold text-[#23153C] flex items-center justify-between px-1">
                <span>جميع مقاطع المحاكاة الحوارية العشرة (اضغط على أي مقطع للاستماع المباشر):</span>
                <span className="text-xs text-[#8A6D2F]">
                  تم استماع {completedIds.filter((id) => id.startsWith('pod-')).length} من 10
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {INVESTIGATIVE_PODCAST_10_SEGMENTS.map((seg, idx) => {
                  const isSelected = idx === activeTurnIndex;
                  const isPlayingThis = activeAudioId === `podcast-10-${seg.id}`;
                  return (
                    <div
                      key={seg.id}
                      onClick={() => setActiveTurnIndex(idx)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isPlayingThis
                          ? 'bg-[#FAF9F6] border-2 border-[#D4AF37] shadow-xs'
                          : isSelected
                          ? 'bg-[#FAF9F6] border-2 border-[#DEC98A]'
                          : 'bg-[#FFFFFF] border-[#E6DEC8] hover:border-[#DEC98A]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                              seg.speaker === 'investor'
                                ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                                : 'bg-[#F5EFE0] text-[#23153C] border-[#C5A858]'
                            }`}
                          >
                            {seg.speakerShort}
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-bold text-[#8A6D2F]">
                                المقطع {seg.index} من 10
                              </span>
                              <span className="text-xs font-bold text-[#23153C]">
                                {seg.speakerName}
                              </span>
                              <span className="text-[11px] text-[#6B655C]">
                                ({seg.timestampLabel})
                              </span>
                            </div>
                            <h4 className="text-sm sm:text-base font-bold text-[#2C2A28]">
                              {seg.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed line-clamp-2">
                              «{seg.text}»
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playPodcastTurnByIndex(idx);
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 border cursor-pointer ${
                            isPlayingThis
                              ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                              : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                          }`}
                        >
                          {isPlayingThis && isLoading ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                              <span>تحضير...</span>
                            </>
                          ) : isPlayingThis ? (
                            <>
                              <Pause className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                              <span>إيقاف</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                              <span>تشغيل المقطع {seg.index}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: 7 Independent Segments Direct Monologue */
        <div className="space-y-6">
          <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DEC98A]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    موجه حصراً إلى: وزارة التجارة والصناعة وترويج الاستثمار — دائرة المنافسة والاحتكار
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    الأستاذ الفاضل / خالد المسروري المحترم
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A28] royal-heading leading-snug">
                  صوتي الوثيقة — <span className="text-[#8A6D2F]">المقاطع السبعة المستقلة</span>
                </h2>

                <p className="text-[#33302C] text-sm sm:text-base leading-relaxed">
                  عرض الوقائع السلوكية الموثقة لـ{' '}
                  <span className="text-[#8A6D2F] font-bold">
                    5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي
                  </span>
                  ، والذرائع الفنية التي تُركت دون تصحيح أمام المهلة الرسمية.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EAE4D3] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-[#2C2A28] bg-[#FAF9F6] px-3 py-2.5 rounded-xl border border-[#E6DEC8] font-medium">
                <Lock className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                <span>توقف تلقائي عند نهاية كل مقطع (لا ينتقل إلا بالضغط)</span>
              </div>
              <div className="flex items-center gap-2 text-[#2C2A28] bg-[#FAF9F6] px-3 py-2.5 rounded-xl border border-[#E6DEC8] font-medium">
                <Clock className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                <span>5 أشهر و18 يوماً من التعطيل</span>
              </div>
              <div className="flex items-center gap-2 text-[#2C2A28] bg-[#FAF9F6] px-3 py-2.5 rounded-xl border border-[#E6DEC8] font-medium">
                <Scale className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                <span>ثلاثة مسؤولين · ثلاث رسائل · ثلاثة أيام صمت رسمي</span>
              </div>
              <div className="flex items-center gap-2 text-[#2C2A28] bg-[#FAF9F6] px-3 py-2.5 rounded-xl border border-[#E6DEC8] font-medium">
                <ShieldCheck className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                <span>الرمز الختامي: صلالة 2026</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1 mb-2">
                <h3 className="text-sm font-bold text-[#2C2A28] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8A6D2F]" />
                  المقاطع السبعة (كل مقطع مستقل، يُشغَّل بالضغط، ويتوقف تلقائياً)
                </h3>
              </div>

              {DIPLOMATIC_MONOLOGUE_SEGMENTS.map((seg) => {
                const isSelected = seg.id === selectedMonoId;
                const isPlayingThis = activeAudioId === `diplomatic-${seg.id}`;
                const isDone = completedIds.includes(seg.id);

                return (
                  <div
                    key={seg.id}
                    onClick={() => setSelectedMonoId(seg.id)}
                    className={`group cursor-pointer rounded-2xl p-4 transition-all border ${
                      isPlayingThis
                        ? 'bg-[#FAF9F6] border-2 border-[#C5A858] shadow-2xs'
                        : isSelected
                        ? 'bg-[#FAF9F6] border-2 border-[#DEC98A]'
                        : 'bg-[#FFFFFF] border-[#E6DEC8] hover:border-[#DEC98A] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold border bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A]">
                            {seg.numberLabel}
                          </span>
                          <h4 className="font-bold text-[#2C2A28] text-base">{seg.title}</h4>
                          {isDone && !isPlayingThis && (
                            <CheckCircle2 className="w-4 h-4 text-[#8A6D2F] shrink-0" title="تم الاستماع" />
                          )}
                        </div>
                        <p className="text-xs text-[#6B655C] line-clamp-1">{seg.subtitle}</p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayMonologueSegment(seg);
                        }}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all border cursor-pointer ${
                          isPlayingThis
                            ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                            : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                        }`}
                      >
                        {isPlayingThis && isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6D2F]" />
                            <span>تحضير...</span>
                          </>
                        ) : isPlayingThis ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                            <span>إيقاف</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                            <span>تشغيل المقطع</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-3xl p-6 sm:p-8 h-full flex flex-col justify-between bg-[#FFFFFF] border border-[#DEC98A]">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[#EAE4D3]">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] font-bold text-sm">
                        {currentMonoSeg.numberLabel}
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#2C2A28] royal-heading">
                          {currentMonoSeg.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#8A6D2F] font-medium">
                          {currentMonoSeg.subtitle}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A]">
                      {currentMonoSeg.dateReference}
                    </span>
                  </div>

                  <div className="my-6 p-6 sm:p-8 rounded-3xl bg-[#FAF9F6] border border-[#DEC98A] relative">
                    <div className="text-xs font-medium text-[#8A6D2F] mb-3 flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4" />
                      النص المعتمد للمقطع (يتوقف تلقائياً عند نهاية المقطع):
                    </div>
                    <blockquote className="text-xl sm:text-2xl leading-[2.0] font-semibold text-[#2C2A28] royal-heading">
                      «{currentMonoSeg.text}»
                    </blockquote>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
                      <div className="text-xs font-medium text-[#8A6D2F] mb-1 flex items-center gap-1.5">
                        <Award className="w-4 h-4" />
                        مرتكز الواقعة
                      </div>
                      <div className="text-sm text-[#2C2A28] font-semibold">
                        {currentMonoSeg.keyFactBadge}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
                      <div className="text-xs font-medium text-[#8A6D2F] mb-1 flex items-center gap-1.5">
                        <Scale className="w-4 h-4" />
                        الدلالة السلوكية
                      </div>
                      <div className="text-sm text-[#2C2A28] font-semibold">
                        {currentMonoSeg.legalPrinciple}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-5 border-t border-[#EAE4D3] flex flex-wrap items-center justify-between gap-4">
                  <button
                    onClick={() => handlePlayMonologueSegment(currentMonoSeg)}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2.5 transition-all border cursor-pointer ${
                      isCurrentMonoPlaying
                        ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                        : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                    }`}
                  >
                    {isCurrentMonoPlaying && isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-[#8A6D2F]" />
                        <span>جاري تحضير الصوت...</span>
                      </>
                    ) : isCurrentMonoPlaying ? (
                      <>
                        <Square className="w-5 h-5 fill-current text-[#8A6D2F]" />
                        <span>إيقاف قراءة {currentMonoSeg.numberLabel}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5 text-[#8A6D2F]" />
                        <span>
                          تشغيل {currentMonoSeg.numberLabel}: {currentMonoSeg.title}
                        </span>
                      </>
                    )}
                  </button>

                  <div className="text-xs text-[#6B655C] font-medium flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#8A6D2F]" />
                    توقف تلقائي عند نهاية المقطع
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DuoAudioSimulation;
