import React, { useState } from 'react';
import {
  FileText,
  Eye,
  Download,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Volume2,
  Square,
  FolderOpen,
} from 'lucide-react';
import { speakArabicText, stopAllAudio, subscribeToTTS } from '../services/ttsService';

interface StudioEvidenceDoc {
  id: string;
  refCode: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  legalNote: string;
  imageUrl?: string;
}

const OFFICIAL_STUDIO_EVIDENCE: StudioEvidenceDoc[] = [
  {
    id: 'doc-1',
    refCode: 'DOC-BM-01',
    title: 'إيصالات التحويل المصرفي المسبق 100% عبر بنك مسقط (18,640 ر.ع)',
    date: '27 أبريل – 13 مايو 2026',
    category: 'المستندات المصرفية',
    summary:
      'إيصال رقم 686568727 (4,580 ر.ع)، وإيصال رقم 689375818 (4,760 ر.ع)، وإيصال رقم 691776712 (9,300 ر.ع) المسددة نقداً ومقدماً لحساب المصنع.',
    legalNote: 'تثبت السداد النقدي المسبق الكامل 100% وعدم وجود أي التزام مالي معلق.',
    imageUrl: '/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg',
  },
  {
    id: 'doc-2',
    refCode: 'DOC-CUSTOMS-02',
    title: 'البيان الجمركي للشحنة الأولى عبر منفذ خطم الشكلة (إنجاز خلال 24 ساعة)',
    date: '1 مايو 2026',
    category: 'البيانات الجمركية',
    summary:
      'البيان الجمركي رقم 20261501028987 لعبور 500 كيس علف دجاج لاحم بادي (Broiler Starter — 25 طن) وتصريح العبور رقم 243/2026.',
    legalNote: 'القرينة العملية القاطعة على إنجاز المعاملة في 24 ساعة عند توفر التعاون المستندي.',
    imageUrl: '/assets/aistudio/Screenshot_20260903_041907_1697c674.jpg',
  },
  {
    id: 'doc-3',
    refCode: 'DOC-INV-03',
    title: 'الفاتورتان الضريبيتان OFM/270 و OFM/271 والشهادة البيطرية 829 وشهادتا المنشأ',
    date: '13 – 18 مايو 2026',
    category: 'فواتير وشهادات المنشأ',
    summary:
      'إصدار المصنع للفاتورتين الضريبيتين 270 و271 والشهادة الصحية البيطرية رقم 829 وشهادتي المنشأ الخليجية 2026/1626906 و2026/1626907 وخطاب 283/2026.',
    legalNote: 'تثبت علم المصنع التام والمباشر بأن البضاعة مخصصة للتصدير إلى دولة الإمارات العربية المتحدة.',
    imageUrl: '/assets/aistudio/Screenshot____________________cd71340d.jpg',
  },
  {
    id: 'doc-4',
    refCode: 'DOC-COA-04',
    title: 'شهادة التحليل المخبري (COA) الصادرة عن دائرة الجودة بالمصنع (مضادات الكوكزيديا)',
    date: '23 يونيو 2026',
    category: 'المطابقة الفنية والمخبرية',
    summary:
      'شهادة التحليل المخبري (Quality Assurance & Central Lab) التي تثبت وجود مادة مضادات الكوكزيديا (Anticoccidials) في المنتج، مقابل إغفالها في البطاقة التعريفية.',
    legalNote: 'تثبت التناقض الداخلي بين شهادة مختبر الجودة وإفادة مسؤول التصدير الرافض لإعادة الطباعة.',
  },
  {
    id: 'doc-5',
    refCode: 'DOC-LAYER-05',
    title: 'إقرار السلامة لمنتج علف بياض (Layer Feed) المرسل لصفقة علف لاحم (Broiler)',
    date: '28 سبتمبر 2026',
    category: 'المستندات غير المطابقة',
    summary:
      'إرسال إقرار سلامة غذائية يخص علف الدجاج البياض (Layer Feed) المؤرخ في مايو 2025 لصفقة موضوعها الحصري علف الدجاج اللاحم (Broiler Starter & Finisher).',
    legalNote: 'قرينة مادية على تزويد المستثمر بمستندات غير مطابقة لطبيعة البضاعة المشتراة.',
  },
  {
    id: 'doc-6',
    refCode: 'DOC-MOCCAE-06',
    title: 'خطاب المهلة الرسمية (3 أيام عمل) الموجه للثلاثة مسؤولين ومرفق وزارة التغير المناخي والبيئة',
    date: '16 – 19 أكتوبر 2026',
    category: 'المهلة الرسمية والخطابات',
    summary:
      'الخطاب الرسمي رقم BKA/OMF-MOCCAE/2026/10 المرسل بصيغة PDF إلى فيصل المعشني وأدهم البلوشي ومهند الرئيسي تنفيذاً لمهلة الـ 3 أيام عمل الممنوحة من دائرة المنافسة.',
    legalNote: 'انقضاء المهلة الرسمية (3 أيام عمل) بصمت رسمي مطبق دون أي رد أو تصحيح مستندي.',
  },
];

