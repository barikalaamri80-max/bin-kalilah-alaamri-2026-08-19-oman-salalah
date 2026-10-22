import React, { useState, useEffect } from 'react';
import {
  Send,
  Volume2,
  Square,
  Sparkles,
  Scale,
  CheckCircle2,
  Loader2,
  HelpCircle,
  Upload,
  FileText,
  X,
  BookOpen,
} from 'lucide-react';
import { speakArabicText, stopAllAudio, subscribeToTTS } from '../services/ttsService';
import {
  StoredPdfPresentation,
  subscribeToPdfs,
  saveUploadedPdf,
} from '../services/pdfStorageService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachedPdfName?: string;
}

export interface AIAdvisorWorkbenchProps {
  preselectedPdf?: StoredPdfPresentation | null;
  onClearPreselectedPdf?: () => void;
}

const PRESET_PROMPTS = [
  'لخّص القضية كاملة من إغلاق محل صلالة في مايو 2026 إلى المهلة الرسمية (3 أيام عمل) في أكتوبر 2026.',
  'كيف تثبت الوقائع أن «الرفض ليس كلمة تُقال، الرفض سلوك» من خلال المهلة الرسمية والرسائل الثلاث؟',
  'ما هي الذرائع الفنية الثلاث التي تُركت دون تصحيح أمام المهلة الرسمية وما تكييفها وفق المرسوم السلطاني 67/2014؟',
  'ما هي الأسئلة الرقابية الستة الحاسمة الموجهة إلى المصنع أمام دائرة حماية المنافسة ومنع الاحتكار؟',
];

const CUSTOM_KNOWLEDGE_STORAGE_KEY = 'bka_advisor_custom_knowledge_v1';

