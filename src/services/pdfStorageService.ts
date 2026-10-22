// خدمة حفظ ومشاركة ملفات العروض التقديمية (PDF) بين مكتبة العروض والمساعد الذكي (Gemini)
// تستخدم IndexedDB لحفظ ملفات PDF الكبيرة محلياً حتى تبقى متاحة دائماً للفاضل / خالد المسروري المحترم

export interface StoredPdfPresentation {
  id: string;
  name: string;
  uploadDate: string;
  sizeLabel: string;
  summary: string;
  base64Data?: string; // بدون البادئة data:application/pdf;base64,
  isBuiltInVisualDeck?: boolean;
  slideCount?: number;
}

const DB_NAME = 'bka_salalah2026_pdf_db';
const STORE_NAME = 'presentations';
const DB_VERSION = 1;

type PdfListListener = (items: StoredPdfPresentation[]) => void;
const listeners = new Set<PdfListListener>();

export const BUILT_IN_PRESENTATION: StoredPdfPresentation = {
  id: 'builtin-salalah-2026-visual-deck',
  name: 'العرض التقديمي الشامل بالرسوم البيانية — منازعات تصدير الأعلاف (صلالة 2026).pdf',
  uploadDate: 'أكتوبر 2026 — نسخة معتمدة للعرض الرقابي',
  sizeLabel: '22 شريحة مصورة (A4)',
  summary:
    'عرض تقديمي بصري متكامل يتضمن الرسوم التوضيحية والمخططات البيانية لجميع المحاور الـ 22، والأسئلة الرقابية الستة، وتوثيق الـ 5 أشهر و18 يوماً من التعطيل والـ 3 أيام من الصمت الرسمي.',
  isBuiltInVisualDeck: true,
  slideCount: 22,
};

let memoryItems: StoredPdfPresentation[] = [BUILT_IN_PRESENTATION];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function loadStoredPdfs(): Promise<StoredPdfPresentation[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const userPdfs = (req.result || []) as StoredPdfPresentation[];
        memoryItems = [...userPdfs.reverse(), BUILT_IN_PRESENTATION];
        notifyListeners();
        resolve(memoryItems);
      };
      req.onerror = () => {
        resolve(memoryItems);
      };
    });
  } catch {
    return memoryItems;
  }
}

export async function saveUploadedPdf(file: File, customSummary?: string): Promise<StoredPdfPresentation> {
  const base64Data = await fileToBase64(file);
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const newPdf: StoredPdfPresentation = {
    id: `pdf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: file.name,
    uploadDate: new Date().toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    sizeLabel: `${sizeMB} MB · ملف PDF`,
    summary:
      customSummary ||
      `عرض تقديمي ومستند رسمي مرفوع بصيغة PDF (${file.name}) جاهز للعرض المباشر والتحليل الذكي.`,
    base64Data,
    isBuiltInVisualDeck: false,
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(newPdf);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // fallback in memory if IDB quota exceeded
  }

  memoryItems = [newPdf, ...memoryItems.filter((item) => item.id !== newPdf.id)];
  notifyListeners();
  return newPdf;
}

export async function deleteStoredPdf(id: string): Promise<void> {
  if (id === BUILT_IN_PRESENTATION.id) return;
  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
  memoryItems = memoryItems.filter((item) => item.id !== id);
  notifyListeners();
}

export function subscribeToPdfs(listener: PdfListListener): () => void {
  listeners.add(listener);
  listener(memoryItems);
  loadStoredPdfs();
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((l) => l(memoryItems));
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function base64ToBlobUrl(base64Data: string, mimeType = 'application/pdf'): string {
  const byteCharacters = window.atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  return URL.createObjectURL(blob);
}
