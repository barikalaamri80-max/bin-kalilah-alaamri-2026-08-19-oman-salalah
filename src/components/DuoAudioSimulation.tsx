import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  MessageSquare,
  Scale,
  UserCheck,
  Building,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { globalAudioManager } from '../services/audioManager';
import { generateSpeechAudio } from '../services/ttsService';

interface DialogueTurn {
  id: number;
  speaker: 'investor' | 'legal_advisor';
  speakerName: string;
  speakerRole: string;
  speakerTitle: string;
  avatarBg: string;
  speechText: string;
  legalNote?: string;
  timestamp: string;
}

const DUO_DIALOGUE: DialogueTurn[] = [
  {
    id: 1,
    speaker: 'investor',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'صاحب شركة بن كليلة العامري',
    speakerTitle: 'المستثمر الوطني المتضرر',
    avatarBg: 'bg-amber-600',
    speechText: `بسم الله الرحمن الرحيم.. في العام الماضي، عانيت لمدة سنة كاملة مع أحد المصانع في محافظة ظفار في محاولة لمعالجة ممارسات الإغراق والتمييز التي قادها أطراف وافدون وأضرت بالسوق المحلي بصورة لا تُطاق. وجدت نفسي بين خيارين: إما أن أسلك طرقاً ملتوية لا يرضاها الله ولا تربيت عليها، أو أن أحفظ كرامتي ونزاهتي وأصفي تجارتي. فاخترت إغلاق مستودع صلالة نهائياً في الأول من مايو 2026م محتسباً، وتجنبت التذمر أو إثارة الشكاوى.`,
    legalNote: 'واقعة إغلاق مستودع صلالة مايو 2026 تجنباً للإغراق والوساطات غير المشروعة',
    timestamp: '00:00 - مايو 2026',
  },
  {
    id: 2,
    speaker: 'legal_advisor',
    speakerName: 'المستشار الرقابي والقانوني',
    speakerRole: 'خبير المنافسة ومنع الاحتكار',
    speakerTitle: 'التكييف النظامي للملف',
    avatarBg: 'bg-[#23153c]',
    speechText: `هذه نقطة جوهرية وموثقة في السرد الرقابي.. خيارك بالانسحاب الشريف من سوق التجزئة بصلالة يبرهن على حسن النية ورفض الشبهات. والمشرع العماني في قانون حماية المنافسة ومنع الاحتكار بالمرسوم السلطاني 67/2014 وضع المادة الثامنة والعاشرة خصيصاً لحماية مثل هذه الاستثمارات الوطنية من الممارسات الإقصائية والإغراق. وكيف انفتحت نافذة التصدير بعد ذلك؟`,
    legalNote: 'المادة (8) و (10) من قانون حماية المنافسة — حظر الإغراق والممارسات الإقصائية',
    timestamp: '00:45',
  },
  {
    id: 3,
    speaker: 'investor',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'صاحب شركة بن كليلة العامري',
    speakerTitle: 'المستثمر الوطني المتضرر',
    avatarBg: 'bg-amber-600',
    speechText: `سبحان الله، في نفس الشهر مايو 2026، عوضني الله بفرصة استثمارية شريفة ونافذة أمل حقيقية؛ دخلنا في شراكة استراتيجية مع عمي بدولة الإمارات الشقيقة لتوريد أعلاف الدواجن من علامة «بركات» إلى منشأة كبرى في منطقة سويحان، وهي مزرعة بركة الوقن، بطاقة تعاقدية تصل إلى 24,000 كيس شهرياً، وبقيمة استثمارية سنوية تتجاوز مليوناً وثمانمائة وسبعين ألف ريال عماني، والأهم من ذلك: بسداد نقدي كاش مسبق 100%، دون طلب أي تسهيل أو تأجيل.`,
    legalNote: 'عقد توريد 24 ألف كيس شهرياً — قيمة سنوية 1.87 مليون ر.ع — سداد كاش مسبق 100%',
    timestamp: '01:25',
  },
  {
    id: 4,
    speaker: 'legal_advisor',
    speakerName: 'المستشار الرقابي والقانوني',
    speakerRole: 'خبير المنافسة ومنع الاحتكار',
    speakerTitle: 'التكييف النظامي للملف',
    avatarBg: 'bg-[#23153c]',
    speechText: `هذا رقم استثماري استراتيجي يعكس ملاءة مالية فائقة! وسداد الكاش المسبق بنسبة مئة بالمئة ينسف تماماً أية ذريعة قد يدعيها المصنع بوجود مخاطر ائتمانية. وقد قمتَ بالفعل بتحويل 18,640 ريالاً عمانياً مسبقاً بحساب شركة المطاحن العمانية ببنك مسقط. قانوناً، هذا يجعل التزام المصنع بالتسليم الفوري التزاماً باتاً لا يحتمل المماطلة وفق المادتين 155 و156 من قانون المعاملات المدنية العماني. فماذا حدث عند موعد الاستلام والتصدير؟`,
    legalNote: 'المادتان (155) و (156) من قانون المعاملات المدنية — التزام البائع بتسليم المبيع فور الوفاء',
    timestamp: '02:15',
  },
  {
    id: 5,
    speaker: 'investor',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'صاحب شركة بن كليلة العامري',
    speakerTitle: 'المستثمر الوطني المتضرر',
    avatarBg: 'bg-amber-600',
    speechText: `هنا بدأت الصدمة والتعسف الفعلي.. بعد أن قبضوا المبلغ كاش في حسابهم، تفاجأنا بافتعال عراقيل فنية غير منطقية لتعطيل الفسح الجمركي؛ سلمونا شهادات فحص مخبري صادرة من مصنعهم متناقضة مع بطاقة العلف، واشترطوا شرطاً مستحيلاً علمياً وبيطرياً وهو فترة سحب «صفر يوم»، ثم حاولوا فرض علف البياض كبديل قسري وهو لا يتطابق إطلاقاً مع احتياج دواجن اللاحم لسويحان! والنتيجة كانت احتجاز شاحناتنا بالمنفذ الجمركي لأكثر من 57 يوماً متواصلة!`,
    legalNote: 'احتجاز 57 يوماً بالمنفذ — تناقض مخبري مصطنع — شرط صفر يوم سحب المستحيل علمياً',
    timestamp: '03:00',
  },
  {
    id: 6,
    speaker: 'legal_advisor',
    speakerName: 'المستشار الرقابي والقانوني',
    speakerRole: 'خبير المنافسة ومنع الاحتكار',
    speakerTitle: 'التكييف النظامي للملف',
    avatarBg: 'bg-[#23153c]',
    speechText: `هذا التوصيف في الفقه الرقابي الدولي يسمى «الامتناع المقنع عن البيع» (Constructive Refusal to Deal). المصنع لا يقول صراحة رفضت البيع، ولكنه يسلمك مستندات معيبة عمداً تمنعك من إدخال البضاعة المنفذ! هذا انتهاك صريح للفقرة (أ) والفقرة (ب) من المادة (10) من قانون حماية المنافسة ومنع الاحتكار التي تجرم استغلال الوضع المهيمن لفرض شروط مجحفة أو تقييد تدفق السلع والمنتجات. وهل توقف الأمر عند هذا الحد؟`,
    legalNote: 'المادة (10) فقرة أ و ب من قانون حماية المنافسة — جريمة الامتناع المقنع عن التعامل',
    timestamp: '03:55',
  },
  {
    id: 7,
    speaker: 'investor',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'صاحب شركة بن كليلة العامري',
    speakerTitle: 'المستثمر الوطني المتضرر',
    avatarBg: 'bg-amber-600',
    speechText: `لا، بل الأمر زاد خطورة! ظهر طرف وسيط خارجي اسمه نوفل، وتم إقحامه بغير وجه حق ومحاولة إرغامي على أن يتم التصدير من خلاله، مع فرض عمولة إجبارية قدرها 650 ريالاً عمانياً على كل شاحنة! ليس هذا فحسب، بل تم تسريب بيانات عميلنا في سويحان والتواصل معه مباشرة لمحاولة خطف العقد وإقصائي تماماً من المشهد بعد أن بنيت هذه الشراكة!`,
    legalNote: 'إقحام الوسيط نوفل — عمولة إجبارية 650 ر.ع/حمولة — تسريب بيانات العميل بسويحان',
    timestamp: '04:45',
  },
  {
    id: 8,
    speaker: 'legal_advisor',
    speakerName: 'المستشار الرقابي والقانوني',
    speakerRole: 'خبير المنافسة ومنع الاحتكار',
    speakerTitle: 'التكييف النظامي للملف',
    avatarBg: 'bg-[#23153c]',
    speechText: `هذه هي جريمة «التواطؤ واقتسام الأسواق والعملاء» المنصوص عليها في المادتين الثامنة والتاسعة فقرة (ج) من قانون حماية المنافسة. تسريب البيانات التجارية للعميل وفرض وساطة احتكارية ترفع التكلفة بأكثر من 52% يمثل إضراراً متعمداً بالنظام الاقتصادي العام ومحاولة لاحتكار منافذ التصدير الشقيقة. ومصالح المستثمر العماني محمية بنص القانون بقوة. وماذا عن الاجتماع الأخير؟`,
    legalNote: 'المادتان (8) و (9) فقرة ج — حظر التواطؤ واقتسام الأسواق والعملاء',
    timestamp: '05:35',
  },
  {
    id: 9,
    speaker: 'investor',
    speakerName: 'المستثمر بريك العامري',
    speakerRole: 'صاحب شركة بن كليلة العامري',
    speakerTitle: 'المستثمر الوطني المتضرر',
    avatarBg: 'bg-amber-600',
    speechText: `عقدنا اجتماعاً رسمياً مع مسؤولي المصنع، وأعطيناهم مهلة محددة بثلاثة أيام لتصحيح هذه الشهادات وإصدار الفحوصات المطابقة لاشتراطات دولة الإمارات وسحب شرط صفر يوم. لكن انتهت مهلة الأيام الثلاثة كاملة دون أي تجاوب أو تصحيح، وكأن شيئاً لم يكن! ولهذا اتجهت مباشرة إلى وزارة التجارة والصناعة وترويج الاستثمار، وتحديداً إلى الفاضل خالد المسروري المحترم مدير عام مركز حماية المنافسة ومنع الاحتكار.`,
    legalNote: 'انقضاء مهلة الأيام الثلاثة دون رد — اللجوء لديوان عام الوزارة (المسروري)',
    timestamp: '06:20',
  },
  {
    id: 10,
    speaker: 'legal_advisor',
    speakerName: 'المستشار الرقابي والقانوني',
    speakerRole: 'خبير المنافسة ومنع الاحتكار',
    speakerTitle: 'التكييف النظامي للملف',
    avatarBg: 'bg-[#23153c]',
    speechText: `اختيارك لمكتب الفاضل خالد المسروري المحترم هو الإجراء الدستوري والنظامي الأصوب والأقوى. فمركز حماية المنافسة ومنع الاحتكار يتبع مباشرة معالي وزير التجارة والصناعة وترويج الاستثمار، ويمتلك الصلاحيات القانونية بموجب المادة (15) لإلزام المصنع فوراً بتعديل أوضاعه وإزالة المخالفة وتسليم الشهادات المطابقة دون قيد أو وسيط، وبموجب المادتين (17) و (19) لإحالة أي شبهات احتكارية وتواطؤ إلى الادعاء العام لضمان سيادة القانون وحفظ حقوق الاقتصاد الوطني.`,
    legalNote: 'المواد (15) و (17) و (19) — اختصاصات مركز حماية المنافسة والجزاءات الجزائية والإدارية',
    timestamp: '07:10',
  },
];

