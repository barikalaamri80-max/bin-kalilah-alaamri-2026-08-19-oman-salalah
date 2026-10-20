import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import {
  ShieldAlert,
  FileText,
  Volume2,
  Printer,
  Sparkles,
  Presentation,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Coins,
  Truck,
  Search,
  Camera,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { MainHeader, ViewTab } from './components/MainHeader';
import { SlidesExportModal } from './components/SlidesExportModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { EvidenceModal } from './components/EvidenceModal';
import { TTSPlayerBar } from './components/TTSPlayerBar';
import { MinistryMemoView } from './components/MinistryMemoView';
import { AIAdvisorWorkbench } from './components/AIAdvisorWorkbench';
import { FieldEvidenceGallery, FIELD_PHOTOS } from './components/FieldEvidenceGallery';
import { SecurityAccessGate } from './components/SecurityAccessGate';
import { RoyalFourSlidesView } from './components/RoyalFourSlidesView';
import { DuoAudioSimulation } from './components/DuoAudioSimulation';
import { ViolationsLawsMatrix } from './components/ViolationsLawsMatrix';
import { StudioEvidenceUpload } from './components/StudioEvidenceUpload';
import { globalAudioManager } from './services/audioManager';
import {
  initAuth,
  googleSignIn,
  logout,
  getCachedAccessToken,
} from './firebase';
import {
  EVIDENCE_DOCS,
  PILLARS_TRIPTYCH,
  LEGAL_NODES,
  EvidenceDoc,
} from './data/dossierData';
import { generateSpeechAudio } from './services/ttsService';

export default function App() {
  // Password Security Gate State (SALALAH2026)
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      const token = sessionStorage.getItem('bka_access_token') || localStorage.getItem('bka_access_token');
      return token === 'SALALAH2026_AUTHORIZED';
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<EvidenceDoc | null>(null);
  const [isSlidesModalOpen, setIsSlidesModalOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);

  // Active Main View Tab - defaults to the 4 Royal Slides presentation
  const [activeView, setActiveView] = useState<ViewTab>('slides_royal');

  // Audio / TTS State
  const [ttsCurrentTitle, setTtsCurrentTitle] = useState('');
  const [isTTSLoading, setIsTTSLoading] = useState(false);
  const [isTTSPlaying, setIsTTSPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Filter for 10 evidence documents
  const [filterQuery, setFilterQuery] = useState('');

  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token || getCachedAccessToken());
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setAccessToken(null);
  };

  const handleLockApp = () => {
    globalAudioManager.stopAll();
    try {
      sessionStorage.removeItem('bka_access_token');
      localStorage.removeItem('bka_access_token');
    } catch (e) {
      console.warn('Storage error:', e);
    }
    setIsUnlocked(false);
  };

  // Play TTS audio with global manager
  const handlePlayTTS = async (text: string, title: string) => {
    globalAudioManager.stopAll();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setTtsCurrentTitle(title);
    setIsTTSLoading(true);
    setIsTTSPlaying(false);

    try {
      const audioUrl = await generateSpeechAudio(
        text,
        'Fenrir',
        'Authoritative, calm, judicial narrator in classical Arabic with professional pacing'
      );

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsTTSPlaying(true);
        setIsTTSLoading(false);
      };

      audio.onpause = () => {
        setIsTTSPlaying(false);
      };

      audio.onended = () => {
        setIsTTSPlaying(false);
        setTtsCurrentTitle('');
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsTTSLoading(false);
        setIsTTSPlaying(false);
      };

      await globalAudioManager.playAudio(audio);
    } catch (err: any) {
      console.error('Failed to generate speech:', err);
      setIsTTSLoading(false);
      setIsTTSPlaying(false);
      alert('تعذر توليد القراءة الصوتية حالياً. يرجى التأكد من اتصال الإنترنت.');
    }
  };

  const handleToggleTTSPlay = () => {
    if (!audioRef.current) return;
    if (isTTSPlaying) {
      audioRef.current.pause();
    } else {
      globalAudioManager.playAudio(audioRef.current).catch(() => {});
    }
  };

  const handleStopTTS = () => {
    globalAudioManager.stopAll();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsTTSPlaying(false);
    setIsTTSLoading(false);
    setTtsCurrentTitle('');
  };

  const handlePlayFullDossierTTS = () => {
    const fullSummaryText = `شركة بن كليلة العامري للتجارة والاستثمار ش.م.م. 
ملف رقابي سيادي موجه لدائرة حماية المنافسة ومنع الاحتكار بسلطنة عمان.
إلى الفاضل خالد المسروري المحترم.
التحول اللوجستي والاستثماري: هدر الوساطة مقابل كفاءة الشراكة الوطنية المباشرة.
سداد نقدي مسبق بنسبة 100% بحساب شركة المطاحن العمانية ببنك مسقط بمبلغ 18,640 ريالاً عمانياً، بما يبرهن على انتفاء أي مخاطر ائتمانية.
القيمة الاستثمارية السنوية للخط تفوق 1,870,000 ريال عماني بتصدير 24 ألف كيس شهرياً.
المرتكز القانوني: المادتان 155 و156 من قانون المعاملات المدنية تلزمان بتسليم المبيع وملحقاته الصالحة للغرض، وتسليم وثائق معيبة يمثل امتناعاً مقنعاً عن البيع وإساءة استغلال للوضع المهيمن وفق المادة 10 من قانون حماية المنافسة.`;

    handlePlayTTS(fullSummaryText, 'الملخص التنفيذي للمذكرة الرقابية');
  };

  const filteredDocs = EVIDENCE_DOCS.filter(
    (d) =>
      d.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      d.title.includes(filterQuery) ||
      d.shortDesc.includes(filterQuery) ||
      d.tag.includes(filterQuery)
  );

  // If locked, render the royal password gate
  if (!isUnlocked) {
    return <SecurityAccessGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return (
    <div
      className="min-h-screen bg-[#FAF9F6] text-[#23153c] flex flex-col font-sans selection:bg-[#C59B27] selection:text-white relative"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(250, 249, 246, 0.94), rgba(250, 249, 246, 0.98)), url('/assets/aistudio/Videoframe_20260904_003537_com.huawei.himovie.overseas_7b184af5.jpg')`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header with Navigation and Authentic Seal */}
      <MainHeader
        user={user}
        activeView={activeView}
        onChangeView={(view) => {
          globalAudioManager.stopAll();
          setActiveView(view);
        }}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSlides={() => setIsSlidesModalOpen(true)}
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        onPlayFullTTS={handlePlayFullDossierTTS}
        isTTSPlaying={isTTSPlaying}
        onLockApp={handleLockApp}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12 flex-1 w-full">
        {/* VIEW 0: ROYAL 4 SLIDES PRESENTATION */}
        {activeView === 'slides_royal' && (
          <RoyalFourSlidesView
            onNavigateToUpload={() => setActiveView('studio_upload')}
            onNavigateToLaws={() => setActiveView('violations_laws')}
          />
        )}

        {/* VIEW 0.5: DUO AUDIO SIMULATION (TWO SPEAKERS FULL STORY) */}
        {activeView === 'dialogue_sim' && <DuoAudioSimulation />}

        {/* VIEW 0.7: VIOLATIONS & OMANI LAWS TABLE */}
        {activeView === 'violations_laws' && <ViolationsLawsMatrix />}

        {/* VIEW 0.8: DIRECT STUDIO EVIDENCE UPLOAD */}
        {activeView === 'studio_upload' && <StudioEvidenceUpload />}

        {/* VIEW 1: MASTER DOSSIER (BKA-ANTITRUST) */}
        {activeView === 'dossier' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Hero Banner with Official Field Border Fleet */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37] shadow-xl text-white bg-[#1e1233]">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage: `url('/assets/aistudio/Videoframe_20260904_003536_com.huawei.himovie.overseas_c92223b8.jpg')`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#1e1233] via-[#1e1233]/85 to-transparent"></div>

              <div className="relative z-10 p-6 sm:p-10 space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                    إيداع رقابي رسمي وسيادي
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#C59B27]/30 text-amber-200 border border-[#D4AF37]">
                    BKA/EXP-ARE/2026/10
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  المنظومة التنفيذية والرقابية الفاصلة — خط تصدير أعلاف بركات
                </h1>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  تفكيك قانوني وفني معتمد أمام دائرة حماية المنافسة ومنع الاحتكار بوزارة التجارة والصناعة وترويج الاستثمار، يثبت كفاءة مسار الشراكة الوطنية المباشرة ويبرهن على الامتناع المقنّع عن التوريد وافتعال التناقض المستندي لفرض وساطة غير مشروعة.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('ministry')}
                    className="px-4 py-2 rounded-xl gold-gradient-bg text-[#23153c] font-black text-xs hover:brightness-105 transition flex items-center shadow-md"
                  >
                    <FileText className="w-4 h-4 ml-1.5" />
                    <span>قراءة مذكرة ديوان الوزارة (المسروري)</span>
                  </button>

                  <button
                    onClick={() => setActiveView('ai_advisor')}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 border border-white/20 font-bold text-xs transition flex items-center"
                  >
                    <Sparkles className="w-4 h-4 ml-1.5 text-amber-400" />
                    <span>المستشار الذكي وكاشف المغالطات</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Document Meta Banner */}
            <section aria-label="بيانات المذكرة الرسمية" className="bg-white/95 rounded-xl border border-[#D4AF37]/50 p-4 shadow-sm flex flex-wrap justify-between items-center gap-4 text-xs font-semibold text-gray-700 backdrop-blur-xs">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[#23153c] font-bold">الحالة الإجرائية:</span>
                <span className="bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded border border-amber-300 font-bold">
                  مكتمل الأركان ومودع للمعاينة الرقابية
                </span>
              </div>
              <div>
                مرجع المذكرة:{' '}
                <span className="font-mono text-[#23153c] font-black">
                  BKA-ANTITRUST-OM-2026
                </span>
              </div>
              <div>
                تاريخ التسجيل والتوثيق:{' '}
                <span className="font-mono font-bold text-gray-800">2026/02/10م</span>
              </div>
              <div>
                جهة الإيداع:{' '}
                <span className="text-[#23153c] font-bold">
                  دائرة حماية المنافسة ومنع الاحتكار
                </span>
              </div>
            </section>

            {/* SECTION 1: THE LOGISTICAL & FINANCIAL PARADIGM SHIFT */}
            <section className="space-y-6" data-purpose="comparison-paradigm">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37] text-xs font-bold text-amber-900">
                  <Coins className="w-4 h-4 text-[#C59B27]" />
                  <span>الجدوى الاقتصادية ومسارات الإمداد</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#23153c] tracking-tight">
                  التحول اللوجستي والاستثماري: هدر الوساطة مقابل كفاءة الشراكة الوطنية المباشرة
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-medium max-w-4xl mx-auto">
                  مقارنة إحصائية وهندسية تفاضلية بين نموذج الوساطة الالتفافية (المفتعلة) ونموذج شركة بن كليلة الاستثماري المباشر 100% كاش مسبق.
                </p>
              </div>

              {/* Split Cards Container */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Legacy Waste Card */}
                <div className="bg-white rounded-2xl border-2 border-red-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1.5 bg-red-600"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                        نموذج الوساطة والتعطيل الاحتكاري
                      </span>
                      <span className="text-xs font-bold text-gray-400 font-mono">
                        The 1,000km Waste
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-red-950 mb-3">
                      مسار الوساطة الالتفافي (عبر شركة نوفل)
                    </h3>
                    <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 mb-4 text-xs text-red-900 leading-relaxed space-y-2">
                      <p>
                        <strong className="font-bold text-red-950">المسار البيروقراطي:</strong>{' '}
                        إقحام وسيط غير ذي صفة، فرض عمولة إجبارية قدرها (650 ر.ع) لكل مقطورة، واحتجاز الشاحنات لأكثر من 57 يوماً بتضارب الشهادات البيطرية المصنوعة عمداً.
                      </p>
                      <p>
                        <strong className="font-bold text-red-950">النتيجة الكارثية:</strong>{' '}
                        تعطيل الشاحنات بالمنفذ الحدودي، مصادرة وتلف الأعلاف، ومحاولة خطف عميل سويحان عبر تسريب البيانات الاستثمارية للوسيط.
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs text-gray-700">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span>كلفة شحن وتفريغ التوائية إضافية</span>
                        <span className="font-bold text-red-600 font-num">
                          +650.000 ر.ع / حمولة
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span>زمن العبور الجمركي المستندي</span>
                        <span className="font-bold text-red-600 font-num">
                          57 يوماً (تأخير مقصود)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                        <span>المخاطر الائتمانية والتشغيلية</span>
                        <span className="font-bold text-red-600">
                          تهديد سلامة القطيع واختناق المنفذ
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-gray-100 text-center">
                    <span className="text-xs text-gray-500 font-medium">
                      وسيلة ضغط لاحتكار الحصص التصديرية وتجفيف السيولة
                    </span>
                  </div>
                </div>

                {/* Direct Solution Card */}
                <div className="bg-white rounded-2xl border-2 border-[#D4AF37] p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 left-0 h-1.5 gold-gradient-bg"></div>
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-50 border border-[#D4AF37]/40 px-3 py-1 rounded-full">
                        نموذج الشراكة الوطنية المستدامة
                      </span>
                      <span className="text-xs font-bold text-[#8C6811] font-mono">
                        The Direct Solution
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-[#23153c] mb-3">
                      مسار شركة بن كليلة المباشر والسيادي
                    </h3>
                    <div className="bg-amber-50/70 border border-[#D4AF37]/30 rounded-xl p-4 mb-4 text-xs text-[#23153c] leading-relaxed space-y-2">
                      <p>
                        <strong className="font-bold text-amber-950">المسار المباشر والمستدام:</strong>{' '}
                        شراء مباشر من صوامع المطاحن العمانية، سداد كاش نقدي مسبق 100%، إصدار فوري لملحقات المبيع القانونية المطابقة لاشتراطات وزارة التغير المناخي والبيئة بدولة الإمارات.
                      </p>
                      <p>
                        <strong className="font-bold text-amber-950">الأثر الاقتصادي:</strong>{' '}
                        تدفق نقدي سنوي مباشر يفوق 1.87 مليون ر.ع، تصفير أزمنة التعطيل إلى أقل من 12 ساعة، وضمان الأمن الغذائي لمزارع سويحان (160,000 طير دجاج).
                      </p>
                    </div>

                    <div className="space-y-2.5 text-xs text-gray-700">
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F6] border border-[#D4AF37]/30">
                        <span>توفير التكاليف والهدر اللوجستي المباشر</span>
                        <span className="font-bold text-emerald-600 font-num">
                          توفير ذاتي 52.36%
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F6] border border-[#D4AF37]/30">
                        <span>زمن الفسح الجمركي والتخليص المؤتمت</span>
                        <span className="font-bold text-emerald-600 font-num">
                          أقل من 12 ساعة (اتفاقية SLA)
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F6] border border-[#D4AF37]/30">
                        <span>الملاءة المالية وسرعة التسوية</span>
                        <span className="font-bold text-[#23153c]">
                          100% Cash in Advance (صفر مخاطر)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-[#D4AF37]/20 text-center">
                    <span className="text-xs text-[#8C6811] font-bold">
                      استدامة تعاقدية وشفافية تجارية وفق قانون حماية المنافسة
                    </span>
                  </div>
                </div>
              </div>

              {/* Giant Metric Banner Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-purpose="giant-kpis">
                <div className="purple-panel rounded-2xl p-6 sm:p-8 text-center text-white flex flex-col justify-center items-center shadow-purple-card relative overflow-hidden">
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-[#C59B27]/10 blur-xl pointer-events-none"></div>
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gold-gradient font-num mb-2">
                    100%
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-amber-200 mb-2">
                    سداد نقدي مسبق بحساب المطاحن ببنك مسقط
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-md font-normal leading-relaxed">
                    تم سداد كامل قيمة الشحنات بقيمة{' '}
                    <strong className="text-[#E8C56B] font-num">18,640.000 ر.ع</strong>{' '}
                    مسبقاً وفورياً، بما يبرهن على انتفاء أي ذريعة مالية أو مديونية، ويؤكد الالتزام التام دون أي مخاطر ائتمانية (Zero Credit Exposure).
                  </p>
                </div>

                <div className="purple-panel rounded-2xl p-6 sm:p-8 text-center text-white flex flex-col justify-center items-center shadow-purple-card relative overflow-hidden">
                  <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-[#C59B27]/10 blur-xl pointer-events-none"></div>
                  <span className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gold-gradient font-num mb-2">
                    1,870,000
                  </span>
                  <h4 className="text-lg sm:text-xl font-black text-amber-200 mb-2">
                    ريال عماني: القيمة الاستثمارية السنوية للخط
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-300 max-w-md font-normal leading-relaxed">
                    العائد السنوي المتدفق للمنتج الوطني عبر تصدير{' '}
                    <strong className="text-[#E8C56B] font-num">24,000 كيس شهرياً</strong>{' '}
                    (500 طن متري) لتغذية مزارع الدواجن المستهدفة في سويحان بدولة الإمارات.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 2: THE GOLDEN ARCHITECTURE & ANTITRUST NODES */}
            <section className="space-y-6 print-break" data-purpose="legal-architecture">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37] text-xs font-bold text-amber-900">
                  <Scale className="w-4 h-4 text-[#C59B27]" />
                  <span>المرتكزات والمحاور القضائية الأربعة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#23153c] tracking-tight">
                  الهندسة الرقابية الفاصلة: تفكيك وتفنيد دفوع المصنع والوسيط
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-medium max-w-3xl mx-auto">
                  تفكيك قانوني وفني معتمد يبين عدم مشروعية حجب المستندات ومحاولة فرض التبعية والوساطة القسرية.
                </p>
              </div>

              {/* Architectural Diagram Canvas */}
              <div className="relative bg-white border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden">
                <div className="hidden lg:block absolute inset-0 pointer-events-none">
                  <div className="circuit-line" style={{ top: '25%', left: '24%', width: '26%', height: '3px', transform: 'rotate(18deg)' }}></div>
                  <div className="circuit-line" style={{ top: '25%', right: '24%', width: '26%', height: '3px', transform: 'rotate(-18deg)' }}></div>
                  <div className="circuit-line" style={{ bottom: '25%', left: '24%', width: '26%', height: '3px', transform: 'rotate(-18deg)' }}></div>
                  <div className="circuit-line" style={{ bottom: '25%', right: '24%', width: '26%', height: '3px', transform: 'rotate(18deg)' }}></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
                  {/* LEFT COLUMN: Nodes A & C */}
                  <div className="space-y-6">
                    <div className="purple-panel rounded-2xl p-5 shadow-purple-card text-right hover:scale-[1.02] transition-transform duration-300">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
                        <span className="text-xs font-black text-amber-300">
                          {LEGAL_NODES[0].axis}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-[#E8C56B] border border-[#C59B27]">
                          {LEGAL_NODES[0].code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {LEGAL_NODES[0].title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        وفقاً للمادتين (155 و 156) من قانون المعاملات المدنية العماني، يشمل البيع حكماً{' '}
                        <strong className="text-[#E8C56B]">ملحقات المبيع الصالحة للغرض المقصود</strong>. إن تسليم أعلاف تصديرية مصحوبة بشهادات معيبة تمتنع الجمارك عن قبولها يمثل قانوناً{' '}
                        <strong className="text-rose-300">امتناعاً مقنعاً عن البيع (Constructive Refusal to Deal)</strong>.
                      </p>
                    </div>

                    <div className="purple-panel rounded-2xl p-5 shadow-purple-card text-right hover:scale-[1.02] transition-transform duration-300">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
                        <span className="text-xs font-black text-amber-300">
                          {LEGAL_NODES[2].axis}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-[#E8C56B] border border-[#C59B27]">
                          {LEGAL_NODES[2].code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {LEGAL_NODES[2].title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        تعمد المصنع تصدير شحنات دجاج لاحم (Broiler) مع تسليم إقرار سلامة أعلاف خاص بـ{' '}
                        <strong className="text-rose-300">علف بياض (Layer 16%) صادر لعام 2025</strong>، وهو فخ إجرائي خطير كان سيتسبب في إدراج المستثمر العماني بالقائمة السوداء ومصادرة الشحنات بدولة المقصد لولا اليقظة الرقابية.
                      </p>
                    </div>
                  </div>

                  {/* CENTER COLUMN: The Golden Core */}
                  <div className="flex flex-col items-center justify-center text-center p-4">
                    <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full gold-gradient-bg p-1 shadow-gold-glow flex items-center justify-center animate-pulse">
                      <div className="w-full h-full rounded-full bg-[#23153c] border-4 border-amber-300 p-4 flex flex-col items-center justify-center text-center">
                        <Scale className="w-8 h-8 text-amber-400 mb-2" />
                        <div className="text-xs font-black text-amber-200 tracking-wider">
                          المرتكز السيادي
                        </div>
                        <div className="text-sm sm:text-base font-black text-white leading-tight mt-1">
                          المادتان 155 و 156 معاملات مدنية
                        </div>
                        <div className="text-[11px] font-bold text-amber-400 mt-1">
                          + المادة (10) قانون حماية المنافسة 67/2014
                        </div>
                      </div>
                    </div>
                    <span className="mt-4 text-xs font-black text-[#23153c] bg-amber-100 border border-[#D4AF37] px-4 py-1 rounded-full shadow-sm">
                      الحظر التام لإساءة استغلال الوضع المهيمن
                    </span>
                  </div>

                  {/* RIGHT COLUMN: Nodes B & D */}
                  <div className="space-y-6">
                    <div className="purple-panel rounded-2xl p-5 shadow-purple-card text-right hover:scale-[1.02] transition-transform duration-300">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
                        <span className="text-xs font-black text-amber-300">
                          {LEGAL_NODES[1].axis}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-[#E8C56B] border border-[#C59B27]">
                          {LEGAL_NODES[1].code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {LEGAL_NODES[1].title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        أثبت الإشعار البنكي الرسمي تحويل مبلغ (280 ر.ع) من حساب نوفل مباشرة إلى حساب المطاحن ببنك مسقط لسداد فواتير التصدير، مع إقرار مندوب المصنع &quot;مهند&quot; صوتياً بقيد نوفل كوكيل وتوريد أسعار حصرية له دون غيره لخطف مشتري سويحان.
                      </p>
                    </div>

                    <div className="purple-panel rounded-2xl p-5 shadow-purple-card text-right hover:scale-[1.02] transition-transform duration-300">
                      <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-2 mb-3">
                        <span className="text-xs font-black text-amber-300">
                          {LEGAL_NODES[3].axis}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-[#E8C56B] border border-[#C59B27]">
                          {LEGAL_NODES[3].code}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {LEGAL_NODES[3].title}
                      </h4>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        إصرار مسؤولي المطاحن على طباعة (0 يوم) على البطاقة التعريفية مع وجود مضادات كوكسيديا تتطلب نظاماً (7 أيام) في شهادة التحليل، هو تلاعب فني مقصود يهدف لرفض الشحنة بموجب تعميم وزارة البيئة بدولة الإمارات رقم 365/2021.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-xl gold-gradient-bg p-3 sm:p-4 text-center shadow-md">
                  <p className="text-xs sm:text-sm font-black text-[#23153c]">
                    الامتناع المقنع عن تسليم ملحقات المبيع السليمة = جريمة مكتملة الأركان لإساءة استغلال الوضع المهيمن واحتكار منافذ التصدير
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 3: THE DOCUMENTARY TRIPTYCH (PODIUM) */}
            <section className="space-y-6" data-purpose="document-triptych">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37] text-xs font-bold text-amber-900">
                  <FileText className="w-4 h-4 text-[#C59B27]" />
                  <span>المطابقة الثلاثية غير القابلة للتجزئة</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#23153c] tracking-tight">
                  المنظومة المستندية التصديرية الثلاثية المتطابقة
                </h2>
                <p className="text-sm sm:text-base text-gray-600 font-medium max-w-2xl mx-auto">
                  المواصفات المستندية الثلاثية الإلزامية التي يفرضها النظام الجمركي البيطري بدولة المقصد لضمان نفاذ المنتجات دون عوائق.
                </p>
              </div>

              <div className="flex justify-center">
                <div className="inline-block badge-pill-gold text-[#23153c] px-6 py-2 rounded-full font-black text-xs sm:text-sm border border-amber-300 shadow-md">
                  الركائز الثلاث غير القابلة للتجزئة أو التضارب المستندي
                </div>
              </div>

              <div className="relative pt-8 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {/* Pillar 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[280px] purple-panel rounded-2xl p-6 text-center border-2 border-[#C59B27] transform hover:-translate-y-2 transition-all duration-300 shadow-purple-card">
                      <div className="w-12 h-12 rounded-full gold-gradient-bg mx-auto flex items-center justify-center text-[#23153c] font-black text-lg shadow mb-3">
                        1
                      </div>
                      <h4 className="text-base font-black text-white mb-1">
                        {PILLARS_TRIPTYCH[0].title}
                      </h4>
                      <span className="text-[11px] font-bold text-amber-300 block mb-3 font-mono">
                        {PILLARS_TRIPTYCH[0].subtitle}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed text-right">
                        {PILLARS_TRIPTYCH[0].desc}
                      </p>
                    </div>
                    <div className="w-full mt-4 bg-amber-50 border border-[#D4AF37] rounded-xl p-3 text-center shadow-sm">
                      <span className="text-xs font-black text-amber-950 block">
                        {PILLARS_TRIPTYCH[0].role}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {PILLARS_TRIPTYCH[0].subRole}
                      </span>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[280px] purple-panel rounded-2xl p-6 text-center border-2 border-amber-300 transform md:-translate-y-4 hover:-translate-y-6 transition-all duration-300 shadow-gold-glow">
                      <div className="w-12 h-12 rounded-full gold-gradient-bg mx-auto flex items-center justify-center text-[#23153c] font-black text-lg shadow mb-3">
                        2
                      </div>
                      <h4 className="text-base font-black text-amber-300 mb-1">
                        {PILLARS_TRIPTYCH[1].title}
                      </h4>
                      <span className="text-[11px] font-bold text-white block mb-3 font-mono">
                        {PILLARS_TRIPTYCH[1].subtitle}
                      </span>
                      <p className="text-xs text-gray-200 leading-relaxed text-right">
                        {PILLARS_TRIPTYCH[1].desc}
                      </p>
                    </div>
                    <div className="w-full mt-4 bg-amber-100 border-2 border-[#D4AF37] rounded-xl p-3 text-center shadow">
                      <span className="text-xs font-black text-[#23153c] block">
                        {PILLARS_TRIPTYCH[1].role}
                      </span>
                      <span className="text-[10px] text-[#8C6811] font-bold">
                        {PILLARS_TRIPTYCH[1].subRole}
                      </span>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full max-w-[280px] purple-panel rounded-2xl p-6 text-center border-2 border-[#C59B27] transform hover:-translate-y-2 transition-all duration-300 shadow-purple-card">
                      <div className="w-12 h-12 rounded-full gold-gradient-bg mx-auto flex items-center justify-center text-[#23153c] font-black text-lg shadow mb-3">
                        3
                      </div>
                      <h4 className="text-base font-black text-white mb-1">
                        {PILLARS_TRIPTYCH[2].title}
                      </h4>
                      <span className="text-[11px] font-bold text-amber-300 block mb-3 font-mono">
                        {PILLARS_TRIPTYCH[2].subtitle}
                      </span>
                      <p className="text-xs text-gray-300 leading-relaxed text-right">
                        {PILLARS_TRIPTYCH[2].desc}
                      </p>
                    </div>
                    <div className="w-full mt-4 bg-amber-50 border border-[#D4AF37] rounded-xl p-3 text-center shadow-sm">
                      <span className="text-xs font-black text-amber-950 block">
                        {PILLARS_TRIPTYCH[2].role}
                      </span>
                      <span className="text-[10px] text-gray-600">
                        {PILLARS_TRIPTYCH[2].subRole}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: DIGITAL EVIDENCE VAULT (DOC-01 to DOC-10) */}
            <section className="space-y-6" data-purpose="evidence-repository">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37] text-xs font-bold text-amber-900">
                    <ShieldAlert className="w-4 h-4 text-[#C59B27]" />
                    <span>حرز الوثائق والمستندات القضائية</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#23153c] tracking-tight">
                    مستودع الأدلة الثبوتية الرقمي الـ 10 وسجل الحيازة القانونية
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">
                    أدلة قطعية وقيد مستندي وبنكي دامغ تم توثيقه وإيداعه رسمياً لإثبات التواطؤ الاحتكاري وعرقلة التجارة الوطنية.
                  </p>
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    placeholder="تصفية الأدلة (رقم، اسم، تصنيف)..."
                    className="w-full pr-9 pl-4 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:border-[#D4AF37] bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Grid of 10 Evidence Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredDocs.map((docItem) => {
                  const tagColorClass =
                    docItem.tagType === 'financial'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                      : docItem.tagType === 'collusion' || docItem.tagType === 'procedural'
                      ? 'text-red-700 bg-red-50 border-red-200'
                      : docItem.tagType === 'official' || docItem.tagType === 'regulatory'
                      ? 'text-amber-800 bg-amber-50 border-amber-200'
                      : 'text-purple-800 bg-purple-50 border-purple-200';

                  return (
                    <div
                      key={docItem.id}
                      className="bg-white rounded-xl border border-[#D4AF37]/40 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:border-[#C59B27]"
                      data-purpose="doc-card"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#23153c] text-amber-200 font-num">
                            {docItem.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tagColorClass}`}>
                            {docItem.tag}
                          </span>
                        </div>
                        <h5 className="text-xs font-black text-[#23153c] mb-1 group-hover:text-amber-900 transition">
                          {docItem.title}
                        </h5>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          {docItem.shortDesc}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-gray-100 flex gap-1.5">
                        <button
                          onClick={() => setSelectedDoc(docItem)}
                          className="flex-1 py-1.5 rounded-lg bg-amber-50 hover:bg-[#C59B27] text-[#23153c] hover:text-white border border-[#D4AF37] text-[11px] font-bold transition shadow-xs"
                        >
                          معاينة المستند
                        </button>
                        <button
                          onClick={() =>
                            handlePlayTTS(
                              `${docItem.title}. ${docItem.shortDesc}. ${docItem.fullAnalysis}`,
                              docItem.title
                            )
                          }
                          className="p-1.5 rounded-lg border border-gray-200 hover:border-[#D4AF37] text-gray-600 hover:text-[#23153c] bg-white transition"
                          title="قراءة صوتية للدليل"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* MINI GALLERY PREVIEW IN DOSSIER */}
            <section className="bg-white rounded-3xl border-2 border-gray-200 p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#C59B27]" />
                  <h3 className="text-base font-black text-[#23153c]">
                    التوثيق الميداني للأسطول والمستودعات ومنافذ العبور
                  </h3>
                </div>
                <button
                  onClick={() => setActiveView('gallery')}
                  className="text-xs font-bold text-amber-900 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>عرض المعرض الميداني الكامل (8 صور)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FIELD_PHOTOS.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActiveView('gallery')}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 cursor-pointer group"
                  >
                    <img
                      src={p.src}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2 text-white">
                      <span className="text-[10px] font-bold truncate">{p.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 5: OFFICIAL ENDORSEMENT & SOVEREIGN SIGN-OFF */}
            <section
              className="purple-panel rounded-3xl p-6 sm:p-10 shadow-purple-card text-white relative overflow-hidden"
              data-purpose="official-signoff"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Authentic User Company Seal */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center border-b lg:border-b-0 lg:border-l border-[#D4AF37]/30 pb-6 lg:pb-0 lg:pl-8">
                  <div className="w-36 h-36 rounded-full border-4 border-amber-300 p-1 bg-white shadow-gold-glow mb-4 overflow-hidden flex items-center justify-center">
                    <img
                      src="/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg"
                      alt="الختم الرسمي لشركة بن كليلة العامري للتجارة والاستثمار"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h4 className="text-base font-black text-amber-200">
                    شركة بن كليلة العامري
                  </h4>
                  <span className="text-xs text-gray-300">للتجارة والاستثمار ش.م.م</span>
                  <div className="mt-3 px-3 py-1 rounded-full bg-[#C59B27]/20 border border-[#C59B27] text-[11px] font-bold text-[#E8C56B]">
                    الختم الرسمي والاعتماد السيادي المعتمد
                  </div>
                </div>

                {/* Legal Statement & Sign-off Details */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className="h-2 w-8 gold-gradient-bg rounded-full"></span>
                    <span className="text-xs font-bold text-amber-300 tracking-wider uppercase">
                      السند التنفيذي والإجرائي
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    إيداع رسمي مشفوع بالأدلة الجنائية والاقتصادية أمام دائرة حماية المنافسة ومنع الاحتكار
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    بناءً على الصلاحيات المقررة بموجب{' '}
                    <strong className="text-amber-200">المرسوم السلطاني رقم 67/2014</strong>{' '}
                    بإصدار قانون حماية المنافسة ومنع الاحتكار، وبموجب أحكام المادتين (155 و156) من قانون المعاملات المدنية؛ نلتمس إلزام شركة المطاحن العمانية بتسليم ملحقات المبيع القانونية لشحنات أعلاف بركات لاحم فوراً، ووقف فرض التبعية والوساطة الإجبارية لشركة نوفل، والتحقيق في ممارسات إساءة استغلال الوضع المهيمن لتعطيل التصدير الوطني والاستثمار المشترك.
                  </p>
                  <div className="pt-4 border-t border-[#D4AF37]/20 flex flex-wrap justify-between items-center gap-4 text-xs">
                    <div>
                      <span className="text-gray-400 block">المفوض بالتوقيع والاعتماد:</span>
                      <span className="font-black text-white text-sm">
                        بريك بن محمد بن كليلة العامري
                      </span>
                      <span className="text-amber-300 text-xs block font-bold">
                        المدير العام والمسؤول التنفيذي
                      </span>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-400 block font-mono">
                        DIGITAL SIGNATURE HASH:
                      </span>
                      <span className="font-mono text-[#E8C56B] text-[11px]">
                        BKA-9942-ANTITRUST-CONFIRMED-2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: MINISTRY MEMO VIEW */}
        {activeView === 'ministry' && (
          <MinistryMemoView
            onPlayTTS={handlePlayTTS}
            isTTSPlaying={isTTSPlaying}
          />
        )}

        {/* VIEW 3: AI ADVISOR WORKBENCH */}
        {activeView === 'ai_advisor' && (
          <AIAdvisorWorkbench
            onPlayTTS={handlePlayTTS}
            isTTSPlaying={isTTSPlaying}
          />
        )}

        {/* VIEW 4: FIELD EVIDENCE & FLEET GALLERY */}
        {activeView === 'gallery' && <FieldEvidenceGallery />}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[#D4AF37]/30 bg-white/90 py-8 text-center text-xs text-gray-600 no-print backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-[#23153c]">
            وثيقة تنفيذية سرية معتمدة — صادرة عن شركة بن كليلة العامري للتجارة والاستثمار ش.م.م لصالح جهات الاختصاص الرقابية
          </p>
          <p className="text-[11px]">
            السجل التجاري: 1111041 / 1361596 | صلالة — محافظة ظفار | جميع الحقوق والبيانات محفوظة © 2026 سلطنة عمان.
          </p>
        </div>
      </footer>

      {/* Evidence Document Preview Modal */}
      <EvidenceModal
        docItem={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        user={user}
        onPlayTTS={(text, title) => handlePlayTTS(text, title)}
        isTTSPlaying={isTTSPlaying}
        onRequireLogin={handleLogin}
      />

      {/* Google Slides Integration Modal */}
      <SlidesExportModal
        isOpen={isSlidesModalOpen}
        onClose={() => setIsSlidesModalOpen(false)}
        user={user}
        accessToken={accessToken}
        onRequireLogin={handleLogin}
      />

      {/* Live Voice Conversation Modal (Gemini 3.8 Live API) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      {/* Persistent Floating TTS Player */}
      <TTSPlayerBar
        currentTitle={ttsCurrentTitle}
        isPlaying={isTTSPlaying}
        isLoading={isTTSLoading}
        onTogglePlay={handleToggleTTSPlay}
        onStop={handleStopTTS}
      />
    </div>
  );
}
