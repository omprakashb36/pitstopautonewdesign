"use client"

import { useState } from "react"
import Image from "next/image"
import { HomeWorkFlow } from "@/sanity.types"
import { urlForImage } from "@/sanity/lib/utils";


type HowWeDoItProps = {
  block: HomeWorkFlow;
  index: number;
}


export default function HowWeDoIt({ block }: HowWeDoItProps) {
  const [activeStep, setActiveStep] = useState(block?.workFlow?.[0]?._key || "");

  return (
    <div className="w-full howWeDoIt dark:bg-black bg-white md:py-[100px] md:mt-[20px] mt:0 py-[60px] px-0 sm:px-6 md:px-8 xl:px-[60px] 3xl:px-[116px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Left side - Image */}
        <div className="relative h-[400px] md:h-[500px] lg:h-[666px] rounded-[50px] overflow-hidden">
          <Image
            src={urlForImage(block?.image?.image)?.url() || ""}
            alt="Car detailing process"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Right side - Content */}
        <div className="flex flex-col justify-center md:p-0 mx-5">
          <h2 className="text-4xl md:text-5xl lg:text-[50px] uppercase font-shoulders font-semibold opacity-80 dark:text-[#FAEADC] text-black md:mb-16 mb-5">{block?.heading}</h2>
          <div className="md:space-y-12 space-y-8">
            {block?.workFlow?.map((work) => (
              <div
                key={work?._key}
                className="flex flex-col md:flex-row gap-6 md:gap-10"
                onClick={() => setActiveStep(work?._key)}
              >
                <h3
                  className={`text-3xl md:text-[45px] font-shoulders w-40 cursor-pointer transition-colors ${activeStep === work?._key ? "dark:text-[#e6d9c0] text-black" : "text-gray-600 hover:text-gray-400"
                    }`}
                >
                  {work?.workName}
                </h3>
                <p
                  className={`font-urbanist text-[15px] max-w-md transition-opacity duration-300 ${activeStep === work?._key ? "dark:text-[#e6d9c0] text-black" : "text-gray-500 opacity-50"
                    }`}
                >
                  {work?.workDesc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