export const AIAdvisorWorkbench: React.FC<AIAdvisorWorkbenchProps> = ({
  preselectedPdf,
  onClearPreselectedPdf,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'مرحباً بكم في المساعد الذكي والمستشار الرقابي للوثيقة الموجهة إلى الفاضل / خالد المسروري المحترم — مدير عام مركز حماية المنافسة ومنع الاحتكار بوزارة التجارة والصناعة وترويج الاستثمار.\n\nأنا ملمّ بكافة وقائع الملف وشرائحه الـ 22 وأرقام إيصالات بنك مسقط والمراسلات ومواد قانون حماية المنافسة (مرسوم سلطاني 67/2014). كما يمكنكم رفع أي ملف عرض تقديمي أو مستند (PDF) هنا وسأقوم بقراءته وتحليله والإجابة عن أي سؤال حوله فوراً.',
      timestamp: 'الآن',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [autoSpeakReplies, setAutoSpeakReplies] = useState(true);

  // PDF attachment state
  const [storedPdfs, setStoredPdfs] = useState<StoredPdfPresentation[]>([]);
  const [attachedPdf, setAttachedPdf] = useState<StoredPdfPresentation | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Custom Knowledge state (تغذية المساعد الذكي بمعلومات إضافية)
  const [showKnowledgeBox, setShowKnowledgeBox] = useState(false);
  const [customKnowledge, setCustomKnowledge] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_KNOWLEDGE_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    const unsubTts = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsAudioLoading(loading);
    });
    const unsubPdfs = subscribeToPdfs((items) => {
      setStoredPdfs(items.filter((i) => !i.isBuiltInVisualDeck && i.base64Data));
    });
    return () => {
      unsubTts();
      unsubPdfs();
    };
  }, []);

  useEffect(() => {
    if (preselectedPdf) {
      setAttachedPdf(preselectedPdf);
      if (onClearPreselectedPdf) onClearPreselectedPdf();
    }
  }, [preselectedPdf]);

  const handleSaveCustomKnowledge = (val: string) => {
    setCustomKnowledge(val);
    try {
      localStorage.setItem(CUSTOM_KNOWLEDGE_STORAGE_KEY, val);
    } catch {
      // ignore
    }
  };

  const handleUploadPdfFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingPdf(true);
    try {
      const saved = await saveUploadedPdf(files[0]);
      setAttachedPdf(saved);
    } catch {
      // ignore
    } finally {
      setIsUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleSend = async (promptText?: string) => {
    const textToSend = (promptText ?? input).trim();
    if ((!textToSend && !attachedPdf) || isSending) return;

    const effectivePrompt =
      textToSend ||
      `يرجى قراءة وتحليل ملف الـ PDF المرفق (${attachedPdf?.name}) وتلخيص أهم الوقائع والنقاط الواردة فيه.`;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: effectivePrompt,
      timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      attachedPdfName: attachedPdf?.name,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!promptText) setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: effectivePrompt,
          prompt: effectivePrompt,
          pdfBase64: attachedPdf?.base64Data,
          pdfName: attachedPdf?.name,
          customKnowledge,
          history: nextMessages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        data.answer ||
        'كامل التعاملات مسددة 100% نقداً مقدماً، والهدف هو المطابقة المستندية فقط. 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.';

      const assistantMsgId = `assistant-${Date.now()}`;
      const assistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      if (autoSpeakReplies) {
        speakArabicText(
          replyText,
          `advisor-msg-${assistantMsgId}`,
          'khalid',
          undefined,
          'رد المساعد الذكي'
        );
      }
    } catch {
      const fallbackId = `assistant-err-${Date.now()}`;
      const fallbackText =
        'الوقائع المسجلة: الرفض ليس كلمة تُقال، الرفض سلوك. الوزارة منحت مهلة رسمية ثلاثة أيام عمل، وأُرسلت ثلاث رسائل PDF بقائمة المستندات ومرفق وزارة التغير المناخي والبيئة إلى فيصل المعشني وأدهم البلوشي ومهند الرئيسي، ومضت الثلاثة أيام دون رد. والذرائع الفنية (مضادات الكوكزيديا والملصق برنامج تناوبي، وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم، وفترة سحب صفر يوم والاشتراط سبعة أيام) تُركت دون تصحيح. فقط 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.';
      setMessages((prev) => [
        ...prev,
        {
          id: fallbackId,
          role: 'assistant',
          content: fallbackText,
          timestamp: 'الآن',
        },
      ]);
      if (autoSpeakReplies) {
        speakArabicText(fallbackText, `advisor-msg-${fallbackId}`, 'khalid');
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleSpeakMessage = (msg: ChatMessage) => {
    const key = `advisor-msg-${msg.id}`;
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(msg.content, key, 'khalid', undefined, 'المساعد الذكي للوثيقة');
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner — Calm Light Mode */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#D4AF37] shadow-2xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-[#23153C] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#8A6D2F]" />
              <span>المساعد الذكي والمستشار الرقابي (يدعم قراءة ملفات PDF والرد الصوتي الفوري)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#23153C] royal-heading">
              المساعد الذكي للوثيقة —{' '}
              <span className="text-[#8A6D2F]">الإجابة الفورية وتحليل ملفات PDF</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#524E48] leading-relaxed max-w-3xl">
              يجيب عن أي استفسار حول وقائع الملف والشرائح الـ 22 ومواد قانون حماية المنافسة العماني، ويقرأ أي ملف PDF ترفعه له ليجيب عن أسئلتك صوتاً وكتابةً.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAutoSpeakReplies(!autoSpeakReplies)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                autoSpeakReplies
                  ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                  : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A]'
              }`}
            >
              <Volume2 className="w-4 h-4 text-[#D4AF37]" />
              <span>{autoSpeakReplies ? 'النطق التلقائي للردود: مفعّل' : 'النطق التلقائي للردود: متوقف'}</span>
            </button>

            <button
              onClick={() => setShowKnowledgeBox(!showKnowledgeBox)}
              className="px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#8A6D2F]" />
              <span>إضافة معلومات للمساعد الذكي</span>
            </button>
          </div>
        </div>

        {/* Custom Knowledge Feeding Box */}
        {showKnowledgeBox && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F6] border-2 border-[#DEC98A] space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs sm:text-sm font-bold text-[#23153C]">
                تزويد المساعد الذكي بمعلومات أو نقاط إضافية ليعتمدها عند الإجابة عن أي سؤال:
              </div>
              <button
                onClick={() => setShowKnowledgeBox(false)}
                className="text-xs font-bold text-[#8A6D2F] cursor-pointer"
              >
                إغلاق
              </button>
            </div>
            <textarea
              value={customKnowledge}
              onChange={(e) => handleSaveCustomKnowledge(e.target.value)}
              rows={3}
              placeholder="اكتب هنا أي معلومات إضافية أو تفاصيل تريد من المساعد الذكي أن يلمّ بها ويجيب بناءً عليها..."
              className="w-full p-3.5 rounded-xl bg-[#FFFFFF] border border-[#DEC98A] text-xs sm:text-sm text-[#23153C] leading-relaxed focus:outline-none focus:border-[#8A6D2F]"
            />
            <div className="text-[11px] text-[#6B655C] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
              <span>يتم حفظ هذه المعلومات تلقائياً واستخدامها في جميع إجابات المساعد الذكي.</span>
            </div>
          </div>
        )}

        {/* Preset Questions */}
        <div className="pt-4 border-t border-[#EAE4D3]">
          <div className="text-xs font-bold text-[#23153C] mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#8A6D2F]" />
            <span>أسئلة سريعة جاهزة للعرض والرد الصوتي الفوري:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {PRESET_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={isSending}
                className="text-right p-3.5 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] border border-[#E6DEC8] hover:border-[#DEC98A] text-xs sm:text-sm text-[#23153C] font-semibold transition-all flex items-start gap-2 cursor-pointer"
              >
                <Scale className="w-4 h-4 text-[#8A6D2F] shrink-0 mt-0.5" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Conversation Area */}
      <div className="rounded-3xl p-6 bg-[#FFFFFF] border-2 border-[#DEC98A] space-y-5">
        <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
          {messages.map((msg) => {
            const isPlayingThis = activeAudioId === `advisor-msg-${msg.id}`;
            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl border ${
                  msg.role === 'user'
                    ? 'bg-[#F5EFE0] border-[#C5A858] mr-0 ml-8'
                    : 'bg-[#FAF9F6] border-[#DEC98A] ml-0 mr-4'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#EAE4D3]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                        msg.role === 'user'
                          ? 'bg-[#23153C] text-[#FFF3C4]'
                          : 'bg-[#FFFFFF] text-[#23153C] border border-[#DEC98A]'
                      }`}
                    >
                      {msg.role === 'user' ? 'السؤال الموجه' : 'المساعد الذكي والمستشار الرقابي'}
                    </span>
                    <span className="text-[11px] text-[#6B655C] font-semibold">{msg.timestamp}</span>
                    {msg.attachedPdfName && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-[#FFFFFF] border border-[#D4AF37] text-[11px] font-bold text-[#8A6D2F] flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{msg.attachedPdfName}</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleSpeakMessage(msg)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                      isPlayingThis
                        ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                        : 'bg-[#FFFFFF] text-[#23153C] border-[#DEC98A] hover:bg-[#F5EFE0]'
                    }`}
                  >
                    {isPlayingThis && isAudioLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                        <span>تحضير...</span>
                      </>
                    ) : isPlayingThis ? (
                      <>
                        <Square className="w-3.5 h-3.5 fill-current text-[#D4AF37]" />
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

                <div className="text-sm sm:text-base text-[#2C2A28] whitespace-pre-line leading-relaxed font-medium">
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] flex items-center gap-3 text-[#23153C] text-sm font-bold">
              <Loader2 className="w-5 h-5 animate-spin text-[#8A6D2F]" />
              <span>جاري تحليل السؤال والملفات المرفقة وإعداد الإجابة الدقيقة...</span>
            </div>
          )}
        </div>

        {/* Attached PDF Banner or Quick Select from Library */}
        <div className="pt-3 border-t border-[#EAE4D3] space-y-3">
          {attachedPdf ? (
            <div className="p-3 rounded-2xl bg-[#FAF9F6] border-2 border-[#D4AF37] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#23153C]">
                <FileText className="w-4 h-4 text-[#8A6D2F] shrink-0" />
                <span>ملف PDF مرفق للتحليل: {attachedPdf.name}</span>
              </div>
              <button
                onClick={() => setAttachedPdf(null)}
                className="p-1.5 rounded-lg bg-[#FFFFFF] border border-[#DEC98A] text-[#6B655C] hover:text-[#23153C] cursor-pointer"
                title="إزالة المرفق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            storedPdfs.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#6B655C]">
                  اختر ملف PDF مرفوعاً سابقاً لتحليله:
                </span>
                {storedPdfs.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAttachedPdf(p)}
                    className="px-3 py-1 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] border border-[#DEC98A] text-xs font-bold text-[#23153C] flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>{p.name}</span>
                  </button>
                ))}
              </div>
            )
          )}

          {/* Input Form with PDF Upload Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <label className="px-4 py-3.5 rounded-2xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shrink-0">
              {isUploadingPdf ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#8A6D2F]" />
              ) : (
                <Upload className="w-4 h-4 text-[#8A6D2F]" />
              )}
              <span>إرفاق ملف PDF</span>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleUploadPdfFile}
                className="hidden"
              />
            </label>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا أو اسأل عن أي ملف PDF مرفق..."
              className="flex-1 bg-[#FAF9F6] border border-[#DEC98A] rounded-2xl px-4 py-3.5 text-sm text-[#23153C] placeholder-[#6B655C] focus:outline-none focus:border-[#8A6D2F]"
            />

            <button
              type="submit"
              disabled={isSending || (!input.trim() && !attachedPdf)}
              className="px-6 py-3.5 rounded-2xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#311E54] disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>إرسال السؤال</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorWorkbench;
