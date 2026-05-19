"use client"

import { useState } from "react"
import Image from "next/image"
import CarSelectionTesla from "./CarSelectionTesla"
import type { HomeTesla } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import ImageComp from "../CustomImage"
import { Button } from "@/app/components/ui/Button"

interface TeslaCarData {
  countryCode: string
  phoneNumber: string
  model: string
  year: string
  plateNumber: string
  appointment?: {
    location: string
    date: string
    time: string
  }
  personalInfo?: {
    fullName: string
    email: string
    consentToComms: boolean
  }
}

type HomeTeslaProps = {
  block: HomeTesla
  index: number
  className?: string
}

export default function HomeTeslaComp({ block, index, className = "" }: HomeTeslaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSubmit = (data: TeslaCarData) => {
    console.log("Tesla car selection data:", data)
    setIsModalOpen(false)
  }

  const isLeftAlign = block?.imageAlign === 'left';

  return (
    <>
      <CarSelectionTesla isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} block={block} />
      
      <div className={`${block?.marginBottom ? 'mb-16 lg:mb-20' : ''} dark:bg-black bg-white w-full overflow-hidden relative ${className}`}>
        
        {/* ========================================================
            DESKTOP BLEED BACKGROUNDS
            Formula: 50vw - (gutter / 2)
            1920px: 50vw - 20px
            1440px: 50vw - 12px
            ======================================================== */}
        <div className={`hidden lg:block absolute top-0 bottom-0 ${isLeftAlign ? 'ltr:right-0 rtl:left-0 ltr:rounded-l-[60px] rtl:rounded-r-[60px]' : 'ltr:left-0 rtl:right-0 ltr:rounded-r-[60px] rtl:rounded-l-[60px]'} w-[calc(50vw-20px)] 3xl:w-[calc(50vw-30px)] bg-[#FAFAFA] dark:bg-[#0A0A0A] z-0 transition-colors`} />
        
        <div className={`hidden lg:block absolute top-0 bottom-0 ${isLeftAlign ? 'ltr:left-0 rtl:right-0 ltr:rounded-r-[60px] rtl:rounded-l-[60px]' : 'ltr:right-0 rtl:left-0 ltr:rounded-l-[60px] rtl:rounded-r-[60px]'} w-[calc(50vw-20px)] 3xl:w-[calc(50vw-30px)] z-0 overflow-hidden`}>
          {block.leftImage?.image?.asset && (
            <Image
              src={urlForImage(block.leftImage.image)?.url() || ""}
              alt={block.leftImage.altText || "Tesla vehicle"}
              fill
              className="object-cover object-center"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        </div>

        {/* ========================================================
            PIXEL-PERFECT CSS GRID CONTAINER
            1920px screen -> 1640px container, 40px gap
            1440px screen -> 1280px container, 24px gap
            ======================================================== */}
        <div className="container-grid mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-y-0 lg:gap-x-[24px] 3xl:gap-x-[40px] relative z-10 px-0 lg:px-0">
          
          {/* Mobile Image (Hidden on Desktop) */}
          <div className="lg:hidden relative h-[500px] w-full rounded-t-[40px] overflow-hidden order-1">
            {block.leftImage?.image?.asset && (
              <Image
                src={urlForImage(block.leftImage.image)?.url() || ""}
                alt={block.leftImage.altText || "Tesla vehicle"}
                fill
                className="object-cover object-center"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Content Aligned to Grid (Col 1-5 or Col 8-12) */}
          {/* 5 columns width = 660px at 1920px, ~519px at 1440px */}
          <div className={`col-span-1 mobileContentTxt lg:col-span-5 flex flex-col justify-center py-12 lg:py-[100px] 3xl:py-[162px] order-2 ${
            isLeftAlign ? 'lg:col-start-8' : 'lg:col-start-1'
          } bg-[#FAFAFA] dark:bg-[#0A0A0A] lg:bg-transparent rounded-b-[40px] lg:rounded-none px-8 lg:px-0 -mt-16 lg:mt-0 relative z-20 shadow-xl lg:shadow-none mx-0 lg:mx-0`}>
            
            <div className="flex flex-col items-start gap-[40px] w-full">
              {/* Top Logo */}
              {block.aboutTesla?.topLogo?.image?.asset && (
              <div className="relative h-[80px] lg:h-[117px] w-[90px] overflow-hidden">
                  <Image
                    src={urlForImage(block.aboutTesla.topLogo.image)?.url() || ""}
                    alt={block.aboutTesla.topLogo.altText || "Logo"}
                    fill
                    className="object-contain object-left"
                  />
              </div>
              )}

              {/* Text Content */}
              <div className="flex flex-col gap-[24px] w-full">
                <div className="flex flex-col leading-[1.1]">
                  {block.aboutTesla?.heading && (
                    <h2 className="text-pitstop-fiery-orange font-extrabold rtl:font-cairo ltr:font-host font-host uppercase tracking-tight">
                      {block.aboutTesla.heading}
                    </h2>
                  )}
                  {block.aboutTesla?.subHeading && (
                    <div className="text-pitstop-oil-black dark:text-white h1 font-extrabold rtl:font-cairo ltr:font-host font-host">
                      {block.aboutTesla.subHeading}
                    </div>
                  )}
                </div>

                {block.aboutTesla?.decription && (
                  <p className="text-pitstop-oil-black dark:text-white opacity-90 text-[18px] lg:text-[22px] leading-[1.5] font-normal rtl:font-cairo ltr:font-host font-host">
                    {block.aboutTesla.decription}
                  </p>
                )}
              </div>

              {/* Booking Button */}
              {block.aboutTesla?.button?.buttonText && (
                <div className="mt-4 w-full sm:w-auto">
                  <Button 
                    variant="orange" 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto px-[40px] py-[16px] rounded-[12px] uppercase tracking-wide"
                  >
                    {block.aboutTesla.button.buttonText}
                  </Button>
                </div>
              )}

              {/* Bottom section - Bottom Logo */}
              {block.aboutTesla?.BottomLogo?.altText && (
                <div className="mt-8 lg:mt-4">
                  <ImageComp
                    block={block.aboutTesla.BottomLogo}
                    imageClassName="object-contain object-left w-auto h-[70px] image-grey-to-white"
                    width={390}
                    height={70}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
