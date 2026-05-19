"use client";
import React from "react";
import Image from "next/image";

type ServiceCardProps = {
  className?: string;
  title?: string;
  ctaText?: string;
  imageUrl?: string;
  onClick?: () => void;
};

export function ServiceCard({
  className = "",
  title = "Periodic Services",
  ctaText = "SCHEDULE NOW",
  imageUrl = "/assets/default-service.png",
  onClick
}: ServiceCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer flex flex-col gap-[16px] items-center overflow-hidden pt-[30px] relative rounded-[30px] w-full max-w-[380px] bg-pitstop-action-grey hover:bg-gradient-to-r hover:from-[#e5e5e5] hover:to-[#f7f7f7] border-2 border-transparent hover:border-[#cbcbcb] transition-all duration-300 ${className}`}
    >
      <div className="flex gap-[8px] items-start px-[30px] relative shrink-0 w-full justify-between">
        <div className="flex flex-col items-start leading-[1.5] group-hover:leading-[normal] min-w-px relative">
          <p className="font-normal rtl:font-cairo ltr:font-host font-host capitalize group-hover:font-semibold group-hover:uppercase relative shrink-0 text-[28px] text-pitstop-oil-black transition-all">
            {title}
          </p>
          <p className="font-bold rtl:font-cairo ltr:font-host font-host relative shrink-0 text-pitstop-burnt-red text-[12px] group-hover:tracking-[0.96px] uppercase transition-all">
            {ctaText}
          </p>
        </div>
        
        {/* Arrow Icon placeholder - ideally loaded via SVG/Image */}
        <div className="relative shrink-0 size-[16px] mt-2 group-hover:translate-x-1 transition-transform">
           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.1983 3.86469L9.13824 4.92484L12.4633 8.24991H0V9.75003H12.4633L9.13824 13.0751L10.1983 14.1352L15.3335 8.99997L10.1983 3.86469Z" fill="#C00034"/>
           </svg>
        </div>
      </div>
      
      <div className="flex flex-col items-start relative shrink-0 w-full h-[153px] mt-auto">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* We use object-contain or cover based on layout. For now cover with offset. */}
          <div className="relative w-full h-full transform translate-x-1/4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
             <Image src={imageUrl} alt={title} fill className="object-contain object-right-bottom" />
          </div>
        </div>
      </div>
    </div>
  );
}
