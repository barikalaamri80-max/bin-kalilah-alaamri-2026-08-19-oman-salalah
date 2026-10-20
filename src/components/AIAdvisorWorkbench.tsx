import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Scale,
  Shield,
  Mail,
  Table,
  Search,
  Volume2,
  Copy,
  CheckCircle2,
  Loader2,
  Headphones,
  Globe,
  Send,
  Mic,
  MicOff,
  MapPin,
  FileCheck,
} from 'lucide-react';

interface AIAdvisorWorkbenchProps {
  onPlayTTS: (text: string, title: string) => void;
  isTTSPlaying: boolean;
}

export const AIAdvisorWorkbench: React.FC<AIAdvisorWorkbenchProps> = ({
  onPlayTTS,
  isTTSPlaying,
}) => {
  const [activeTab, setActiveTab] = useState<
    'refute' | 'diplomat' | 'draft_memo' | 'questions_matrix' | 'detect_fallacy'
  >('refute');

  const [inputClaim, setInputClaim] = useState(
    'يدّعون أنهم لم يرفضوا البيع لنا وأن مشكلة الحدود تخص وزارة الإمارات فقط'
  );
  const [useSearch, setUseSearch] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Audio recording / transcription state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Default pre-loaded detailed answer
  const defaultAnswer = `**الفاضل/ خالد المسروري المحترم**
**مدير عام مركز حماية المنافسة ومنع الاحتكار**
**وزارة التجارة والصناعة وترويج الاستثمار**

**الموضوع: رد فني وقانوني على ادعاءات شركة المطاحن العمانية ش.م.ع.ع بشأن "الامتناع المقنع" عن التوريد وتصدير بيانات تضلل الجهات الرقابية.**

تحية طيبة وبعد،،

بصفتنا المستشار القانوني والاستراتيجي لشركة **بن كليلة العامري للتجارة والاستثمار ش.م.م**، وبالإشارة إلى الاجتماع المنعقد معكم بديوان الوزارة، وإلحاقاً بالمهلة (3 أيام عمل) التي مُنحت للمصنع ولم يتم التجاوب معها حتى تاريخه (أكتوبر 2026م)؛ نضع بين أيديكم هذا الرد الذي يفند دفع الخصم بأن "المشكلة حدودية" وأنهم "لم يمتنعوا عن البيع"، مستندين في ذلك إلى الوقائع المادية والقانونية التالية:

### أولاً: تفكيك الدفع القانوني (مفهوم "الامتناع المقنع" عن البيع)
إن ادعاء المصنع بأنه "لم يرفض البيع" هو ادعاء يفتقر إلى السند القانوني السليم؛ حيث إن عقد البيع -خاصة لغرض التصدير- لا يكتمل بمجرد قبض الثمن، بل يمتد ليشمل **"التزام البائع بتسليم ملاحق المبيع"** التي تمكن المشتري من الانتفاع به (المواد 155 و156 من قانون المعاملات المدنية).
إن قيام المصنع بتقديم وثائق ومستندات فنية متناقضة تجعل من المستحيل عبور السلعة للحدود هو في حقيقته **"امتناع مقنع" (Constructive Refusal)**. فالمصنع هنا لم يرفض استلام المال، بل وضع عراقيل إجرائية ومستندية متعمدة تؤدي بذات نتيجة الامتناع الصريح، وهو ما يشكل مخالفة جسيمة للمادتين (10) و (11) من قانون حماية المنافسة ومنع الاحتكار، كونه استغلالاً للوضع المهيمن لإقصاء موزع وطني من السوق الدولي.

### ثانياً: الدليل المادي القاطع من واقع مستندات المصنع
تثبت الأوراق الرسمية الصادرة من شركة المطاحن العمانية وجود تباين مستندي لا يمكن تفسيره إلا بالتعسف أو التضليل الإجرائي:
1. **التناقض في المكونات (COA vs Label):** أرسل المصنع شهادة تحليل (COA) تؤكد وجود مادة الكوكسيديا (Sacox)، بينما "بطاقة البيان" الملصقة على الأكياس تغفل ذكر هذه المادة وتكتفي بعبارة (Rotation Program). هذا التضارب هو الذي دفع بوزارة التغير المناخي والبيئة بالإمارات (MOCCAE) لرفض الشحنة تحت طلب رقم (APH-12062026-3382929). الخطأ هنا "منشئي" من داخل المصنع وليس "حدودياً".
2. **فخ شهادة علف البياض (Layer 16%):** في واقعة تثير الدهشة، قام المصنع بإرسال "إقرار سلامة علف" يخص أعلاف الدجاج البياض (Layer 16%) مرتين لصفقة تخص حصراً "أعلاف اللاحم" (Broiler Starter & Finisher) بإجمالي يتجاوز 100,000 كغم منقولة، بهدف إيقاع المستثمر في فخ الإقرار الكاذب أمام السلطات البيطرية الإماراتية وإعاقة الفسح الجمركي.
3. **فترة السحب (Withdrawal Period):** يدعي المصنع أن فترة سحب الدواء هي (0 يوم) بناءً على النشرة البلغارية، في حين تشترط السلطات الإماراتية (7 أيام) كمعيار أمان حيوي. إصرار المصنع على عدم توفير شهادة مطابقة للمواصفات الفنية المطلوبة للبلد المستورد هو "امتناع فني" عن إتمام الصفقة.
4. **التواطؤ المحاسبي واللوجستي (الوسيط نوفل):** رصدنا واقعة دمج أجور النقل التابعة للوسيط (نوفل) ضمن حسابات شركة المطاحن ببنك مسقط، ومضاعفة أجور الشحن من 280 ريالاً إلى 700 ريال، وتزامن ذلك مع محاولات الالتفاف للاستحواذ على العميل (مزرعة بركة الوقن بسويحان - 160,000 طير دجاج). هذا التلاحم المحاسبي بين المصنع والوسيط يثبت مخالفة صريحة للمادة (11) من قانون حماية المنافسة ومنع الاحتكار.

### ثالثاً: الخلاصة والطلبات الرقابية
إن شركة "بن كليلة العامري" لم تطلب المستحيل، بل طلبت "مبيعاً مطابقاً لمواصفات التصدير". وإن تذرع المصنع بأن المشكلة في "الحدود" هو تضليل للواقع؛ فالحدود تطلب أوراقاً تعكس حقيقة المنتج، والمصنع هو من أصدر أوراقاً متضاربة عمداً.

**بناءً عليه، نلتمس من سعادتكم:**
1. اعتبار صمت المصنع وانقضاء مهلة الأيام الثلاثة إقراراً ضمنياً بالمخالفات المرصودة.
2. إلزام المصنع فوراً بتوفير المستندات المطابقة لاشتراطات التصدير دون قيد أو شرط أو وسيط.
3. التحقيق في شبهة التواطؤ المحاسبي وإقصاء الموزع الوطني لصالح وسيط أجنبي، وحماية استثماراتنا (1.87 مليون ر.ع سنوياً) من الضياع.`;

  const [generatedOutput, setGeneratedOutput] = useState<string>(defaultAnswer);

  const presets = [
    {
      title: 'يدّعون أنهم لم يرفضوا البيع لنا وأن مشكلة الحدود تخص وزارة الإمارات فقط',
      text: 'يدّعون أنهم لم يرفضوا البيع لنا وأن مشكلة الحدود تخص وزارة الإمارات فقط',
    },
    {
      title: 'يدّعون أن الوسيط نوفل مجرد ناقل شاحنة مستقل ولا علاقة للمصنع به',
      text: 'يدّعون أن الوسيط نوفل مجرد ناقل شاحنة مستقل ولا علاقة للمصنع به',
    },
    {
      title: 'يدّعون أن إرسال شهادة علف بياض Layer 16% كان مجرد خطأ إداري غير مقصود',
      text: 'يدّعون أن إرسال شهادة علف بياض Layer 16% كان مجرد خطأ إداري غير مقصود',
    },
    {
      title: 'يدّعون أن نشرة الشركة البلغارية (صفر يوم سحب) كافية ولا يلزم تعديل البطاقة',
      text: 'يدّعون أن نشرة الشركة البلغارية (صفر يوم سحب) كافية ولا يلزم تعديل البطاقة',
    },
  ];

  // Start Audio Recording via Microphone
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
        await handleTranscribeBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert('تعذر الوصول إلى الميكروفون. يرجى التأكد من صلاحيات المتصفح.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribeBlob = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audio: base64Data,
            mimeType: 'audio/webm',
          }),
        });

        const data = await res.json();
        if (data.text) {
          setInputClaim((prev) => (prev ? `${prev}\n${data.text}` : data.text));
        } else {
          alert('لم يتم استخراج أي نص من التسجيل الصوتي.');
        }
        setIsTranscribing(false);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Transcription error:', e);
      setIsTranscribing(false);
      alert('فشل التفريغ الصوتي عبر النموذج.');
    }
  };

  const handleGenerate = async () => {
    if (!inputClaim.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: inputClaim,
          mode: activeTab,
          useSearch,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setGeneratedOutput(data.answer);
      } else {
        setGeneratedOutput('تعذر الحصول على الرد القانوني. يرجى المحاولة لاحقاً.');
      }
    } catch (err) {
      console.error('Failed to generate answer:', err);
      setGeneratedOutput('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlaySimulation = () => {
    const simulationScript = `محاكاة جلسة استماع أمام المحقق الرقابي بوزارة التجارة والصناعة وترويج الاستثمار:
ممثل شركة المطاحن يدعي: نحن شركة مساهمة عامة، لم نرفض البيع، واستلمنا المبالغ وسلمنا البضاعة للمشتري، والمشكلة تنظيمية بالمنفذ الحدودي لدولة الإمارات.
رد المستشار القانوني لشركة بن كليلة: هذا الدفع مردود؛ البيع لغرض التصدير يشمل بالضرورة تسليم ملحقات المبيع الصالحة للانتفاع وفق المادتين 155 و156 من قانون المعاملات المدنية. تسليمكم لشهادة تحليل مخبري متناقضة مع بطاقة العلف، وافتعال شرط صفر يوم سحب المستحيل علمياً، وتقديم شهادة سلامة علف بياض لصفقة لاحم، ودمج أجور الوسيط نوفل بحسابكم ببنك مسقط يمثل امتناعاً مقنعاً وتواطؤاً احتكارياً مجرماً بالمادتين العاشرة والحادية عشرة من قانون حماية المنافسة ومنع الاحتكار.`;

    onPlayTTS(simulationScript, 'محاكاة جلسة استماع أمام المحقق الرقابي');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simulation Banner */}
      <div className="bg-[#1e1233] border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-[#D4AF37] text-xs font-bold text-amber-200">
            <Sparkles className="w-4 h-4 text-[#ECC870]" />
            <span>مدعوم بـ Gemini 3.8 Flash & تفريغ الصوت الذكي</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-amber-200">
            المستشار القانوني والرقابي التفاعلي للقضية
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            تفنيد فوري لحجج المصنع، صياغة مذكرات رقابية، كشف المغالطات المنطقية، ومحاكاة لجلسات التحقيق الرسمي أمام ديوان عام الوزارة.
          </p>
        </div>

        <button
          onClick={handlePlaySimulation}
          className="px-5 py-3 rounded-2xl gold-gradient-bg text-[#23153c] hover:brightness-105 font-black text-xs sm:text-sm transition flex items-center shadow-lg cursor-pointer"
        >
          <Headphones className="w-5 h-5 ml-2" />
          <span>تشغيل محاكاة جلسة التحقيق الرقابي</span>
        </button>
      </div>

      {/* Main Workbench Card */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-md space-y-6">
        {/* Tool Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <button
            onClick={() => setActiveTab('refute')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'refute'
                ? 'bg-[#23153c] text-amber-200 border border-[#D4AF37] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Scale className="w-4 h-4 text-[#C59B27]" />
            <span>1. تفنيد حجج المصنع</span>
          </button>

          <button
            onClick={() => setActiveTab('diplomat')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'diplomat'
                ? 'bg-[#23153c] text-amber-200 border border-[#D4AF37] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>2. المُحوّل الدبلوماسي الآمن</span>
          </button>

          <button
            onClick={() => setActiveTab('draft_memo')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'draft_memo'
                ? 'bg-[#23153c] text-amber-200 border border-[#D4AF37] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Mail className="w-4 h-4 text-blue-500" />
            <span>3. صياغة مذكرة ديوان الوزارة</span>
          </button>

          <button
            onClick={() => setActiveTab('questions_matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'questions_matrix'
                ? 'bg-[#23153c] text-amber-200 border border-[#D4AF37] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Table className="w-4 h-4 text-purple-500" />
            <span>4. توليد مصفوفة أسئلة رقابية</span>
          </button>

          <button
            onClick={() => setActiveTab('detect_fallacy')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              activeTab === 'detect_fallacy'
                ? 'bg-[#23153c] text-amber-200 border border-[#D4AF37] shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>5. كاشف المغالطات والتناقض المستندي</span>
          </button>
        </div>

        {/* Preset Claim Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 block">
            اختر أحد الادعاءات أو الدفوع الشائعة للمصنع لفحصها وتفكيكها فوراً:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setInputClaim(preset.text)}
                className={`p-2.5 rounded-xl text-right text-xs transition border cursor-pointer ${
                  inputClaim === preset.text
                    ? 'bg-amber-50 border-[#C59B27] text-amber-950 font-bold shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                📌 {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area with Audio Transcription Microphone */}
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={inputClaim}
              onChange={(e) => setInputClaim(e.target.value)}
              rows={3}
              placeholder="أدخل نص الادعاء، أو رد ممثل المصنع، أو اضغط على أيقونة الميكروفون للتحدث الصوتي المباشر..."
              className="w-full text-xs p-3.5 pr-3 pl-12 rounded-2xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] leading-relaxed resize-none bg-[#FAF9F6]"
            />

            {/* Microphone Audio Transcription Button (gemini-3.5-transcribe) */}
            <div className="absolute left-3 bottom-4">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                className={`p-2 rounded-xl transition shadow-xs flex items-center justify-center ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-white hover:bg-amber-50 text-gray-700 hover:text-[#C59B27] border border-gray-300 hover:border-[#D4AF37]'
                }`}
                title={isRecording ? 'إيقاف التسجيل وتفريغ الصوت' : 'تحدث صوتياً بالميكروفون للتفريغ الذكي'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {(isRecording || isTranscribing) && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>
                {isRecording ? 'جاري الاستماع لصوتك عبر الميكروفون... اضغط على الميكروفون لإتمام التسجيل' : 'جاري تفريغ الصوت وتحويله لنص دقيق عبر نموذج gemini-3.5-transcribe...'}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            <label className="flex items-center space-x-2 space-x-reverse text-xs text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={useSearch}
                onChange={(e) => setUseSearch(e.target.checked)}
                className="rounded accent-amber-600 w-4 h-4"
              />
              <span className="flex items-center font-bold">
                <Globe className="w-3.5 h-3.5 ml-1 text-blue-600" />
                تدعيم الرد بالبحث الرقابي والقانوني المباشر عبر Google Search (للمعايير الخليجية والمصنعية)
              </span>
            </label>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputClaim.trim()}
              className="px-6 py-2.5 rounded-xl gold-gradient-bg text-[#23153c] hover:brightness-105 font-black text-xs transition flex items-center shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 ml-1.5 animate-spin" />
                  <span>جاري الصياغة والتحليل عبر Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 ml-1.5 text-[#23153c]" />
                  <span>توليد الرد القانوني المفحم (عبر Gemini API)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Result Area */}
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="text-sm font-black text-[#23153c] flex items-center">
              <Scale className="w-4 h-4 ml-1.5 text-[#C59B27]" />
              الرد القانوني والرقابي المفحم (مستند بالأدلة والنصوص):
            </h4>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlayTTS(generatedOutput, 'الرد القانوني والرقابي المفحم')}
                className="px-3 py-1.5 rounded-lg border border-[#D4AF37] bg-amber-50 hover:bg-[#C59B27] text-[#23153c] hover:text-white text-xs font-bold transition flex items-center"
              >
                <Volume2 className="w-3.5 h-3.5 ml-1" />
                <span>استماع صوتي (Gemini TTS)</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-700 text-xs font-bold transition flex items-center"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 ml-1" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-gray-200 rounded-2xl p-5 sm:p-6 text-xs text-gray-800 leading-relaxed whitespace-pre-wrap font-sans text-justify shadow-xs">
            {generatedOutput}
          </div>
        </div>
      </div>
    </div>
  );
};
