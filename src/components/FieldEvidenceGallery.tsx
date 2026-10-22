import React from 'react';
import { Truck, ShieldCheck, CheckCircle2, FileCheck2, MapPin } from 'lucide-react';

interface FleetEvidenceItem {
  id: string;
  refCode: string;
  title: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

const FLEET_GALLERY_ITEMS: FleetEvidenceItem[] = [
  {
    id: 'fleet-1',
    refCode: 'FLEET-PERMIT-243',
    title: 'انطلاق الشحنة الأولى وعبور منفذ خطم الشكلة خلال 24 ساعة',
    date: '1 مايو 2026',
    location: 'منفذ خطم الشكلة الحدودي',
    description:
      'توثيق جاهزية الأسطول المعتمد وعبور الشحنة الأولى (500 كيس علف بادي — 25 طن) بموجب البيان الجمركي رقم 20261501028987 في غضون 24 ساعة.',
    imageUrl: '/assets/aistudio/Videoframe_20260904_003350_com.huawei.himovie.overseas_c9779668.jpg',
  },
  {
    id: 'fleet-2',
    refCode: 'FLEET-PERMIT-270',
    title: 'جاهزية الشاحنات المعتمدة لنقل شحنات أعلاف الدواجن (علامة بركات)',
    date: 'مايو 2026',
    location: 'مسقط — خط التصدير إلى الإمارات',
    description:
      'الالتزام الكامل بجدول التوريد المعتمد (15 رحلة — 7,500 كيس) والسداد النقدي المسبق 100% عبر بنك مسقط.',
    imageUrl: '/assets/aistudio/Videoframe_20260904_003511_com.huawei.himovie.overseas_d7a1ef79.jpg',
  },
  {
    id: 'fleet-3',
    refCode: 'FLEET-DOC-03',
    title: 'توثيق شحنات أعلاف الدواجن الوطنية الموجهة للتصدير النظامي',
    date: 'مايو 2026',
    location: 'سلطنة عمان — دولة الإمارات العربية المتحدة',
    description:
      'توثيق ميداني لعمليات النقل النظامي لأعلاف الدواجن العمانية (Broiler Starter & Finisher) وفق أعلى المعايير اللوجستية.',
    imageUrl: '/assets/aistudio/Videoframe_20260904_003530_com.huawei.himovie.overseas_060c0f13.jpg',
  },
  {
    id: 'fleet-4',
    refCode: 'FLEET-DOC-04',
    title: 'سجل المتابعة الميدانية والمطابقة المستندية (صلالة 2026)',
    date: 'مايو – أكتوبر 2026',
    location: 'صلالة — مسقط — العين',
    description:
      'متابعة ميدانية ومستندية مستمرة طوال 5 أشهر و18 يوماً من أجل استكمال المطابقة المستندية النظامية.',
    imageUrl: '/assets/aistudio/Videoframe_20260904_003537_com.huawei.himovie.overseas_7b184af5.jpg',
  },
];

export const FieldEvidenceGallery: React.FC = () => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border-2 border-[#DEC98A] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#8A6D2F]">
            <Truck className="w-3.5 h-3.5" />
            معرض الرصد الميداني والأسطول — صلالة 2026
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#23153C] royal-heading">
            توثيق الجاهزية اللوجستية ومسار التصدير المباشر
          </h2>
          <p className="text-sm text-[#524E48]">
            شواهد ميدانية توثق التزام شركة بن كليلة العامري للتجارة والاستثمار بالمسار اللوجستي المباشر والسداد النقدي المسبق 100%.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] text-xs font-bold text-[#23153C] flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#8A6D2F]" />
          <span>المطلب الحصري: المطابقة المستندية · صلالة 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FLEET_GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl overflow-hidden bg-[#FFFFFF] border border-[#DEC98A] shadow-2xs flex flex-col justify-between"
          >
            <div className="h-56 bg-[#FAF9F6] border-b border-[#EAE4D3] overflow-hidden relative">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-[#23153C]/90 text-[#FFF3C4] border border-[#D4AF37] text-xs font-bold">
                {item.refCode}
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#8A6D2F]">
                <span>{item.date}</span>
                <span className="flex items-center gap-1 text-[#524E48]">
                  <MapPin className="w-3.5 h-3.5 text-[#8A6D2F]" />
                  {item.location}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-[#23153C]">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">{item.description}</p>

              <div className="pt-3 border-t border-[#EAE4D3] flex items-center gap-2 text-xs font-bold text-[#8A6D2F]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>موثق ضمن فهرس القرائن — صلالة 2026</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldEvidenceGallery;
