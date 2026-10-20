import React, { useState, useEffect } from 'react';
import { X, Volume2, ShieldCheck, Scale, FileText, CheckCircle2, Bookmark, Save, Loader2, AlertCircle } from 'lucide-react';
import { EvidenceDoc } from '../data/dossierData';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

interface EvidenceModalProps {
  docItem: EvidenceDoc | null;
  onClose: () => void;
  user: User | null;
  onPlayTTS: (text: string, title: string) => void;
  isTTSPlaying: boolean;
  onRequireLogin: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  docItem,
  onClose,
  user,
  onPlayTTS,
  isTTSPlaying,
  onRequireLogin,
}) => {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'reviewed' | 'in_question' | 'verified' | 'flagged'>('reviewed');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    if (docItem && user) {
      loadUserNote();
    } else {
      setNote('');
      setStatus('reviewed');
    }
  }, [docItem, user]);

  const loadUserNote = async () => {
    if (!docItem || !user) return;
    setLoadingNote(true);
    try {
      const noteDocId = `${user.uid}_${docItem.id}`;
      const snap = await getDoc(doc(db, 'user_notes', noteDocId));
      if (snap.exists()) {
        const data = snap.data();
        setNote(data.note || '');
        setStatus(data.status || 'reviewed');
      } else {
        setNote('');
        setStatus('reviewed');
      }
    } catch (err: any) {
      console.warn('Could not fetch existing note from Firestore:', err);
    } finally {
      setLoadingNote(false);
    }
  };

  const handleSaveNote = async () => {
    if (!user) {
      onRequireLogin();
      return;
    }
    if (!docItem) return;

    setIsSavingNote(true);
    setSavedSuccess(false);

    try {
      const noteDocId = `${user.uid}_${docItem.id}`;
      await setDoc(doc(db, 'user_notes', noteDocId), {
        userId: user.uid,
        docId: docItem.id,
        note: note.trim(),
        status,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      handleFirestoreError(err, OperationType.WRITE, `user_notes/${user.uid}_${docItem.id}`);
    } finally {
      setIsSavingNote(false);
    }
  };

  if (!docItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-[#D4AF37] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="purple-panel p-5 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center space-x-3 space-x-reverse">
            <span className="px-2.5 py-1 rounded bg-[#C59B27] text-[#23153c] font-black text-xs font-num shadow-sm">
              {docItem.id}
            </span>
            <div>
              <h3 className="font-black text-base text-amber-200">{docItem.title}</h3>
              <span className="text-[11px] text-gray-300 font-bold block">{docItem.tag}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Audio TTS Trigger for this document */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Volume2 className="w-5 h-5 text-amber-700 shrink-0" />
              <span className="text-xs font-bold text-amber-950">
                استماع للتحليل القانوني والاستقراء الجنائي بصوت الذكاء الاصطناعي
              </span>
            </div>
            <button
              onClick={() => onPlayTTS(`${docItem.title}. ${docItem.fullAnalysis}. المرتكز القانوني: ${docItem.legalBasis}`, docItem.title)}
              className="px-3.5 py-1.5 rounded-lg bg-[#23153c] hover:bg-[#35215c] text-amber-200 text-xs font-bold transition flex items-center"
            >
              <Volume2 className="w-3.5 h-3.5 ml-1.5" />
              <span>استماع (TTS)</span>
            </button>
          </div>

          {/* Full Forensic Analysis */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 space-x-reverse text-xs font-bold text-[#23153c]">
              <Scale className="w-4 h-4 text-[#C59B27]" />
              <span>التحليل القانوني وفحص القرائن الدامغة:</span>
            </div>
            <p className="text-xs text-gray-800 leading-relaxed bg-[#FAF9F6] p-4 rounded-xl border border-gray-200 text-justify">
              {docItem.fullAnalysis}
            </p>
          </div>

          {/* Legal Basis & Statutory Grounds */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-bold text-[#23153c] block mb-1">المرتكز التشريعي والنظامي:</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">{docItem.legalBasis}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <span className="font-bold text-[#23153c] block mb-1">النتيجة القضائية المستخلصة:</span>
              <p className="text-[11px] text-gray-600 leading-relaxed">{docItem.statutoryGrounds}</p>
            </div>
          </div>

          {/* Regulatory Inspector Notes Form (Firestore Persistence) */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse text-xs font-bold text-[#23153c]">
                <Bookmark className="w-4 h-4 text-[#C59B27]" />
                <span>سجل الملاحظات الرقابية والتقييم الإجرائي (Firestore):</span>
              </div>
              {savedSuccess && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 ml-1" />
                  تم الحفظ في قاعدة البيانات
                </span>
              )}
            </div>

            {!user ? (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-center">
                <p className="text-xs text-gray-500 mb-2">
                  سجل دخولك بحساب Google لتدوين ملاحظاتك الرقابية وحفظها في قاعدة البيانات السحابية.
                </p>
                <button
                  onClick={onRequireLogin}
                  className="px-3 py-1 rounded bg-[#23153c] text-amber-200 font-bold text-xs"
                >
                  تسجيل الدخول الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-600">حالة المراجعة:</span>
                  <select
                    value={status}
                    onChange={(e: any) => setStatus(e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2.5 py-1 bg-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="reviewed">تمت المراجعة والتدقيق (Reviewed)</option>
                    <option value="verified">مؤكد ثبوتياً وجنائياً (Verified)</option>
                    <option value="in_question">محل استيضاح رقابي (In Question)</option>
                    <option value="flagged">مؤشر عوار جسيم (Flagged)</option>
                  </select>
                </div>

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="أدخل تقييمك الرقابي أو ملحوظات الترافع حول هذا المستند..."
                  rows={3}
                  className="w-full text-xs p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#D4AF37] leading-relaxed resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveNote}
                    disabled={isSavingNote || loadingNote}
                    className="px-4 py-1.5 rounded-lg bg-[#23153c] hover:bg-[#35215c] text-amber-200 text-xs font-bold transition flex items-center"
                  >
                    {isSavingNote ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 ml-1.5 animate-spin" />
                        <span>جاري الحفظ...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5 ml-1.5" />
                        <span>حفظ التقييم بقاعدة البيانات</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-gray-500">
            وثيقة مقيدة بالسجل الرقابي الرقمي لشركة بن كليلة 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
