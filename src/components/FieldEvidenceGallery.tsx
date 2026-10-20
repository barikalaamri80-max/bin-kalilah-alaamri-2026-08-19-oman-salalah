import React, { useState } from 'react';
import { Camera, ExternalLink, X, ZoomIn, CheckCircle2, ShieldAlert } from 'lucide-react';

export interface GalleryItem {
  id: string;
  src: string;
  title: string;
  location: string;
  description: string;
}

export const FIELD_PHOTOS: GalleryItem[] = [
  {
    id: 'photo-1',
    src: '/assets/aistudio/Videoframe_20260904_003536_com.huawei.himovie.overseas_c92223b8.jpg',
    title: 'شاحنة أسطول بن كليلة عند بوابة المنفذ الحدودي الإماراتي العماني',
    location: 'المنفذ الحدودي العماني الإماراتي',
    description: 'توثيق ميداني لشاحنة بن كليلة الحاملة لأعلاف بركات تحت البوابة الرسمية، وتبرهن على الجاهزية اللوجستية الكاملة للعبور.',
  },
  {
    id: 'photo-2',
    src: '/assets/aistudio/Videoframe_20260904_003511_com.huawei.himovie.overseas_d7a1ef79.jpg',
    title: 'وصول الشاحنة إلى مخازن سويحان بدولة الإمارات',
    location: 'مخازن سويحان — أبوظبي',
    description: 'الشاحنة المبردة تسير داخل مجمع مخازن سويحان لتفريغ شحنات الأعلاف لتغذية مزارع الدواجن المستهدفة (مزرعة بركة الوقن).',
  },
  {
    id: 'photo-3',
    src: '/assets/aistudio/Videoframe_20260904_003530_com.huawei.himovie.overseas_060c0f13.jpg',
    title: 'عمليات الشحن والمناولة بمستودع التخزين رقم (3)',
    location: 'المستودع الرئيسي رقم 3 — صوامع المطاحن',
    description: 'توثيق شحن باليتات أكياس أعلاف بركات لاحم، ويظهر تطابق البضاعة المسددة القيمة نقداً 100% بالكامل.',
  },
  {
    id: 'photo-4',
    src: '/assets/aistudio/Videoframe_20260904_003537_com.huawei.himovie.overseas_7b184af5.jpg',
    title: 'المركز اللوجستي الموسع بسويحان (Sweihan Logistics Hub)',
    location: 'مستودعات سويحان — أبوظبي',
    description: 'صورة جوية تبرز ضخامة المركز اللوجستي لشركة بن كليلة العامري وأرصفة الشحن المتعددة لاستيعاب 500 طن شهرياً.',
  },
  {
    id: 'photo-5',
    src: '/assets/aistudio/a112ddaabad04a1cb12dc8a9c87d38b4beaf77eac13c4434a1c8a6f8ec2f3562_473da085.jpg',
    title: 'شاحنة النقل الدولي بمنفذ الحدود البري (صلالة — الدقم)',
    location: 'محطة الحدود البرية — سلطنة عُمان',
    description: 'شاحنة فولفو FH16 التابعة لشركة بن كليلة بانتظار استكمال تسليم ملحقات المبيع الصالحة من المصنع للفسح الدولي.',
  },
  {
    id: 'photo-6',
    src: '/assets/aistudio/Videoframe_20260904_003350_com.huawei.himovie.overseas_c9779668.jpg',
    title: 'العمليات اللوجستية المسائية بمركز سويحان',
    location: 'مركز سويحان اللوجستي — أبوظبي',
    description: 'تواصل خطوط الإمداد على مدار الساعة لضمان الأمن الغذائي وسرعة تسليم الأعلاف لمزارع الدواجن.',
  },
  {
    id: 'photo-7',
    src: '/assets/aistudio/Videoframe_20260904_003512_com.huawei.himovie.overseas_da1518eb.jpg',
    title: 'عبور شاحنة بن كليلة لبوابة المنفذ الحدودي',
    location: 'بوابة المنفذ الحدودي',
    description: 'لقطة مقربة للشاحنة تحمل شعارات شركة بن كليلة العامري وعلامة أعلاف بركات بمواصفات تصدير معتمدة.',
  },
  {
    id: 'photo-8',
    src: '/assets/aistudio/Screenshot_20260903_041907_1697c674.jpg',
    title: 'الشاحنة على مسار الطريق الدولي مع صور بطاقات الأعلاف',
    location: 'المنفذ الحدودي البري',
    description: 'توثيق ميداني لتصاميم أكياس أعلاف بركات (لاحم، إبل، مواشي) المطبوعة على المقطورة والمطابقة للشحنات التعاقدية.',
  },
];

export const FieldEvidenceGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-[#D4AF37] text-xs font-bold text-amber-900">
            <Camera className="w-4 h-4 text-[#C59B27]" />
            <span>التوثيق البصري الميداني للأسطول والمخازن</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#23153c]">
            معرض الرصد الميداني: أسطول شاحنات بن كليلة ومستودعات سويحان
          </h3>
          <p className="text-xs sm:text-sm text-gray-600">
            صور حية لأسطول النقل اللوجستي، بوابات المنافذ الحدودية بين عُمان والإمارات، ومستودعات سويحان بأبوظبي.
          </p>
        </div>
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {FIELD_PHOTOS.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-sm hover:border-[#D4AF37] hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
              <div className="absolute bottom-3 right-3 left-3 text-white">
                <span className="text-[10px] font-bold text-amber-300 block mb-0.5">
                  {photo.location}
                </span>
                <h4 className="text-xs font-black line-clamp-2 leading-snug">
                  {photo.title}
                </h4>
              </div>
              <div className="absolute top-2 left-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4" />
              </div>
            </div>
            <div className="p-3 bg-white border-t border-gray-100">
              <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                {photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-[#1e1233] rounded-3xl border-2 border-[#D4AF37] overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center text-white">
              <div>
                <span className="text-xs text-amber-300 font-bold block">{selectedPhoto.location}</span>
                <h3 className="font-black text-sm sm:text-base text-white">{selectedPhoto.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 bg-black/60 flex items-center justify-center overflow-hidden p-2">
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-xl"
              />
            </div>

            <div className="p-4 bg-[#150a26] text-xs text-gray-300 border-t border-white/10">
              <p className="leading-relaxed">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
