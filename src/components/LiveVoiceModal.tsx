import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, X, Radio, Send, Volume2 } from 'lucide-react';
import { LiveVoiceClient, LiveMessage } from '../services/liveVoiceService';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'speaking' | 'error'>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const clientRef = useRef<LiveVoiceClient | null>(null);

  useEffect(() => {
    if (!isOpen) {
      clientRef.current?.disconnect();
      clientRef.current = null;
      setStatus('idle');
      return;
    }

    const client = new LiveVoiceClient(
      (msg) => setMessages((prev) => [...prev, msg]),
      (st) => setStatus(st)
    );
    clientRef.current = client;
    client.connect();

    return () => {
      client.disconnect();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#EAE4D3] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] flex items-center justify-center">
              <Radio className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#23153C]">المستشار الصوتي المباشر (Live)</h3>
              <p className="text-xs text-[#6B655C]">
                مرتبط بوقائع ملف صلالة 2026 — دائرة حماية المنافسة ومنع الاحتكار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#FAF9F6] border border-[#DEC98A] text-[#2C2A28] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className={`w-6 h-6 text-[#8A6D2F] ${status === 'speaking' ? 'animate-bounce' : ''}`} />
            <div>
              <div className="text-sm font-bold text-[#23153C]">
                {status === 'connecting' && 'جاري الاتصال الصوتي المباشر...'}
                {status === 'connected' && 'متصل — تحدث الآن أو اكتب سؤالك'}
                {status === 'speaking' && 'المستشار الصوتي يتحدث الآن...'}
                {status === 'error' && 'يرجى استخدام الكتابة المباشرة أدناه أو التحقق من الميكروفون'}
                {status === 'idle' && 'جاهز للاتصال'}
              </div>
              <div className="text-xs text-[#6B655C]">5 أشهر و18 يوماً من التعطيل · 3 أيام صمت رسمي</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (clientRef.current) {
                setIsMuted(clientRef.current.toggleMute());
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
              isMuted
                ? 'bg-[#F5EFE0] text-[#23153C] border-[#C5A858]'
                : 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMuted ? 'إلغاء كتم الميكروفون' : 'كتم الميكروفون'}</span>
          </button>
        </div>

        {messages.length > 0 && (
          <div className="max-h-52 overflow-y-auto space-y-2 p-3 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-xl text-xs sm:text-sm ${
                  m.sender === 'user'
                    ? 'bg-[#F5EFE0] text-[#23153C] font-bold'
                    : 'bg-[#FFFFFF] text-[#2C2A28] border border-[#DEC98A]'
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!textInput.trim()) return;
            clientRef.current?.sendTextMessage(textInput.trim());
            setTextInput('');
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="أرسل سؤالك للمستشار الصوتي المباشر..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#DEC98A] text-xs sm:text-sm text-[#2C2A28]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LiveVoiceModal;
