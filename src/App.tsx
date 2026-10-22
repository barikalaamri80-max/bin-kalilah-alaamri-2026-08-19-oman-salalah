import React, { useState, useEffect } from 'react';
import {
  FileText,
  Scale,
  Volume2,
  Square,
  Play,
  Sparkles,
  Clock,
  Loader2,
  Presentation,
  Radio,
  FolderOpen,
  ShieldAlert,
  Camera,
} from 'lucide-react';
import MainHeader from './components/MainHeader';
import DuoAudioSimulation from './components/DuoAudioSimulation';
import OperationalDelaySlide from './components/OperationalDelaySlide';
import ViolationsLawsMatrix from './components/ViolationsLawsMatrix';
import AIAdvisorWorkbench from './components/AIAdvisorWorkbench';
import MinistryMemoView from './components/MinistryMemoView';
import RoyalFourSlidesView from './components/RoyalFourSlidesView';
import StudioEvidenceUpload from './components/StudioEvidenceUpload';
import FieldEvidenceGallery from './components/FieldEvidenceGallery';
import { SecurityAccessGate } from './components/SecurityAccessGate';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import PdfPresentationsLibrary from './components/PdfPresentationsLibrary';
import {
  CHRONOLOGY_EVENTS,
  EVIDENCE_MATRICES,
} from './data/dossierData';
import { TWENTY_TWO_SLIDES_DATA } from './data/presentation22SlidesData';

const WELCOME_BRIEF_AUDIO_SCRIPT =
  'الأستاذ خالد المسروري المحترم، دائرة المنافسة والاحتكار، السلام عليكم. لا أتيت بشكوى، ولا أطلب تعويضاً. أضع بين أيديكم وقائع، والحكم لكم. كامل التعاملات مسددة مئة بالمئة نقداً مقدماً، والهدف هو المطابقة المستندية فقط. خمسة أشهر وثمانية عشر يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة ألفين وستة وعشرين.';
import {
  speakArabicText,
  speakSequence,
  stopAllAudio,
  subscribeToTTS,
  isSequentialPlaybackActive,
} from './services/ttsService';
import {
  StoredPdfPresentation,
  BUILT_IN_PRESENTATION,
} from './services/pdfStorageService';

type NavTab =
  | 'royal_slides'
  | 'duo_podcast'
  | 'laws_matrix'
  | 'studio_evidence'
  | 'bka_antitrust'
  | 'ministry_memo'
  | 'advisor'
  | 'field_gallery';