export const StudioEvidenceUpload: React.FC = () => {
  const [docs, setDocs] = useState<StudioEvidenceDoc[]>(OFFICIAL_STUDIO_EVIDENCE);
  const [selectedDoc, setSelectedDoc] = useState<StudioEvidenceDoc | null>(null);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  React.useEffect(() => {
    const unsub = subscribeToTTS((id) => setActiveAudioId(id));
    return () => unsub();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    const newItem: StudioEvidenceDoc = {
      id: `custom-${Date.now()}`,
      refCode: `DOC-STUDIO-${docs.length + 1}`,
      title: file.name,
      date: 'أكتوبر 2026',
      category: 'مرفق مباشر من الاستوديو',
      summary: 'مستند مرفوع مباشرة من الاستوديو لإرفاقه ضمن حافظة القرائن الرسمية.',
      legalNote: 'محفوظ ضمن الفهرس المستندي لملف صلالة 2026.',
      imageUrl: url,
    };
    setDocs((prev) => [newItem, ...prev]);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#DEC98A] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#8A6D2F]">
            <FolderOpen className="w-3.5 h-3.5" />
            الرفع المباشر للأدلة من الاستوديو — أرقام مرجعية رسمية موجزة
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#23153C] royal-heading">
            حافظة المستندات والأدلة الرسمية الموثقة
          </h2>
          <p className="text-sm text-[#524E48]">
            استعراض وتحميل ورفع القرائن المستندية المباشرة المرتبطة بملف المطابقة المستندية (صلالة 2026).
          </p>
        </div>

        <label className="px-5 py-3 rounded-2xl bg-[#23153C] text-[#FFF3C4] border border-[#D4AF37] text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shrink-0 hover:opacity-95">
          <Upload className="w-4 h-4 text-[#D4AF37]" />
          <span>رفع مستند أو صورة دليل من الجهاز</span>
          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {docs.map((doc) => {
          const audioKey = `studio-doc-${doc.id}`;
          const isPlaying = activeAudioId === audioKey;
          return (
            <div
              key={doc.id}
              className="rounded-3xl p-5 bg-[#FFFFFF] border border-[#DEC98A] flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-[#23153C] text-[#FFF3C4] text-xs font-bold border border-[#D4AF37]">
                    {doc.refCode}
                  </span>
                  <span className="text-xs font-bold text-[#8A6D2F]">{doc.date}</span>
                </div>

                <h3 className="text-base font-bold text-[#23153C] leading-snug">{doc.title}</h3>
                <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">{doc.summary}</p>

                <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6DEC8] text-xs text-[#23153C] font-semibold flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#8A6D2F] shrink-0 mt-0.5" />
                  <span>{doc.legalNote}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE4D3] flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => {
                    if (isPlaying) stopAllAudio();
                    else speakArabicText(`${doc.title}. ${doc.summary}`, audioKey, 'official', undefined, doc.title);
                  }}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#2C2A28] border border-[#DEC98A] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Square className="w-3.5 h-3.5 fill-current text-[#8A6D2F]" />
                      <span>إيقاف</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#8A6D2F]" />
                      <span>قراءة الدليل</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    className="px-3 py-2 rounded-xl bg-[#F5EFE0] hover:bg-[#EDE2C8] text-[#23153C] border border-[#C5A858] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    <span>عرض مباشر</span>
                  </button>
                  {doc.imageUrl && (
                    <a
                      href={doc.imageUrl}
                      download={doc.refCode}
                      className="p-2 rounded-xl bg-[#FAF9F6] hover:bg-[#F5EFE0] text-[#23153C] border border-[#DEC98A]"
                      title="تنزيل المستند"
                    >
                      <Download className="w-3.5 h-3.5 text-[#8A6D2F]" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="bg-[#FFFFFF] border-2 border-[#D4AF37] rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#EAE4D3] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#8A6D2F]" />
                <span className="font-bold text-base text-[#23153C]">
                  {selectedDoc.refCode} — {selectedDoc.title}
                </span>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-3 py-1 rounded-xl bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold cursor-pointer"
              >
                إغلاق
              </button>
            </div>

            {selectedDoc.imageUrl && (
              <div className="rounded-2xl overflow-hidden border border-[#DEC98A] bg-[#FAF9F6]">
                <img
                  src={selectedDoc.imageUrl}
                  alt={selectedDoc.title}
                  className="w-full max-h-96 object-contain mx-auto"
                />
              </div>
            )}

            <p className="text-sm text-[#2C2A28] leading-relaxed">{selectedDoc.summary}</p>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#8A6D2F] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{selectedDoc.legalNote}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioEvidenceUpload;
