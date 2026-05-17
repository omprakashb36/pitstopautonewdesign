"use client"

import { HomeFleet } from "@/sanity.types"
import ImageComp from "../CustomImage"
import Link from "next/link"
import { Squircle } from "corner-smoothing"
import useDeviceDetection from "../../hooks/useDeviceDetection"

type HomeFleetProps = {
  block: HomeFleet
  index: number
}

export default function HomeFleetComp({ block }: HomeFleetProps) {
  const isImageLeft = block.imageAlign === "left"
  const { currentLocale } = useDeviceDetection()

  return (
    <div className="w-full hFleetOtr xl:px-[60px] 3xl:px-[116px] md:mt-[100px] mt-5">
      <div className="md:grid md:grid-cols-1 lg:grid-cols-2 gap-8 rounded-3xl overflow-hidden hFleet">
        {/* Content always first */}
        <div className={`hFleetContent flex flex-col ${isImageLeft ? "lg:order-2" : "lg:order-1"}`}>
          <div className="hFleetContentInner flex items-center justify-center flex-col dark:bg-[#0A0A0A] bg-[#F7F7F7]">
            <div className="xl:max-w-[430px] px-5">
              {/* Logo */}
              
                {block.aboutFleet?.topLogo?.altText && (
                  <div className="md:mb-12 mb-5">
                  <ImageComp
                    block={block.aboutFleet.topLogo}
                    imageClassName="w-auto aboutFleetLogo"
                    width={100}
                    height={105}
                  />
                  </div>
                )}
              

              {/* Headings */}
              <div className="md:mb-3 mb-4">
                <h2 className="text-3xl uppercase md:text-[50px] leading-[1] font-shoulders font-semibold tracking-tight dark:text-[#FAEADC] text-black">
                  {block.aboutFleet?.heading}
                </h2>
                <h3 className="text-3xl uppercase text-[#FAEADC] md:text-[50px] mt-2 font-shoulders font-semibold tracking-tight">
                  <span className="text-[#C00034] text-3xl md:text-[50px] leading-[1] font-semibold">{block.aboutFleet?.subHeading}</span>
                </h3>
              </div>

              {/* Description */}
              <div className="md:mb-[50px] mt-5 mb-4">
                <p className="dark:text-[#FAEADC] text-black opacity-80 mt-4 md:mt-[20px] font-urbanist text-base md:text-[18px]">
                  {block.aboutFleet?.decription}
                </p>
              </div>

              {/* CTA Button */}
              <div className="">
                <Squircle className="md:w-auto w-full" cornerRadius={10}>
                  <Link
                    href={`/${currentLocale}/${(block?.aboutFleet?.buttonLink as any)?.slug?.replace(/^ar\//, "") || ""}`}
                    className="md:inline-block block px-[26px] py-[13px] gradientBG text-[#FAEADC] font-urbanist font-bold rounded-md hover:bg-rose-800 transition-colors text-sm tracking-wide uppercase"
                  >
                    {block.aboutFleet?.button}
                  </Link>
                </Squircle>
              </div>
            </div>
          </div>
        </div>

        {/* Image second always on mobile; on desktop adjusts via flex direction */}
        <div
          className={`relative h-auto lg:h-auto md:rounded-3xl rounded-tl-[40px] rounded-tr-[40px] overflow-hidden ${isImageLeft ? "lg:order-1" : "lg:order-2"}`}
        >
          {block.RightImage?.altText && (
            <ImageComp
              block={block.RightImage}
              imageClassName="object-cover object-center md:h-[666px] h-[350px] w-full"
              width={684}
              height={531}
            />
          )}
        </div>
      </div>
    </div>
  )
}
