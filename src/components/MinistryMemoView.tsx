import React from 'react';
import { FileText, Printer, Volume2, ShieldCheck, Clock, UserCheck, AlertOctagon, ArrowLeft, Phone, Mail, Building } from 'lucide-react';

interface MinistryMemoViewProps {
  onPlayTTS: (text: string, title: string) => void;
  isTTSPlaying: boolean;
}

export const MinistryMemoView: React.FC<MinistryMemoViewProps> = ({ onPlayTTS, isTTSPlaying }) => {
  const fullMemoText = `سلطنة عُمان — مذكرة استيضاح وبحث حالة رقابية.
شركة بن كليلة العامري للتجارة والاستثمار ش.م.م.
إلى الفاضل / خالد المسروري المحترم، مدير عام مركز حماية المنافسة ومنع الاحتكار بوزارة التجارة والصناعة وترويج الاستثمار.
المرجع: BKA/MOCIIP-COMP/2026/10. التاريخ: 20 أكتوبر 2026م.
تفصيل الموقف الرقابي وتفكيك دفوع شركة المطاحن العمانية ش.م.ع.ع: الرد على ادعاء لم نرفض البيع عبر القرائن المستندية، وشبهة التناقض المصنعي وتمرير المسار لوسيط خارجي.
أولاً: السرد الاستثماري والإنساني من معاناة إغلاق مستودع صلالة في مايو 2026 إلى أمل التصدير في الإمارات لمزرعة بركة الوقن بسويحان، بطاقة 24 ألف كيس شهرياً وبقيمة سنوية 1.87 مليون ريال عماني وسداد كاش مسبق 100%.
ثانياً: الإشارة إلى الاجتماع الأخير ومهلة الأيام الثلاثة التي انقضت دون أي تجاوب من مسؤولي المصنع.
ثالثاً: تفنيد دفوع المصنع وإثبات الامتناع المقنع عن البيع عبر تناقض شهادة التحليل المخبري مع البطاقة، وشبهة إقرار علف البياض Layer 16%، ومناورة الصفر يوم سحب.
رابعاً: التداخل اللوجستي والمحاسبي للوسيط الخارجي نوفل وتحصيل أجور الشحن بحساب المطاحن ببنك مسقط ومحاولة الاستحواذ على العميل النهائي.`;

  return (
    <article aria-label="المذكرة الرقابية الرسمية لوزارة التجارة والصناعة" className="space-y-8 animate-in fade-in duration-300">
      {/* Top Memo Action Bar */}
      <div className="bg-white rounded-2xl border-2 border-[#D4AF37] p-4 sm:p-6 shadow-sm flex flex-wrap justify-between items-center gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            ملف ديوان عام الوزارة — مسقط
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#23153c] mt-2">
            مذكرة استيضاح وبحث حالة رقابية موجهة لمركز حماية المنافسة ومنع الاحتكار
          </h2>
          <p className="text-xs text-gray-600 font-medium mt-1">
            المرجع: <span className="font-mono font-bold text-amber-900">BKA/MOCIIP-COMP/2026/10</span> | التاريخ: <span className="font-bold">20 أكتوبر 2026م</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPlayTTS(fullMemoText, 'مذكرة مركز حماية المنافسة ومنع الاحتكار')}
            className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              isTTSPlaying
                ? 'bg-amber-600 text-white'
                : 'bg-[#23153c] text-amber-200 hover:bg-[#35215c] border border-[#D4AF37]'
            }`}
          >
            <Volume2 className="w-4 h-4 ml-1.5" />
            <span>{isTTSPlaying ? 'جاري الاستماع...' : 'استماع صوتي للمذكرة (TTS)'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 hover:text-[#23153c] hover:border-[#D4AF37] text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-4 h-4 ml-1.5" />
            <span>طباعة المذكرة / PDF</span>
          </button>
        </div>
      </div>

      {/* Official Parchment Container */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-12 shadow-sm space-y-10 relative overflow-hidden">
        {/* Subtle Watermark Logo */}
        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 translate-x-1/2 w-96 h-96 opacity-[0.03] pointer-events-none">
          <img
            src="/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg"
            alt="Watermark"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Official Letterhead */}
        <div className="border-b-2 border-gray-100 pb-8 flex flex-wrap justify-between items-start gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-[#23153c]">
              سلطنة عُمان — مذكرة استيضاح وبحث حالة رقابية
            </h3>
            <div className="text-xs text-gray-700 space-y-1">
              <p className="font-bold text-amber-950">
                شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
              </p>
              <p className="text-gray-500 font-mono text-[11px]">
                السجل التجاري: 1111041 / 1361596 | صلالة — محافظة ظفار
              </p>
            </div>
          </div>

          <div className="text-left space-y-1 text-xs text-gray-600 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
            <div><strong>المرجع:</strong> <span className="font-mono text-brand-purpleDeep">BKA/MOCIIP-COMP/2026/10</span></div>
            <div><strong>التاريخ:</strong> 20 أكتوبر 2026م</div>
            <div><strong>التصنيف:</strong> إيداع عاجل مشفوع بالقرائن والأدلة</div>
          </div>
        </div>

        {/* Addressee */}
        <div className="bg-amber-50/70 border-r-4 border-[#C59B27] p-4 rounded-xl text-xs space-y-1">
          <p className="font-black text-[#23153c] text-sm">
            إلى الفاضل / خالد المسروري المحترم
          </p>
          <p className="font-bold text-amber-900">
            مدير عام مركز حماية المنافسة ومنع الاحتكار
          </p>
          <p className="text-gray-600">
            وزارة التجارة والصناعة وترويج الاستثمار — ديوان عام الوزارة، مسقط
          </p>
        </div>

        {/* Subject */}
        <div className="border-y border-gray-200 py-4 text-center">
          <h4 className="text-base sm:text-lg font-black text-[#23153c] leading-relaxed">
            الموضوع: تفصيل الموقف الرقابي وتفكيك دفوع شركة المطاحن العمانية ش.م.ع.ع:
            <br />
            <span className="text-sm font-bold text-amber-900">
              الرد على ادعاء «لم نرفض البيع» عبر القرائن المستندية، وشبهة التناقض المصنعي وتمرير المسار لوسيط خارجي
            </span>
          </h4>
        </div>

        {/* SECTION 1: Narrative */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse border-b border-amber-200 pb-2">
            <span className="w-7 h-7 rounded-full bg-[#23153c] text-amber-300 font-black text-xs flex items-center justify-center">
              ١
            </span>
            <h5 className="font-black text-base text-[#23153c]">
              أولاً: السرد الاستثماري والإنساني: من معاناة إغلاق مستودع صلالة في مايو 2026 إلى أمل التصدير في الإمارات
            </h5>
          </div>
          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 text-justify">
            <p>
              فضلي لمسار النظام والقانون ليس وليد صدفة، بل هو خيار مبدئي التزمت به حتى حين أُغلقت في وجهي الأبواب. ففي العام الماضي، حاولتُ لمدة سنة كاملة مع أحد المصانع في محافظة ظفار معالجة ممارسات الإغراق والتمييز التي قادها أطراف وافدون أضروا بالسوق المحلي. ووجدت نفسي بين مفترق طرق: إما أن أسلك طرقاً لا يرضاها الله ولا تربيت عليها، أو أن أختار حفظ الكرامة والنزاهة وتصفية المحل وإغلاقه نهائياً. فاخترت الإغلاق في 1 مايو 2026م، وقلت عسى الله أن يعوضني خيراً، متجنباً أي تذمر أو شكوى عقيمة.
            </p>
            <p>
              ولكن سبحان الله، في نفس الشهر (مايو 2026)، عوضني الله سبحانه وتعالى بفرصة شريفة ونافذة أمل عبر شراكة استراتيجية مع عمي الكريم بدولة الإمارات العربية المتحدة لتوريد أعلاف الدواجن «بركات» إلى منشأة كبرى في سويحان (مزرعة بركة الوقن)، بطاقة تعاقدية تصل إلى <strong>24,000 كيس شهرياً وبقيمة سنوية تناهز 1.87 مليون ريال عماني، بسداد نقدي ومسبق 100%</strong>. شعرنا وكأننا نجونا من حصر الموت التجاري، وقلنا سنمضي قدماً في خدمة الاقتصاد الوطني وتنمية الصادرات غير النفطية.
            </p>
            <p>
              لكن للأسف الشديد، اصطدمنا بذات النمط الإقصائي الممنهج وتمرير مسار التصدير لوسيط خارجي، لنجد أنفسنا أمام «قهر تجاري» حقيقي وليس مجرد عثرة عادية؛ قهر يتمثل في تجميد بضاعة مواطن دافع قيمتها كاش مقدماً، واختلاق عراقيل فنية متعمدة. ونحن نضع الأمر بين يديكم، لعلمنا اليقين بنزاهة هذه الوزارة الموقرة وتبعيتها المباشرة لمكتب معالي وزير التجارة والصناعة وترويج الاستثمار، لنلجأ إليكم بعد الله سبحانه وتعالى كحصن آمن لحماية حقوقنا، ونحن مطمئنون لأن دائرتكم تتبع مباشرة لمكتب الوزير، وهو ما يزيدنا اطمئناناً بأن حقنا لن يضيع هباءً منثوراً.
            </p>
          </div>
        </section>

        {/* SECTION 2: 3-Day Deadline */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse border-b border-amber-200 pb-2">
            <span className="w-7 h-7 rounded-full bg-[#23153c] text-amber-300 font-black text-xs flex items-center justify-center">
              ٢
            </span>
            <h5 className="font-black text-base text-[#23153c]">
              ثانياً: الإشارة إلى الاجتماع الأخير ومهلة الأيام الثلاثة (لا حياة لمن تنادي)
            </h5>
          </div>
          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 text-justify">
            <p>
              عملاً بتوجيهكم الكريم في اجتماعنا الأخير يوم الخميس الماضي بديوان الوزارة، حيث تفضلتم بالطلب منا تجديد المخاطبة وإعطاء المصنع مهلة نظامية محددة بـ <strong>(ثلاثة أيام عمل)</strong> لتسليم المستندات المصنعية المطابقة قبل اتخاذ الإجراءات الرقابية اللاحقة؛ فقد تقيدت تماماً بتوجيهاتكم الحكيمة، وقمت فوراً بإرسال الخطاب الرسمي بصيغة PDF عبر تطبيق الواتساب إلى كافة المسؤولين المعنيين في شركة المطاحن العمانية:
            </p>
            <ul className="list-disc list-inside space-y-1 font-bold text-[#23153c] bg-gray-50 p-3 rounded-xl border border-gray-200">
              <li>مكتب الرئيس التنفيذي: فيصل المعشني</li>
              <li>القطاع الفني: مهند الرئيسي</li>
              <li>قسم المبيعات والتصدير: أدهم البلوشي</li>
            </ul>
            <p>
              وللأسف الشديد، بلغ التعالي الإداري مبلغه لدرجة أن «لا حياة لمن تنادي»؛ فلم يكلف أي منهم نفسه حتى عناء الرد بكلمة تحية أو استلام على الرسالة الرسمية! وهذا يؤكد أن التعطيل ليس مجرد تأخير إداري عابر، بل هو تعمد مقصود لفرض الأمر الواقع وإقصائنا من المشهد لحساب الوسيط الخارجي. ونحن نضع بين أيديكم هذا الملف لنطلعكم على كافة المعاناة والتفاصيل، ونرحب بأي توجيه أو تعديل ترونه مناسباً لتقوية موقفنا القانوني.
            </p>
          </div>
        </section>

        {/* SECTION 3: Refuting "Did not refuse" */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse border-b border-amber-200 pb-2">
            <span className="w-7 h-7 rounded-full bg-[#23153c] text-amber-300 font-black text-xs flex items-center justify-center">
              ٣
            </span>
            <h5 className="font-black text-base text-[#23153c]">
              ثالثاً: تفنيد دفوع المصنع («لم نرفض البيع ولم نمتنع»): إثبات الامتناع المقنّع وتجنب الجزم بالسوء
            </h5>
          </div>
          <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200 text-xs">
            <strong className="text-amber-950 font-bold block mb-1">الدفع المتكرر من المصنع:</strong>
            يدفع ممثلو المصنع بأنهم «لم يمتنعوا عن البيع لبريك»، مستندين إلى استلام الأموال وتسليم كميات في المخازن، ويزعمون أن المشكلة في المنافذ أو إجراءات دولة الإمارات.
          </div>
          <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 text-justify">
            <p>
              <strong>الرد القانوني المحصن (وفق الأصول المحترفة وبصيغة الاحتمال والشك لا الجزم بالسوء):</strong>
              <br />
              في أبجديات التجارة والقانون، البيع لا يكتمل بمجرد قبض الثمن، بل يوجب تسليم «ملحقات المبيع المستندية والفنية» الصالحة للانتفاع. والمصنع لا يرفض بكلمة صريحة، بل يمارس <strong>«الامتناع المقنّع وتعجيز الفسح الجمركي»</strong> عبر التناقضات المصنعية المحتملة الآتية:
            </p>
            <div className="grid grid-cols-1 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs leading-relaxed">
                <strong className="text-[#23153c] font-black block mb-1">
                  1. تناقض شهادة التحليل (COA) مع البطاقة التعريفية:
                </strong>
                أصدرت دائرة الجودة بالمصنع شهادة تحليل تثبت احتمال وجود مضادات الكوكسيديا (Anticoccidials)، بينما البطاقة على الكيس تغفلها وتذكر عبارة (Rotation Program). وعندما طُلِب التصحيح، أبدى مسؤول التصدير تحفظاً بحجة تكلفة الطباعة ونفى وجود المادة أصلاً، رغم ثبوتها في مختبرهم.
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs leading-relaxed">
                <strong className="text-[#23153c] font-black block mb-1">
                  2. شبهة مستند السلامة المغاير (علف البياض Layer 16%):
                </strong>
                تم تزويدنا مرتين بإقرار سلامة لمنتج علف بياض (Layer 16% Autumn Season) لصفقة مخصصة بالكامل لعلف الدواجن اللاحم (Starter & Finisher)! وتقديم هذا المستند المغاير للسلطات الإماراتية يضع المصدّر في شبهة تضليل مواصفات توجب حظره ومصادرة بضاعته.
              </div>
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs leading-relaxed">
                <strong className="text-[#23153c] font-black block mb-1">
                  3. مناورة &quot;الصفر يوم&quot; وتعليق نظام MOCCAE:
                </strong>
                تشترط وزارة البيئة الإماراتية فترة سحب لا تقل عن 7 أيام أو خلو معتمد. وأرسل مختبر المصنع جدولاً بفترة سحب (0 يوم) استناداً لنشرة شركة بلغارية (Sacox 120)، متجاهلين الرفض السيادي القاطع لفترة الصفر يوم، مما أبقى تعليق الطلب الإلكتروني (APH-12062026-3382929) سارياً.
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: External Broker */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2 space-x-reverse border-b border-amber-200 pb-2">
            <span className="w-7 h-7 rounded-full bg-[#23153c] text-amber-300 font-black text-xs flex items-center justify-center">
              ٤
            </span>
            <h5 className="font-black text-base text-[#23153c]">
              رابعاً: التداخل اللوجستي والمحاسبي للوسيط الخارجي (نوفل) وشبهة تضارب المصالح
            </h5>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-[#23153c] font-black block">1. تحصيل أجور الوسيط في حساب المطاحن:</strong>
              <p className="text-gray-700 leading-relaxed">
                بإيعاز من إدارة التصدير، تم دمج أجور نقل الوسيط ضمن الحساب البنكي الرسمي لشركة المطاحن العمانية ببنك مسقط، مما يشير إلى شبهة تداخل محاسبي غير مبرر واستغلال حسابات شركة مساهمة عامة لصالح أطراف وسيطة غير مرخصة محلياً.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-[#23153c] font-black block">2. واقعة التعطيل المتزامن (7 مايو 2026):</strong>
              <p className="text-gray-700 leading-relaxed">
                تأخر إصدار أذونات التحميل طوال دوام يوم 7 مايو بدعوى ظروف صحية طارئة، وفي ذات التوقيت كانت شاحنات الوسيط الخارجي تُحمّل بسلاسة من داخل حرم المصنع، ما يعكس تبايناً إجرائياً غير عادل.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-[#23153c] font-black block">3. شروط الابتزاز وغرامات الانتظار:</strong>
              <p className="text-gray-700 leading-relaxed">
                اشتراط الوسيط فرض غرامات مبيت على كل شاحنة، وإلزامنا بقيد سجلنا التجاري تحت شركته في المنطقة الحرة بعجمان (أطياف جلوبال)، وإرساله مطالبات جمركية مستعجلة لشحنات معفاة خليجياً.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
              <strong className="text-[#23153c] font-black block">4. محاولة الاستحواذ على العميل النهائي:</strong>
              <p className="text-gray-700 leading-relaxed">
                انتقال الوسيط ميدانياً إلى مزرعة بركة الوقن بسويحان لتقديم عروض مباشرة وتجاوزنا، غير أن مالك المزرعة رفض تعامله وتمسك حصرياً بالشراكة الاستراتيجية معنا.
              </p>
            </div>
          </div>
        </section>

        {/* Sign-off & Direct Contact Credentials */}
        <div className="border-t-2 border-gray-100 pt-8 flex flex-wrap justify-between items-center gap-6 bg-gradient-to-r from-amber-50/50 via-white to-gray-50 p-6 rounded-2xl border">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-bold block">مقدمه لسعادتكم باحترام وتقدير،،</span>
            <h6 className="text-base font-black text-[#23153c]">بريك بن محمد بن كليلة العامري</h6>
            <span className="text-xs text-amber-900 font-bold block">
              المدير العام — شركة بن كليلة العامري للتجارة والاستثمار ش.م.م
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 text-xs font-mono font-bold text-gray-700">
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#C59B27]" />
              <span>+968 99088000 / +968 99083800</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#C59B27]" />
              <span>bs@binkalilahalaamri.com</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