const AUTH_SESSION_KEY = 'bka_salalah2026_unlocked';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('royal_slides');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<boolean>(false);
  const [isSeqPlaying, setIsSeqPlaying] = useState<boolean>(false);

  const [openPdfModalId, setOpenPdfModalId] = useState<string | null>(null);
  const [selectedPdfForAdvisor, setSelectedPdfForAdvisor] =
    useState<StoredPdfPresentation | null>(null);
  const [isLiveVoiceModalOpen, setIsLiveVoiceModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsAudioLoading(loading);
      setIsSeqPlaying(isSequentialPlaybackActive());
    });
    return () => unsub();
  }, []);

  const handleUnlock = () => {
    try {
      sessionStorage.setItem(AUTH_SESSION_KEY, 'true');
    } catch {
      // ignore
    }
    setIsUnlocked(true);
  };

  const handleLock = () => {
    stopAllAudio();
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // ignore
    }
    setIsUnlocked(false);
  };

  const handlePlayWelcomeAudio = () => {
    const key = 'header-welcome-audio';
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(WELCOME_BRIEF_AUDIO_SCRIPT, key, 'khalid');
  };

  const handlePlayAudioBlock = (text: string, key: string) => {
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(text, key, 'official');
  };

  const handlePlayAllSequentiallyFromTop = () => {
    if (isSeqPlaying) {
      stopAllAudio();
      return;
    }
    const items = TWENTY_TWO_SLIDES_DATA.map((s) => ({
      id: `royal-slide-22-${s.slideNumber}`,
      text: `الشريحة ${s.slideNumber}: ${s.title}. ${s.narrationScript}`,
      title: `الشريحة ${s.slideNumber} من 22 — ${s.title}`,
      persona: 'khalid' as const,
    }));
    speakSequence(items);
  };

  const handleSelectPdfForAdvisor = (pdf: StoredPdfPresentation) => {
    setSelectedPdfForAdvisor(pdf);
    setActiveTab('advisor');
    const advisorEl = document.getElementById('ai-advisor-section');
    if (advisorEl) {
      advisorEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navTabs: {
    id: NavTab;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    pageAudioKey: string;
    pageAudioScript: string;
  }[] = [
    {
      id: 'royal_slides',
      label: 'التقرير والعرض التفاعلي (PDF + الشرائح)',
      sublabel: 'مكتبة العروض التقديمية PDF والشرائح التفاعلية',
      icon: <Presentation className="w-4 h-4" />,
      pageAudioKey: 'page-audio-royal-slides',
      pageAudioScript:
        'منازعات تصدير الأعلاف، حق المستثمر الوطني في مواجهة التعطيل. وثيقة توثيقية قانونية. نحن لا نطالب باسترداد أموال ولا نملك شحنات معلقة، نحن نطالب بحق العميل الوطني في العمل بكرامة وشفافية.',
    },
    {
      id: 'duo_podcast',
      label: 'المحاكاة الصوتية الحوارية (شخصان)',
      sublabel: 'حوار بريك العامري والمستشار الرقابي (10 مقاطع)',
      icon: <Radio className="w-4 h-4" />,
      pageAudioKey: 'page-audio-duo-podcast',
      pageAudioScript:
        'المحاكاة الصوتية الحوارية الشاملة بين المستثمر بريك العامري والمستشار الرقابي لتوثيق الوقائع ومواد قانون حماية المنافسة ومنع الاحتكار العماني.',
    },
    {
      id: 'laws_matrix',
      label: 'جدول التعسف ونصوص القانون العماني',
      sublabel: 'المرسوم السلطاني 67/2014 وقانون المعاملات المدنية',
      icon: <Scale className="w-4 h-4" />,
      pageAudioKey: 'page-audio-laws-matrix',
      pageAudioScript:
        'جدول التعسف ونصوص القانون العماني. الرفض ليس كلمة تقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض.',
    },
    {
      id: 'studio_evidence',
      label: 'حافظة المستندات والأدلة الرسمية',
      sublabel: 'إيصالات بنك مسقط والبيان الجمركي وشهادات التحليل',
      icon: <FolderOpen className="w-4 h-4" />,
      pageAudioKey: 'page-audio-studio-evidence',
      pageAudioScript:
        'حافظة الأدلة والمستندات الرسمية: إيصالات التحويل المصرفي المسبق مئة بالمئة عبر بنك مسقط، والبيان الجمركي للشحنة الأولى عبر منفذ خطم الشكلة خلال أربع وعشرين ساعة.',
    },
    {
      id: 'bka_antitrust',
      label: 'الملف الرقابي والسيادي (BKA-ANTITRUST)',
      sublabel: 'التسلسل الزمني الكامل والرسوم البيانية',
      icon: <ShieldAlert className="w-4 h-4" />,
      pageAudioKey: 'page-audio-bka-antitrust',
      pageAudioScript:
        'الملف الرقابي BKA-ANTITRUST: خمسة أشهر وثمانية عشر يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي أمام المهلة الرسمية للوزارة.',
    },
    {
      id: 'ministry_memo',
      label: 'مذكرة ديوان الوزارة (خالد المسروري)',
      sublabel: 'المذكرة الرسمية المرفوعة لدائرة المنافسة والاحتكار',
      icon: <FileText className="w-4 h-4" />,
      pageAudioKey: 'page-audio-ministry-memo',
      pageAudioScript:
        'الأستاذ خالد المسروري المحترم، دائرة المنافسة والاحتكار، السلام عليكم. لا أتيت بشكوى، ولا أطلب تعويضاً. أضع بين أيديكم وقائع، والحكم لكم.',
    },
    {
      id: 'advisor',
      label: 'المساعد الذكي والمستشار (تحليل PDF)',
      sublabel: 'رفع ملفات PDF والرد الفوري صوتاً وكتابةً',
      icon: <Sparkles className="w-4 h-4" />,
      pageAudioKey: 'page-audio-advisor',
      pageAudioScript:
        'المساعد الذكي والمستشار الرقابي للوثيقة. يمكنك كتابة أي سؤال أو رفع ملف عرض تقديمي بصيغة PDF ليقوم المساعد الذكي بقراءته والإجابة عن كافة الاستفسارات.',
    },
    {
      id: 'field_gallery',
      label: 'معرض الرصد الميداني والأسطول',
      sublabel: 'توثيق شاحنات النقل والجاهزية اللوجستية',
      icon: <Camera className="w-4 h-4" />,
      pageAudioKey: 'page-audio-field-gallery',
      pageAudioScript:
        'معرض الرصد الميداني والأسطول اللوجستي: توثيق جاهزية شاحنات النقل والتوريد المباشر ضمن ملف صلالة ألفين وستة وعشرين.',
    },
  ];

  const currentTabObj = navTabs.find((t) => t.id === activeTab) || navTabs[0];
  const isPlayingPageIntro = activeAudioId === currentTabObj.pageAudioKey;

  if (!isUnlocked) {
    return <SecurityAccessGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#2C2A28]" dir="rtl">
      <MainHeader
        onPlayWelcomeAudio={handlePlayWelcomeAudio}
        isPlayingWelcome={activeAudioId === 'header-welcome-audio'}
        onPlayAllSequentially={handlePlayAllSequentiallyFromTop}
        isPlayingSequential={isSeqPlaying}
        onLock={handleLock}
        onOpenSlidesModal={() => setOpenPdfModalId(BUILT_IN_PRESENTATION.id)}
        onOpenLiveVoiceModal={() => {
          setActiveTab('advisor');
          const el = document.getElementById('ai-advisor-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Live Voice Modal (if opened) */}
      <LiveVoiceModal
        isOpen={isLiveVoiceModalOpen}
        onClose={() => setIsLiveVoiceModalOpen(false)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Sticky Navigation Bar — 8 Sovereign Modules + Instant Section Audio */}
        <div className="rounded-3xl p-4 sm:p-5 bg-[#FFFFFF] border border-[#DEC98A] sticky top-3 z-40 shadow-xs no-print space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {navTabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-right p-3 rounded-2xl transition-colors border flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37] shadow-2xs'
                      : 'bg-[#FAF9F6] text-[#2C2A28] border-[#E6DEC8] hover:border-[#DEC98A] hover:bg-[#F5EFE0]'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                    <span className={isActive ? 'text-[#D4AF37]' : 'text-[#8A6D2F]'}>{tab.icon}</span>
                    <span className="line-clamp-1">{tab.label}</span>
                  </div>
                  <div
                    className={`text-[11px] mt-1 line-clamp-1 ${
                      isActive ? 'text-[#E5DEC9] font-semibold' : 'text-[#6B655C]'
                    }`}
                  >
                    {tab.sublabel}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Page Instant Audio & Sequential Playback Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EAE4D3]">
            <div className="text-xs font-bold text-[#6B655C]">
              القسم المعروض حالياً:{' '}
              <span className="text-[#23153C]">{currentTabObj.label}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() =>
                  handlePlayAudioBlock(currentTabObj.pageAudioScript, currentTabObj.pageAudioKey)
                }
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors border whitespace-nowrap shrink-0 cursor-pointer ${
                  isPlayingPageIntro
                    ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                    : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                }`}
              >
                {isPlayingPageIntro && isAudioLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6D2F]" />
                    <span>تحضير الصوت...</span>
                  </>
                ) : isPlayingPageIntro ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current text-[#23153C]" />
                    <span>إيقاف الصوت</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>استماع فوري لملخص القسم</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePlayAllSequentiallyFromTop}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                  isSeqPlaying
                    ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                    : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37] hover:bg-[#311E54]'
                }`}
              >
                {isSeqPlaying ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>إيقاف القراءة المتسلسلة</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
                    <span>تشغيل كل الشرائح وراء بعض</span>
                  </>
                )}
              </button>

              {activeAudioId && (
                <button
                  onClick={() => stopAllAudio()}
                  className="px-3.5 py-2 rounded-xl bg-[#F5EFE0] text-[#23153C] border border-[#C5A858] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  title="إيقاف أي صوت يعمل حالياً"
                >
                  <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                  <span>إيقاف الصوت</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* PROMINENT PDF PRESENTATIONS LIBRARY (ALWAYS AVAILABLE FOR ONE-CLICK UPLOAD & VIEWING) */}
        <PdfPresentationsLibrary
          onSelectPdfForAdvisor={handleSelectPdfForAdvisor}
          initialOpenPdfId={openPdfModalId}
          onClearInitialOpen={() => setOpenPdfModalId(null)}
        />

        {/* TAB 1: INTERACTIVE VERTICAL PRESENTATION + EMBEDDED AI ADVISOR */}
        {activeTab === 'royal_slides' && (
          <div className="space-y-8">
            <RoyalFourSlidesView />
            <OperationalDelaySlide />
            <div id="ai-advisor-section">
              <AIAdvisorWorkbench
                preselectedPdf={selectedPdfForAdvisor}
                onClearPreselectedPdf={() => setSelectedPdfForAdvisor(null)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: DUO PODCAST SIMULATION */}
        {activeTab === 'duo_podcast' && (
          <div className="space-y-8">
            <DuoAudioSimulation />
          </div>
        )}

        {/* TAB 3: VIOLATIONS & OMANI COMPETITION LAW MATRIX */}
        {activeTab === 'laws_matrix' && (
          <div className="space-y-8">
            <ViolationsLawsMatrix />

            <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DEC98A] space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#2C2A28] royal-heading">
                جدول مقابلة الذرائع بالوقائع الموثقة
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {EVIDENCE_MATRICES.map((row) => {
                  const key = `ev-matrix-${row.id}`;
                  const isPlayingThis = activeAudioId === key;
                  return (
                    <div
                      key={row.id}
                      className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8] flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#8A6D2F]">{row.claimDate}</span>
                          <button
                            onClick={() => handlePlayAudioBlock(row.audioSummary, key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border whitespace-nowrap shrink-0 cursor-pointer ${
                              isPlayingThis
                                ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                                : 'bg-[#FFFFFF] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                            }`}
                          >
                            {isPlayingThis ? (
                              <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                            )}
                            <span>{isPlayingThis ? 'إيقاف' : 'استماع فوري'}</span>
                          </button>
                        </div>
                        <h4 className="text-base font-bold text-[#2C2A28]">{row.claim}</h4>
                        <p className="text-xs sm:text-sm text-[#33302C] leading-relaxed">
                          {row.factualRefutation}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[#EAE4D3] text-xs text-[#8A6D2F] font-semibold">
                        النتيجة: {row.legalConclusion}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDIO DIRECT EVIDENCE UPLOAD */}
        {activeTab === 'studio_evidence' && <StudioEvidenceUpload />}

        {/* TAB 5: SOVEREIGN REGULATORY DOSSIER (BKA-ANTITRUST) & CHRONOLOGY */}
        {activeTab === 'bka_antitrust' && (
          <div className="space-y-8">
            <OperationalDelaySlide />

            <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DEC98A] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D3]">
                <div>
                  <div className="text-xs font-bold text-[#8A6D2F] flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    الوقائع المسجلة في ملف BKA-ANTITRUST (كل واقعة مزودة بزر استماع فوري)
                  </div>
                  <h3 className="text-2xl font-bold text-[#2C2A28] royal-heading mt-1">
                    الوقائع المرفوعة إلى <span className="text-[#8A6D2F]">دائرة المنافسة والاحتكار</span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {CHRONOLOGY_EVENTS.map((evt, idx) => {
                  const audioKey = `chrono-evt-${evt.id}`;
                  const isPlayingThis = activeAudioId === audioKey;
                  return (
                    <div
                      key={evt.id}
                      className={`p-5 rounded-2xl border transition-colors flex flex-col justify-between ${
                        isPlayingThis
                          ? 'bg-[#FFFFFF] border-2 border-[#C5A858]'
                          : 'bg-[#FAF9F6] border-[#E6DEC8] hover:border-[#DEC98A]'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[#8A6D2F]">
                            الواقعة {idx + 1} · {evt.date}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handlePlayAudioBlock(evt.audioScript, audioKey)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border whitespace-nowrap shrink-0 cursor-pointer ${
                                isPlayingThis
                                  ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                                  : 'bg-[#FFFFFF] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                              }`}
                            >
                              {isPlayingThis && isAudioLoading ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6D2F]" />
                                  <span>تحضير...</span>
                                </>
                              ) : isPlayingThis ? (
                                <>
                                  <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                                  <span>إيقاف</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                                  <span>استماع فوري</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base sm:text-lg font-bold text-[#2C2A28]">{evt.title}</h4>
                        <p className="text-xs sm:text-sm text-[#33302C] leading-relaxed">
                          {evt.detailedFacts}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EAE4D3] flex items-center justify-between text-xs">
                        <span className="text-[#8A6D2F] font-semibold">{evt.legalSignificance}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: OFFICIAL MINISTRY MEMO (خالد المسروري) */}
        {activeTab === 'ministry_memo' && <MinistryMemoView />}

        {/* TAB 7: AI ADVISOR WORKBENCH */}
        {activeTab === 'advisor' && (
          <div id="ai-advisor-section">
            <AIAdvisorWorkbench
              preselectedPdf={selectedPdfForAdvisor}
              onClearPreselectedPdf={() => setSelectedPdfForAdvisor(null)}
            />
          </div>
        )}

        {/* TAB 8: FIELD EVIDENCE & FLEET GALLERY */}
        {activeTab === 'field_gallery' && <FieldEvidenceGallery />}
      </main>
    </div>
  );
}

export default App;
