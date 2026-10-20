import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Camera,
  Image as ImageIcon,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Plus,
  ShieldCheck,
  Download,
} from 'lucide-react';

export interface UploadedEvidenceItem {
  id: string;
  title: string;
  category: 'bank' | 'lab' | 'field' | 'correspondence' | 'customs';
  categoryLabel: string;
  notes: string;
  dataUrl: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
}

const DEFAULT_ARCHIVAL_EVIDENCE: UploadedEvidenceItem[] = [
  {
    id: 'arch-1',
    title: 'وثيقة السداد النقدي المسبق وحوالة بنك مسقط',
    category: 'bank',
    categoryLabel: 'إشعار سداد بنكي',
    notes: 'تحويل كامل المبلغ مقدماً بحساب شركة المطاحن العمانية ش.م.ع.ع بقيمة 18,640.000 ر.ع دون أي تأجيل.',
    dataUrl: '/assets/aistudio/Screenshot_20260903_041907_1697c674.jpg',
    fileName: 'Proof_of_Payment_BankMuscat.jpg',
    fileSize: '1.4 MB',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'arch-2',
    title: 'رصد شاحنات الأسطول بالمنفذ الجمركي واحتجاز 57 يوماً',
    category: 'field',
    categoryLabel: 'رصد ميداني بالمنفذ',
    notes: 'توثيق ميداني للأسطول المحتجز بسبب تناقض شهادة التحليل المخبري واشتراط صفر يوم سحب التعجيزي.',
    dataUrl: '/assets/aistudio/Videoframe_20260904_003536_com.huawei.himovie.overseas_c92223b8.jpg',
    fileName: 'Fleet_Border_Hold_Evidence.jpg',
    fileSize: '2.8 MB',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'arch-3',
    title: 'شهادة التحليل المخبري المتناقضة ومناورة الصفر يوم',
    category: 'lab',
    categoryLabel: 'شهادة فحص مخبري',
    notes: 'المستند الفني الصادر من المصنع الذي أوقع التعطيل وتعارض مع اشتراطات وزارة التغير المناخي والبيئة.',
    dataUrl: '/assets/aistudio/Videoframe_20260904_003511_com.huawei.himovie.overseas_d7a1ef79.jpg',
    fileName: 'Lab_Report_Contradiction.jpg',
    fileSize: '1.9 MB',
    uploadedAt: '2026-10-20',
  },
  {
    id: 'arch-4',
    title: 'مستندات الوساطة الالتفافية وتمرير التكلفة لشركة نوفل',
    category: 'correspondence',
    categoryLabel: 'قرينة تواطؤ واقتسام أسواق',
    notes: 'وثيقة محاولة إقحام الوسيط الخارجي وفرض عمولة 650 ر.ع على كل مقطورة لمحاولة تسريب عميل سويحان.',
    dataUrl: '/assets/aistudio/Videoframe_20260904_003530_com.huawei.himovie.overseas_060c0f13.jpg',
    fileName: 'Nawfal_Intermediary_Record.jpg',
    fileSize: '2.1 MB',
    uploadedAt: '2026-10-20',
  },
];

