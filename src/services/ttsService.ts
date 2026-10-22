// خدمة النطق الصوتي الفوري والقراءة المتسلسلة للوثيقة والعروض التقديمية
// تحافظ على نبرة الصوت الوقورة والعميقة (أبطأ وأخفض من الطبيعي: Rate 0.85-0.90, Pitch 0.88)
// وتعمل فوراً عند الضغط على أي زر سماعة أو عند تشغيل القراءة المتسلسلة لجميع الشرائح

export type VoicePersona = 'khalid' | 'auditor' | 'official';

export interface SequentialAudioItem {
  id: string;
  text: string;
  title?: string;
  persona?: VoicePersona;
}

type Listener = (
  activeId: string | null,
  isLoading: boolean,
  currentTitle?: string,
  speed?: number
) => void;

let currentAudio: HTMLAudioElement | null = null;
let activeId: string | null = null;
let isLoading = false;
let currentTitle = '';
let globalPlaybackSpeed = 0.9; // سرعة الإلقاء الوقورة المعتمدة (0.9x)
let requestCounter = 0;

// ذاكرة عميل ذكية: إذا كان الخادم في حالة التبريد لحصة الـ API، ننتقل مباشرة وبصفر تأخير إلى الصوت المحلي الوقور
let preferInstantBrowserTTS = false;

// حالة التشغيل المتسلسل (قراءة كل الشرائح وراء بعض)
let sequentialQueue: SequentialAudioItem[] = [];
let sequentialIndex = -1;
let isPlayingSequence = false;

// تخزين الأصوات العربية المحملة مسبقاً في المتصفح لضمان استجابة فورية من أول ضغطة
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    const v = window.speechSynthesis.getVoices();
    if (v && v.length > 0) {
      cachedVoices = v;
    }
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

const listeners = new Set<Listener>();
const audioMemoryCache = new Map<string, string>();

export function subscribeToTTS(listener: Listener): () => void {
  listeners.add(listener);
  listener(activeId, isLoading, currentTitle, globalPlaybackSpeed);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((l) => l(activeId, isLoading, currentTitle, globalPlaybackSpeed));
}

export function setGlobalPlaybackSpeed(speed: number) {
  globalPlaybackSpeed = speed;
  if (currentAudio) {
    currentAudio.playbackRate = speed;
  }
  notify();
}

export function getGlobalPlaybackSpeed(): number {
  return globalPlaybackSpeed;
}

export function isSequentialPlaybackActive(): boolean {
  return isPlayingSequence;
}

