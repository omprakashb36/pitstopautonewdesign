"use client";
import CarSelectorModal from "./CarSelectorModal"
import { useState, useEffect } from "react"
import { HomeCta } from "@/sanity.types";
import { Squircle } from "corner-smoothing"
import ImageComp from "../CustomImage";
import useDeviceDetection from "../../hooks/useDeviceDetection"
import { getSiteSettingData } from "@/app/actions/common/sanityData";
import { SettingsQueryResult } from "@/sanity.types";


type HomeCtaProps = {
  block: HomeCta
  index: number
}

const isMobile = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsMobileDevice(e.matches);
    
    // Initial check
    setIsMobileDevice(mql.matches);

    // Modern listener
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return { isMobileDevice };
};

export default function HomeCtaComp({ block }: HomeCtaProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { currentLocale } = useDeviceDetection()
  const { isMobileDevice } = isMobile()
  const [siteSettings, setSiteSettings] = useState<SettingsQueryResult>();


  // site settings
  useEffect(() => {
    async function siteSettings() {
      try {
        const data: SettingsQueryResult = await getSiteSettingData({ locale: currentLocale })
        setSiteSettings(data);
        /*console.log("site settign daata home slider", siteSettings);*/
      }
      catch (error) {
        console.log("no site setting data found", error)
      }
    }
    siteSettings();
  }, [currentLocale]);

  return (
    <>
      {siteSettings &&
        <CarSelectorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} siteSettingData={siteSettings} />
      }
      <div className="w-full md:mb-[100px] mb-8 carCta dark:bg-[#141414] bg-[#ECECEC]">
        <div className="relative w-full h-auto md:h-auto min-h-[315px] lg:h-[315px] overflow-hidden">

          {/* Car image positioned on the left */}
          {!isMobileDevice &&
            <div className="md:absolute ltr:left-0 rtl:right-0 bottom-0 2xl:h-[120%] xl:h-[110%] md:h-full w-[65%] md:w-[30%] z-0">
              {block.leftImage?.altText && (
                <ImageComp
                  block={block.leftImage}
                  imageClassName="object-contain h-[100%] object-left-bottom rtl:scale-x-[-1]"
                  width={608}
                  height={400}
                />
              )}
            </div>
          }
          {isMobileDevice &&
            <div className="mt-3">
              {block.mobileLeftImage?.altText && (
                <ImageComp
                  block={block.mobileLeftImage}
                  imageClassName="object-cover w-full"
                  width={608}
                  height={400}
                />
              )}
            </div>
          }

          {/* Content container with right padding */}
          <div className="relative mobileCTA h-full md:flex items-center justify-between z-20 px-4 ltr:sm:pr-6 ltr:md:pr-8 ltr:lg:pr-12 ltr:xl:pr-24 ltr:2xl:pr-[97px] rtl:sm:pl-6 rtl:md:pl-8 rtl:lg:pl-12 rtl:xl:pl-24 rtl:2xl:pl-24">
            {/* Text content */}
            <div className=" lg:ltr:ml-[30%] pb-7 xl:pb-0 lg:rtl:mr-[30%] md:ltr:ml-[2%] md:rtl:mr-[2%]">
              <h3 className="text-xl md:text-3xl xl:text-[49.8px] font-shoulders text-black dark:text-[#e6d9c0]">
                {block.heading}
              </h3>
              <h2 className="text-[30px] md:text-4xl xl:text-[66px] xl:leading-[1.2] font-shoulders font-bold text-[#C00034] mt-2">
                {block.subHeading}
              </h2>
            </div>

            {/* CTA Button */}
            <Squircle cornerRadius={10} className="w-full md:w-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className="md:inline-block block md:w-auto w-full px-[26px] py-[13px] gradientBG text-[#e6d9c0] font-urbanist font-bold rounded-md hover:bg-rose-800 transition-colors text-sm tracking-wide whitespace-nowrap  md:mt-0 mt-5"
              >
                {block.ButtonUrl?.buttonText}
              </button>
            </Squircle>
          </div>
        </div>
      </div>
    </>
  )
}

