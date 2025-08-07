import React, { useEffect } from 'react';

interface AdSlotProps {
  id: string;
  width: number;
  height: number;
  isResponsive?: boolean;
}

const AdSlot: React.FC<AdSlotProps> = ({ id, width, height, isResponsive = false }) => {
  const adClient = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const adSlot = import.meta.env.VITE_ADSENSE_SLOT_ID;

  useEffect(() => {
    // Only run push if AdSense variables are set
    if (adClient && adSlot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e: unknown) {
        console.error("AdSense error:", e);
      }
    }
  }, [id, adClient, adSlot]);

  const responsiveStyles = isResponsive ? 'w-full max-w-[728px] h-[90px] md:w-[728px]' : '';
  
  // Don't render the ad slot if the IDs are not configured
  if (!adClient || !adSlot) {
    return (
      <div className="flex justify-center items-center my-4">
        <div className={`flex justify-center items-center bg-gray-200 text-gray-500 text-xs ${responsiveStyles}`} style={{ width: `${width}px`, height: `${height}px` }}>
            Ad Placeholder
        </div>
      </div>
    );
  }

  return (
    <div key={id} className="flex justify-center items-center my-4">
      <div className="text-xs text-gray-400">Advertisement</div>
      <ins className={`adsbygoogle bg-gray-200 ${responsiveStyles}`}
           style={{ display: 'inline-block', width: `${width}px`, height: `${height}px` }}
           data-ad-client={adClient}
           data-ad-slot={adSlot}></ins>
      <div className="text-xs text-gray-400">Advertisement</div>
    </div>
  );
};

export default AdSlot;