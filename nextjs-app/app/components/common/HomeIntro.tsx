import type { HomeIntro } from "@/sanity.types"
import Image from "next/image"
import ImageComp from "../CustomImage"
import PortableText from "@/app/components/PortableText"
import type { PortableTextBlock } from "next-sanity"
import { urlForImage } from "@/sanity/lib/utils"

type HomeIntroProps = {
  block: HomeIntro
  index: number
  className?: string
}

export default function HomeIntroComp({ block, index, className = "" }: HomeIntroProps) {
  return (
    <div className={`w-full dark:bg-black bg-[#F7F7F7] dark:text-white text-black ${className}`}>
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 relative">
        {/* Left side - Heading */}
        <div className="col-span-2 w-full flex flex-col justify-center md:items-center md:px-0 px-5">
          {block.heading && (
            <h2 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[70px] 2xl:text-[80px] text-[#FAEADC] font-shoulders font-light tracking-tight">
              {block.heading}
            </h2>
          )}
          {block.subheading && (
            <h3 className="text-[30px] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[90px] 2xl:text-[100px] font-shoulders md:font-normal font-bold tracking-tight text-[#C00034] mt-2 md:mb-0 mb-10">
              {block.subheading}
            </h3>
          )}
        </div>

        {/* Right side - Car image */}
        <div className="hidden md:block col-span-1 h-auto sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] relative overflow-hidden">
          {block.leftBottomImage?.altText ? (
            <ImageComp
              block={block.leftBottomImage}
              imageClassName="object-cover object-center h-full w-full"
              width={1097}
              height={990}
            />
          ) : (
            <div className="w-full h-full bg-gray-900"></div>
          )}
        </div>
      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Left side - Car image */}
        <div className="relative col-span-1 md:col-span-2 h-auto sm:h-[350px] md:h-[400px] lg:h-[450px] xl:h-[500px] overflow-hidden">

          {block?.rihgtTopImage?.altText && (
            <ImageComp
              block={block?.rihgtTopImage}
              imageClassName="object-cover object-center"
              width={1050}
              height={500}
            />
          )}
        </div>

        {/* Right side - Text content */}
        <div className="col-span-1 flex items-center p-6 sm:p-8 md:p-10 lg:p-16 xl:p-24">
          <div className="max-w-md mx-auto md:mx-0">
            {block?.introText?.length ? (
              <PortableText
                className="text-base sm:text-lg font-urbanist text-[#FAEADC] font-normal sm:leading-[1.2]"
                value={block.introText as PortableTextBlock[]}
              />
            ) : (
              <p className="text-base sm:text-[16px] font-urbanist text-[#FAEADC] font-normal leading-[1.2]">
                Experience luxury automotive care like never before.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
