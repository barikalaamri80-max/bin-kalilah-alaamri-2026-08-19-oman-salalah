import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Clock,
  Volume2,
  Square,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Scale,
  Sliders,
} from 'lucide-react';
import { speakArabicText, stopAllAudio, subscribeToTTS } from '../services/ttsService';

interface MilestoneStage {
  id: string;
  phase: string;
  dateLabel: string;
  elapsedMonthsLabel: string;
  cumulativeDays: number;
  officialSilenceDays: number;
  eventTitle: string;
  factualDetail: string;
  operationalEffect: string;
}

const CHRONOLOGY_STAGES: MilestoneStage[] = [
  {
    id: 'stage-1',
    phase: 'المقطع 1 و 2',
    dateLabel: 'قاعدة الرفض السلوكي',
    elapsedMonthsLabel: 'بداية المسار',
    cumulativeDays: 30,
    officialSilenceDays: 3,
    eventTitle: 'الرفض ليس كلمة تُقال، الرفض سلوك',
    factualDetail:
      'الطرف الآخر يقول: نحن لم نرفض البيع. وأقول بهدوء: الرفض ليس كلمة تُقال، الرفض سلوك. من لا يرد على طلب رسمي، من يترك مهلة تنتهي، فقد رفض.',
    operationalEffect: 'ثبوت الامتناع عن البيع بالسلوك الفعلي وترك الطلبات دون رد.',
  },
  {
    id: 'stage-2',
    phase: 'المقطع 3',
    dateLabel: 'المهلة الرسمية (3 أيام عمل)',
    elapsedMonthsLabel: 'ثلاثة مسؤولين',
    cumulativeDays: 90,
    officialSilenceDays: 3,
    eventTitle: 'ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام',
    factualDetail:
      'الوزارة منحت مهلة رسمية ثلاثة أيام عمل. وأنا ومعي فيصل المعشني وأدهم البروشي ومهند الرئيسي، أرسلنا لكل واحد منهم رسالة PDF بقائمة المستندات، ومرفقاً بها صورة من وزارة التغير المناخي والبيئة. ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام. والنتيجة: لا حياة لمن تنادي.',
    operationalEffect: 'انقضاء المهلة الرسمية (3 أيام عمل) بصمت رسمي تام دون استجابة.',
  },
  {
    id: 'stage-3',
    phase: 'المقطع 4',
    dateLabel: 'الأسباب التعسفية',
    elapsedMonthsLabel: 'ذرائع لم تُصحَّح',
    cumulativeDays: 135,
    officialSilenceDays: 3,
    eventTitle: 'الذريعة التي لا تُصحَّح أمام مهلة رسمية، هي قرار لا خطأ',
    factualDetail:
      'شهادة تحليل تذكر مادة مضادات الكوكزيديا، والملصق يتجاهلها ويكتفي بعبارة برنامج تناوبي. وإقرار سلامة لعلف لاير بينما الصفقة لعلف لاحم. وإصرار على فترة سحب صفر يوم والاشتراط سبعة أيام. هذه ذرائع لم تُصحَّح.',
    operationalEffect: 'بقاء الذرائع الفنية الثلاث دون تصحيح رغم المهلة الرسمية.',
  },
  {
    id: 'stage-4',
    phase: 'المقطع 5 و 7',
    dateLabel: 'إجمالي فترة التعطيل',
    elapsedMonthsLabel: '5 أشهر و18 يوماً',
    cumulativeDays: 168,
    officialSilenceDays: 3,
    eventTitle: '5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي',
    factualDetail:
      'لا شحنات محتجزة، ولا مبالغ نطالب بها. فقط 5 أشهر و18 يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة 2026.',
    operationalEffect: 'إغلاق الباب بالصمت بدلاً من الإجراء المكتوب لبيان الخلل ومهلة التصحيح.',
  },
];

