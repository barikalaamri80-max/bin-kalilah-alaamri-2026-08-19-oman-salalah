import React, { useState } from 'react';

export interface SovereignEmblemProps {
  size?: number;
  className?: string;
}

const OFFICIAL_COMPANY_LOGO_PATH =
  '/assets/aistudio/Screenshot_20260813_151701_com_lemon_lvoverseas_EditActivity_116c716b.jpg';

/**
 * الشعار الرسمي المعتمد لشركة بن كليلة العامري للتجارة والاستثمار (صلالة، سلطنة عمان)
 * يعتمد الشعار المرفق من المستخدم في إطار ذهبي نهاري هادئ دون أي خلفية داكنة
 */
export const SovereignEmblem: React.FC<SovereignEmblemProps> = ({ size = 76, className = '' }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden bg-[#FFFFFF] border border-[#DEC98A] shadow-2xs flex items-center justify-center shrink-0 select-none ${className}`}
      title="شركة بن كليلة العامري للتجارة والاستثمار — صلالة، سلطنة عمان"
    >
      {!imgError ? (
        <img
          src={OFFICIAL_COMPANY_LOGO_PATH}
          alt="شعار شركة بن كليلة العامري للتجارة والاستثمار - BIN KALILAH AL AMRI TRADE & INVESTMENT"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-contain bg-[#FFFFFF] p-0.5"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-[#FAF9F6] border border-[#DEC98A] flex flex-col items-center justify-center text-center p-1">
          <span className="text-[11px] font-bold text-[#8A6D2F] leading-tight">BK</span>
          <span className="text-[9px] font-semibold text-[#2C2A28] leading-tight">بن كليلة العامري</span>
        </div>
      )}
    </div>
  );
};

export default SovereignEmblem;
