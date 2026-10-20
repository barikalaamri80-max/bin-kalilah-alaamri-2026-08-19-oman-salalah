import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, PhoneCall, PhoneOff, AlertCircle, Sparkles, Send } from 'lucide-react';
import { LiveVoiceClient, LiveMessage } from '../services/liveVoiceService';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'speaking' | 'error'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const clientRef = useRef<LiveVoiceClient | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startSession = async () => {
    const client = new LiveVoiceClient(
      (newMsg) => {
        setMessages((prev) => [...prev, newMsg]);
      },
      (newStatus) => {
        setStatus(newStatus);
      }
    );
    clientRef.current = client;
    await client.connect();
  };

  const stopSession = () => {
    if (clientRef.current) {
      clientRef.current.disconnect();
      clientRef.current = null;
    }
    setStatus('idle');
  };

  const handleToggleMute = () => {
    if (clientRef.current) {
      const muted = clientRef.current.toggleMute();
      setIsMuted(muted);
    }
  };

  const handleSendText = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !clientRef.current) return;
    clientRef.current.sendTextMessage(text.trim());
    setInputText('');
  };

  const quickQuestions = [
    'اشرح لي ركائز المادتين 155 و 156 معاملات مدنية وعلاقتهما بالامتناع المقنع عن البيع',
    'ما هي أقوى قرائن التواطؤ والتبعية في تحويل نوفل (DOC-03)؟',
    'لماذا يمثل تسليم إقرار سلامة 2025 لشحنة 2026 فخاً إجرائياً متعمداً؟',
    'كيف نثبت الملاءة المالية وانتفاء أي مخاطر ائتمانية بفضل سداد 100% كاش؟',
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e1233] rounded-3xl max-w-2xl w-full border-2 border-[#D4AF37] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-full gold-gradient-bg p-0.5 flex items-center justify-center shadow-gold-glow">
              <Sparkles className="w-5 h-5 text-[#23153c]" />
            </div>
            <div>
              <h3 className="font-black text-base text-white flex items-center">
                المستشار القضائي الصوتي المباشر
                <span className="mr-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-[#E8C56B] border border-amber-400">
                  Gemini 3.8 Live API
                </span>
              </h3>
              <p className="text-xs text-gray-300">
                محادثة صوتية آنية للاستقراء والشك القانوني في دفوع وأدلة القضية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Audio Visualizer Banner */}
        <div className="p-6 bg-gradient-to-b from-[#2a1945] to-[#1e1233] text-center flex flex-col items-center justify-center relative overflow-hidden shrink-0">
          {/* Animated Wave Glow Circle */}
          <div
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              status === 'speaking'
                ? 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.6)] scale-110'
                : status === 'connected'
                ? 'border-[#D4AF37] shadow-gold-glow animate-pulse'
                : status === 'connecting'
                ? 'border-amber-400 animate-spin'
                : 'border-red-400'
            }`}
          >
            {status === 'speaking' ? (
              <Volume2 className="w-12 h-12 text-emerald-300 animate-bounce" />
            ) : isMuted ? (
              <MicOff className="w-12 h-12 text-red-400" />
            ) : (
              <Mic className="w-12 h-12 text-[#E8C56B]" />
            )}
          </div>

          {/* Status Label */}
          <div className="mt-4">
            <span className="text-sm font-black text-amber-200">
              {status === 'speaking' && 'المستشار القانوني يتحدث بالصوت الآن...'}
              {status === 'connected' && !isMuted && 'المستشار يستمع إليك الآن، تحدث بحرية...'}
              {status === 'connected' && isMuted && 'الميكروفون مكتوم (اضغط لتفعيل الصوت)'}
              {status === 'connecting' && 'جاري إنشاء اتصال الصوت الحي مع خادم Live API...'}
              {status === 'error' && 'تعذر اتصال الصوت الحي، يرجى التحقق من الميكروفون.'}
              {status === 'idle' && 'غير متصل'}
            </span>
          </div>

          {/* Live Audio Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleToggleMute}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center ${
                isMuted
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {isMuted ? (
                <>
                  <MicOff className="w-3.5 h-3.5 ml-1.5" />
                  <span>إلغاء كتم الصوت</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 ml-1.5" />
                  <span>كتم الميكروفون</span>
                </>
              )}
            </button>

            <button
              onClick={status === 'idle' ? startSession : stopSession}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition flex items-center ${
                status === 'idle'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-400'
              }`}
            >
              {status === 'idle' ? (
                <>
                  <PhoneCall className="w-3.5 h-3.5 ml-1.5" />
                  <span>بدء الاتصال</span>
                </>
              ) : (
                <>
                  <PhoneOff className="w-3.5 h-3.5 ml-1.5" />
                  <span>إنهاء المكالمة</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Conversation Transcript */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#150a26]/60">
          {messages.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs space-y-3">
              <p>تحدث بصوتك مباشرة عبر الميكروفون أو اختر أحد الاستفسارات القانونية النموذجية أدناه:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-right">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendText(q)}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-amber-200 text-right leading-relaxed transition hover:border-[#D4AF37]"
                  >
                    💬 {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-600/30 text-amber-100 border border-amber-500/40'
                      : 'bg-[#2a1945] text-white border border-[#D4AF37]/50 shadow-md'
                  }`}
                >
                  <span className="block text-[10px] font-black text-amber-300 mb-1">
                    {msg.sender === 'user' ? 'المستفسر (أنت):' : 'المستشار القضائي (Gemini Live):'}
                  </span>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Fallback Bar */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
            placeholder="اكتب استفسارك للمستشار القضائي أو تحدث بصوتك..."
            className="flex-1 bg-white/10 text-white placeholder-gray-400 text-xs px-3.5 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            onClick={() => handleSendText()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-[#C59B27] hover:bg-[#D4AF37] text-[#23153c] font-bold disabled:opacity-40 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