export const OperationalDelaySlide: React.FC = () => {
  const [selectedStageIdx, setSelectedStageIdx] = useState<number>(3);
  const [chartMode, setChartMode] = useState<'area' | 'bar'>('area');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsub = subscribeToTTS((id, loading) => {
      setActiveAudioId(id);
      setIsLoading(loading);
    });
    return () => unsub();
  }, []);

  const currentStage = CHRONOLOGY_STAGES[selectedStageIdx];

  const slideNarration =
    'لا شحنات محتجزة، ولا مبالغ نطالب بها. فقط خمسة أشهر وثمانية عشر يوماً من التعطيل، وثلاثة أيام من الصمت الرسمي. والرمز الذي يختصر الملف: صلالة ألفين وستة وعشرين.';

  const isPlayingSlide = activeAudioId === 'operational-delay-slide-audio';

  const handleToggleAudio = () => {
    if (isPlayingSlide) {
      stopAllAudio();
      return;
    }
    speakArabicText(slideNarration, 'operational-delay-slide-audio', 'khalid');
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 space-y-6 bg-[#FFFFFF] border border-[#DEC98A]" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#EAE4D3]">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF9F6] border border-[#DEC98A] text-[#2C2A28] text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-[#8A6D2F]" />
            تحديد العناصر الإيضاحية الأساسية — تصور فترة التعطيل والصمت الرسمي
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#2C2A28] royal-heading">
            خلاصة الملف: <span className="text-[#8A6D2F]">5 أشهر و18 يوماً من التعطيل</span> و<span className="text-[#2C2A28] underline decoration-[#DEC98A] underline-offset-4">ثلاثة أيام من الصمت الرسمي</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#524E48]">
            رسم بياني تفاعلي يوضح تراكم فترة التعطيل (5 أشهر و18 يوماً) وانقضاء المهلة الرسمية (3 أيام عمل) دون رد.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setChartMode(chartMode === 'area' ? 'bar' : 'area')}
            className="px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] text-[#2C2A28] border border-[#DEC98A] hover:bg-[#F5EFE0] text-xs font-bold flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-[#8A6D2F]" />
            {chartMode === 'area' ? 'عرض الأعمدة' : 'عرض المنحنى التراكمي'}
          </button>

          <button
            onClick={handleToggleAudio}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border cursor-pointer ${
              isPlayingSlide
                ? 'bg-[#F5EFE0] text-[#2C2A28] border-[#C5A858]'
                : 'bg-[#FAF9F6] text-[#2C2A28] border-[#DEC98A] hover:bg-[#F5EFE0]'
            }`}
          >
            {isPlayingSlide && isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#8A6D2F]" />
                <span>جاري التحضير...</span>
              </>
            ) : isPlayingSlide ? (
              <>
                <Square className="w-4 h-4 fill-current text-[#8A6D2F]" />
                <span>إيقاف الصوت</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#8A6D2F]" />
                <span>استماع فوري</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KPI Summary Cards — Calm Light Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
          <div className="text-xs text-[#6B655C] font-bold">إجمالي فترة التعطيل</div>
          <div className="text-2xl font-bold text-[#2C2A28] mt-1">5 أشهر و18 يوماً</div>
          <div className="text-[11px] text-[#6B655C] mt-1">لا شحنات محتجزة ولا مبالغ نطالب بها</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
          <div className="text-xs text-[#6B655C] font-bold">المهلة الرسمية والصمت الرسمي</div>
          <div className="text-2xl font-bold text-[#8A6D2F] mt-1">3 أيام عمل</div>
          <div className="text-[11px] text-[#6B655C] mt-1">ثلاثة مسؤولين، ثلاث رسائل، ثلاثة أيام</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
          <div className="text-xs text-[#6B655C] font-bold">الذرائع الفنية غير المصححة</div>
          <div className="text-lg font-bold text-[#2C2A28] mt-1">قرار لا خطأ</div>
          <div className="text-[11px] text-[#6B655C] mt-1">مضادات الكوكزيديا · إقرار لاير · سحب صفر يوم</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E6DEC8]">
          <div className="text-xs text-[#6B655C] font-bold">الرمز الذي يختصر الملف</div>
          <div className="text-2xl font-bold text-[#8A6D2F] mt-1">صلالة 2026</div>
          <div className="text-[11px] text-[#6B655C] mt-1">الحق يرجع إلى صاحبه وتمشي الأمور</div>
        </div>
      </div>

      {/* Interactive Stage Selector + Recharts Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Stage Selector */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold text-[#2C2A28] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8A6D2F]" />
            اختر المحطة الوقائعية لاستعراض النص الموثق أو الاستماع الفوري:
          </div>

          <div className="space-y-2.5">
            {CHRONOLOGY_STAGES.map((stage, idx) => {
              const active = idx === selectedStageIdx;
              const stageAudioKey = `delay-stage-audio-${stage.id}`;
              const isPlayingStage = activeAudioId === stageAudioKey;
              return (
                <div
                  key={stage.id}
                  onClick={() => setSelectedStageIdx(idx)}
                  className={`w-full text-right p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    active
                      ? 'bg-[#FAF9F6] border-2 border-[#C5A858] text-[#2C2A28] shadow-2xs'
                      : 'bg-[#FFFFFF] border-[#E6DEC8] text-[#2C2A28] hover:border-[#DEC98A] hover:bg-[#FAF9F6]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#F5EFE0] text-[#2C2A28] border border-[#C5A858]">
                        {stage.phase}
                      </span>
                      <span className="text-xs font-bold text-[#8A6D2F]">{stage.dateLabel}</span>
                    </div>
                    <div className="text-sm font-bold text-[#2C2A28] mt-1">{stage.eventTitle}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStageIdx(idx);
                        if (isPlayingStage) {
                          stopAllAudio();
                        } else {
                          speakArabicText(
                            `${stage.eventTitle}. ${stage.factualDetail}`,
                            stageAudioKey,
                            'khalid',
                            undefined,
                            stage.eventTitle
                          );
                        }
                      }}
                      className={`p-2 rounded-xl border cursor-pointer ${
                        isPlayingStage
                          ? 'bg-[#23153C] text-[#FFF3C4] border-[#D4AF37]'
                          : 'bg-[#FAF9F6] text-[#8A6D2F] border-[#DEC98A] hover:bg-[#F5EFE0]'
                      }`}
                      title="استماع فوري لهذه المحطة"
                    >
                      {isPlayingStage ? (
                        <Square className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Stage Detail Box */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#DEC98A] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8A6D2F] font-bold">
              <span>النص الموثق ({currentStage.dateLabel})</span>
              <Scale className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-[#2C2A28] leading-relaxed font-semibold">
              {currentStage.factualDetail}
            </p>
            <div className="pt-2 border-t border-[#EAE4D3] text-xs text-[#524E48] font-medium flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-[#8A6D2F] shrink-0" />
              <span>الدلالة السلوكية: {currentStage.operationalEffect}</span>
            </div>
          </div>
        </div>

        {/* Recharts Canvas — Light Mode */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-[#FAF9F6] border border-[#DEC98A] flex flex-col justify-between min-h-[380px]">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-[#2C2A28] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#8A6D2F]" />
              تراكم فترة التعطيل (5 أشهر و18 يوماً) والصمت الرسمي (3 أيام)
            </div>
            <span className="text-xs text-[#6B655C] font-bold">صلالة 2026</span>
          </div>

          <div className="w-full h-[300px]" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === 'area' ? (
                <AreaChart data={CHRONOLOGY_STAGES} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="delayGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8A6D2F" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8A6D2F" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC8" />
                  <XAxis dataKey="phase" stroke="#6B655C" tick={{ fontSize: 12, fill: '#2C2A28' }} />
                  <YAxis stroke="#6B655C" tick={{ fontSize: 12, fill: '#2C2A28' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DEC98A',
                      borderRadius: '12px',
                      color: '#2C2A28',
                      direction: 'rtl',
                      textAlign: 'right',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cumulativeDays"
                    name="تراكم فترة التعطيل (إجمالي 5 أشهر و18 يوماً)"
                    stroke="#8A6D2F"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#delayGradientLight)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={CHRONOLOGY_STAGES} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DEC8" />
                  <XAxis dataKey="phase" stroke="#6B655C" tick={{ fontSize: 12, fill: '#2C2A28' }} />
                  <YAxis stroke="#6B655C" tick={{ fontSize: 12, fill: '#2C2A28' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#DEC98A',
                      borderRadius: '12px',
                      color: '#2C2A28',
                      direction: 'rtl',
                      textAlign: 'right',
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="cumulativeDays"
                    name="تراكم فترة التعطيل (5 أشهر و18 يوماً)"
                    fill="#C5A858"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="officialSilenceDays"
                    name="الصمت الرسمي (3 أيام عمل)"
                    fill="#8A6D2F"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="pt-3 border-t border-[#EAE4D3] flex flex-wrap items-center justify-between gap-2 text-xs text-[#2C2A28]">
            <div className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#8A6D2F]" />
              <span>ثلاثة مسؤولين (فيصل المعشني وأدهم البروشي ومهند الرئيسي) · ثلاث رسائل · ثلاثة أيام صمت رسمي</span>
            </div>
            <span className="text-[#8A6D2F] font-bold">صلالة 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalDelaySlide;
