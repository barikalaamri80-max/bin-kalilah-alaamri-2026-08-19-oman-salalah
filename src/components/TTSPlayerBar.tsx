import React from 'react';
import { Play, Pause, Square, Volume2, Loader2 } from 'lucide-react';

interface TTSPlayerBarProps {
  currentTitle: string;
  isPlaying: boolean;
  isLoading: boolean;
  onTogglePlay: () => void;
  onStop: () => void;
}

export const TTSPlayerBar: React.FC<TTSPlayerBarProps> = ({
  currentTitle,
  isPlaying,
  isLoading,
  onTogglePlay,
  onStop,
}) => {
  if (!currentTitle && !isLoading) return null;

  return (
    <aside aria-label="مشغل الصوت الذكي" className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:max-w-md z-50 bg-[#1e1233]/95 border-2 border-[#D4AF37] rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-white animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 space-x-reverse min-w-0">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-[#D4AF37] flex items-center justify-center shrink-0">
            {isLoading ? (
              <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
            ) : (
              <Volume2 className="w-5 h-5 text-amber-300 animate-pulse" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">
              {isLoading ? 'جاري توليد الصوت (Gemini Flash TTS)...' : 'المستشار الصوتي يقرأ الآن:'}
            </span>
            <p className="text-xs font-bold truncate text-gray-100">{currentTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isLoading && (
            <button
              onClick={onTogglePlay}
              className="p-2 rounded-xl bg-[#C59B27] hover:bg-[#D4AF37] text-[#23153c] font-bold transition shadow-sm"
              title={isPlaying ? 'إيقاف مؤقت' : 'متابعة التشغيل'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          )}

          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition"
            title="إيقاف نهائي"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
