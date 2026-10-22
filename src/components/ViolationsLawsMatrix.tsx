import React, { useState, useEffect } from 'react';
import {
  Scale,
  Volume2,
  Square,
  AlertTriangle,
  ShieldCheck,
  Loader2,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { speakArabicText, stopAllAudio, subscribeToTTS } from '../services/ttsService';

interface BehavioralLawItem {
  id: string;
  title: string;
  dateSpan: string;
  factualBehavior: string;
  legalArticle: string;
  legalAnalysis: string;
  benchmarkProof: string;
}

const BEHAVIORAL_LAW_MATRIX: BehavioralLawItem[] = [
  {
    id: 'law-1',
    title: 'قاعدة الرفض السلوكي — الرفض ليس كلمة تُقال، الرفض سلوك',
    dateSpan: '5 أشهر و18 يوماً من التعطيل',
    factualBehavior:
      'الطرف الآخر يقول: نحن لم نرفض البيع. وأقول بهدوء: الرفض ليس كلمة تُقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض.',
    legalArticle: 'الإثبات السلوكي للامتناع الفعلي عن البيع',
    legalAnalysis:
      'الامتناع عن الرد على الطلبات الرسمية وترك المهلة الرسمية تنتهي دون استجابة يثبت الرفض الفعلي بالسلوك، وإن لم يُنطق به لفظاً.',
    benchmarkProof: 'من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض.',
  },
  {
    id: 'law-2',
    title: 'المهلة الرسمية (ثلاثة أيام عمل) والصمت الرسمي',
    dateSpan: 'ثلاثة مسؤولين · ثلاث رسائل · ثلاثة أيام',
    factualBehavior:
      'الوزارة منحت مهلة رسمية ثلاثة أيام عمل. وأنا ومعي فيصل المعشني وأدهم البروشي ومهند الرئيسي، أرسلنا لكل واحد منهم رسالة PDF بقائمة المستندات، ومرفقاً بها صورة من وزارة التغير المناخي والبيئة. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي.',
    legalArticle: 'دلالة الصمت الرسمي أمام مهلة الوزارة',
    legalAnalysis:
      'انقضاء مهلة رسمية مدتها ثلاثة أيام عمل بعد إرسال ثلاث رسائل PDF بقائمة المستندات ومرفق وزارة التغير المناخي والبيئة إلى ثلاثة مسؤولين دون أي رد هو رفض فعلي.',
    benchmarkProof: 'ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي.',
  },
  {
    id: 'law-3',
    title: 'الأسباب التعسفية والذرائع الفنية التي لم تُصحَّح',
    dateSpan: 'شهادة التحليل · الملصق · إقرار السلامة · فترة السحب',
    factualBehavior:
      'شهادة تحليل تذكر مادة مضادات الكوكزيديا، والملصق يتجاهلها ويكتفي بعبارة برنامج تناوبي. وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم. وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام. هذه ذرائع لم تُصحَّح.',
    legalArticle: 'الذريعة غير المصححة أمام مهلة رسمية',
    legalAnalysis:
      'بقاء هذه الذرائع الثلاث دون تصحيح أمام مهلة رسمية يخرجها من دائرة الخطأ العارض إلى دائرة القرار المتعمد بالامتناع.',
    benchmarkProof: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ.',
  },
  {
    id: 'law-4',
    title: 'تصحيح الصورة: الإجراء المكتوب مقابل إغلاق الباب بالصمت',
    dateSpan: 'صلالة 2026',
    factualBehavior:
      'أنا لا أقول إن المستثمر لا يخطئ. المستثمر بشر. لكن المحاسبة تكون بإجراء مكتوب: بيان الخلل، ومهلة التصحيح. أما الصمت، فليس محاسبة، بل إغلاق باب.',
    legalArticle: 'الفرق بين المحاسبة النظامية وإغلاق الباب',
    legalAnalysis:
      'الإجراء السليم يقتضي بيان الخلل كتابةً ومنح مهلة للتصحيح، أما التزام الصمت الرسمي لمدة ثلاثة أيام وتعطيل دام 5 أشهر و18 يوماً فهو إغلاق للباب.',
    benchmarkProof: 'فقط 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي — صلالة 2026.',
  },
];

export const ViolationsLawsMatrix: React.FC = () => {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsLoading(loading);
    });
    return () => unsub();
  }, []);

  const handlePlayItem = (item: BehavioralLawItem) => {
    const key = `law-matrix-${item.id}`;
    if (activeAudioId === key) {
      stopAllAudio();
      return;
    }
    speakArabicText(item.factualBehavior, key, 'khalid');
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFFFF] border border-[#DEC98A]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-[#2C2A28] text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-[#8A6D2F]" />
            مصفوفة الوقائع السلوكية — دائرة المنافسة والاحتكار
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#2C2A28] royal-heading">
            الأدلة السلوكية التي تفنّد حجة <span className="text-[#8A6D2F]">«نحن لم نرفض البيع»</span>
          </h2>
          <p className="text-sm text-[#524E48]">
            عرض الوقائع السلوكية المسجلة (5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي) المرفوعة للأستاذ الفاضل / خالد المسروري المحترم.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {BEHAVIORAL_LAW_MATRIX.map((item, idx) => {
          const isPlayingThis = activeAudioId === `law-matrix-${item.id}`;
          return (
            <div
              key={item.id}
              className={`rounded-3xl p-6 sm:p-7 transition-all border ${
                isPlayingThis
                  ? 'border-2 border-[#C5A858] bg-[#FAF9F6] shadow-2xs'
                  : 'border-[#DEC98A] bg-[#FFFFFF] hover:border-[#C5A858]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE4D3]">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-[#8A6D2F]">
                    <span>المرتكز السلوكي {idx + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#6B655C] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8A6D2F]" />
                      {item.dateSpan}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#2C2A28] royal-heading pt-1">
                    {item.title}
                  </h3>
                </div>

                <button
                  onClick={() => handlePlayItem(item)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-colors border whitespace-nowrap ${
                    isPlayingThis
                      ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                      : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
                  }`}
                >
                  {isPlayingThis && isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#8A6D2F]" />
                      <span>جاري التحضير...</span>
                    </>
                  ) : isPlayingThis ? (
                    <>
                      <Square className="w-4 h-4 fill-current text-[#8A6D2F]" />
                      <span>إيقاف القراءة</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#8A6D2F]" />
                      <span>استماع للواقعة (توقف تلقائي)</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8] space-y-1.5">
                  <div className="text-xs font-bold text-[#8A6D2F] flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    الواقعة السلوكية الموثقة
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C2A28] leading-relaxed">{item.factualBehavior}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8] space-y-1.5">
                  <div className="text-xs font-bold text-[#2C2A28] flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#8A6D2F]" />
                    {item.legalArticle}
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C2A28] leading-relaxed">{item.legalAnalysis}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8] space-y-1.5">
                  <div className="text-xs font-bold text-[#8A6D2F] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    القاعدة الحاسمة
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C2A28] leading-relaxed font-bold">
                    {item.benchmarkProof}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViolationsLawsMatrix;