export const StudioEvidenceUpload: React.FC = () => {
  const [evidenceList, setEvidenceList] = useState<UploadedEvidenceItem[]>(() => {
    try {
      const saved = localStorage.getItem('bka_studio_evidence');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse saved evidence', e);
    }
    return DEFAULT_ARCHIVAL_EVIDENCE;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<UploadedEvidenceItem | null>(null);

  // Form states for adding custom title / notes
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'bank' | 'lab' | 'field' | 'correspondence' | 'customs'>('field');
  const [newNotes, setNewNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const saveList = (list: UploadedEvidenceItem[]) => {
    setEvidenceList(list);
    try {
      localStorage.setItem('bka_studio_evidence', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      const categoryLabels: Record<string, string> = {
        bank: 'إشعار سداد بنكي',
        lab: 'شهادة فحص مخبري',
        field: 'رصد ميداني بالمنفذ',
        correspondence: 'مراسلة رسمية / إقرار',
        customs: 'بيان جمركي / تفتيش',
      };

      const newItem: UploadedEvidenceItem = {
        id: 'upload-' + Date.now(),
        title: newTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
        category: newCategory,
        categoryLabel: categoryLabels[newCategory] || 'مستند استوديو',
        notes: newNotes.trim() || 'تم رفع الدليل مباشرة من الاستوديو/الكاميرا للتوثيق الرقابي الفوري.',
        dataUrl: result,
        fileName: file.name,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadedAt: new Date().toLocaleDateString('ar-OM'),
      };

      const updated = [newItem, ...evidenceList];
      saveList(updated);
      setIsUploading(false);
      setNewTitle('');
      setNewNotes('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      setIsUploading(false);
      alert('تعذر قراءة الملف من الاستوديو.');
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الدليل من القائمة؟')) {
      const updated = evidenceList.filter((item) => item.id !== id);
      saveList(updated);
      if (selectedPreview?.id === id) {
        setSelectedPreview(null);
      }
    }
  };

  const handleResetToDefaults = () => {
    if (confirm('إعادة تعيين الأدلة إلى مستندات الاستوديو المعتمدة؟')) {
      saveList(DEFAULT_ARCHIVAL_EVIDENCE);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Upload Master Header */}
      <div className="bg-[#1e1233] rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#ECC870] via-[#C59B27] to-[#8C6811]"></div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
                خزينة الأدلة المباشرة — الرفع المباشر من الاستوديو والكاميرا
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              إيداع المستندات والصور الميدانية الفورية
            </h2>
            <p className="text-xs text-gray-300">
              ارفع صور الشاحنات، إيصالات التحويل البنكي، والشهادات المخبرية مباشرة لدعم ملف مركز حماية المنافسة ومنع الاحتكار.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-bold transition border border-white/15"
            >
              استعادة الأدلة الافتراضية
            </button>
            <span className="px-3 py-1.5 rounded-xl bg-[#C59B27]/30 text-amber-200 border border-[#D4AF37] text-xs font-bold font-mono">
              {evidenceList.length} مستندات مودعة
            </span>
          </div>
        </div>
      </div>

      {/* Upload Form Box */}
      <div className="bg-white rounded-3xl border-2 border-[#D4AF37] p-6 sm:p-8 shadow-md space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <Upload className="w-5 h-5 text-[#C59B27]" />
          <h3 className="text-base font-black text-[#23153c]">
            رفع مستند أو صورة دليل جديد من الاستوديو:
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">عنوان الدليل / المستند:</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="مثال: إشعار التحويل البنكي أو صورة الشاحنة بالمنفذ"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">تصنيف المستند الرقابي:</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] outline-none bg-white"
            >
              <option value="bank">إشعار سداد بنكي (بنك مسقط)</option>
              <option value="field">رصد ميداني للشاحنات بالمنفذ</option>
              <option value="lab">شهادة فحص مخبري وبيطري</option>
              <option value="correspondence">مراسلة رسمية / إقرار</option>
              <option value="customs">بيان جمركي وتفتيش</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">ملاحظة أو تكييف قانوني مختصر:</label>
            <input
              type="text"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              placeholder="مثال: يثبت سداد كامل المبلغ 100% نقداً مسبقاً"
              className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:border-[#D4AF37] outline-none"
            />
          </div>
        </div>

        {/* Dropzone Trigger */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D4AF37] hover:border-[#8C6811] bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 text-center cursor-pointer transition space-y-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full gold-gradient-bg text-[#23153c] flex items-center justify-center mx-auto shadow-md">
            <Camera className="w-6 h-6" />
          </div>

          <h4 className="text-sm font-black text-[#23153c]">
            {isUploading ? 'جاري رفع ومعالجة المستند...' : 'اضغط لاختيار صورة من استوديو جهازك أو التقاط صورة بالكاميرا'}
          </h4>
          <p className="text-xs text-gray-500">
            يدعم صور JPG و PNG وملفات PDF والمستندات الرسمية بدقة كاملة
          </p>
        </div>
      </div>

      {/* Grid of Evidence Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#23153c] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>الأدلة والمستندات المحفوظة بالخزينة الرقابية ({evidenceList.length}):</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {evidenceList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#D4AF37] shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between text-right"
            >
              {/* Media Preview Box */}
              <div
                className="relative h-44 bg-gray-100 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedPreview(item)}
              >
                <img
                  src={item.dataUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/aistudio/Screenshot_20260903_041907_1697c674.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-[#23153c]/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-white text-[#23153c] font-black text-xs flex items-center gap-1 shadow-md">
                    <Eye className="w-4 h-4" />
                    <span>معاينة وتكبير</span>
                  </span>
                </div>

                <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#23153c]/85 text-amber-300 border border-[#D4AF37]">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-black text-xs text-[#23153c] line-clamp-1" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed mt-1">
                    {item.notes}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                  <span>{item.fileSize}</span>
                  <span>{item.uploadedAt}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPreview(item)}
                  className="text-xs font-bold text-[#23153c] hover:text-amber-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>معاينة</span>
                </button>

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1"
                  title="حذف المستند"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Full Preview */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-[#23153c]/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full border-2 border-[#D4AF37] overflow-hidden shadow-2xl space-y-4 p-6 text-right animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  {selectedPreview.categoryLabel}
                </span>
                <h3 className="text-lg font-black text-[#23153c] mt-1">
                  {selectedPreview.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedPreview(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="max-h-[65vh] overflow-auto rounded-xl border border-gray-200 bg-gray-900 flex items-center justify-center p-2">
              <img
                src={selectedPreview.dataUrl}
                alt={selectedPreview.title}
                className="max-h-[60vh] max-w-full object-contain rounded"
              />
            </div>

            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
              <p><strong>البيان والقرينة:</strong> {selectedPreview.notes}</p>
              <p className="text-gray-500 font-mono text-[11px]">اسم الملف: {selectedPreview.fileName} | الحجم: {selectedPreview.fileSize} | تاريخ الإيداع: {selectedPreview.uploadedAt}</p>
            </div>

            <div className="flex justify-end gap-2">
              <a
                href={selectedPreview.dataUrl}
                download={selectedPreview.fileName}
                className="px-4 py-2 rounded-xl gold-gradient-bg text-[#23153c] font-black text-xs hover:brightness-105 transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة / الدليل</span>
              </a>
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition"
              >
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