// خلفية صوتية وطنية اختيارية هادئة
class NationalAmbientEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private nodes: AudioNode[] = [];

  start() {
    if (this.isPlaying) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isPlaying = true;

      const freqs = [130.81, 196.0, 261.63, 329.63];
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.015, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);

      freqs.forEach((f) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start();
        this.nodes.push(osc, gain);
      });
      this.nodes.push(masterGain);
    } catch {
      // ignore audio context errors
    }
  }

  stop() {
    this.isPlaying = false;
    this.nodes.forEach((n) => {
      try {
        if ('stop' in n && typeof (n as OscillatorNode).stop === 'function') {
          (n as OscillatorNode).stop();
        }
        n.disconnect();
      } catch {
        // ignore
      }
    });
    this.nodes = [];
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const ambientTone = new NationalAmbientEngine();

let speechKeepAliveTimer: ReturnType<typeof setInterval> | null = null;

function clearSpeechKeepAlive() {
  if (speechKeepAliveTimer) {
    clearInterval(speechKeepAliveTimer);
    speechKeepAliveTimer = null;
  }
}

export function stopAllAudio() {
  requestCounter++;
  isPlayingSequence = false;
  sequentialQueue = [];
  sequentialIndex = -1;
  clearSpeechKeepAlive();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  ambientTone.stop();
  activeId = null;
  isLoading = false;
  currentTitle = '';
  notify();
}

function pcmBase64ToWavUrl(base64Pcm: string, sampleRate = 24000): string {
  const binaryString = window.atob(base64Pcm);
  const pcmLength = binaryString.length;
  const wavBuffer = new ArrayBuffer(44 + pcmLength);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmLength, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmLength, true);

  const bytes = new Uint8Array(wavBuffer, 44);
  for (let i = 0; i < pcmLength; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([wavBuffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/**
 * تنظيف النص وتقسيمه إلى جمل متزنة لضمان سلاسة النطق وعدم توقف المتصفح في النصوص الطويلة
 */
export function cleanAndSegmentTextForTTS(rawText: string): {
  cleanedText: string;
  segments: string[];
} {
  const cleanedText = rawText
    .replace(/[\r\n]+/g, ' . ')
    .replace(/[«»""'']/g, ' ')
    .replace(/[—–\-_/\\|•·]+/g, ' ، ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([،.؛:!؟])/g, '$1')
    .trim();

  const segments = cleanedText
    .split(/(?<=[.؟!؛،])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  // دمج المقاطع القصيرة جداً حتى لا يكون هناك تقطيع مبالغ فيه
  const mergedSegments: string[] = [];
  let buffer = '';
  for (const seg of segments) {
    if ((buffer + ' ' + seg).trim().length <= 180) {
      buffer = (buffer + ' ' + seg).trim();
    } else {
      if (buffer) mergedSegments.push(buffer);
      buffer = seg;
    }
  }
  if (buffer) mergedSegments.push(buffer);

  return {
    cleanedText,
    segments: mergedSegments.length > 0 ? mergedSegments : [cleanedText],
  };
}

function selectBestArabicVoice(): SpeechSynthesisVoice | undefined {
  const voices =
    cachedVoices.length > 0
      ? cachedVoices
      : typeof window !== 'undefined' && 'speechSynthesis' in window
      ? window.speechSynthesis.getVoices()
      : [];

  return (
    voices.find((v) => v.lang === 'ar-OM') ||
    voices.find((v) => v.lang === 'ar-SA' && v.name.toLowerCase().includes('male')) ||
    voices.find((v) => v.lang === 'ar-SA') ||
    voices.find((v) => v.lang === 'ar-AE') ||
    voices.find((v) => v.lang.startsWith('ar') && v.name.toLowerCase().includes('tarik')) ||
    voices.find((v) => v.lang.startsWith('ar') && v.name.toLowerCase().includes('maged')) ||
    voices.find((v) => v.lang.startsWith('ar') && v.name.toLowerCase().includes('naayf')) ||
    voices.find((v) => v.lang.startsWith('ar'))
  );
}

function fallbackWebSpeech(
  text: string,
  id: string,
  thisRequestId: number,
  persona: VoicePersona = 'khalid',
  onEnd?: () => void
) {
  if (thisRequestId !== requestCounter) return;

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    activeId = null;
    isLoading = false;
    notify();
    if (onEnd) onEnd();
    return;
  }

  try {
    clearSpeechKeepAlive();
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }

  const { segments } = cleanAndSegmentTextForTTS(text);
  const chosenVoice = selectBestArabicVoice();

  // الحفاظ التام على مستوى الصوت الوقور والعميق الذي طلبه المستخدم
  const targetRate =
    persona === 'khalid'
      ? Math.min(0.85, globalPlaybackSpeed)
      : Math.min(0.9, globalPlaybackSpeed);
  const targetPitch = persona === 'khalid' ? 0.88 : 0.92;

  activeId = id;
  isLoading = false;
  notify();

  let currentSegIdx = 0;

  // مؤقت تنشيط يمنع متصفح Chrome من إيقاف الصوت تلقائياً في الفقرات الطويلة
  speechKeepAliveTimer = setInterval(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch {
          // ignore
        }
      }
    }
  }, 10000);

  const speakNextSegment = () => {
    if (thisRequestId !== requestCounter) {
      clearSpeechKeepAlive();
      return;
    }

    if (currentSegIdx >= segments.length) {
      clearSpeechKeepAlive();
      if (activeId === id) {
        activeId = null;
        isLoading = false;
        currentTitle = '';
        notify();
      }
      if (onEnd) onEnd();
      return;
    }

    const segText = segments[currentSegIdx];
    currentSegIdx++;

    const utterance = new SpeechSynthesisUtterance(segText);
    utterance.lang = chosenVoice?.lang || 'ar-OM';
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.rate = targetRate;
    utterance.pitch = targetPitch;

    utterance.onend = () => {
      if (thisRequestId !== requestCounter) return;
      speakNextSegment();
    };

    utterance.onerror = () => {
      if (thisRequestId !== requestCounter) return;
      speakNextSegment();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch {
      clearSpeechKeepAlive();
      activeId = null;
      isLoading = false;
      notify();
      if (onEnd) onEnd();
    }
  };

  // تأخير بسيط جداً (30ms) بعد cancel() يضمن عدم ابتلاع المتصفح لأول جملة عند التنقل السريع بين الأزرار
  setTimeout(() => {
    if (thisRequestId === requestCounter) {
      speakNextSegment();
    }
  }, 30);
}

/**
 * تشغيل متسلسل لقائمة من الشرائح أو الفقرات بضغطة زر واحدة (يقرأها وراء بعض تلقائياً)
 */
export function speakSequence(items: SequentialAudioItem[], onSequenceComplete?: () => void) {
  if (!items || items.length === 0) return;

  // إذا كان التشغيل المتسلسل يعمل حالياً، فإن الضغط مرة أخرى يوقفه
  if (isPlayingSequence) {
    stopAllAudio();
    return;
  }

  stopAllAudio();
  isPlayingSequence = true;
  sequentialQueue = [...items];
  sequentialIndex = 0;

  const playCurrentStep = () => {
    if (!isPlayingSequence || sequentialIndex < 0 || sequentialIndex >= sequentialQueue.length) {
      isPlayingSequence = false;
      sequentialQueue = [];
      sequentialIndex = -1;
      notify();
      if (onSequenceComplete) onSequenceComplete();
      return;
    }

    const item = sequentialQueue[sequentialIndex];
    // تمرير الشاشة تلقائياً إلى الشريحة التي تُقرأ الآن إن وجدت في الصفحة
    if (typeof document !== 'undefined') {
      const domEl =
        document.getElementById(item.id) ||
        document.getElementById(`slide-a4-${sequentialIndex + 1}`);
      if (domEl) {
        domEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    speakArabicTextInternal(
      item.text,
      item.id,
      item.persona || 'khalid',
      () => {
        if (!isPlayingSequence) return;
        sequentialIndex++;
        playCurrentStep();
      },
      item.title || `شريحة ${sequentialIndex + 1} من ${sequentialQueue.length}`,
      true
    );
  };

  playCurrentStep();
}

export async function speakArabicText(
  text: string,
  id: string,
  persona: VoicePersona = 'khalid',
  onEnd?: () => void,
  title?: string
) {
  // إذا ضغط المستخدم على زر مفرد أثناء التشغيل المتسلسل، نوقف التسلسل ونقرأ الزر المضغوط
  isPlayingSequence = false;
  sequentialQueue = [];
  sequentialIndex = -1;
  return speakArabicTextInternal(text, id, persona, onEnd, title, false);
}

async function speakArabicTextInternal(
  text: string,
  id: string,
  persona: VoicePersona = 'khalid',
  onEnd?: () => void,
  title?: string,
  keepSequenceFlag = false
) {
  const savedSeq = isPlayingSequence;
  const savedQueue = sequentialQueue;
  const savedIdx = sequentialIndex;

  requestCounter++;
  clearSpeechKeepAlive();

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = '';
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }

  if (keepSequenceFlag) {
    isPlayingSequence = savedSeq;
    sequentialQueue = savedQueue;
    sequentialIndex = savedIdx;
  }

  const thisRequestId = requestCounter;
  const { cleanedText } = cleanAndSegmentTextForTTS(text);
  const cacheKey = `${persona}:${cleanedText}`;

  activeId = id;
  currentTitle = title || 'استماع صوتي للوثيقة';

  const cachedAudioUrl = audioMemoryCache.get(cacheKey);
  if (cachedAudioUrl) {
    isLoading = false;
    notify();

    const audio = new Audio(cachedAudioUrl);
    audio.playbackRate = globalPlaybackSpeed;
    currentAudio = audio;

    audio.onended = () => {
      if (thisRequestId !== requestCounter) return;
      activeId = null;
      isLoading = false;
      currentTitle = '';
      currentAudio = null;
      notify();
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      if (thisRequestId !== requestCounter) return;
      fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
    };

    await audio.play().catch(() => {
      if (thisRequestId === requestCounter) {
        fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
      }
    });
    return;
  }

  // إذا كان الصوت المحلي الفوري مفعلاً، نبدأ القراءة فوراً بدون انتظار الشبكة
  if (preferInstantBrowserTTS) {
    fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
    return;
  }

  isLoading = true;
  notify();

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanedText, persona }),
    });

    if (thisRequestId !== requestCounter) return;

    if (!response.ok) {
      preferInstantBrowserTTS = true;
      fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
      return;
    }

    const data = await response.json();
    if (thisRequestId !== requestCounter) return;

    if (data.fallbackToBrowserTTS || !data.audioBase64) {
      preferInstantBrowserTTS = true;
      fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
      return;
    }

    const wavUrl = pcmBase64ToWavUrl(data.audioBase64, 24000);
    audioMemoryCache.set(cacheKey, wavUrl);

    const audio = new Audio(wavUrl);
    audio.playbackRate = globalPlaybackSpeed;
    currentAudio = audio;
    isLoading = false;
    notify();

    audio.onended = () => {
      if (thisRequestId !== requestCounter) return;
      activeId = null;
      isLoading = false;
      currentTitle = '';
      currentAudio = null;
      notify();
      if (onEnd) onEnd();
    };

    audio.onerror = () => {
      if (thisRequestId !== requestCounter) return;
      fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
    };

    await audio.play();
  } catch {
    if (thisRequestId === requestCounter) {
      preferInstantBrowserTTS = true;
      fallbackWebSpeech(cleanedText, id, thisRequestId, persona, onEnd);
    }
  }
}

export async function extractAndDownloadAudio(
  text: string,
  filename = 'salalah-2026-audio.wav',
  persona: VoicePersona = 'khalid'
): Promise<boolean> {
  speakArabicText(text, `play-${filename}`, persona, undefined, filename);
  return true;
}