export const DuoAudioSimulation: React.FC = () => {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTurn, setIsLoadingTurn] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoAdvance, setAutoAdvance] = useState(true);

  const turnsContainerRef = useRef<HTMLDivElement | null>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  const currentTurn = DUO_DIALOGUE[currentTurnIndex];

  // Stop everything on unmount
  useEffect(() => {
    return () => {
      globalAudioManager.stopAll();
    };
  }, []);

  const handleStop = () => {
    globalAudioManager.stopAll();
    setIsPlaying(false);
    setIsLoadingTurn(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      playTurn(currentTurnIndex);
    }
  };

  const playTurn = async (index: number) => {
    if (index >= DUO_DIALOGUE.length) {
      setIsPlaying(false);
      return;
    }

    handleStop();
    setCurrentTurnIndex(index);
    setIsLoadingTurn(true);
    setIsPlaying(true);

    const turn = DUO_DIALOGUE[index];

    // Pick voice style depending on speaker
    const isInvestor = turn.speaker === 'investor';
    const voiceName = isInvestor ? 'Puck' : 'Fenrir';
    const promptStyle = isInvestor
      ? 'An authentic, heartfelt, dignified Omani investor telling his real story with passion, honesty, and clear classical Arabic diction.'
      : 'An authoritative, objective judicial expert and antitrust regulator in official classical Arabic with legal gravitas and calm analytical cadence.';

    try {
      const audioUrl = await generateSpeechAudio(turn.speechText, voiceName, promptStyle);
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;

      audio.onplay = () => {
        setIsLoadingTurn(false);
      };

      audio.onended = () => {
        if (isPlayingRef.current && autoAdvance && index < DUO_DIALOGUE.length - 1) {
          setTimeout(() => {
            playTurn(index + 1);
          }, 800);
        } else {
          setIsPlaying(false);
        }
      };

      audio.onerror = () => {
        console.warn('Gemini TTS turn failed, falling back to speech synthesis');
        fallbackSpeechSynthesis(turn, index);
      };

      globalAudioManager.playAudio(audio).catch(() => {
        fallbackSpeechSynthesis(turn, index);
      });
    } catch (e) {
      console.warn('TTS error, fallback to speech synthesis', e);
      fallbackSpeechSynthesis(turn, index);
    }
  };

  const fallbackSpeechSynthesis = (turn: DialogueTurn, index: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsLoadingTurn(false);
      setIsPlaying(false);
      return;
    }

    handleStop();
    setIsPlaying(true);
    setIsLoadingTurn(false);

    const utterance = new SpeechSynthesisUtterance(turn.speechText);
    utterance.lang = 'ar-SA';
    utterance.rate = (turn.speaker === 'investor' ? 1.0 : 0.92) * playbackSpeed;
    utterance.pitch = turn.speaker === 'investor' ? 1.15 : 0.85;

    utterance.onend = () => {
      if (isPlayingRef.current && autoAdvance && index < DUO_DIALOGUE.length - 1) {
        setTimeout(() => {
          playTurn(index + 1);
        }, 700);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    globalAudioManager.speak(utterance);
  };

  const handleNextTurn = () => {
    if (currentTurnIndex < DUO_DIALOGUE.length - 1) {
      playTurn(currentTurnIndex + 1);
    }
  };

  const handlePrevTurn = () => {
    if (currentTurnIndex > 0) {
      playTurn(currentTurnIndex - 1);
    }
  };

  const handleSelectTurn = (idx: number) => {
    playTurn(idx);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Simulation Master Header Banner */}
      <div className="bg-[#1e1233] rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                المحاكاة الصوتية الحوارية الشاملة — شخصان (بودكاست استقصائي رقابي)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              السرد الكامل للقضية: من إغلاق محل صلالة إلى ديوان عام الوزارة
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed">
              حوار تفصيلي متكامل بين المستثمر المتضرر بريك العامري والمستشار الرقابي، يوثق كل تعسف مع ذكر أرقام مواد قانون حماية المنافسة ومنع الاحتكار العماني.
            </p>
          </div>

          {/* Quick Two Speakers Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center">
                ب.ع
              </span>
              <div className="text-right text-[11px]">
                <p className="font-bold text-amber-200">المستثمر بريك العامري</p>
                <p className="text-gray-400">الشاهد وصاحب الحق</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="w-8 h-8 rounded-full bg-[#23153c] border border-[#D4AF37] text-amber-300 font-black text-xs flex items-center justify-center">
                م.ق
              </span>
              <div className="text-right text-[11px]">
                <p className="font-bold text-amber-200">المستشار الرقابي</p>
                <p className="text-gray-400">التكييف النظامي للمواد</p>
              </div>
            </div>
          </div>
        </div>

        {/* Master Controller Console */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Main Controls: Play, Pause, Next, Prev */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlay}
              className="px-5 py-2.5 rounded-xl gold-gradient-bg text-[#23153c] font-black text-xs hover:brightness-110 active:scale-95 transition shadow-md flex items-center gap-2"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل المحاكاة'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>إيقاف مؤقت للمحاكاة</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isLoadingTurn ? 'جاري التحضير...' : 'تشغيل الحوار الصوتي'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleStop}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
              title="إيقاف نهائي"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrevTurn}
              disabled={currentTurnIndex === 0}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="المقطع السابق"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-amber-300 px-2">
              {currentTurnIndex + 1} / {DUO_DIALOGUE.length}
            </span>

            <button
              onClick={handleNextTurn}
              disabled={currentTurnIndex === DUO_DIALOGUE.length - 1}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="المقطع التالي"
            >
              <SkipBack className="w-4 h-4" />
            </button>
          </div>

          {/* Speed & Auto Advance Controls */}
          <div className="flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-300 hover:text-white">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="rounded accent-amber-500 w-3.5 h-3.5"
              />
              <span>تشغيل تتابعي تلقائي</span>
            </label>

            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              {[0.9, 1.0, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    playbackSpeed === spd ? 'bg-[#C59B27] text-[#23153c]' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE TALKING STAGE */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-gray-300'
              }`}
            ></span>
            <span className="text-xs font-black text-[#23153c]">
              المتحدث الحالي في المحاكاة:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {currentTurn.speakerName} ({currentTurn.speakerRole})
            </span>
          </div>

          <span className="text-xs text-gray-400 font-mono">
            المقطع {currentTurn.id} من {DUO_DIALOGUE.length}
          </span>
        </div>

        {/* Current Active Speech Focus Banner */}
        <div
          className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
            currentTurn.speaker === 'investor'
              ? 'bg-amber-50/70 border-amber-300 shadow-sm'
              : 'bg-[#1e1233] text-white border-[#D4AF37] shadow-lg'
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white shrink-0 shadow-md ${currentTurn.avatarBg}`}
            >
              {currentTurn.speaker === 'investor' ? 'بريك' : 'مستشار'}
            </div>

            <div className="space-y-3 flex-1 text-right">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3
                    className={`font-black text-sm sm:text-base ${
                      currentTurn.speaker === 'investor' ? 'text-[#23153c]' : 'text-amber-300'
                    }`}
                  >
                    {currentTurn.speakerName}
                  </h3>
                  <p
                    className={`text-xs ${
                      currentTurn.speaker === 'investor' ? 'text-amber-800' : 'text-gray-300'
                    }`}
                  >
                    {currentTurn.speakerTitle}
                  </p>
                </div>

                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/10">
                  {currentTurn.timestamp}
                </span>
              </div>

              <p
                className={`text-sm sm:text-base leading-relaxed text-justify font-medium ${
                  currentTurn.speaker === 'investor' ? 'text-gray-900' : 'text-gray-100'
                }`}
              >
                «{currentTurn.speechText}»
              </p>

              {currentTurn.legalNote && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    currentTurn.speaker === 'investor'
                      ? 'bg-amber-100/80 text-amber-950 border border-amber-300'
                      : 'bg-white/10 text-amber-200 border border-white/15'
                  }`}
                >
                  <Scale className="w-4 h-4 text-amber-500 shrink-0" />
                  <span><strong>التوثيق:</strong> {currentTurn.legalNote}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FULL DIALOGUE FEED (All 10 chapters) */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-black text-[#23153c] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#C59B27]" />
            <span>نص التفريغ الكامل للمحاكاة الحوارية (اضغط على أي مقطع للاستماع له فوراً):</span>
          </h3>
          <span className="text-xs text-gray-500 font-bold">10 مقاطع حوارية متتابعة</span>
        </div>

        <div className="space-y-3" ref={turnsContainerRef}>
          {DUO_DIALOGUE.map((turn, idx) => {
            const isSelected = currentTurnIndex === idx;
            return (
              <div
                key={turn.id}
                onClick={() => handleSelectTurn(idx)}
                className={`p-4 rounded-2xl border transition cursor-pointer text-right ${
                  isSelected
                    ? 'border-[#D4AF37] bg-amber-50/60 ring-2 ring-[#D4AF37]/40 shadow-xs'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white shrink-0 text-xs ${turn.avatarBg}`}
                  >
                    0{turn.id}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs text-[#23153c]">
                        {turn.speakerName} — <span className="text-gray-500 font-normal">{turn.speakerRole}</span>
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded">
                          جاري الاستماع الآن
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                      {turn.speechText}
                    </p>

                    {turn.legalNote && (
                      <p className="text-[11px] text-amber-900 font-semibold pt-0.5">
                        ⚖️ {turn.legalNote}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
