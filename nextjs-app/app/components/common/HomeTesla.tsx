"use client"

import { useState } from "react"
import Image from "next/image"
import CarSelectionTesla from "./CarSelectionTesla"
import type { HomeTesla } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils"
import { Squircle } from "corner-smoothing"
import ImageComp from "../CustomImage"

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
    // Process the data as needed
    setIsModalOpen(false)
  }

  return (
    <>
      <CarSelectionTesla isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} block={block} />
      <div className={`${block?.marginBottom === true ? 'lg:mb-24 mb-12' : ''} dark:bg-black homeTeslaLucid bg-[#FFFFFF] w-full overflow-hidden ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[33px]">
          {/* Left side - Tesla Image (full height) */}
          <div className={`${block?.imageAlign === 'left' ? 'lg:order-1' : 'lg:order-2 borderRImg'} relative md:h-[50vh] lg:h-[675px] min-h-[400px] overflow-hidden`}>
            {block.leftImage?.image?.asset && (
              <Image
                src={urlForImage(block.leftImage.image)?.url() || ""}
                alt={block.leftImage.altText || "Tesla vehicle"}
                fill
                className="object-cover object-center ltr:md:rounded-tr-[50px] ltr:md:rounded-br-[50px] rtl:md:rounded-tl-[50px] md:rounded-tl-[0px] rounded-tl-[40px] rounded-tr-[40px] rtl:md:rounded-bl-[30px]"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
          </div>

          {/* Right side - Content and image */}
          <div className={`${block?.imageAlign === 'left' ? 'lg:order-2' : 'lg:order-1 borderR'} flex flex-col relative homeTeslaContent md:top-0 top-[-65px]`}>
            <div className="teslaContent px-6 flex items-center justify-center flex-col md:px-5 dark:md:bg-[#0A0A0A] bg-[#F7F7F7]">
            {/* Top section - Logo */}
            <div className="absolute mhidden teslaLogo md:ltr:right-[50px] md:rtl:left-[50px] top-8 sm:top-[50px] z-10">
              {block.aboutTesla?.topLogo?.image?.asset && (
                <Image
                  src={urlForImage(block.aboutTesla.topLogo.image)?.url() || ""}
                  alt={block.aboutTesla.topLogo.altText || "Pitstop logo"}
                  width={100}
                  height={105}
                  className="w-auto h-[80px] md:h-[98px] object-contain"
                />
              )}
            </div>

            {/* Middle section - Text content */}
            <div className="flex-grow-content lg:max-w-[550px]">
              {block.aboutTesla?.heading && (
                <h2 className="text-[#C00034] text-2xl sm:text-[3xl] md:text-[50px] font-semibold md:leading-[1] font-shoulders tracking-tight uppercase">
                  {block.aboutTesla.heading}
                </h2>
              )}

              {block.aboutTesla?.subHeading && (
                <h3 className="dark:text-white text-black text-3xl sm:text-4xl md:text-[50px] font-shoulders md:leading-[60px] font-bold tracking-tight uppercase">
                  {block.aboutTesla.subHeading}
                </h3>
              )}

              {block.aboutTesla?.decription && (
                <p className="dark:text-[#FAEADC] text-black opacity-80 mt-4 md:mt-[20px] font-urbanist text-base md:text-[18px]">
                  {block.aboutTesla.decription}
                </p>
              )}

              {block.aboutTesla?.button?.buttonText && (
                <Squircle cornerRadius={10} className="mt-6 md:mt-[50px] md:inline-block">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-block gradientBG text-center text-[#FAEADC] w-full sm:max-w-[380px] px-6 py-3 font-urbanist font-bold rounded-lg hover:bg-rose-800 transition-colors text-sm tracking-wide"
                  >
                    {block.aboutTesla.button.buttonText}
                  </button>
                </Squircle>
              )}
              {/* Bottom section - Bottom Logo */}
            <div className="mt-8 md:mt-[74px]">
              {block.aboutTesla?.BottomLogo?.altText && (
                <ImageComp
                  block={block.aboutTesla.BottomLogo}
                  imageClassName="object-contain w-auto h-[70px] image-grey-to-white"
                  width={390}
                  height={70}
                />
              )}
            </div>
            </div>

            
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
