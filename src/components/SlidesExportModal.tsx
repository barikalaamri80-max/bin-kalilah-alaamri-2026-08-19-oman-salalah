import React, { useState, useEffect } from 'react';
import { Presentation, CheckCircle, ExternalLink, Loader2, X, AlertTriangle, History } from 'lucide-react';
import { User } from 'firebase/auth';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { createDossierPresentation, GeneratedDeckResult } from '../services/slidesService';

interface SlidesExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  accessToken: string | null;
  onRequireLogin: () => void;
}

interface ExportRecord {
  id: string;
  title: string;
  presentationUrl: string;
  createdAt: string;
  slidesCount: number;
}

export const SlidesExportModal: React.FC<SlidesExportModalProps> = ({
  isOpen,
  onClose,
  user,
  accessToken,
  onRequireLogin,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<GeneratedDeckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<ExportRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load user export history from Firestore
  useEffect(() => {
    if (isOpen && user) {
      loadHistory();
    }
  }, [isOpen, user]);

  const loadHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const q = query(collection(db, 'slide_exports'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const items: ExportRecord[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title,
          presentationUrl: data.presentationUrl,
          createdAt: data.createdAt,
          slidesCount: data.slidesCount || 5,
        });
      });
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(items);
    } catch (err: any) {
      console.warn('Could not fetch slide exports history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleStartExport = () => {
    if (!user || !accessToken) {
      onRequireLogin();
      return;
    }
    setErrorMessage(null);
    setShowConfirm(true);
  };

  const executeExport = async () => {
    setShowConfirm(false);
    setIsExporting(true);
    setErrorMessage(null);

    try {
      const result = await createDossierPresentation(
        accessToken!,
        'ملف شركة بن كليلة الرقابي والسيادي — خط تصدير أعلاف بركات 2026'
      );
      setExportResult(result);

      // Save to Firestore
      if (user) {
        const exportId = `export_${Date.now()}`;
        try {
          await setDoc(doc(db, 'slide_exports', exportId), {
            userId: user.uid,
            presentationId: result.presentationId,
            title: result.title,
            presentationUrl: result.presentationUrl,
            slidesCount: result.slidesCount,
            createdAt: new Date().toISOString(),
          });
          loadHistory();
        } catch (dbErr: any) {
          handleFirestoreError(dbErr, OperationType.CREATE, 'slide_exports');
        }
      }
    } catch (err: any) {
      console.error('Slide export failed:', err);
      setErrorMessage(err.message || 'فشل إنشاء عرض الشرائح. يرجى التأكد من صلاحيات Google Slides.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border-2 border-[#D4AF37] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="purple-panel p-5 text-white flex justify-between items-center">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Presentation className="w-6 h-6 text-[#E8C56B]" />
            <div>
              <h3 className="font-black text-lg text-amber-200">
                تصدير ملف القضية إلى Google Slides
              </h3>
              <p className="text-xs text-gray-300">
                إنشاء عرض تقديمي سيادي مؤتمت مكوّن من 5 شرائح رسمية عبر Google Workspace
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

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* User Sign In Check */}
          {!user || !accessToken ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-700 mx-auto" />
              <h4 className="font-bold text-amber-950 text-sm">
                يتطلب الاتصال بحساب Google المصرح به
              </h4>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                لتتمكن من إنشاء وتصدير العرض التقديمي مباشرة إلى Google Slides الخاص بك، يرجى تسجيل الدخول بحساب Google.
              </p>
              <button
                onClick={onRequireLogin}
                className="px-5 py-2 rounded-lg bg-[#23153c] text-[#E8C56B] hover:bg-[#35215c] font-bold text-xs transition border border-[#D4AF37]"
              >
                تسجيل الدخول والمتابعة عبر Google
              </button>
            </div>
          ) : (
            <>
              {/* Slides Structure Plan */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-[#23153c] uppercase tracking-wider">
                  محتويات الشرائح التي سيتم توليدها تلقائياً:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-black text-[#23153c] block">الشريحة 1: الغلاف السيادي والرئاسي</span>
                    <span className="text-[11px] text-gray-600">بيانات شركة بن كليلة، مرجع الإيداع، وأطراف النزاع.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-black text-[#23153c] block">الشريحة 2: التحول اللوجستي والاستثماري</span>
                    <span className="text-[11px] text-gray-600">هدر 1,000 كم والتعطيل 57 يوماً مقابل كفاءة الشراكة المباشرة.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-black text-[#23153c] block">الشريحة 3: الهندسة الرقابية وتفنيد الدفوع</span>
                    <span className="text-[11px] text-gray-600">المحاور الأربعة (Node A-D) وقانون المعاملات المدنية وحماية المنافسة.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <span className="font-black text-[#23153c] block">الشريحة 4: ثالوث المستندات ومستودع الأدلة</span>
                    <span className="text-[11px] text-gray-600">بطاقة المنتج، شهادة COA، إقرار سلامة الأعلاف، والوثائق الـ 10.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 sm:col-span-2">
                    <span className="font-black text-[#23153c] block">الشريحة 5: السند التنفيذي والطلبات الختامية</span>
                    <span className="text-[11px] text-gray-600">إلزام المطاحن بتسليم ملحقات المبيع فوراً، ووقف فرض التبعية الاحتكارية.</span>
                  </div>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-300 text-red-900 rounded-lg text-xs leading-relaxed">
                  <strong>تنبيه:</strong> {errorMessage}
                </div>
              )}

              {/* Confirmation Dialog Overlay */}
              {showConfirm && (
                <div className="p-4 bg-amber-50 border-2 border-[#D4AF37] rounded-xl space-y-3">
                  <div className="flex items-start space-x-2 space-x-reverse">
                    <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-amber-950">
                        تأكيد إنشاء العرض في Google Slides
                      </h4>
                      <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                        هل تؤكد رغبتك في إنشاء ملف عرض تقديمي جديد في حساب Google Drive الخاص بك بعنوان
                        &quot;ملف شركة بن كليلة الرقابي والسيادي&quot;؟
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-100"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={executeExport}
                      className="px-4 py-1.5 rounded-lg bg-[#23153c] text-amber-200 text-xs font-bold hover:bg-[#35215c]"
                    >
                      تأكيد الإنشاء الآن
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              {!showConfirm && !exportResult && (
                <button
                  onClick={handleStartExport}
                  disabled={isExporting}
                  className="w-full py-3 rounded-xl gold-gradient-bg text-[#23153c] font-black text-sm shadow-md hover:brightness-105 transition flex items-center justify-center space-x-2 space-x-reverse"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      <span>جاري بناء وتنسيق الشرائح عبر Google Slides API...</span>
                    </>
                  ) : (
                    <>
                      <Presentation className="w-5 h-5 ml-2" />
                      <span>بدء إنشاء وتصدير العرض التقديمي إلى Google Slides</span>
                    </>
                  )}
                </button>
              )}

              {/* Export Result Success Card */}
              {exportResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-3 animate-in fade-in">
                  <div className="flex items-center space-x-2 space-x-reverse text-emerald-900 font-black text-sm">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span>تم إنشاء العرض التقديمي بنجاح في Google Slides!</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    تم إنشاء 5 شرائح رسمية كاملة التنسيق ومحفوظة الآن في حساب Google Drive الخاص بك.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <a
                      href={exportResult.presentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                    >
                      <ExternalLink className="w-4 h-4 ml-1.5" />
                      <span>فتح العرض في Google Slides</span>
                    </a>
                    <button
                      onClick={() => setExportResult(null)}
                      className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-bold hover:bg-gray-50"
                    >
                      تصدير عرض آخر
                    </button>
                  </div>
                </div>
              )}

              {/* User Previous Exports History */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-gray-700 flex items-center">
                    <History className="w-3.5 h-3.5 ml-1 text-amber-600" />
                    سجل العروض التقديمية المصدرة سابقاً (Firestore):
                  </span>
                  {isLoadingHistory && <span className="text-[10px] text-gray-400">جاري التحديث...</span>}
                </div>

                {history.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">لا توجد عروض مصدرة مسجلة بعد في قاعدة البيانات.</p>
                ) : (
                  <div className="space-y-1.5">
                    {history.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-[#23153c] block">{rec.title}</span>
                          <span className="text-[10px] text-gray-500">
                            {new Date(rec.createdAt).toLocaleString('ar-OM')} — {rec.slidesCount} شرائح
                          </span>
                        </div>
                        <a
                          href={rec.presentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded bg-white border border-[#D4AF37] text-[#23153c] hover:bg-[#C59B27] hover:text-white font-bold text-[11px] transition inline-flex items-center"
                        >
                          <ExternalLink className="w-3 h-3 ml-1" />
                          <span>فتح</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
