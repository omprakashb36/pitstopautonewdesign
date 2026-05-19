"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { HomeWorkFlow } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils";

type HowWeDoItProps = {
  block: HomeWorkFlow;
  index: number;
}

export default function HowWeDoIt({ block }: HowWeDoItProps) {
  const [activeStep, setActiveStep] = useState(block?.workFlow?.[0]?._key || "");

  // Auto-select the first item if not set, or if block data loads late
  useEffect(() => {
    if (!activeStep && block?.workFlow?.[0]?._key) {
      setActiveStep(block.workFlow[0]._key);
    }
  }, [block, activeStep]);

  return (
    <div className="w-full bg-[#FAFAFA] dark:bg-black py-12 lg:py-[120px] relative overflow-hidden">
      {/* ========================================================
          PIXEL-PERFECT CSS GRID CONTAINER
          1920px screen -> 1640px container, 40px gap
          1440px screen -> 1280px container, 24px gap
          ======================================================== */}
      <div className="container-grid mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-[40px] lg:gap-x-[24px] 3xl:gap-x-[40px] px-6 lg:px-0">
        
        {/* Left side - Image (6 cols) */}
        <div className="col-span-1 lg:col-span-6 relative h-[400px] lg:h-[600px] 3xl:h-[800px] rounded-[40px] lg:rounded-[60px] overflow-hidden">
          {block?.image?.image && (
            <Image
              src={urlForImage(block?.image?.image)?.url() || ""}
              alt="Work process"
              fill
              className="object-cover object-center absolute inset-0 w-full h-full"
            />
          )}
        </div>

        {/* Right side - Content (6 cols) */}
        {/* Using lg:pl-[24px] 3xl:pl-[40px] inside the 6 col to achieve the 760px content width matching Figma's 80px visual gap */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center lg:pl-[24px] 3xl:pl-[40px]">
          <div className="flex flex-col gap-[40px] lg:gap-[60px] w-full">
            
            {block?.heading && (
              <div className="text-[50px] lg:text-[60px] 2xl:text-[80px] 3xl:text-[120px] font-extrabold rtl:font-cairo ltr:font-host font-host uppercase text-pitstop-fiery-orange leading-[0.9] tracking-tight whitespace-pre-wrap">
                {block.heading}<br/><span className="text-pitstop-oil-black dark:text-white">{block.subHeading}</span>
              </div>
            )}

            <div className="flex flex-col w-full">
              {block?.workFlow?.map((work, idx) => {
                const isActive = activeStep === work?._key;
                return (
                  <div key={work?._key} className="flex flex-col w-full">
                    <div 
                      className={`flex flex-col lg:flex-row items-start lg:justify-between w-full cursor-pointer group py-[20px] lg:py-[30px] transition-all`}
                      onClick={() => setActiveStep(work?._key)}
                    >
                      <h2 className={`font-extrabold min-w-[200px] uppercase transition-colors rtl:font-cairo ltr:font-host font-host leading-[1.1] ${isActive ? 'text-pitstop-fiery-orange' : 'text-pitstop-oil-black dark:text-white opacity-60 group-hover:opacity-80'}`}>
                        {work?.workName}
                      </h2>
                      <p className={`mt-2 lg:mt-0 font-normal text-[16px] 3xl:text-[18px] lg:w-[380px] leading-[1.5] transition-opacity duration-300 rtl:font-cairo ltr:font-host font-host ${isActive ? 'text-pitstop-oil-black dark:text-white' : 'text-pitstop-oil-black dark:text-white opacity-60 group-hover:opacity-80'}`}>
                        {work?.workDesc}
                      </p>
                    </div>
                    {/* Divider line, omitted on the last item */}
                    {idx !== (block.workFlow?.length || 0) - 1 && (
                      <div className="w-full border-b border-[#D9D9D9] dark:border-white/20"></div>
                    )}
                  </div>
                )
              })}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
