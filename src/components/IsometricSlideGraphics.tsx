import React from 'react';

export type IsometricGraphicType =
  | 'cover-emblem'
  | 'salalah-uae-route'
  | 'cash-prepayment'
  | 'hourglass-24h-vs-5m'
  | 'supply-schedule-15'
  | 'first-shipment-success'
  | 'factory-gate-may7'
  | 'official-invoices-origin'
  | 'exclusive-broker-link'
  | 'moccae-portal'
  | 'coa-vs-label'
  | 'contradictory-statements'
  | 'cancelled-calls-timeline'
  | 'layer-vs-broiler'
  | 'withdrawal-0-vs-7'
  | 'constructive-refusal'
  | 'two-regulatory-paths'
  | 'ministry-meeting-oct16'
  | 'three-officials-silence'
  | 'written-procedure-vs-silence'
  | 'evidence-vault-index'
  | 'sovereign-conclusion';

interface IsometricSlideGraphicsProps {
  type: IsometricGraphicType;
  theme?: 'purple' | 'cream';
}

export const IsometricSlideGraphics: React.FC<IsometricSlideGraphicsProps> = ({
  type,
  theme = 'cream',
}) => {
  const isDarkBg = theme === 'purple';

  return (
    <div
      className={`w-full rounded-2xl p-4 sm:p-5 border-2 transition-all flex flex-col items-center justify-center relative overflow-hidden ${
        isDarkBg
          ? 'bg-gradient-to-br from-[#1B0F30] via-[#2A184A] to-[#160B28] border-[#D4AF37]'
          : 'bg-gradient-to-br from-[#23153C] via-[#311E54] to-[#1B0F30] border-[#D4AF37]'
      }`}
      style={{ minHeight: '190px' }}
    >
      {/* Subtle 3D Isometric Grid Floor */}
      <svg
        className="w-full h-44 sm:h-48 max-w-[460px] select-none"
        viewBox="0 0 440 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9E8A2" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9A7010" />
          </linearGradient>
          <linearGradient id="goldTop" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFF3C4" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
          <linearGradient id="purpleIsoLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A2E7E" />
            <stop offset="100%" stopColor="#2A174B" />
          </linearGradient>
          <linearGradient id="purpleIsoRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#351E60" />
            <stop offset="100%" stopColor="#1B0D33" />
          </linearGradient>
          <linearGradient id="creamIso" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EDE4CE" />
          </linearGradient>
        </defs>

        {/* Isometric Base Platform */}
        <polygon
          points="220,185 70,130 220,75 370,130"
          fill="url(#purpleIsoLeft)"
          stroke="url(#goldGrad)"
          strokeWidth="1.8"
        />
        <polygon
          points="70,130 70,142 220,197 220,185"
          fill="#9A7010"
          opacity="0.85"
        />
        <polygon
          points="370,130 370,142 220,197 220,185"
          fill="#D4AF37"
          opacity="0.9"
        />
        {/* Inner Isometric Rim */}
        <polygon
          points="220,175 95,130 220,85 345,130"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.8"
          strokeDasharray="4 4"
          opacity="0.65"
        />

        {/* SLIDE 1: 3D Sovereign Emblem & Scales */}
        {type === 'cover-emblem' && (
          <g>
            {/* 3D Podium Cube */}
            <polygon points="220,70 160,95 220,120 280,95" fill="url(#goldTop)" />
            <polygon points="160,95 160,140 220,165 220,120" fill="#B5891C" />
            <polygon points="280,95 280,140 220,165 220,120" fill="#8C6512" />
            {/* 3D Crown / Shield Pillar */}
            <polygon
              points="220,22 182,42 182,82 220,104 258,82 258,42"
              fill="url(#purpleIsoLeft)"
              stroke="url(#goldGrad)"
              strokeWidth="2.5"
            />
            {/* Balance Scales Icon inside 3D Shield */}
            <line x1="220" y1="36" x2="220" y2="86" stroke="#F9E8A2" strokeWidth="2.5" />
            <line x1="196" y1="52" x2="244" y2="52" stroke="#F9E8A2" strokeWidth="2.2" />
            <polygon points="196,52 188,68 204,68" fill="url(#goldGrad)" />
            <polygon points="244,52 236,68 252,68" fill="url(#goldGrad)" />
            <circle cx="220" cy="36" r="4" fill="#FFF3C4" />
            <text x="220" y="150" textAnchor="middle" fill="#FFF3C4" fontSize="10" fontWeight="bold">
              19 أكتوبر 2026 · صلالة
            </text>
          </g>
        )}

        {/* SLIDE 2: Salalah to UAE Trade Corridor */}
        {type === 'salalah-uae-route' && (
          <g>
            {/* Left Node: Salalah Origin */}
            <polygon points="135,95 100,110 135,125 170,110" fill="url(#goldTop)" />
            <polygon points="100,110 100,142 135,157 135,125" fill="#B5891C" />
            <polygon points="170,110 170,142 135,157 135,125" fill="#8C6512" />
            <text x="135" y="86" textAnchor="middle" fill="#F9E8A2" fontSize="11" fontWeight="bold">
              سوق صلالة
            </text>

            {/* Isometric Golden Highway Bridge */}
            <polygon points="170,122 270,88 282,94 182,128" fill="url(#goldGrad)" />
            <line
              x1="176"
              y1="125"
              x2="276"
              y2="91"
              stroke="#23153C"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />

            {/* 3D Isometric Truck on Route */}
            <polygon points="215,92 195,100 215,108 235,100" fill="#FFFFFF" />
            <polygon points="195,100 195,116 215,124 215,108" fill="#E5DEC9" />
            <polygon points="235,100 235,116 215,124 215,108" fill="#D4AF37" />

            {/* Right Node: UAE Export Market */}
            <polygon points="305,65 270,80 305,95 340,80" fill="url(#goldTop)" />
            <polygon points="270,80 270,122 305,137 305,95" fill="#4A2E7E" stroke="#D4AF37" />
            <polygon points="340,80 340,122 305,137 305,95" fill="#2A174B" stroke="#D4AF37" />
            <text x="305" y="55" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              التصدير للإمارات
            </text>
          </g>
        )}

        {/* SLIDE 3: 100% Cash Prepayment (18,640 OMR) */}
        {type === 'cash-prepayment' && (
          <g>
            {/* Three 3D Golden Transfer Blocks */}
            {[
              { x: 140, y: 102, label: '4,580 ر.ع', sub: '27 أبريل' },
              { x: 220, y: 78, label: '4,760 ر.ع', sub: '5 مايو' },
              { x: 300, y: 102, label: '9,300 ر.ع', sub: '13 مايو' },
            ].map((b, i) => (
              <g key={i}>
                <polygon
                  points={`${b.x},${b.y} ${b.x - 36},${b.y + 15} ${b.x},${b.y + 30} ${b.x + 36},${b.y + 15}`}
                  fill="url(#goldTop)"
                />
                <polygon
                  points={`${b.x - 36},${b.y + 15} ${b.x - 36},${b.y + 52} ${b.x},${b.y + 67} ${b.x},${b.y + 30}`}
                  fill="#B5891C"
                />
                <polygon
                  points={`${b.x + 36},${b.y + 15} ${b.x + 36},${b.y + 52} ${b.x},${b.y + 67} ${b.x},${b.y + 30}`}
                  fill="#8C6512"
                />
                <text x={b.x} y={b.y - 6} textAnchor="middle" fill="#FFF3C4" fontSize="10" fontWeight="bold">
                  {b.label}
                </text>
                <text x={b.x} y={b.y + 20} textAnchor="middle" fill="#23153C" fontSize="9" fontWeight="bold">
                  {b.sub}
                </text>
              </g>
            ))}
            <rect x="145" y="22" width="150" height="26" rx="13" fill="url(#goldGrad)" />
            <text x="220" y="39" textAnchor="middle" fill="#23153C" fontSize="11" fontWeight="bold">
              سداد نقدي مسبق 100% (18,640 ر.ع)
            </text>
          </g>
        )}

        {/* SLIDE 4: 24 Hours vs 5 Months Hourglass */}
        {type === 'hourglass-24h-vs-5m' && (
          <g>
            {/* Left: 24-Hour Express Cube */}
            <polygon points="145,82 105,98 145,114 185,98" fill="url(#creamIso)" stroke="#D4AF37" />
            <polygon points="105,98 105,136 145,152 145,114" fill="#EDE4CE" />
            <polygon points="185,98 185,136 145,152 145,114" fill="#D5C7A3" />
            <text x="145" y="70" textAnchor="middle" fill="#F9E8A2" fontSize="11" fontWeight="bold">
              سابقاً: 24 ساعة
            </text>
            <text x="145" y="103" textAnchor="middle" fill="#23153C" fontSize="10" fontWeight="bold">
              إنجاز فوري
            </text>

            {/* Center VS Badge */}
            <circle cx="220" cy="112" r="16" fill="url(#goldGrad)" />
            <text x="220" y="116" textAnchor="middle" fill="#23153C" fontSize="10" fontWeight="bold">
              مقابل
            </text>

            {/* Right: 3D Hourglass (5 Months & 18 Days) */}
            <polygon points="295,56 265,68 295,80 325,68" fill="url(#goldTop)" />
            <polygon points="272,72 318,72 295,112" fill="url(#goldGrad)" opacity="0.85" />
            <polygon points="295,112 272,150 318,150" fill="url(#goldGrad)" />
            <polygon points="295,142 265,154 295,166 325,154" fill="url(#goldTop)" />
            <text x="295" y="45" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              5 أشهر و18 يوماً
            </text>
          </g>
        )}

        {/* SLIDE 5: 15 Trips / 7500 Bags Schedule */}
        {type === 'supply-schedule-15' && (
          <g>
            {/* 3D Isometric Document Ledger & Cargo Cubes */}
            <polygon points="220,52 140,84 220,116 300,84" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="2" />
            <polygon points="140,84 140,128 220,160 220,116" fill="#D5C7A3" />
            <polygon points="300,84 300,128 220,160 220,116" fill="#B5891C" />
            <text x="220" y="82" textAnchor="middle" fill="#23153C" fontSize="11" fontWeight="bold">
              BK-OFM-PO-001
            </text>
            <text x="220" y="98" textAnchor="middle" fill="#8C6512" fontSize="10" fontWeight="bold">
              15 رحلة · 7,500 كيس
            </text>
            <text x="220" y="38" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              خطة التوريد المعتمدة (28 أبريل 2026)
            </text>
          </g>
        )}

        {/* SLIDE 6: First Shipment Success (May 1, 2026) */}
        {type === 'first-shipment-success' && (
          <g>
            {/* 3D Border Archway */}
            <polygon points="260,48 245,55 245,135 260,142" fill="url(#goldGrad)" />
            <polygon points="320,72 305,79 305,159 320,166" fill="url(#goldGrad)" />
            <polygon points="245,55 320,85 320,70 245,40" fill="url(#goldTop)" />
            {/* 3D Isometric Truck Passing */}
            <polygon points="175,85 125,105 175,125 225,105" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.5" />
            <polygon points="125,105 125,138 175,158 175,125" fill="#EDE4CE" />
            <polygon points="225,105 225,138 175,158 175,125" fill="url(#goldGrad)" />
            <text x="175" y="108" textAnchor="middle" fill="#23153C" fontSize="10" fontWeight="bold">
              500 كيس بادي
            </text>
            <text x="220" y="32" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              الشحنة الأولى (1 مايو 2026) — عبور مكتمل
            </text>
          </g>
        )}

        {/* SLIDE 7: Factory Gate & May 7 Turning Point */}
        {type === 'factory-gate-may7' && (
          <g>
            {/* 3D Factory Silos & Building */}
            <polygon points="160,55 120,72 160,89 200,72" fill="url(#goldTop)" />
            <polygon points="120,72 120,140 160,157 160,89" fill="url(#purpleIsoLeft)" stroke="#D4AF37" />
            <polygon points="200,72 200,140 160,157 160,89" fill="url(#purpleIsoRight)" stroke="#D4AF37" />

            {/* Security Log Card */}
            <polygon points="285,68 235,88 285,108 335,88" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="235,88 235,132 285,152 285,108" fill="#D5C7A3" />
            <polygon points="335,88 335,132 285,152 285,108" fill="#B5891C" />
            <text x="285" y="92" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              7 مايو · 2:00 ظهراً
            </text>
            <text x="220" y="34" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              نقطة التحول المفاجئ وبدء المماطلة الإجرائية
            </text>
          </g>
        )}

        {/* SLIDE 8: Official Invoices OFM/270 & OFM/271 */}
        {type === 'official-invoices-origin' && (
          <g>
            {[0, 1, 2].map((idx) => {
              const offset = idx * 12;
              return (
                <polygon
                  key={idx}
                  points={`220,${78 - offset} 135,${112 - offset} 220,${146 - offset} 305,${112 - offset}`}
                  fill={idx === 2 ? 'url(#creamIso)' : 'url(#goldGrad)'}
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
              );
            })}
            <text x="220" y="88" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              OFM/270 & OFM/271
            </text>
            <text x="220" y="103" textAnchor="middle" fill="#8C6512" fontSize="9.5" fontWeight="bold">
              شهادة صحية 829 · شهادتا منشأ
            </text>
            <text x="220" y="34" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              ثبوت صفة التصدير المباشر للإمارات (13–18 مايو 2026)
            </text>
          </g>
        )}

        {/* SLIDE 9: Exclusive Broker Channel Message */}
        {type === 'exclusive-broker-link' && (
          <g>
            <polygon points="150,82 105,100 150,118 195,100" fill="url(#goldTop)" />
            <polygon points="105,100 105,135 150,153 150,118" fill="#B5891C" />
            <polygon points="195,100 195,135 150,153 150,118" fill="#8C6512" />
            <text x="150" y="103" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              مدير التصدير
            </text>

            <line x1="195" y1="108" x2="245" y2="108" stroke="#FFF3C4" strokeWidth="3" strokeDasharray="4 3" />

            <polygon points="290,82 245,100 290,118 335,100" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="245,100 245,135 290,153 290,118" fill="#D5C7A3" />
            <polygon points="335,100 335,135 290,153 290,118" fill="#B5891C" />
            <text x="290" y="103" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              الوسيط (نوفل)
            </text>
            <text x="220" y="38" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              مراسلة 19 مايو 2026: حصر التعامل عبر قناة واحدة
            </text>
          </g>
        )}

        {/* SLIDE 10: MOCCAE Regulatory Portal */}
        {type === 'moccae-portal' && (
          <g>
            <polygon points="220,48 135,82 220,116 305,82" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="2" />
            <polygon points="135,82 135,132 220,166 220,116" fill="#4A2E7E" stroke="#D4AF37" />
            <polygon points="305,82 305,132 220,166 220,116" fill="#2A174B" stroke="#D4AF37" />
            <text x="220" y="78" textAnchor="middle" fill="#23153C" fontSize="10" fontWeight="bold">
              MOCCAE · APH-12062026-3382929
            </text>
            <text x="220" y="95" textAnchor="middle" fill="#8C6512" fontSize="9.5" fontWeight="bold">
              ملاحظة 21 يونيو 2026 الرقابية
            </text>
            <text x="220" y="30" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              اشتراط تطابق البطاقة التعريفية وفترة السحب (7 أيام)
            </text>
          </g>
        )}

        {/* SLIDE 11: COA vs Label Mismatch */}
        {type === 'coa-vs-label' && (
          <g>
            {/* Left Document: COA */}
            <polygon points="150,70 102,90 150,110 198,90" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="102,90 102,135 150,155 150,110" fill="#D5C7A3" />
            <polygon points="198,90 198,135 150,155 150,110" fill="#B5891C" />
            <text x="150" y="92" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              COA: Anticoccidials
            </text>

            {/* Right Document: Label */}
            <polygon points="290,70 242,90 290,110 338,90" fill="url(#goldTop)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="242,90 242,135 290,155 290,110" fill="#B5891C" />
            <polygon points="338,90 338,135 290,155 290,110" fill="#8C6512" />
            <text x="290" y="92" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              Label: Rotation Program
            </text>

            <text x="220" y="35" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              الذريعة الفنية الأولى (23 يونيو 2026): تضارب الشهادة والملصق
            </text>
          </g>
        )}

        {/* SLIDE 12: Verbal Evasion (June 25 - July 2) */}
        {type === 'contradictory-statements' && (
          <g>
            <polygon points="155,78 108,98 155,118 202,98" fill="url(#creamIso)" stroke="#D4AF37" />
            <polygon points="108,98 108,136 155,156 155,118" fill="#D5C7A3" />
            <polygon points="202,98 202,136 155,156 155,118" fill="#B5891C" />
            <text x="155" y="101" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              25 يونيو: «مافي ولا نسبة»
            </text>

            <polygon points="285,78 238,98 285,118 332,98" fill="url(#goldTop)" stroke="#D4AF37" />
            <polygon points="238,98 238,136 285,156 285,118" fill="#B5891C" />
            <polygon points="332,98 332,136 285,156 285,118" fill="#8C6512" />
            <text x="285" y="101" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              2 يوليو: «صعب يغيروا البطاقة»
            </text>

            <text x="220" y="36" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              التناقض بين نفي المادة والامتناع عن تحديث البطاقة
            </text>
          </g>
        )}

        {/* SLIDE 13: 8 Cancelled Calls & Muscat Meeting */}
        {type === 'cancelled-calls-timeline' && (
          <g>
            {[0, 1, 2, 3].map((i) => {
              const x = 125 + i * 62;
              return (
                <g key={i}>
                  <polygon
                    points={`${x},82 ${x - 22},92 ${x},102 ${x + 22},92`}
                    fill="url(#goldTop)"
                  />
                  <polygon
                    points={`${x - 22},92 ${x - 22},138 ${x},148 ${x},102`}
                    fill="#B5891C"
                  />
                  <polygon
                    points={`${x + 22},92 ${x + 22},138 ${x},148 ${x},102`}
                    fill="#8C6512"
                  />
                </g>
              );
            })}
            <rect x="130" y="24" width="180" height="26" rx="13" fill="url(#goldGrad)" />
            <text x="220" y="41" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              8 مكالمات ملغاة · واجتماع 7 سبتمبر بمسقط
            </text>
          </g>
        )}

        {/* SLIDE 14: Layer 16% vs Broiler */}
        {type === 'layer-vs-broiler' && (
          <g>
            <polygon points="150,72 105,92 150,112 195,92" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="105,92 105,138 150,158 150,112" fill="#D5C7A3" />
            <polygon points="195,92 195,138 150,158 150,112" fill="#B5891C" />
            <text x="150" y="95" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              المُرسل: Layer 16% (بياض)
            </text>

            <polygon points="290,72 245,92 290,112 335,92" fill="url(#goldTop)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="245,92 245,138 290,158 290,112" fill="#B5891C" />
            <polygon points="335,92 335,138 290,158 290,112" fill="#8C6512" />
            <text x="290" y="95" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              الصفقة: Broiler (لاحم)
            </text>

            <text x="220" y="35" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              الذريعة الفنية الثانية (23 سبتمبر 2026): إقرار لمنتج مختلف
            </text>
          </g>
        )}

        {/* SLIDE 15: 0 Days vs 7 Days Withdrawal */}
        {type === 'withdrawal-0-vs-7' && (
          <g>
            <polygon points="150,74 105,94 150,114 195,94" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="105,94 105,138 150,158 150,114" fill="#D5C7A3" />
            <polygon points="195,94 195,138 150,158 150,114" fill="#B5891C" />
            <text x="150" y="98" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              إصرار: صفر يوم (0 Days)
            </text>

            <polygon points="290,74 245,94 290,114 335,94" fill="url(#goldTop)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="245,94 245,138 290,158 290,114" fill="#B5891C" />
            <polygon points="335,94 335,138 290,158 290,114" fill="#8C6512" />
            <text x="290" y="98" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              الاشتراط: سبعة أيام (7 Days)
            </text>

            <text x="220" y="35" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              الذريعة الفنية الثالثة: فترة السحب الإلزامية (7 أيام)
            </text>
          </g>
        )}

        {/* SLIDE 16: Constructive Refusal to Deal */}
        {type === 'constructive-refusal' && (
          <g>
            <polygon points="220,50 140,82 220,114 300,82" fill="url(#goldTop)" />
            <polygon points="140,82 140,136 220,168 220,114" fill="url(#purpleIsoLeft)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="300,82 300,136 220,168 220,114" fill="url(#purpleIsoRight)" stroke="#D4AF37" strokeWidth="1.8" />
            <text x="220" y="84" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              الرفض ليس كلمة تُقال، الرفض سلوك
            </text>
            <text x="220" y="28" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              تفنيد حجة «نحن لم نرفض البيع» (المادتان 155 و156)
            </text>
          </g>
        )}

        {/* SLIDE 17: Two Regulatory Paths */}
        {type === 'two-regulatory-paths' && (
          <g>
            <polygon points="148,74 102,94 148,114 194,94" fill="url(#goldTop)" />
            <polygon points="102,94 102,138 148,158 148,114" fill="#B5891C" />
            <polygon points="194,94 194,138 148,158 148,114" fill="#8C6512" />
            <text x="148" y="98" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              المسار 1: مطابقة + 7 أيام
            </text>

            <polygon points="292,74 246,94 292,114 338,94" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="246,94 246,138 292,158 292,114" fill="#D5C7A3" />
            <polygon points="338,94 338,138 292,158 292,114" fill="#B5891C" />
            <text x="292" y="98" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              المسار 2: شهادة خلو رسمية
            </text>

            <text x="220" y="35" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              المساران النظاميان الحاسمان (خطاب 16 أكتوبر 2026)
            </text>
          </g>
        )}

        {/* SLIDE 18: Ministry Meeting Oct 16 */}
        {type === 'ministry-meeting-oct16' && (
          <g>
            <polygon points="220,56 130,90 220,124 310,90" fill="url(#goldTop)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="130,90 130,132 220,166 220,124" fill="#B5891C" />
            <polygon points="310,90 310,132 220,166 220,124" fill="#8C6512" />
            <text x="220" y="92" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              اجتماع دائرة حماية المنافسة (16 أكتوبر 2026)
            </text>
            <text x="220" y="32" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              منح المهلة الرسمية المحددة بـ 3 أيام عمل
            </text>
          </g>
        )}

        {/* SLIDE 19: Three Officials, Three PDFs, Three Days */}
        {type === 'three-officials-silence' && (
          <g>
            {[
              { x: 140, name: 'فيصل المعشني' },
              { x: 220, name: 'أدهم البروشي' },
              { x: 300, name: 'مهند الرئيسي' },
            ].map((item, i) => (
              <g key={i}>
                <polygon
                  points={`${item.x},76 ${item.x - 34},90 ${item.x},104 ${item.x + 34},90`}
                  fill="url(#creamIso)"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
                <polygon
                  points={`${item.x - 34},90 ${item.x - 34},134 ${item.x},148 ${item.x},104`}
                  fill="#D5C7A3"
                />
                <polygon
                  points={`${item.x + 34},90 ${item.x + 34},134 ${item.x},148 ${item.x},104`}
                  fill="#B5891C"
                />
                <text x={item.x} y="93" textAnchor="middle" fill="#23153C" fontSize="8.5" fontWeight="bold">
                  {item.name}
                </text>
              </g>
            ))}
            <text x="220" y="36" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              ثلاثة مسؤولين · ثلاث رسائل PDF · ثلاثة أيام صمت رسمي
            </text>
          </g>
        )}

        {/* SLIDE 20: Written Procedure vs Silence */}
        {type === 'written-procedure-vs-silence' && (
          <g>
            <polygon points="152,74 106,94 152,114 198,94" fill="url(#creamIso)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="106,94 106,138 152,158 152,114" fill="#D5C7A3" />
            <polygon points="198,94 198,138 152,158 152,114" fill="#B5891C" />
            <text x="152" y="97" textAnchor="middle" fill="#23153C" fontSize="9.5" fontWeight="bold">
              إجراء مكتوب للتصحيح
            </text>

            <polygon points="288,74 242,94 288,114 334,94" fill="url(#purpleIsoLeft)" stroke="#D4AF37" strokeWidth="1.8" />
            <polygon points="242,94 242,138 288,158 288,114" fill="#2A174B" stroke="#D4AF37" />
            <polygon points="334,94 334,138 288,158 288,114" fill="#1B0D33" stroke="#D4AF37" />
            <text x="288" y="97" textAnchor="middle" fill="#FFF3C4" fontSize="9.5" fontWeight="bold">
              الصمت = إغلاق باب
            </text>

            <text x="220" y="35" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              الفرق بين المحاسبة المكتوبة وإغلاق الباب بالصمت
            </text>
          </g>
        )}

        {/* SLIDE 21: Documentary Evidence Vault */}
        {type === 'evidence-vault-index' && (
          <g>
            <polygon points="220,46 130,82 220,118 310,82" fill="url(#goldTop)" />
            <polygon points="130,82 130,136 220,172 220,118" fill="#B5891C" />
            <polygon points="310,82 310,136 220,172 220,118" fill="#8C6512" />
            <text x="220" y="84" textAnchor="middle" fill="#23153C" fontSize="10.5" fontWeight="bold">
              مصفوفة القرائن والمستندات الموثقة
            </text>
            <text x="220" y="100" textAnchor="middle" fill="#23153C" fontSize="9" fontWeight="bold">
              أبريل – أكتوبر 2026
            </text>
          </g>
        )}

        {/* SLIDE 22: Sovereign Conclusion */}
        {type === 'sovereign-conclusion' && (
          <g>
            <polygon points="220,44 150,76 220,108 290,76" fill="url(#goldTop)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="150,76 150,136 220,168 220,108" fill="#B5891C" />
            <polygon points="290,76 290,136 220,168 220,108" fill="#8C6512" />
            <text x="220" y="79" textAnchor="middle" fill="#23153C" fontSize="11" fontWeight="bold">
              المطابقة المستندية · صلالة 2026
            </text>
            <text x="220" y="28" textAnchor="middle" fill="#FFF3C4" fontSize="11" fontWeight="bold">
              أن تعود المياه إلى مجاريها وأن يرجع الحق إلى صاحبه
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default IsometricSlideGraphics;
