import React, { useState, useEffect } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import {
  subscribeToTTS,
  stopAllAudio,
  setGlobalPlaybackSpeed,
  getGlobalPlaybackSpeed,
} from '../services/ttsService';

export const TTSPlayerBar: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(getGlobalPlaybackSpeed());

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading, title, spd) => {
      setActiveId(id);
      setIsLoading(loading);
      setActiveTitle(title || null);
      if (spd) setSpeed(spd);
    });
    return () => unsub();
  }, []);

  if (!activeId) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto rounded-2xl bg-[#23153C] text-[#FFF3C4] border-2 border-[#D4AF37] px-4 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 no-print"
      dir="rtl"
    >
      <div className="flex items-center gap-3">
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin text-[#D4AF37] shrink-0" />
        ) : (
          <Volume2 className="w-5 h-5 text-[#D4AF37] animate-pulse shrink-0" />
        )}
        <div>
          <div className="text-[11px] text-[#E6DEC8]">قيد الاستماع الصوتي الآن:</div>
          <div className="text-xs sm:text-sm font-bold text-[#FFF3C4] line-clamp-1">
            {activeTitle || 'صوتي الوثيقة — صلالة 2026'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#180E2B] border border-[#D4AF37]/40 rounded-xl p-1 gap-1">
          {[0.9, 1, 1.25].map((spd) => (
            <button
              key={spd}
              onClick={() => setGlobalPlaybackSpeed(spd)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${
                speed === spd ? 'bg-[#D4AF37] text-[#23153C]' : 'text-[#E6DEC8]'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <button
          onClick={() => stopAllAudio()}
          className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-[#23153C] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>إيقاف الصوت</span>
        </button>
      </div>
    </div>
  );
};

export default TTSPlayerBar;
