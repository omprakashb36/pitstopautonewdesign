"use client"

import { HomeFleet } from "@/sanity.types"
import ImageComp from "../CustomImage"
import { Button } from "@/app/components/ui/Button"
import useDeviceDetection from "../../hooks/useDeviceDetection"

type HomeFleetProps = {
  block: HomeFleet
  index: number
}

export default function HomeFleetComp({ block }: HomeFleetProps) {
  const isImageLeft = block.imageAlign === "left"
  const { currentLocale } = useDeviceDetection()

  return (
    <div className="w-full relative overflow-hidden bg-white dark:bg-black pb-16 lg:pb-20">
      {/* ========================================================
          PIXEL-PERFECT CSS GRID CONTAINER
          1920px screen -> 1640px container, 40px gap
          1440px screen -> 1280px container, 24px gap
          ======================================================== */}
      <div className="container-grid mGridPadd0 mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-[32px] lg:gap-x-[24px] 3xl:gap-x-[40px] px-0 lg:px-0">
        
        {/* Content Box */}
        {/* Mobile: order-2 (bottom). Desktop: order depends on isImageLeft */}
        <div className={`col-span-1 hFleetTxt lg:col-span-6 flex flex-col justify-center p-8 lg:p-[40px] 2xl:p-[80px] 3xl:p-[120px] bg-[#FAFAFA] dark:bg-[#0A0A0A] rounded-[40px] lg:rounded-[60px] order-2 ${isImageLeft ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="flex flex-col items-start gap-[40px] w-full">
            {/* Top Logo */}
            {block.aboutFleet?.topLogo?.altText && (
              <div className="relative h-[50px] lg:h-[71px] w-[150px] lg:w-[212px]">
                <ImageComp
                  block={block.aboutFleet.topLogo}
                  imageClassName="object-contain object-left w-full h-full aboutFleetLogo"
                  width={212}
                  height={71}
                />
              </div>
            )}

            {/* Text Content */}
            <div className="flex flex-col gap-[24px] w-full">
              <div className="flex flex-col">
                {block.aboutFleet?.heading && (
                  <div className="text-pitstop-oil-black h1 dark:text-white font-extrabold rtl:font-cairo ltr:font-host font-host leading-[1.1] tracking-tight">
                    {block.aboutFleet.heading} <span className="text-pitstop-fiery-orange">{block.aboutFleet.subHeading}</span>
                  </div>
                )}
              </div>

              {block.aboutFleet?.decription && (
                <p className="text-pitstop-oil-black dark:text-white opacity-90 text-[18px] lg:text-[22px] leading-[1.5] font-normal rtl:font-cairo ltr:font-host font-host">
                  {block.aboutFleet.decription}
                </p>
              )}
            </div>

            {/* CTA Button */}
            {block.aboutFleet?.button && (
              <div className="w-full sm:w-auto">
                <Button
                  variant="orange"
                  href={`/${currentLocale}/${(block?.aboutFleet?.buttonLink as any)?.slug?.replace(/^ar\//, "") || ""}`}
                  className="w-full sm:w-auto tracking-wide"
                >
                  {block.aboutFleet.button}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Image Box */}
        {/* Mobile: order-1 (top). Desktop: order depends on isImageLeft */}
        <div className={`col-span-1 lg:col-span-6 relative h-[400px] lg:h-auto lg:min-h-[788px] w-full rounded-[40px] lg:rounded-[60px] overflow-hidden order-1 ${isImageLeft ? 'lg:order-1' : 'lg:order-2'}`}>
          {block.RightImage?.altText && (
            <ImageComp
              block={block.RightImage}
              imageClassName="object-cover object-center absolute inset-0 w-full h-full"
              width={800}
              height={788}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  )
}
