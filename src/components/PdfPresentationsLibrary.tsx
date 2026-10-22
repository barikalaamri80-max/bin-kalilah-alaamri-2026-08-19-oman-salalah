import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Eye,
  Volume2,
  Square,
  Play,
  Sparkles,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Printer,
  CheckCircle2,
  Scale,
  ShieldCheck,
  Landmark,
  Layers,
  Loader2,
} from 'lucide-react';
import SovereignEmblem from './SovereignEmblem';
import IsometricSlideGraphics from './IsometricSlideGraphics';
import { TWENTY_TWO_SLIDES_DATA } from '../data/presentation22SlidesData';
import {
  StoredPdfPresentation,
  subscribeToPdfs,
  saveUploadedPdf,
  deleteStoredPdf,
  base64ToBlobUrl,
} from '../services/pdfStorageService';
import {
  speakArabicText,
  speakSequence,
  stopAllAudio,
  subscribeToTTS,
  isSequentialPlaybackActive,
} from '../services/ttsService';

export interface PdfPresentationsLibraryProps {
  onSelectPdfForAdvisor?: (pdf: StoredPdfPresentation) => void;
  initialOpenPdfId?: string | null;
  onClearInitialOpen?: () => void;
}

export const PdfPresentationsLibrary: React.FC<PdfPresentationsLibraryProps> = ({
  onSelectPdfForAdvisor,
  initialOpenPdfId,
  onClearInitialOpen,
}) => {
  const [presentations, setPresentations] = useState<StoredPdfPresentation[]>([]);
  const [activeModalPdf, setActiveModalPdf] = useState<StoredPdfPresentation | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Built-in Visual Deck state inside Modal
  const [modalSlideIdx, setModalSlideIdx] = useState(0);
  const [modalViewMode, setModalViewMode] = useState<'single' | 'all'>('single');

  // Audio state
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isSeqPlaying, setIsSeqPlaying] = useState(false);

  useEffect(() => {
    const unsubPdfs = subscribeToPdfs((items) => {
      setPresentations(items);
    });
    const unsubTts = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsAudioLoading(loading);
      setIsSeqPlaying(isSequentialPlaybackActive());
    });
    return () => {
      unsubPdfs();
      unsubTts();
    };
  }, []);

  useEffect(() => {
    if (initialOpenPdfId && presentations.length > 0) {
      const target =
        presentations.find((p) => p.id === initialOpenPdfId) || presentations[0];
      if (target) {
        handleOpenPresentation(target);
      }
      if (onClearInitialOpen) onClearInitialOpen();
    }
  }, [initialOpenPdfId, presentations]);

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);
    try {
      let lastSaved: StoredPdfPresentation | null = null;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        lastSaved = await saveUploadedPdf(file);
      }
      if (lastSaved) {
        setUploadSuccessMsg(`تم رفع وحفظ العرض التقديمي «${lastSaved.name}» بنجاح، وهو جاهز للفتح المباشر وللتحليل في المساعد الذكي.`);
        handleOpenPresentation(lastSaved);
      }
    } catch {
      // ignore error
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleOpenPresentation = (pdf: StoredPdfPresentation) => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    if (!pdf.isBuiltInVisualDeck && pdf.base64Data) {
      const url = base64ToBlobUrl(pdf.base64Data, 'application/pdf');
      setBlobUrl(url);
    }
    setModalSlideIdx(0);
    setActiveModalPdf(pdf);
  };

  const handleCloseModal = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }
    setActiveModalPdf(null);
  };

  const handlePlayAll22SlidesSequentially = () => {
    if (isSeqPlaying) {
      stopAllAudio();
      return;
    }
    const items = TWENTY_TWO_SLIDES_DATA.map((slide) => ({
      id: `pdf-deck-slide-${slide.slideNumber}`,
      text: `الشريحة ${slide.slideNumber}: ${slide.title}. ${slide.narrationScript}`,
      title: `الشريحة ${slide.slideNumber} من 22 — ${slide.title}`,
      persona: 'khalid' as const,
    }));
    speakSequence(items);
  };

  const currentSlide = TWENTY_TWO_SLIDES_DATA[modalSlideIdx] || TWENTY_TWO_SLIDES_DATA[0];

  return (
    <section
      className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-xs space-y-6"
      dir="rtl"
      aria-label="مكتبة العروض التقديمية PDF — حافظة العروض للجهات الرقابية"
    >
      {/* Top Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#EAE4D3]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-[#8A6D2F] text-xs font-bold">
            <Layers className="w-3.5 h-3.5 text-[#8A6D2F]" />
            <span>مكتبة العروض التقديمية (PDF) — حافظة العروض للجهات الرقابية</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#23153C] royal-heading">
            حافظة العروض التقديمية المصورة (PDF) —{' '}
            <span className="text-[#8A6D2F] underline decoration-[#DEC98A] underline-offset-8">
              للفاضل / خالد المسروري المحترم
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed max-w-3xl">
            يمكنكم فتح العرض التقديمي المصور مباشرة بالضغط على البطاقة أدناه، أو رفع أي ملف عرض تقديمي (PDF) من جهازكم ليظهر فوراً كبطاقة رسمية قابلة للتصفح المباشر والتحليل الذكي.
          </p>
        </div>

        {/* Action Buttons: Upload PDF + Sequential Play All Slides */}
        <div className="flex flex-wrap items-center gap-3 shrink-0 no-print">
          <label className="px-5 py-3 rounded-2xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border-2 border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all">
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF37]" />
            ) : (
              <Upload className="w-4 h-4 text-[#D4AF37]" />
            )}
            <span>رفع عرض تقديمي (PDF)</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handlePlayAll22SlidesSequentially}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 border transition-all cursor-pointer ${
              isSeqPlaying
                ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                : 'bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border-[#DEC98A]'
            }`}
          >
            {isSeqPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current text-[#23153C]" />
                <span>إيقاف القراءة المتسلسلة</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current text-[#8A6D2F]" />
                <span>تشغيل الشرائح وراء بعض (قراءة متواصلة)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border-2 border-[#D4AF37] flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#23153C]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#8A6D2F] shrink-0" />
            <span>{uploadSuccessMsg}</span>
          </div>
          <button
            onClick={() => setUploadSuccessMsg(null)}
            className="px-3 py-1 rounded-lg bg-[#FFFFFF] border border-[#DEC98A] text-xs cursor-pointer"
          >
            إخفاء
          </button>
        </div>
      )}

      {/* Presentation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {presentations.map((pdf) => {
          const audioKey = `pdf-card-audio-${pdf.id}`;
          const isPlayingCard = activeAudioId === audioKey;

          return (
            <div
              key={pdf.id}
              className="rounded-2xl p-5 sm:p-6 bg-[#FAF9F6] border-2 border-[#DEC98A] hover:border-[#D4AF37] transition-all flex flex-col justify-between gap-5 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#23153C] border border-[#D4AF37] flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-[11px] font-bold">
                          {pdf.isBuiltInVisualDeck ? 'عرض تقديمي مصور جاهز' : 'ملف PDF مرفوع'}
                        </span>
                        <span className="text-xs font-bold text-[#8A6D2F]">{pdf.sizeLabel}</span>
                      </div>
                      <div className="text-[11px] text-[#6B655C] font-semibold mt-0.5">
                        تاريخ الإدراج: {pdf.uploadDate}
                      </div>
                    </div>
                  </div>

                  {!pdf.isBuiltInVisualDeck && (
                    <button
                      onClick={() => deleteStoredPdf(pdf.id)}
                      className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#F5EFE0] text-[#6B655C] border border-[#E6DEC8] cursor-pointer"
                      title="حذف الملف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-extrabold text-[#23153C] leading-snug">
                  {pdf.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                  {pdf.summary}
                </p>
              </div>

              {/* Card Action Buttons */}
              <div className="pt-4 border-t border-[#EAE4D3] flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenPresentation(pdf)}
                    className="px-4 py-2.5 rounded-xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#D4AF37]" />
                    <span>فتح العرض التقديمي</span>
                  </button>

                  <button
                    onClick={() => {
                      if (isPlayingCard) {
                        stopAllAudio();
                      } else {
                        speakArabicText(
                          `${pdf.name}. ${pdf.summary}`,
                          audioKey,
                          'khalid',
                          undefined,
                          pdf.name
                        );
                      }
                    }}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                      isPlayingCard
                        ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                        : 'bg-[#FFFFFF] hover:bg-[#F5EFE0] text-[#23153C] border-[#DEC98A]'
                    }`}
                  >
                    {isPlayingCard && isAudioLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8A6D2F]" />
                        <span>تحضير...</span>
                      </>
                    ) : isPlayingCard ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current" />
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

                {onSelectPdfForAdvisor && (
                  <button
                    onClick={() => onSelectPdfForAdvisor(pdf)}
                    className="px-3.5 py-2.5 rounded-xl bg-[#F5EFE0] hover:bg-[#EDE2C8] text-[#23153C] border border-[#C5A858] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>مناقشة الملف مع المساعد الذكي</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================================
          FULL-SCREEN PRESENTATION VIEWER MODAL (FOR MR. KHALID AL-MASROORI)
      ===================================================================== */}
      {activeModalPdf && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-[#FAF9F6] border-2 border-[#D4AF37] rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-[#FFFFFF] border-b-2 border-[#DEC98A] flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <SovereignEmblem size={46} className="border border-[#D4AF37]" />
                <div>
                  <div className="text-[11px] font-bold text-[#8A6D2F]">
                    مستعرض العروض التقديمية المباشر — دائرة حماية المنافسة ومنع الاحتكار
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-[#23153C] line-clamp-1">
                    {activeModalPdf.name}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {activeModalPdf.isBuiltInVisualDeck && (
                  <>
                    <button
                      onClick={handlePlayAll22SlidesSequentially}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                        isSeqPlaying
                          ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                          : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
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

                    <button
                      onClick={() =>
                        setModalViewMode(modalViewMode === 'single' ? 'all' : 'single')
                      }
                      className="px-3.5 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] text-xs font-bold cursor-pointer"
                    >
                      {modalViewMode === 'single'
                        ? 'عرض جميع الشرائح عمودياً'
                        : 'عرض شريحة بشريحة'}
                    </button>
                  </>
                )}

                {blobUrl && (
                  <a
                    href={blobUrl}
                    download={activeModalPdf.name}
                    className="px-3.5 py-2 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>تنزيل ملف PDF</span>
                  </a>
                )}

                <button
                  onClick={() => window.print()}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#8A6D2F]" />
                  <span>طباعة</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] cursor-pointer"
                  title="إغلاق العرض"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {!activeModalPdf.isBuiltInVisualDeck && blobUrl ? (
                /* User Uploaded PDF Embedded Viewer */
                <div className="w-full h-[75vh] rounded-2xl overflow-hidden border-2 border-[#DEC98A] bg-[#FFFFFF]">
                  <iframe
                    src={blobUrl}
                    title={activeModalPdf.name}
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                /* Built-In Visual Presentation Deck with Isometric Graphics & Clear Diagrams */
                <div className="space-y-6">
                  {modalViewMode === 'single' ? (
                    <div className="max-w-4xl mx-auto space-y-5">
                      {/* Slide Number Selector Bar */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#FFFFFF] p-3 rounded-2xl border border-[#DEC98A]">
                        {TWENTY_TWO_SLIDES_DATA.map((s, idx) => {
                          const isCurrent = idx === modalSlideIdx;
                          const isSpeakingThis =
                            activeAudioId === `pdf-deck-slide-${s.slideNumber}`;
                          return (
                            <button
                              key={s.slideNumber}
                              onClick={() => setModalSlideIdx(idx)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border transition-all cursor-pointer flex items-center gap-1 ${
                                isCurrent
                                  ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                                  : 'bg-[#FAF9F6] text-[#23153C] border-[#E6DEC8] hover:bg-[#F5EFE0]'
                              }`}
                            >
                              <span>{s.slideNumber}</span>
                              {isSpeakingThis && (
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Visual Slide Canvas */}
                      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-md space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EAE4D3]">
                          <div className="flex items-center gap-2">
                            <span className="px-3.5 py-1 rounded-full bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5">
                              <Landmark className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>{currentSlide.sectionBadge}</span>
                            </span>
                            <span className="text-xs font-bold text-[#8A6D2F]">
                              {currentSlide.dateLabel}
                            </span>
                          </div>

                          <button
                            onClick={() => {
                              const key = `pdf-deck-slide-${currentSlide.slideNumber}`;
                              if (activeAudioId === key) {
                                stopAllAudio();
                              } else {
                                speakArabicText(
                                  `${currentSlide.title}. ${currentSlide.narrationScript}`,
                                  key,
                                  'khalid',
                                  undefined,
                                  currentSlide.title
                                );
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border cursor-pointer ${
                              activeAudioId === `pdf-deck-slide-${currentSlide.slideNumber}`
                                ? 'bg-[#D4AF37] text-[#23153C] border-[#23153C]'
                                : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                            }`}
                          >
                            {activeAudioId === `pdf-deck-slide-${currentSlide.slideNumber}` ? (
                              <>
                                <Square className="w-3.5 h-3.5 fill-current" />
                                <span>إيقاف الصوت</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-4 h-4 text-[#D4AF37]" />
                                <span>استماع فوري للشريحة</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="text-center space-y-2">
                          <h4 className="text-xl sm:text-2xl font-extrabold text-[#23153C] royal-heading">
                            {currentSlide.title}
                          </h4>
                          <p className="text-xs sm:text-sm font-bold text-[#8A6D2F]">
                            {currentSlide.subtitle}
                          </p>
                        </div>

                        {/* Graphic Illustration */}
                        <IsometricSlideGraphics
                          type={currentSlide.graphicType}
                          theme="cream"
                        />

                        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] text-sm sm:text-base font-semibold text-[#23153C] leading-loose text-justify">
                          {currentSlide.mainText}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentSlide.cards.map((card, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] space-y-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="px-2.5 py-0.5 rounded-lg bg-[#23153C] text-[#FFF3C4] text-xs font-bold">
                                  {card.tag}
                                </span>
                                <Scale className="w-4 h-4 text-[#8A6D2F]" />
                              </div>
                              <div className="text-sm font-extrabold text-[#23153C]">
                                {card.title}
                              </div>
                              <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                                {card.body}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] flex items-center gap-3 text-xs sm:text-sm font-bold">
                          <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                          <span>{currentSlide.goldenCallout}</span>
                        </div>

                        {/* Prev / Next Navigation */}
                        <div className="pt-4 border-t border-[#EAE4D3] flex items-center justify-between">
                          <button
                            onClick={() =>
                              setModalSlideIdx((p) =>
                                p > 0 ? p - 1 : TWENTY_TWO_SLIDES_DATA.length - 1
                              )
                            }
                            className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <ChevronRight className="w-4 h-4 text-[#8A6D2F]" />
                            <span>الشريحة السابقة</span>
                          </button>

                          <span className="text-xs font-extrabold text-[#8A6D2F]">
                            الشريحة {currentSlide.slideNumber} من {TWENTY_TWO_SLIDES_DATA.length}
                          </span>

                          <button
                            onClick={() =>
                              setModalSlideIdx((p) =>
                                p < TWENTY_TWO_SLIDES_DATA.length - 1 ? p + 1 : 0
                              )
                            }
                            className="px-4 py-2.5 rounded-xl bg-[#23153C] hover:bg-[#311E54] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>الشريحة التالية</span>
                            <ChevronLeft className="w-4 h-4 text-[#D4AF37]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Vertical View of All 22 Visual Slides Inside Modal */
                    <div className="max-w-4xl mx-auto space-y-6">
                      {TWENTY_TWO_SLIDES_DATA.map((slide) => {
                        const key = `pdf-deck-slide-${slide.slideNumber}`;
                        const isPlayingSlide = activeAudioId === key;
                        return (
                          <div
                            key={slide.slideNumber}
                            id={key}
                            className="rounded-3xl p-6 bg-[#FFFFFF] border-2 border-[#D4AF37] space-y-4 shadow-xs"
                          >
                            <div className="flex items-center justify-between border-b border-[#EAE4D3] pb-3">
                              <span className="text-xs font-bold text-[#8A6D2F]">
                                الشريحة {slide.slideNumber} من 22 · {slide.sectionBadge}
                              </span>
                              <button
                                onClick={() => {
                                  if (isPlayingSlide) stopAllAudio();
                                  else
                                    speakArabicText(
                                      `${slide.title}. ${slide.narrationScript}`,
                                      key,
                                      'khalid',
                                      undefined,
                                      slide.title
                                    );
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>{isPlayingSlide ? 'إيقاف الصوت' : 'استماع فوري'}</span>
                              </button>
                            </div>
                            <h4 className="text-lg font-extrabold text-[#23153C]">
                              {slide.title}
                            </h4>
                            <IsometricSlideGraphics type={slide.graphicType} theme="cream" />
                            <p className="text-sm text-[#2C2A28] leading-relaxed">
                              {slide.mainText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PdfPresentationsLibrary;
